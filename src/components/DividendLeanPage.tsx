import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Trash2, X } from 'lucide-react';
import { Language } from '../types';
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap';
import { usePersistentState } from '../hooks/usePersistentState';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { parseMoney } from '../utils/money';
import { hasText, isValidLedgerDate, isValidMoneyInput, parseMoneyStrict } from '../utils/validation';
import { fetchIncomeSyncRecords } from '../services/eReturnIncomeSync';

type DividendRow = {
  id: number;
  authority: string;
  reference: string;
  date: string;
  amount: string;
  claimed: string;
};

const INITIAL_ROWS: DividendRow[] = [
  { id: 1, authority: 'Synesis IT PLC', reference: 'test-1', date: '01-09-2026', amount: '50,000', claimed: '50,000' },
  { id: 2, authority: 'Synesis IT PLC', reference: 'test-2', date: '04-09-2026', amount: '60,000', claimed: '60,000' },
  { id: 3, authority: 'Sinosis LPG', reference: 'test-3', date: '04-09-2026', amount: '22,022', claimed: '22,022' },
  { id: 4, authority: 'Syncronis', reference: 'test-4', date: '06-09-2026', amount: '44,003', claimed: '44,003' },
  { id: 5, authority: 'Syncromium', reference: 'test-5', date: '04-09-2026', amount: '34,302', claimed: '34,302' },
];

export const DividendLeanPage: React.FC<{
  lang: Language;
  onUnavailableAction: (message: string) => void;
}> = ({ lang, onUnavailableAction }) => {
  const isBn = lang === 'bn';
  const [rows, setRows] = usePersistentState<DividendRow[]>('ereturn-ledger:v2:dividend-rows', INITIAL_ROWS);
  const [syncOpen, setSyncOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [draftRows, setDraftRows] = useState<DividendRow[]>(INITIAL_ROWS);
  const [syncLoading, setSyncLoading] = useState(false);
  const { updateCategoryAmount } = useLedgerRuntime();
  const syncDialogRef = useDialogFocusTrap(syncOpen, () => setSyncOpen(false));
  const totalClaimed = useMemo(() => rows.reduce((sum, row) => sum + parseMoney(row.claimed), 0), [rows]);

  useEffect(() => {
    updateCategoryAmount('dividend', totalClaimed);
  }, [totalClaimed, updateCategoryAmount]);

  const openSync = async () => {
    setSyncLoading(true);
    try {
      const sourceRows = await fetchIncomeSyncRecords<DividendRow>('dividend', INITIAL_ROWS);
      setDraftRows(sourceRows);
      setSelectedIds(sourceRows.map((row) => row.id));
      setSyncOpen(true);
      if (sourceRows.length === 0) {
        onUnavailableAction(
          isBn
            ? 'Income-এ সংশ্লিষ্ট Dividend তথ্য নেই, তাই সিঙ্ক করার মতো কোনো রেকর্ড পাওয়া যায়নি।'
            : 'No Dividend records are available to sync because the related Income data is not available.'
        );
      }
    } catch {
      onUnavailableAction(isBn ? 'Income থেকে Dividend তথ্য আনা যায়নি। পরে আবার চেষ্টা করুন।' : 'Dividend Income data could not be loaded. Please try again.');
    } finally {
      setSyncLoading(false);
    }
  };

  const closeSync = () => {
    setSyncOpen(false);
    setSelectedIds([]);
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const updateDraft = (
    id: number,
    key: keyof Omit<DividendRow, 'id' | 'authority' | 'claimed'>,
    value: string
  ) => {
    setDraftRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const saveSync = () => {
    const selectedRows = draftRows.filter((row) => selectedIds.includes(row.id));
    const invalid = selectedRows.some((row) => {
      const amount = parseMoneyStrict(row.amount);
      const claimed = parseMoneyStrict(row.claimed);
      return (
        !hasText(row.reference) ||
        !isValidLedgerDate(row.date) ||
        !isValidMoneyInput(row.amount) ||
        !isValidMoneyInput(row.claimed) ||
        amount === null ||
        claimed === null ||
        claimed > amount
      );
    });
    if (invalid) {
      onUnavailableAction(
        isBn
          ? 'নির্বাচিত Dividend রেকর্ডে রেফারেন্স, তারিখ এবং বৈধ দাবির পরিমাণ পূরণ করুন।'
          : 'Complete reference, date, and valid claim amounts for the selected Dividend records.'
      );
      return;
    }
    setRows((current) => {
      const byId = new Map(current.map((row) => [row.id, row]));
      selectedRows.forEach((row) => byId.set(row.id, row));
      return Array.from(byId.values()).sort((a, b) => a.id - b.id);
    });
    closeSync();
    onUnavailableAction(isBn ? 'নির্বাচিত Dividend রেকর্ড সংরক্ষিত হয়েছে।' : 'Selected Dividend records saved.');
  };

  const removeRow = (id: number) => {
    const confirmed = window.confirm(
      isBn ? 'এই লভ্যাংশ রেকর্ডটি মুছে ফেলবেন?' : 'Delete this dividend record?'
    );
    if (confirmed) setRows((current) => current.filter((row) => row.id !== id));
  };

  return (
    <section className="w-full space-y-4" aria-labelledby="dividend-title">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1
            id="dividend-title"
            className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]"
          >
            {isBn ? 'লভ্যাংশ' : 'Dividend'}
          </h1>
          <p className="mt-1 max-w-3xl text-sm italic leading-relaxed text-[#0B6FA4]">
            {isBn ? 'লভ্যাংশ [ ধারা-১১৭]' : 'Dividend [ Section-117]'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void openSync()}
          disabled={syncLoading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 focus-visible:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" />
          {syncLoading ? (isBn ? 'সিঙ্ক হচ্ছে...' : 'Syncing...') : (isBn ? 'Income থেকে সিঙ্ক' : 'Sync From Income')}
        </button>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="overflow-x-auto">
          <table className="ledger-responsive-table w-full min-w-[980px] text-sm">
            <thead className="bg-slate-50 text-[#5F6B7A]">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-semibold">SL.</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">
                  {isBn
                    ? 'জমাদানকারী কর্তৃপক্ষ / ব্যক্তি / কোম্পানি'
                    : 'Depositing Authority / Person / Company'}
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">
                  {isBn ? 'সার্টিফিকেট রেফারেন্স নং' : 'Certificate Reference No'}
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">
                  {isBn ? 'সার্টিফিকেট রেফারেন্স তারিখ' : 'Certificate Reference Date'}
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  {isBn ? 'চালান / সার্টিফিকেট পরিমাণ' : 'Challan / Certificate Amount'}
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  {isBn ? 'দাবিকৃত পরিমাণ' : 'Claimed Amount'}
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  {isBn ? 'অ্যাকশন' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td data-label="SL." className="px-4 py-3 text-slate-500">{index + 1}</td>
                  <td data-label={isBn ? "জমাদানকারী কর্তৃপক্ষ / ব্যক্তি / কোম্পানি" : "Depositing Authority / Person / Company"} className="px-4 py-3 font-medium text-[#172033]">{row.authority}</td>
                  <td data-label={isBn ? "সার্টিফিকেট রেফারেন্স নং" : "Certificate Reference No"} className="px-4 py-3 text-[#263247]">{row.reference}</td>
                  <td data-label={isBn ? "সার্টিফিকেট রেফারেন্স তারিখ" : "Certificate Reference Date"} className="px-4 py-3 text-[#263247]">{row.date}</td>
                  <td data-label={isBn ? "চালান / সার্টিফিকেট পরিমাণ" : "Challan / Certificate Amount"} className="px-4 py-3 text-right font-medium text-[#172033]">{row.amount}</td>
                  <td data-label={isBn ? "দাবিকৃত পরিমাণ" : "Claimed Amount"} className="px-4 py-3 text-right font-semibold text-[#172033]">{row.claimed}</td>
                  <td data-label={isBn ? "অ্যাকশন" : "Action"} className="px-4 py-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        aria-label={isBn ? 'রেকর্ড মুছুন' : 'Delete record'}
                        title={isBn ? 'মুছুন' : 'Delete'}
                        className="rounded-md p-2 text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </section>

      {syncOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div
            ref={syncDialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dividend-sync-title"
            className="flex max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-start justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h2 id="dividend-sync-title" className="text-base font-bold text-[#172033]">
                  {isBn ? 'লভ্যাংশ' : 'Dividend'}
                </h2>
                
              </div>
              <button
                type="button"
                onClick={closeSync}
                aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-auto">
              <table className="ledger-responsive-table w-full min-w-[1080px] text-sm">
                <thead className="bg-slate-50 text-[#5F6B7A]">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {isBn ? 'নির্বাচন' : 'Select'}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {isBn
                        ? 'জমাদানকারী কর্তৃপক্ষ / ব্যক্তি / কোম্পানি'
                        : 'Depositing Authority / Person / Company'}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {isBn ? 'সার্টিফিকেট রেফারেন্স নং' : 'Certificate Reference No.'}
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold">
                      {isBn ? 'রেফারেন্স তারিখ' : 'Certificate Reference Date'}
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      {isBn ? 'সার্টিফিকেট পরিমাণ' : 'Challan/ Certificate Amount'}
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      {isBn ? 'দাবিকৃত পরিমাণ' : 'Claimed Amount'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {draftRows.map((row) => {
                    const selected = selectedIds.includes(row.id);
                    return (
                      <tr key={row.id} className={selected ? 'bg-white' : 'bg-slate-50/70'}>
                        <td data-label={isBn ? "নির্বাচন" : "Select"} className="px-4 py-3 align-middle">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleSelection(row.id)}
                            aria-label={(isBn ? 'নির্বাচন করুন ' : 'Select ') + row.authority}
                            className="h-4 w-4 rounded border-slate-300 text-[#0B6FA4] focus:ring-[#0B6FA4]"
                          />
                        </td>
                        <td data-label={isBn ? "জমাদানকারী কর্তৃপক্ষ / ব্যক্তি / কোম্পানি" : "Depositing Authority / Person / Company"} className="px-4 py-3 font-medium text-[#172033]">{row.authority}</td>
                        <td data-label={isBn ? "সার্টিফিকেট রেফারেন্স নং" : "Certificate Reference No."} className="px-3 py-2">
                          <input
                            value={row.reference}
                            disabled={!selected}
                            onChange={(event) => updateDraft(row.id, 'reference', event.target.value)}
                            aria-label={row.authority + ' ' + (isBn ? 'সার্টিফিকেট রেফারেন্স নং' : 'certificate reference number')}
                            className="w-full min-w-[150px] rounded-md border border-[#C8D4E1] bg-white px-2.5 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-400 focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20"
                          />
                        </td>
                        <td data-label={isBn ? "রেফারেন্স তারিখ" : "Certificate Reference Date"} className="px-3 py-2">
                          <input
                            value={row.date}
                            disabled={!selected}
                            onChange={(event) => updateDraft(row.id, 'date', event.target.value)}
                            aria-label={row.authority + ' ' + (isBn ? 'রেফারেন্স তারিখ' : 'reference date')}
                            className="w-full min-w-[130px] rounded-md border border-[#C8D4E1] bg-white px-2.5 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-400 focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20"
                          />
                        </td>
                        <td data-label={isBn ? "সার্টিফিকেট পরিমাণ" : "Challan/ Certificate Amount"} className="px-3 py-2">
                          <input
                            value={row.amount}
                            disabled={!selected}
                            onChange={(event) => updateDraft(row.id, 'amount', event.target.value)}
                            aria-label={row.authority + ' ' + (isBn ? 'সার্টিফিকেট পরিমাণ' : 'certificate amount')}
                            inputMode="decimal"
                            className="w-full min-w-[130px] rounded-md border border-[#C8D4E1] bg-white px-2.5 py-2 text-right text-sm disabled:bg-slate-100 disabled:text-slate-400 focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20"
                          />
                        </td>
                        <td data-label={isBn ? "দাবিকৃত পরিমাণ" : "Claimed Amount"} className="px-4 py-3 text-right font-semibold text-[#172033]">{row.claimed}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#E2E8F0] bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeSync}
                  className="rounded-lg border border-[#C8D4E1] bg-white px-4 py-2 text-sm font-semibold text-[#263247] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  {isBn ? 'না' : 'No'}
                </button>
                <button
                  type="button"
                  onClick={saveSync}
                  disabled={selectedIds.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#095D8A] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"
                >
                  <RefreshCw className="h-4 w-4" />
                  {isBn ? 'সংরক্ষণ' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
