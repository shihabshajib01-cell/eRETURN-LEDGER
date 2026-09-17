import React from 'react';
import { X, FileCheck2, ArrowUpRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface TaxPaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToEReturn: () => void;
  lang: Language;
}

export const TaxPaymentStatusModal: React.FC<TaxPaymentStatusModalProps> = ({
  isOpen,
  onClose,
  onGoToEReturn,
  lang
}) => {
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        id="tax-payment-status-modal"
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006A4E] border border-emerald-100 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#172033]">
                Tax Payment Status & Reconciled Credits
              </h3>
              <p className="text-xs text-[#5F6B7A]">
                Summary breakdown ready for transfer to eReturn
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Ready for eReturn:</strong> 10 of 14 categories are fully verified and reconciled. The total credit of <strong>৳ 1,65,61,066</strong> will be automatically transferred to the Tax & Payment schedule.
            </div>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg bg-white overflow-hidden">
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">1. Source Tax (TDS)</span>
                <p className="text-[11px] text-slate-500">8 Categories • 142 Records verified</p>
              </div>
              <span className="font-bold font-mono text-slate-900 text-sm">৳ 1,33,09,693</span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">2. Advance Income Tax (AIT)</span>
                <p className="text-[11px] text-slate-500">2 Categories • 18 Records verified</p>
              </div>
              <span className="font-bold font-mono text-slate-900 text-sm">৳ 1,90,365</span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">3. Other Tax Credits</span>
                <p className="text-[11px] text-slate-500">4 Categories • 32 Records</p>
              </div>
              <span className="font-bold font-mono text-slate-900 text-sm">৳ 31,07,675</span>
            </div>

            {/* Total Grand Row */}
            <div className="p-4 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#0B6FA4]">Total Available Tax Credit</span>
                <p className="text-[11px] text-emerald-700 font-semibold">● Verified & ready to transfer</p>
              </div>
              <span className="font-bold font-mono text-xl text-[#0B6FA4]">৳ 1,65,61,066</span>
            </div>
          </div>

          {/* Pending items note */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-center justify-between text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>3 pending action items remain in Ledger. You can reconcile now or proceed.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            id="btn-confirm-goto-ereturn"
            onClick={() => {
              onClose();
              onGoToEReturn();
            }}
            className="px-6 py-2 rounded-lg bg-[#006A4E] hover:bg-[#00533d] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-2xs"
          >
            <span>Proceed to eReturn (Tax & Payment)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
