import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  User, 
  LogOut, 
  FileText, 
  Globe, 
  Check
} from 'lucide-react';
import { Language, AssessmentYear } from '../types';
import { TAXPAYER_PROFILE } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  assessmentYear: AssessmentYear;
  onChangeAssessmentYear: (year: AssessmentYear) => void;
  onOpenNotifications?: () => void;
  onOpenProfileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  assessmentYear,
  onChangeAssessmentYear,
}) => {
  const t = TRANSLATIONS[lang];
  const [profileOpen, setProfileOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const years: AssessmentYear[] = ['2026-2027', '2025-2026', '2024-2025'];

  return (
    <header 
      id="top-header"
      className="h-[68px] bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs"
    >
      {/* Left: National Board of Revenue & Govt of Bangladesh */}
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-full bg-emerald-700/10 border border-emerald-700/20 flex items-center justify-center text-emerald-800 shrink-0">
          {/* Government of Bangladesh Emblem circle */}
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
        </div>
        <div className="leading-tight">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#172033]">
            {t.nbrTitle}
          </div>
          <div className="text-[11px] text-[#5F6B7A] font-medium">
            {t.govSubtitle}
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Assessment Year Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#5F6B7A] hidden lg:inline">
              {t.assessmentYear}:
            </span>
            <button
              id="assessment-year-select-btn"
              onClick={() => {
                setYearDropdownOpen(!yearDropdownOpen);
                setProfileOpen(false);
                setNotifOpen(false);
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#E2E8F0] bg-slate-50/80 hover:bg-slate-100 text-xs font-semibold text-[#172033] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20"
            >
              <span>{assessmentYear}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {yearDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 z-40 text-xs">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Assessment Year
              </div>
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => {
                    onChangeAssessmentYear(yr);
                    setYearDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                    assessmentYear === yr ? 'bg-blue-50/60 font-semibold text-[#0B6FA4]' : 'text-slate-700'
                  }`}
                >
                  <span>{yr}</span>
                  {assessmentYear === yr && <Check className="w-3.5 h-3.5 text-[#0B6FA4]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200"></div>

        {/* Language Control: বাংলা | English */}
        <div 
          id="language-selector"
          className="inline-flex items-center rounded-md border border-[#E2E8F0] bg-slate-100/80 p-0.5 text-xs font-medium"
        >
          <button
            id="lang-bn-btn"
            onClick={() => onToggleLang('bn')}
            className={`px-2.5 py-1 rounded transition-all ${
              lang === 'bn'
                ? 'bg-white text-[#0B6FA4] font-semibold shadow-2xs'
                : 'text-[#5F6B7A] hover:text-[#172033]'
            }`}
          >
            বাংলা
          </button>
          <span className="text-slate-300">|</span>
          <button
            id="lang-en-btn"
            onClick={() => onToggleLang('en')}
            className={`px-2.5 py-1 rounded transition-all ${
              lang === 'en'
                ? 'bg-white text-[#0B6FA4] font-semibold shadow-2xs'
                : 'text-[#5F6B7A] hover:text-[#172033]'
            }`}
          >
            English
          </button>
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
              setYearDropdownOpen(false);
            }}
            aria-label="Notifications"
            className="w-9 h-9 rounded-md border border-[#E2E8F0] flex items-center justify-center text-[#5F6B7A] hover:text-[#172033] hover:bg-slate-50 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white border border-[#E2E8F0] rounded-lg shadow-lg p-3 z-40 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-800">System Notifications</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                  3 Pending
                </span>
              </div>
              <div className="divide-y divide-slate-100 py-1 max-h-60 overflow-y-auto">
                <div className="py-2 hover:bg-slate-50 px-1 rounded cursor-pointer">
                  <p className="font-medium text-slate-800">Dividend records synced</p>
                  <p className="text-[11px] text-slate-500">3 new records available from eReturn Income</p>
                  <span className="text-[10px] text-slate-400">10 mins ago</span>
                </div>
                <div className="py-2 hover:bg-slate-50 px-1 rounded cursor-pointer">
                  <p className="font-medium text-slate-800">AIT Challan 154 Verified</p>
                  <p className="text-[11px] text-slate-500">Auto-verified against iBAS++ treasury records</p>
                  <span className="text-[10px] text-slate-400">2 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            id="user-profile-menu-btn"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
              setYearDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#0B6FA4] text-white flex items-center justify-center font-bold text-xs shrink-0">
              EH
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-xs font-semibold text-[#172033]">
                {lang === 'bn' ? TAXPAYER_PROFILE.nameBn : TAXPAYER_PROFILE.name}
              </div>
              <div className="text-[11px] text-[#5F6B7A]">
                {lang === 'bn' ? TAXPAYER_PROFILE.roleBn : TAXPAYER_PROFILE.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white border border-[#E2E8F0] rounded-lg shadow-lg p-2 z-40 text-xs">
              <div className="p-2 border-b border-slate-100">
                <p className="font-semibold text-slate-800">{TAXPAYER_PROFILE.name}</p>
                <p className="text-[11px] text-slate-500">e-TIN: {TAXPAYER_PROFILE.tin}</p>
                <p className="text-[11px] text-slate-500">{TAXPAYER_PROFILE.circle}</p>
                <p className="text-[11px] text-slate-500">{TAXPAYER_PROFILE.zone}</p>
              </div>
              <div className="pt-1">
                <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-slate-50 rounded">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Taxpayer Profile</span>
                </button>
                <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-slate-50 rounded">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Submission History</span>
                </button>
                <div className="my-1 border-t border-slate-100"></div>
                <button className="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded">
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
