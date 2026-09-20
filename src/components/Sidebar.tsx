import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Home,
  Receipt,
  ChevronDown,
  ChevronRight,
  Car,
  FileCheck2,
  ArrowUpRight,
  HelpCircle,
  PhoneCall,
  BookOpen,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
  isOpen?: boolean;
  onClose?: () => void;
}

const sourceTaxItems = [
  { id: 'salary-ibas', en: 'Salary (iBAS++)', bn: 'বেতন (iBAS++)' },
  { id: 'salary-other', en: 'Salary (Others)', bn: 'বেতন (অন্যান্য)' },
  { id: 'bank-fi', en: 'Bank/FI Interest/Profit', bn: 'ব্যাংক/এফআই সুদ/মুনাফা' },
  { id: 'dividend', en: 'Dividend', bn: 'লভ্যাংশ' },
  { id: 'service-payment', en: 'Service Payment', bn: 'সেবা পেমেন্ট' },
  { id: 'sanchayapatra', en: 'Sanchayapatra', bn: 'সঞ্চয়পত্র' },
  { id: 'import', en: 'Import', bn: 'আমদানি' },
  { id: 'commercial-vehicle', en: 'Commercial Vehicle', bn: 'বাণিজ্যিক যানবাহন' },
  { id: 'other-tds', en: 'Others', bn: 'অন্যান্য' },
];

const aitItems = [
  { id: 'ait-car', en: 'AIT on Car', bn: 'গাড়ির উপর AIT' },
  { id: 'ait-154', en: 'AIT (154)', bn: 'AIT (154)' },
];

const otherCreditItems = [
  { id: 'tax-paid-return', en: 'Tax Paid with Return (173)', bn: 'রিটার্নের সাথে প্রদত্ত কর (১৭৩)' },
  { id: 'environmental-surcharge', en: 'Environmental Surcharge', bn: 'পরিবেশ সারচার্জ' },
  { id: 'tax-refund', en: 'Adjustment of Tax Refund', bn: 'কর রিফান্ড সমন্বয়' },
  { id: 'carry-forward', en: 'Adjustment of carry forward tax u/s 163', bn: 'ধারা ১৬৩ অনুযায়ী জের টানা কর সমন্বয়' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, lang, isOpen = false, onClose }) => {
  const t = TRANSLATIONS[lang];
  const inferredGroup = sourceTaxItems.some((item) => item.id === currentTab)
    ? 'source'
    : aitItems.some((item) => item.id === currentTab)
      ? 'ait'
      : null;
  const [openGroup, setOpenGroup] = useState<string | null>(inferredGroup || 'source');

  useEffect(() => {
    if (inferredGroup) setOpenGroup(inferredGroup);
  }, [inferredGroup]);

  const select = (id: string) => {
    onSelectTab(id);
    onClose?.();
  };

  const itemClass = (active: boolean) =>
    `w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40 ${
      active ? 'bg-[#EBF5FB] text-[#0B6FA4] font-semibold' : 'text-[#5F6B7A] hover:bg-slate-50 hover:text-[#172033]'
    }`;

  const groupButton = (id: string, label: string, Icon: React.ComponentType<{ className?: string }>) => (
    <button
      type="button"
      onClick={() => setOpenGroup(openGroup === id ? null : id)}
      aria-expanded={openGroup === id}
      className="w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold text-[#5F6B7A] hover:text-[#172033] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"
    >
      <span className="flex items-center gap-2 min-w-0">
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      {openGroup === id ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
    </button>
  );

  return (
    <>
      {isOpen && <button className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden" aria-label="Close navigation" onClick={onClose} />}
      <aside
        id="main-sidebar"
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-20 w-[280px] lg:w-[260px] shrink-0 h-screen bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-[72px] px-5 flex items-center gap-3 border-b border-[#E2E8F0]">
          <div className="w-10 h-10 rounded-lg bg-[#006A4E] flex items-center justify-center text-white font-bold">eR</div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-[#006A4E] text-lg leading-tight">eReturn</div>
            <div className="text-xs font-semibold text-[#5F6B7A] tracking-wider uppercase">{t.ledger}</div>
          </div>
          <button type="button" onClick={onClose} className="lg:hidden p-2 rounded-md hover:bg-slate-100" aria-label="Close navigation">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-sm font-medium" aria-label="Ledger navigation">
          <button
            type="button"
            onClick={() => select('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40 ${
              currentTab === 'dashboard' ? 'bg-[#EBF5FB] text-[#0B6FA4] border-l-4 border-[#0B6FA4] font-semibold pl-2.5' : 'text-[#172033] hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>{t.dashboard}</span>
          </button>

          <button
            type="button"
            onClick={() => select('overview-dashboard')}
            className={itemClass(currentTab === 'overview-dashboard')}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>{t.overviewDashboard}</span>
          </button>

          <button
            type="button"
            onClick={() => select('ledger-guide')}
            className={itemClass(currentTab === 'ledger-guide')}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{t.ledgerGuide}</span>
          </button>

          <div className="pt-2">
            {groupButton('source', t.claimSourceTax, Receipt)}
            {openGroup === 'source' && (
              <div className="mt-1 pl-4 space-y-0.5 border-l border-slate-200 ml-4">
                {sourceTaxItems.map((item) => (
                  <button key={item.id} type="button" onClick={() => select(item.id)} className={itemClass(currentTab === item.id)}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0" />
                    <span className="leading-snug">{lang === 'bn' ? item.bn : item.en}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            {groupButton('ait', t.advanceIncomeTax, Car)}
            {openGroup === 'ait' && (
              <div className="mt-1 pl-4 space-y-0.5 border-l border-slate-200 ml-4">
                {aitItems.map((item) => (
                  <button key={item.id} type="button" onClick={() => select(item.id)} className={itemClass(currentTab === item.id)}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0" />
                    <span className="leading-snug">{lang === 'bn' ? item.bn : item.en}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 space-y-0.5">
            {otherCreditItems.map((item) => (
              <button key={item.id} type="button" onClick={() => select(item.id)} className={itemClass(currentTab === item.id)}>
                <ShieldCheck className="w-4 h-4 shrink-0 opacity-70" />
                <span className="leading-snug">{lang === 'bn' ? item.bn : item.en}</span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button type="button" onClick={() => select('payment-status')} className={itemClass(currentTab === 'payment-status')}>
              <FileCheck2 className="w-4 h-4 shrink-0" />
              <span>{t.taxPaymentStatus}</span>
            </button>
          </div>

          <div className="my-2 border-t border-[#E2E8F0]" />

          <button
            type="button"
            onClick={() => select('goto-ereturn')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold text-[#006A4E] bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/30"
          >
            <span>{t.goToEReturn}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </nav>

        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/60 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-[#5F6B7A] mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            {t.needHelp}
          </div>
          <div className="flex items-center gap-3 text-[#5F6B7A] mb-3">
            <button type="button" onClick={() => select('user-guide')} className="hover:text-[#0B6FA4] flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 rounded">
              <BookOpen className="w-3 h-3" /> {t.userGuide}
            </button>
            <span>•</span>
            <button type="button" onClick={() => select('faqs')} className="hover:text-[#0B6FA4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 rounded">{t.faqs}</button>
          </div>
          <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#0B6FA4]" />
            <div>
              <div className="font-bold text-[#172033]">09643717171</div>
              <div className="text-[11px] text-[#5F6B7A]">{t.helpline}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
