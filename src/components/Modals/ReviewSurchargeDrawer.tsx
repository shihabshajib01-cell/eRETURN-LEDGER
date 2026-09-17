import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { Language } from '../../types';
import { SourceBadge } from '../StatusChip';

interface ReviewSurchargeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: () => void;
  lang: Language;
}

export const ReviewSurchargeDrawer: React.FC<ReviewSurchargeDrawerProps> = ({
  isOpen,
  onClose,
  onResolve,
}) => {
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<'accept-challan' | 'manual-adjust'>('accept-challan');

  if (!isOpen) return null;

  const handleResolve = () => {
    setResolving(true);
    setTimeout(() => {
      setResolving(false);
      setResolved(true);
      setTimeout(() => {
        onResolve();
        setResolved(false);
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div 
        id="review-surcharge-drawer-panel"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#172033]">
                Reconcile Environmental Surcharge
              </h3>
              <p className="text-xs text-[#5F6B7A]">
                Discrepancy Resolution • Schedule Surcharge
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Discrepancy Detected:</strong> The amount declared in eReturn Income (<strong>৳ 3,50,000</strong>) is compared with the verified Treasury A-Challan payment. Please select how you wish to reconcile.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">Declared Amount:</span>
              <div className="text-base font-bold font-mono text-slate-900 mt-1">
                ৳ 3,50,000
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                From eReturn Return Form
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">Verified Payment:</span>
              <div className="text-base font-bold font-mono text-emerald-700 mt-1">
                ৳ 3,50,000
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                Matched via iBAS++
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-slate-800">Resolution Action:</label>

            <div 
              onClick={() => setSelectedMatch('accept-challan')}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                selectedMatch === 'accept-challan'
                  ? 'border-[#0B6FA4] bg-blue-50/40 shadow-2xs'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  checked={selectedMatch === 'accept-challan'}
                  onChange={() => setSelectedMatch('accept-challan')}
                  className="text-[#0B6FA4]"
                />
                <span className="font-bold text-slate-900">
                  Accept & Match Verified Challan (৳ 3,50,000)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 ml-6 mt-1">
                Reconciles the record status from "Needs Review" to "Complete & Verified".
              </p>
            </div>

            <div 
              onClick={() => setSelectedMatch('manual-adjust')}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                selectedMatch === 'manual-adjust'
                  ? 'border-[#0B6FA4] bg-blue-50/40 shadow-2xs'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  checked={selectedMatch === 'manual-adjust'}
                  onChange={() => setSelectedMatch('manual-adjust')}
                  className="text-[#0B6FA4]"
                />
                <span className="font-bold text-slate-900">
                  Submit Revised Challan Copy
                </span>
              </div>
              <p className="text-[11px] text-slate-500 ml-6 mt-1">
                Provide alternative Treasury token for verification.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-resolve-surcharge"
            onClick={handleResolve}
            disabled={resolving}
            className="px-6 py-2 rounded-lg bg-[#0B6FA4] hover:bg-[#095782] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-2xs"
          >
            {resolving ? (
              <span>Reconciling...</span>
            ) : resolved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reconciled Successfully!</span>
              </>
            ) : (
              <span>Confirm & Mark Complete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
