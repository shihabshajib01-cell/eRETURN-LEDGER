import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  lang: Language;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  lang,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer 
      id="main-footer"
      className="mt-8 pt-5 pb-6 border-t border-[#E2E8F0] text-xs text-[#5F6B7A] flex flex-col md:flex-row items-center justify-between gap-3 select-none"
    >
      {/* Left side */}
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>{t.copyright}</span>
      </div>

      {/* Right side */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
        <button 
          id="footer-privacy-btn"
          onClick={onOpenPrivacy} 
          className="hover:text-[#0B6FA4] hover:underline underline-offset-2 transition-colors"
        >
          {t.privacy}
        </button>
        <span className="text-slate-300">•</span>
        <button 
          id="footer-terms-btn"
          onClick={onOpenTerms} 
          className="hover:text-[#0B6FA4] hover:underline underline-offset-2 transition-colors"
        >
          {t.terms}
        </button>
        <span className="text-slate-300">•</span>
        <button 
          id="footer-contact-btn"
          onClick={onOpenContact} 
          className="hover:text-[#0B6FA4] hover:underline underline-offset-2 transition-colors"
        >
          {t.contact}
        </button>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500 font-semibold">
          {t.developedBy}
        </span>
      </div>
    </footer>
  );
};
