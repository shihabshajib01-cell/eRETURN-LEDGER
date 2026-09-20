import React, { useEffect, useMemo, useState } from 'react';
import { Check, Edit2, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { Language } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { parseMoney } from '../utils/money';
import { fetchIncomeSyncRecords } from '../services/eReturnIncomeSync';

type SanchayRow = {
  id: number;
  scheme: string;
  registration: string;
  date: string;
  value: string;
  available: string;
  claim: string;
  status: string;
};

const SOURCE_ROWS: SanchayRow[] = [
  { id: 1, scheme: 'Poribar Sanchayapatra', registration: '2021-0023507', date: '07-01-2021', value: '16,00,000', available: '10,752', claim: '10,752', status: 'Verified' },
  { id: 2, scheme: 'Poribar Sanchayapatra', registration: '2021-0486873', date: '27-05-2021', value: '1,00,000', available: '1,056', claim: '1,056', status: 'Verified' },
  { id: 3, scheme: 'Poribar Sanchayapatra', registration: '2021-1011941', date: '23-09-2021', value: '1,00,000', available: '950', claim: '950', status: 'Verified' },
  { id: 4, scheme: 'Poribar Sanchayapatra', registration: '2022-0441765', date: '04-04-2022', value: '2,00,000', available: '1,900', claim: '1,900', status: 'Verified' },
  { id: 5, scheme: 'Poribar Sanchayapatra', registration: '2022-0917245', date: '25-07-2022', value: '1,00,000', available: '950', claim: '950', status: 'Verified' },
  { id: 6, scheme: 'Poribar Sanchayapatra', registration: '2022-1242189', date: '19-10-2022', value: '1,00,000', available: '950', claim: '950', status: 'Verified' },
  { id: 7, scheme: 'Poribar Sanchayapatra', registration: '2023-0144432', date: '05-02-2023', value: '1,00,000', available: '950', claim: '950', status: 'Verified' },
  { id: 8, scheme: 'Poribar Sanchayapatra', registration: '2023-0438170', date: '07-05-2023', value: '1,00,000', available: '950', claim: '950', status: 'Verified' },
  { id: 9, scheme: 'Poribar Sanchayapatra', registration: '2023-0872614', date: '28-08-2023', value: '1,00,000', available: '950', claim: '950', status: 'Verified' },
  { id: 10, scheme: 'Poribar Sanchayapatra', registration: '2023-1177864', date: '22-11-2023', value: '1,00,000', available: '950', claim: '950', status: 'Verified' },
  { id: 11, scheme: 'Poribar Sanchayapatra', registration: '2024-0204923', date: '25-02-2024', value: '1,00,000', available: '950', claim: '950', status: 'Verified' },
  { id: 12, scheme: 'Poribar Sanchayapatra', registration: '2024-0430947', date: '09-05-2024', value: '1,00,000', available: '950', claim: '950', status: 'Verified' },
  { id: 13, scheme: 'Poribar Sanchayapatra', registration: '2025-0038731', date: '19-01-2025', value: '2,00,000', available: '2,474', claim: '2,474', status: 'Verified' },
  { id: 14, scheme: 'Poribar Sanchayapatra', registration: '2025-0293593', date: '24-03-2025', value: '9,00,000', available: '11,133', claim: '11,133', status: 'Verified' },
  { id: 15, scheme: 'Poribar Sanchayapatra', registration: '2025-0290852', date: '25-03-2025', value: '6,00,000', available: '7,422', claim: '7,422', status: 'Verified' },
  { id: 16, scheme: 'Poribar Sanchayapatra', registration: '2026-0019673', date: '12-01-2026', value: '9,00,000', available: '4,425', claim: '4,425', status: 'Verified' },
  { id: 17, scheme: 'Poribar Sanchayapatra', registration: '2026-0026431', date: '12-01-2026', value: '7,00,000', available: '3,477', claim: '3,477', status: 'Verified' },
];

export const SanchayapatraPage: React.FC<{
  lang: Language;
  onUnavailableAction: (message: string) => void;
}> = ({ lang, onUnavailableAction }) => {
  const isBn = lang === 'bn';
  const [rows, setRows] = usePersistentState<SanchayRow[]>('ereturn-ledger:v3:sanchayapatra-rows', SOURCE_ROWS);
  const [registration, setRegistration] = useState('');
  const [searchedRegistration, setSearchedRegistration] = useState('');
  const [searchResult, setSearchResult] = useState<SanchayRow | null>(null);
  const [syncOpen, setSyncOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [draftRows, setDraftRows] = useState<SanchayRow[]>(SOURCE_ROWS);
  const [syncLoading, setSyncLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingClaim, setEditingClaim] = useState('');
  const { updateCategoryAmount } = useLedgerRuntime();
  const syncDialogRef = useDialogFocusTrap(syncOpen, () => setSyncOpen(false));

  const totalClaim = useMemo(() => rows.reduce((sum, row) => sum + parseMoney(row.claim), 0), [rows]);

  useEffect(() => {
    updateCategoryAmount('sanchayapatra', totalClaim);
  }, [totalClaim, updateCategoryAmount]);

  const visibleRows = searchedRegistration
    ? rows.filter((row) => row.registration.toLowerCase() === searchedRegistration.toLowerCase())
    : rows;

  const search = () => {
    const value = registration.trim();
    setSearchedRegistration(value);
    if (!value) {
      setSearchResult(null);
      onUnavailableAction(isBn ? 'রেজিস্ট্রেশন নম্বর লিখুন।' : 'Enter a registration number.');
      return;
    }
    const found = SOURCE_ROWS.find((row) => row.registration.toLowerCase() === value.toLowerCase()) ?? null;
    setSearchResult(found);
    if (!found) {
      onUnavailableAction(isBn ? 'এই রেজিস্ট্রেশন নম্বরে কোনো তথ্য পাওয়া যায়নি।' : 'Data not found for this registration number.');
    }
  };

  const reset = () => {
    setRegistration('');
    setSearchedRegistration('');
    setSearchResult(null);
  };

  const saveSearchResult = () => {
    if (!searchResult) return;
    setRows((current) => {
      const exists = current.some((row) => row.registration === searchResult.registration);
      return exists ? current : [...current, searchResult].sort((a, b) => a.id - b.id);
    });
    onUnavailableAction(isBn ? 'সঞ্চয়পত্রের তথ্য লেজারে সংরক্ষিত হয়েছে।' : 'Sanchayapatra record saved to Ledger.');
  };

  const openSync = async () => {
    setSyncLoading(true);
    try {
      const sourceRows = await fetchIncomeSyncRecords<SanchayRow>('sanchayapatra', SOURCE_ROWS);
      setDraftRows(sourceRows);
      setSelectedIds(sourceRows.map((row) => row.id));
      setSyncOpen(true);
      if (sourceRows.length === 0) {
        onUnavailableAction(
          isBn
            ? 'Income > Financial Asset-এ Sanchayapatra তথ্য নেই, তাই সিঙ্ক করার মতো কোনো রেকর্ড পাওয়া যায়নি।'
            : 'No Sanchayapatra records are available to sync because the related Income > Financial Asset data is not available.'
        );
      }
    } catch {
      onUnavailableAction(isBn ? 'Income থেকে Sanchayapatra তথ্য আনা যায়নি। পরে আবার চেষ্টা করুন।' : 'Sanchayapatra Income data could not be loaded. Please try again.');
    } finally {
      setSyncLoading(false);
    }
  };

  const updateDraftClaim = (id: number, value: string) => {
    setDraftRows((current) => current.map((row) => row.id === id ? { ...row, claim: value } : row));
  };

  const saveSync = () => {
    const invalid = draftRows.some((row) =>
      selectedIds.includes(row.id) && parseMoney(row.claim) > parseMoney(row.available)
    );
    if (invalid) {
      onUnavailableAction(isBn ? 'TDS দাবি উপলভ্য TDS-এর বেশি হতে পারবে না।' : 'TDS Claim cannot exceed TDS Available.');
      return;
    }
    const selectedRows = draftRows.filter((row) => selectedIds.includes(row.id));
    setRows((current) => {
      const map = new Map(current.map((row) => [row.id, row]));
      selectedRows.forEach((row) => map.set(row.id, row));
      return Array.from(map.values()).sort((a, b) => a.id - b.id);
    });
    setSyncOpen(false);
    setSelectedIds([]);
    onUnavailableAction(isBn ? 'সঞ্চয়পত্রের নির্বাচিত তথ্য সংরক্ষিত হয়েছে।' : 'Selected Sanchayapatra records saved.');
  };

  const startEdit = (row: SanchayRow) => {
    setEditingId(row.id);
    setEditingClaim(row.claim);
  };

  const saveEdit = (row: SanchayRow) => {
    if (parseMoney(editingClaim) > parseMoney(row.available)) {
      onUnavailableAction(isBn ? 'TDS দাবি উপলভ্য TDS-এর বেশি হতে পারবে না।' : 'TDS Claim cannot exceed TDS Available.');
      return;
    }
    setRows((current) => current.map((item) => item.id === row.id ? { ...item, claim: editingClaim } : item));
    setEditingId(null);
    setEditingClaim('');
  };

  const removeRow = (id: number) => {
    if (window.confirm(isBn ? 'এই রেকর্ডটি মুছে ফেলবেন?' : 'Delete this record?')) {
      setRows((current) => current.filter((row) => row.id !== id));
    }
  };

  return (
    <section className="w-full space-y-4" aria-labelledby="sanchayapatra-title">
      <header>
        <h1 id="sanchayapatra-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
          {isBn ? 'সঞ্চয়পত্র' : 'Sanchayapatra'}
        </h1>
      </header>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="sanchay-registration" className="mb-1.5 block text-sm font-semibold text-[#172033]">
              {isBn ? 'রেজিস্ট্রেশন নম্বর' : 'Registration Number'}
            </label>
            <input
              id="sanchay-registration"
              value={registration}
              onChange={(event) => setRegistration(event.target.value)}
              placeholder={isBn ? 'রেজিস্ট্রেশন নম্বর লিখুন' : 'Enter Registration Number'}
              className="w-full rounded-lg border border-[#C8D4E1] bg-white px-3 py-2.5 text-sm focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20"
            />
          </div>
          <button type="button" onClick={() => void openSync()} disabled={syncLoading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#149DB2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#108A9D] disabled:cursor-not-allowed disabled:opacity-50">
            <RefreshCw className="h-4 w-4" />
            {syncLoading ? (isBn ? 'সিঙ্ক হচ্ছে...' : 'Syncing...') : (isBn ? 'Income থেকে সিঙ্ক' : 'Sync From Income')}
          </button>
          <button type="button" onClick={reset} className="rounded-lg border border-[#C8D4E1] bg-white px-4 py-2.5 text-sm font-semibold text-[#263247] hover:bg-slate-50">
            {isBn ? 'রিসেট' : 'Reset'}
          </button>
          <button type="button" onClick={search} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A]">
            <Search className="h-4 w-4" />
            {isBn ? 'অনুসন্ধান' : 'Search'}
          </button>
        </div>
      </section>

      {searchResult && (
        <section className="rounded-xl border border-[#D7E8F2] bg-[#F5FAFD] p-4" aria-live="polite">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <div><p className="text-xs font-semibold text-[#5F6B7A]">{isBn ? 'স্কিমের নাম' : 'Name of Scheme'}</p><p className="mt-1 text-sm font-medium">{searchResult.scheme}</p></div>
            <div><p className="text-xs font-semibold text-[#5F6B7A]">{isBn ? 'রেজিস্ট্রেশন নং' : 'Registration No.'}</p><p className="mt-1 text-sm font-medium">{searchResult.registration}</p></div>
            <div><p className="text-xs font-semibold text-[#5F6B7A]">{isBn ? 'ইস্যুর তারিখ' : 'Issue Date'}</p><p className="mt-1 text-sm font-medium">{searchResult.date}</p></div>
            <div><p className="text-xs font-semibold text-[#5F6B7A]">{isBn ? 'মূল্য' : 'Value'}</p><p className="mt-1 text-sm font-medium">{searchResult.value}</p></div>
            <div><p className="text-xs font-semibold text-[#5F6B7A]">{isBn ? 'TDS উপলভ্য' : 'TDS Available'}</p><p className="mt-1 text-sm font-semibold">{searchResult.available}</p></div>
            <div><p className="text-xs font-semibold text-[#5F6B7A]">{isBn ? 'TDS দাবি' : 'TDS Claim'}</p><p className="mt-1 text-sm font-semibold">{searchResult.claim}</p></div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={saveSearchResult} className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#095D8A]">
              <Check className="h-4 w-4" />
              {isBn ? 'সংরক্ষণ' : 'Save'}
            </button>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="overflow-x-auto">
          <table className="ledger-responsive-table w-full min-w-[980px] text-sm">
            <thead className="bg-slate-50 text-[#5F6B7A]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">SL.</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'স্কিমের নাম' : 'Name of Scheme'}</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'রেজিস্ট্রেশন নং' : 'Registration No.'}</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'ইস্যুর তারিখ' : 'Issue Date'}</th>
                <th className="px-4 py-3 text-right font-semibold">{isBn ? 'মূল্য' : 'Value'}</th>
                <th className="px-4 py-3 text-right font-semibold">{isBn ? 'TDS দাবি' : 'TDS Claim'}</th>
                <th className="px-4 py-3 text-left font-semibold">{isBn ? 'অবস্থা' : 'Status'}</th>
                <th className="px-4 py-3 text-right font-semibold">{isBn ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRows.map((row, index) => (
                <tr key={row.id}>
                  <td data-label="SL." className="px-4 py-3">{index + 1}</td>
                  <td data-label={isBn ? 'স্কিমের নাম' : 'Name of Scheme'} className="px-4 py-3">{row.scheme}</td>
                  <td data-label={isBn ? 'রেজিস্ট্রেশন নং' : 'Registration No.'} className="px-4 py-3">{row.registration}</td>
                  <td data-label={isBn ? 'ইস্যুর তারিখ' : 'Issue Date'} className="px-4 py-3">{row.date}</td>
                  <td data-label={isBn ? 'মূল্য' : 'Value'} className="px-4 py-3 text-right">{row.value}</td>
                  <td data-label={isBn ? 'TDS দাবি' : 'TDS Claim'} className="px-4 py-3 text-right">
                    {editingId === row.id ? (
                      <input
                        autoFocus
                        value={editingClaim}
                        onChange={(event) => setEditingClaim(event.target.value)}
                        inputMode="decimal"
                        className="w-28 rounded-md border border-[#9BC8DE] px-2 py-1.5 text-right"
                      />
                    ) : row.claim}
                  </td>
                  <td data-label={isBn ? 'অবস্থা' : 'Status'} className="px-4 py-3">{isBn && row.status === 'Verified' ? 'যাচাইকৃত' : row.status}</td>
                  <td data-label={isBn ? 'অ্যাকশন' : 'Action'} className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      {editingId === row.id ? (
                        <>
                          <button type="button" onClick={() => saveEdit(row)} aria-label={isBn ? 'সংরক্ষণ' : 'Save'} className="rounded-md bg-emerald-600 p-2 text-white hover:bg-emerald-700"><Check className="h-4 w-4" /></button>
                          <button type="button" onClick={() => setEditingId(null)} aria-label={isBn ? 'বাতিল' : 'Cancel'} className="rounded-md border border-slate-300 bg-white p-2 text-slate-600"><X className="h-4 w-4" /></button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => startEdit(row)} aria-label={isBn ? 'সম্পাদনা' : 'Edit'} className="rounded-md p-2 text-[#0B6FA4] hover:bg-blue-50"><Edit2 className="h-4 w-4" /></button>
                          <button type="button" onClick={() => removeRow(row.id)} aria-label={isBn ? 'মুছুন' : 'Delete'} className="rounded-md p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-[#5F6B7A]">{isBn ? 'কোনো তথ্য পাওয়া যায়নি।' : 'No records found.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {syncOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div ref={syncDialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="sanchay-sync-title" className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 id="sanchay-sync-title" className="font-bold text-[#172033]">{isBn ? 'Income থেকে সঞ্চয়পত্র সিঙ্ক' : 'Sync Sanchayapatra From Income'}</h2>
                <p className="mt-1 text-xs text-[#5F6B7A]">{isBn ? 'যৌথ সঞ্চয়পত্র হলে শুধু নিজের অংশের TDS দাবি লিখুন।' : 'For joint holding, enter only your applicable portion as TDS Claim.'}</p>
              </div>
              <button type="button" onClick={() => setSyncOpen(false)} aria-label={isBn ? 'বন্ধ করুন' : 'Close'} className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="overflow-auto">
              <table className="ledger-responsive-table w-full min-w-[1000px] text-sm">
                <thead className="bg-slate-50 text-[#5F6B7A]">
                  <tr>
                    <th className="px-4 py-3 text-left">{isBn ? 'নির্বাচন' : 'Select'}</th>
                    <th className="px-4 py-3 text-left">{isBn ? 'স্কিমের নাম' : 'Name of Scheme'}</th>
                    <th className="px-4 py-3 text-left">{isBn ? 'রেজিস্ট্রেশন নং' : 'Registration No.'}</th>
                    <th className="px-4 py-3 text-left">{isBn ? 'ইস্যুর তারিখ' : 'Issue Date'}</th>
                    <th className="px-4 py-3 text-right">{isBn ? 'মূল্য' : 'Value'}</th>
                    <th className="px-4 py-3 text-right">{isBn ? 'TDS উপলভ্য' : 'TDS Available'}</th>
                    <th className="px-4 py-3 text-right">{isBn ? 'TDS দাবি' : 'TDS Claim'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {draftRows.map((row) => {
                    const selected = selectedIds.includes(row.id);
                    const invalid = parseMoney(row.claim) > parseMoney(row.available);
                    return (
                      <tr key={row.id}>
                        <td data-label={isBn ? "নির্বাচন" : "Select"} className="px-4 py-3">
                          <input type="checkbox" checked={selected} onChange={() => setSelectedIds((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id])} />
                        </td>
                        <td data-label={isBn ? "স্কিমের নাম" : "Name of Scheme"} className="px-4 py-3">{row.scheme}</td>
                        <td data-label={isBn ? "রেজিস্ট্রেশন নং" : "Registration No."} className="px-4 py-3">{row.registration}</td>
                        <td data-label={isBn ? "ইস্যুর তারিখ" : "Issue Date"} className="px-4 py-3">{row.date}</td>
                        <td data-label={isBn ? "মূল্য" : "Value"} className="px-4 py-3 text-right">{row.value}</td>
                        <td data-label={isBn ? "TDS উপলভ্য" : "TDS Available"} className="px-4 py-3 text-right font-semibold">{row.available}</td>
                        <td data-label={isBn ? "TDS দাবি" : "TDS Claim"} className="px-4 py-3">
                          <input
                            value={row.claim}
                            disabled={!selected}
                            onChange={(event) => updateDraftClaim(row.id, event.target.value)}
                            inputMode="decimal"
                            aria-invalid={invalid}
                            className={`w-full min-w-[120px] rounded-md border px-2.5 py-2 text-right disabled:bg-slate-100 ${invalid ? 'border-red-400' : 'border-[#C8D4E1]'}`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button type="button" onClick={() => setSyncOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">{isBn ? 'বাতিল' : 'Cancel'}</button>
              <button type="button" onClick={saveSync} disabled={selectedIds.length === 0} className="rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isBn ? 'সংরক্ষণ' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
