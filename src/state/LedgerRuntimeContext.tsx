import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';

type GroupKey = 'sourceTax' | 'advanceIncomeTax';

type CategoryBaseline = {
  group?: GroupKey;
  baseline: number;
};

const BASE_TOTALS = {
  sourceTax: 13309693,
  advanceIncomeTax: 190365,
  taxPaidWithReturn: 1004342,
  environmentalSurcharge: 50000,
  adjustmentOfTaxRefund: 1003333,
  carryForwardTax: 1003333,
};

const CATEGORY_BASELINES: Record<string, CategoryBaseline> = {
  'salary-ibas': { group: 'sourceTax', baseline: 150000 },
  'salary-other': { group: 'sourceTax', baseline: 3636074 },
  'bank-fi': { group: 'sourceTax', baseline: 311400 },
  dividend: { group: 'sourceTax', baseline: 210327 },
  'service-payment': { group: 'sourceTax', baseline: 38000 },
  sanchayapatra: { group: 'sourceTax', baseline: 51189 },
  import: { group: 'sourceTax', baseline: 1812218 },
  'commercial-vehicle': { group: 'sourceTax', baseline: 125000 },
  'other-tds': { group: 'sourceTax', baseline: 6970044 },
  'ait-154': { group: 'advanceIncomeTax', baseline: 118365 },
  'tax-paid-return': { baseline: 1004342 },
  'environmental-surcharge': { baseline: 50000 },
  'tax-refund': { baseline: 1003333 },
  'carry-forward': { baseline: 1003333 },
};

type AmountOverrides = Record<string, number>;

type LedgerRuntimeValue = {
  sourceTax: number;
  advanceIncomeTax: number;
  taxPaidWithReturn: number;
  environmentalSurcharge: number;
  adjustmentOfTaxRefund: number;
  carryForwardTax: number;
  total: number;
  updateCategoryAmount: (categoryId: string, amount: number) => void;
};

const LedgerRuntimeContext = createContext<LedgerRuntimeValue | null>(null);

export const LedgerRuntimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overrides, setOverrides] = usePersistentState<AmountOverrides>('ereturn-ledger:v2:amount-overrides', {});

  const updateCategoryAmount = useCallback((categoryId: string, amount: number) => {
    const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
    setOverrides((current) => {
      if (current[categoryId] === safeAmount) return current;
      return { ...current, [categoryId]: safeAmount };
    });
  }, [setOverrides]);

  const groupTotal = useCallback((group: GroupKey) => {
    const base = BASE_TOTALS[group];
    return Object.entries(CATEGORY_BASELINES).reduce((total, [categoryId, config]) => {
      if (config.group !== group || overrides[categoryId] === undefined) return total;
      return total + (overrides[categoryId] - config.baseline);
    }, base);
  }, [overrides]);

  const value = useMemo<LedgerRuntimeValue>(() => {
    const sourceTax = groupTotal('sourceTax');
    const advanceIncomeTax = groupTotal('advanceIncomeTax');
    const taxPaidWithReturn = overrides['tax-paid-return'] ?? BASE_TOTALS.taxPaidWithReturn;
    const environmentalSurcharge = overrides['environmental-surcharge'] ?? BASE_TOTALS.environmentalSurcharge;
    const adjustmentOfTaxRefund = overrides['tax-refund'] ?? BASE_TOTALS.adjustmentOfTaxRefund;
    const carryForwardTax = overrides['carry-forward'] ?? BASE_TOTALS.carryForwardTax;
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
      updateCategoryAmount,
    };
  }, [groupTotal, overrides, updateCategoryAmount]);

  return <LedgerRuntimeContext.Provider value={value}>{children}</LedgerRuntimeContext.Provider>;
};

export const useLedgerRuntime = (): LedgerRuntimeValue => {
  const value = useContext(LedgerRuntimeContext);
  if (!value) throw new Error('useLedgerRuntime must be used inside LedgerRuntimeProvider');
  return value;
};
