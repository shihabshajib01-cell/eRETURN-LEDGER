import React, { useState } from 'react';
import { X, PlusCircle, ShieldCheck, Building2, Calendar, CheckCircle2, Lock } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { SourceBadge } from '../StatusChip';

interface AddTaxPaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (record: any) => void;
  lang: Language;
}

export const AddTaxPaymentDrawer: React.FC<AddTaxPaymentDrawerProps> = ({
  isOpen,
  onClose,
  onSavePayment,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [taxSection, setTaxSection] = useState('173');
  const [paymentMode, setPaymentMode] = useState('A-Challan');
  const [challanNo, setChallanNo] = useState('');
  const [bankName, setBankName] = useState('Sonali Bank PLC');
  const [branchName, setBranchName] = useState('Principal Branch, Motijheel, Dhaka');
  const [paymentDate, setPaymentDate] = useState('2026-09-15');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !challanNo) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSavedSuccess(true);
      setTimeout(() => {
        onSavePayment({
          section: taxSection,
          challanNo,
          bankName,
          branchName,
          paymentDate,
          amount: parseFloat(amount)
        });
        setSavedSuccess(false);
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div 
        id="add-tax-payment-drawer-panel"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#172033]">
                Add Tax Payment Record
              </h3>
              <p className="text-xs text-[#5F6B7A]">
                Manual Challan or e-Payment submission for verification
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Form */}
        <form id="add-payment-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Provenance note */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11.5px] leading-relaxed">
              Records entered manually are classified as <SourceBadge source="Manual Entry" size="sm" /> and will automatically be verified against the Treasury <strong>iBAS++</strong> system.
            </div>
          </div>

          {/* Assessment Year (Read Only) */}
          <div className="space-y-1">
            <label className="block font-semibold text-slate-700 flex items-center justify-between">
              <span>Assessment Year</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Read-Only
              </span>
            </label>
            <input
              type="text"
              readOnly
              value="2026–2027"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100/70 text-slate-600 font-medium cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Tax Section Category */}
          <div className="space-y-1">
            <label className="block font-semibold text-slate-700">
              Tax Head / Section Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={taxSection}
              onChange={(e) => setTaxSection(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#0B6FA4]/20 focus:border-[#0B6FA4]"
            >
              <option value="173">Section 173 — Tax Paid with Return</option>
              <option value="154">Section 154 — Advance Tax (Challan)</option>
              <option value="surcharge">Environmental Surcharge Schedule</option>
              <option value="120">Section 120 — TDS on Contractor & Professional</option>
            </select>
          </div>

          {/* Payment Method / Mode */}
          <div className="space-y-1">
            <label className="block font-semibold text-slate-700">
              Payment Method <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['A-Challan', 'e-Payment', 'Bank Challan'].map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                    paymentMode === mode
                      ? 'border-[#0B6FA4] bg-blue-50 text-[#0B6FA4] font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Challan No / Transaction ID */}
          <div className="space-y-1">
            <label className="block font-semibold text-slate-700">
              Challan / Scroll / Token No. <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 2026-CH-098271049"
              value={challanNo}
              onChange={(e) => setChallanNo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-mono focus:ring-2 focus:ring-[#0B6FA4]/20 focus:border-[#0B6FA4]"
            />
            <p className="text-[11px] text-slate-500">
              Enter 17-digit A-Challan number or Bank Scroll number.
            </p>
          </div>

          {/* Bank & Branch Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Bank Name
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-[#0B6FA4]/20"
              >
                <option value="Sonali Bank PLC">Sonali Bank PLC</option>
                <option value="Bangladesh Bank">Bangladesh Bank</option>
                <option value="Janata Bank PLC">Janata Bank PLC</option>
                <option value="Agrani Bank PLC">Agrani Bank PLC</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Challan Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-[#0B6FA4]/20"
              />
            </div>
          </div>

          {/* Branch Name */}
          <div className="space-y-1">
            <label className="block font-semibold text-slate-700">
              Branch Name
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800"
            />
          </div>

          {/* Amount in BDT */}
          <div className="space-y-1 pt-1">
            <label className="block font-semibold text-slate-700">
              Amount Paid (BDT ৳) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-slate-500">
                ৳
              </span>
              <input
                type="number"
                required
                min="1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-bold font-mono text-base focus:ring-2 focus:ring-[#0B6FA4]/20 focus:border-[#0B6FA4]"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Amount must match the exact figure printed on the Treasury challan.
            </p>
          </div>
        </form>

        {/* Fixed Footer: Cancel, Save */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-save-tax-payment"
            form="add-payment-form"
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-[#0B6FA4] hover:bg-[#095782] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-2xs disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving & Verifying...</span>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved & Recorded!</span>
              </>
            ) : (
              <span>Save & Verify Challan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
