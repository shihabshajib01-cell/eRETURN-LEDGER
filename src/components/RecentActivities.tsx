import React from 'react';
import { ArrowRight, CheckCircle2, History } from 'lucide-react';
import { Language, ActivityItem } from '../types';
import { RECENT_ACTIVITIES } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';
import { SourceBadge } from './StatusChip';

interface RecentActivitiesProps {
  lang: Language;
  onViewAllActivities: () => void;
  onSelectActivity?: (act: ActivityItem) => void;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ lang, onViewAllActivities, onSelectActivity }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div id="panel-recent-activities" className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-2xs h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-[#172033] tracking-tight">{t.recentActivities}</h2>
          {RECENT_ACTIVITIES.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{RECENT_ACTIVITIES.length}</span>
          )}
        </div>

        {RECENT_ACTIVITIES.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
              <History className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#172033]">
              {lang === 'bn' ? 'অডিট ইতিহাস এখনো সংযুক্ত নয়' : 'Audit history is not connected yet'}
            </p>
            <p className="text-xs text-[#5F6B7A] mt-1 max-w-md mx-auto leading-relaxed">
              {lang === 'bn'
                ? 'বাস্তব ইভেন্ট বা অডিট API সংযুক্ত হলে এখানে সাম্প্রতিক কার্যক্রম দেখানো হবে।'
                : 'Recent activity will appear here only after a real event or audit source is connected.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[#5F6B7A] bg-slate-50/50 uppercase text-[11px] font-semibold tracking-wider">
                  <th className="py-2.5 px-3">{t.dateTime}</th>
                  <th className="py-2.5 px-3">{t.activity}</th>
                  <th className="py-2.5 px-3">{t.category}</th>
                  <th className="py-2.5 px-3">{t.source}</th>
                  <th className="py-2.5 px-3 text-right">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#172033]">
                {RECENT_ACTIVITIES.map((act) => (
                  <tr key={act.id} onClick={() => onSelectActivity?.(act)} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                    <td className="py-3 px-3 text-slate-500 font-medium whitespace-nowrap">{act.dateTime}</td>
                    <td className="py-3 px-3 font-semibold text-[#172033] whitespace-nowrap">{act.activity}</td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">{act.category}</td>
                    <td className="py-3 px-3 whitespace-nowrap">{act.source && <SourceBadge source={act.source} size="sm" />}</td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        {t.statSuccess}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 mt-2">
        <button
          id="btn-view-all-activities"
          onClick={onViewAllActivities}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#0B6FA4] hover:bg-blue-50/50 py-2 px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"
        >
          <span>{t.viewAll}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
