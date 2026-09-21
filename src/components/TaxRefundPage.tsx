import React, { useEffect, useMemo, useState } from 'react';
import { Check, Edit2, Plus, Trash2, X } from 'lucide-react';
import { Language } from '../types';
import { LedgerTable, LedgerTableBody, LedgerTableFrame, LedgerTableHead, LedgerTableSummaryGroup, LedgerTableSummaryItem, LedgerTableToolbar, LedgerTableViewport } from './table/LedgerTable';
import { usePersistentState } from '../hooks/usePersistentState';
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber, parseMoney } from '../utils/money';
import { hasText, isValidLedgerDate, isValidMoneyInput, parseMoneyStrict } from '../utils/validation';

type RefundRow = {
  id: number;
  year: string;
  reference: string;
  date: string;
  zone: string;
  circle: string;
  refund: string;
  claimed: string;
  verificationStatus: 'Pending DCT Verification' | 'Verified';
};

const INITIAL_ROWS: RefundRow[] = [
  {
    id: 1,
    year: '2025-2026',
    reference: '112233',
    date: '31-08-2026',
    zone: 'Taxes Zone, Rajshahi',
    circle: 'Circle-08',
    refund: '10,03,333',
    claimed: '10,03,333',
    verificationStatus: 'Pending DCT Verification',
  },
];

const EMPTY = {
  year: '2025-2026',
  reference: '',
  date: '',
  zone: '',
  circle: '',
  refund: '',
  claimed: '',
};

type FormState = typeof EMPTY;

export const TaxRefundPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [rows, setRows] = usePersistentState<RefundRow[]>('ereturn-ledger:v4:tax-refund-rows', INITIAL_ROWS);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<RefundRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const { updateCategoryAmount } = useLedgerRuntime();
  const editDialogRef = useDialogFocusTrap(Boolean(editing), () => setEditing(null));
  const labelText = (key: string) => {
    const labels: Record<string, [string, string]> = {
      year: ['Assessment Year', 'করবর্ষ'],
      reference: ['Return Register / Reference No.', 'রিটার্ন রেজিস্টার / রেফারেন্স নং'],
      date: ['Date of Submission', 'দাখিলের তারিখ'],
      zone: ['Return Filing Zone', 'রিটার্ন দাখিল জোন'],
      circle: ['Return Filing Circle', 'রিটার্ন দাখিল সার্কেল'],
      refund: ['Refund Amount', 'রিফান্ডের পরিমাণ'],
      claimed: ['Adjustment Claim Amount', 'সমন্বয় দাবির পরিমাণ'],
    };
    const pair = labels[key];
    return pair ? pair[isBn ? 1 : 0] : key;
  };
  const statusText = (status: RefundRow['verificationStatus']) =>
    isBn
      ? (status === 'Verified' ? 'যাচাইকৃত' : 'DCT যাচাই অপেক্ষমাণ')
      : status;

  const totalClaimed = useMemo(() => rows.reduce((sum, row) => sum + parseMoney(row.claimed), 0), [rows]);

  useEffect(() => {
    updateCategoryAmount('tax-refund', totalClaimed);
  }, [totalClaimed, updateCategoryAmount]);

  const refundValue = parseMoneyStrict(form.refund);
  const claimedValue = parseMoneyStrict(form.claimed);
  const valid =
    hasText(form.year) &&
    hasText(form.reference) &&
    isValidLedgerDate(form.date) &&
    hasText(form.zone) &&
    hasText(form.circle) &&
    isValidMoneyInput(form.refund) &&
    isValidMoneyInput(form.claimed) &&
    refundValue !== null &&
    claimedValue !== null &&
    claimedValue <= refundValue;

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setAdding(true);
  };

  const saveAdd = () => {
    if (!valid) return;
    setRows((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((row) => row.id)) + 1,
        ...form,
        verificationStatus: 'Pending DCT Verification',
      },
    ]);
    setAdding(false);
    setForm(EMPTY);
  };

  const openEdit = (row: RefundRow) => {
    setAdding(false);
    setEditing(row);
    setForm({
      year: row.year,
      reference: row.reference,
      date: row.date,
      zone: row.zone,
      circle: row.circle,
      refund: row.refund,
      claimed: row.claimed,
    });
  };

  const saveEdit = () => {
    if (!editing || !valid) return;
    setRows((current) => current.map((row) =>
      row.id === editing.id
        ? { ...row, ...form, verificationStatus: row.verificationStatus }
        : row
    ));
    setEditing(null);
    setForm(EMPTY);
  };

  const remove = (id: number) => {
    if (window.confirm(isBn ? 'এই সমন্বয়টি মুছে ফেলবেন?' : 'Delete this refund adjustment?')) {
      setRows((current) => current.filter((row) => row.id !== id));
    }
  };

  return (
    <section className="ledger-page w-full" aria-labelledby="tax-refund-title">
      <header className="min-w-0">
        <h1 id="tax-refund-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
          {isBn ? 'কর রিফান্ড সমন্বয়' : 'Adjustment of Tax Refund'}
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-[#5F6B7A]">
          {isBn
            ? 'পূর্ববর্তী বছরের অতিরিক্ত পরিশোধিত করের সমন্বয় দাবি করুন। উপ কর কমিশনার যাচাই করার পর সমন্বয়টি সম্পূর্ণ কার্যকর হবে।'
            : 'Claim adjustment of excess tax paid in a previous year. The adjustment becomes fully effective after verification by the Deputy Commissioner of Taxes.'}
        </p>
      </header>

      <LedgerTableFrame>
        <LedgerTableToolbar>
          <LedgerTableSummaryGroup>
            <LedgerTableSummaryItem label={isBn ? 'মোট সমন্বয় দাবি' : 'Total Adjustment Claim'} value={formatLedgerNumber(totalClaimed)} accent />
            <div className="h-9 w-px bg-[#E2E8F0]" aria-hidden="true" />
            <LedgerTableSummaryItem label={isBn ? 'রেকর্ড' : 'Records'} value={rows.length} />
          </LedgerTableSummaryGroup>
          <button
            type="button"
            onClick={openAdd}
            disabled={adding}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#0B6FA4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0B6FA4] hover:bg-[#F2F8FC] disabled:opacity-50 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {isBn ? 'নতুন যোগ করুন' : 'Add new'}
          </button>
        </LedgerTableToolbar>
        <LedgerTableViewport>
          <LedgerTable className="ledger-responsive-table w-full min-w-[1080px] text-sm">
            <LedgerTableHead>
              <tr>
                <th className="px-4 py-3 text-left">SL.</th>
                <th className="px-4 py-3 text-left">{isBn ? 'করবর্ষ' : 'Assessment Year'}</th>
                <th className="px-4 py-3 text-left">{isBn ? 'রিটার্ন রেজিস্টার / রেফারেন্স নং' : 'Return Register / Reference No.'}</th>
                <th className="px-4 py-3 text-left">{isBn ? 'দাখিলের তারিখ' : 'Date of Submission'}</th>
                <th className="px-4 py-3 text-left">{isBn ? 'জোন' : 'Return Filing Zone'}</th>
                <th className="px-4 py-3 text-left">{isBn ? 'সার্কেল' : 'Return Filing Circle'}</th>
                <th className="px-4 py-3 text-right">{isBn ? 'রিফান্ডের পরিমাণ' : 'Refund Amount'}</th>
                <th className="px-4 py-3 text-right">{isBn ? 'সমন্বয় দাবি' : 'Adjustment Claim Amount'}</th>
                <th className="px-4 py-3 text-left">{isBn ? 'যাচাই অবস্থা' : 'Verification Status'}</th>
                <th className="px-4 py-3 text-right">{isBn ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </LedgerTableHead>
            <LedgerTableBody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td data-label="SL." className="px-4 py-3">{index + 1}</td>
                  <td data-label={labelText("year")} className="px-4 py-3">{row.year}</td>
                  <td data-label={labelText("reference")} className="px-4 py-3">{row.reference}</td>
                  <td data-label={labelText("date")} className="px-4 py-3">{row.date}</td>
                  <td data-label={labelText("zone")} className="px-4 py-3">{row.zone}</td>
                  <td data-label={labelText("circle")} className="px-4 py-3">{row.circle}</td>
                  <td data-label={labelText("refund")} className="px-4 py-3 text-right">{row.refund}</td>
                  <td data-label={labelText("claimed")} className="px-4 py-3 text-right font-semibold">{row.claimed}</td>
                  <td data-label={isBn ? "যাচাই অবস্থা" : "Verification Status"} className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      {statusText(row.verificationStatus)}
                    </span>
                  </td>
                  <td data-label={isBn ? "অ্যাকশন" : "Action"} className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => openEdit(row)} aria-label={isBn ? "সম্পাদনা" : "Edit"} className="rounded-md p-2 text-[#0B6FA4] hover:bg-blue-50"><Edit2 className="h-4 w-4" /></button>
                      <button type="button" onClick={() => remove(row.id)} aria-label={isBn ? "মুছুন" : "Delete"} className="rounded-md p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}

              {adding && (
                <tr className="bg-[#F5FAFD] align-top">
                  <td data-label="SL." className="px-4 py-3">{rows.length + 1}</td>
                  <td data-label="Assessment Year" className="px-2 py-2"><select value={form.year} onChange={(e) => setForm((s) => ({ ...s, year: e.target.value }))} className="w-full rounded-md border px-2 py-2"><option>2025-2026</option></select></td>
                  <td data-label="Reference" className="px-2 py-2"><input value={form.reference} onChange={(e) => setForm((s) => ({ ...s, reference: e.target.value }))} className="w-full rounded-md border px-2 py-2" /></td>
                  <td data-label="Date" className="px-2 py-2"><input value={form.date} onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))} placeholder="DD-MM-YYYY" className="w-full rounded-md border px-2 py-2" /></td>
                  <td data-label="Zone" className="px-2 py-2"><input value={form.zone} onChange={(e) => setForm((s) => ({ ...s, zone: e.target.value }))} className="w-full rounded-md border px-2 py-2" /></td>
                  <td data-label="Circle" className="px-2 py-2"><input value={form.circle} onChange={(e) => setForm((s) => ({ ...s, circle: e.target.value }))} className="w-full rounded-md border px-2 py-2" /></td>
                  <td data-label="Refund Amount" className="px-2 py-2"><input value={form.refund} onChange={(e) => setForm((s) => ({ ...s, refund: e.target.value }))} inputMode="decimal" className="w-full rounded-md border px-2 py-2 text-right" /></td>
                  <td data-label="Claim Amount" className="px-2 py-2"><input value={form.claimed} onChange={(e) => setForm((s) => ({ ...s, claimed: e.target.value }))} inputMode="decimal" className="w-full rounded-md border px-2 py-2 text-right" /></td>
                  <td data-label="Verification Status" className="px-4 py-3 text-xs text-amber-700">{isBn ? 'DCT যাচাই অপেক্ষমাণ' : 'Pending DCT Verification'}</td>
                  <td data-label="Action" className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={saveAdd} disabled={!valid} aria-label={isBn ? "সংরক্ষণ" : "Save"} className="rounded-md bg-emerald-600 p-2 text-white disabled:opacity-40"><Check className="h-4 w-4" /></button>
                      <button type="button" onClick={() => { setAdding(false); setForm(EMPTY); }} aria-label={isBn ? "বাতিল" : "Cancel"} className="rounded-md border p-2 text-slate-600"><X className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              )}
            </LedgerTableBody>
          </LedgerTable>
        </LedgerTableViewport>
      </LedgerTableFrame>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div ref={editDialogRef} tabIndex={-1} role="dialog" aria-modal="true" className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-bold">{isBn ? 'রিফান্ড সমন্বয় সম্পাদনা' : 'Edit Refund Adjustment'}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label={isBn ? "বন্ধ করুন" : "Close"}><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              {(Object.entries(form) as [keyof FormState, string][]).map(([key, value]) => (
                <label key={key} className="text-sm font-semibold text-[#172033]">
                  {labelText(key)}
                  {key === 'year' ? (
                    <select
                      value={value}
                      onChange={(e) => setForm((s) => ({ ...s, year: e.target.value }))}
                      className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5 font-normal"
                    >
                      <option value="2025-2026">2025-2026</option>
                    </select>
                  ) : (
                    <input
                      value={value}
                      onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
                      inputMode={key === 'refund' || key === 'claimed' ? 'decimal' : undefined}
                      className={`mt-1 w-full rounded-lg border px-3 py-2.5 font-normal ${key === 'refund' || key === 'claimed' ? 'text-right' : ''}`}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold">{isBn ? 'বাতিল' : 'Cancel'}</button>
              <button type="button" onClick={saveEdit} disabled={!valid} className="rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">{isBn ? 'সংরক্ষণ' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
