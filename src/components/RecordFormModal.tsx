import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { LedgerColumn, LedgerRecord } from '../data/ledgerRecords';

interface RecordFormModalProps {
  isOpen: boolean;
  title: string;
  columns: LedgerColumn[];
  record?: LedgerRecord | null;
  onClose: () => void;
  onSave: (record: LedgerRecord) => void;
}

export const RecordFormModal: React.FC<RecordFormModalProps> = ({ isOpen, title, columns, record, onClose, onSave }) => {
  const editableColumns = useMemo(() => columns.filter((column) => column.editable), [columns]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    const next: Record<string, string> = {};
    editableColumns.forEach((column) => {
      next[column.key] = record ? String(record[column.key] ?? '') : '';
    });
    setValues(next);
    setErrors({});
  }, [editableColumns, isOpen, record]);

  if (!isOpen) return null;

  const handleSave = () => {
    const nextErrors: Record<string, string> = {};
    editableColumns.forEach((column) => {
      const value = values[column.key]?.trim() ?? '';
      if (column.required && !value) nextErrors[column.key] = 'This field is required.';
      if (column.type === 'amount' && value && (Number.isNaN(Number(value)) || Number(value) < 0)) nextErrors[column.key] = 'Enter a valid non-negative amount.';
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const nextRecord: LedgerRecord = { id: record?.id ?? `record-${Date.now()}` };
    columns.forEach((column) => {
      if (column.editable) {
        nextRecord[column.key] = column.type === 'amount' ? Number(values[column.key] || 0) : values[column.key] || '';
      } else if (record) {
        nextRecord[column.key] = record[column.key];
      }
    });
    onSave(nextRecord);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="record-form-title" className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 id="record-form-title" className="text-lg font-bold text-slate-900">{record ? `Edit ${title}` : `Add ${title}`}</h2>
            <p className="mt-0.5 text-xs text-slate-500">Enter the record exactly as it appears on the tax payment document.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {editableColumns.map((column) => (
              <label key={column.key} className="space-y-1.5 text-sm">
                <span className="font-semibold text-slate-700">{column.label}{column.required && <span className="ml-1 text-red-600">*</span>}</span>
                {column.type === 'select' ? (
                  <select
                    value={values[column.key] ?? ''}
                    onChange={(event) => setValues((current) => ({ ...current, [column.key]: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0B6FA4] focus:ring-2 focus:ring-[#0B6FA4]/15"
                  >
                    <option value="">Select one</option>
                    {column.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : (
                  <input
                    type={column.type === 'amount' ? 'number' : 'text'}
                    inputMode={column.type === 'amount' ? 'decimal' : undefined}
                    value={values[column.key] ?? ''}
                    placeholder={column.type === 'date' ? 'DD-MM-YYYY' : `Enter ${column.label}`}
                    onChange={(event) => setValues((current) => ({ ...current, [column.key]: event.target.value }))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B6FA4] focus:ring-2 focus:ring-[#0B6FA4]/15"
                  />
                )}
                {errors[column.key] && <span className="block text-xs font-medium text-red-600">{errors[column.key]}</span>}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30">Cancel</button>
          <button type="button" onClick={handleSave} className="rounded-lg bg-[#0B6FA4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#095782] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40">Save</button>
        </div>
      </div>
    </div>
  );
};
