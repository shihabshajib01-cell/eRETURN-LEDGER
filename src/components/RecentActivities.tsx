import React from 'react';
import { ArrowRight, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { Language, ActivityItem } from '../types';
import { RECENT_ACTIVITIES } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';
import { SourceBadge } from './StatusChip';

interface RecentActivitiesProps {
  lang: Language;
  onViewAllActivities: () => void;
  onSelectActivity?: (act: ActivityItem) => void;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ 
  lang, 
  onViewAllActivities,
  onSelectActivity
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div 
      id="panel-recent-activities"
      className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-2xs"
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#172033] tracking-tight">
              {t.recentActivities}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
              5 Recent Logs
            </span>
          </div>
          <span className="text-xs text-[#5F6B7A]">Audit log synced</span>
        </div>

        {/* Enterprise Government Table */}
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
                <tr 
                  key={act.id} 
                  id={`activity-row-${act.id}`}
                  onClick={() => onSelectActivity?.(act)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Date & Time */}
                  <td className="py-3 px-3 text-slate-500 font-medium whitespace-nowrap">
                    {act.dateTime}
                  </td>

                  {/* Activity */}
                  <td className="py-3 px-3 font-semibold text-[#172033] whitespace-nowrap">
                    <span className="group-hover:text-[#0B6FA4] transition-colors flex items-center gap-1.5">
                      <span>{act.activity}</span>
                      {act.amount && (
                        <span className="font-mono text-slate-500 font-normal">
                          ({act.amount})
                        </span>
                      )}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100/90 text-slate-700 font-medium">
                      {act.category}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {act.source && <SourceBadge source={act.source} size="sm" />}
                  </td>

                  {/* Status */}
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
      </div>

      {/* Footer link */}
      <div className="pt-3 border-t border-slate-100 mt-2">
        <button
          id="btn-view-all-activities"
          onClick={onViewAllActivities}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#0B6FA4] hover:text-[#084c72] hover:bg-blue-50/50 py-1.5 px-2 rounded transition-colors group"
        >
          <span>{t.viewAll} (Audit Trail)</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
