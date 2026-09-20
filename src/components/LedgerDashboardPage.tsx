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
  onViewPaymentStatus: () => void;
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

const ALL_DASHBOARD_ITEMS = [...SOURCE_TAX_ITEMS, ...AIT_ITEMS, ...OTHER_ITEMS];

export const LedgerDashboardPage: React.FC<LedgerDashboardPageProps> = ({
  lang,
  onSelectTab,
  onViewPaymentStatus,
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

  const composition = useMemo(() => {
    const total = runtime.total || 1;
    return [
      {
        id: 'source',
        label: isBn ? 'উৎস কর' : 'Source Tax',
        amount: runtime.sourceTax,
        share: (runtime.sourceTax / total) * 100,
        barClass: 'bg-[#006A4E]',
      },
      {
        id: 'ait',
        label: isBn ? 'AIT' : 'AIT',
        amount: runtime.advanceIncomeTax,
        share: (runtime.advanceIncomeTax / total) * 100,
        barClass: 'bg-[#0B6FA4]',
      },
      {
        id: 'other',
        label: isBn ? 'অন্যান্য কর ও সমন্বয়' : 'Other tax & adjustments',
        amount: otherTotal,
        share: (otherTotal / total) * 100,
        barClass: 'bg-[#C48600]',
      },
    ];
  }, [isBn, otherTotal, runtime.advanceIncomeTax, runtime.sourceTax, runtime.total]);

  const categoriesWithAmount = useMemo(
    () =>
      ALL_DASHBOARD_ITEMS.filter(
        (item) => (runtime.categoryAmounts[item.id] ?? 0) > 0
      ),
    [runtime.categoryAmounts]
  );

  const zeroAmountCategories = useMemo(
    () =>
      ALL_DASHBOARD_ITEMS.filter(
        (item) => (runtime.categoryAmounts[item.id] ?? 0) === 0
      ),
    [runtime.categoryAmounts]
  );

  const summaryCards = [
    {
      id: 'source',
      label: isBn ? 'উৎস কর' : 'Source Tax',
      amount: runtime.sourceTax,
      meta: isBn ? '৯টি ক্যাটাগরি' : '9 categories',
      icon: Receipt,
      tone: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      share: composition[0].share,
    },
    {
      id: 'ait',
      label: isBn ? 'অগ্রিম আয়কর (AIT)' : 'Advance Income Tax (AIT)',
      amount: runtime.advanceIncomeTax,
      meta: isBn ? '২টি ক্যাটাগরি' : '2 categories',
      icon: Car,
      tone: 'bg-sky-50 text-[#0B6FA4] border-sky-100',
      share: composition[1].share,
    },
    {
      id: 'other',
      label: isBn ? 'অন্যান্য কর ও সমন্বয়' : 'Other tax & adjustments',
      amount: otherTotal,
      meta: isBn ? '৪টি ক্যাটাগরি' : '4 categories',
      icon: ShieldCheck,
      tone: 'bg-amber-50 text-amber-700 border-amber-100',
      share: composition[2].share,
    },
    {
      id: 'total',
      label: isBn ? 'লেজারের মোট পরিমাণ' : 'Ledger total',
      amount: runtime.total,
      meta: isBn ? 'বর্তমান লেজার ডেটা' : 'Current Ledger data',
      icon: FileCheck2,
      tone: 'bg-[#EAF4FA] text-[#0B6FA4] border-[#CFE3EF]',
      share: 100,
    },
  ];

  const renderGroup = (
    title: string,
    items: DashboardCategory[],
    groupTotal: number,
    description: string
  ) => (
    <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-4 py-4">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#172033]">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-[#6B778A]">{description}</p>
        </div>
        <div className="shrink-0 text-right">
          <strong className="block text-sm font-bold tabular-nums text-[#172033]">
            {formatLedgerNumber(groupTotal)}
          </strong>
          <span className="mt-0.5 block text-[11px] text-[#7A8698]">
            {isBn ? `${items.length}টি ক্যাটাগরি` : `${items.length} categories`}
          </span>
        </div>
      </div>

      <div className="divide-y divide-[#EDF1F5]">
        {items.map((item) => {
          const amount = runtime.categoryAmounts[item.id] ?? 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0B6FA4]/30"
            >
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-[#5F6B7A] group-hover:text-[#172033]">
                  {isBn ? item.bn : item.en}
                </span>
                {amount === 0 && (
                  <span className="mt-0.5 block text-[10px] font-medium text-[#8A94A3]">
                    {isBn ? 'বর্তমানে কোনো পরিমাণ নেই' : 'No amount currently recorded'}
                  </span>
                )}
              </span>
              <span className="inline-flex items-center gap-2">
                <strong
                  className={`text-xs font-semibold tabular-nums ${
                    amount === 0 ? 'text-[#8A94A3]' : 'text-[#263247]'
                  }`}
                >
                  {formatLedgerNumber(amount)}
                </strong>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0B6FA4]" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );

  return (
    <section className="w-full space-y-5" aria-labelledby="ledger-dashboard-title">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#0B6FA4]">
            eReturn Ledger
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

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:self-auto">
          <button
            type="button"
            onClick={onViewPaymentStatus}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#AFC9D8] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B6FA4] hover:bg-[#F5FAFD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
          >
            <FileCheck2 className="h-4 w-4" />
            {isBn ? 'Tax Payment Status দেখুন' : 'View Tax Payment Status'}
          </button>

          <button
            type="button"
            onClick={onGoToEReturn}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#006A4E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00553f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/30"
          >
            {isBn ? 'ই-রিটার্নে যান' : 'Go to eReturn'}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <section
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-label={isBn ? 'লেজার সারসংক্ষেপ' : 'Ledger summary'}
      >
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const isTotal = card.id === 'total';

          return (
            <div
              key={card.id}
              className={`rounded-xl border p-4.5 ${
                isTotal
                  ? 'border-[#BFD8E7] bg-[#F5FAFD]'
                  : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${card.tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-medium text-[#7A8698]">
                  {card.meta}
                </span>
              </div>

              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.055em] text-[#6B778A]">
                {card.label}
              </p>
              <p className={`mt-1.5 font-bold tracking-tight tabular-nums text-[#172033] ${isTotal ? 'text-[26px]' : 'text-2xl'}`}>
                {formatLedgerNumber(card.amount)}
              </p>

              {!isTotal && (
                <p className="mt-2 text-[11px] text-[#7A8698]">
                  {isBn
                    ? `লেজার মোটের ${card.share.toFixed(1)}%`
                    : `${card.share.toFixed(1)}% of Ledger total`}
                </p>
              )}
            </div>
          );
        })}
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-4 sm:px-5" aria-labelledby="composition-title">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 id="composition-title" className="text-sm font-bold text-[#172033]">
              {isBn ? 'লেজারের গঠন' : 'Ledger composition'}
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#6B778A]">
              {isBn
                ? `মোট ${ALL_DASHBOARD_ITEMS.length}টি ক্যাটাগরির মধ্যে ${categoriesWithAmount.length}টিতে বর্তমানে পরিমাণ আছে।`
                : `${categoriesWithAmount.length} of ${ALL_DASHBOARD_ITEMS.length} categories currently have an amount recorded.`}
            </p>
          </div>

          {zeroAmountCategories.length > 0 && (
            <button
              type="button"
              onClick={() => onSelectTab(zeroAmountCategories[0].id)}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#5F6B7A] hover:bg-slate-100 lg:self-auto"
            >
              <span>
                {isBn
                  ? `${zeroAmountCategories.length}টি ক্যাটাগরিতে কোনো পরিমাণ নেই`
                  : `${zeroAmountCategories.length} categor${zeroAmountCategories.length === 1 ? 'y has' : 'ies have'} no amount`}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
          {composition.map((item) => (
            <div
              key={item.id}
              className={item.barClass}
              style={{ width: `${item.share}%` }}
            />
          ))}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {composition.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
              <span className="inline-flex min-w-0 items-center gap-2 text-[#5F6B7A]">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.barClass}`} />
                <span className="truncate">{item.label}</span>
              </span>
              <strong className="shrink-0 font-semibold tabular-nums text-[#263247]">
                {item.share.toFixed(1)}%
              </strong>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.8fr)_320px] xl:items-start">
        {renderGroup(
          isBn ? 'উৎস করের ক্যাটাগরি' : 'Source Tax categories',
          SOURCE_TAX_ITEMS,
          runtime.sourceTax,
          isBn
            ? 'প্রতিটি উৎস কর ক্যাটাগরির বর্তমান দাবিকৃত পরিমাণ।'
            : 'Current claimed amount for each source-tax category.'
        )}

        <div className="space-y-4">
          {renderGroup(
            isBn ? 'AIT ক্যাটাগরি' : 'AIT categories',
            AIT_ITEMS,
            runtime.advanceIncomeTax,
            isBn
              ? 'বর্তমান AIT পরিমাণ এবং যাচাইযোগ্য ক্যাটাগরি।'
              : 'Current AIT amounts by available category.'
          )}

          {renderGroup(
            isBn ? 'অন্যান্য কর ও সমন্বয়' : 'Other tax & adjustments',
            OTHER_ITEMS,
            otherTotal,
            isBn
              ? 'রিটার্নের সাথে কর, সারচার্জ এবং সমন্বয়।'
              : 'Tax paid with return, surcharge and adjustments.'
          )}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24">
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-[#172033]">
                {isBn ? 'দ্রুত অ্যাকশন' : 'Quick actions'}
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#8A94A3]">
                {isBn ? 'লেজার' : 'Ledger'}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={onViewPaymentStatus}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#CFE3EF] bg-[#F5FAFD] px-3.5 py-3 text-left hover:bg-[#EEF6FA]"
              >
                <span>
                  <span className="block text-xs font-semibold text-[#0B6FA4]">
                    {isBn ? 'Tax Payment Status পর্যালোচনা করুন' : 'Review Tax Payment Status'}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[#6B778A]">
                    {isBn ? 'সব কর ও সমন্বয় একসাথে দেখুন' : 'Review all tax and adjustments together'}
                  </span>
                </span>
                <FileCheck2 className="h-4 w-4 shrink-0 text-[#0B6FA4]" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('salary-ibas')}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] px-3.5 py-3 text-left hover:bg-slate-50"
              >
                <span>
                  <span className="block text-xs font-semibold text-[#172033]">
                    {isBn ? 'উৎস কর আপডেট করুন' : 'Update Source Tax'}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[#6B778A]">
                    {isBn ? 'বেতন (iBAS++) থেকে শুরু করুন' : 'Start with Salary (iBAS++)'}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('ait-car')}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] px-3.5 py-3 text-left hover:bg-slate-50"
              >
                <span>
                  <span className="block text-xs font-semibold text-[#172033]">
                    {isBn ? 'AIT আপডেট করুন' : 'Update AIT'}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[#6B778A]">
                    {isBn ? 'গাড়ির উপর AIT থেকে শুরু করুন' : 'Start with AIT on Car'}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
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
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            </div>
          </section>


        </aside>
      </div>
    </section>
  );
};
