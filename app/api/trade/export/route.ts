import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized export request' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('id');
    const profileId = user.id;

    if (!transactionId) {
      return NextResponse.json({ error: 'Missing transaction coordinates' }, { status: 400 });
    }

    // Step 1: Fetch compiled ledger data
    const { data: txn, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('profile_id', profileId)
      .single();

    if (fetchError || !txn) {
      return NextResponse.json({ error: 'Transaction validation trace lost' }, { status: 404 });
    }

    if (txn.status !== 'READY_FOR_REVIEW' && txn.status !== 'COMPILED' && txn.status !== 'SCHEMA_COMPILED') {
      return NextResponse.json({ error: 'Payload not yet fully verified for export' }, { status: 403 });
    }

    // Step 2: Push to Compliance Vault
    const { error: vaultError } = await supabase
      .from('compliance_vault')
      .upsert({
        profile_id: txn.profile_id,
        transaction_id: txn.id,
        flow_type: txn.flow_type,
        government_payload_snapshot: txn.compiled_government_payload,
        sealed_at: new Date().toISOString()
      }, { onConflict: 'transaction_id' });

    if (vaultError) {
      console.error('Vault error:', vaultError);
    }



    // Step 4: Advance Row State
    await supabase
      .from('transactions')
      .update({ status: 'COMPILED', updated_at: new Date().toISOString() })
      .eq('id', txn.id);

    // Step 5: Backend JSON Serialization (CACHE01 schema reconstruction)
    // Here we ensure it's a flat string structure matching target layout
    const jsonString = JSON.stringify(txn.compiled_government_payload, null, 2);

    const filename = `ICEGATE_CACHE01_${txn.id.split('-')[0]}.json`;

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Export microservice fault: ' + error.message }, { status: 500 });
  }
}
