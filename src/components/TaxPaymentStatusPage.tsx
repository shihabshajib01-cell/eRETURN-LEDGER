import React from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import {
  VERIFIED_LEDGER_TOTALS,
  OTHER_TAX_CREDITS_TOTAL,
  TOTAL_AVAILABLE_TAX_CREDIT,
  formatBDT,
} from '../data/mockTaxData';

interface TaxPaymentStatusPageProps {
  lang: Language;
  onBack: () => void;
  onGoToEReturn: () => void;
}

const rows = [
  ['Source Tax', VERIFIED_LEDGER_TOTALS.sourceTax],
  ['Advance Income Tax (AIT)', VERIFIED_LEDGER_TOTALS.advanceIncomeTax],
  ['Tax Paid With Return', VERIFIED_LEDGER_TOTALS.taxPaidWithReturn],
  ['Environmental Surcharge', VERIFIED_LEDGER_TOTALS.environmentalSurcharge],
  ['Adjustment of Tax Refund', VERIFIED_LEDGER_TOTALS.adjustmentOfTaxRefund],
  ['Adjustment of carry forward tax u/s 163', VERIFIED_LEDGER_TOTALS.carryForwardTax],
] as const;

export const TaxPaymentStatusPage: React.FC<TaxPaymentStatusPageProps> = ({ lang, onBack, onGoToEReturn }) => {
  return (
    <section className="space-y-5" aria-labelledby="payment-status-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B6FA4] hover:underline mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 rounded">
            <ArrowLeft className="w-3.5 h-3.5" />
            {lang === 'bn' ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}
          </button>
          <h1 id="payment-status-title" className="text-2xl lg:text-[28px] font-bold text-[#172033] tracking-tight">
            {lang === 'bn' ? 'কর পরিশোধের বিবরণী' : 'Tax Payment Status'}
          </h1>
          <p className="text-sm text-[#5F6B7A] mt-1 max-w-2xl">
            {lang === 'bn'
              ? 'বর্তমান লেজার স্ক্রিনে দেখানো কর পেমেন্ট ও ক্রেডিটসমূহ পর্যালোচনা করুন।'
              : 'Review the tax payments and credits shown in the current Ledger before returning to eReturn.'}
          </p>
        </div>
        <button type="button" onClick={onGoToEReturn} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#006A4E] text-white text-sm font-semibold hover:bg-[#00553f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/30 self-start sm:self-auto">
          {lang === 'bn' ? 'ই-রিটার্নে যান' : 'Go to eReturn'}
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-[#F0F7FB] border border-[#0B6FA4]/25 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#0B6FA4]">{lang === 'bn' ? 'মোট কর ক্রেডিট' : 'Total Available Tax Credit'}</p>
            <p className="text-3xl font-bold text-[#0B6FA4] mt-2">{formatBDT(TOTAL_AVAILABLE_TAX_CREDIT)}</p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 self-start">
            <CheckCircle2 className="w-4 h-4" />
            {lang === 'bn' ? 'বর্তমান স্ক্রিনের মোটের সাথে মিলেছে' : 'Matches the current Ledger total'}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-bold text-[#172033]">{lang === 'bn' ? 'ক্রেডিটের বিবরণ' : 'Credit Breakdown'}</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {rows.map(([label, amount]) => (
            <div key={label} className="px-5 py-4 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-[#172033]">{label}</span>
              <span className="text-sm font-bold text-[#172033] whitespace-nowrap">{formatBDT(amount)}</span>
            </div>
          ))}
          <div className="px-5 py-4 bg-slate-50 flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-bold text-[#172033]">{lang === 'bn' ? 'অন্যান্য কর ক্রেডিট মোট' : 'Other Tax Credits Total'}</span>
              <p className="text-xs text-[#5F6B7A] mt-0.5">173 + surcharge + refund adjustment + carry-forward</p>
            </div>
            <span className="text-base font-bold text-[#172033] whitespace-nowrap">{formatBDT(OTHER_TAX_CREDITS_TOTAL)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
