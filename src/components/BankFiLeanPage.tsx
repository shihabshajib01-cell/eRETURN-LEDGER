import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Language } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { parseMoney } from '../utils/money';

type BankRow = {
  id: number;
  bank: string;
  accountType: string;
  branch: string;
  accountNumber: string;
  interest: string;
  tds: string;
};

const INITIAL_ROWS: BankRow[] = [
  { id: 1, bank: 'BRAC Bank PLC', accountType: 'DPS', branch: 'Karwan Bazar', accountNumber: '1111111', interest: '1,00,000', tds: '1,000' },
  { id: 2, bank: 'Dhaka Bank PLC', accountType: 'FDR / Term Deposit', branch: 'Karwan Bazar', accountNumber: '11111111', interest: '5,00,000', tds: '50,000' },
  { id: 3, bank: 'AB Bank PLC', accountType: 'Savings / SND / Others', branch: 'Karwan Bazar -3', accountNumber: '22222222', interest: '6,00,000', tds: '60,000' },
  { id: 4, bank: 'Dhaka Bank PLC', accountType: 'DPS', branch: 'Bandarban', accountNumber: '3333333', interest: '9,90,000', tds: '1,00,200' },
  { id: 5, bank: 'EXIM Bank PLC', accountType: 'FDR / Term Deposit', branch: 'Chuyadanga', accountNumber: '555555', interest: '1,00,02,004', tds: '1,00,200' },
];

export const BankFiLeanPage: React.FC<{
  lang: Language;
  onUnavailableAction: (message: string) => void;
}> = ({ lang, onUnavailableAction }) => {
  const isBn = lang === 'bn';
  const [rows, setRows] = usePersistentState<BankRow[]>('ereturn-ledger:v2:bank-fi-rows', INITIAL_ROWS);
  const [syncOpen, setSyncOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { updateCategoryAmount } = useLedgerRuntime();
  const totalTds = useMemo(() => rows.reduce((sum, row) => sum + parseMoney(row.tds), 0), [rows]);

  useEffect(() => {
    updateCategoryAmount('bank-fi', totalTds);
  }, [totalTds, updateCategoryAmount]);

  const toggleSelection = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const closeSync = () => {
    setSyncOpen(false);
    setSelectedIds([]);
  };

  const syncSelected = () => {
    const selectedRows = INITIAL_ROWS.filter((row) => selectedIds.includes(row.id));
    setRows((current) => {
      const byId = new Map(current.map((row) => [row.id, row]));
      selectedRows.forEach((row) => byId.set(row.id, row));
      return Array.from(byId.values()).sort((a, b) => a.id - b.id);
    });
    closeSync();
    onUnavailableAction(
      isBn
        ? 'নির্বাচিত ব্যাংক/এফআই রেকর্ডগুলো সিঙ্ক করা হয়েছে।'
        : 'Selected Bank/FI records synced.'
    );
  };

  return (
    <section className="w-full space-y-4" aria-labelledby="bank-fi-title">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 id="bank-fi-title" className="text-2xl lg:text-[28px] font-bold text-[#172033] tracking-tight">
            {isBn ? 'ব্যাংক উৎস কর' : 'Bank TDS'}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setSyncOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 focus-visible:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" />
          {isBn ? 'Income থেকে সিঙ্ক' : 'Sync From Income'}
        </button>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="overflow-x-auto">
          <table className="ledger-responsive-table w-full min-w-[980px] text-sm">
            <thead className="bg-slate-50 text-[#5F6B7A]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">SL.</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'ব্যাংকের নাম' : 'Bank Name'}</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'হিসাবের ধরন' : 'Account Type'}</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'শাখার নাম' : 'Branch Name'}</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'হিসাব নম্বর' : 'Account Number'}</th>
                <th className="px-4 py-3 text-right font-semibold">{isBn ? 'সুদ/মুনাফার পরিমাণ' : 'Interest Amount'}</th>
                <th className="px-4 py-3 text-right font-semibold">{isBn ? 'উৎস কর' : 'TDS'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td data-label="SL." className="px-4 py-3 text-slate-500">{index + 1}</td>
                  <td data-label="Bank Name" className="px-4 py-3 font-medium text-[#172033]">{row.bank}</td>
                  <td data-label="Account Type" className="px-4 py-3 text-[#263247]">{row.accountType}</td>
                  <td data-label="Branch Name" className="px-4 py-3 text-[#263247]">{row.branch}</td>
                  <td data-label="Account Number" className="px-4 py-3 text-[#263247]">{row.accountNumber}</td>
                  <td data-label="Interest Amount" className="px-4 py-3 text-right font-medium text-[#172033]">{row.interest}</td>
                  <td data-label="TDS" className="px-4 py-3 text-right font-semibold text-[#172033]">{row.tds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {syncOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="bank-sync-title" className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h2 id="bank-sync-title" className="text-base font-bold text-[#172033]">
                  {isBn ? 'সুদ/মুনাফা (Bank & FI - TDS কর্তনসহ)' : 'Interest/Profit (Bank & FI - With TDS Deduction)'}
                </h2>
                
              </div>
              <button type="button" onClick={closeSync} aria-label={isBn ? 'বন্ধ করুন' : 'Close'} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-slate-50 text-[#5F6B7A]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === INITIAL_ROWS.length}
                          onChange={(event) => setSelectedIds(event.target.checked ? INITIAL_ROWS.map((row) => row.id) : [])}
                          className="h-4 w-4 rounded border-slate-300 text-[#0B6FA4] focus:ring-[#0B6FA4]"
                        />
                        Select
                      </label>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">{isBn ? 'হিসাবের ধরন' : 'Account Type'}</th>
                    <th className="px-4 py-3 text-left font-semibold">{isBn ? 'ব্যাংক/এফআই নাম' : 'Bank/FI Name'}</th>
                    <th className="px-4 py-3 text-left font-semibold">{isBn ? 'শাখার নাম' : 'Branch Name'}</th>
                    <th className="px-4 py-3 text-left font-semibold">{isBn ? 'হিসাব নম্বর' : 'Account Number'}</th>
                    <th className="px-4 py-3 text-right font-semibold">{isBn ? 'সুদ/মুনাফা' : 'Interest Amount'}</th>
                    <th className="px-4 py-3 text-right font-semibold">{isBn ? 'উৎস কর' : 'TDS'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INITIAL_ROWS.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.id)}
                          onChange={() => toggleSelection(row.id)}
                          aria-label={`${isBn ? 'নির্বাচন করুন' : 'Select'} ${row.bank}`}
                          className="h-4 w-4 rounded border-slate-300 text-[#0B6FA4] focus:ring-[#0B6FA4]"
                        />
                      </td>
                      <td className="px-4 py-3 text-[#263247]">{row.accountType}</td>
                      <td className="px-4 py-3 font-medium text-[#172033]">{row.bank}</td>
                      <td className="px-4 py-3 text-[#263247]">{row.branch}</td>
                      <td className="px-4 py-3 text-[#263247]">{row.accountNumber}</td>
                      <td className="px-4 py-3 text-right font-medium">{row.interest}</td>
                      <td className="px-4 py-3 text-right font-semibold">{row.tds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end border-t border-[#E2E8F0] bg-slate-50/60 px-5 py-4">
              <button
                type="button"
                onClick={syncSelected}
                disabled={selectedIds.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#095D8A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                {isBn ? 'সিঙ্ক' : 'Sync'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
