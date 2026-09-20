export const parseMoney = (value: string | number): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const normalized = value.replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatLedgerNumber = (amount: number): string =>
  Math.max(0, Math.round(amount)).toLocaleString('en-IN');
