import React from 'react';
import { BriefcaseBusiness, Landmark, ReceiptText, FileCheck2, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { QUICK_ACTIONS } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface QuickActionsProps {
  lang: Language;
  onNavigate: (target: string) => void;
}

const icons = [BriefcaseBusiness, Landmark, ReceiptText, FileCheck2];

export const QuickActions: React.FC<QuickActionsProps> = ({ lang, onNavigate }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section
      id="panel-quick-actions"
      className="h-full rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
      aria-labelledby="quick-actions-title"
    >
      <h2 id="quick-actions-title" className="border-b border-slate-100 pb-3 text-lg font-bold text-[#172033]">
        {t.quickActions}
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUICK_ACTIONS.map((action, index) => {
          const Icon = icons[index] ?? FileCheck2;
          const title = lang === 'bn' ? action.titleBn : action.title;
          const description = lang === 'bn' ? action.descriptionBn : action.description;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onNavigate(action.target)}
              className="group flex min-h-[104px] w-full items-start justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-left transition-colors hover:border-[#0B6FA4]/40 hover:bg-sky-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]"
            >
              <span className="flex min-w-0 items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0B6FA4] shadow-sm">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[#172033]">{title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-[#5F6B7A]">{description}</span>
                </span>
              </span>
              <ArrowRight className="ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0B6FA4]" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </section>
  );
};
