import React from 'react';
import { Info, BookOpen } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface InfoBannerProps {
  lang: Language;
  onOpenHowItWorks?: () => void;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ lang, onOpenHowItWorks }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section
      id="section-info-banner"
      className="flex flex-col gap-4 rounded-xl border border-sky-200 bg-sky-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
      aria-labelledby="info-banner-title"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0B6FA4] shadow-sm">
          <Info className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="info-banner-title" className="text-sm font-semibold text-[#172033]">{t.importantInfo}</h2>
          <p className="mt-1 max-w-4xl text-xs leading-relaxed text-[#5F6B7A]">{t.bannerText}</p>
        </div>
      </div>

      {onOpenHowItWorks && (
        <button
          type="button"
          onClick={onOpenHowItWorks}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#0B6FA4]/30 bg-white px-3 py-2 text-xs font-semibold text-[#0B6FA4] transition-colors hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]"
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          {t.howItWorks}
        </button>
      )}
    </section>
  );
};
