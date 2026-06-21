export function evaluateFemaTolerance(invoiceValue: number | null, remittanceAmount: number | null): number | null {
  if (invoiceValue === null || remittanceAmount === null || invoiceValue === 0) {
    return null;
  }

  // Calculate percentage variance
  // variance = ((remittance - invoice) / invoice) * 100
  const drift = ((remittanceAmount - invoiceValue) / invoiceValue) * 100;

  // Returning the exact variance. The pipeline can flag it if Math.abs(drift) > 0.5
  return parseFloat(drift.toFixed(2));
}
