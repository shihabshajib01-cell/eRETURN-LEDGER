import React from 'react';
import { X, ArrowRight, ShieldCheck, Database, CheckCircle2, RefreshCw, FileText } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: 'COLLECT & SYNC',
      desc: 'eReturn Ledger gathers tax records from eReturn Income declarations, iBAS++ Treasury, BRTA, and manual Challan entries.',
      icon: Database,
      color: 'bg-blue-50 text-[#0B6FA4] border-blue-200'
    },
    {
      num: '2',
      title: 'VERIFY',
      desc: 'External verification engines match Challans, Bank scrolls, and withholding statements against government registries.',
      icon: ShieldCheck,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      num: '3',
      title: 'CLAIM',
      desc: 'Taxpayer reviews and confirms eligible tax credits across Source Tax (TDS), AIT, and other withholding categories.',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      num: '4',
      title: 'RECONCILE',
      desc: 'Identify and resolve any mismatches, environmental surcharge variances, or carry-forward adjustments in one unified place.',
      icon: RefreshCw,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      num: '5',
      title: 'TRANSFER TO eRETURN',
      desc: 'Reconciled amounts are transferred directly to eReturn Tax & Payment schedule for instant, error-free return filing.',
      icon: FileText,
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        id="how-it-works-modal-panel"
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="font-bold text-base text-[#172033]">
              How eReturn Ledger Works
            </h3>
            <p className="text-xs text-[#5F6B7A]">
              Reconciliation journey from Income Declaration to Final Return Filing
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Steps */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <p className="text-slate-700 leading-relaxed">
            The <strong>eReturn Ledger</strong> is the official reconciliation engine for all tax payments, withholding taxes (TDS), and advance tax credits under the Bangladesh Income Tax Act 2023.
          </p>

          <div className="space-y-3 pt-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-start gap-3.5 shadow-2xs">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${step.color} font-bold text-xs`}>
                    {step.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-slate-900 mb-0.5">
                      {step.title}
                    </div>
                    <p className="text-slate-600 text-[11.5px] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#0B6FA4] hover:bg-[#095782] text-white text-xs font-semibold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
