import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Language } from '../types';
import { LedgerTable, LedgerTableBody, LedgerTableHead } from './table/LedgerTable';
import { usePersistentState } from '../hooks/usePersistentState';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber, parseMoney } from '../utils/money';
import { hasText, isValidLedgerDate, isValidMoneyInput, parseMoneyStrict } from '../utils/validation';

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
  const [savedRows, setSavedRows] = usePersistentState<SurchargeRow[]>('ereturn-ledger:v2:environmental-surcharge-rows', INITIAL_ROWS);
  const [savedDeclared, setSavedDeclared] = usePersistentState('ereturn-ledger:v2:environmental-surcharge-declared', '50000');
  const [rows, setRows] = useState<SurchargeRow[]>(savedRows);
  const [declared, setDeclared] = useState(savedDeclared);
  const { updateCategoryAmount } = useLedgerRuntime();
  const labelText = (label: string) => {
    if (!isBn) return label;
    const labels: Record<string, string> = {
      'Environmental Surcharge': 'পরিবেশ সারচার্জ',
      'Motor Vehicle Registration No': 'মোটরযানের রেজিস্ট্রেশন নং',
      'Transaction ID': 'ট্রানজ্যাকশন আইডি',
      'Bank Name': 'ব্যাংকের নাম',
      'Branch Name': 'শাখার নাম',
      'Payment Date': 'পেমেন্টের তারিখ',
      'Paid Amount': 'পরিশোধিত পরিমাণ',
      'Action': 'অ্যাকশন',
      'Total Paid Amount': 'মোট পরিশোধিত পরিমাণ',
      'Surcharge Declared By Assessee': 'করদাতা কর্তৃক ঘোষিত সারচার্জ',
      'Add': 'যোগ করুন',
      'Save': 'সংরক্ষণ',
      'Delete': 'মুছুন',
      'Select Bank': 'ব্যাংক নির্বাচন করুন',
    };
    return labels[label] || label;
  };
  const totalPaid = useMemo(() => rows.reduce((sum, row) => sum + parseMoney(row.amount), 0), [rows]);
  const declaredAmount = useMemo(() => parseMoney(declared), [declared]);
  const savedDeclaredAmount = useMemo(() => parseMoney(savedDeclared), [savedDeclared]);
  const rowsValid = rows.length > 0 && rows.every((row) =>
    hasText(row.registration) &&
    hasText(row.transaction) &&
    hasText(row.bank) &&
    hasText(row.branch) &&
    isValidLedgerDate(row.date) &&
    isValidMoneyInput(row.amount) &&
    parseMoneyStrict(row.amount) !== null
  );
  const canSave =
    rowsValid &&
    isValidMoneyInput(declared) &&
    parseMoneyStrict(declared) !== null;

  useEffect(() => {
    updateCategoryAmount('environmental-surcharge', savedDeclaredAmount);
  }, [savedDeclaredAmount, updateCategoryAmount]);

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
          {labelText('Environmental Surcharge')}
        </h1>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-lg border border-[#0B6FA4] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B6FA4] hover:bg-blue-50"
        >
          <Plus className="h-4 w-4" />
          {labelText('Add')}
        </button>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="overflow-x-auto">
          <LedgerTable className="ledger-responsive-table w-full min-w-[1080px] text-sm">
            <LedgerTableHead>
              <tr>
                <th scope="col" className="px-3 py-3 text-left font-semibold">{labelText('Motor Vehicle Registration No')}</th>
                <th scope="col" className="px-3 py-3 text-left font-semibold">{labelText('Transaction ID')}</th>
                <th scope="col" className="px-3 py-3 text-left font-semibold">{labelText('Bank Name')}</th>
                <th scope="col" className="px-3 py-3 text-left font-semibold">{labelText('Branch Name')}</th>
                <th scope="col" className="px-3 py-3 text-left font-semibold">{labelText('Payment Date')}</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">{labelText('Paid Amount')}</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">{labelText('Action')}</th>
              </tr>
            </LedgerTableHead>
            <LedgerTableBody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td data-label={labelText("Motor Vehicle Registration No")} className="px-3 py-2.5"><input value={row.registration} onChange={(e) => updateRow(row.id, 'registration', e.target.value)} className="w-full min-w-[130px] rounded-md border border-[#C8D4E1] px-2.5 py-2" /></td>
                  <td data-label={labelText("Transaction ID")} className="px-3 py-2.5"><input value={row.transaction} onChange={(e) => updateRow(row.id, 'transaction', e.target.value)} className="w-full min-w-[130px] rounded-md border border-[#C8D4E1] px-2.5 py-2" /></td>
                  <td data-label={labelText("Bank Name")} className="px-3 py-2.5">
                    <input
                      list="environmental-bank-options"
                      value={row.bank}
                      onChange={(e) => updateRow(row.id, 'bank', e.target.value)}
                      placeholder={labelText('Select Bank')}
                      className="w-full min-w-[220px] rounded-md border border-[#C8D4E1] bg-white px-2.5 py-2"
                    />
                    <datalist id="environmental-bank-options">
                      <option value="Community Bank Bangladesh PLC" />
                      <option value="AB Bank PLC" />
                      <option value="Sonali Bank PLC" />
                      <option value="Janata Bank PLC" />
                      <option value="Pubali Bank PLC" />
                      <option value="IFIC Bank PLC" />
                    </datalist>
                  </td>
                  <td data-label={labelText("Branch Name")} className="px-3 py-2.5"><input value={row.branch} onChange={(e) => updateRow(row.id, 'branch', e.target.value)} className="w-full min-w-[120px] rounded-md border border-[#C8D4E1] px-2.5 py-2" /></td>
                  <td data-label={labelText("Payment Date")} className="px-3 py-2.5"><input value={row.date} onChange={(e) => updateRow(row.id, 'date', e.target.value)} className="w-full min-w-[130px] rounded-md border border-[#C8D4E1] px-2.5 py-2" /></td>
                  <td data-label={labelText("Paid Amount")} className="px-3 py-2.5"><input value={row.amount} onChange={(e) => updateRow(row.id, 'amount', e.target.value)} inputMode="decimal" className="w-full min-w-[120px] rounded-md border border-[#C8D4E1] px-2.5 py-2 text-right" /></td>
                  <td data-label={labelText("Action")} className="px-3 py-2.5 text-right">
                    <button type="button" onClick={() => removeRow(row.id)} aria-label={labelText("Delete")} className="rounded-md p-2 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </LedgerTableBody>
            <tfoot>
              <tr className="bg-slate-50">
                <td colSpan={5} className="px-4 py-3 font-bold text-[#172033]">{labelText('Total Paid Amount')}</td>
                <td className="px-4 py-3 text-right font-semibold text-[#172033]">{formatLedgerNumber(totalPaid)}</td>
                <td />
              </tr>
            </tfoot>
          </LedgerTable>
        </div>

        <div className="border-t border-[#E2E8F0] px-4 py-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_360px] md:items-center">
            <label htmlFor="surcharge-declared" className="font-bold text-[#172033]">{labelText('Surcharge Declared By Assessee')}</label>
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

      {!canSave && (
        <p className="text-sm text-red-600">{isBn ? 'সংরক্ষণের আগে সব পেমেন্ট তথ্য পূরণ করুন।' : 'Complete all payment fields before saving.'}</p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!canSave}
          onClick={() => {
            setSavedRows(rows);
            setSavedDeclared(declared);
            onUnavailableAction(isBn ? 'Environmental Surcharge সংরক্ষিত হয়েছে।' : 'Environmental Surcharge saved.');
          }}
          className="rounded-lg bg-[#0B6FA4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {labelText('Save')}
        </button>
      </div>
    </section>
  );
};
