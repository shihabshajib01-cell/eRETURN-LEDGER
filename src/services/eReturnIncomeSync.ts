export type IncomeSyncCategory = 'bank-fi' | 'dividend' | 'service-payment' | 'sanchayapatra';

/**
 * Optional integration boundary for eReturn Income -> eLedger sync.
 *
 * NBR's public documentation defines which Ledger categories sync from Income,
 * but the authenticated production endpoint is not public. When
 * VITE_ERETURN_INCOME_SYNC_API is supplied, the UI uses the real source.
 * Otherwise the project-backed current-system fixtures are used so the full
 * interaction can still be tested without fabricating a private API.
 */
export const fetchIncomeSyncRecords = async <T extends Record<string, unknown>>(
  category: IncomeSyncCategory,
  fallback: T[]
): Promise<T[]> => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const baseUrl = env?.VITE_ERETURN_INCOME_SYNC_API?.trim();

  if (!baseUrl) return fallback.map((row) => ({ ...row }));

  const url = new URL(baseUrl);
  url.pathname = `${url.pathname.replace(/\/$/, '')}/${category}`;

  const response = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (response.status === 204 || response.status === 404) return [];
  if (!response.ok) throw new Error(`Income sync failed with status ${response.status}`);

  const payload = await response.json();
  if (!Array.isArray(payload)) return [];

  return payload.filter((row): row is T => Boolean(row) && typeof row === 'object');
};
