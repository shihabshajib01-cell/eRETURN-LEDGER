import React, { useState } from 'react';
import { X, ArrowUpRight, CheckCircle2, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface GoToEReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const GoToEReturnModal: React.FC<GoToEReturnModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [transferring, setTransferring] = useState(false);
  const [transferred, setTransferred] = useState(false);

  if (!isOpen) return null;

  const handleProceed = () => {
    setTransferring(true);
    setTimeout(() => {
      setTransferring(false);
      setTransferred(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        id="goto-ereturn-modal-panel"
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006A4E] text-white flex items-center justify-center shadow-2xs font-bold text-xs">
              eR
            </div>
            <div>
              <h3 className="font-bold text-base text-[#172033]">
                Transfer Credits to eReturn
              </h3>
              <p className="text-xs text-[#5F6B7A]">
                Tax & Payment Schedule Integration
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {!transferred ? (
            <>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Reconciled Tax Credit to Transfer:</span>
                  <span className="font-mono font-bold text-base text-[#006A4E]">
                    ৳ 1,65,61,066
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  Includes TDS (৳ 1,33,09,693) + AIT (৳ 1,90,365) + Other Credits (৳ 31,07,675)
                </div>
              </div>

              <div className="space-y-2 text-slate-700 leading-relaxed">
                <p>
                  Upon clicking continue, all verified and claimed ledger records will be locked and reflected in the <strong>eReturn Tax & Payment</strong> calculation sheet.
                </p>
                <div className="flex items-center gap-2 text-[11.5px] text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Your eReturn form draft will be updated immediately.</span>
                </div>
              </div>
            </>
          ) : (
            <div className="py-6 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">
                  Ledger Successfully Transferred!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm">
                  ৳ 1,65,61,066 has been applied to Tax & Payment schedule for Assessment Year 2026–2027.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            {transferred ? 'Close' : 'Back to Ledger'}
          </button>
          
          {!transferred ? (
            <button
              id="btn-confirm-transfer-to-ereturn"
              onClick={handleProceed}
              disabled={transferring}
              className="px-5 py-2 rounded-lg bg-[#006A4E] hover:bg-[#00533d] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-2xs"
            >
              {transferring ? (
                <span>Transferring to eReturn...</span>
              ) : (
                <>
                  <span>Transfer & Open eReturn</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#0B6FA4] hover:bg-[#095782] text-white text-xs font-semibold transition-all"
            >
              Continue Working
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
