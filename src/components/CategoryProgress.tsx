import React from 'react';
import { ArrowRight, Receipt, Car, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { ALL_TAX_CATEGORIES } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface CategoryProgressProps {
  lang: Language;
  onViewAllCategories: () => void;
}

export const CategoryProgress: React.FC<CategoryProgressProps> = ({ lang, onViewAllCategories }) => {
  const t = TRANSLATIONS[lang];
  const sourceTaxCount = ALL_TAX_CATEGORIES.filter((item) => item.group === 'SOURCE_TAX').length;
  const aitCount = ALL_TAX_CATEGORIES.filter((item) => item.group === 'AIT').length;
  const otherCount = ALL_TAX_CATEGORIES.filter((item) => item.group === 'OTHER_CREDITS').length;

  return (
    <div
      id="panel-category-progress"
      className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-2xs h-full"
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-[#172033] tracking-tight">
              {lang === 'bn' ? 'লেজার ক্যাটাগরি' : 'Ledger Categories'}
            </h2>
            <p className="text-xs text-[#5F6B7A] mt-0.5">
              {lang === 'bn'
                ? 'বর্তমান লেজারের যাচাইকৃত নেভিগেশন কাঠামো'
                : 'Current verified Ledger navigation structure'}
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {ALL_TAX_CATEGORIES.length}
          </span>
        </div>

        <div className="py-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#172033]">{t.claimSourceTax}</div>
                <div className="text-xs text-[#5F6B7A]">
                  {lang === 'bn' ? 'বর্তমান উৎস কর বিভাগ' : 'Current source-tax categories'}
                </div>
              </div>
            </div>
            <span className="text-sm font-bold text-[#172033]">{sourceTaxCount}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0B6FA4] flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#172033]">{t.advanceIncomeTax}</div>
                <div className="text-xs text-[#5F6B7A]">
                  {lang === 'bn' ? 'বর্তমান অগ্রিম আয়কর বিভাগ' : 'Current advance-income-tax categories'}
                </div>
              </div>
            </div>
            <span className="text-sm font-bold text-[#172033]">{aitCount}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#172033]">{t.otherTaxCredits}</div>
                <div className="text-xs text-[#5F6B7A]">
                  {lang === 'bn' ? 'অন্যান্য বর্তমান কর ক্রেডিট' : 'Other current tax-credit categories'}
                </div>
              </div>
            </div>
            <span className="text-sm font-bold text-[#172033]">{otherCount}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <button
          id="btn-view-all-categories"
          onClick={onViewAllCategories}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#0B6FA4] hover:text-[#084c72] hover:bg-blue-50/50 py-2 px-2 rounded transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"
        >
          <span>{t.viewAllCategories}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
