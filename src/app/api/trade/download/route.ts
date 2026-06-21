import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = user.app_metadata?.organization_id;
    if (!organizationId) {
      return NextResponse.json({ error: 'User is not linked to an organization' }, { status: 403 });
    }

    // 2. Ironclad Async Credit Validation Interceptor
    const { data: wallet, error: walletError } = await supabase
      .from('credit_wallet_balance')
      .select('wallet_credits')
      .eq('organization_id', organizationId)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 500 });
    }

    if (wallet.wallet_credits <= 0) {
      // Return strict HTTP 402 Payment Required to halt client execution
      return NextResponse.json({ 
        error: 'Payment Required', 
        message: 'Compliance Balance Exhausted' 
      }, { status: 402 });
    }

    // 3. Execution resumes: Decrement a credit for the download compilation
    const { error: updateError } = await supabase
      .from('credit_wallet_balance')
      .update({ wallet_credits: wallet.wallet_credits - 1 })
      .eq('organization_id', organizationId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to deduct credit' }, { status: 500 });
    }

    // Parse the payload requested for download
    const body = await request.json();
    const jsonString = JSON.stringify(body, null, 2);

    // 4. Decoupled Archival (WORM Storage)
    const fileName = `${organizationId}/${new Date().toISOString().replace(/[:.]/g, '-')}-schema.json`;
    
    const { error: storageError } = await supabase.storage
      .from('compliance_vault')
      .upload(fileName, jsonString, {
        contentType: 'application/json',
        upsert: false // WORM property: Strict No Overwrite
      });
      
    if (storageError) {
      console.error("Archival Failed:", storageError);
      // We must fail the download if the vault commit fails to ensure compliance
      return NextResponse.json({ error: 'Compliance Archival Failed' }, { status: 500 });
    }

    // In a real app we might write the file and return a stream. For now, return the JSON string.
    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="schema_compiled.json"'
      }
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
