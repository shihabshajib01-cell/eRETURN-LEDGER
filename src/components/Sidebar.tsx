import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  ChevronDown,
  ChevronRight,
  Car,
  WalletCards,
  FileCheck2,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { Language } from '../types';
import { LEDGER_MODULES, LEDGER_NAV_GROUPS } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

const groupIcons = {
  'source-tax': Receipt,
  ait: Car,
  'other-credits': WalletCards,
};

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, lang, isOpen, onClose }) => {
  const t = TRANSLATIONS[lang];
  const activeModule = LEDGER_MODULES.find((module) => module.id === currentTab);
  const [openGroup, setOpenGroup] = useState<string | null>(activeModule?.group ?? 'source-tax');

  const modulesById = useMemo(
    () => new Map(LEDGER_MODULES.map((module) => [module.id, module])),
    [],
  );

  const selectTab = (tab: string) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <aside
      id="main-sidebar"
      className={`fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 transform flex-col border-r border-[#E2E8F0] bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="eReturn Ledger navigation"
    >
      <div className="flex h-[68px] items-center justify-between border-b border-[#E2E8F0] px-4">
        <button
          type="button"
          onClick={() => selectTab('dashboard')}
          className="flex items-center gap-2 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]"
          aria-label={t.dashboard}
        >
          <span className="text-xl font-bold tracking-tight text-[#2D7B22]">eReturn</span>
          <span className="border-l border-slate-200 pl-2 text-xs font-bold tracking-[0.16em] text-[#172033]">{t.ledger}</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4] lg:hidden"
          aria-label={t.closeNavigation}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm" aria-label="Ledger sections">
        <button
          type="button"
          onClick={() => selectTab('dashboard')}
          className={`mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4] ${
            currentTab === 'dashboard'
              ? 'border-l-4 border-[#0B6FA4] bg-[#EBF5FB] pl-2 font-semibold text-[#0B6FA4]'
              : 'text-[#172033] hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t.dashboard}</span>
        </button>

        <div className="space-y-2">
          {LEDGER_NAV_GROUPS.map((group) => {
            const GroupIcon = groupIcons[group.id];
            const isGroupOpen = openGroup === group.id;
            const groupLabel = lang === 'bn' ? group.titleBn : group.title;

            return (
              <div key={group.id}>
                <button
                  type="button"
                  onClick={() => setOpenGroup(isGroupOpen ? null : group.id)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-[#5F6B7A] hover:bg-slate-50 hover:text-[#172033] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]"
                  aria-expanded={isGroupOpen}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <GroupIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{groupLabel}</span>
                  </span>
                  {isGroupOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                </button>

                {isGroupOpen && (
                  <div className="ml-5 mt-1 space-y-1 border-l border-slate-200 pl-3">
                    {group.itemIds.map((moduleId) => {
                      const module = modulesById.get(moduleId);
                      if (!module) return null;
                      const label = lang === 'bn' ? module.titleBn : module.title;

                      return (
                        <button
                          key={module.id}
                          type="button"
                          onClick={() => selectTab(module.id)}
                          className={`w-full rounded-md px-3 py-2 text-left text-xs leading-snug transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4] ${
                            currentTab === module.id
                              ? 'bg-[#EBF5FB] font-semibold text-[#0B6FA4]'
                              : 'text-[#5F6B7A] hover:bg-slate-50 hover:text-[#172033]'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="my-3 border-t border-[#E2E8F0]" />

        <button
          type="button"
          onClick={() => selectTab('payment-status')}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4] ${
            currentTab === 'payment-status'
              ? 'border-l-4 border-[#0B6FA4] bg-[#EBF5FB] pl-2 text-[#0B6FA4]'
              : 'text-[#172033] hover:bg-slate-50'
          }`}
        >
          <FileCheck2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t.taxPaymentStatus}</span>
        </button>
      </nav>

      <div className="border-t border-[#E2E8F0] p-3">
        <button
          type="button"
          onClick={() => selectTab('goto-ereturn')}
          className="flex w-full items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-[#006A4E] transition-colors hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
        >
          <span>{t.goToEReturn}</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
};
