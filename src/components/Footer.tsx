import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer
      id="main-footer"
      className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-[#E2E8F0] pb-6 pt-5 text-xs text-[#5F6B7A] md:flex-row md:items-center"
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
        <span>{t.footerCopyright}</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-medium">
        <span>{t.privacy}</span>
        <span aria-hidden="true" className="text-slate-300">•</span>
        <span>{t.terms}</span>
        <span aria-hidden="true" className="text-slate-300">•</span>
        <span>{t.contact}</span>
        <span aria-hidden="true" className="text-slate-300">•</span>
        <span className="font-semibold text-slate-500">{t.developedBy}</span>
      </div>
    </footer>
  );
};
