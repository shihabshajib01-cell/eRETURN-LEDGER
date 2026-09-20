import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Language } from '../types';

type SurchargeRow = {
  id: number;
  registration: string;
  transaction: string;
  bank: string;
  branch: string;
  date: string;
  amount: string;
};

const INITIAL_ROWS: SurchargeRow[] = [
  { id: 1, registration: '2345', transaction: '234234', bank: 'Community Bank Bangladesh PLC', branch: 'branch 2', date: '02-09-2026', amount: '20,000' },
  { id: 2, registration: '3455', transaction: '345345', bank: 'Community Bank Bangladesh PLC', branch: 'branch 3', date: '12-09-2026', amount: '20,000' },
  { id: 3, registration: '1234', transaction: '1223132', bank: 'AB Bank PLC', branch: 'Branch', date: '01-09-2026', amount: '10,000' },
];

export const EnvironmentalSurchargeLeanPage: React.FC<{
  lang: Language;
  onUnavailableAction: (message: string) => void;
}> = ({ lang, onUnavailableAction }) => {
  const isBn = lang === 'bn';
  const [rows, setRows] = useState<SurchargeRow[]>(INITIAL_ROWS);
  const [declared, setDeclared] = useState('50000');

  const updateRow = (id: number, key: keyof Omit<SurchargeRow, 'id'>, value: string) => {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [key]: value } : row));
  };

  const addRow = () => {
    setRows((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((row) => row.id)) + 1,
        registration: '',
        transaction: '',
        bank: '',
        branch: '',
        date: '',
        amount: '',
      },
    ]);
  };

  const removeRow = (id: number) => {
    setRows((current) => current.filter((row) => row.id !== id));
  };

  return (
    <section className="w-full space-y-4" aria-labelledby="environmental-surcharge-title">
      <header className="flex items-center justify-between gap-4">
        <h1 id="environmental-surcharge-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
          Environmental Surcharge
        </h1>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-lg border border-[#0B6FA4] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B6FA4] hover:bg-blue-50"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-sm">
            <thead className="bg-slate-50 text-[#5F6B7A]">
              <tr>
                <th scope="col" className="px-3 py-3 text-left font-semibold">Motor Vehicle Registration No</th>
                <th scope="col" className="px-3 py-3 text-left font-semibold">Transaction ID</th>
                <th scope="col" className="px-3 py-3 text-left font-semibold">Bank Name</th>
                <th scope="col" className="px-3 py-3 text-left font-semibold">Branch Name</th>
                <th scope="col" className="px-3 py-3 text-left font-semibold">Payment Date</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">Paid Amount</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-2.5"><input value={row.registration} onChange={(e) => updateRow(row.id, 'registration', e.target.value)} className="w-full min-w-[130px] rounded-md border border-[#C8D4E1] px-2.5 py-2" /></td>
                  <td className="px-3 py-2.5"><input value={row.transaction} onChange={(e) => updateRow(row.id, 'transaction', e.target.value)} className="w-full min-w-[130px] rounded-md border border-[#C8D4E1] px-2.5 py-2" /></td>
                  <td className="px-3 py-2.5">
                    <select value={row.bank} onChange={(e) => updateRow(row.id, 'bank', e.target.value)} className="w-full min-w-[220px] rounded-md border border-[#C8D4E1] bg-white px-2.5 py-2">
                      <option value="">Select Bank</option>
                      <option value="Community Bank Bangladesh PLC">Community Bank Bangladesh PLC</option>
                      <option value="AB Bank PLC">AB Bank PLC</option>
                    </select>
                  </td>
                  <td className="px-3 py-2.5"><input value={row.branch} onChange={(e) => updateRow(row.id, 'branch', e.target.value)} className="w-full min-w-[120px] rounded-md border border-[#C8D4E1] px-2.5 py-2" /></td>
                  <td className="px-3 py-2.5"><input value={row.date} onChange={(e) => updateRow(row.id, 'date', e.target.value)} className="w-full min-w-[130px] rounded-md border border-[#C8D4E1] px-2.5 py-2" /></td>
                  <td className="px-3 py-2.5"><input value={row.amount} onChange={(e) => updateRow(row.id, 'amount', e.target.value)} inputMode="decimal" className="w-full min-w-[120px] rounded-md border border-[#C8D4E1] px-2.5 py-2 text-right" /></td>
                  <td className="px-3 py-2.5 text-right">
                    <button type="button" onClick={() => removeRow(row.id)} aria-label="Delete" className="rounded-md p-2 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50">
                <td colSpan={5} className="px-4 py-3 font-bold text-[#172033]">Total Paid Amount</td>
                <td className="px-4 py-3 text-right font-semibold text-[#172033]">50,000</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="border-t border-[#E2E8F0] px-4 py-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_360px] md:items-center">
            <label htmlFor="surcharge-declared" className="font-bold text-[#172033]">Surcharge Declared By Assessee</label>
            <input
              id="surcharge-declared"
              value={declared}
              onChange={(event) => setDeclared(event.target.value)}
              inputMode="decimal"
              className="w-full rounded-lg border border-[#C8D4E1] bg-white px-3 py-2.5 text-right"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onUnavailableAction(isBn ? 'Save API এখনো সংযুক্ত নয়।' : 'Save API is not connected yet.')}
          className="rounded-lg bg-[#0B6FA4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A]"
        >
          Save
        </button>
      </div>
    </section>
  );
};
