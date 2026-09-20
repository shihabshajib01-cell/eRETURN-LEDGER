const MONEY_PATTERN = /^\s*(?:\d{1,3}(?:,\d{2,3})*|\d+)(?:\.\d{1,2})?\s*$/;
const DATE_PATTERN = /^(\d{2})-(\d{2})-(\d{4})$/;

export const isValidMoneyInput = (value: string | number): boolean => {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0;
  if (!MONEY_PATTERN.test(value)) return false;
  const normalized = value.replace(/,/g, '').trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0;
};

export const parseMoneyStrict = (value: string | number): number | null => {
  if (!isValidMoneyInput(value)) return null;
  if (typeof value === 'number') return value;
  return Number(value.replace(/,/g, '').trim());
};

export const isValidLedgerDate = (value: string): boolean => {
  const match = DATE_PATTERN.exec(value.trim());
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const hasText = (value: string): boolean => value.trim().length > 0;
