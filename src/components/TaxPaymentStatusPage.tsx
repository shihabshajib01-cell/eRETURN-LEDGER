import React, { useState } from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber } from '../utils/money';

interface TaxPaymentStatusPageProps {
  lang: Language;
  onBack: () => void;
  onGoToEReturn: () => void;
  showHeader?: boolean;
  showTotalRow?: boolean;
  showSidebar?: boolean;
}

type ExpandableGroup = 'source' | 'ait';

export const TaxPaymentStatusPage: React.FC<TaxPaymentStatusPageProps> = ({
  lang,
  onGoToEReturn,
  showHeader = true,
  showTotalRow = true,
  showSidebar = true,
}) => {
  const isBn = lang === 'bn';
  const runtime = useLedgerRuntime();
  const [expanded, setExpanded] = useState<ExpandableGroup | null>(null);

  const rows = [
    [isBn ? 'উৎস কর' : 'Source Tax', runtime.sourceTax, 'source'],
    [isBn ? 'অগ্রিম আয়কর (AIT)' : 'Advance Income Tax (AIT)', runtime.advanceIncomeTax, 'ait'],
    [isBn ? 'রিটার্নের সাথে প্রদত্ত কর' : 'Tax Paid With Return', runtime.taxPaidWithReturn, null],
    [isBn ? 'পরিবেশ সারচার্জ' : 'Environmental Surcharge', runtime.environmentalSurcharge, null],
    [isBn ? 'কর রিফান্ড সমন্বয়' : 'Adjustment of Tax Refund', runtime.adjustmentOfTaxRefund, null],
    [isBn ? 'ধারা ১৬৩ অনুযায়ী জের টানা কর সমন্বয়' : 'Adjustment of carry forward tax u/s 163', runtime.carryForwardTax, null],
  ] as const;

  const groupItems = {
    source: [
      { id: 'salary-ibas', label: isBn ? 'বেতন (iBAS++)' : 'Salary (iBAS++)' },
      { id: 'salary-other', label: isBn ? 'বেতন (অন্যান্য)' : 'Salary (Others)' },
      { id: 'bank-fi', label: isBn ? 'ব্যাংক/এফআই সুদ/মুনাফা' : 'Bank/FI Interest/Profit' },
      { id: 'dividend', label: isBn ? 'লভ্যাংশ' : 'Dividend' },
      { id: 'service-payment', label: isBn ? 'সেবা পেমেন্ট' : 'Service Payment' },
      { id: 'sanchayapatra', label: isBn ? 'সঞ্চয়পত্র' : 'Sanchayapatra' },
      { id: 'import', label: isBn ? 'আমদানি' : 'Import' },
      { id: 'commercial-vehicle', label: isBn ? 'বাণিজ্যিক যানবাহন' : 'Commercial Vehicle' },
      { id: 'other-tds', label: isBn ? 'অন্যান্য' : 'Others' },
    ],
    ait: [
      { id: 'ait-car', label: isBn ? 'গাড়ির উপর AIT' : 'AIT on Car' },
      { id: 'ait-154', label: isBn ? 'AIT (154)' : 'AIT (154)' },
    ],
  };

  const toggleGroup = (group: ExpandableGroup) => {
    setExpanded((current) => current === group ? null : group);
  };

  return (
    <section
      className="w-full space-y-5"
      aria-labelledby={showHeader ? 'payment-status-title' : undefined}
      aria-label={!showHeader ? (isBn ? 'কর পরিশোধের বিবরণী' : 'Tax Payment Status') : undefined}
    >
      {showHeader && (
        <header className="max-w-4xl">
          <h1 id="payment-status-title" className="text-2xl font-bold tracking-tight text-[#172033] lg:text-[28px]">
            {isBn ? 'কর পরিশোধের বিবরণী' : 'Tax Payment Status'}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-[#5F6B7A]">
            {isBn
              ? 'ই-রিটার্নে ফিরে যাওয়ার আগে এই লেজারে থাকা সব কর পরিশোধ, উৎস কর, AIT এবং সমন্বয়ের পরিমাণ পর্যালোচনা করুন।'
              : 'Review all tax payments, source tax, AIT and adjustments recorded in this Ledger before returning to eReturn.'}
          </p>
        </header>
      )}

      <div className={showSidebar ? 'grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start' : 'block'}>
        <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white" aria-labelledby="payment-breakdown-title">
          <div className="flex flex-col gap-1 border-b border-[#E2E8F0] px-4 py-4 sm:px-5">
            <h2 id="payment-breakdown-title" className="text-base font-bold text-[#172033]">
              {isBn ? 'কর পরিশোধের সারসংক্ষেপ' : 'Payment breakdown'}
            </h2>
            <p className="text-xs leading-5 text-[#5F6B7A]">
              {isBn
                ? 'উৎস কর ও AIT-এর বিস্তারিত দেখতে সারিতে ক্লিক করুন।'
                : 'Expand Source Tax or AIT to review the category-level amounts.'}
            </p>
          </div>

          <div className="hidden grid-cols-[minmax(0,1fr)_180px] border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold uppercase tracking-[0.04em] text-[#6B778A] sm:grid">
            <div className="px-5 py-3">{isBn ? 'বিবরণ' : 'Particulars'}</div>
            <div className="px-5 py-3 text-right">{isBn ? 'পরিমাণ' : 'Amount'}</div>
          </div>

          <div className="divide-y divide-[#EDF1F5]">
            {rows.map(([label, amount, group]) => {
              const expandable = group as ExpandableGroup | null;
              const isOpen = expandable ? expanded === expandable : false;
              const count = expandable ? groupItems[expandable].length : 0;

              return (
                <div key={label}>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_180px] sm:px-5">
                    <div className="min-w-0">
                      {expandable ? (
                        <button
                          type="button"
                          onClick={() => toggleGroup(expandable)}
                          aria-expanded={isOpen}
                          className="group flex w-full min-w-0 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#EEF6FA] text-[#0B6FA4]">
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-[#172033] group-hover:text-[#0B6FA4]">
                              {label}
                            </span>
                            <span className="mt-0.5 block text-xs text-[#7A8698]">
                              {isBn ? `${count}টি বিভাগ` : `${count} categories`}
                            </span>
                          </span>
                        </button>
                      ) : (
                        <span className="block text-sm font-semibold text-[#172033]">{label}</span>
                      )}
                    </div>

                    <div className="whitespace-nowrap text-right text-sm font-semibold tabular-nums text-[#172033]">
                      {formatLedgerNumber(amount)}
                    </div>
                  </div>

                  {expandable && isOpen && (
                    <div className="border-t border-[#EDF1F5] bg-[#F8FAFC] px-4 py-2 sm:px-5">
                      <div className="ml-0 divide-y divide-[#E6ECF2] sm:ml-10">
                        {groupItems[expandable].map((item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-2.5 sm:grid-cols-[minmax(0,1fr)_160px]"
                          >
                            <span className="text-xs font-medium text-[#5F6B7A]">{item.label}</span>
                            <strong className="text-right text-xs font-semibold tabular-nums text-[#263247]">
                              {formatLedgerNumber(runtime.categoryAmounts[item.id] ?? 0)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {showTotalRow && (
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-[#F4F8FB] px-4 py-4 sm:grid-cols-[minmax(0,1fr)_180px] sm:px-5">
                <div>
                  <p className="text-sm font-bold text-[#172033]">{isBn ? 'মোট' : 'Total'}</p>
                  <p className="mt-0.5 text-xs text-[#6B778A]">
                    {isBn ? 'বর্তমান লেজারের সব পরিমাণ' : 'All amounts currently recorded in this Ledger'}
                  </p>
                </div>
                <div className="whitespace-nowrap text-right text-lg font-bold tabular-nums text-[#0B6FA4]">
                  {formatLedgerNumber(runtime.total)}
                </div>
              </div>
            )}
          </div>
        </section>

        {showSidebar && (
        <aside className="rounded-xl border border-[#D8E4EA] bg-white p-5 xl:sticky xl:top-24" aria-labelledby="next-step-title">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6B778A]">
            {isBn ? 'বর্তমান মোট' : 'Current total'}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums text-[#172033]">
            {formatLedgerNumber(runtime.total)}
          </p>
          <p className="mt-2 text-xs leading-5 text-[#6B778A]">
            {isBn
              ? 'এই মোটটি উপরের বর্তমান লেজার এন্ট্রি থেকে গণনা করা হয়েছে।'
              : 'This total is calculated from the current Ledger entries shown on this page.'}
          </p>

          <div className="my-5 border-t border-[#E2E8F0]" />

          <h2 id="next-step-title" className="text-sm font-bold text-[#172033]">
            {isBn ? 'কিছু পরিবর্তন করতে হবে?' : 'Need to change anything?'}
          </h2>
          <p className="mt-1.5 text-xs leading-5 text-[#5F6B7A]">
            {isBn
              ? 'বাম পাশের মেনু থেকে সংশ্লিষ্ট কর বা সমন্বয়ের বিভাগ খুলে তথ্য আপডেট করুন।'
              : 'Open the relevant tax or adjustment category from the left menu and update the entry there.'}
          </p>

          <div className="mt-5 rounded-lg bg-[#F3F8F6] p-4">
            <p className="text-sm font-bold text-[#172033]">
              {isBn ? 'পর্যালোচনা শেষ?' : 'Finished reviewing?'}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#5F6B7A]">
              {isBn
                ? 'তথ্য ঠিক থাকলে ই-রিটার্নে ফিরে গিয়ে রিটার্নের কাজ চালিয়ে যান।'
                : 'If the amounts are correct, return to eReturn and continue the return process.'}
            </p>
            <button
              type="button"
              onClick={onGoToEReturn}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#006A4E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00553f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/30"
            >
              {isBn ? 'ই-রিটার্নে যান' : 'Go to eReturn'}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </aside>
        )}
      </div>
    </section>
  );
};
