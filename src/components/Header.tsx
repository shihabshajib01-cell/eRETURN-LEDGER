import React, { useState } from 'react';
import { Bell, ChevronDown, User, LogOut, Menu } from 'lucide-react';
import { Language, AssessmentYear } from '../types';
import { TAXPAYER_PROFILE } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  assessmentYear: AssessmentYear;
  onOpenNavigation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  assessmentYear,
  onOpenNavigation,
}) => {
  const t = TRANSLATIONS[lang];
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDetailsOpen, setProfileDetailsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const logout = () => {
    const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
    const target = env?.VITE_ERETURN_LOGOUT_URL?.trim() || 'https://etaxnbr.gov.bd/';
    window.location.href = target;
  };

  return (
    <header id="top-header" className="min-h-[68px] bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenNavigation}
          className="lg:hidden w-9 h-9 rounded-md border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"
          aria-label={lang === 'bn' ? 'নেভিগেশন খুলুন' : 'Open navigation'}
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="leading-tight min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#172033] truncate">{t.nbrTitle}</div>
          <div className="text-[11px] text-[#5F6B7A] font-medium truncate hidden sm:block">{t.govSubtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#172033]">
          <span className="font-semibold hidden xl:inline">{t.assessmentYear} :</span>
          <span>{assessmentYear}</span>
        </div>

        <div className="inline-flex items-center rounded-md border border-[#E2E8F0] bg-slate-100/80 p-0.5 text-[10px] sm:text-xs font-medium">
          <button type="button" onClick={() => onToggleLang('bn')} className={`px-2.5 py-1 rounded ${lang === 'bn' ? 'bg-white text-[#0B6FA4] font-semibold shadow-2xs' : 'text-[#5F6B7A]'}`}>বাংলা</button>
          <button type="button" onClick={() => onToggleLang('en')} className={`px-2.5 py-1 rounded ${lang === 'en' ? 'bg-white text-[#0B6FA4] font-semibold shadow-2xs' : 'text-[#5F6B7A]'}`}><span className="sm:hidden">EN</span><span className="hidden sm:inline">English</span></button>
        </div>

        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label={lang === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
            aria-haspopup="dialog"
            aria-expanded={notificationsOpen}
            className="flex w-9 h-9 rounded-md border border-[#E2E8F0] items-center justify-center text-[#5F6B7A] bg-slate-50 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"
          >
            <Bell className="w-4 h-4" />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-1.5 w-72 rounded-lg border border-[#E2E8F0] bg-white p-4 text-xs shadow-lg z-40">
              <p className="font-semibold text-[#172033]">{lang === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}</p>
              <p className="mt-2 text-[#5F6B7A]">{lang === 'bn' ? 'এই মুহূর্তে কোনো নতুন নোটিফিকেশন নেই।' : 'There are no new notifications right now.'}</p>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"
          >
            <div className="w-8 h-8 rounded-full bg-[#0B6FA4] text-white flex items-center justify-center font-bold text-xs">EH</div>
            <div className="hidden xl:block leading-tight text-left">
              <div className="text-xs font-semibold text-[#172033]">{lang === 'bn' ? TAXPAYER_PROFILE.nameBn : TAXPAYER_PROFILE.name}</div>
              <div className="text-[11px] text-[#5F6B7A]">{lang === 'bn' ? TAXPAYER_PROFILE.roleBn : TAXPAYER_PROFILE.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div role="menu" className="absolute right-0 mt-1.5 w-56 bg-white border border-[#E2E8F0] rounded-lg shadow-lg p-2 z-40 text-xs">
              <div className="p-2 border-b border-slate-100">
                <p className="font-semibold text-slate-800">{lang === 'bn' ? TAXPAYER_PROFILE.nameBn : TAXPAYER_PROFILE.name}</p>
                <p className="text-[11px] text-slate-500">{lang === 'bn' ? TAXPAYER_PROFILE.roleBn : TAXPAYER_PROFILE.role}</p>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setProfileDetailsOpen((open) => !open)}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-slate-700 hover:bg-slate-50 rounded"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'bn' ? 'করদাতা প্রোফাইল' : 'Taxpayer Profile'}</span>
                </button>
                {profileDetailsOpen && (
                  <div className="mx-1 mb-1 rounded-md border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-600">
                    <div className="flex justify-between gap-3"><span>{lang === 'bn' ? 'নাম' : 'Name'}</span><strong className="text-right text-slate-800">{lang === 'bn' ? TAXPAYER_PROFILE.nameBn : TAXPAYER_PROFILE.name}</strong></div>
                    <div className="mt-1 flex justify-between gap-3"><span>{lang === 'bn' ? 'করবর্ষ' : 'Assessment Year'}</span><strong className="text-slate-800">{assessmentYear}</strong></div>
                  </div>
                )}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    const confirmed = window.confirm(lang === 'bn' ? 'লগ আউট করে eReturn পোর্টালে ফিরে যাবেন?' : 'Log out and return to the eReturn portal?');
                    if (confirmed) logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-rose-600 hover:bg-rose-50 rounded"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'লগ আউট' : 'Log Out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
