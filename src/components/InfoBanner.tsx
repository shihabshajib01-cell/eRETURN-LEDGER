import React from 'react';
import { Info, HelpCircle, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface InfoBannerProps {
  lang: Language;
  onOpenHowItWorks: () => void;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ lang, onOpenHowItWorks }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div 
      id="important-info-banner"
      className="bg-[#F0F7FB] border border-[#BEE3F8] rounded-xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs shadow-2xs"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0B6FA4]/15 text-[#0B6FA4] flex items-center justify-center shrink-0 mt-0.5 border border-[#0B6FA4]/20">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-[#172033] mb-0.5 flex items-center gap-2">
            <span>{t.importantInfo}</span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#0B6FA4]/10 text-[#0B6FA4] font-bold">
              Notice
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed max-w-4xl text-[12.5px]">
            {t.bannerText}
          </p>
        </div>
      </div>

      <button
        id="btn-how-ereturn-works"
        onClick={onOpenHowItWorks}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#BEE3F8] text-[#0B6FA4] hover:bg-[#0B6FA4] hover:text-white font-semibold transition-all shrink-0 shadow-2xs group"
      >
        <HelpCircle className="w-3.5 h-3.5 text-[#0B6FA4] group-hover:text-white" />
        <span className="whitespace-nowrap">{t.howItWorks}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
