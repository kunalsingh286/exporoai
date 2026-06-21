import { createServerClient } from "@supabase/ssr";
import { extractDocumentData } from "@/services/ai/geminiExtraction";
import { resolveHsCode } from "@/services/compliance/tariffResolver";
import { evaluateFemaTolerance } from "@/services/compliance/femaChecker";

// Helper to create a fully authenticated Supabase client for the background worker
const createWorkerClient = (accessToken: string) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {}
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
  );
};

export async function processIngestionTask(
  transactionId: string, 
  organizationId: string,
  streamType: string, 
  fileBase64: string, 
  mimeType: string, 
  accessToken: string
) {
  const supabase = createWorkerClient(accessToken);

  try {
    console.log(`[Worker] Starting processing for transaction ${transactionId}`);
    
    // 1. AI Extraction
    const extractedData = await extractDocumentData(fileBase64, mimeType, streamType);
    console.log(`[Worker] Extraction complete`, extractedData);

    // 2. HS Code Resolution
    let hsCode = null;
    if (extractedData.hs_code_description) {
      hsCode = resolveHsCode(extractedData.hs_code_description);
    }

    // 3. FEMA Check
    let variance = null;
    if (extractedData.invoice_value && extractedData.remittance_amount) {
      variance = evaluateFemaTolerance(extractedData.invoice_value, extractedData.remittance_amount);
      if (variance !== null && Math.abs(variance) > 0.5) {
        console.warn(`[Worker] FEMA WARNING: Variance is ${variance}% (exceeds 0.5% threshold)`);
      }
    }

    // 4. Build ICEGATE / EDF mock payloads (Phase 2 abstraction)
    const compiledIcegate = streamType === 'PHYSICAL_GOODS' ? {
       SB_CACHE01: extractedData,
       resolved_hs_code: hsCode
    } : null;

    const compiledEdf = streamType === 'INTANGIBLE_SERVICES' ? {
       firc_data: extractedData.banking_reference,
       variance_percentage: variance
    } : null;

    // 5. Update the Database Ledger
    const { error: ledgerError } = await supabase
      .from('trade_transactions_ledger')
      .update({
        status: 'READY_FOR_REVIEW',
        extracted_tokens: extractedData,
        hs_code: hsCode,
        customs_shipping_bill_no: extractedData.shipping_bill_no || null,
        firc_reference: extractedData.banking_reference || null,
        fema_variance_percentage: variance,
        compiled_icegate_payload: compiledIcegate,
        compiled_unified_edf_payload: compiledEdf
      })
      .eq('id', transactionId);

    if (ledgerError) throw new Error(`Ledger update failed: ${ledgerError.message}`);

    // 6. Deduct 1 Wallet Credit
    const { data: walletData, error: walletFetchError } = await supabase
        .from('credit_wallet_balance')
        .select('wallet_credits')
        .eq('organization_id', organizationId)
        .single();

    if (!walletFetchError && walletData) {
        await supabase
            .from('credit_wallet_balance')
            .update({ wallet_credits: walletData.wallet_credits - 1 })
            .eq('organization_id', organizationId);
    }

    console.log(`[Worker] Successfully finalized transaction ${transactionId}`);

  } catch (error) {
    console.error(`[Worker] Error processing transaction ${transactionId}`, error);
    // Mark as failed
    await supabase
      .from('trade_transactions_ledger')
      .update({ status: 'FAILED' })
      .eq('id', transactionId);
  }
}
