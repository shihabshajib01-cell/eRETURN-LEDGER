import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Language } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';

const CLAIMED_AMOUNT = 1003333;

export const CarryForwardPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [active, setActive] = usePersistentState('ereturn-ledger:v2:carry-forward-active', true);
  const { updateCategoryAmount } = useLedgerRuntime();

  useEffect(() => {
    updateCategoryAmount('carry-forward', active ? CLAIMED_AMOUNT : 0);
  }, [active, updateCategoryAmount]);

  const removeClaim = () => {
    const confirmed = window.confirm(isBn ? 'দাবিটি মুছে ফেলবেন?' : 'Delete this claim?');
    if (confirmed) setActive(false);
  };

  return (
    <section className="w-full space-y-4" aria-labelledby="carry-forward-title">
      <h1 id="carry-forward-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
        {isBn ? 'ধারা ১৬৩ অনুযায়ী জের টানা কর সমন্বয়' : 'Adjustment of carry forward tax u/s 163'}
      </h1>

      {active ? (
        <section className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-bold text-[#172033]">
                  {isBn ? 'ধারা ১৬৩ অনুযায়ী জের টানা কর সমন্বয়' : 'Adjustment of carry forward tax u/s 163'}
                </p>
                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {isBn ? 'দাবিকৃত' : 'Claimed'}
                </span>
              </div>
              <button
                type="button"
                onClick={removeClaim}
                className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                <Trash2 className="h-4 w-4" />
                {isBn ? 'মুছুন' : 'Delete'}
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#C8D4E1] bg-white px-4 py-4">
              <span className="text-sm text-[#5F6B7A]">{isBn ? 'দাবিকৃত পরিমাণ' : 'Claimed Amount'}</span>
              <span className="text-xl font-bold text-[#0B6FA4]">10,03,333</span>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-[#C8D4E1] bg-white px-5 py-8 text-center">
          <p className="text-sm font-semibold text-[#172033]">
            {isBn ? 'কোনো carry forward tax দাবি নেই।' : 'No carry forward tax claim.'}
          </p>
        </section>
      )}
    </section>
  );
};
