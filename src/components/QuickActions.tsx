import React from 'react';
import { 
  RefreshCw, 
  PlusCircle, 
  FileText, 
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface QuickActionsProps {
  lang: Language;
  onSyncIncome: () => void;
  onAddPayment: () => void;
  onViewStatus: () => void;
  onGoToEReturn: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  lang,
  onSyncIncome,
  onAddPayment,
  onViewStatus,
  onGoToEReturn
}) => {
  const t = TRANSLATIONS[lang];

  const actions = [
    {
      id: 'qa-sync',
      title: t.syncFromIncome,
      description: t.syncFromIncomeDesc,
      icon: RefreshCw,
      color: 'bg-sky-50 text-[#0B6FA4] border-sky-200/80',
      action: onSyncIncome,
      primaryAction: false,
    },
    {
      id: 'qa-add',
      title: t.addTaxPayment,
      description: t.addTaxPaymentDesc,
      icon: PlusCircle,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      action: onAddPayment,
      primaryAction: false,
    },
    {
      id: 'qa-status',
      title: t.viewPaymentStatus,
      description: t.viewPaymentStatusDesc,
      icon: FileText,
      color: 'bg-slate-50 text-slate-700 border-slate-200',
      action: onViewStatus,
      primaryAction: false,
    },
    {
      id: 'qa-goto-ereturn',
      title: t.continueToEReturn,
      description: t.continueToEReturnDesc,
      icon: ArrowUpRight,
      color: 'bg-emerald-50 text-[#006A4E] border-emerald-200',
      action: onGoToEReturn,
      primaryAction: true,
    }
  ];

  return (
    <div 
      id="panel-quick-actions"
      className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xs flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h2 className="text-base font-bold text-[#172033] tracking-tight">
            {t.quickActions}
          </h2>
          <span className="text-xs text-[#5F6B7A]">Core Ledger Operations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                id={`btn-${act.id}`}
                onClick={act.action}
                className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer group ${
                  act.primaryAction
                    ? 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 hover:border-emerald-400 shadow-2xs'
                    : 'bg-white hover:bg-slate-50/80 border-[#E2E8F0] hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#172033] group-hover:text-[#0B6FA4] transition-colors truncate">
                      {act.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B6FA4] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <p className="text-[11px] text-[#5F6B7A] mt-0.5 leading-snug line-clamp-1">
                    {act.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
