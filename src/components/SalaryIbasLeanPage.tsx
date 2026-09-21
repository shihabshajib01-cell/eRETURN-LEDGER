import React, { useEffect, useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { Language } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber, parseMoney } from '../utils/money';
import { isValidMoneyInput, parseMoneyStrict } from '../utils/validation';
import { fetchIbasSalaryTds, IbasSalaryTdsRecord } from '../services/iBasLookup';

export const SalaryIbasLeanPage: React.FC<{
  lang: Language;
  onUnavailableAction: (message: string) => void;
}> = ({ lang, onUnavailableAction }) => {
  const [savedClaim, setSavedClaim] = usePersistentState('ereturn-ledger:v2:salary-ibas-claim', '1,50,000');
  const [claim, setClaim] = useState(savedClaim);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [salaryRecord, setSalaryRecord] = useState<IbasSalaryTdsRecord | null>(null);
  const { updateCategoryAmount } = useLedgerRuntime();
  const isBn = lang === 'bn';
  const available = salaryRecord?.tdsAvailable ?? 0;
  const strictClaimAmount = useMemo(() => parseMoneyStrict(claim), [claim]);
  const savedClaimAmount = useMemo(() => parseMoney(savedClaim), [savedClaim]);
  const claimInvalid = Boolean(
    salaryRecord && (!isValidMoneyInput(claim) || strictClaimAmount === null || strictClaimAmount > available)
  );
  const saveDisabled = !salaryRecord || claimInvalid;

  useEffect(() => {
    updateCategoryAmount('salary-ibas', savedClaimAmount);
  }, [savedClaimAmount, updateCategoryAmount]);

  const searchIbas = async () => {
    setSearching(true);
    try {
      const record = await fetchIbasSalaryTds();
      setSalaryRecord(record);
      setSearched(true);
      if (record) {
        onUnavailableAction(isBn ? 'iBAS++ থেকে বেতন TDS তথ্য পাওয়া গেছে।' : 'Salary TDS information retrieved from iBAS++.');
      } else {
        onUnavailableAction(isBn ? 'iBAS++-এ কোনো বেতন TDS তথ্য পাওয়া যায়নি।' : 'No salary TDS information was found in iBAS++.');
      }
    } catch {
      setSalaryRecord(null);
      setSearched(true);
      onUnavailableAction(isBn ? 'iBAS++ ভেরিফিকেশন সার্ভিসে সংযোগ করা যাচ্ছে না।' : 'The iBAS++ verification service is unavailable.');
    } finally {
      setSearching(false);
    }
  };

  const save = () => {
    if (saveDisabled) return;
    setSavedClaim(claim);
    onUnavailableAction(isBn ? 'TDS Claim সংরক্ষিত হয়েছে।' : 'TDS Claim saved.');
  };

  return (
    <section className="w-full space-y-5" aria-labelledby="salary-ibas-title">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 id="salary-ibas-title" className="text-2xl font-bold tracking-tight text-[#172033] lg:text-[28px]">
          iBAS++ (Salary) TDS
        </h1>

        <button
          type="button"
          onClick={() => void searchIbas()}
          disabled={searching}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#0B6FA4] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B6FA4] transition-colors hover:bg-[#F2F8FC] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          {searching ? (isBn ? 'অনুসন্ধান হচ্ছে...' : 'Searching...') : (isBn ? 'অনুসন্ধান' : 'Search')}
        </button>
      </header>

      <section
        className="overflow-hidden rounded-xl border border-[#DCE4EC] bg-white"
        aria-label={isBn ? 'iBAS++ বেতন TDS তথ্য' : 'iBAS++ salary TDS details'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <ReadOnlyField
            label={isBn ? 'করবর্ষ' : 'Assessment Year'}
            value={salaryRecord?.assessmentYear ?? ''}
            className="border-b border-[#E2E8F0] md:border-r"
          />
          <ReadOnlyField
            label={isBn ? 'অফিসের নাম' : 'Office Name'}
            value={salaryRecord?.officeName ?? ''}
            className="border-b border-[#E2E8F0]"
          />
          <ReadOnlyField
            label={isBn ? 'পদবি' : 'Designation'}
            value={salaryRecord?.designation ?? ''}
            className="border-b border-[#E2E8F0] md:border-b-0 md:border-r"
          />
          <ReadOnlyField
            label={isBn ? 'উপলভ্য উৎস কর' : 'TDS Available'}
            value={salaryRecord ? formatLedgerNumber(salaryRecord.tdsAvailable) : ''}
            emphasized={Boolean(salaryRecord)}
          />
        </div>

        <div className="border-t border-[#DCE4EC] px-4 py-5 sm:px-5 lg:px-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label htmlFor="tds-claim" className="mb-2 block text-sm font-semibold text-[#172033]">
                {isBn ? 'TDS দাবি' : 'TDS Claim'}
              </label>
              <input
                id="tds-claim"
                value={claim}
                onChange={(event) => setClaim(event.target.value)}
                inputMode="decimal"
                disabled={!salaryRecord}
                aria-invalid={claimInvalid}
                aria-describedby={claimInvalid ? 'tds-claim-error' : undefined}
                placeholder={salaryRecord ? undefined : (isBn ? 'প্রথমে অনুসন্ধান করুন' : 'Search first to retrieve TDS')}
                className={`w-full rounded-lg border px-3 py-3 text-base font-medium text-[#172033] outline-none transition-colors disabled:cursor-not-allowed disabled:bg-[#F1F3F5] disabled:text-[#7A8698] ${
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
              {!salaryRecord && searched && (
                <p className="mt-2 text-sm text-[#6B778A]">
                  {isBn ? 'কোনো iBAS++ বেতন TDS তথ্য পাওয়া যায়নি।' : 'No iBAS++ salary TDS record is available to claim.'}
                </p>
              )}
            </div>

            <div className="flex items-end justify-end">
              <button
                type="button"
                onClick={save}
                disabled={saveDisabled}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B6FA4] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#095D8A] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 focus-visible:ring-offset-2 sm:w-auto"
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
  className = '',
}: {
  label: string;
  value: string;
  emphasized?: boolean;
  className?: string;
}) => (
  <div className={`px-4 py-4 sm:px-5 lg:px-6 ${className}`}>
    <label className="mb-2 block text-xs font-semibold text-[#66758A]">{label}</label>
    <div
      className={`flex min-h-[46px] items-center rounded-md border border-[#D5DCE5] bg-[#F1F3F5] px-3 py-2 text-sm font-semibold ${
        emphasized ? 'text-lg font-bold tabular-nums text-[#0B6FA4]' : 'text-[#263247]'
      }`}
      aria-readonly="true"
    >
      {value || <span className="text-[#98A2B3]">—</span>}
    </div>
  </div>
);
