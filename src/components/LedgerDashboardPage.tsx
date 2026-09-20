import React, { useMemo } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Car,
  FileCheck2,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../types';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber } from '../utils/money';

interface LedgerDashboardPageProps {
  lang: Language;
  onSelectTab: (tab: string) => void;
  onGoToEReturn: () => void;
}

type DashboardCategory = {
  id: string;
  en: string;
  bn: string;
};

const SOURCE_TAX_ITEMS: DashboardCategory[] = [
  { id: 'salary-ibas', en: 'Salary (iBAS++)', bn: 'বেতন (iBAS++)' },
  { id: 'salary-other', en: 'Salary (Others)', bn: 'বেতন (অন্যান্য)' },
  { id: 'bank-fi', en: 'Bank/FI Interest/Profit', bn: 'ব্যাংক/এফআই সুদ/মুনাফা' },
  { id: 'dividend', en: 'Dividend', bn: 'লভ্যাংশ' },
  { id: 'service-payment', en: 'Service Payment', bn: 'সেবা পেমেন্ট' },
  { id: 'sanchayapatra', en: 'Sanchayapatra', bn: 'সঞ্চয়পত্র' },
  { id: 'import', en: 'Import', bn: 'আমদানি' },
  { id: 'commercial-vehicle', en: 'Commercial Vehicle', bn: 'বাণিজ্যিক যানবাহন' },
  { id: 'other-tds', en: 'Others', bn: 'অন্যান্য' },
];

const AIT_ITEMS: DashboardCategory[] = [
  { id: 'ait-car', en: 'AIT on Car', bn: 'গাড়ির উপর AIT' },
  { id: 'ait-154', en: 'AIT (154)', bn: 'AIT (154)' },
];

const OTHER_ITEMS: DashboardCategory[] = [
  { id: 'tax-paid-return', en: 'Tax Paid with Return (173)', bn: 'রিটার্নের সাথে প্রদত্ত কর (১৭৩)' },
  { id: 'environmental-surcharge', en: 'Environmental Surcharge', bn: 'পরিবেশ সারচার্জ' },
  { id: 'tax-refund', en: 'Adjustment of Tax Refund', bn: 'কর রিফান্ড সমন্বয়' },
  { id: 'carry-forward', en: 'Carry Forward Tax u/s 163', bn: 'ধারা ১৬৩ অনুযায়ী জের টানা কর' },
];

export const LedgerDashboardPage: React.FC<LedgerDashboardPageProps> = ({
  lang,
  onSelectTab,
  onGoToEReturn,
}) => {
  const isBn = lang === 'bn';
  const runtime = useLedgerRuntime();

  const otherTotal = useMemo(
    () =>
      runtime.taxPaidWithReturn +
      runtime.environmentalSurcharge +
      runtime.adjustmentOfTaxRefund +
      runtime.carryForwardTax,
    [
      runtime.taxPaidWithReturn,
      runtime.environmentalSurcharge,
      runtime.adjustmentOfTaxRefund,
      runtime.carryForwardTax,
    ]
  );

  const summaryCards = [
    {
      id: 'source',
      label: isBn ? 'উৎস কর' : 'Source Tax',
      amount: runtime.sourceTax,
      meta: isBn ? '৯টি ক্যাটাগরি' : '9 categories',
      icon: Receipt,
      tone: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      id: 'ait',
      label: isBn ? 'অগ্রিম আয়কর (AIT)' : 'Advance Income Tax (AIT)',
      amount: runtime.advanceIncomeTax,
      meta: isBn ? '২টি ক্যাটাগরি' : '2 categories',
      icon: Car,
      tone: 'bg-sky-50 text-[#0B6FA4] border-sky-100',
    },
    {
      id: 'other',
      label: isBn ? 'অন্যান্য কর ও সমন্বয়' : 'Other tax & adjustments',
      amount: otherTotal,
      meta: isBn ? '৪টি ক্যাটাগরি' : '4 categories',
      icon: ShieldCheck,
      tone: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    {
      id: 'total',
      label: isBn ? 'লেজারের মোট পরিমাণ' : 'Ledger total',
      amount: runtime.total,
      meta: isBn ? 'বর্তমান লেজার ডেটা' : 'Current Ledger data',
      icon: FileCheck2,
      tone: 'bg-[#EEF6FA] text-[#0B6FA4] border-[#D7E8F2]',
    },
  ];

  const renderGroup = (
    title: string,
    items: DashboardCategory[],
    groupTotal: number
  ) => (
    <section className="rounded-xl border border-[#E2E8F0] bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] px-4 py-3.5">
        <div>
          <h2 className="text-sm font-bold text-[#172033]">{title}</h2>
          <p className="mt-0.5 text-xs text-[#6B778A]">
            {isBn ? `${items.length}টি ক্যাটাগরি` : `${items.length} categories`}
          </p>
        </div>
        <strong className="text-sm font-bold tabular-nums text-[#172033]">
          {formatLedgerNumber(groupTotal)}
        </strong>
      </div>

      <div className="divide-y divide-[#EDF1F5]">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0B6FA4]/30"
          >
            <span className="min-w-0 truncate text-xs font-medium text-[#5F6B7A] group-hover:text-[#172033]">
              {isBn ? item.bn : item.en}
            </span>
            <span className="inline-flex items-center gap-2">
              <strong className="text-xs font-semibold tabular-nums text-[#263247]">
                {formatLedgerNumber(runtime.categoryAmounts[item.id] ?? 0)}
              </strong>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0B6FA4]" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <section className="w-full space-y-5" aria-labelledby="ledger-dashboard-title">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#0B6FA4]">
            {isBn ? 'eReturn Ledger' : 'eReturn Ledger'}
          </p>
          <h1
            id="ledger-dashboard-title"
            className="mt-1 text-2xl font-bold tracking-tight text-[#172033] lg:text-[28px]"
          >
            {isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-[#5F6B7A]">
            {isBn
              ? 'বর্তমান লেজারের কর, AIT, সমন্বয় এবং মোট পরিমাণ এক নজরে দেখুন।'
              : 'See the current Ledger tax, AIT, adjustments and total amount at a glance.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#C8D4E1] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B6FA4] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 lg:self-auto"
        >
          <FileCheck2 className="h-4 w-4" />
          {isBn ? 'Tax Payment Status দেখুন' : 'View Tax Payment Status'}
        </button>
      </header>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label={isBn ? 'লেজার সারসংক্ষেপ' : 'Ledger summary'}
      >
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="rounded-xl border border-[#E2E8F0] bg-white p-4.5">
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${card.tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-medium text-[#7A8698]">{card.meta}</span>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.04em] text-[#6B778A]">
                {card.label}
              </p>
              <p className="mt-1.5 text-2xl font-bold tracking-tight tabular-nums text-[#172033]">
                {formatLedgerNumber(card.amount)}
              </p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="grid gap-4 lg:grid-cols-2">
          {renderGroup(
            isBn ? 'উৎস করের ক্যাটাগরি' : 'Source Tax categories',
            SOURCE_TAX_ITEMS,
            runtime.sourceTax
          )}
          {renderGroup(
            isBn ? 'AIT ক্যাটাগরি' : 'AIT categories',
            AIT_ITEMS,
            runtime.advanceIncomeTax
          )}
          <div className="lg:col-span-2">
            {renderGroup(
              isBn ? 'অন্যান্য কর ও সমন্বয়' : 'Other tax & adjustments',
              OTHER_ITEMS,
              otherTotal
            )}
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24">
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <h2 className="text-sm font-bold text-[#172033]">
              {isBn ? 'দ্রুত অ্যাকশন' : 'Quick actions'}
            </h2>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => onSelectTab('salary-ibas')}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] px-3.5 py-3 text-left hover:bg-slate-50"
              >
                <span>
                  <span className="block text-xs font-semibold text-[#172033]">
                    {isBn ? 'উৎস কর দাবি করুন' : 'Claim Source Tax'}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[#6B778A]">
                    {isBn ? 'বেতন (iBAS++) থেকে শুরু করুন' : 'Start with Salary (iBAS++)'}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('ait-car')}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] px-3.5 py-3 text-left hover:bg-slate-50"
              >
                <span>
                  <span className="block text-xs font-semibold text-[#172033]">
                    {isBn ? 'AIT দাবি করুন' : 'Claim AIT'}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[#6B778A]">
                    {isBn ? 'গাড়ির উপর AIT থেকে শুরু করুন' : 'Start with AIT on Car'}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('ledger-guide')}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] px-3.5 py-3 text-left hover:bg-slate-50"
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#172033]">
                  <BookOpen className="h-4 w-4 text-[#0B6FA4]" />
                  {isBn ? 'লেজার নির্দেশিকা' : 'Ledger Guide'}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-[#D8E4EA] bg-[#F3F8F6] p-5">
            <h2 className="text-sm font-bold text-[#172033]">
              {isBn ? 'eReturn-এ ফিরে যেতে প্রস্তুত?' : 'Ready to return to eReturn?'}
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-[#5F6B7A]">
              {isBn
                ? 'আগে Home থেকে Tax Payment Status পর্যালোচনা করুন। তথ্য ঠিক থাকলে eReturn-এ ফিরে যান।'
                : 'Review Tax Payment Status from Home first. If the amounts are correct, return to eReturn.'}
            </p>
            <button
              type="button"
              onClick={onGoToEReturn}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#006A4E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00553f]"
            >
              {isBn ? 'ই-রিটার্নে যান' : 'Go to eReturn'}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </section>
        </aside>
      </div>
    </section>
  );
};
