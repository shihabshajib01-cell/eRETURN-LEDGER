import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber, parseMoney } from '../utils/money';
import { isValidMoneyInput, parseMoneyStrict } from '../utils/validation';
import { fetchIbasSalaryTds, IbasSalaryTdsRecord } from '../services/iBasLookup';

type LoadState = 'loading' | 'ready' | 'empty' | 'error';

export const SalaryIbasLeanPage: React.FC<{
  lang: Language;
  onUnavailableAction: (message: string) => void;
}> = ({ lang, onUnavailableAction }) => {
  const [savedClaim, setSavedClaim] = usePersistentState('ereturn-ledger:v2:salary-ibas-claim', '1,50,000');
  const [claim, setClaim] = useState(savedClaim);
  const [salaryRecord, setSalaryRecord] = useState<IbasSalaryTdsRecord | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const { updateCategoryAmount } = useLedgerRuntime();
  const isBn = lang === 'bn';

  const available = salaryRecord?.tdsAvailable ?? 0;
  const strictClaimAmount = useMemo(() => parseMoneyStrict(claim), [claim]);
  const savedClaimAmount = useMemo(() => parseMoney(savedClaim), [savedClaim]);
  const claimInvalid = Boolean(
    salaryRecord && (!isValidMoneyInput(claim) || strictClaimAmount === null || strictClaimAmount > available)
  );
  const saveDisabled = !salaryRecord || loadState !== 'ready' || claimInvalid;

  useEffect(() => {
    updateCategoryAmount('salary-ibas', savedClaimAmount);
  }, [savedClaimAmount, updateCategoryAmount]);

  const loadIbas = useCallback(async () => {
    setLoadState('loading');
    try {
      const record = await fetchIbasSalaryTds();
      setSalaryRecord(record);
      setLoadState(record ? 'ready' : 'empty');
    } catch {
      setSalaryRecord(null);
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    void loadIbas();
  }, [loadIbas]);

  const save = () => {
    if (saveDisabled) return;
    setSavedClaim(claim);
    onUnavailableAction(isBn ? 'TDS Claim সংরক্ষিত হয়েছে।' : 'TDS Claim saved.');
  };

  const loadMessage =
    loadState === 'loading'
      ? (isBn ? 'iBAS++ থেকে তথ্য আনা হচ্ছে…' : 'Loading iBAS++ salary TDS…')
      : loadState === 'empty'
        ? (isBn ? 'এই করবর্ষের জন্য কোনো iBAS++ বেতন TDS তথ্য পাওয়া যায়নি।' : 'No iBAS++ salary TDS record was found for this assessment year.')
        : (isBn ? 'iBAS++ সেবার সাথে সংযোগ করা যাচ্ছে না।' : 'Unable to connect to the iBAS++ verification service.');

  return (
    <section className="w-full space-y-5" aria-labelledby="salary-ibas-title">
      <header>
        <h1 id="salary-ibas-title" className="text-2xl font-bold tracking-tight text-[#172033] lg:text-[28px]">
          iBAS++ (Salary) TDS
        </h1>
      </header>

      <section
        className="rounded-xl border border-[#DCE4EC] bg-white p-5 sm:p-6"
        aria-label={isBn ? 'iBAS++ বেতন TDS তথ্য' : 'iBAS++ salary TDS details'}
      >
        {loadState !== 'ready' && (
          <div
            className={`mb-5 flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
              loadState === 'loading'
                ? 'border-[#D8E7F0] bg-[#F7FBFD] text-[#496277]'
                : 'border-[#E4E8ED] bg-[#FAFBFC] text-[#5F6B7A]'
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2 text-sm">
              {loadState === 'loading' && <RefreshCw className="h-4 w-4 animate-spin text-[#0B6FA4]" aria-hidden="true" />}
              <span>{loadMessage}</span>
            </div>

            {(loadState === 'empty' || loadState === 'error') && (
              <button
                type="button"
                onClick={() => void loadIbas()}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#C8D4E1] bg-white px-3 py-2 text-sm font-semibold text-[#0B6FA4] hover:bg-[#F2F8FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/25"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                {isBn ? 'আবার চেষ্টা করুন' : 'Retry'}
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <ReadOnlyField
            label={isBn ? 'করবর্ষ' : 'Assessment Year'}
            value={salaryRecord?.assessmentYear ?? ''}
            loading={loadState === 'loading'}
          />
          <ReadOnlyField
            label={isBn ? 'অফিসের নাম' : 'Office Name'}
            value={salaryRecord?.officeName ?? ''}
            loading={loadState === 'loading'}
          />
          <ReadOnlyField
            label={isBn ? 'পদবি' : 'Designation'}
            value={salaryRecord?.designation ?? ''}
            loading={loadState === 'loading'}
          />
          <ReadOnlyField
            label={isBn ? 'উপলভ্য উৎস কর' : 'TDS Available'}
            value={salaryRecord ? formatLedgerNumber(salaryRecord.tdsAvailable) : ''}
            emphasized={Boolean(salaryRecord)}
            loading={loadState === 'loading'}
          />
        </div>

        <div className="mt-6 border-t border-[#E2E8F0] pt-5">
          <div className="max-w-2xl">
            <label htmlFor="tds-claim" className="mb-2 block text-sm font-semibold text-[#172033]">
              {isBn ? 'TDS দাবি' : 'TDS Claim'}
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <input
                  id="tds-claim"
                  value={claim}
                  onChange={(event) => setClaim(event.target.value)}
                  inputMode="decimal"
                  disabled={!salaryRecord || loadState !== 'ready'}
                  aria-invalid={claimInvalid}
                  aria-describedby={claimInvalid ? 'tds-claim-error' : undefined}
                  className={`w-full rounded-lg border px-3 py-3 text-base font-medium text-[#172033] outline-none transition-colors disabled:cursor-not-allowed disabled:bg-[#F1F3F5] disabled:text-[#8A96A6] ${
                    claimInvalid
                      ? 'border-red-400 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-[#C8D4E1] bg-white focus:border-[#0B6FA4] focus:ring-2 focus:ring-[#0B6FA4]/20'
                  }`}
                />
                {claimInvalid && (
                  <p id="tds-claim-error" className="mt-2 text-sm text-red-600">
                    {isBn ? 'দাবির পরিমাণ উপলভ্য TDS-এর বেশি হতে পারবে না।' : 'TDS Claim cannot exceed the available amount.'}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={save}
                disabled={saveDisabled}
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0B6FA4] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#095D8A] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 focus-visible:ring-offset-2 sm:w-auto"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                {isBn ? 'সংরক্ষণ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

const ReadOnlyField = ({
  label,
  value,
  emphasized = false,
  loading = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
  loading?: boolean;
}) => (
  <div>
    <p className="mb-2 text-xs font-semibold text-[#66758A]">{label}</p>
    <div
      className={`flex min-h-[46px] items-center rounded-lg border border-[#D5DCE5] bg-[#F4F6F8] px-3 py-2.5 ${
        emphasized ? 'text-lg font-bold tabular-nums text-[#0B6FA4]' : 'text-sm font-semibold text-[#263247]'
      }`}
      aria-readonly="true"
    >
      {loading ? (
        <span className="h-4 w-24 animate-pulse rounded bg-[#DDE4EA]" aria-hidden="true" />
      ) : (
        value || <span className="text-[#98A2B3]">—</span>
      )}
    </div>
  </div>
);
