import React, { useEffect, useMemo, useState } from 'react';
import { Search, Trash2, X, Check } from 'lucide-react';
import { Language } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber, parseMoney } from '../utils/money';
import {
  AIT_154_SOURCE,
  AIT_CAR_SOURCE,
  COMMERCIAL_VEHICLE_SOURCE,
  SECTION_173_SOURCE,
  AitCarRecord,
  ChallanRecord,
  CommercialVehicleRecord,
} from '../data/eledgerVerificationData';
import { lookupExternalLedgerRecord } from '../services/eledgerLookup';

type LookupKind = 'commercial-vehicle' | 'ait-car' | 'ait-154' | 'tax-paid-return';
type LookupRecord = CommercialVehicleRecord | ChallanRecord | AitCarRecord;

type Config = {
  title: string;
  lookupLabel: string;
  placeholder: string;
  sourceRows: LookupRecord[];
  initialRows: LookupRecord[];
  lookupKey: string;
  amountKey: string;
  tableTitle: string;
  columns: { key: string; label: string; numeric?: boolean }[];
};

const CONFIGS: Record<LookupKind, Config> = {
  'commercial-vehicle': {
    title: 'Commercial Vehicle',
    lookupLabel: 'Unique Key (Transaction No.)',
    placeholder: 'Transaction No.',
    sourceRows: COMMERCIAL_VEHICLE_SOURCE,
    initialRows: COMMERCIAL_VEHICLE_SOURCE,
    lookupKey: 'uniqueKey',
    amountKey: 'tds',
    tableTitle: 'TDS Details',
    columns: [
      { key: 'registration', label: 'Registration No.' },
      { key: 'uniqueKey', label: 'Unique Key' },
      { key: 'chassis', label: 'Chasis No.' },
      { key: 'tds', label: 'TDS Claim', numeric: true },
    ],
  },
  'ait-car': {
    title: 'AIT on Car',
    lookupLabel: 'Unique Key (Transaction No.)',
    placeholder: 'Transaction No.',
    sourceRows: AIT_CAR_SOURCE,
    initialRows: [],
    lookupKey: 'transactionNo',
    amountKey: 'amount',
    tableTitle: 'AIT Details',
    columns: [
      { key: 'transactionNo', label: 'Transaction No.' },
      { key: 'registration', label: 'Registration No.' },
      { key: 'date', label: 'Date' },
      { key: 'amount', label: 'AIT Amount', numeric: true },
      { key: 'status', label: 'Status' },
    ],
  },
  'ait-154': {
    title: 'AIT under Section 154',
    lookupLabel: 'Challan No.',
    placeholder: 'Enter Challan No.',
    sourceRows: AIT_154_SOURCE,
    initialRows: AIT_154_SOURCE,
    lookupKey: 'challan',
    amountKey: 'amount',
    tableTitle: 'AIT Details',
    columns: [
      { key: 'challan', label: 'Challan No.' },
      { key: 'date', label: 'Date' },
      { key: 'amount', label: 'Amount', numeric: true },
      { key: 'mode', label: 'Payment Mode' },
      { key: 'bank', label: 'Bank' },
      { key: 'branch', label: 'Branch' },
      { key: 'zone', label: 'Zone' },
      { key: 'circle', label: 'Circle' },
    ],
  },
  'tax-paid-return': {
    title: 'Regular Tax under Section 173',
    lookupLabel: 'Challan No.',
    placeholder: 'Enter Challan No.',
    sourceRows: SECTION_173_SOURCE,
    initialRows: SECTION_173_SOURCE,
    lookupKey: 'challan',
    amountKey: 'amount',
    tableTitle: 'Regular Tax under Section 173',
    columns: [
      { key: 'challan', label: 'Challan No.' },
      { key: 'date', label: 'Date' },
      { key: 'amount', label: 'Amount', numeric: true },
      { key: 'mode', label: 'Payment Mode' },
      { key: 'bank', label: 'Bank' },
      { key: 'branch', label: 'Branch' },
      { key: 'zone', label: 'Zone' },
      { key: 'circle', label: 'Circle' },
    ],
  },
};

const BN_LABELS: Record<string, string> = {
  'Commercial Vehicle': 'বাণিজ্যিক যানবাহন',
  'AIT on Car': 'গাড়ির উপর AIT',
  'AIT under Section 154': 'ধারা ১৫৪-এর অধীন AIT',
  'Regular Tax under Section 173': 'ধারা ১৭৩-এর অধীন নিয়মিত কর',
  'Unique Key (Transaction No.)': 'ইউনিক কী (ট্রানজ্যাকশন নং)',
  'Transaction No.': 'ট্রানজ্যাকশন নং',
  'Challan No.': 'চালান নং',
  'Registration No.': 'রেজিস্ট্রেশন নং',
  'Unique Key': 'ইউনিক কী',
  'Chasis No.': 'চ্যাসিস নং',
  'TDS Claim': 'TDS দাবি',
  'Date': 'তারিখ',
  'AIT Amount': 'AIT পরিমাণ',
  'Status': 'অবস্থা',
  'Amount': 'পরিমাণ',
  'Payment Mode': 'পেমেন্ট পদ্ধতি',
  'Bank': 'ব্যাংক',
  'Branch': 'শাখা',
  'Zone': 'জোন',
  'Circle': 'সার্কেল',
  'AIT Details': 'AIT বিবরণ',
  'TDS Details': 'TDS বিবরণ',
};

export const LookupClaimPage: React.FC<{
  kind: LookupKind;
  lang: Language;
  onMessage: (message: string) => void;
}> = ({ kind, lang, onMessage }) => {
  const config = CONFIGS[kind];
  const isBn = lang === 'bn';
  const label = (value: string) => isBn ? (BN_LABELS[value] || value) : value;
  const storageKey = `ereturn-ledger:v4:${kind}-rows`;
  const [rows, setRows] = usePersistentState<LookupRecord[]>(storageKey, config.initialRows);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<LookupRecord | null>(null);
  const [searching, setSearching] = useState(false);
  const { updateCategoryAmount } = useLedgerRuntime();
  const directSaveLookup = kind === 'ait-154' || kind === 'tax-paid-return';

  const total = useMemo(
    () => rows.reduce((sum, row) => sum + parseMoney((row as Record<string, unknown>)[config.amountKey] as string ?? 0), 0),
    [rows, config.amountKey]
  );

  useEffect(() => {
    updateCategoryAmount(kind, total);
  }, [kind, total, updateCategoryAmount]);

  const resolveRecord = async (value: string): Promise<LookupRecord | null> => {
    const localMatch = config.sourceRows.find((row) =>
      String((row as Record<string, unknown>)[config.lookupKey] ?? '').toLowerCase() === value.toLowerCase()
    ) ?? null;
    if (localMatch) return localMatch;

    const external = await lookupExternalLedgerRecord(kind, value);
    if (!external) return null;

    return {
      id: Number(external.id ?? Date.now()),
      ...external,
      [config.lookupKey]: external[config.lookupKey] ?? value,
    } as LookupRecord;
  };

  const search = async () => {
    const value = query.trim();
    if (!value) {
      setResult(null);
      onMessage(isBn ? 'অনুসন্ধানের মান লিখুন।' : 'Enter a lookup value.');
      return;
    }

    setSearching(true);
    try {
      const match = await resolveRecord(value);
      if (match) {
        setResult(match);
        return;
      }

      setResult(null);
      if (kind === 'ait-car' && config.sourceRows.length === 0) {
        onMessage(
          isBn
            ? 'Transaction ID-এর কোনো যাচাইকৃত রেকর্ড পাওয়া যায়নি। উৎপাদন NBR/ব্যাংক-স্লিপ lookup সংযুক্ত হলে একই Search → Result → Save ফ্লো কাজ করবে।'
            : 'No verified record was found for this Transaction ID. The same Search → Result → Save flow will use the production NBR/bank-slip lookup when connected.'
        );
      } else {
        onMessage(isBn ? 'কোনো মিল পাওয়া যায়নি।' : 'No matching record found.');
      }
    } catch {
      setResult(null);
      onMessage(isBn ? 'ভেরিফিকেশন সার্ভিসে সংযোগ করা যাচ্ছে না। পরে আবার চেষ্টা করুন।' : 'The verification service is unavailable. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const directSave = async () => {
    const value = query.trim();
    if (!value) {
      onMessage(isBn ? 'চালান নম্বর লিখুন।' : 'Enter a challan number.');
      return;
    }

    setSearching(true);
    try {
      const match = await resolveRecord(value);
      if (!match) {
        setResult(null);
        onMessage(isBn ? 'কোনো মিল পাওয়া যায়নি।' : 'No matching record found.');
        return;
      }

      setResult(match);
      const key = String((match as Record<string, unknown>)[config.lookupKey] ?? '');
      setRows((current) => {
        const exists = current.some((row) => String((row as Record<string, unknown>)[config.lookupKey] ?? '') === key);
        return exists ? current : [...current, match];
      });
      onMessage(isBn ? 'রেকর্ডটি লেজারে সংরক্ষিত হয়েছে।' : 'Record saved to Ledger.');
    } catch {
      setResult(null);
      onMessage(isBn ? 'ভেরিফিকেশন সার্ভিসে সংযোগ করা যাচ্ছে না। পরে আবার চেষ্টা করুন।' : 'The verification service is unavailable. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const reset = () => {
    setQuery('');
    setResult(null);
  };

  const saveResult = () => {
    if (!result) return;
    const key = String((result as Record<string, unknown>)[config.lookupKey] ?? '');
    setRows((current) => {
      const exists = current.some((row) => String((row as Record<string, unknown>)[config.lookupKey] ?? '') === key);
      return exists ? current : [...current, result];
    });
    onMessage(isBn ? 'রেকর্ডটি লেজারে সংরক্ষিত হয়েছে।' : 'Record saved to Ledger.');
  };

  const deleteRow = (row: LookupRecord) => {
    const key = String((row as Record<string, unknown>)[config.lookupKey] ?? '');
    if (!window.confirm(isBn ? 'এই রেকর্ডটি মুছে ফেলবেন?' : 'Delete this record?')) return;
    setRows((current) => current.filter((item) => String((item as Record<string, unknown>)[config.lookupKey] ?? '') !== key));
  };

  return (
    <section className="w-full space-y-4" aria-labelledby={`${kind}-title`}>
      <h1 id={`${kind}-title`} className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
        {label(config.title)}
      </h1>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-semibold text-[#172033]">{label(config.lookupLabel)}</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') void search(); }}
              placeholder={label(config.placeholder)}
              className="w-full rounded-lg border border-[#C8D4E1] bg-white px-3 py-2.5 text-sm focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20"
            />
          </div>
          <button type="button" onClick={reset} className="rounded-lg border border-[#C8D4E1] bg-white px-4 py-2.5 text-sm font-semibold text-[#263247] hover:bg-slate-50">
            {isBn ? 'রিসেট' : 'Reset'}
          </button>
          <button
            type="button"
            onClick={() => void (directSaveLookup ? directSave() : search())}
            disabled={searching}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {directSaveLookup ? <Check className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            {searching
              ? (isBn ? 'যাচাই হচ্ছে...' : 'Checking...')
              : directSaveLookup
                ? (isBn ? 'সংরক্ষণ' : 'Save')
                : (isBn ? 'অনুসন্ধান' : 'Search')}
          </button>
        </div>
      </section>

      {result && (
        <section className="rounded-xl border border-[#D7E8F2] bg-[#F5FAFD] p-4" aria-live="polite">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {config.columns.map((column) => (
              <div key={column.key}>
                <p className="text-xs font-semibold text-[#5F6B7A]">{label(column.label)}</p>
                <p className={`mt-1 text-sm font-medium text-[#172033] ${column.numeric ? 'text-right md:text-left' : ''}`}>
                  {String((result as Record<string, unknown>)[column.key] ?? '—')}
                </p>
              </div>
            ))}
          </div>
          {!directSaveLookup && (
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={saveResult} className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#095D8A]">
                <Check className="h-4 w-4" />
                {isBn ? 'সংরক্ষণ' : 'Save'}
              </button>
            </div>
          )}
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="border-b border-[#E2E8F0] px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-bold text-[#172033]">{label(config.tableTitle)}</h2>
            <span className="text-sm font-semibold text-[#0B6FA4]">{formatLedgerNumber(total)}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="ledger-responsive-table w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 text-[#5F6B7A]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">SL.</th>
                {config.columns.map((column) => (
                  <th key={column.key} className={`px-4 py-3 font-semibold ${column.numeric ? 'text-right' : 'text-left'}`}>{label(column.label)}</th>
                ))}
                <th className="px-4 py-3 text-right font-semibold">{isBn ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={String((row as Record<string, unknown>)[config.lookupKey] ?? index)}>
                  <td data-label="SL." className="px-4 py-3 text-slate-500">{index + 1}</td>
                  {config.columns.map((column) => (
                    <td
                      key={column.key}
                      data-label={label(column.label)}
                      className={`px-4 py-3 ${column.numeric ? 'text-right font-medium' : ''}`}
                    >
                      {String((row as Record<string, unknown>)[column.key] ?? '—')}
                    </td>
                  ))}
                  <td data-label={isBn ? 'অ্যাকশন' : 'Action'} className="px-4 py-2 text-right">
                    <button type="button" onClick={() => deleteRow(row)} aria-label={isBn ? 'মুছুন' : 'Delete'} className="rounded-md p-2 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={config.columns.length + 2} className="px-4 py-10 text-center text-[#5F6B7A]">
                    {isBn ? 'কোনো সংরক্ষিত রেকর্ড নেই।' : 'No saved records.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};
