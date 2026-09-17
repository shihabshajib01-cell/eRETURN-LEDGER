import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, Edit2, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { Language } from '../types';
import { ALL_TAX_CATEGORIES } from '../data/mockTaxData';
import { SourceBadge, StatusChip } from './StatusChip';

type Row = Record<string, string | number> & { id: number };
type Column = { key: string; label: string; numeric?: boolean };

type CategoryConfig = {
  columns: Column[];
  rows: Row[];
  addable?: boolean;
  editable?: boolean;
  deletable?: boolean;
  syncable?: boolean;
  searchable?: boolean;
  summaryLabel?: string;
  summaryValue?: string;
};

const configs: Record<string, CategoryConfig> = {
  'salary-other': {
    addable: true, editable: true, deletable: true,
    summaryLabel: 'Total Claimed Amount', summaryValue: '৳ 36,36,074',
    columns: [
      { key: 'authority', label: 'Depositing Authority' },
      { key: 'documentType', label: 'Payment Document Type' },
      { key: 'reference', label: 'Challan / Certificate Reference No.' },
      { key: 'date', label: 'Date' },
      { key: 'amount', label: 'Certificate Amount', numeric: true },
      { key: 'claimed', label: 'Claimed Amount', numeric: true },
    ],
    rows: [
      { id: 1, authority: 'test', documentType: 'Certificate', reference: '123456', date: '04-09-2026', amount: '10,000', claimed: '1,000' },
      { id: 2, authority: 'test 2', documentType: 'Challan', reference: '2526-0003286477', date: '07-08-2025', amount: '32,73,823', claimed: '32,73,823' },
      { id: 3, authority: 'test 3', documentType: 'Challan', reference: '2526-0003264262', date: '06-08-2025', amount: '1,37,700', claimed: '1,37,700' },
      { id: 4, authority: 'test 4', documentType: 'Challan', reference: '2526-0003336839', date: '06-08-2025', amount: '3,529', claimed: '3,529' },
      { id: 5, authority: 'test 5', documentType: 'Certificate', reference: '11223344', date: '04-09-2026', amount: '2,20,022', claimed: '2,20,022' },
    ],
  },
  'bank-fi': {
    syncable: true,
    columns: [
      { key: 'bank', label: 'Bank Name' }, { key: 'accountType', label: 'Account Type' }, { key: 'branch', label: 'Branch Name' },
      { key: 'accountNumber', label: 'Account Number' }, { key: 'interest', label: 'Interest Amount', numeric: true }, { key: 'tds', label: 'TDS', numeric: true },
    ],
    rows: [
      { id: 1, bank: 'BRAC Bank PLC', accountType: 'DPS', branch: 'Karwan Bazar', accountNumber: '1111111', interest: '1,00,000', tds: '1,000' },
      { id: 2, bank: 'Dhaka Bank PLC', accountType: 'FDR / Term Deposit', branch: 'Karwan Bazar', accountNumber: '11111111', interest: '5,00,000', tds: '50,000' },
      { id: 3, bank: 'AB Bank PLC', accountType: 'Savings / SND / Others', branch: 'Karwan Bazar -3', accountNumber: '22222222', interest: '6,00,000', tds: '60,000' },
      { id: 4, bank: 'Dhaka Bank PLC', accountType: 'DPS', branch: 'Bandarban', accountNumber: '3333333', interest: '9,90,000', tds: '1,00,200' },
      { id: 5, bank: 'EXIM Bank PLC', accountType: 'FDR / Term Deposit', branch: 'Chuyadanga', accountNumber: '555555', interest: '1,00,02,004', tds: '1,00,200' },
    ],
  },
  dividend: {
    syncable: true, deletable: true,
    columns: [
      { key: 'authority', label: 'Depositing Authority / Person / Company' }, { key: 'reference', label: 'Certificate Reference No.' },
      { key: 'date', label: 'Reference Date' }, { key: 'amount', label: 'Certificate Amount', numeric: true }, { key: 'claimed', label: 'Claimed Amount', numeric: true },
    ],
    rows: [
      { id: 1, authority: 'Synesis IT PLC', reference: 'test-1', date: '01-09-2026', amount: '50,000', claimed: '50,000' },
      { id: 2, authority: 'Synesis IT PLC', reference: 'test-2', date: '04-09-2026', amount: '60,000', claimed: '60,000' },
      { id: 3, authority: 'Sinosis LPG', reference: 'test-3', date: '04-09-2026', amount: '22,022', claimed: '22,022' },
      { id: 4, authority: 'Syncronis', reference: 'test-4', date: '06-09-2026', amount: '44,003', claimed: '44,003' },
      { id: 5, authority: 'Syncromium', reference: 'test-5', date: '04-09-2026', amount: '34,302', claimed: '34,302' },
    ],
  },
  'service-payment': {
    syncable: true, addable: true, editable: true, deletable: true,
    columns: [
      { key: 'authority', label: 'Depositing Authority' }, { key: 'documentType', label: 'Payment Document Type' }, { key: 'reference', label: 'Reference No.' },
      { key: 'date', label: 'Date' }, { key: 'amount', label: 'Certificate Amount', numeric: true }, { key: 'claimed', label: 'Claimed Amount', numeric: true },
    ],
    rows: [
      { id: 1, authority: 'Plumber corp', documentType: 'Challan', reference: '2526-0002912865', date: '30-07-2025', amount: '70,000', claimed: '5,000' },
      { id: 2, authority: 'Doctor', documentType: 'Challan', reference: '2526-0002968652', date: '30-07-2025', amount: '10,000', claimed: '5,000' },
      { id: 3, authority: 'Lawyer', documentType: 'Challan', reference: '2526-0003205455', date: '03-08-2025', amount: '16,778', claimed: '10,000' },
      { id: 4, authority: 'Engineer', documentType: 'Challan', reference: '2526-0003734605', date: '07-08-2025', amount: '26,05,887', claimed: '5,000' },
      { id: 5, authority: 'Astronaut', documentType: 'Challan', reference: '2526-0003810112', date: '11-08-2025', amount: '75,77,604', claimed: '3,000' },
      { id: 6, authority: 'Mail Man', documentType: 'Certificate', reference: 'ref-1', date: '30-09-2026', amount: '10,000', claimed: '10,000' },
    ],
  },
  sanchayapatra: {
    columns: [
      { key: 'scheme', label: 'Name of Scheme' }, { key: 'registration', label: 'Registration No.' }, { key: 'date', label: 'Issue Date' },
      { key: 'value', label: 'Value', numeric: true }, { key: 'tds', label: 'TDS Claim', numeric: true }, { key: 'status', label: 'Status' },
    ],
    rows: [
      { id: 1, scheme: 'Poribar Sanchayapatra', registration: '2021-0023507', date: '07-01-2021', value: '16,00,000', tds: '10,752', status: 'Verified' },
      { id: 2, scheme: 'Poribar Sanchayapatra', registration: '2021-0486873', date: '27-05-2021', value: '1,00,000', tds: '1,056', status: 'Verified' },
      { id: 3, scheme: 'Poribar Sanchayapatra', registration: '2021-1011941', date: '23-09-2021', value: '1,00,000', tds: '950', status: 'Verified' },
      { id: 4, scheme: 'Poribar Sanchayapatra', registration: '2022-0441765', date: '04-04-2022', value: '2,00,000', tds: '1,900', status: 'Verified' },
      { id: 5, scheme: 'Poribar Sanchayapatra', registration: '2025-0293593', date: '24-03-2025', value: '9,00,000', tds: '11,133', status: 'Verified' },
    ],
  },
  import: {
    summaryLabel: 'Total TDS Claimed', summaryValue: '৳ 18,12,218',
    columns: [
      { key: 'bin', label: 'BIN' }, { key: 'office', label: 'Office Code' }, { key: 'bill', label: 'Bill of Entry' }, { key: 'billDate', label: 'Bill of Entry Date' },
      { key: 'receipt', label: 'Receipt No.' }, { key: 'receiptDate', label: 'Receipt Date' }, { key: 'invoice', label: 'Invoice Value', numeric: true },
      { key: 'assessable', label: 'Assessable Value', numeric: true }, { key: 'duties', label: 'Total Tax & Duties', numeric: true }, { key: 'claimed', label: 'TDS Claimed', numeric: true },
    ],
    rows: [
      { id: 1, bin: '004905634-0503', office: '301', bill: '1629442', billDate: '01-09-2025', receipt: '1694061', receiptDate: '02-09-2025', invoice: '39,75,049', assessable: '40,54,550', duties: '25,10,891', claimed: '2,02,727' },
      { id: 2, bin: '004905634-0503', office: '101', bill: '939642', billDate: '22-09-2025', receipt: '968764', receiptDate: '23-09-2025', invoice: '613', assessable: '626', duties: '431', claimed: '31' },
      { id: 3, bin: '004905634-0503', office: '301', bill: '1674032', billDate: '09-09-2025', receipt: '1768177', receiptDate: '15-09-2025', invoice: '31,08,500', assessable: '63,56,829', duties: '49,19,743', claimed: '3,17,841' },
      { id: 4, bin: '004905634-0503', office: '301', bill: '1776639', billDate: '28-09-2025', receipt: '1907828', receiptDate: '09-10-2025', invoice: '36,79,553', assessable: '64,63,299', duties: '49,94,297', claimed: '3,23,164' },
    ],
  },
  'commercial-vehicle': {
    searchable: true, deletable: true,
    columns: [ { key: 'registration', label: 'Registration No.' }, { key: 'uniqueKey', label: 'Unique Key' }, { key: 'chassis', label: 'Chassis No.' }, { key: 'tds', label: 'TDS Claim', numeric: true } ],
    rows: [
      { id: 1, registration: 'RANGPUR-KA-02-0113', uniqueKey: '2512231447911', chassis: 'EE96-0075355', tds: '25,000' },
      { id: 2, registration: 'DHAKA METRO-GA-45-0727', uniqueKey: '2509161060682', chassis: 'NZT260-3166542', tds: '25,000' },
      { id: 3, registration: 'DHAKA METRO-GA-28-4927', uniqueKey: '2508091268499', chassis: 'ZVW30-5744115', tds: '50,000' },
      { id: 4, registration: 'DHAKA METRO-KHA-12-0622', uniqueKey: '2602151294597', chassis: 'NZE120-0023924', tds: '25,000' },
    ],
  },
  'other-tds': {
    addable: true, editable: true, deletable: true, summaryLabel: 'Total Claimed Amount', summaryValue: '৳ 69,70,044',
    columns: [
      { key: 'purpose', label: 'Purpose of Payment' }, { key: 'authority', label: 'Depositing Authority' }, { key: 'documentType', label: 'Payment Document Type' },
      { key: 'reference', label: 'Reference No.' }, { key: 'date', label: 'Date' }, { key: 'amount', label: 'Certificate Amount', numeric: true }, { key: 'claimed', label: 'Claimed Amount', numeric: true },
    ],
    rows: [
      { id: 1, purpose: 'Acquisition of Property [Section-111]', authority: 'ref-auth', documentType: 'Certificate', reference: 'ref-3', date: '02-09-2026', amount: '5,000', claimed: '500' },
      { id: 2, purpose: 'Actor, Producer etc. [Section-93]', authority: 'FDC', documentType: 'Challan', reference: '2526-0058719534', date: '24-06-2026', amount: '8,221', claimed: '8,221' },
      { id: 3, purpose: 'Advertising Bill [Section-92]', authority: 'Advertise 1', documentType: 'Challan', reference: '2526-0027752927', date: '10-02-2026', amount: '33,16,209', claimed: '33,16,209' },
      { id: 4, purpose: 'Bangladesh Bank Bill [Section-107]', authority: 'BBB', documentType: 'Challan', reference: '2526-0000884175', date: '14-07-2025', amount: '32,77,127', claimed: '32,77,127' },
    ],
  },
  'ait-154': {
    searchable: true, deletable: true,
    columns: [
      { key: 'challan', label: 'Challan No.' }, { key: 'date', label: 'Date' }, { key: 'amount', label: 'Amount', numeric: true }, { key: 'mode', label: 'Payment Mode' },
      { key: 'bank', label: 'Bank' }, { key: 'branch', label: 'Branch' }, { key: 'zone', label: 'Zone' }, { key: 'circle', label: 'Circle' },
    ],
    rows: [
      { id: 1, challan: '2526-0003384438', date: '06-08-2025', amount: '37,085', mode: 'CASH', bank: 'IFIC BANK LTD.', branch: 'ISLAMIC BANKING', zone: 'TAXZONE-15,DHAKA', circle: 'CIRCLE-319' },
      { id: 2, challan: '2526-0003681361', date: '10-08-2025', amount: '77,280', mode: 'TRANSFER', bank: 'SONALI BANK LTD.', branch: 'MIRPUR CANTT., DHAKA', zone: 'TAXZONE-11,DHAKA', circle: 'CIRCLE-238' },
    ],
  },
  'tax-paid-return': {
    searchable: true, deletable: true,
    columns: [
      { key: 'challan', label: 'Challan No.' }, { key: 'date', label: 'Date' }, { key: 'amount', label: 'Amount', numeric: true }, { key: 'mode', label: 'Payment Mode' },
      { key: 'bank', label: 'Bank' }, { key: 'branch', label: 'Branch' }, { key: 'zone', label: 'Zone' }, { key: 'circle', label: 'Circle' },
    ],
    rows: [
      { id: 1, challan: '2526-0001951606', date: '23-07-2025', amount: '5,154', mode: 'CASH', bank: 'SONALI BANK LTD.', branch: 'Gopalganj', zone: 'TAXZONE-4,DHAKA', circle: 'N/A' },
      { id: 2, challan: '2526-0019899715', date: '04-12-2025', amount: '3,01,755', mode: 'CASH', bank: 'IFIC BANK LTD.', branch: 'BOARD BAZAR', zone: 'TAXZONE-5,DHAKA', circle: 'CIRCLE-101' },
      { id: 3, challan: '2526-0023059430', date: '15-01-2026', amount: '1,95,555', mode: 'CASH', bank: 'PUBALI BANK LTD.', branch: 'SHANTIR HAT', zone: 'TAXZONE-3,CHATTOGRAM', circle: 'CIRCLE-53' },
    ],
  },
  'environmental-surcharge': {
    addable: true, editable: true, deletable: true, summaryLabel: 'Total Paid Amount', summaryValue: '৳ 50,000',
    columns: [
      { key: 'registration', label: 'Motor Vehicle Registration No.' }, { key: 'transaction', label: 'Transaction ID' }, { key: 'bank', label: 'Bank Name' },
      { key: 'branch', label: 'Branch Name' }, { key: 'date', label: 'Payment Date' }, { key: 'amount', label: 'Paid Amount', numeric: true },
    ],
    rows: [
      { id: 1, registration: '2345', transaction: '234234', bank: 'Community Bank Bangladesh PLC', branch: 'branch 2', date: '02-09-2026', amount: '20,000' },
      { id: 2, registration: '3455', transaction: '345345', bank: 'Community Bank Bangladesh PLC', branch: 'branch 3', date: '12-09-2026', amount: '20,000' },
      { id: 3, registration: '1234', transaction: '1223132', bank: 'AB Bank PLC', branch: 'Branch', date: '01-09-2026', amount: '10,000' },
    ],
  },
  'tax-refund': {
    addable: true, editable: true, deletable: true,
    columns: [
      { key: 'year', label: 'Assessment Year' }, { key: 'reference', label: 'Return Register / Reference No.' }, { key: 'date', label: 'Date of Submission' },
      { key: 'zone', label: 'Return Filing Zone' }, { key: 'circle', label: 'Return Filing Circle' }, { key: 'refund', label: 'Refund Amount', numeric: true }, { key: 'claimed', label: 'Adjustment Claim Amount', numeric: true },
    ],
    rows: [{ id: 1, year: '2025-2026', reference: '112233', date: '31-08-2026', zone: 'Taxes Zone, Rajshahi', circle: 'Circle-08', refund: '10,03,333', claimed: '10,03,333' }],
  },
};

const descriptionFor = (id: string, lang: Language) => {
  const descriptions: Record<string, [string, string]> = {
    'salary-ibas': ['Claim salary TDS made available through the existing iBAS++ flow.', 'বিদ্যমান iBAS++ ফ্লো থেকে প্রাপ্ত বেতন উৎস কর দাবি করুন।'],
    'salary-other': ['Manage salary TDS records outside the iBAS++ salary flow.', 'iBAS++ বেতন ফ্লোর বাইরে বেতন উৎস কর রেকর্ড পরিচালনা করুন।'],
    'bank-fi': ['Review Bank/FI interest or profit TDS linked with eReturn Income.', 'eReturn Income-এর সাথে সংযুক্ত ব্যাংক/এফআই সুদ বা মুনাফার উৎস কর পর্যালোচনা করুন।'],
    dividend: ['Review dividend TDS under the current Ledger Section 117 flow.', 'বর্তমান লেজার ধারা ১১৭ ফ্লো অনুযায়ী লভ্যাংশ উৎস কর পর্যালোচনা করুন।'],
    'service-payment': ['Manage service-payment TDS under the current Section 90 flow.', 'বর্তমান ধারা ৯০ ফ্লো অনুযায়ী সেবা পেমেন্ট উৎস কর পরিচালনা করুন।'],
    sanchayapatra: ['Review system-provided Sanchayapatra TDS records and verification status.', 'সিস্টেম প্রদত্ত সঞ্চয়পত্র উৎস কর রেকর্ড ও যাচাই অবস্থা দেখুন।'],
    import: ['Review Import (120) TDS details supplied by the current Ledger data source.', 'বর্তমান লেজার ডেটা সোর্সের Import (120) উৎস কর তথ্য পর্যালোচনা করুন।'],
    'commercial-vehicle': ['Find and manage commercial vehicle TDS records using the existing lookup flow.', 'বিদ্যমান অনুসন্ধান ফ্লো ব্যবহার করে বাণিজ্যিক যানবাহনের উৎস কর রেকর্ড পরিচালনা করুন।'],
    'other-tds': ['Manage other source-tax entries supported by the current Ledger.', 'বর্তমান লেজারে সমর্থিত অন্যান্য উৎস কর এন্ট্রি পরিচালনা করুন।'],
    'ait-car': ['Review advance income tax on vehicle records.', 'যানবাহনের অগ্রিম আয়কর রেকর্ড পর্যালোচনা করুন।'],
    'ait-154': ['Find AIT records using the existing Section 154 challan workflow.', 'বিদ্যমান ধারা ১৫৪ চালান ফ্লো ব্যবহার করে AIT রেকর্ড খুঁজুন।'],
    'tax-paid-return': ['Find regular tax payments made with return under Section 173.', 'ধারা ১৭৩ অনুযায়ী রিটার্নের সাথে প্রদত্ত নিয়মিত কর পেমেন্ট খুঁজুন।'],
    'environmental-surcharge': ['Manage environmental surcharge payment records and declared amount.', 'পরিবেশ সারচার্জ পেমেন্ট রেকর্ড ও ঘোষিত পরিমাণ পরিচালনা করুন।'],
    'tax-refund': ['Claim eligible refund adjustment from a previous assessment year.', 'পূর্ববর্তী করবর্ষের যোগ্য কর রিফান্ড সমন্বয় দাবি করুন।'],
    'carry-forward': ['Review the current carry-forward tax claim under Section 163.', 'ধারা ১৬৩ অনুযায়ী বর্তমান জের টানা কর দাবি পর্যালোচনা করুন।'],
  };
  return descriptions[id]?.[lang === 'bn' ? 1 : 0] || '';
};

const specialRows: Record<string, Row[]> = {
  'ait-car': [
    { id: 1, registration: 'DHAKA METRO-GA-11-2233', date: '05-08-2025', amount: '25,000', status: 'Verified' },
    { id: 2, registration: 'DHAKA METRO-KHA-22-3344', date: '18-11-2025', amount: '25,000', status: 'Verified' },
  ],
};

export const CategoryWorkspace: React.FC<{ categoryId: string; lang: Language; onBack: () => void; onUnavailableAction: (message: string) => void }> = ({ categoryId, lang, onBack, onUnavailableAction }) => {
  const category = ALL_TAX_CATEGORIES.find((item) => item.id === categoryId);
  const config = configs[categoryId];
  const [rows, setRows] = useState<Row[]>(() => config?.rows || specialRows[categoryId] || []);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [selectedSync, setSelectedSync] = useState<number[]>([]);
  const [adding, setAdding] = useState(false);

  const columns: Column[] = config?.columns || (categoryId === 'ait-car' ? [
    { key: 'registration', label: 'Registration No.' }, { key: 'date', label: 'Date' }, { key: 'amount', label: 'AIT Amount', numeric: true }, { key: 'status', label: 'Status' },
  ] : []);

  const filteredRows = useMemo(() => rows.filter((row) => !query || Object.values(row).some((value) => String(value).toLowerCase().includes(query.toLowerCase()))), [rows, query]);
  if (!category) return null;

  const openAdd = () => {
    setEditing(null);
    setForm({});
    setQuery('');
    setAdding(true);
  };
  const cancelInlineAdd = () => {
    setAdding(false);
    setForm({});
  };
  const saveInlineAdd = () => {
    const nextRow = Object.fromEntries(columns.map((column) => [column.key, form[column.key] ?? '']));
    setRows((current) => [...current, { id: Math.max(0, ...current.map((row) => row.id)) + 1, ...nextRow }]);
    setAdding(false);
    setForm({});
  };
  const openEdit = (row: Row) => {
    setAdding(false);
    setEditing(row);
    setForm(Object.fromEntries(Object.entries(row).filter(([key]) => key !== 'id').map(([key, value]) => [key, String(value)])));
    setModalOpen(true);
  };
  const saveForm = () => {
    if (!editing) return;
    setRows((current) => current.map((row) => row.id === editing.id ? { ...row, ...form } : row));
    setModalOpen(false);
    setEditing(null);
    setForm({});
  };
  const removeRow = (id: number) => { if (window.confirm(lang === 'bn' ? 'এই রেকর্ডটি মুছে ফেলবেন?' : 'Delete this record?')) setRows((current) => current.filter((row) => row.id !== id)); };

  if (categoryId === 'salary-ibas') {
    return <SalaryIbasPage lang={lang} onBack={onBack} category={category} />;
  }
  if (categoryId === 'carry-forward') {
    return <CarryForwardPage lang={lang} onBack={onBack} category={category} />;
  }

  const syncCandidates = rows.slice(0, Math.min(5, rows.length));
  const hasActionColumn = !!(config?.addable || config?.editable || config?.deletable);

  return (
    <section className="space-y-5" aria-labelledby="category-page-title">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B6FA4] hover:underline mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 rounded"><ArrowLeft className="w-3.5 h-3.5" />{lang === 'bn' ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}</button>
          <div className="flex flex-wrap items-center gap-2 mb-2"><SourceBadge source={category.source} size="sm" lang={lang} /><StatusChip status={category.status} size="sm" lang={lang} /></div>
          <h1 id="category-page-title" className="text-2xl lg:text-[28px] font-bold text-[#172033] tracking-tight">{category.name}</h1>
          {category.code && <p className="text-xs font-semibold text-[#0B6FA4] mt-1">{category.code}</p>}
          <p className="text-sm text-[#5F6B7A] mt-2 max-w-3xl leading-relaxed">{descriptionFor(category.id, lang)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {config?.syncable && <button type="button" onClick={() => setSyncOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#0B6FA4] text-[#0B6FA4] bg-white text-sm font-semibold"><RefreshCw className="w-4 h-4" />Sync from Income</button>}
          {config?.addable && <button type="button" onClick={openAdd} disabled={adding} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B6FA4] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-4 h-4" />Add Entry</button>}
        </div>
      </div>

      {(config?.summaryLabel || rows.length > 0) && <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4"><p className="text-xs text-[#5F6B7A]">Records</p><p className="text-2xl font-bold mt-1">{rows.length}</p></div>
        {config?.summaryLabel && <div className="bg-white border border-[#E2E8F0] rounded-xl p-4"><p className="text-xs text-[#5F6B7A]">{config.summaryLabel}</p><p className="text-2xl font-bold mt-1 text-[#0B6FA4]">{config.summaryValue}</p></div>}
      </div>}

      {config?.searchable && <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-end"><div className="flex-1"><label className="block text-sm font-semibold mb-1.5">{categoryId === 'commercial-vehicle' ? 'Unique Key / Transaction No.' : 'Challan No.'}</label><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter reference to search" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20" /></div><button type="button" className="px-4 py-2.5 rounded-lg bg-[#0B6FA4] text-white text-sm font-semibold inline-flex items-center justify-center gap-2"><Search className="w-4 h-4" />Search</button><button type="button" onClick={() => setQuery('')} className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold">Reset</button></div>}

      {columns.length > 0 && <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E2E8F0] flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"><div><h2 className="font-bold text-[#172033]">{lang === 'bn' ? 'রেকর্ডসমূহ' : 'Records'}</h2><p className="text-xs text-[#5F6B7A] mt-0.5">{filteredRows.length} {lang === 'bn' ? 'টি রেকর্ড' : 'records'}</p></div>{!config?.searchable && <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={lang === 'bn' ? 'খুঁজুন...' : 'Search records...'} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm" /></div>}</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">SL</th>
                {columns.map((col) => <th key={col.key} className={`px-4 py-3 font-semibold ${col.numeric ? 'text-right' : 'text-left'}`}>{col.label}</th>)}
                {hasActionColumn && <th className="text-right px-4 py-3 font-semibold">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                  {columns.map((col) => <td key={col.key} className={`px-4 py-3 ${col.numeric ? 'text-right font-medium' : 'text-left'}`}>{String(row[col.key] ?? '—')}</td>)}
                  {hasActionColumn && <td className="px-4 py-2"><div className="flex justify-end gap-1.5">{config?.editable && <button type="button" onClick={() => openEdit(row)} aria-label="Edit" className="p-2 rounded-md text-[#0B6FA4] hover:bg-blue-50"><Edit2 className="w-4 h-4" /></button>}{config?.deletable && <button type="button" onClick={() => removeRow(row.id)} aria-label="Delete" className="p-2 rounded-md text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>}</div></td>}
                </tr>
              ))}
              {adding && (
                <tr className="bg-[#F5FAFD] align-top">
                  <td className="px-4 py-3 font-semibold text-[#0B6FA4]">{lang === 'bn' ? 'নতুন' : 'New'}</td>
                  {columns.map((col, index) => (
                    <td key={col.key} className="px-2 py-2.5">
                      <input
                        autoFocus={index === 0}
                        value={form[col.key] || ''}
                        onChange={(e) => setForm((current) => ({ ...current, [col.key]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') cancelInlineAdd();
                          if (e.key === 'Enter') saveInlineAdd();
                        }}
                        aria-label={col.label}
                        placeholder={col.label}
                        className={`w-full min-w-[140px] px-2.5 py-2 rounded-md border border-[#9BC8DE] bg-white text-sm text-[#172033] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20 focus:border-[#0B6FA4] ${col.numeric ? 'text-right' : 'text-left'}`}
                      />
                    </td>
                  ))}
                  {hasActionColumn && (
                    <td className="px-3 py-2.5">
                      <div className="flex justify-end gap-1.5">
                        <button type="button" onClick={saveInlineAdd} aria-label={lang === 'bn' ? 'এন্ট্রি সংরক্ষণ করুন' : 'Save entry'} title={lang === 'bn' ? 'সংরক্ষণ' : 'Save'} className="p-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"><Check className="w-4 h-4" /></button>
                        <button type="button" onClick={cancelInlineAdd} aria-label={lang === 'bn' ? 'নতুন এন্ট্রি বাতিল করুন' : 'Cancel new entry'} title={lang === 'bn' ? 'বাতিল' : 'Cancel'} className="p-2 rounded-md border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30"><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  )}
                </tr>
              )}
              {filteredRows.length === 0 && !adding && <tr><td colSpan={columns.length + (hasActionColumn ? 2 : 1)} className="px-4 py-10 text-center text-slate-500">No records found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>}

      {categoryId === 'environmental-surcharge' && <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><p className="text-sm font-semibold text-[#172033]">Surcharge Declared By Assessee</p><p className="text-xs text-[#5F6B7A] mt-1">Current declared amount</p></div><div className="text-2xl font-bold text-[#0B6FA4]">৳ 50,000</div></div>}

      <EditorModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); setForm({}); }} columns={columns} form={form} setForm={setForm} onSave={saveForm} />
      <SyncModal open={syncOpen} onClose={() => setSyncOpen(false)} rows={syncCandidates} columns={columns} selected={selectedSync} setSelected={setSelectedSync} onSync={() => { setSyncOpen(false); onUnavailableAction(lang === 'bn' ? 'নির্বাচিত রেকর্ডগুলো সিঙ্ক করা হয়েছে (প্রোটোটাইপ স্টেট)।' : 'Selected records synced in prototype state.'); }} />
    </section>
  );
};

const SalaryIbasPage = ({ lang, onBack, category }: { lang: Language; onBack: () => void; category: any }) => {
  const [claim, setClaim] = useState('1,50,000');
  return <section className="space-y-5"><button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B6FA4]"><ArrowLeft className="w-3.5 h-3.5" />Back to Dashboard</button><div><div className="flex gap-2 mb-2"><SourceBadge source={category.source} size="sm" lang={lang} /><StatusChip status={category.status} size="sm" lang={lang} /></div><h1 className="text-2xl lg:text-[28px] font-bold">iBAS++ (Salary) TDS</h1></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><FieldCard label="Assessment Year" value="2026-2027" readOnly /><FieldCard label="Office Name" value="Bogura Technical Training Centre, Bogura" readOnly /><FieldCard label="Designation" value="Principal" readOnly /><FieldCard label="TDS Available" value="5,00,450" readOnly /></div><div className="bg-white border border-[#E2E8F0] rounded-xl p-5 max-w-2xl"><label className="block text-sm font-semibold mb-2">TDS Claim</label><input value={claim} onChange={(e) => setClaim(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" /><p className="text-xs text-slate-500 mt-2">Maximum available: ৳ 5,00,450</p><div className="mt-4 flex justify-end"><button type="button" className="px-5 py-2.5 rounded-lg bg-[#0B6FA4] text-white font-semibold inline-flex items-center gap-2"><Check className="w-4 h-4" />Save Claim</button></div></div></section>;
};

const FieldCard = ({ label, value, readOnly }: { label: string; value: string; readOnly?: boolean }) => <div className="bg-white border border-[#E2E8F0] rounded-xl p-4"><label className="block text-xs font-semibold text-[#5F6B7A] mb-1.5">{label}</label><input value={value} readOnly={readOnly} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700" /></div>;

const CarryForwardPage = ({ lang, onBack, category }: { lang: Language; onBack: () => void; category: any }) => <section className="space-y-5"><button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B6FA4]"><ArrowLeft className="w-3.5 h-3.5" />Back to Dashboard</button><div className="flex gap-2"><SourceBadge source={category.source} size="sm" lang={lang} /><StatusChip status={category.status} size="sm" lang={lang} /></div><h1 className="text-2xl lg:text-[28px] font-bold">Adjustment of carry forward tax u/s 163</h1><div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"><div><p className="text-sm text-slate-500">Claimed Amount</p><p className="text-3xl font-bold text-[#0B6FA4] mt-1">৳ 10,03,333</p><span className="inline-flex mt-3 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Claimed</span></div><button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-300 text-red-600 font-semibold"><Trash2 className="w-4 h-4" />Remove Claim</button></div></section>;

const EditorModal = ({ open, onClose, columns, form, setForm, onSave }: { open: boolean; onClose: () => void; columns: Column[]; form: Record<string, string>; setForm: React.Dispatch<React.SetStateAction<Record<string, string>>>; onSave: () => void }) => {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4"><div role="dialog" aria-modal="true" className="bg-white w-full max-w-3xl max-h-[88vh] rounded-xl shadow-xl flex flex-col"><div className="px-5 py-4 border-b flex items-center justify-between"><h2 className="font-bold">Edit Entry</h2><button type="button" onClick={onClose}><X className="w-5 h-5" /></button></div><div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">{columns.map((col) => <div key={col.key}><label className="block text-sm font-semibold mb-1.5">{col.label}</label><input value={form[col.key] || ''} onChange={(e) => setForm((current) => ({ ...current, [col.key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-slate-300" /></div>)}</div><div className="px-5 py-4 border-t flex justify-end gap-2"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300">Cancel</button><button type="button" onClick={onSave} className="px-4 py-2 rounded-lg bg-[#0B6FA4] text-white font-semibold">Save</button></div></div></div>;
};

const SyncModal = ({ open, onClose, rows, columns, selected, setSelected, onSync }: { open: boolean; onClose: () => void; rows: Row[]; columns: Column[]; selected: number[]; setSelected: React.Dispatch<React.SetStateAction<number[]>>; onSync: () => void }) => {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4"><div role="dialog" aria-modal="true" className="bg-white w-full max-w-5xl max-h-[88vh] rounded-xl shadow-xl flex flex-col"><div className="px-5 py-4 border-b flex items-center justify-between"><div><h2 className="font-bold">Sync from eReturn Income</h2><p className="text-xs text-slate-500 mt-1">Select eligible records to bring into Ledger.</p></div><button type="button" onClick={onClose}><X className="w-5 h-5" /></button></div><div className="overflow-auto"><table className="w-full text-sm min-w-[760px]"><thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left">Select</th>{columns.slice(0, 5).map((col) => <th key={col.key} className={`px-4 py-3 ${col.numeric ? 'text-right' : 'text-left'}`}>{col.label}</th>)}</tr></thead><tbody className="divide-y">{rows.map((row) => <tr key={row.id}><td className="px-4 py-3"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => setSelected((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id])} /></td>{columns.slice(0, 5).map((col) => <td key={col.key} className={`px-4 py-3 ${col.numeric ? 'text-right' : ''}`}>{String(row[col.key] ?? '—')}</td>)}</tr>)}</tbody></table></div><div className="px-5 py-4 border-t flex items-center justify-between"><span className="text-sm text-slate-500">{selected.length} selected</span><div className="flex gap-2"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300">Cancel</button><button type="button" onClick={onSync} disabled={selected.length === 0} className="px-4 py-2 rounded-lg bg-[#0B6FA4] disabled:opacity-50 text-white font-semibold">Sync Selected</button></div></div></div></div>;
};
