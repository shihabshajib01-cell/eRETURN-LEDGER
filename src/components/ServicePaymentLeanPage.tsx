import React, { useEffect, useMemo, useState } from 'react';
import { Check, Edit2, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import { Language } from '../types';
import { LedgerTable, LedgerTableBody, LedgerTableFrame, LedgerTableHead, LedgerTableToolbar, LedgerTableViewport } from './table/LedgerTable';
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap';
import { usePersistentState } from '../hooks/usePersistentState';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { parseMoney } from '../utils/money';
import { hasText, isValidLedgerDate, isValidMoneyInput, parseMoneyStrict } from '../utils/validation';
import { fetchIncomeSyncRecords } from '../services/eReturnIncomeSync';

type ServiceRow = {
  id: number;
  authority: string;
  documentType: string;
  reference: string;
  date: string;
  bank: string;
  branch: string;
  amount: string;
  claimed: string;
};

const INITIAL_ROWS: ServiceRow[] = [
  { id: 1, authority: 'Plumber corp', documentType: 'Challan', reference: '2526-0002912865', date: '30-07-2025', bank: '', branch: '', amount: '70,000', claimed: '5,000' },
  { id: 2, authority: 'Doctor', documentType: 'Challan', reference: '2526-0002968652', date: '30-07-2025', bank: '', branch: '', amount: '10,000', claimed: '5,000' },
  { id: 3, authority: 'Lawyer', documentType: 'Challan', reference: '2526-0003205455', date: '03-08-2025', bank: '', branch: '', amount: '16,778', claimed: '10,000' },
  { id: 4, authority: 'Engineer', documentType: 'Challan', reference: '2526-0003734605', date: '07-08-2025', bank: '', branch: '', amount: '26,05,887', claimed: '5,000' },
  { id: 5, authority: 'Astronaut', documentType: 'Challan', reference: '2526-0003810112', date: '11-08-2025', bank: '', branch: '', amount: '75,77,604', claimed: '3,000' },
  { id: 6, authority: 'Mail Man', documentType: 'Certificate', reference: 'ref-1', date: '30-09-2026', bank: '', branch: '', amount: '10,000', claimed: '10,000' },
];

type FormState = Omit<ServiceRow, 'id'>;
const EMPTY: FormState = { authority: '', documentType: 'Challan', reference: '', date: '', bank: '', branch: '', amount: '', claimed: '' };

const columns = [
  ['authority', 'Depositing Authority'],
  ['documentType', 'Payment Document Type'],
  ['reference', 'Challan/ Certificate Reference No.'],
  ['date', 'Challan/ Certificate Date'],
  ['bank', 'Bank Name'],
  ['branch', 'Branch Name'],
  ['amount', 'Challan/ Certificate Amount'],
  ['claimed', 'Claimed Amount'],
] as const;

export const ServicePaymentLeanPage: React.FC<{
  lang: Language;
  onUnavailableAction: (message: string) => void;
}> = ({ lang, onUnavailableAction }) => {
  const isBn = lang === 'bn';
  const [rows, setRows] = usePersistentState<ServiceRow[]>('ereturn-ledger:v2:service-payment-rows', INITIAL_ROWS);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [syncOpen, setSyncOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [draftRows, setDraftRows] = useState<ServiceRow[]>(INITIAL_ROWS);
  const [syncLoading, setSyncLoading] = useState(false);
  const { updateCategoryAmount } = useLedgerRuntime();
  const syncDialogRef = useDialogFocusTrap(syncOpen, () => setSyncOpen(false));
  const editDialogRef = useDialogFocusTrap(Boolean(editing), () => setEditing(null));
  const labelText = (label: string) => {
    if (!isBn) return label;
    const labels: Record<string, string> = {
      'Service Payment': 'সেবা পেমেন্ট',
      'Depositing Authority': 'জমাদানকারী কর্তৃপক্ষ',
      'Payment Document Type': 'পেমেন্ট ডকুমেন্টের ধরন',
      'Challan/ Certificate Reference No.': 'চালান/সার্টিফিকেট রেফারেন্স নং',
      'Challan/ Certificate Date': 'চালান/সার্টিফিকেট তারিখ',
      'Bank Name': 'ব্যাংকের নাম',
      'Branch Name': 'শাখার নাম',
      'Challan/ Certificate Amount': 'চালান/সার্টিফিকেট পরিমাণ',
      'Claimed Amount': 'দাবিকৃত পরিমাণ',
      'Action': 'অ্যাকশন',
      'Add': 'যোগ করুন',
      'Sync From Income': 'Income থেকে সিঙ্ক',
      'Save': 'সংরক্ষণ',
      'Close': 'বন্ধ করুন',
      'Edit': 'সম্পাদনা',
      'Delete': 'মুছুন',
      'Select all': 'সব নির্বাচন করুন',
      'Cancel': 'বাতিল',
    };
    return labels[label] || label;
  };
  const totalClaimed = useMemo(() => rows.reduce((sum, row) => sum + parseMoney(row.claimed), 0), [rows]);

  useEffect(() => {
    updateCategoryAmount('service-payment', totalClaimed);
  }, [totalClaimed, updateCategoryAmount]);

  const amountValue = parseMoneyStrict(form.amount);
  const claimedValue = parseMoneyStrict(form.claimed);
  const formValid =
    hasText(form.authority) &&
    hasText(form.documentType) &&
    hasText(form.reference) &&
    isValidLedgerDate(form.date) &&
    (form.documentType !== 'Challan' || editing !== null || (hasText(form.bank) && hasText(form.branch))) &&
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

  const saveAdd = () => {
    if (!formValid) return;
    setRows((current) => [
      ...current,
      { id: Math.max(0, ...current.map((row) => row.id)) + 1, ...form },
    ]);
    setForm(EMPTY);
    setAdding(false);
  };

  const openEdit = (row: ServiceRow) => {
    setAdding(false);
    setEditing(row);
    setForm({
      authority: row.authority,
      documentType: row.documentType,
      reference: row.reference,
      date: row.date,
      bank: row.bank || '',
      branch: row.branch || '',
      amount: row.amount,
      claimed: row.claimed,
    });
  };

  const saveEdit = () => {
    if (!editing || !formValid) return;
    setRows((current) => current.map((row) => (row.id === editing.id ? { ...row, ...form } : row)));
    setEditing(null);
    setForm(EMPTY);
  };

  const removeRow = (id: number) => {
    if (window.confirm(isBn ? 'এই রেকর্ডটি মুছে ফেলবেন?' : 'Delete this record?')) {
      setRows((current) => current.filter((row) => row.id !== id));
    }
  };

  const openSync = async () => {
    setSyncLoading(true);
    try {
      const sourceRows = await fetchIncomeSyncRecords<ServiceRow>('service-payment', INITIAL_ROWS);
      setDraftRows(sourceRows);
      setSelectedIds(sourceRows.map((row) => row.id));
      setSyncOpen(true);
      if (sourceRows.length === 0) {
        onUnavailableAction(
          isBn
            ? 'Income-এ সংশ্লিষ্ট Service Payment তথ্য নেই, তাই সিঙ্ক করার মতো কোনো রেকর্ড পাওয়া যায়নি।'
            : 'No Service Payment records are available to sync because the related Income data is not available.'
        );
      }
    } catch {
      onUnavailableAction(isBn ? 'Income থেকে Service Payment তথ্য আনা যায়নি। পরে আবার চেষ্টা করুন।' : 'Service Payment Income data could not be loaded. Please try again.');
    } finally {
      setSyncLoading(false);
    }
  };

  const closeSync = () => {
    setSyncOpen(false);
    setSelectedIds([]);
  };

  const updateDraft = (id: number, key: keyof FormState, value: string) => {
    setDraftRows((current) => current.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const saveSync = () => {
    const selectedRows = draftRows.filter((row) => selectedIds.includes(row.id));
    const invalid = selectedRows.some((row) => {
      const amount = parseMoneyStrict(row.amount);
      const claimed = parseMoneyStrict(row.claimed);
      return (
        !hasText(row.authority) ||
        !hasText(row.reference) ||
        !isValidLedgerDate(row.date) ||
        !isValidMoneyInput(row.amount) ||
        !isValidMoneyInput(row.claimed) ||
        amount === null ||
        claimed === null ||
        claimed > amount ||
        (row.documentType === 'Challan' && (!hasText(row.bank) || !hasText(row.branch)))
      );
    });
    if (invalid) {
      onUnavailableAction(
        isBn
          ? 'নির্বাচিত Challan রেকর্ডে ব্যাংক/শাখা এবং বৈধ পরিমাণ পূরণ করুন।'
          : 'Complete bank/branch and valid amounts for the selected Challan records.'
      );
      return;
    }
    setRows((current) => {
      const byId = new Map(current.map((row) => [row.id, row]));
      selectedRows.forEach((row) => byId.set(row.id, row));
      return Array.from(byId.values()).sort((a, b) => a.id - b.id);
    });
    closeSync();
    onUnavailableAction(isBn ? 'নির্বাচিত Service Payment রেকর্ড সংরক্ষিত হয়েছে।' : 'Selected Service Payment records saved.');
  };

  return (
    <section className="ledger-page w-full" aria-labelledby="service-payment-title">
      <header className="min-w-0">
        <h1 id="service-payment-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
          {labelText('Service Payment')}
        </h1>
        <p className="mt-1 text-sm italic text-[#0B6FA4]">
          {isBn ? 'Meeting Fees, Honorarium, Professional Service, Consultancy etc. [ধারা-৯০]' : 'Meeting Fees, Honorarium, Professional Service, Consultancy etc. [Section-90]'}
        </p>
      </header>

      <LedgerTableFrame>
        <LedgerTableToolbar>
          <div />
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => void openSync()}
              disabled={syncLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0B6FA4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0B6FA4] hover:bg-[#F2F8FC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              {syncLoading ? (isBn ? 'সিঙ্ক হচ্ছে...' : 'Syncing...') : labelText('Sync From Income')}
            </button>
            <button
              type="button"
              onClick={openAdd}
              disabled={adding}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0B6FA4] bg-white px-3.5 py-2 text-sm font-semibold text-[#0B6FA4] hover:bg-[#F2F8FC] disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {labelText('Add')}
            </button>
          </div>
        </LedgerTableToolbar>
        <LedgerTableViewport>
          <LedgerTable className="ledger-responsive-table w-full min-w-[1080px] text-sm">
            <LedgerTableHead>
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-semibold">SL.</th>
                {columns.map(([key, label]) => (
                  <th key={key} scope="col" className={`px-4 py-3 font-semibold ${['amount','claimed'].includes(key) ? 'text-right' : 'text-left'}`}>
                    {labelText(label)}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right font-semibold">{labelText('Action')}</th>
              </tr>
            </LedgerTableHead>
            <LedgerTableBody>
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td data-label="SL." className="px-4 py-3 text-slate-500">{index + 1}</td>
                  <td data-label={labelText("Depositing Authority")} className="px-4 py-3">{row.authority}</td>
                  <td data-label={labelText("Payment Document Type")} className="px-4 py-3">{row.documentType}</td>
                  <td data-label={labelText("Challan/ Certificate Reference No.")} className="px-4 py-3">{row.reference}</td>
                  <td data-label={labelText("Challan/ Certificate Date")} className="px-4 py-3">{row.date}</td>
                  <td data-label={labelText("Bank Name")} className="px-4 py-3">{row.bank || "—"}</td>
                  <td data-label={labelText("Branch Name")} className="px-4 py-3">{row.branch || "—"}</td>
                  <td data-label={labelText("Challan/ Certificate Amount")} className="px-4 py-3 text-right font-medium">{row.amount}</td>
                  <td data-label={labelText("Claimed Amount")} className="px-4 py-3 text-right font-medium">{row.claimed}</td>
                  <td data-label={labelText("Action")} className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => openEdit(row)} aria-label={labelText("Edit")} className="rounded-md p-2 text-[#149DB2] hover:bg-cyan-50">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => removeRow(row.id)} aria-label={labelText("Delete")} className="rounded-md p-2 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {adding && (
                <tr className="bg-[#F5FAFD] align-top">
                  <td data-label="SL." className="px-4 py-3 text-slate-500">{rows.length + 1}</td>
                  {columns.map(([key, label], index) => (
                    <td key={key} data-label={labelText(label)} className="px-2 py-2.5">
                      {key === 'documentType' ? (
                        <select
                          autoFocus={index === 0}
                          value={form.documentType}
                          onChange={(event) => setForm((current) => ({ ...current, documentType: event.target.value }))}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') { setAdding(false); setForm(EMPTY); }
                            if (event.key === 'Enter') { event.preventDefault(); saveAdd(); }
                          }}
                          className="w-full min-w-[150px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm"
                        >
                          <option value="">Select One</option>
                          <option value="Challan">Challan</option>
                          <option value="Certificate">Certificate</option>
                        </select>
                      ) : (
                        <input
                          autoFocus={index === 0}
                          value={form[key]}
                          onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') { setAdding(false); setForm(EMPTY); }
                            if (event.key === 'Enter') { event.preventDefault(); saveAdd(); }
                          }}
                          aria-label={labelText(label)}
                          placeholder={key === 'authority' ? 'Enter Depositing Authority' : key === 'reference' ? 'Enter Reference No' : key === 'date' ? 'Enter Date' : key === 'amount' ? 'Enter Amount' : key === 'claimed' ? 'Enter Claimed Amount' : label}
                          className={`w-full min-w-[140px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm ${['amount','claimed'].includes(key) ? 'text-right' : ''}`}
                        />
                      )}
                    </td>
                  ))}
                  <td data-label={labelText("Action")} className="px-3 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={saveAdd} disabled={!formValid} aria-label={labelText("Save")} className="rounded-md bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 p-2 text-white hover:bg-emerald-700"><Check className="h-4 w-4" /></button>
                      <button type="button" onClick={() => { setAdding(false); setForm(EMPTY); }} aria-label={labelText("Cancel")} className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              )}
            </LedgerTableBody>
          </LedgerTable>
        </div>
      </section>

      {syncOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div ref={syncDialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="service-sync-title" className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <h2 id="service-sync-title" className="font-bold text-[#172033]">{labelText("Service Payment")}</h2>
              <button type="button" onClick={closeSync} aria-label={labelText("Close")} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="overflow-auto p-4">
              <LedgerTable className="ledger-responsive-table w-full min-w-[1180px] text-sm">
                <LedgerTableHead>
                  <tr>
                    <th className="px-3 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === draftRows.length}
                        onChange={(event) => setSelectedIds(event.target.checked ? draftRows.map((row) => row.id) : [])}
                        aria-label={labelText("Select all")}
                        className="h-4 w-4 rounded border-slate-300 text-[#0B6FA4]"
                      />
                    </th>
                    <th className="px-3 py-3 text-left font-semibold">{labelText('Depositing Authority')}</th>
                    <th className="px-3 py-3 text-left font-semibold">{labelText('Payment Document Type')}</th>
                    <th className="px-3 py-3 text-left font-semibold">{labelText('Challan/ Certificate Reference No.')}</th>
                    <th className="px-3 py-3 text-left font-semibold">{labelText('Challan/ Certificate Date')}</th>
                    <th className="px-3 py-3 text-left font-semibold">{labelText('Bank Name')}</th>
                    <th className="px-3 py-3 text-left font-semibold">{labelText('Branch Name')}</th>
                    <th className="px-3 py-3 text-right font-semibold">{labelText('Challan/ Certificate Amount')}</th>
                    <th className="px-3 py-3 text-right font-semibold">{labelText('Claimed Amount')}</th>
                  </tr>
                </LedgerTableHead>
                <LedgerTableBody>
                  {draftRows.map((row) => {
                    const selected = selectedIds.includes(row.id);
                    return (
                      <tr key={row.id}>
                        <td data-label={isBn ? "নির্বাচন" : "Select"} className="px-3 py-2.5">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => setSelectedIds((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id])}
                            aria-label={`${isBn ? "নির্বাচন করুন" : "Select"} ${row.authority}`}
                            className="h-4 w-4 rounded border-slate-300 text-[#0B6FA4]"
                          />
                        </td>
                        <td data-label={labelText("Depositing Authority")} className="px-3 py-2.5 font-medium">{row.authority}</td>
                        <td data-label={labelText("Payment Document Type")} className="px-3 py-2.5">
                          <select
                            value={row.documentType}
                            disabled={!selected}
                            onChange={(event) => updateDraft(row.id, 'documentType', event.target.value)}
                            className="w-full min-w-[135px] rounded-md border border-[#C8D4E1] bg-white px-2.5 py-2 disabled:bg-slate-100"
                          >
                            <option value="Challan">Challan</option>
                            <option value="Certificate">Certificate</option>
                          </select>
                        </td>
                        <td data-label={labelText("Challan/ Certificate Reference No.")} className="px-3 py-2.5">
                          <input value={row.reference} disabled={!selected} onChange={(event) => updateDraft(row.id, 'reference', event.target.value)} className="w-full min-w-[150px] rounded-md border border-[#C8D4E1] px-2.5 py-2 disabled:bg-slate-100" />
                        </td>
                        <td data-label={labelText("Challan/ Certificate Date")} className="px-3 py-2.5">
                          <input value={row.date} disabled={!selected} onChange={(event) => updateDraft(row.id, 'date', event.target.value)} className="w-full min-w-[130px] rounded-md border border-[#C8D4E1] px-2.5 py-2 disabled:bg-slate-100" />
                        </td>
                        <td data-label={labelText("Bank Name")} className="px-3 py-2.5">
                          <input value={row.bank} disabled={!selected} onChange={(event) => updateDraft(row.id, 'bank', event.target.value)} placeholder={labelText('Bank Name')} className="w-full min-w-[150px] rounded-md border border-[#C8D4E1] px-2.5 py-2 disabled:bg-slate-100" />
                        </td>
                        <td data-label={labelText("Branch Name")} className="px-3 py-2.5">
                          <input value={row.branch} disabled={!selected} onChange={(event) => updateDraft(row.id, 'branch', event.target.value)} placeholder={labelText('Branch Name')} className="w-full min-w-[150px] rounded-md border border-[#C8D4E1] px-2.5 py-2 disabled:bg-slate-100" />
                        </td>
                        <td data-label={labelText("Challan/ Certificate Amount")} className="px-3 py-2.5">
                          <input value={row.amount} disabled={!selected} onChange={(event) => updateDraft(row.id, 'amount', event.target.value)} className="w-full min-w-[125px] rounded-md border border-[#C8D4E1] px-2.5 py-2 text-right disabled:bg-slate-100" />
                        </td>
                        <td data-label={labelText("Claimed Amount")} className="px-3 py-2.5 text-right font-medium">{row.claimed}</td>
                      </tr>
                    );
                  })}
                </LedgerTableBody>
              </LedgerTable>
            </div>
            <div className="flex justify-end gap-2 border-t border-[#E2E8F0] px-5 py-4">
              <button type="button" onClick={closeSync} className="rounded-lg border border-[#C8D4E1] bg-white px-4 py-2 text-sm font-semibold text-[#263247] hover:bg-slate-50">{labelText('Close')}</button>
              <button type="button" onClick={saveSync} disabled={selectedIds.length === 0} className="rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{labelText('Save')}</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div ref={editDialogRef} tabIndex={-1} role="dialog" aria-modal="true" className="flex max-h-[88vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-bold text-[#172033]">{labelText('Service Payment')}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label={labelText("Close")} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto p-5 md:grid-cols-2">
              {columns.map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1.5 block text-sm font-semibold text-[#172033]">{labelText(label)}</label>
                  <input
                    value={form[key]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    className={`w-full rounded-lg border border-slate-300 px-3 py-2.5 ${['amount','claimed'].includes(key) ? 'text-right' : ''}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">{labelText("Close")}</button>
              <button type="button" onClick={saveEdit} disabled={!formValid} className="rounded-lg bg-[#0B6FA4] disabled:cursor-not-allowed disabled:opacity-40 px-4 py-2 text-sm font-semibold text-white">{labelText("Save")}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
