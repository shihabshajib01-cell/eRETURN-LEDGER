import React, { useMemo, useState } from 'react';
import { RefreshCw, Search, X } from 'lucide-react';
import { Language } from '../types';

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
  const [query, setQuery] = useState('');
  const [syncOpen, setSyncOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return INITIAL_ROWS;
    return INITIAL_ROWS.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(normalized))
    );
  }, [query]);

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
    closeSync();
    onUnavailableAction(
      isBn
        ? 'নির্বাচিত ব্যাংক/এফআই রেকর্ডগুলো সিঙ্ক করা হয়েছে (প্রোটোটাইপ স্টেট)।'
        : 'Selected Bank/FI records synced in prototype state.'
    );
  };

  return (
    <section className="w-full space-y-4" aria-labelledby="bank-fi-title">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 id="bank-fi-title" className="text-2xl lg:text-[28px] font-bold text-[#172033] tracking-tight">
            {isBn ? 'ব্যাংক উৎস কর' : 'Bank TDS'}
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#5F6B7A]">
            {isBn ? 'Interest/Profit (Bank & FI - With TDS Deduction)' : 'Interest/Profit (Bank & FI - With TDS Deduction)'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSyncOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 focus-visible:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" />
          {isBn ? 'Sync From Income' : 'Sync From Income'}
        </button>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white" aria-labelledby="bank-fi-records-title">
        <div className="flex flex-col gap-3 border-b border-[#E2E8F0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="bank-fi-records-title" className="text-base font-bold text-[#172033]">
              {isBn ? 'রেকর্ডসমূহ' : 'Records'}
            </h2>
            <p className="mt-0.5 text-xs text-[#5F6B7A]">
              {filteredRows.length} {isBn ? 'টি রেকর্ড' : filteredRows.length === 1 ? 'record' : 'records'}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={isBn ? 'রেকর্ড খুঁজুন...' : 'Search records...'}
              className="w-full rounded-lg border border-[#C8D4E1] bg-white py-2 pl-9 pr-3 text-sm text-[#172033] focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-slate-50 text-[#5F6B7A]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">SL</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'ব্যাংকের নাম' : 'Bank Name'}</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'হিসাবের ধরন' : 'Account Type'}</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'শাখার নাম' : 'Branch Name'}</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'হিসাব নম্বর' : 'Account Number'}</th>
                <th className="px-4 py-3 text-right font-semibold">{isBn ? 'সুদ/মুনাফার পরিমাণ' : 'Interest Amount'}</th>
                <th className="px-4 py-3 text-right font-semibold">{isBn ? 'উৎস কর' : 'TDS'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-[#172033]">{row.bank}</td>
                  <td className="px-4 py-3 text-[#263247]">{row.accountType}</td>
                  <td className="px-4 py-3 text-[#263247]">{row.branch}</td>
                  <td className="px-4 py-3 text-[#263247]">{row.accountNumber}</td>
                  <td className="px-4 py-3 text-right font-medium text-[#172033]">{row.interest}</td>
                  <td className="px-4 py-3 text-right font-semibold text-[#172033]">{row.tds}</td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#5F6B7A]">
                    {isBn ? 'কোনো রেকর্ড পাওয়া যায়নি।' : 'No records found.'}
                  </td>
                </tr>
              )}
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
                  {isBn ? 'Interest/Profit (Bank & FI - With TDS Deduction)' : 'Interest/Profit (Bank & FI - With TDS Deduction)'}
                </h2>
                <p className="mt-1 text-xs text-[#5F6B7A]">
                  {isBn ? 'Select the records you want to sync.' : 'Select the records you want to sync.'}
                </p>
              </div>
              <button type="button" onClick={closeSync} aria-label={isBn ? 'বন্ধ করুন' : 'Close'} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-slate-50 text-[#5F6B7A]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">{isBn ? 'নির্বাচন' : 'Select'}</th>
                    <th className="px-4 py-3 text-left font-semibold">{isBn ? 'ব্যাংকের নাম' : 'Bank Name'}</th>
                    <th className="px-4 py-3 text-left font-semibold">{isBn ? 'হিসাবের ধরন' : 'Account Type'}</th>
                    <th className="px-4 py-3 text-left font-semibold">{isBn ? 'শাখা' : 'Branch'}</th>
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
                      <td className="px-4 py-3 font-medium text-[#172033]">{row.bank}</td>
                      <td className="px-4 py-3 text-[#263247]">{row.accountType}</td>
                      <td className="px-4 py-3 text-[#263247]">{row.branch}</td>
                      <td className="px-4 py-3 text-[#263247]">{row.accountNumber}</td>
                      <td className="px-4 py-3 text-right font-medium">{row.interest}</td>
                      <td className="px-4 py-3 text-right font-semibold">{row.tds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#E2E8F0] bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#5F6B7A]">
                {selectedIds.length} {isBn ? 'টি নির্বাচিত' : selectedIds.length === 1 ? 'record selected' : 'records selected'}
              </p>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeSync} className="rounded-lg border border-[#C8D4E1] bg-white px-4 py-2 text-sm font-semibold text-[#263247] hover:bg-slate-50">
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={syncSelected}
                  disabled={selectedIds.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#095D8A] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  {isBn ? 'Sync' : 'Sync'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
