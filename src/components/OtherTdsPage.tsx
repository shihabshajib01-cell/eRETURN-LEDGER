import React, { useEffect, useMemo, useState } from 'react';
import { Check, Edit2, Plus, Trash2, X } from 'lucide-react';
import { Language } from '../types';
import { LedgerTable, LedgerTableBody, LedgerTableFrame, LedgerTableHead, LedgerTableSummaryGroup, LedgerTableSummaryItem, LedgerTableToolbar, LedgerTableViewport } from './table/LedgerTable';
import { usePersistentState } from '../hooks/usePersistentState';
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

  const purposeOptions = Array.from(new Set(INITIAL_ROWS.map((row) => row.purpose)));

  const labelFor = (key: FormKey) => {
    const field = fields.find((item) => item.key === key);
    return field ? (isBn ? field.bn : field.en) : key;
  };

  const renderEditor = (key: FormKey, mode?: 'add' | 'edit') => {
    const compact = Boolean(mode);
    if (key === 'documentType') {
      return (
        <select
          value={form.documentType}
          onChange={(event) => setForm((current) => ({ ...current, documentType: event.target.value }))}
          onKeyDown={mode ? (event) => handleInlineKeyDown(event, mode) : undefined}
          className={compact
            ? 'ledger-inline-control w-full min-w-[140px] bg-white text-sm'
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
            onKeyDown={mode ? (event) => handleInlineKeyDown(event, mode) : undefined}
            placeholder={isBn ? 'পেমেন্টের উদ্দেশ্য নির্বাচন/লিখুন' : 'Select or enter Purpose of Payment'}
            className={compact
              ? 'ledger-inline-control w-full min-w-[220px] bg-white text-sm'
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
        onKeyDown={mode ? (event) => handleInlineKeyDown(event, mode) : undefined}
        inputMode={numeric ? 'decimal' : undefined}
        placeholder={
          key === 'date'
            ? 'DD-MM-YYYY'
            : labelFor(key)
        }
        className={compact
          ? `ledger-inline-control w-full min-w-[140px] bg-white text-sm ${numeric ? 'text-right' : ''}`
          : `w-full rounded-lg border border-slate-300 px-3 py-2.5 ${numeric ? 'text-right' : ''}`}
      />
    );
  };

  return (
    <section className="ledger-page w-full" aria-labelledby="other-tds-title">
      <header className="min-w-0">
        <h1 id="other-tds-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
          {isBn ? 'অন্যান্য উৎস কর' : 'Other TDS Entry'}
        </h1>
      </header>

      <LedgerTableFrame>
        <LedgerTableToolbar>
          <LedgerTableSummaryGroup>
            <LedgerTableSummaryItem label={isBn ? 'মোট দাবিকৃত পরিমাণ' : 'Total Claimed Amount'} value={formatLedgerNumber(totalClaimed)} accent />
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
              {rows.map((row, index) => {
                const isEditingRow = editing?.id === row.id;

                if (isEditingRow) {
                  return (
                    <tr key={row.id} className="ledger-table-editor-row align-top">
                      <td data-label="SL." className="text-slate-500">{index + 1}</td>
                      {fields.map((field) => (
                        <td key={field.key} data-label={isBn ? field.bn : field.en}>
                          {renderEditor(field.key, 'edit')}
                        </td>
                      ))}
                      <td data-label={isBn ? 'অ্যাকশন' : 'Action'}>
                        <div className="flex justify-end gap-1.5">
                          <button type="button" onClick={saveEdit} disabled={!formValid} aria-label={isBn ? 'সংরক্ষণ' : 'Save'} className="ledger-inline-action ledger-inline-save"><Check className="h-4 w-4" /></button>
                          <button type="button" onClick={cancelEdit} aria-label={isBn ? 'বাতিল' : 'Cancel'} className="ledger-inline-action ledger-inline-cancel"><X className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={row.id}>
                    <td data-label="SL." className="text-slate-500">{index + 1}</td>
                    {fields.map((field) => (
                      <td
                        key={field.key}
                        data-label={isBn ? field.bn : field.en}
                        className={field.numeric ? 'text-right font-medium tabular-nums' : ''}
                      >
                        {String(row[field.key] ?? '—') || '—'}
                      </td>
                    ))}
                    <td data-label={isBn ? 'অ্যাকশন' : 'Action'}>
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => openEdit(row)} aria-label={isBn ? 'সম্পাদনা' : 'Edit'} className="ledger-row-action text-[#0B6FA4]"><Edit2 className="h-4 w-4" /></button>
                        <button type="button" onClick={() => remove(row.id)} aria-label={isBn ? 'মুছুন' : 'Delete'} className="ledger-row-action text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {adding && (
                <tr className="ledger-table-editor-row align-top">
                  <td data-label="SL." className="text-slate-500">{rows.length + 1}</td>
                  {fields.map((field) => (
                    <td key={field.key} data-label={isBn ? field.bn : field.en}>
                      {renderEditor(field.key, 'add')}
                    </td>
                  ))}
                  <td data-label={isBn ? 'অ্যাকশন' : 'Action'}>
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={saveAdd} disabled={!formValid} aria-label={isBn ? 'সংরক্ষণ' : 'Save'} className="ledger-inline-action ledger-inline-save"><Check className="h-4 w-4" /></button>
                      <button type="button" onClick={cancelAdd} aria-label={isBn ? 'বাতিল' : 'Cancel'} className="ledger-inline-action ledger-inline-cancel ledger-inline-cancel-danger"><Trash2 className="h-4 w-4" /></button>
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
