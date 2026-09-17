import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  FileCheck2,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { Language } from '../types';
import { ALL_TAX_CATEGORIES, formatBDT } from '../data/mockTaxData';
import {
  AIT_ON_CAR_SUMMARY,
  CARRY_FORWARD_DETAILS,
  ENVIRONMENTAL_DECLARED_AMOUNT,
  LedgerRecord,
  SALARY_IBAS_DETAILS,
  SYNC_CANDIDATES,
  TABLE_CONFIGS,
} from '../data/ledgerRecords';
import { SourceBadge, StatusChip } from './StatusChip';
import { LedgerTable } from './LedgerTable';
import { RecordFormModal } from './RecordFormModal';
import { SyncRecordsModal } from './SyncRecordsModal';

interface CategoryWorkspaceProps {
  categoryId: string;
  lang: Language;
  onBack: () => void;
  onUnavailableAction: (message: string) => void;
}

const descriptionFor = (id: string, lang: Language) => {
  const descriptions: Record<string, [string, string]> = {
    'salary-ibas': ['Claim salary TDS made available through the existing iBAS++ flow.', 'বিদ্যমান iBAS++ ফ্লো থেকে প্রাপ্ত বেতন উৎস কর দাবি করুন।'],
    'salary-other': ['Manage salary TDS records outside the iBAS++ salary flow.', 'iBAS++ বেতন ফ্লোর বাইরে বেতন উৎস কর রেকর্ড পরিচালনা করুন।'],
    'bank-fi': ['Review Bank/FI interest or profit TDS linked with eReturn Income.', 'eReturn Income-এর সাথে সংযুক্ত ব্যাংক/এফআই সুদ বা মুনাফার উৎস কর পর্যালোচনা করুন।'],
    dividend: ['Review dividend TDS under the current Ledger Section 117 flow.', 'বর্তমান লেজার ধারা ১১৭ ফ্লো অনুযায়ী লভ্যাংশ উৎস কর পর্যালোচনা করুন।'],
    'service-payment': ['Manage service-payment TDS under the current Section 90 flow.', 'বর্তমান ধারা ৯০ ফ্লো অনুযায়ী সেবা পেমেন্ট উৎস কর পরিচালনা করুন।'],
    sanchayapatra: ['Review system-provided Sanchayapatra TDS records and verification status.', 'সিস্টেম প্রদত্ত সঞ্চয়পত্র উৎস কর রেকর্ড ও যাচাই অবস্থা দেখুন।'],
    import: ['Review Import (120) TDS details supplied by the current Ledger data source.', 'বর্তমান লেজার ডেটা সোর্সের Import (120) উৎস কর তথ্য পর্যালোচনা করুন।'],
    'commercial-vehicle': ['Find and manage commercial vehicle TDS records using the current lookup pattern.', 'বর্তমান অনুসন্ধান ফ্লো ব্যবহার করে বাণিজ্যিক যানবাহনের উৎস কর রেকর্ড পরিচালনা করুন।'],
    'other-tds': ['Manage other source-tax entries supported by the current Ledger.', 'বর্তমান লেজারে সমর্থিত অন্যান্য উৎস কর এন্ট্রি পরিচালনা করুন।'],
    'ait-car': ['Review advance income tax on vehicle records.', 'যানবাহনের অগ্রিম আয়কর রেকর্ড পর্যালোচনা করুন।'],
    'ait-154': ['Find AIT records using the current Section 154 challan workflow.', 'বর্তমান ধারা ১৫৪ চালান ফ্লো ব্যবহার করে AIT রেকর্ড খুঁজুন।'],
    'tax-paid-return': ['Find regular tax payments made with return under Section 173.', 'ধারা ১৭৩ অনুযায়ী রিটার্নের সাথে প্রদত্ত নিয়মিত কর পেমেন্ট খুঁজুন।'],
    'environmental-surcharge': ['Manage environmental surcharge payment records and reconcile them with the declared amount.', 'পরিবেশ সারচার্জ পেমেন্ট রেকর্ড ও ঘোষিত পরিমাণ সমন্বয় করুন।'],
    'tax-refund': ['Claim eligible refund adjustment from a previous assessment year.', 'পূর্ববর্তী করবর্ষের যোগ্য কর রিফান্ড সমন্বয় দাবি করুন।'],
    'carry-forward': ['Review the current carry-forward tax claim under Section 163.', 'ধারা ১৬৩ অনুযায়ী বর্তমান জের টানা কর দাবি পর্যালোচনা করুন।'],
  };
  return descriptions[id]?.[lang === 'bn' ? 1 : 0] || '';
};

const PageHeader: React.FC<{
  name: string;
  code?: string;
  categoryId: string;
  lang: Language;
  onBack: () => void;
}> = ({ name, code, categoryId, lang, onBack }) => {
  const category = ALL_TAX_CATEGORIES.find((item) => item.id === categoryId);
  if (!category) return null;
  return (
    <div className="min-w-0">
      <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1.5 rounded text-xs font-semibold text-[#0B6FA4] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30">
        <ArrowLeft className="h-3.5 w-3.5" />
        {lang === 'bn' ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}
      </button>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <SourceBadge source={category.source} size="sm" lang={lang} />
        <StatusChip status={category.status} size="sm" lang={lang} />
      </div>
      <h1 id="category-page-title" className="text-2xl font-bold tracking-tight text-[#172033] lg:text-[28px]">{name}</h1>
      {code && <p className="mt-1 text-xs font-semibold text-[#0B6FA4]">{code}</p>}
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5F6B7A]">{descriptionFor(categoryId, lang)}</p>
    </div>
  );
};

export const CategoryWorkspace: React.FC<CategoryWorkspaceProps> = ({ categoryId, lang, onBack, onUnavailableAction }) => {
  const category = ALL_TAX_CATEGORIES.find((item) => item.id === categoryId);
  const config = TABLE_CONFIGS[categoryId];
  const [records, setRecords] = useState<LedgerRecord[]>(config?.records ?? []);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LedgerRecord | null>(null);
  const [syncOpen, setSyncOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LedgerRecord | null>(null);
  const [lookup, setLookup] = useState('');
  const [lookupResult, setLookupResult] = useState<LedgerRecord | null | undefined>(undefined);
  const [salaryClaim, setSalaryClaim] = useState(SALARY_IBAS_DETAILS.initialClaim);
  const [carryClaimed, setCarryClaimed] = useState(CARRY_FORWARD_DETAILS.claimed);

  useEffect(() => {
    setRecords(config?.records ?? []);
    setFormOpen(false);
    setEditingRecord(null);
    setSyncOpen(false);
    setDeleteTarget(null);
    setLookup('');
    setLookupResult(undefined);
    setSalaryClaim(SALARY_IBAS_DETAILS.initialClaim);
    setCarryClaimed(CARRY_FORWARD_DETAILS.claimed);
  }, [categoryId, config]);

  const total = useMemo(() => {
    if (!config?.totalKey) return null;
    return records.reduce((sum, record) => sum + (typeof record[config.totalKey!] === 'number' ? Number(record[config.totalKey!]) : 0), 0);
  }, [config, records]);

  if (!category) return null;

  const saveRecord = (record: LedgerRecord) => {
    setRecords((current) => {
      const exists = current.some((item) => item.id === record.id);
      return exists ? current.map((item) => item.id === record.id ? record : item) : [...current, record];
    });
    setFormOpen(false);
    setEditingRecord(null);
    onUnavailableAction(lang === 'bn' ? 'রেকর্ডটি এই রিডিজাইন প্রোটোটাইপে সংরক্ষিত হয়েছে।' : 'Record saved in this redesign prototype.');
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRecords((current) => current.filter((record) => record.id !== deleteTarget.id));
    setDeleteTarget(null);
    onUnavailableAction(lang === 'bn' ? 'রেকর্ডটি এই রিডিজাইন প্রোটোটাইপ থেকে সরানো হয়েছে।' : 'Record removed from this redesign prototype.');
  };

  const runLookup = () => {
    if (!config?.lookupKeys || !lookup.trim()) {
      setLookupResult(null);
      return;
    }
    const term = lookup.trim().toLowerCase();
    const found = config.records.find((record) => config.lookupKeys!.some((key) => String(record[key] ?? '').toLowerCase() === term));
    setLookupResult(found ?? null);
  };

  if (categoryId === 'salary-ibas') {
    const validClaim = salaryClaim >= 0 && salaryClaim <= SALARY_IBAS_DETAILS.tdsAvailable;
    return (
      <section className="space-y-5" aria-labelledby="category-page-title">
        <PageHeader name="Salary (iBAS++) TDS" categoryId={categoryId} lang={lang} onBack={onBack} />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <div className="mb-5 flex items-center gap-2"><Database className="h-4 w-4 text-[#0B6FA4]" /><h2 className="font-bold text-slate-900">Employment information</h2></div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs font-semibold text-slate-500">Assessment Year</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{SALARY_IBAS_DETAILS.assessmentYear}</dd></div>
              <div><dt className="text-xs font-semibold text-slate-500">Office Name</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{SALARY_IBAS_DETAILS.officeName}</dd></div>
              <div><dt className="text-xs font-semibold text-slate-500">Designation</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{SALARY_IBAS_DETAILS.designation}</dd></div>
              <div><dt className="text-xs font-semibold text-slate-500">Data Source</dt><dd className="mt-1"><SourceBadge source="iBAS++" size="sm" lang={lang} /></dd></div>
            </dl>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">TDS Available</p>
            <p className="mt-2 text-3xl font-bold text-[#0B6FA4]">{formatBDT(SALARY_IBAS_DETAILS.tdsAvailable)}</p>
            <p className="mt-2 text-xs text-slate-500">System-provided amount for the current assessment year.</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <label className="block max-w-xl">
            <span className="text-sm font-bold text-slate-800">TDS Claim</span>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input type="number" min="0" max={SALARY_IBAS_DETAILS.tdsAvailable} value={salaryClaim} onChange={(event) => setSalaryClaim(Number(event.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-right text-sm font-semibold tabular-nums outline-none focus:border-[#0B6FA4] focus:ring-2 focus:ring-[#0B6FA4]/15" />
              <button type="button" disabled={!validClaim} onClick={() => onUnavailableAction(lang === 'bn' ? 'iBAS++ দাবি এই রিডিজাইন প্রোটোটাইপে সংরক্ষিত হয়েছে।' : 'iBAS++ claim saved in this redesign prototype.')} className="rounded-lg bg-[#0B6FA4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#095782] disabled:cursor-not-allowed disabled:opacity-50">Save Claim</button>
            </div>
            {!validClaim && <span className="mt-1.5 block text-xs font-medium text-red-600">Claim must be between 0 and {SALARY_IBAS_DETAILS.tdsAvailable.toLocaleString('en-IN')}.</span>}
          </label>
        </div>
      </section>
    );
  }

  if (categoryId === 'carry-forward') {
    return (
      <section className="space-y-5" aria-labelledby="category-page-title">
        <PageHeader name={category.name} code={category.code} categoryId={categoryId} lang={lang} onBack={onBack} />
        {carryClaimed ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-900">Carry-forward tax credit</h2><span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Claimed</span></div>
                <p className="mt-3 text-3xl font-bold text-[#0B6FA4]">{formatBDT(CARRY_FORWARD_DETAILS.amount)}</p>
                <p className="mt-2 text-xs text-slate-500">Current claimed amount shown in the supplied Ledger state.</p>
              </div>
              <button type="button" onClick={() => setCarryClaimed(false)} className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" />Remove Claim</button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <FileCheck2 className="mx-auto h-8 w-8 text-slate-400" />
            <h2 className="mt-3 font-bold text-slate-900">No carry-forward claim in this prototype</h2>
            <p className="mt-1 text-sm text-slate-500">Reconnect the production claim workflow to create a new claim.</p>
          </div>
        )}
      </section>
    );
  }

  if (categoryId === 'ait-car') {
    return (
      <section className="space-y-5" aria-labelledby="category-page-title">
        <PageHeader name={category.name} categoryId={categoryId} lang={lang} onBack={onBack} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">AIT Group Difference</p><p className="mt-2 text-3xl font-bold text-[#0B6FA4]">{formatBDT(AIT_ON_CAR_SUMMARY.amount)}</p></div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5"><div className="flex items-start gap-2.5"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /><p className="text-sm leading-relaxed text-amber-900">{AIT_ON_CAR_SUMMARY.note}</p></div></div>
        </div>
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Database className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="mt-3 font-bold text-slate-900">AIT on Car table is integration-ready</h2>
          <p className="mx-auto mt-1 max-w-2xl text-sm text-slate-500">The row-level columns and records were not visible in the supplied current-state screenshots, so they have not been invented. The shared Ledger table component is ready once the current production contract is supplied.</p>
        </div>
      </section>
    );
  }

  if (!config) return null;

  const sourceLabel = category.source;
  const isLookupPage = Boolean(config.lookupLabel);
  const foundAlreadyAdded = lookupResult ? records.some((record) => record.id === lookupResult.id) : false;
  const environmentalDifference = categoryId === 'environmental-surcharge' && total !== null ? ENVIRONMENTAL_DECLARED_AMOUNT - total : null;

  return (
    <section className="space-y-5" aria-labelledby="category-page-title">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader name={config.title} code={category.code} categoryId={categoryId} lang={lang} onBack={onBack} />
        <div className="flex flex-wrap gap-2 lg:pt-7">
          {config.canSync && (
            <button type="button" onClick={() => setSyncOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#095782] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"><RefreshCw className="h-4 w-4" />Sync from Income</button>
          )}
          {config.canAdd && (
            <button type="button" onClick={() => { setEditingRecord(null); setFormOpen(true); }} className="inline-flex items-center gap-2 rounded-lg border border-[#0B6FA4] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B6FA4] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30"><Plus className="h-4 w-4" />Add Entry</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Records</p><p className="mt-1 text-2xl font-bold text-slate-900">{records.length}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Source</p><p className="mt-2"><SourceBadge source={sourceLabel} size="sm" lang={lang} /></p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{config.totalLabel ?? 'Screen Total'}</p><p className="mt-1 text-2xl font-bold text-[#0B6FA4]">{total === null ? category.formattedAmount : formatBDT(total)}</p></div>
      </div>

      {isLookupPage && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <label className="block flex-1">
              <span className="text-sm font-bold text-slate-800">{config.lookupLabel}</span>
              <input value={lookup} onChange={(event) => { setLookup(event.target.value); setLookupResult(undefined); }} placeholder={config.lookupPlaceholder} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#0B6FA4] focus:ring-2 focus:ring-[#0B6FA4]/15" />
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setLookup(''); setLookupResult(undefined); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"><RotateCcw className="h-4 w-4" />Reset</button>
              <button type="button" onClick={runLookup} className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#095782]"><Search className="h-4 w-4" />Search</button>
            </div>
          </div>

          {lookupResult === null && <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">No matching record was found in the currently supplied Ledger dataset.</div>}
          {lookupResult && (
            <div className="mt-4 flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-sm font-bold text-emerald-900">Record found</p><p className="mt-0.5 text-xs text-emerald-800">{config.lookupKeys?.map((key) => String(lookupResult[key] ?? '')).filter(Boolean).join(' · ')}</p></div>
              {foundAlreadyAdded ? <span className="text-xs font-bold text-emerald-700">Already in Ledger</span> : <button type="button" onClick={() => { setRecords((current) => [...current, lookupResult]); setLookupResult(undefined); setLookup(''); }} className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800">Add to Ledger</button>}
            </div>
          )}
        </div>
      )}

      {categoryId === 'environmental-surcharge' && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase text-slate-500">Declared by Assessee</p><p className="mt-1 text-xl font-bold text-slate-900">{formatBDT(ENVIRONMENTAL_DECLARED_AMOUNT)}</p></div>
          <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase text-slate-500">Payments Recorded</p><p className="mt-1 text-xl font-bold text-slate-900">{formatBDT(total ?? 0)}</p></div>
          <div className={`rounded-xl border p-4 ${environmentalDifference === 0 ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}><p className="text-xs font-bold uppercase text-slate-500">Difference</p><p className={`mt-1 text-xl font-bold ${environmentalDifference === 0 ? 'text-emerald-700' : 'text-amber-800'}`}>{formatBDT(Math.abs(environmentalDifference ?? 0))}</p><p className="mt-1 text-xs font-semibold">{environmentalDifference === 0 ? 'Matched' : 'Needs review'}</p></div>
        </div>
      )}

      {config.subtitle && <p className="text-sm font-semibold italic text-[#0B6FA4]">{config.subtitle}</p>}

      <LedgerTable
        columns={config.columns}
        records={records}
        canEdit={config.canEdit}
        canDelete={config.canDelete}
        onEdit={(record) => { setEditingRecord(record); setFormOpen(true); }}
        onDelete={setDeleteTarget}
        searchPlaceholder={`Search ${config.title.toLowerCase()}...`}
      />

      {config.readOnly && (
        <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs leading-relaxed text-slate-700"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0B6FA4]" /><span>These records are presented as system-sourced/read-only in the supplied current-state flow.</span></div>
      )}

      {categoryId === 'environmental-surcharge' && (
        <div className="flex justify-end"><button type="button" onClick={() => onUnavailableAction('Environmental surcharge changes saved in this redesign prototype.')} className="rounded-lg bg-[#0B6FA4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#095782]">Save</button></div>
      )}

      <RecordFormModal isOpen={formOpen} title={config.title} columns={config.columns} record={editingRecord} onClose={() => { setFormOpen(false); setEditingRecord(null); }} onSave={saveRecord} />

      <SyncRecordsModal
        isOpen={syncOpen}
        title={config.title}
        columns={config.columns}
        candidates={SYNC_CANDIDATES[categoryId] ?? []}
        existingRecords={records}
        onClose={() => setSyncOpen(false)}
        onSync={(selected) => {
          setRecords((current) => [...current, ...selected.filter((candidate) => !current.some((item) => item.id === candidate.id))]);
          setSyncOpen(false);
          onUnavailableAction(`${selected.length} record${selected.length === 1 ? '' : 's'} synced into this redesign prototype.`);
        }}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="delete-record-title" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600"><Trash2 className="h-5 w-5" /></div>
            <h2 id="delete-record-title" className="mt-4 text-lg font-bold text-slate-900">Delete this tax record?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">This removes the record from the current redesign prototype. Production deletion rules and API validation remain unchanged.</p>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDeleteTarget(null)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button><button type="button" onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Delete</button></div>
          </div>
        </div>
      )}
    </section>
  );
};
