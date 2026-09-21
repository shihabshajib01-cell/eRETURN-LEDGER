import React, { useEffect, useMemo, useState } from 'react';
import { Check, Edit2, Plus, Trash2, X } from 'lucide-react';
import { Language } from '../types';
import { LedgerTable, LedgerTableBody, LedgerTableFrame, LedgerTableHead, LedgerTableSummaryGroup, LedgerTableSummaryItem, LedgerTableToolbar, LedgerTableViewport } from './table/LedgerTable';
import { usePersistentState } from '../hooks/usePersistentState';
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

  const cancelAdd = () => {
    setAdding(false);
    setForm(EMPTY);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  const handleInlineKeyDown = (event: React.KeyboardEvent, mode: 'add' | 'edit') => {
    if (event.key === 'Escape') {
      if (mode === 'add') cancelAdd();
      else cancelEdit();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (mode === 'add') saveAdd();
      else saveEdit();
    }
  };

  const renderInlineControl = (key: keyof FormState, mode: 'add' | 'edit', autoFocus = false) => {
    if (key === 'year') {
      return (
        <select
          autoFocus={autoFocus}
          value={form.year}
          onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
          onKeyDown={(event) => handleInlineKeyDown(event, mode)}
          aria-label={labelText(key)}
          className="ledger-inline-control w-full min-w-[130px] bg-white text-sm"
        >
          <option value="2025-2026">2025-2026</option>
        </select>
      );
    }

    const numeric = key === 'refund' || key === 'claimed';
    return (
      <input
        autoFocus={autoFocus}
        value={form[key]}
        onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
        onKeyDown={(event) => handleInlineKeyDown(event, mode)}
        inputMode={numeric ? 'decimal' : undefined}
        aria-label={labelText(key)}
        placeholder={key === 'date' ? 'DD-MM-YYYY' : labelText(key)}
        className={`ledger-inline-control w-full min-w-[135px] bg-white text-sm ${numeric ? 'text-right' : ''}`}
      />
    );
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
            <div className="h-9 w-px bg-[#E3E8F0]" aria-hidden="true" />
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
              {rows.map((row, index) => {
                const isEditingRow = editing?.id === row.id;
                if (isEditingRow) {
                  return (
                    <tr key={row.id} className="ledger-table-editor-row align-top">
                      <td data-label="SL." className="text-slate-500">{index + 1}</td>
                      {(Object.keys(form) as Array<keyof FormState>).map((key, columnIndex) => (
                        <td key={key} data-label={labelText(key)}>
                          {renderInlineControl(key, 'edit', columnIndex === 0)}
                        </td>
                      ))}
                      <td data-label={isBn ? "যাচাই অবস্থা" : "Verification Status"} className="text-xs text-amber-700">
                        {statusText(row.verificationStatus)}
                      </td>
                      <td data-label={isBn ? "অ্যাকশন" : "Action"}>
                        <div className="flex justify-end gap-1.5">
                          <button type="button" onClick={saveEdit} disabled={!valid} aria-label={isBn ? "সংরক্ষণ" : "Save"} className="ledger-inline-action ledger-inline-save"><Check className="h-4 w-4" /></button>
                          <button type="button" onClick={cancelEdit} aria-label={isBn ? "বাতিল" : "Cancel"} className="ledger-inline-action ledger-inline-cancel"><X className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={row.id}>
                    <td data-label="SL." className="text-slate-500">{index + 1}</td>
                    <td data-label={labelText("year")}>{row.year}</td>
                    <td data-label={labelText("reference")}>{row.reference}</td>
                    <td data-label={labelText("date")}>{row.date}</td>
                    <td data-label={labelText("zone")}>{row.zone}</td>
                    <td data-label={labelText("circle")}>{row.circle}</td>
                    <td data-label={labelText("refund")} className="text-right tabular-nums">{row.refund}</td>
                    <td data-label={labelText("claimed")} className="text-right font-semibold tabular-nums">{row.claimed}</td>
                    <td data-label={isBn ? "যাচাই অবস্থা" : "Verification Status"}>
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{statusText(row.verificationStatus)}</span>
                    </td>
                    <td data-label={isBn ? "অ্যাকশন" : "Action"}>
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => openEdit(row)} aria-label={isBn ? "সম্পাদনা" : "Edit"} className="ledger-row-action text-[#0B6FA4]"><Edit2 className="h-4 w-4" /></button>
                        <button type="button" onClick={() => remove(row.id)} aria-label={isBn ? "মুছুন" : "Delete"} className="ledger-row-action text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {adding && (
                <tr className="ledger-table-editor-row align-top">
                  <td data-label="SL." className="text-slate-500">{rows.length + 1}</td>
                  {(Object.keys(form) as Array<keyof FormState>).map((key, columnIndex) => (
                    <td key={key} data-label={labelText(key)}>
                      {renderInlineControl(key, 'add', columnIndex === 0)}
                    </td>
                  ))}
                  <td data-label={isBn ? "যাচাই অবস্থা" : "Verification Status"} className="text-xs text-amber-700">
                    {isBn ? 'DCT যাচাই অপেক্ষমাণ' : 'Pending DCT Verification'}
                  </td>
                  <td data-label={isBn ? "অ্যাকশন" : "Action"}>
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={saveAdd} disabled={!valid} aria-label={isBn ? "সংরক্ষণ" : "Save"} className="ledger-inline-action ledger-inline-save"><Check className="h-4 w-4" /></button>
                      <button type="button" onClick={cancelAdd} aria-label={isBn ? "বাতিল" : "Cancel"} className="ledger-inline-action ledger-inline-cancel ledger-inline-cancel-danger"><X className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              )}
            </LedgerTableBody>
          </LedgerTable>
        </LedgerTableViewport>
      </LedgerTableFrame>

    </section>
  );
};
