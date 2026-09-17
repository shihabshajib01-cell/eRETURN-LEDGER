import React from 'react';
import { Banknote, CarFront, Landmark, WalletCards, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { SUMMARY_CARDS } from '../data/mockTaxData';

interface SummaryCardsProps {
  lang: Language;
  onCardClick?: (cardId: string) => void;
}

const iconMap = {
  'source-tax': Banknote,
  ait: CarFront,
  'other-credits': WalletCards,
  'total-credit': Landmark,
};

export const SummaryCards: React.FC<SummaryCardsProps> = ({ lang, onCardClick }) => (
  <div id="summary-cards-container" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {SUMMARY_CARDS.map((card) => {
      const Icon = iconMap[card.id];
      const title = lang === 'bn' ? card.titleBn : card.title;
      const supportingText = lang === 'bn' ? card.supportingTextBn : card.supportingText;

      return (
        <button
          key={card.id}
          type="button"
          onClick={() => onCardClick?.(card.id)}
          className={`w-full min-h-[168px] text-left rounded-xl border p-5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4] focus-visible:ring-offset-2 group ${
            card.isHighlighted
              ? 'bg-[#F0F7FB] border-[#0B6FA4]/40 hover:border-[#0B6FA4]'
              : 'bg-white border-[#E2E8F0] hover:border-slate-300 hover:shadow-sm'
          }`}
          aria-label={`${title}: ${card.formattedAmount}`}
        >
          <div className="flex h-full flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                    card.isHighlighted
                      ? 'bg-[#0B6FA4] border-[#0B6FA4] text-white'
                      : 'bg-slate-50 border-slate-200 text-[#0B6FA4]'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <ArrowRight
                  className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0B6FA4]"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#5F6B7A]">{title}</p>
              <p className={`mt-1 text-2xl font-bold tracking-tight ${card.isHighlighted ? 'text-[#0B6FA4]' : 'text-[#172033]'}`}>
                {card.formattedAmount}
              </p>
            </div>

            <p className="border-t border-slate-100 pt-3 text-xs leading-relaxed text-[#5F6B7A]">
              {supportingText}
            </p>
          </div>
        </button>
      );
    })}
  </div>
);
