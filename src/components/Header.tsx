import React, { useState } from 'react';
import { Bell, ChevronDown, User, LogOut, Check, Menu } from 'lucide-react';
import { Language, AssessmentYear } from '../types';
import { TAXPAYER_PROFILE } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  assessmentYear: AssessmentYear;
  onChangeAssessmentYear: (year: AssessmentYear) => void;
  onOpenNavigation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  assessmentYear,
  onChangeAssessmentYear,
  onOpenNavigation,
}) => {
  const t = TRANSLATIONS[lang];
  const [profileOpen, setProfileOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const years: AssessmentYear[] = ['2026-2027', '2025-2026', '2024-2025'];

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
        <div className="relative hidden md:block">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#5F6B7A] hidden xl:inline">{t.assessmentYear}:</span>
            <button
              type="button"
              onClick={() => setYearDropdownOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={yearDropdownOpen}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#E2E8F0] bg-slate-50/80 hover:bg-slate-100 text-xs font-semibold text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"
            >
              <span>{assessmentYear}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
          {yearDropdownOpen && (
            <div role="listbox" className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 z-40 text-xs">
              {years.map((yr) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={assessmentYear === yr}
                  key={yr}
                  onClick={() => { onChangeAssessmentYear(yr); setYearDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 ${assessmentYear === yr ? 'bg-blue-50/60 font-semibold text-[#0B6FA4]' : 'text-slate-700'}`}
                >
                  <span>{yr}</span>
                  {assessmentYear === yr && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:inline-flex items-center rounded-md border border-[#E2E8F0] bg-slate-100/80 p-0.5 text-xs font-medium">
          <button type="button" onClick={() => onToggleLang('bn')} className={`px-2.5 py-1 rounded ${lang === 'bn' ? 'bg-white text-[#0B6FA4] font-semibold shadow-2xs' : 'text-[#5F6B7A]'}`}>বাংলা</button>
          <button type="button" onClick={() => onToggleLang('en')} className={`px-2.5 py-1 rounded ${lang === 'en' ? 'bg-white text-[#0B6FA4] font-semibold shadow-2xs' : 'text-[#5F6B7A]'}`}>English</button>
        </div>

        <button
          type="button"
          aria-label={lang === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
          title={lang === 'bn' ? 'নোটিফিকেশন ডেটা এখনো সংযুক্ত নয়' : 'Notification data is not connected yet'}
          className="w-9 h-9 rounded-md border border-[#E2E8F0] flex items-center justify-center text-[#5F6B7A] bg-slate-50 cursor-default"
        >
          <Bell className="w-4 h-4" />
        </button>

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
                <button type="button" role="menuitem" className="w-full flex items-center gap-2 px-2.5 py-2 text-slate-700 hover:bg-slate-50 rounded">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'bn' ? 'করদাতা প্রোফাইল' : 'Taxpayer Profile'}</span>
                </button>
                <button type="button" role="menuitem" className="w-full flex items-center gap-2 px-2.5 py-2 text-rose-600 hover:bg-rose-50 rounded">
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
