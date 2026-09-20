import React, { useEffect, useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { Language } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { parseMoney } from '../utils/money';

export const SalaryIbasLeanPage: React.FC<{
  lang: Language;
  onUnavailableAction: (message: string) => void;
}> = ({ lang, onUnavailableAction }) => {
  const [savedClaim, setSavedClaim] = usePersistentState('ereturn-ledger:v2:salary-ibas-claim', '1,50,000');
  const [claim, setClaim] = useState(savedClaim);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const { updateCategoryAmount } = useLedgerRuntime();
  const isBn = lang === 'bn';
  const available = 500450;
  const claimAmount = useMemo(() => parseMoney(claim), [claim]);
  const savedClaimAmount = useMemo(() => parseMoney(savedClaim), [savedClaim]);
  const invalid = claimAmount < 0 || claimAmount > available;

  useEffect(() => {
    updateCategoryAmount('salary-ibas', savedClaimAmount);
  }, [savedClaimAmount, updateCategoryAmount]);

  const searchIbas = () => {
    setSearching(true);
    window.setTimeout(() => {
      setSearching(false);
      setSearched(true);
      onUnavailableAction(isBn ? 'iBAS++ থেকে বেতন TDS তথ্য পাওয়া গেছে।' : 'Salary TDS information retrieved from iBAS++.');
    }, 250);
  };

  const save = () => {
    if (invalid) return;
    setSavedClaim(claim);
    onUnavailableAction(isBn ? 'TDS Claim সংরক্ষিত হয়েছে।' : 'TDS Claim saved.');
  };

  return (
    <section className="w-full space-y-4" aria-labelledby="salary-ibas-title">
      <header>
        <h1 id="salary-ibas-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
          iBAS++ (Salary) TDS
        </h1>
      </header>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={searchIbas}
          disabled={searching}
          className="inline-flex items-center gap-2 rounded-lg border border-[#0B6FA4] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B6FA4] hover:bg-blue-50 disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          {searching ? (isBn ? 'অনুসন্ধান হচ্ছে...' : 'Searching...') : (isBn ? 'অনুসন্ধান' : 'Search')}
        </button>
      </div>

      {searched && (
      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="grid grid-cols-1 gap-px bg-[#E2E8F0] md:grid-cols-2">
          <ReadOnlyInfo label={isBn ? 'করবর্ষ' : 'Assessment Year'} value="2026-2027" />
          <ReadOnlyInfo label={isBn ? 'অফিসের নাম' : 'Office Name'} value="Bogura Technical Training Centre, Bogura" />
          <ReadOnlyInfo label={isBn ? 'পদবি' : 'Designation'} value="Principal" />
          <ReadOnlyInfo label={isBn ? 'উপলভ্য উৎস কর' : 'TDS Available'} value="5,00,450" emphasized />
        </div>
      </section>
      )}

      {searched && (
      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white" aria-labelledby="tds-claim-title">
        <div className="px-5 py-4">
          <div className="max-w-2xl">
            <label id="tds-claim-title" htmlFor="tds-claim" className="mb-2 block text-sm font-semibold text-[#172033]">
              {isBn ? 'TDS দাবি' : 'TDS Claim'}
            </label>
            <input
              id="tds-claim"
              value={claim}
              onChange={(event) => setClaim(event.target.value)}
              inputMode="decimal"
              aria-invalid={invalid}
              aria-describedby={invalid ? 'tds-claim-error' : undefined}
              className={`w-full rounded-lg border bg-white px-3 py-3 font-medium text-[#172033] focus:outline-none focus:ring-2 ${
                invalid
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                  : 'border-[#C8D4E1] focus:border-[#0B6FA4] focus:ring-[#0B6FA4]/20'
              }`}
            />
            {invalid && (
              <p id="tds-claim-error" className="mt-2 text-sm text-red-600">
                {isBn ? 'দাবির পরিমাণ উপলভ্য TDS-এর বেশি হতে পারবে না।' : 'TDS Claim cannot exceed the available amount.'}
              </p>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={save}
                disabled={invalid}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-5 py-2.5 font-semibold text-white hover:bg-[#095D8A] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 focus-visible:ring-offset-2"
              >
                <Check className="h-4 w-4" />
                {isBn ? 'সংরক্ষণ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </section>
      )}
    </section>
  );
};

const ReadOnlyInfo = ({ label, value, emphasized = false }: { label: string; value: string; emphasized?: boolean }) => (
  <div className="flex min-h-[80px] flex-col justify-center bg-white px-5 py-3.5">
    <p className="mb-1 text-xs font-semibold text-[#5F6B7A]">{label}</p>
    <p className={`${emphasized ? 'text-xl font-bold text-[#0B6FA4]' : 'text-base font-semibold text-[#263247]'} leading-snug`}>
      {value}
    </p>
  </div>
);
