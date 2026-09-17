import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  ChevronDown, 
  ChevronRight, 
  Car, 
  FileSpreadsheet, 
  Layers, 
  FileCheck2, 
  ArrowUpRight, 
  HelpCircle, 
  PhoneCall, 
  BookOpen,
  Briefcase,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, lang }) => {
  const t = TRANSLATIONS[lang];
  const [sourceTaxOpen, setSourceTaxOpen] = useState(true);
  const [aitOpen, setAitOpen] = useState(true);
  const [otherCreditsOpen, setOtherCreditsOpen] = useState(true);

  return (
    <aside 
      id="main-sidebar"
      className="w-[260px] shrink-0 min-h-screen bg-white border-r border-[#E2E8F0] flex flex-col justify-between select-none z-20"
    >
      {/* Brand Header */}
      <div>
        <div className="h-[72px] px-5 flex items-center gap-3 border-b border-[#E2E8F0] bg-white">
          <div className="w-10 h-10 rounded-lg bg-[#006A4E] flex items-center justify-center text-white shadow-xs">
            {/* Bangladesh Govt / eReturn emblem mark */}
            <span className="font-bold text-lg tracking-wider">eR</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#006A4E] text-lg leading-tight tracking-tight">eReturn</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                NBR
              </span>
            </div>
            <div className="text-xs font-semibold text-[#5F6B7A] tracking-wider uppercase">
              {t.ledger}
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 text-sm font-medium">
          {/* 1. Dashboard (Active) */}
          <button
            id="nav-dashboard"
            onClick={() => onSelectTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-left ${
              currentTab === 'dashboard'
                ? 'bg-[#EBF5FB] text-[#0B6FA4] border-l-4 border-[#0B6FA4] font-semibold pl-2.5 shadow-2xs'
                : 'text-[#172033] hover:bg-slate-50 hover:text-[#0B6FA4]'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentTab === 'dashboard' ? 'text-[#0B6FA4]' : 'text-[#5F6B7A]'}`} />
            <span className="truncate">{t.dashboard}</span>
          </button>

          {/* 2. CLAIM SOURCE TAX (Expandable) */}
          <div className="pt-2">
            <button
              id="nav-group-source-tax"
              onClick={() => setSourceTaxOpen(!sourceTaxOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold text-[#5F6B7A] uppercase tracking-wider hover:text-[#172033] hover:bg-slate-50"
            >
              <span className="flex items-center gap-2 truncate">
                <Receipt className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{t.claimSourceTax}</span>
              </span>
              {sourceTaxOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {sourceTaxOpen && (
              <div className="mt-1 pl-4 space-y-0.5 border-l border-slate-200 ml-4">
                {[
                  { id: 'source-salary', label: t.salary, icon: Briefcase },
                  { id: 'source-financial', label: t.financialAssets, icon: Coins },
                  { id: 'source-service', label: t.serviceProfessional, icon: Layers },
                  { id: 'source-trade', label: t.tradeOther, icon: FileSpreadsheet }
                ].map((item) => (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                      currentTab === item.id
                        ? 'bg-[#EBF5FB] text-[#0B6FA4] font-medium'
                        : 'text-[#5F6B7A] hover:bg-slate-50 hover:text-[#172033]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. ADVANCE INCOME TAX (Expandable) */}
          <div className="pt-2">
            <button
              id="nav-group-ait"
              onClick={() => setAitOpen(!aitOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold text-[#5F6B7A] uppercase tracking-wider hover:text-[#172033] hover:bg-slate-50"
            >
              <span className="flex items-center gap-2 truncate">
                <Car className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{t.advanceIncomeTax}</span>
              </span>
              {aitOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {aitOpen && (
              <div className="mt-1 pl-4 space-y-0.5 border-l border-slate-200 ml-4">
                {[
                  { id: 'ait-car', label: t.aitOnCar },
                  { id: 'ait-154', label: t.aitUnder154 }
                ].map((item) => (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                      currentTab === item.id
                        ? 'bg-[#EBF5FB] text-[#0B6FA4] font-medium'
                        : 'text-[#5F6B7A] hover:bg-slate-50 hover:text-[#172033]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. OTHER TAX CREDITS (Expandable) */}
          <div className="pt-2">
            <button
              id="nav-group-other-credits"
              onClick={() => setOtherCreditsOpen(!otherCreditsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold text-[#5F6B7A] uppercase tracking-wider hover:text-[#172033] hover:bg-slate-50"
            >
              <span className="flex items-center gap-2 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{t.otherTaxCredits}</span>
              </span>
              {otherCreditsOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {otherCreditsOpen && (
              <div className="mt-1 pl-4 space-y-0.5 border-l border-slate-200 ml-4">
                {[
                  { id: 'other-173', label: t.taxPaidWithReturn },
                  { id: 'other-surcharge', label: t.environmentalSurcharge },
                  { id: 'other-refund', label: t.taxRefundAdjustment },
                  { id: 'other-carry-forward', label: t.carryForwardAdjustment }
                ].map((item) => (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                      currentTab === item.id
                        ? 'bg-[#EBF5FB] text-[#0B6FA4] font-medium'
                        : 'text-[#5F6B7A] hover:bg-slate-50 hover:text-[#172033]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Tax Payment Status */}
          <div className="pt-2">
            <button
              id="nav-payment-status"
              onClick={() => onSelectTab('payment-status')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left text-xs font-medium ${
                currentTab === 'payment-status'
                  ? 'bg-[#EBF5FB] text-[#0B6FA4] border-l-4 border-[#0B6FA4] font-semibold pl-2'
                  : 'text-[#172033] hover:bg-slate-50 hover:text-[#0B6FA4]'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-[#5F6B7A] shrink-0" />
              <span className="truncate">{t.taxPaymentStatus}</span>
            </button>
          </div>

          {/* 6. Divider */}
          <div className="my-2 border-t border-[#E2E8F0]"></div>

          {/* 7. Go to eReturn */}
          <button
            id="nav-goto-ereturn"
            onClick={() => onSelectTab('goto-ereturn')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold text-[#006A4E] bg-emerald-50/70 hover:bg-emerald-100/80 transition-colors border border-emerald-200/70"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>{t.goToEReturn}</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700" />
          </button>
        </nav>
      </div>

      {/* Bottom Help & Helpline Area */}
      <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/60 text-xs">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[#5F6B7A] font-semibold">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              {t.needHelp}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[#5F6B7A]">
            <button 
              id="sidebar-user-guide-btn"
              onClick={() => onSelectTab('user-guide')}
              className="hover:text-[#0B6FA4] underline decoration-slate-300 underline-offset-2 flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-slate-400" />
              {t.userGuide}
            </button>
            <span>•</span>
            <button 
              id="sidebar-faqs-btn"
              onClick={() => onSelectTab('faqs')}
              className="hover:text-[#0B6FA4] underline decoration-slate-300 underline-offset-2"
            >
              {t.faqs}
            </button>
          </div>

          {/* Taxes Helpline 16555 */}
          <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#0B6FA4]/10 flex items-center justify-center text-[#0B6FA4]">
                <PhoneCall className="w-3 h-3" />
              </div>
              <div>
                <div className="font-bold text-[#172033] tracking-wide text-xs">16555</div>
                <div className="text-[10px] text-[#5F6B7A]">{t.helpline}</div>
              </div>
            </div>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
              9 AM - 5 PM
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
