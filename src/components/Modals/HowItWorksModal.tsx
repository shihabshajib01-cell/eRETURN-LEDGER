import React from 'react';
import { X, Database, ShieldCheck, CheckCircle2, RefreshCw, FileText } from 'lucide-react';
import { Language } from '../../types';
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose, lang }) => {
  const dialogRef = useDialogFocusTrap(isOpen, onClose);
  if (!isOpen) return null;

  const steps = lang === 'bn'
    ? [
        { num: '1', title: 'সংগ্রহ / সিঙ্ক', desc: 'বর্তমান লেজার ক্যাটাগরি অনুযায়ী সিস্টেম, eReturn Income, অনুসন্ধান বা ম্যানুয়াল এন্ট্রি থেকে রেকর্ড দেখুন বা আনুন।', icon: Database },
        { num: '2', title: 'যাচাই', desc: 'যেসব ক্যাটাগরিতে বর্তমান সিস্টেম যাচাই অবস্থা দেয়, সেগুলোর অবস্থা পর্যালোচনা করুন।', icon: ShieldCheck },
        { num: '3', title: 'দাবি', desc: 'উৎস কর, AIT এবং অন্যান্য সমর্থিত কর ক্রেডিটে বর্তমান ব্যবসায়িক নিয়ম অনুযায়ী দাবি করুন।', icon: CheckCircle2 },
        { num: '4', title: 'সমন্বয়', desc: 'Tax Payment Status-এ সব বর্তমান কর পেমেন্ট ও ক্রেডিটের মোট পর্যালোচনা করুন।', icon: RefreshCw },
        { num: '5', title: 'ই-রিটার্নে ফিরে যান', desc: 'লেজারের কাজ শেষ হলে বিদ্যমান Go to eReturn হ্যান্ডঅফ ব্যবহার করে Tax & Payment ফ্লোতে ফিরুন।', icon: FileText },
      ]
    : [
        { num: '1', title: 'COLLECT / SYNC', desc: 'Use the current Ledger category flow to review or bring in records from system data, eReturn Income, lookup, or manual entry where supported.', icon: Database },
        { num: '2', title: 'VERIFY', desc: 'Review verification state only in categories where the current system actually provides one.', icon: ShieldCheck },
        { num: '3', title: 'CLAIM', desc: 'Claim Source Tax, AIT, and other supported credits according to the existing business rules.', icon: CheckCircle2 },
        { num: '4', title: 'RECONCILE', desc: 'Review all current tax payments and credits together in Tax Payment Status.', icon: RefreshCw },
        { num: '5', title: 'RETURN TO eRETURN', desc: 'When Ledger work is complete, use the existing Go to eReturn handoff to continue the Tax & Payment flow.', icon: FileText },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="how-it-works-title" className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h2 id="how-it-works-title" className="font-bold text-base text-[#172033]">
              {lang === 'bn' ? 'eReturn Ledger কীভাবে কাজ করে' : 'How eReturn Ledger Works'}
            </h2>
            <p className="text-xs text-[#5F6B7A] mt-0.5">
              {lang === 'bn' ? 'বর্তমান যাচাইকৃত লেজার যাত্রার সারাংশ' : 'Summary of the verified current Ledger journey'}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'} className="p-2 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 text-xs">
          <p className="text-slate-700 leading-relaxed mb-4">
            {lang === 'bn'
              ? 'এই রিডিজাইন শুধুমাত্র বর্তমান লেজারের UX/UI আধুনিক করছে; নতুন ট্যাক্স নিয়ম, ইন্টিগ্রেশন বা অটো-ভেরিফিকেশন আচরণ যোগ করছে না।'
              : 'This redesign modernizes the current Ledger UX/UI only. It does not introduce new tax rules, integrations, or automatic verification behavior.'}
          </p>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-[#0B6FA4] border border-blue-100 font-bold text-xs">{step.num}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-slate-900 mb-0.5 flex items-center gap-2"><Icon className="w-3.5 h-3.5 text-[#0B6FA4]" />{step.title}</div>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
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
