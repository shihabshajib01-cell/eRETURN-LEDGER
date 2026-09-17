import React, { useState } from 'react';
import { X, FileCheck2, Building2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Language } from '../../types';
import { SourceBadge } from '../StatusChip';

interface ClaimChallanDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess: () => void;
  lang: Language;
}

export const ClaimChallanDrawer: React.FC<ClaimChallanDrawerProps> = ({
  isOpen,
  onClose,
  onClaimSuccess,
}) => {
  const [claiming, setClaiming] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const challanData = {
    challanNo: '2026-CH-094182903',
    section: 'Section 154 — Advance Income Tax',
    source: 'iBAS++ Treasury Automated Feed',
    bank: 'Sonali Bank PLC (Motijheel Corp. Branch)',
    date: '18 Nov 2025',
    verifiedAmount: 65365,
    depositedBy: 'S.M. Emdadul Haque (TIN: 4829-1039-4812)'
  };

  const handleClaim = () => {
    setClaiming(true);
    setTimeout(() => {
      setClaiming(false);
      setSuccess(true);
      setTimeout(() => {
        onClaimSuccess();
        setSuccess(false);
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div 
        id="claim-challan-drawer-panel"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#172033]">
                Claim Advance Tax Challan
              </h3>
              <p className="text-xs text-[#5F6B7A]">
                Advance Income Tax u/s 154
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              This challan was matched automatically via <strong>iBAS++</strong> matching your e-TIN. Review the deposit details and confirm your claim to include it in the AIT balance.
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 bg-white">
            <div className="p-3 bg-slate-50/60 flex items-center justify-between">
              <span className="font-semibold text-slate-600">Treasury Challan No.</span>
              <span className="font-mono font-bold text-slate-800">{challanData.challanNo}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-600">Tax Head</span>
              <span className="font-medium text-slate-800">{challanData.section}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-600">Data Origin / Source</span>
              <SourceBadge source="iBAS++" size="sm" />
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-600">Depositing Bank</span>
              <span className="font-medium text-slate-800">{challanData.bank}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-600">Deposit Date</span>
              <span className="font-medium text-slate-800">{challanData.date}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-600">Deposited For</span>
              <span className="font-medium text-slate-800">{challanData.depositedBy}</span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-500 font-medium">Verified Deposit Amount:</span>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                ● Ready to claim into AIT Total
              </div>
            </div>
            <div className="text-xl font-bold font-mono text-[#0B6FA4]">
              ৳ {challanData.verifiedAmount.toLocaleString('en-IN')}
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
            id="btn-confirm-claim-challan"
            onClick={handleClaim}
            disabled={claiming}
            className="px-6 py-2 rounded-lg bg-[#006A4E] hover:bg-[#00533d] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-2xs"
          >
            {claiming ? (
              <span>Claiming Record...</span>
            ) : success ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Claimed Successfully!</span>
              </>
            ) : (
              <>
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Claim This Challan (৳ 65,365)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
