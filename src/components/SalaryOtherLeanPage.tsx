import React, { useEffect, useMemo, useState } from 'react';
import { Check, Edit2, Plus, Trash2, X } from 'lucide-react';
import { Language } from '../types';
import { LedgerTable, LedgerTableBody, LedgerTableFrame, LedgerTableHead, LedgerTableSummaryGroup, LedgerTableSummaryItem, LedgerTableToolbar, LedgerTableViewport } from './table/LedgerTable';
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap';
import { usePersistentState } from '../hooks/usePersistentState';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber, parseMoney } from '../utils/money';
import { hasText, isValidLedgerDate, isValidMoneyInput, parseMoneyStrict } from '../utils/validation';

type SalaryRow = {
  id: number;
  authority: string;
  documentType: string;
  reference: string;
  date: string;
  bank?: string;
  branch?: string;
  amount: string;
  claimed: string;
};

const normalizeSalaryRow = (row: Partial<SalaryRow>, index: number): SalaryRow => ({
  id: typeof row.id === 'number' && Number.isFinite(row.id) ? row.id : index + 1,
  authority: typeof row.authority === 'string' ? row.authority : '',
  documentType: typeof row.documentType === 'string' && row.documentType ? row.documentType : 'Challan',
  reference: typeof row.reference === 'string' ? row.reference : '',
  date: typeof row.date === 'string' ? row.date : '',
  bank: typeof row.bank === 'string' ? row.bank : '',
  branch: typeof row.branch === 'string' ? row.branch : '',
  amount: typeof row.amount === 'string' ? row.amount : '',
  claimed: typeof row.claimed === 'string' ? row.claimed : '',
});

const initialRows: SalaryRow[] = [
  { id: 1, authority: 'test', documentType: 'Certificate', reference: '123456', date: '04-09-2026', bank: '', branch: '', amount: '10,000', claimed: '1,000' },
  { id: 2, authority: 'test 2', documentType: 'Challan', reference: '2526-0003286477', date: '07-08-2025', bank: '', branch: '', amount: '32,73,823', claimed: '32,73,823' },
  { id: 3, authority: 'test 3', documentType: 'Challan', reference: '2526-0003264262', date: '06-08-2025', bank: '', branch: '', amount: '1,37,700', claimed: '1,37,700' },
  { id: 4, authority: 'test 4', documentType: 'Challan', reference: '2526-0003336839', date: '06-08-2025', bank: '', branch: '', amount: '3,529', claimed: '3,529' },
  { id: 5, authority: 'test 5', documentType: 'Certificate', reference: '11223344', date: '04-09-2026', bank: '', branch: '', amount: '2,20,022', claimed: '2,20,022' },
];

const emptyForm = {
  authority: '',
  documentType: 'Challan',
  reference: '',
  date: '',
  amount: '',
  claimed: '',
};

type FormState = typeof emptyForm;

type Column = {
  key: keyof FormState;
  label: string;
  numeric?: boolean;
};

const columns: Column[] = [
  { key: 'authority', label: 'Depositing Authority' },
  { key: 'documentType', label: 'Payment Document Type' },
  { key: 'reference', label: 'Challan/ Certificate Reference No.' },
  { key: 'date', label: 'Challan/ Certificate Date' },
  { key: 'amount', label: 'Challan/ Certificate Amount', numeric: true },
  { key: 'claimed', label: 'Claimed Amount', numeric: true },
];

export const SalaryOtherLeanPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isBn = lang === 'bn';
  const [rows, setRows] = usePersistentState<SalaryRow[]>('ereturn-ledger:v2:salary-other-rows', initialRows);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<SalaryRow | null>(null);
  const { updateCategoryAmount } = useLedgerRuntime();
  const editDialogRef = useDialogFocusTrap(Boolean(editing), () => setEditing(null));
  const labelText = (label: string) => {
    if (!isBn) return label;
    const labels: Record<string, string> = {
      'Depositing Authority': 'জমাদানকারী কর্তৃপক্ষ',
      'Payment Document Type': 'পেমেন্ট ডকুমেন্টের ধরন',
      'Challan/ Certificate Reference No.': 'চালান/সার্টিফিকেট রেফারেন্স নং',
      'Challan/ Certificate Date': 'চালান/সার্টিফিকেট তারিখ',
      'Challan/ Certificate Amount': 'চালান/সার্টিফিকেট পরিমাণ',
      'Claimed Amount': 'দাবিকৃত পরিমাণ',
      'Action': 'অ্যাকশন',
      'Edit': 'সম্পাদনা',
      'Save': 'সংরক্ষণ',
      'Cancel': 'বাতিল',
      'Delete': 'মুছুন',
      'Close': 'বন্ধ করুন',
    };
    return labels[label] || label;
  };

  const normalizedRows = useMemo(
    () => rows.map((row, index) => normalizeSalaryRow(row, index)),
    [rows]
  );

  const totalClaimed = useMemo(
    () => normalizedRows.reduce((sum, row) => sum + parseMoney(row.claimed), 0),
    [normalizedRows]
  );

  useEffect(() => {
    updateCategoryAmount('salary-other', totalClaimed);
  }, [totalClaimed, updateCategoryAmount]);

  const amountValue = parseMoneyStrict(form.amount);
  const claimedValue = parseMoneyStrict(form.claimed);
  const formValid =
    hasText(form.authority) &&
    hasText(form.documentType) &&
    hasText(form.reference) &&
    isValidLedgerDate(form.date) &&
    isValidMoneyInput(form.amount) &&
    isValidMoneyInput(form.claimed) &&
    amountValue !== null &&
    claimedValue !== null &&
    claimedValue <= amountValue;

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setAdding(true);
  };

  const cancelAdd = () => {
    setAdding(false);
    setForm(emptyForm);
  };

  const saveAdd = () => {
    if (!formValid) return;
    setRows((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((row, index) => normalizeSalaryRow(row, index).id)) + 1,
        ...form,
      },
    ]);
    cancelAdd();
  };

  const openEdit = (row: SalaryRow) => {
    setAdding(false);
    setEditing(row);
    setForm({
      authority: row.authority,
      documentType: row.documentType,
      reference: row.reference,
      date: row.date,
      amount: row.amount,
      claimed: row.claimed,
    });
  };

  const saveEdit = () => {
    if (!editing || !formValid) return;
    setRows((current) => current.map((row) => (row.id === editing.id ? { ...row, ...form } : row)));
    setEditing(null);
    setForm(emptyForm);
  };

  const removeRow = (id: number) => {
    const confirmed = window.confirm(isBn ? 'এই রেকর্ডটি মুছে ফেলবেন?' : 'Delete this record?');
    if (confirmed) setRows((current) => current.filter((row) => row.id !== id));
  };

  const handleRowKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') cancelAdd();
    if (event.key === 'Enter') {
      event.preventDefault();
      saveAdd();
    }
  };

  return (
    <section className="ledger-page w-full" aria-labelledby="salary-other-title">
      <header className="min-w-0">
        <h1 id="salary-other-title" className="text-2xl font-bold tracking-tight text-[#172033] lg:text-[28px]">
          {isBn ? 'বেতন (অন্যান্য)' : 'Salary (Others)'}
        </h1>
        <p className="mt-1 text-sm italic leading-relaxed text-[#0B6FA4]">
          {isBn ? 'বেতন [ ধারা-৮৬]' : 'Salary [ Section-86]'}
        </p>
      </header>

      <LedgerTableFrame>
        <LedgerTableToolbar>
          <LedgerTableSummaryGroup>
            <LedgerTableSummaryItem label={isBn ? 'মোট দাবিকৃত পরিমাণ' : 'Total Claimed Amount'} value={formatLedgerNumber(totalClaimed)} accent />
            <div className="h-9 w-px bg-[#E2E8F0]" aria-hidden="true" />
            <LedgerTableSummaryItem label={isBn ? 'রেকর্ড' : 'Records'} value={normalizedRows.length} />
          </LedgerTableSummaryGroup>

          <button
            type="button"
            onClick={openAdd}
            disabled={adding}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#0B6FA4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0B6FA4] transition-colors hover:bg-[#F2F8FC] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 sm:w-auto"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isBn ? 'নতুন যোগ করুন' : 'Add new'}
          </button>
        </LedgerTableToolbar>

        <LedgerTableViewport>
          <LedgerTable className="ledger-responsive-table w-full min-w-[820px] text-sm">
            <LedgerTableHead>
              <tr>
                <th scope="col" className="w-14 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.02em]">SL.</th>
                {columns.map((column) => (
                    <th
                      scope="col"
                      key={column.key}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.02em] ${column.numeric ? 'text-right' : 'text-left'}`}
                    >
                      {labelText(column.label)}
                    </th>
                  ))}
                <th scope="col" className="w-24 px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.02em]">{labelText('Action')}</th>
              </tr>
            </LedgerTableHead>
            <LedgerTableBody>
              {normalizedRows.map((row, index) => (
                <tr key={row.id} className="transition-colors hover:bg-[#F8FBFD]">
                  <td data-label="SL." className="px-4 py-3 text-slate-500">{index + 1}</td>
                  <td data-label={labelText("Depositing Authority")} className="px-4 py-3">{row.authority}</td>
                  <td data-label={labelText("Payment Document Type")} className="px-4 py-3">{row.documentType}</td>
                  <td data-label={labelText("Challan/ Certificate Reference No.")} className="px-4 py-3">{row.reference}</td>
                  <td data-label={labelText("Challan/ Certificate Date")} className="whitespace-nowrap px-4 py-3">{row.date}</td>
                  <td data-label={labelText("Challan/ Certificate Amount")} className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums">{row.amount}</td>
                  <td data-label={labelText("Claimed Amount")} className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-[#172033]">{row.claimed}</td>
                  <td data-label={labelText("Action")} className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        aria-label={labelText("Edit")}
                        title={labelText("Edit")}
                        className="rounded-md p-2 text-[#0B6FA4] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        aria-label={labelText("Delete")}
                        title={labelText("Delete")}
                        className="rounded-md p-2 text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {adding && (
                <tr className="bg-[#F5FAFD] align-top">
                  <td data-label="SL." className="px-4 py-3 text-slate-500">{normalizedRows.length + 1}</td>
                  <td data-label={labelText("Depositing Authority")} className="px-2 py-2.5">
                    <input
                      autoFocus
                      value={form.authority}
                      onChange={(event) => setForm((current) => ({ ...current, authority: event.target.value }))}
                      onKeyDown={handleRowKeyDown}
                      placeholder={isBn ? "জমাদানকারী কর্তৃপক্ষ লিখুন" : "Enter Depositing Authority"}
                      className="w-full min-w-[160px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm"
                    />
                  </td>
                  <td data-label={labelText("Payment Document Type")} className="px-2 py-2.5">
                    <select
                      value={form.documentType}
                      onChange={(event) => setForm((current) => ({ ...current, documentType: event.target.value }))}
                      onKeyDown={handleRowKeyDown}
                      className="w-full min-w-[145px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm"
                    >
                      <option value="Challan">Challan</option>
                      <option value="Certificate">Certificate</option>
                    </select>
                  </td>
                  <td data-label={labelText("Challan/ Certificate Reference No.")} className="px-2 py-2.5">
                    <input value={form.reference} onChange={(event) => setForm((current) => ({ ...current, reference: event.target.value }))} onKeyDown={handleRowKeyDown} placeholder={isBn ? "চালান/সার্টিফিকেট রেফারেন্স লিখুন" : "Enter Challan/Certificate Reference"} className="w-full min-w-[180px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm" />
                  </td>
                  <td data-label={labelText("Challan/ Certificate Date")} className="px-2 py-2.5">
                    <input value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} onKeyDown={handleRowKeyDown} placeholder={isBn ? "তারিখ লিখুন" : "Enter Date"} className="w-full min-w-[135px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm" />
                  </td>
                  <td data-label={labelText("Challan/ Certificate Amount")} className="px-2 py-2.5">
                    <input value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} onKeyDown={handleRowKeyDown} inputMode="decimal" placeholder={isBn ? "পরিমাণ লিখুন" : "Enter Amount"} className="w-full min-w-[125px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-right text-sm" />
                  </td>
                  <td data-label={labelText("Claimed Amount")} className="px-2 py-2.5">
                    <input value={form.claimed} onChange={(event) => setForm((current) => ({ ...current, claimed: event.target.value }))} onKeyDown={handleRowKeyDown} inputMode="decimal" placeholder={isBn ? "দাবিকৃত পরিমাণ লিখুন" : "Enter Claimed Amount"} className="w-full min-w-[140px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-right text-sm" />
                  </td>
                  <td data-label={labelText("Action")} className="px-3 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={saveAdd} disabled={!formValid} aria-label={labelText("Save")} title={labelText("Save")} className="rounded-md bg-emerald-600 p-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">
                        <Check className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={cancelAdd} aria-label={labelText("Cancel")} title={labelText("Cancel")} className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
          <div ref={editDialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="salary-edit-title" className="flex max-h-[88vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 id="salary-edit-title" className="font-bold text-[#172033]">{labelText('Edit')}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label={labelText("Close")} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto p-5 md:grid-cols-2">
              {columns.map((column) => (
                <div key={column.key}>
                  <label className="mb-1.5 block text-sm font-semibold text-[#172033]">{labelText(column.label)}</label>
                  {column.key === 'documentType' ? (
                    <select
                      value={form.documentType}
                      onChange={(event) => setForm((current) => ({ ...current, documentType: event.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                    >
                      <option value="Challan">Challan</option>
                      <option value="Certificate">Certificate</option>
                    </select>
                  ) : (
                    <input
                      value={form[column.key]}
                      onChange={(event) => setForm((current) => ({ ...current, [column.key]: event.target.value }))}
                      inputMode={column.numeric ? 'decimal' : undefined}
                      className={`w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20 ${column.numeric ? 'text-right' : ''}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">{labelText('Cancel')}</button>
              <button type="button" onClick={saveEdit} disabled={!formValid} className="rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{labelText('Save')}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
