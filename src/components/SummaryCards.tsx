import React from 'react';
import { Receipt, Car, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { SUMMARY_CARDS } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface SummaryCardsProps {
  lang: Language;
  onCardClick?: (cardId: string) => void;
}

const iconFor = (id: string) => {
  if (id === 'source-tax') return Receipt;
  if (id === 'ait') return Car;
  return ShieldCheck;
};

export const SummaryCards: React.FC<SummaryCardsProps> = ({ lang, onCardClick }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div id="summary-cards-container" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {SUMMARY_CARDS.map((card) => {
        const Icon = iconFor(card.id);
        const highlighted = card.id === 'total-credit';
        const title =
          card.id === 'source-tax' ? t.sourceTax :
          card.id === 'ait' ? t.ait :
          card.id === 'other-credits' ? t.otherCredits : t.totalCredit;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onCardClick?.(card.id)}
            className={`text-left rounded-xl p-5 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40 ${
              highlighted
                ? 'bg-[#F0F7FB] border-2 border-[#0B6FA4]/30 hover:border-[#0B6FA4]'
                : 'bg-white border border-[#E2E8F0] hover:border-slate-300'
            }`}
            aria-label={`${title}: ${card.formattedAmount}`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  highlighted ? 'bg-[#0B6FA4] text-white' :
                  card.id === 'source-tax' ? 'bg-emerald-50 text-emerald-700' :
                  card.id === 'ait' ? 'bg-blue-50 text-[#0B6FA4]' : 'bg-violet-50 text-violet-700'
                }`}>
                  {highlighted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold uppercase tracking-wide ${highlighted ? 'text-[#0B6FA4]' : 'text-[#5F6B7A]'}`}>
                    {title}
                  </div>
                  {highlighted && (
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      {lang === 'bn' ? 'বর্তমান ট্যাক্স পেমেন্ট স্ট্যাটাস অনুযায়ী' : 'Matches current Tax Payment Status'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`font-bold text-2xl tracking-tight mb-3 ${highlighted ? 'text-[#0B6FA4]' : 'text-[#172033]'}`}>
              {card.formattedAmount}
            </div>

            <div className={`pt-3 border-t flex items-center justify-between gap-3 text-xs ${highlighted ? 'border-blue-200/60' : 'border-slate-100'}`}>
              <span className="text-[#5F6B7A] leading-snug">{card.supportingText}</span>
              <ArrowRight className={`w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform ${highlighted ? 'text-[#0B6FA4]' : 'text-slate-400'}`} />
            </div>
          </button>
        );
      })}
    </div>
  );
};
