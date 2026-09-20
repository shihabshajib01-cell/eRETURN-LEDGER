export type IbasSalaryTdsRecord = {
  assessmentYear: string;
  officeName: string;
  designation: string;
  tdsAvailable: number;
};

export const VERIFIED_IBAS_FALLBACK: IbasSalaryTdsRecord = {
  assessmentYear: '2026-2027',
  officeName: 'Bogura Technical Training Centre, Bogura',
  designation: 'Principal',
  tdsAvailable: 500450,
};

/**
 * Optional integration boundary for the authenticated iBAS++ salary-TDS search.
 * NBR documents the Search -> Claim -> Save journey, but the private endpoint
 * is not public. Configure VITE_IBAS_TDS_LOOKUP_API to use the production
 * source; otherwise the current-system verified project record is used.
 */
export const fetchIbasSalaryTds = async (): Promise<IbasSalaryTdsRecord | null> => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const endpoint = env?.VITE_IBAS_TDS_LOOKUP_API?.trim();

  if (!endpoint) return { ...VERIFIED_IBAS_FALLBACK };

  const response = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (response.status === 204 || response.status === 404) return null;
  if (!response.ok) throw new Error(`iBAS lookup failed with status ${response.status}`);

  const payload = await response.json() as Partial<IbasSalaryTdsRecord>;
  if (
    !payload ||
    typeof payload.assessmentYear !== 'string' ||
    typeof payload.officeName !== 'string' ||
    typeof payload.designation !== 'string' ||
    typeof payload.tdsAvailable !== 'number'
  ) return null;

  return {
    assessmentYear: payload.assessmentYear,
    officeName: payload.officeName,
    designation: payload.designation,
    tdsAvailable: payload.tdsAvailable,
  };
};
