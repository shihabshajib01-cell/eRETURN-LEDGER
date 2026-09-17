import React from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Info } from 'lucide-react';
import { Language } from '../types';
import { TAX_PAYMENT_STATUS_ITEMS, TOTAL_AVAILABLE_TAX_CREDIT } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface TaxPaymentStatusPageProps {
  lang: Language;
  assessmentYear: string;
  onNavigate: (target: string) => void;
  onGoToEReturn: () => void;
}

export const TaxPaymentStatusPage: React.FC<TaxPaymentStatusPageProps> = ({
  lang,
  assessmentYear,
  onNavigate,
  onGoToEReturn,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="mb-3 inline-flex items-center gap-1.5 rounded-md text-xs font-semibold text-[#0B6FA4] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {t.backToDashboard}
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-[#172033]">{t.taxPaymentStatus}</h1>
          <p className="mt-2 text-sm text-[#5F6B7A]">{t.taxStatusSubtitle}</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
          {t.assessmentYear}: {assessmentYear}
        </span>
      </section>

      <section className="rounded-xl border border-[#0B6FA4]/30 bg-[#F0F7FB] p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0B6FA4]">{t.currentLedgerTotal}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-[#0B6FA4]">৳ 1,65,61,066</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {TOTAL_AVAILABLE_TAX_CREDIT.toLocaleString('en-IN') === '1,65,61,066'
              ? lang === 'bn'
                ? 'বিভাজনের মোটের সাথে মিলেছে'
                : 'Matches breakdown total'
              : lang === 'bn'
                ? 'মোট পুনরায় পরীক্ষা করুন'
                : 'Recheck total'}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_auto] gap-4 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#5F6B7A]">
          <span>{t.particulars}</span>
          <span>{t.amount}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {TAX_PAYMENT_STATUS_ITEMS.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4">
              <span className="text-sm font-semibold text-[#172033]">
                {lang === 'bn' ? item.labelBn : item.label}
              </span>
              <span className="text-sm font-bold tabular-nums text-[#172033]">{item.formattedAmount}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-[#0B6FA4]/20 bg-[#F0F7FB] px-5 py-4">
          <span className="text-sm font-bold text-[#0B6FA4]">{t.total}</span>
          <span className="text-lg font-bold tabular-nums text-[#0B6FA4]">৳ 1,65,61,066</span>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#0B6FA4]" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-[#172033]">{t.prototypeNotice}</p>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#5F6B7A]">{t.handoffNotice}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoToEReturn}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#006A4E] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#00573F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006A4E] focus-visible:ring-offset-2"
        >
          {t.continueToEReturn}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
};
