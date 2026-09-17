import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Menu, UserRound } from 'lucide-react';
import { Language, AssessmentYear } from '../types';
import { TAXPAYER_PROFILE } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  assessmentYear: AssessmentYear;
  onChangeAssessmentYear: (year: AssessmentYear) => void;
  onOpenNavigation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  assessmentYear,
  onChangeAssessmentYear,
  onOpenNavigation,
}) => {
  const t = TRANSLATIONS[lang];
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const years: AssessmentYear[] = ['2026-2027', '2025-2026', '2024-2025'];

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      const target = event.target as Node;
      if (yearRef.current && !yearRef.current.contains(target)) setYearDropdownOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setYearDropdownOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', closeMenus);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenus);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 flex min-h-[68px] items-center justify-between border-b border-[#E2E8F0] bg-white px-4 shadow-sm sm:px-6"
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenNavigation}
          className="rounded-md p-2 text-[#0B6FA4] hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4] lg:hidden"
          aria-label={t.openNavigation}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="min-w-0 leading-tight">
          <p className="truncate text-xs font-bold uppercase tracking-wide text-[#172033]">{t.nbrTitle}</p>
          <p className="hidden truncate text-[11px] text-[#5F6B7A] sm:block">{t.govSubtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div ref={yearRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setYearDropdownOpen((open) => !open);
              setProfileOpen(false);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-slate-50 px-2.5 py-2 text-xs font-semibold text-[#172033] hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4] sm:px-3"
            aria-haspopup="listbox"
            aria-expanded={yearDropdownOpen}
          >
            <span className="hidden lg:inline text-[#5F6B7A] font-medium">{t.assessmentYear}</span>
            <span>{assessmentYear}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          </button>

          {yearDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white py-1 shadow-lg"
              role="listbox"
              aria-label={t.assessmentYear}
            >
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => {
                    onChangeAssessmentYear(year);
                    setYearDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-slate-50 focus:outline-none focus-visible:bg-sky-50 ${
                    assessmentYear === year ? 'font-semibold text-[#0B6FA4]' : 'text-slate-700'
                  }`}
                  role="option"
                  aria-selected={assessmentYear === year}
                >
                  <span>{year}</span>
                  {assessmentYear === year && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden items-center rounded-lg border border-[#E2E8F0] bg-slate-50 p-0.5 sm:inline-flex" aria-label={t.language}>
          <button
            type="button"
            onClick={() => onToggleLang('bn')}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4] ${
              lang === 'bn' ? 'bg-white font-semibold text-[#0B6FA4] shadow-sm' : 'text-[#5F6B7A] hover:text-[#172033]'
            }`}
            aria-pressed={lang === 'bn'}
          >
            বাংলা
          </button>
          <button
            type="button"
            onClick={() => onToggleLang('en')}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4] ${
              lang === 'en' ? 'bg-white font-semibold text-[#0B6FA4] shadow-sm' : 'text-[#5F6B7A] hover:text-[#172033]'
            }`}
            aria-pressed={lang === 'en'}
          >
            English
          </button>
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((open) => !open);
              setYearDropdownOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            aria-label={t.profile}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B6FA4] text-xs font-bold text-white">EH</span>
            <span className="hidden text-left sm:block">
              <span className="block max-w-[160px] truncate text-xs font-semibold text-[#172033]">
                {lang === 'bn' ? TAXPAYER_PROFILE.nameBn : TAXPAYER_PROFILE.name}
              </span>
              <span className="block text-[11px] text-[#5F6B7A]">
                {lang === 'bn' ? TAXPAYER_PROFILE.roleBn : TAXPAYER_PROFILE.role}
              </span>
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" aria-hidden="true" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-lg" role="menu">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[#0B6FA4]">
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#172033]">
                    {lang === 'bn' ? TAXPAYER_PROFILE.nameBn : TAXPAYER_PROFILE.name}
                  </p>
                  <p className="text-xs text-[#5F6B7A]">
                    {lang === 'bn' ? TAXPAYER_PROFILE.roleBn : TAXPAYER_PROFILE.role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
