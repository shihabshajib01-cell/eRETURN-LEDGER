export type LookupCategory =
  | 'commercial-vehicle'
  | 'ait-car'
  | 'ait-154'
  | 'tax-paid-return';

export type ExternalLookupResponse = Record<string, string | number> & { id?: number };

/**
 * Optional integration boundary for the real eLedger verification services.
 *
 * The public NBR documentation defines the user-facing lookup journeys but
 * does not publish the authenticated production API endpoints. When a
 * verified backend endpoint is supplied through VITE_ELEDGER_LOOKUP_API,
 * the static Ledger can perform the same Search -> Result -> Save flow
 * without inventing taxpayer data.
 */
export const lookupExternalLedgerRecord = async (
  category: LookupCategory,
  value: string
): Promise<ExternalLookupResponse | null> => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const baseUrl = env?.VITE_ELEDGER_LOOKUP_API?.trim();

  if (!baseUrl) return null;

  const url = new URL(baseUrl);
  url.pathname = `${url.pathname.replace(/\/$/, '')}/${category}`;
  url.searchParams.set('q', value);

  const response = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Lookup failed with status ${response.status}`);

  const payload = await response.json() as ExternalLookupResponse | null;
  return payload && typeof payload === 'object' ? payload : null;
};
