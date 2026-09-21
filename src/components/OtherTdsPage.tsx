import React, { useEffect, useMemo, useState } from 'react';
import { Check, Edit2, Plus, Trash2, X } from 'lucide-react';
import { Language } from '../types';
import { LedgerTable, LedgerTableBody, LedgerTableHead } from './table/LedgerTable';
import { usePersistentState } from '../hooks/usePersistentState';
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber, parseMoney } from '../utils/money';
import {
  hasText,
  isValidLedgerDate,
  isValidMoneyInput,
  parseMoneyStrict,
} from '../utils/validation';

type OtherTdsRow = {
  id: number;
  purpose: string;
  authority: string;
  documentType: string;
  reference: string;
  date: string;
  bank?: string;
  branch?: string;
  amount: string;
  claimed: string;
};

const INITIAL_ROWS: OtherTdsRow[] = [
  { id: 1, purpose: 'Acquisition of Property [Section-111]', authority: 'ref-auth', documentType: 'Certificate', reference: 'ref-3', date: '02-09-2026', amount: '5,000', claimed: '500' },
  { id: 2, purpose: 'Actor, Producer etc. [ Section-93]', authority: 'FDC', documentType: 'Challan', reference: '2526-0058719534', date: '24-06-2026', amount: '8,221', claimed: '8,221' },
  { id: 3, purpose: 'Advertising Bill [ Section-92]', authority: 'Advertise 1', documentType: 'Challan', reference: '2526-0027752927', date: '10-02-2026', amount: '33,16,209', claimed: '33,16,209' },
  { id: 4, purpose: 'Bangladesh Bank Bill [ Section-107]', authority: 'BBB', documentType: 'Challan', reference: '2526-0000884175', date: '14-07-2025', amount: '32,77,127', claimed: '32,77,127' },
  { id: 5, purpose: 'Brick Manufacturing [ Section-130]', authority: 'Brick', documentType: 'Certificate', reference: 'ref-4', date: '01-09-2026', amount: '1,000', claimed: '1,000' },
  { id: 6, purpose: 'Convention Hall Rent [ Section-110]', authority: 'auth -3', documentType: 'Challan', reference: '2526-0003447879', date: '07-08-2025', amount: '3,66,087', claimed: '3,66,087' },
  { id: 7, purpose: 'House Property [ Section-109]', authority: 'auth', documentType: 'Challan', reference: '2526-0000443755', date: '30-07-2025', amount: '900', claimed: '900' },
];

const EMPTY = {
  purpose: '',
  authority: '',
  documentType: 'Challan',
  reference: '',
  date: '',
  bank: '',
  branch: '',
  amount: '',
  claimed: '',
};

type FormState = typeof EMPTY;
type FormKey = keyof FormState;

const fields: Array<{ key: FormKey; en: string; bn: string; numeric?: boolean }> = [
  { key: 'purpose', en: 'Purpose of Payment', bn: 'পেমেন্টের উদ্দেশ্য' },
  { key: 'authority', en: 'Depositing Authority', bn: 'জমাদানকারী কর্তৃপক্ষ' },
  { key: 'documentType', en: 'Payment Document Type', bn: 'পেমেন্ট ডকুমেন্টের ধরন' },
  { key: 'reference', en: 'Challan/ Certificate Reference No.', bn: 'চালান/সার্টিফিকেট রেফারেন্স নং' },
  { key: 'date', en: 'Challan/ Certificate Date', bn: 'চালান/সার্টিফিকেট তারিখ' },
  { key: 'bank', en: 'Bank Name', bn: 'ব্যাংকের নাম' },
  { key: 'branch', en: 'Branch Name', bn: 'শাখার নাম' },
  { key: 'amount', en: 'Challan/ Certificate Amount', bn: 'চালান/সার্টিফিকেট পরিমাণ', numeric: true },
  { key: 'claimed', en: 'Claimed Amount', bn: 'দাবিকৃত পরিমাণ', numeric: true },
];

export const OtherTdsPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [rows, setRows] = usePersistentState<OtherTdsRow[]>('ereturn-ledger:v2:other-tds-rows', INITIAL_ROWS);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<OtherTdsRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const { updateCategoryAmount } = useLedgerRuntime();
  const editDialogRef = useDialogFocusTrap(Boolean(editing), () => setEditing(null));

  const totalClaimed = useMemo(
    () => rows.reduce((sum, row) => sum + parseMoney(row.claimed), 0),
    [rows]
  );

  useEffect(() => {
    updateCategoryAmount('other-tds', totalClaimed);
  }, [totalClaimed, updateCategoryAmount]);

  const amountValue = parseMoneyStrict(form.amount);
  const claimedValue = parseMoneyStrict(form.claimed);
  const existingBlankChallanBank =
    Boolean(editing) &&
    editing?.documentType === 'Challan' &&
    !hasText(editing.bank ?? '') &&
    !hasText(editing.branch ?? '') &&
    !hasText(form.bank) &&
    !hasText(form.branch);

  const bankBranchValid =
    form.documentType !== 'Challan' ||
    existingBlankChallanBank ||
    (hasText(form.bank) && hasText(form.branch));

  const formValid =
    hasText(form.purpose) &&
    hasText(form.authority) &&
    hasText(form.documentType) &&
    hasText(form.reference) &&
    isValidLedgerDate(form.date) &&
    bankBranchValid &&
    isValidMoneyInput(form.amount) &&
    isValidMoneyInput(form.claimed) &&
    amountValue !== null &&
    claimedValue !== null &&
    claimedValue <= amountValue;

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setAdding(true);
  };

  const cancelAdd = () => {
    setAdding(false);
    setForm(EMPTY);
  };

  const saveAdd = () => {
    if (!formValid) return;
    setRows((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((row) => row.id)) + 1,
        ...form,
      },
    ]);
    cancelAdd();
  };

  const openEdit = (row: OtherTdsRow) => {
    setAdding(false);
    setEditing(row);
    setForm({
      purpose: row.purpose,
      authority: row.authority,
      documentType: row.documentType,
      reference: row.reference,
      date: row.date,
      bank: row.bank ?? '',
      branch: row.branch ?? '',
      amount: row.amount,
      claimed: row.claimed,
    });
  };

  const saveEdit = () => {
    if (!editing || !formValid) return;
    setRows((current) => current.map((row) =>
      row.id === editing.id ? { ...row, ...form } : row
    ));
    setEditing(null);
    setForm(EMPTY);
  };

  const remove = (id: number) => {
    if (window.confirm(isBn ? 'এই রেকর্ডটি মুছে ফেলবেন?' : 'Delete this record?')) {
      setRows((current) => current.filter((row) => row.id !== id));
    }
  };

  const handleInlineKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') cancelAdd();
    if (event.key === 'Enter') {
      event.preventDefault();
      saveAdd();
    }
  };

  const purposeOptions = Array.from(new Set(INITIAL_ROWS.map((row) => row.purpose)));

  const labelFor = (key: FormKey) => {
    const field = fields.find((item) => item.key === key);
    return field ? (isBn ? field.bn : field.en) : key;
  };

  const renderEditor = (key: FormKey, compact = false) => {
    if (key === 'documentType') {
      return (
        <select
          value={form.documentType}
          onChange={(event) => setForm((current) => ({ ...current, documentType: event.target.value }))}
          onKeyDown={compact ? handleInlineKeyDown : undefined}
          className={compact
            ? 'w-full min-w-[140px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm'
            : 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5'}
        >
          <option value="Challan">Challan</option>
          <option value="Certificate">Certificate</option>
        </select>
      );
    }

    if (key === 'purpose') {
      return (
        <>
          <input
            list={compact ? 'other-tds-purpose-options' : 'other-tds-purpose-options-edit'}
            value={form.purpose}
            onChange={(event) => setForm((current) => ({ ...current, purpose: event.target.value }))}
            onKeyDown={compact ? handleInlineKeyDown : undefined}
            placeholder={isBn ? 'পেমেন্টের উদ্দেশ্য নির্বাচন/লিখুন' : 'Select or enter Purpose of Payment'}
            className={compact
              ? 'w-full min-w-[220px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm'
              : 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5'}
          />
          <datalist id={compact ? 'other-tds-purpose-options' : 'other-tds-purpose-options-edit'}>
            {purposeOptions.map((option) => <option key={option} value={option} />)}
          </datalist>
        </>
      );
    }

    const numeric = key === 'amount' || key === 'claimed';

    return (
      <input
        value={form[key]}
        onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
        onKeyDown={compact ? handleInlineKeyDown : undefined}
        inputMode={numeric ? 'decimal' : undefined}
        placeholder={
          key === 'date'
            ? 'DD-MM-YYYY'
            : labelFor(key)
        }
        className={compact
          ? `w-full min-w-[140px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm ${numeric ? 'text-right' : ''}`
          : `w-full rounded-lg border border-slate-300 px-3 py-2.5 ${numeric ? 'text-right' : ''}`}
      />
    );
  };

  return (
    <section className="w-full space-y-4" aria-labelledby="other-tds-title">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 id="other-tds-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
            {isBn ? 'অন্যান্য উৎস কর' : 'Other TDS Entry'}
          </h1>
        </div>
        <div className="flex flex-wrap items-end gap-5">
          <div className="text-right">
            <p className="text-xs text-[#5F6B7A]">{isBn ? 'মোট দাবিকৃত পরিমাণ' : 'Total Claimed Amount'}</p>
            <p className="mt-0.5 text-xl font-bold text-[#0B6FA4]">{formatLedgerNumber(totalClaimed)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#5F6B7A]">{isBn ? 'সংখ্যা' : 'Count'}</p>
            <p className="mt-0.5 text-xl font-bold text-[#172033]">{rows.length}</p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            disabled={adding}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A] disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {isBn ? 'যোগ করুন' : 'Add'}
          </button>
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="overflow-x-auto">
          <LedgerTable className="ledger-responsive-table w-full min-w-[1320px] text-sm">
            <LedgerTableHead>
              <tr>
                <th className="px-4 py-3 text-left font-semibold">SL.</th>
                {fields.map((field) => (
                  <th
                    key={field.key}
                    className={`px-4 py-3 font-semibold ${field.numeric ? 'text-right' : 'text-left'}`}
                  >
                    {isBn ? field.bn : field.en}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold">{isBn ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </LedgerTableHead>
            <LedgerTableBody>
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td data-label="SL." className="px-4 py-3 text-slate-500">{index + 1}</td>
                  {fields.map((field) => (
                    <td
                      key={field.key}
                      data-label={isBn ? field.bn : field.en}
                      className={`px-4 py-3 ${field.numeric ? 'text-right font-medium' : ''}`}
                    >
                      {String(row[field.key] ?? '—') || '—'}
                    </td>
                  ))}
                  <td data-label={isBn ? 'অ্যাকশন' : 'Action'} className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        aria-label={isBn ? 'সম্পাদনা' : 'Edit'}
                        className="rounded-md p-2 text-[#0B6FA4] hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(row.id)}
                        aria-label={isBn ? 'মুছুন' : 'Delete'}
                        className="rounded-md p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {adding && (
                <tr className="bg-[#F5FAFD] align-top">
                  <td data-label="SL." className="px-4 py-3 text-slate-500">{rows.length + 1}</td>
                  {fields.map((field, index) => (
                    <td key={field.key} data-label={isBn ? field.bn : field.en} className="px-2 py-2.5">
                      <div autoFocus={index === 0 ? undefined : undefined}>
                        {renderEditor(field.key, true)}
                      </div>
                    </td>
                  ))}
                  <td data-label={isBn ? 'অ্যাকশন' : 'Action'} className="px-3 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={saveAdd}
                        disabled={!formValid}
                        aria-label={isBn ? 'সংরক্ষণ' : 'Save'}
                        className="rounded-md bg-emerald-600 p-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelAdd}
                        aria-label={isBn ? 'বাতিল' : 'Cancel'}
                        className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </LedgerTableBody>
          </LedgerTable>
        </div>
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div
            ref={editDialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="other-tds-edit-title"
            className="flex max-h-[88vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 id="other-tds-edit-title" className="font-bold text-[#172033]">
                {isBn ? 'অন্যান্য উৎস কর সম্পাদনা' : 'Edit Other TDS'}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto p-5 md:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className="text-sm font-semibold text-[#172033]">
                  {isBn ? field.bn : field.en}
                  <div className="mt-1.5">{renderEditor(field.key)}</div>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={!formValid}
                className="rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                {isBn ? 'সংরক্ষণ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
