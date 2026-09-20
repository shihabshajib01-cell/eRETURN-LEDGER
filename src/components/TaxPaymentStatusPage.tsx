import React from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { VERIFIED_LEDGER_TOTALS, TOTAL_AVAILABLE_TAX_CREDIT, formatBDT } from '../data/mockTaxData';

interface TaxPaymentStatusPageProps {
  lang: Language;
  onBack: () => void;
  onGoToEReturn: () => void;
}

const rows = [
  ['Source Tax', VERIFIED_LEDGER_TOTALS.sourceTax, true],
  ['Advance Income Tax', VERIFIED_LEDGER_TOTALS.advanceIncomeTax, true],
  ['Tax Paid With Return', VERIFIED_LEDGER_TOTALS.taxPaidWithReturn, false],
  ['Environmental Surcharge', VERIFIED_LEDGER_TOTALS.environmentalSurcharge, false],
  ['Adjustment of Tax Refund', VERIFIED_LEDGER_TOTALS.adjustmentOfTaxRefund, false],
  ['Adjustment of carry forward tax u/s 163', VERIFIED_LEDGER_TOTALS.carryForwardTax, false],
] as const;

export const TaxPaymentStatusPage: React.FC<TaxPaymentStatusPageProps> = ({ lang, onGoToEReturn }) => {
  const isBn = lang === 'bn';

  return (
    <section className="w-full space-y-4" aria-labelledby="payment-status-title">
      <header>
        <h1 id="payment-status-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
          {isBn ? 'কর পরিশোধের বিবরণী' : 'Tax Payment Status'}
        </h1>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="grid grid-cols-[minmax(0,1fr)_220px] border-b border-[#E2E8F0] bg-slate-50 text-sm font-semibold text-[#5F6B7A]">
          <div className="px-5 py-3">{isBn ? 'বিবরণ' : 'Particulars'}</div>
          <div className="px-5 py-3 text-right">{isBn ? 'পরিমাণ' : 'Amount'}</div>
        </div>

        <div className="divide-y divide-slate-100">
          {rows.map(([label, amount, expandable]) => (
            <div key={label}>
              <div className="grid grid-cols-[minmax(0,1fr)_220px] items-center text-sm">
                <div className="px-5 py-4">
                  {expandable ? (
                    <span className="inline-flex items-center gap-2 font-semibold text-[#172033]">
                      <ChevronRight className="h-4 w-4 text-[#0B6FA4]" aria-hidden="true" />
                      {label}
                    </span>
                  ) : (
                    <span className="font-semibold text-[#172033]">{label}</span>
                  )}
                </div>
                <div className="px-5 py-4 text-right font-semibold text-[#172033]">
                  {formatBDT(amount)}
                </div>
              </div>

            </div>
          ))}

          <div className="grid grid-cols-[minmax(0,1fr)_220px] items-center bg-slate-50 text-base">
            <div className="px-5 py-4 font-bold text-[#172033]">{isBn ? 'মোট' : 'Total'}</div>
            <div className="px-5 py-4 text-right font-bold text-[#0B6FA4]">{formatBDT(TOTAL_AVAILABLE_TAX_CREDIT)}</div>
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
