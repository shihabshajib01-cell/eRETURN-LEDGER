import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { SourceBadge } from '../StatusChip';

interface SyncIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete: () => void;
  lang: Language;
}

export const SyncIncomeModal: React.FC<SyncIncomeModalProps> = ({
  isOpen,
  onClose,
  onSyncComplete,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedRecords, setSelectedRecords] = useState<string[]>(['div-1', 'div-2', 'div-3']);
  const [syncing, setSyncing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const records = [
    {
      id: 'div-1',
      sourceCompany: 'Grameenphone Ltd. (GP)',
      boId: '1201980045920194',
      taxDeducted: 85000,
      grossDividend: 850000,
      date: '14 Oct 2025',
      challanRef: 'CH-2025-GP-883'
    },
    {
      id: 'div-2',
      sourceCompany: 'Square Pharmaceuticals PLC',
      boId: '1201980045920194',
      taxDeducted: 40000,
      grossDividend: 400000,
      date: '02 Nov 2025',
      challanRef: 'CH-2025-SQ-102'
    },
    {
      id: 'div-3',
      sourceCompany: 'Beximco Pharmaceuticals Ltd.',
      boId: '1201980045920194',
      taxDeducted: 20000,
      grossDividend: 200000,
      date: '12 Nov 2025',
      challanRef: 'CH-2025-BX-409'
    }
  ];

  const totalTax = records
    .filter(r => selectedRecords.includes(r.id))
    .reduce((sum, r) => sum + r.taxDeducted, 0);

  const toggleSelect = (id: string) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(r => r !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  const handleExecuteSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSuccess(true);
      setTimeout(() => {
        onSyncComplete();
        setSuccess(false);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        id="sync-income-modal-content"
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0B6FA4] border border-sky-100 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#172033]">
                Sync Records from eReturn Income
              </h3>
              <p className="text-xs text-[#5F6B7A]">
                Dividend Income • Section 117A TDS Deductions
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-[#0B6FA4]">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#0B6FA4] shrink-0" />
              <span>
                Found <strong>3 eligible dividend records</strong> declared in eReturn Income module.
              </span>
            </div>
            <SourceBadge source="eReturn Income" size="sm" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Select Records to Import into Ledger:</span>
              <span className="text-slate-500 font-normal">
                {selectedRecords.length} of {records.length} selected
              </span>
            </div>

            {records.map((rec) => {
              const isSelected = selectedRecords.includes(rec.id);
              return (
                <div
                  key={rec.id}
                  onClick={() => toggleSelect(rec.id)}
                  className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50/50 border-[#0B6FA4] shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-[#0B6FA4] focus:ring-[#0B6FA4] cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-[#172033]">{rec.sourceCompany}</div>
                      <div className="text-[11px] text-slate-500">
                        BO ID: {rec.boId} • Ref: {rec.challanRef}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold font-mono text-[#0B6FA4] text-sm">
                      ৳ {rec.taxDeducted.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Gross: ৳ {rec.grossDividend.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reconciled preview box */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-medium">Total TDS Credit to be Claimed:</span>
              <div className="text-[11px] text-slate-400">Section 117A • Tax will be added to Source Tax total</div>
            </div>
            <div className="text-base font-bold font-mono text-[#172033]">
              ৳ {totalTax.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-sync-action"
            onClick={handleExecuteSync}
            disabled={selectedRecords.length === 0 || syncing}
            className="px-5 py-2 rounded-lg bg-[#0B6FA4] hover:bg-[#095782] text-white text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-50 shadow-2xs"
          >
            {syncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing records...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Successfully Synced!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Import & Claim Selected ({selectedRecords.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
