import React from 'react';
import { X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Language } from '../../types';
import { useLedgerRuntime } from '../../state/LedgerRuntimeContext';
import { formatLedgerNumber } from '../../utils/money';
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap';

interface GoToEReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const GoToEReturnModal: React.FC<GoToEReturnModalProps> = ({ isOpen, onClose, lang }) => {
  const runtime = useLedgerRuntime();
  const dialogRef = useDialogFocusTrap(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="goto-ereturn-title"
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden"
      >
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006A4E] text-white flex items-center justify-center font-bold text-xs">eR</div>
            <div>
              <h2 id="goto-ereturn-title" className="font-bold text-base text-[#172033]">
                {lang === 'bn' ? 'ই-রিটার্নে ফিরে যান' : 'Return to eReturn'}
              </h2>
              <p className="text-xs text-[#5F6B7A]">
                {lang === 'bn' ? 'Tax & Payment ফ্লোতে ফিরে যাওয়ার বর্তমান হ্যান্ডঅফ' : 'Existing handoff back to the Tax & Payment flow'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'} className="p-2 rounded text-slate-500 hover:text-slate-800 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/30"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 text-sm">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-4">
            <span className="text-[#5F6B7A]">{lang === 'bn' ? 'বর্তমান লেজার মোট' : 'Current Ledger total'}</span>
            <span className="font-bold text-lg text-[#006A4E] whitespace-nowrap">{formatLedgerNumber(runtime.total)}</span>
          </div>

          <div className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-700 bg-blue-50/60 border border-blue-100 rounded-lg p-3">
            <ShieldCheck className="w-4 h-4 text-[#0B6FA4] shrink-0 mt-0.5" />
            <span>
              {lang === 'bn'
                ? 'এই রিডিজাইন প্রোটোটাইপে নতুন ট্রান্সফার, লকিং বা অটো-আপডেট আচরণ যোগ করা হয়নি। প্রোডাকশনের বিদ্যমান “Go to eReturn” হ্যান্ডঅফই সংযুক্ত করতে হবে।'
                : 'This redesign prototype does not invent transfer, locking, or automatic-update behavior. The existing production “Go to eReturn” handoff must be connected here.'}
            </span>
          </div>
        </div>

        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30">
            {lang === 'bn' ? 'লেজারে থাকুন' : 'Stay in Ledger'}
          </button>
          <button
            type="button"
            disabled
            title={lang === 'bn' ? 'প্রোডাকশন হ্যান্ডঅফ URL/API সংযুক্ত করতে হবে' : 'Connect the production handoff URL/API before enabling navigation'}
            className="px-5 py-2 rounded-lg bg-[#006A4E] text-white text-xs font-semibold flex items-center gap-2 opacity-50 cursor-not-allowed disabled:pointer-events-none"
          >
            <span>{lang === 'bn' ? 'ই-রিটার্নে যান' : 'Go to eReturn'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
