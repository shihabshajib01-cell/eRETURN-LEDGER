import React from 'react';
import { ArrowRight, Banknote, CarFront, WalletCards } from 'lucide-react';
import { Language } from '../types';
import { LEDGER_NAV_GROUPS } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface CategoryProgressProps {
  lang: Language;
  onNavigate: (target: string) => void;
}

const groupIconMap = {
  'source-tax': Banknote,
  ait: CarFront,
  'other-credits': WalletCards,
};

export const CategoryProgress: React.FC<CategoryProgressProps> = ({ lang, onNavigate }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section
      id="panel-ledger-modules"
      className="h-full rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
      aria-labelledby="ledger-modules-title"
    >
      <div className="border-b border-slate-100 pb-3">
        <h2 id="ledger-modules-title" className="text-lg font-bold text-[#172033]">
          {t.ledgerModules}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[#5F6B7A]">{t.ledgerModulesDesc}</p>
      </div>

      <div className="mt-4 space-y-3">
        {LEDGER_NAV_GROUPS.map((group) => {
          const Icon = groupIconMap[group.id];
          const label = lang === 'bn' ? group.titleBn : group.title;
          const firstTarget = group.itemIds[0];

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onNavigate(firstTarget)}
              className="group flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:border-[#0B6FA4]/40 hover:bg-sky-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#0B6FA4]">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#172033]">{label}</span>
                  <span className="mt-0.5 block text-xs text-[#5F6B7A]">
                    {group.itemIds.length} {lang === 'bn' ? 'টি মডিউল' : group.itemIds.length === 1 ? 'module' : 'modules'}
                  </span>
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0B6FA4]" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </section>
  );
};
