import React from 'react';
import { 
  AlertCircle, 
  RefreshCw, 
  FileCheck2, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  ReceiptText,
  Scale
} from 'lucide-react';
import { Language, PendingActionItem } from '../types';
import { PENDING_ACTIONS } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface PendingActionsProps {
  lang: Language;
  onActionClick: (action: PendingActionItem) => void;
  onViewAllPending: () => void;
}

export const PendingActions: React.FC<PendingActionsProps> = ({ 
  lang, 
  onActionClick,
  onViewAllPending 
}) => {
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

  const getActionButtonStyle = (type: string) => {
    switch (type) {
      case 'sync':
        return 'bg-[#0B6FA4] hover:bg-[#095782] text-white border-transparent';
      case 'claim':
        return 'bg-[#006A4E] hover:bg-[#00523c] text-white border-transparent';
      case 'review':
        return 'bg-amber-600 hover:bg-amber-700 text-white border-transparent';
      default:
        return 'bg-[#0B6FA4] hover:bg-[#095782] text-white border-transparent';
    }
  };

  return (
    <div 
      id="panel-pending-actions"
      className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-2xs h-full"
    >
      <div>
        {/* Header with badge */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#172033] tracking-tight">
              {t.pendingActions}
            </h2>
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shadow-2xs">
              3
            </span>
          </div>
          <span className="text-xs text-[#5F6B7A] font-medium hidden sm:inline">
            {lang === 'bn' ? 'জরুরি পদক্ষেপ প্রয়োজন' : 'Requires your attention'}
          </span>
        </div>

        {/* Action Rows */}
        <div className="py-2 divide-y divide-slate-100">
          {PENDING_ACTIONS.map((item, idx) => (
            <div 
              key={item.id}
              id={`pending-item-${item.id}`}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/70 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/60">
                  {getActionIcon(item.actionType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#172033]">
                      {item.title}
                    </span>
                    {item.amount && (
                      <span className="text-[11px] font-mono font-medium text-slate-500">
                        (৳ {item.amount.toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5F6B7A] mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                id={`btn-pending-action-${item.id}`}
                onClick={() => onActionClick(item)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 transition-all shadow-2xs flex items-center justify-center gap-1.5 ${getActionButtonStyle(
                  item.actionType
                )}`}
              >
                <span>{item.actionText}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* View All Footer */}
      <div className="pt-2 border-t border-slate-100">
        <button
          id="btn-view-all-pending"
          onClick={onViewAllPending}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#0B6FA4] hover:text-[#084c72] hover:bg-blue-50/50 py-1.5 px-2 rounded transition-colors group"
        >
          <span>{t.viewAll} (3 Pending)</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
