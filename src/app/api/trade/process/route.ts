import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { processIngestionTask } from '@/workers/ingestionWorker';

import { after } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Since we map app_metadata.organization_id in the auth JWT
    const organizationId = user.app_metadata?.organization_id;
    if (!organizationId) {
      return NextResponse.json({ error: 'User is not linked to an organization' }, { status: 403 });
    }

    // 2. Extract JWT token for the background worker to use
    // The easiest way is to extract it from the authorization header if present, or we can get the session.
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      return NextResponse.json({ error: 'No active access token' }, { status: 401 });
    }

    // 3. Wallet Check
    const { data: wallet, error: walletError } = await supabase
      .from('credit_wallet_balance')
      .select('wallet_credits')
      .eq('organization_id', organizationId)
      .single();

    if (walletError || !wallet || wallet.wallet_credits <= 0) {
      return NextResponse.json({ error: 'Insufficient compliance credits' }, { status: 402 });
    }

    // 4. Parse incoming form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const streamType = formData.get('stream_type') as string;

    if (!file || !streamType) {
      return NextResponse.json({ error: 'Missing file or stream_type parameter' }, { status: 400 });
    }

    // Mock file upload to Supabase storage (Phase 2 placeholder)
    const rawDocumentUrl = `https://storage.mock/documents/${Date.now()}_${file.name}`;

    // Read file into base64 for Gemini
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileBase64 = buffer.toString('base64');
    const mimeType = file.type;

    // 5. Initial Ledger Entry (PARSING)
    const { data: transaction, error: insertError } = await supabase
      .from('trade_transactions_ledger')
      .insert({
        organization_id: organizationId,
        stream_type: streamType,
        status: 'PARSING',
        raw_document_url: rawDocumentUrl
      })
      .select('id')
      .single();

    if (insertError || !transaction) {
      return NextResponse.json({ error: `Database insert failed: ${insertError?.message}` }, { status: 500 });
    }

    // 6. Background Handoff (Decoupled Compute)
    after(() => {
      // This runs completely independently of the HTTP response lifecycle
      processIngestionTask(
        transaction.id, 
        organizationId,
        streamType, 
        fileBase64, 
        mimeType, 
        accessToken
      );
    });

    // 7. Instant Response
    return NextResponse.json({ 
        message: 'Document accepted for asynchronous compliance processing.',
        transaction_id: transaction.id,
        status: 'PARSING'
    }, { status: 202 });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
