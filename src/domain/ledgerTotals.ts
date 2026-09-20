export const SOURCE_TAX_CATEGORY_IDS = [
  'salary-ibas',
  'salary-other',
  'bank-fi',
  'dividend',
  'service-payment',
  'sanchayapatra',
  'import',
  'commercial-vehicle',
  'other-tds',
] as const;

export const AIT_CATEGORY_IDS = ['ait-car', 'ait-154'] as const;

export const DEFAULT_CATEGORY_AMOUNTS: Record<string, number> = {
  'salary-ibas': 150000,
  'salary-other': 3636074,
  'bank-fi': 311400,
  dividend: 210327,
  'service-payment': 38000,
  sanchayapatra: 51189,
  import: 1812218,
  'commercial-vehicle': 125000,
  'other-tds': 6970044,
  'ait-car': 0,
  'ait-154': 118365,
  'tax-paid-return': 1004342,
  'environmental-surcharge': 50000,
  'tax-refund': 1003333,
  'carry-forward': 1003333,
};

export const sumCategoryAmounts = (
  amounts: Record<string, number>,
  categoryIds: readonly string[]
): number => categoryIds.reduce((sum, categoryId) => sum + (amounts[categoryId] ?? 0), 0);

export const computeLedgerTotals = (amounts: Record<string, number>) => {
  const sourceTax = sumCategoryAmounts(amounts, SOURCE_TAX_CATEGORY_IDS);
  const advanceIncomeTax = sumCategoryAmounts(amounts, AIT_CATEGORY_IDS);
  const taxPaidWithReturn = amounts['tax-paid-return'] ?? 0;
  const environmentalSurcharge = amounts['environmental-surcharge'] ?? 0;
  const adjustmentOfTaxRefund = amounts['tax-refund'] ?? 0;
  const carryForwardTax = amounts['carry-forward'] ?? 0;
  const total =
    sourceTax +
    advanceIncomeTax +
    taxPaidWithReturn +
    environmentalSurcharge +
    adjustmentOfTaxRefund +
    carryForwardTax;

  return {
    sourceTax,
    advanceIncomeTax,
    taxPaidWithReturn,
    environmentalSurcharge,
    adjustmentOfTaxRefund,
    carryForwardTax,
    total,
  };
};
