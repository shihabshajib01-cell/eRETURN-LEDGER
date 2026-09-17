import React from 'react';
import { 
  Receipt, 
  Car, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { SUMMARY_CARDS } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface SummaryCardsProps {
  lang: Language;
  onCardClick?: (cardId: string) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ lang, onCardClick }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div 
      id="summary-cards-container"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5"
    >
      {/* CARD 1: Source Tax */}
      <div 
        id="card-source-tax"
        onClick={() => onCardClick?.('source-tax')}
        className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between shadow-2xs group"
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#5F6B7A] uppercase tracking-wide">
                {t.sourceTax}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {t.statComplete}
            </span>
          </div>

          <div className="font-bold text-2xl text-[#172033] tracking-tight font-mono mb-2">
            ৳ 1,33,09,693
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#5F6B7A]">
          <span>
            {lang === 'bn' ? '৮টি ক্যাটাগরি • ১৪২ রেকর্ড' : 'From 8 categories • 142 records'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B6FA4] group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* CARD 2: Advance Income Tax (AIT) */}
      <div 
        id="card-advance-tax"
        onClick={() => onCardClick?.('ait')}
        className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between shadow-2xs group"
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0B6FA4] border border-blue-100 flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#5F6B7A] uppercase tracking-wide">
                {t.ait}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {t.statComplete}
            </span>
          </div>

          <div className="font-bold text-2xl text-[#172033] tracking-tight font-mono mb-2">
            ৳ 1,90,365
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#5F6B7A]">
          <span>
            {lang === 'bn' ? '২টি ক্যাটাগরি • ১৮ রেকর্ড' : '2 categories • 18 records'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B6FA4] group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* CARD 3: Other Tax Credits */}
      <div 
        id="card-other-credits"
        onClick={() => onCardClick?.('other-credits')}
        className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between shadow-2xs group"
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#5F6B7A] uppercase tracking-wide">
                {t.otherCredits}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/90">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              {t.statReview}
            </span>
          </div>

          <div className="font-bold text-2xl text-[#172033] tracking-tight font-mono mb-2">
            ৳ 31,07,675
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#5F6B7A]">
          <span>
            {lang === 'bn' ? '৪টি ক্যাটাগরি • ৩২ রেকর্ড' : '4 categories • 32 records'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B6FA4] group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* CARD 4: Total Available Tax Credit (Most Important Card) */}
      <div 
        id="card-total-available-credit"
        onClick={() => onCardClick?.('total-credit')}
        className="bg-[#F0F7FB] border-2 border-[#0B6FA4]/30 rounded-xl p-5 hover:border-[#0B6FA4] transition-all cursor-pointer flex flex-col justify-between shadow-xs relative overflow-hidden group"
      >
        {/* Subtle institutional corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#0B6FA4]/5 rounded-bl-full pointer-events-none"></div>

        <div>
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B6FA4] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0B6FA4] uppercase tracking-wider block leading-tight">
                  {t.totalCredit}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  {t.readyToUse}
                </span>
              </div>
            </div>
          </div>

          <div className="font-bold text-[26px] text-[#0B6FA4] tracking-tight font-mono mt-1 mb-1.5">
            ৳ 1,65,61,066
          </div>
        </div>

        <div className="pt-2.5 border-t border-blue-200/60 flex items-center justify-between text-xs text-[#5F6B7A]">
          <span className="text-[11.5px] leading-tight">
            {t.allCreditsSummarized}
          </span>
          <ArrowRight className="w-4 h-4 text-[#0B6FA4] group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>
      </div>
    </div>
  );
};
