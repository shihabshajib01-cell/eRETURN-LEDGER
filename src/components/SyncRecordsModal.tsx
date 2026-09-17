import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, RefreshCw, X } from 'lucide-react';
import { LedgerColumn, LedgerRecord } from '../data/ledgerRecords';

interface SyncRecordsModalProps {
  isOpen: boolean;
  title: string;
  columns: LedgerColumn[];
  candidates: LedgerRecord[];
  existingRecords: LedgerRecord[];
  onClose: () => void;
  onSync: (records: LedgerRecord[]) => void;
}

const formatCell = (record: LedgerRecord, column: LedgerColumn) => {
  const value = record[column.key];
  if (column.type === 'amount' && typeof value === 'number') return value.toLocaleString('en-IN');
  return String(value ?? '—');
};

export const SyncRecordsModal: React.FC<SyncRecordsModalProps> = ({ isOpen, title, columns, candidates, existingRecords, onClose, onSync }) => {
  const existingIds = useMemo(() => new Set(existingRecords.map((record) => record.id)), [existingRecords]);
  const available = useMemo(() => candidates.filter((record) => !existingIds.has(record.id)), [candidates, existingIds]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) setSelected(new Set());
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((current) => current.size === available.length ? new Set() : new Set(available.map((record) => record.id)));
  };

  const selectedRecords = available.filter((record) => selected.has(record.id));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="sync-title" className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0B6FA4]"><RefreshCw className="h-4 w-4" /></div>
            <div>
              <h2 id="sync-title" className="text-lg font-bold text-slate-900">Sync {title} from eReturn Income</h2>
              <p className="mt-0.5 text-xs text-slate-500">Select eligible records that are not already present in the Ledger.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"><X className="h-5 w-5" /></button>
        </div>

        <div className="overflow-auto p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-[#0B6FA4]" /><span><strong>{existingRecords.length}</strong> already synced · <strong>{available.length}</strong> available</span></div>
            {available.length > 0 && <button type="button" onClick={toggleAll} className="text-xs font-bold text-[#0B6FA4] hover:underline">{selected.size === available.length ? 'Clear selection' : 'Select all available'}</button>}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-[#E8F1F5] text-slate-700">
                <tr>
                  <th className="w-12 px-4 py-3 text-left text-xs font-bold">Select</th>
                  {columns.map((column) => <th key={column.key} className={`whitespace-nowrap px-4 py-3 text-xs font-bold ${column.align === 'right' ? 'text-right' : 'text-left'}`}>{column.label}</th>)}
                  <th className="px-4 py-3 text-right text-xs font-bold">Sync Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {candidates.map((record) => {
                  const alreadySynced = existingIds.has(record.id);
                  return (
                    <tr key={record.id} className={alreadySynced ? 'bg-slate-50' : 'bg-white hover:bg-blue-50/30'}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={alreadySynced || selected.has(record.id)}
                          disabled={alreadySynced}
                          onChange={() => toggle(record.id)}
                          aria-label={`Select ${record.id}`}
                          className="h-4 w-4 accent-[#0B6FA4]"
                        />
                      </td>
                      {columns.map((column) => <td key={column.key} className={`whitespace-nowrap px-4 py-3 text-slate-700 ${column.align === 'right' ? 'text-right tabular-nums' : ''}`}>{formatCell(record, column)}</td>)}
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${alreadySynced ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>{alreadySynced ? 'Already synced' : 'Available'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
          <p className="text-xs font-medium text-slate-500">{selectedRecords.length} selected</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
            <button type="button" disabled={selectedRecords.length === 0} onClick={() => onSync(selectedRecords)} className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#095782] disabled:cursor-not-allowed disabled:opacity-50"><RefreshCw className="h-4 w-4" />Sync Selected</button>
          </div>
        </div>
      </div>
    </div>
  );
};
