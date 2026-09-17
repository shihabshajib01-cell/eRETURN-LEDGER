import React from 'react';
import { AlertCircle, RefreshCw, FileCheck2, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language, PendingActionItem } from '../types';
import { PENDING_ACTIONS } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface PendingActionsProps {
  lang: Language;
  onActionClick: (action: PendingActionItem) => void;
  onViewAllPending: () => void;
}

export const PendingActions: React.FC<PendingActionsProps> = ({ lang, onActionClick, onViewAllPending }) => {
  const t = TRANSLATIONS[lang];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'sync':
        return <RefreshCw className="w-4 h-4 text-sky-600" />;
      case 'claim':
        return <FileCheck2 className="w-4 h-4 text-emerald-600" />;
      case 'review':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#0B6FA4]" />;
    }
  };

  return (
    <div
      id="panel-pending-actions"
      className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-2xs h-full"
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#172033] tracking-tight">{t.pendingActions}</h2>
            {PENDING_ACTIONS.length > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                {PENDING_ACTIONS.length}
              </span>
            )}
          </div>
        </div>

        {PENDING_ACTIONS.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#172033]">
              {lang === 'bn' ? 'কোনো অনুমানভিত্তিক কাজ দেখানো হচ্ছে না' : 'No inferred actions are shown'}
            </p>
            <p className="text-xs text-[#5F6B7A] mt-1 max-w-md mx-auto leading-relaxed">
              {lang === 'bn'
                ? 'ব্যাকএন্ড থেকে বাস্তব পেন্ডিং অবস্থা পাওয়া গেলে এই অংশে তা দেখানো হবে।'
                : 'This panel will populate only when the backend provides real pending-action state.'}
            </p>
          </div>
        ) : (
          <div className="py-2 divide-y divide-slate-100">
            {PENDING_ACTIONS.map((item) => (
              <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-lg hover:bg-slate-50/70">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                    {getActionIcon(item.actionType)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#172033]">{item.title}</span>
                    <p className="text-xs text-[#5F6B7A] mt-0.5">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => onActionClick(item)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold border border-[#0B6FA4] text-[#0B6FA4] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"
                >
                  {item.actionText}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          id="btn-view-all-pending"
          onClick={onViewAllPending}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#0B6FA4] hover:bg-blue-50/50 py-2 px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"
        >
          <span>{t.viewAll}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
