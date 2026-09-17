import React from 'react';
import { History, DatabaseZap } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RecentActivitiesProps {
  lang: Language;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section
      id="panel-recent-activities"
      className="h-full rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
      aria-labelledby="recent-activities-title"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <History className="h-4.5 w-4.5 text-[#0B6FA4]" aria-hidden="true" />
        <h2 id="recent-activities-title" className="text-lg font-bold text-[#172033]">{t.recentActivities}</h2>
      </div>

      <div className="flex min-h-[220px] items-center justify-center px-4 py-8 text-center">
        <div className="max-w-md">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <DatabaseZap className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-sm font-semibold text-[#172033]">{t.activityUnavailableTitle}</h3>
          <p className="mt-2 text-xs leading-relaxed text-[#5F6B7A]">{t.activityUnavailableDesc}</p>
        </div>
      </div>
    </section>
  );
};
