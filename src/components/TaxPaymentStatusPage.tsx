import React, { useState } from 'react';
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
  const [expanded, setExpanded] = useState<'source' | 'ait' | null>(null);

  const rows = [
    [isBn ? 'উৎস কর' : 'Source Tax', runtime.sourceTax, 'source'],
    [isBn ? 'অগ্রিম আয়কর (AIT)' : 'Advance Income Tax (AIT)', runtime.advanceIncomeTax, 'ait'],
    [isBn ? 'রিটার্নের সাথে প্রদত্ত কর' : 'Tax Paid With Return', runtime.taxPaidWithReturn, null],
    [isBn ? 'পরিবেশ সারচার্জ' : 'Environmental Surcharge', runtime.environmentalSurcharge, null],
    [isBn ? 'কর রিফান্ড সমন্বয়' : 'Adjustment of Tax Refund', runtime.adjustmentOfTaxRefund, null],
    [isBn ? 'ধারা ১৬৩ অনুযায়ী জের টানা কর সমন্বয়' : 'Adjustment of carry forward tax u/s 163', runtime.carryForwardTax, null],
  ] as const;

  const groupItems = {
    source: isBn
      ? ['বেতন (iBAS++)', 'বেতন (অন্যান্য)', 'ব্যাংক/এফআই সুদ/মুনাফা', 'লভ্যাংশ', 'সেবা পেমেন্ট', 'সঞ্চয়পত্র', 'আমদানি', 'বাণিজ্যিক যানবাহন', 'অন্যান্য']
      : ['Salary (iBAS++)', 'Salary (Others)', 'Bank/FI Interest/Profit', 'Dividend', 'Service Payment', 'Sanchayapatra', 'Import', 'Commercial Vehicle', 'Others'],
    ait: isBn
      ? ['গাড়ির উপর AIT', 'AIT (154)']
      : ['AIT on Car', 'AIT (154)'],
  };

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
          {rows.map(([label, amount, group]) => (
            <div key={label}>
              <div className="grid grid-cols-[minmax(0,1fr)_140px] sm:grid-cols-[minmax(0,1fr)_220px] items-center text-sm">
                <div className="px-4 sm:px-5 py-4">
                  {group ? (
                    <button
                      type="button"
                      onClick={() => setExpanded((current) => current === group ? null : group)}
                      aria-expanded={expanded === group}
                      className="inline-flex items-center gap-2 rounded font-semibold text-[#172033] hover:text-[#0B6FA4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
                    >
                      <ChevronRight className={`h-4 w-4 text-[#0B6FA4] transition-transform ${expanded === group ? 'rotate-90' : ''}`} aria-hidden="true" />
                      {label}
                    </button>
                  ) : (
                    <span className="font-semibold text-[#172033]">{label}</span>
                  )}
                </div>
                <div className="px-4 sm:px-5 py-4 text-right font-semibold text-[#172033]">
                  {formatLedgerNumber(amount)}
                </div>
              </div>

              {group && expanded === group && (
                <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3">
                  <div className="flex flex-wrap gap-2">
                    {groupItems[group].map((item) => (
                      <span key={item} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-[#5F6B7A]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
