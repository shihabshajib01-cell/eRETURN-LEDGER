import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import {
  computeLedgerTotals,
  DEFAULT_CATEGORY_AMOUNTS,
} from '../domain/ledgerTotals';

type LedgerRuntimeValue = {
  categoryAmounts: Record<string, number>;
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
  const [overrides, setOverrides] = usePersistentState<Record<string, number>>(
    'ereturn-ledger:v5:category-amounts',
    {}
  );

  const updateCategoryAmount = useCallback((categoryId: string, amount: number) => {
    const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
    setOverrides((current) => {
      if (current[categoryId] === safeAmount) return current;
      return { ...current, [categoryId]: safeAmount };
    });
  }, [setOverrides]);

  const categoryAmounts = useMemo(
    () => ({ ...DEFAULT_CATEGORY_AMOUNTS, ...overrides }),
    [overrides]
  );

  const totals = useMemo(
    () => computeLedgerTotals(categoryAmounts),
    [categoryAmounts]
  );

  const value = useMemo<LedgerRuntimeValue>(() => ({
    categoryAmounts,
    ...totals,
    updateCategoryAmount,
  }), [categoryAmounts, totals, updateCategoryAmount]);

  return (
    <LedgerRuntimeContext.Provider value={value}>
      {children}
    </LedgerRuntimeContext.Provider>
  );
};

export const useLedgerRuntime = (): LedgerRuntimeValue => {
  const value = useContext(LedgerRuntimeContext);
  if (!value) throw new Error('useLedgerRuntime must be used inside LedgerRuntimeProvider');
  return value;
};
