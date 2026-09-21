import React from 'react';
import { X, FileText } from 'lucide-react';
import { Language } from '../../types';
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap';
import { LedgerGuideContent } from '../LedgerHomePage';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose, lang }) => {
  const dialogRef = useDialogFocusTrap(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="how-it-works-title" className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h2 id="how-it-works-title" className="font-bold text-base text-[#172033]">
              {lang === 'bn' ? 'eReturn Ledger কীভাবে কাজ করে' : 'How eReturn Ledger Works'}
            </h2>
            <p className="text-xs text-[#5F6B7A] mt-0.5">
              {lang === 'bn' ? 'eReturn Ledger-এর সম্পূর্ণ নির্দেশিকা' : 'Complete eReturn Ledger guide'}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'} className="p-2 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <LedgerGuideContent
            lang={lang}
            idPrefix="how-it-works"
            className="space-y-6 px-5 py-5 text-sm leading-7 text-[#263247] sm:px-6"
          />
        </div>

        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => window.open('https://nbr.gov.bd/publications/income-tax/60', '_blank', 'noopener,noreferrer')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#C8D4E1] bg-white text-[#0B6FA4] text-xs font-semibold hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
          >
            <FileText className="w-3.5 h-3.5" />
            {lang === 'bn' ? 'বর্তমান NBR আয়কর নির্দেশিকা' : 'Current NBR Income Tax Guide'}
          </button>
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-[#0B6FA4] hover:bg-[#095782] text-white text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40">
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
