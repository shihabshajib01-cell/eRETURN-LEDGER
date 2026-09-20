import React from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber } from '../utils/money';

interface TaxPaymentStatusPageProps {
  lang: Language;
  onBack: () => void;
  onGoToEReturn: () => void;
}

export const TaxPaymentStatusPage: React.FC<TaxPaymentStatusPageProps> = ({ lang, onGoToEReturn }) => {
  const isBn = lang === 'bn';
  const runtime = useLedgerRuntime();

  const rows = [
    [isBn ? 'উৎস কর' : 'Source Tax', runtime.sourceTax, true],
    [isBn ? 'অগ্রিম আয়কর (AIT)' : 'Advance Income Tax (AIT)', runtime.advanceIncomeTax, true],
    [isBn ? 'রিটার্নের সাথে প্রদত্ত কর' : 'Tax Paid With Return', runtime.taxPaidWithReturn, false],
    [isBn ? 'পরিবেশ সারচার্জ' : 'Environmental Surcharge', runtime.environmentalSurcharge, false],
    [isBn ? 'কর রিফান্ড সমন্বয়' : 'Adjustment of Tax Refund', runtime.adjustmentOfTaxRefund, false],
    [isBn ? 'ধারা ১৬৩ অনুযায়ী জের টানা কর সমন্বয়' : 'Adjustment of carry forward tax u/s 163', runtime.carryForwardTax, false],
  ] as const;

  return (
    <section className="w-full space-y-4" aria-labelledby="payment-status-title">
      <header>
        <h1 id="payment-status-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
          {isBn ? 'কর পরিশোধের বিবরণী' : 'Tax Payment Status'}
        </h1>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="grid grid-cols-[minmax(0,1fr)_140px] sm:grid-cols-[minmax(0,1fr)_220px] border-b border-[#E2E8F0] bg-slate-50 text-sm font-semibold text-[#5F6B7A]">
          <div className="px-4 sm:px-5 py-3">{isBn ? 'বিবরণ' : 'Particulars'}</div>
          <div className="px-4 sm:px-5 py-3 text-right">{isBn ? 'পরিমাণ' : 'Amount'}</div>
        </div>

        <div className="divide-y divide-slate-100">
          {rows.map(([label, amount, expandable]) => (
            <div key={label} className="grid grid-cols-[minmax(0,1fr)_140px] sm:grid-cols-[minmax(0,1fr)_220px] items-center text-sm">
              <div className="px-4 sm:px-5 py-4">
                {expandable ? (
                  <span className="inline-flex items-center gap-2 font-semibold text-[#172033]">
                    <ChevronRight className="h-4 w-4 text-[#0B6FA4]" aria-hidden="true" />
                    {label}
                  </span>
                ) : (
                  <span className="font-semibold text-[#172033]">{label}</span>
                )}
              </div>
              <div className="px-4 sm:px-5 py-4 text-right font-semibold text-[#172033]">
                {formatLedgerNumber(amount)}
              </div>
            </div>
          ))}

          <div className="grid grid-cols-[minmax(0,1fr)_140px] sm:grid-cols-[minmax(0,1fr)_220px] items-center bg-slate-50 text-base">
            <div className="px-4 sm:px-5 py-4 font-bold text-[#172033]">{isBn ? 'মোট' : 'Total'}</div>
            <div className="px-4 sm:px-5 py-4 text-right font-bold text-[#0B6FA4]">{formatLedgerNumber(runtime.total)}</div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white px-5 py-4">
        <p className="text-sm font-medium text-[#5F6B7A]">
          {isBn ? 'বাম পাশের Menu ব্যবহার করে tax payment আপডেট করুন' : 'Update tax payment using Menu in left'}
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base font-bold text-[#172033]">{isBn ? 'সম্পন্ন?' : 'Done?'}</p>
          <button
            type="button"
            onClick={onGoToEReturn}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#006A4E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00553f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/30"
          >
            {isBn ? 'ই-রিটার্নে যান' : 'Go to eReturn'}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </section>
  );
};
