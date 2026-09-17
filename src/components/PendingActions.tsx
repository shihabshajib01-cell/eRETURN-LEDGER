import React from 'react';
import { Banknote, CarFront, WalletCards, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface PendingActionsProps {
  lang: Language;
  onNavigate: (target: string) => void;
}

export const PendingActions: React.FC<PendingActionsProps> = ({ lang, onNavigate }) => {
  const t = TRANSLATIONS[lang];
  const items = [
    {
      id: 'source-tax',
      title: t.sourceTax,
      description: t.sourceTaxReview,
      target: 'source-salary-ibas',
      Icon: Banknote,
    },
    {
      id: 'ait',
      title: t.ait,
      description: t.aitReview,
      target: 'ait-154',
      Icon: CarFront,
    },
    {
      id: 'other-credits',
      title: t.otherCredits,
      description: t.otherCreditsReview,
      target: 'other-173',
      Icon: WalletCards,
    },
  ];

  return (
    <section
      id="panel-review-areas"
      className="h-full rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
      aria-labelledby="review-areas-title"
    >
      <div className="border-b border-slate-100 pb-3">
        <h2 id="review-areas-title" className="text-lg font-bold text-[#172033]">{t.reviewAreas}</h2>
      </div>

      <div className="mt-2 divide-y divide-slate-100">
        {items.map(({ id, title, description, target, Icon }) => (
          <div key={id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#0B6FA4]">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#172033]">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#5F6B7A]">{description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate(target)}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#0B6FA4]/30 px-3 py-2 text-xs font-semibold text-[#0B6FA4] transition-colors hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]"
            >
              {t.review}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
