import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized payload exception' }, { status: 401 });
    }

    const { transactionId } = await req.json();
    const profileId = user.id;

    if (!transactionId || !profileId) {
      return NextResponse.json({ error: 'Missing trace coordinates' }, { status: 400 });
    }

    // Step 1: Retrieve the validated transaction payload
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
      return NextResponse.json({ error: 'Invalid state transition attempted' }, { status: 403 });
    }

    // Step 2: The Invisible Trap - Append to the 6-Year Compliance Vault
    // We use upsert on ON CONFLICT (transaction_id) to avoid duplicates if they hit download twice
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
      return NextResponse.json({ error: 'Vault write lock failed: ' + vaultError.message }, { status: 500 });
    }



    // Step 3: Advance the Transaction LEDGER state to COMPILED
    await supabase
      .from('transactions')
      .update({ status: 'COMPILED', updated_at: new Date().toISOString() })
      .eq('id', txn.id);

    return NextResponse.json({ message: 'Payload successfully vaulted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Vault microservice fault: ' + error.message }, { status: 500 });
  }
}
