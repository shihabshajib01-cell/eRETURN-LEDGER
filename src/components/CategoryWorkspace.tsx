import React, { useEffect, useMemo, useState } from 'react';
import { Check, Edit2, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { Language } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber, parseMoney } from '../utils/money';

type Row = Record<string, string | number> & { id: number };
type Column = { key: string; label: string; numeric?: boolean };

type CategoryConfig = {
  title: string;
  subtitle?: string;
  columns: Column[];
  rows: Row[];
  addable?: boolean;
  editable?: boolean;
  deletable?: boolean;
  syncable?: boolean;
  targetCount?: number;
  showCount?: boolean;
  summaryLabel?: string;
  summaryValue?: string;
  lookupLabel?: string;
  lookupPrimary?: 'Search' | 'Save';
  lookupPlaceholder?: string;
  showReset?: boolean;
  tableTitle?: string;
};

const configs: Record<string, CategoryConfig> = {
  'service-payment': {
    title: 'Service Payment',
    subtitle: 'Meeting Fees, Honorarium, Professional Service, Consultancy etc. [Section-90]',
    syncable: true,
    addable: true,
    editable: true,
    deletable: true,
    columns: [
      { key: 'authority', label: 'Depositing Authority' },
      { key: 'documentType', label: 'Payment Document Type' },
      { key: 'reference', label: 'Challan/ Certificate Reference No.' },
      { key: 'date', label: 'Challan/ Certificate Date' },
      { key: 'amount', label: 'Challan/ Certificate Amount', numeric: true },
      { key: 'claimed', label: 'Claimed Amount', numeric: true },
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
    title: 'Sanchayapatra',
    targetCount: 17,
    columns: [
      { key: 'scheme', label: 'Name of Scheme' },
      { key: 'registration', label: 'Registration No.' },
      { key: 'date', label: 'Issue Date' },
      { key: 'value', label: 'Value', numeric: true },
      { key: 'tds', label: 'TDS Claim', numeric: true },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      { id: 1, scheme: 'Poribar Sanchayapatra', registration: '2021-0023507', date: '07-01-2021', value: '16,00,000', tds: '10,752', status: 'Verified' },
      { id: 2, scheme: 'Poribar Sanchayapatra', registration: '2021-0486873', date: '27-05-2021', value: '1,00,000', tds: '1,056', status: 'Verified' },
      { id: 3, scheme: 'Poribar Sanchayapatra', registration: '2021-1011941', date: '23-09-2021', value: '1,00,000', tds: '950', status: 'Verified' },
      { id: 4, scheme: 'Poribar Sanchayapatra', registration: '2022-0441765', date: '04-04-2022', value: '2,00,000', tds: '1,900', status: 'Verified' },
      { id: 5, scheme: 'Poribar Sanchayapatra', registration: '2022-0917245', date: '25-07-2022', value: '1,00,000', tds: '950', status: 'Verified' },
      { id: 6, scheme: 'Poribar Sanchayapatra', registration: '2022-1242189', date: '19-10-2022', value: '1,00,000', tds: '950', status: 'Verified' },
      { id: 7, scheme: 'Poribar Sanchayapatra', registration: '2023-0144432', date: '05-02-2023', value: '1,00,000', tds: '950', status: 'Verified' },
      { id: 8, scheme: 'Poribar Sanchayapatra', registration: '2023-0438170', date: '07-05-2023', value: '1,00,000', tds: '950', status: 'Verified' },
      { id: 9, scheme: 'Poribar Sanchayapatra', registration: '2023-0872614', date: '28-08-2023', value: '1,00,000', tds: '950', status: 'Verified' },
      { id: 10, scheme: 'Poribar Sanchayapatra', registration: '2023-1177864', date: '22-11-2023', value: '1,00,000', tds: '950', status: 'Verified' },
      { id: 11, scheme: 'Poribar Sanchayapatra', registration: '2024-0204923', date: '25-02-2024', value: '1,00,000', tds: '950', status: 'Verified' },
      { id: 12, scheme: 'Poribar Sanchayapatra', registration: '2024-0430947', date: '09-05-2024', value: '1,00,000', tds: '950', status: 'Verified' },
      { id: 13, scheme: 'Poribar Sanchayapatra', registration: '2025-0038731', date: '19-01-2025', value: '2,00,000', tds: '2,474', status: 'Verified' },
      { id: 14, scheme: 'Poribar Sanchayapatra', registration: '2025-0293593', date: '24-03-2025', value: '9,00,000', tds: '11,133', status: 'Verified' },
      { id: 15, scheme: 'Poribar Sanchayapatra', registration: '2025-0290852', date: '25-03-2025', value: '6,00,000', tds: '7,422', status: 'Verified' },
      { id: 16, scheme: 'Poribar Sanchayapatra', registration: '2026-0019673', date: '12-01-2026', value: '9,00,000', tds: '4,425', status: 'Verified' },
      { id: 17, scheme: 'Poribar Sanchayapatra', registration: '2026-0026431', date: '12-01-2026', value: '7,00,000', tds: '3,477', status: 'Verified' },
    ],
  },
  import: {
    title: 'Import (120) TDS Details',
    summaryLabel: 'Total TDS Claimed',
    summaryValue: '18,12,218',
    targetCount: 7,
    showCount: true,
    columns: [
      { key: 'bin', label: 'Bin' },
      { key: 'office', label: 'Office Code' },
      { key: 'bill', label: 'Bill of Entry' },
      { key: 'billDate', label: 'Bill of Entry Date' },
      { key: 'receipt', label: 'Receipt No.' },
      { key: 'receiptDate', label: 'Receipt Date' },
      { key: 'invoice', label: 'Invoice Value', numeric: true },
      { key: 'assessable', label: 'Assessable Value', numeric: true },
      { key: 'duties', label: 'Total Tax & Duties', numeric: true },
      { key: 'claimed', label: 'TDS Claimed', numeric: true },
    ],
    rows: [
      { id: 1, bin: '004905634-0503', office: '301', bill: '1629442', billDate: '01-09-2025', receipt: '1694061', receiptDate: '02-09-2025', invoice: '39,75,049', assessable: '40,54,550', duties: '25,10,891', claimed: '2,02,727' },
      { id: 2, bin: '004905634-0503', office: '101', bill: '939642', billDate: '22-09-2025', receipt: '968764', receiptDate: '23-09-2025', invoice: '613', assessable: '626', duties: '431', claimed: '31' },
      { id: 3, bin: '004905634-0503', office: '301', bill: '1674032', billDate: '09-09-2025', receipt: '1768177', receiptDate: '15-09-2025', invoice: '31,08,500', assessable: '63,56,829', duties: '49,19,743', claimed: '3,17,841' },
      { id: 4, bin: '004905634-0503', office: '301', bill: '1776639', billDate: '28-09-2025', receipt: '1907828', receiptDate: '09-10-2025', invoice: '36,79,553', assessable: '64,63,299', duties: '49,94,297', claimed: '3,23,164' },
      { id: 5, bin: '004905634-0503', office: '301', bill: '2021438', billDate: '09-11-2025', receipt: '2118668', receiptDate: '12-11-2025', invoice: '34,87,332', assessable: '68,40,260', duties: '53,06,753', claimed: '3,42,013' },
      { id: 6, bin: '004905634-0503', office: '301', bill: '2085468', billDate: '18-11-2025', receipt: '2199946', receiptDate: '24-11-2025', invoice: '35,32,407', assessable: '62,04,982', duties: '47,94,367', claimed: '3,10,249' },
      { id: 7, bin: '004905634-0503', office: '301', bill: '2319200', billDate: '22-12-2025', receipt: '2421826', receiptDate: '24-12-2025', invoice: '35,40,758', assessable: '63,23,863', duties: '49,06,327', claimed: '3,16,193' },
    ],
  },
  'commercial-vehicle': {
    title: 'Commercial Vehicle',
    lookupLabel: 'Unique Key (Transaction No.)',
    lookupPrimary: 'Search',
    lookupPlaceholder: 'Transaction No.',
    showReset: true,
    deletable: true,
    targetCount: 4,
    tableTitle: 'TDS Details',
    columns: [
      { key: 'registration', label: 'Registration No.' },
      { key: 'uniqueKey', label: 'Unique Key' },
      { key: 'chassis', label: 'Chasis No.' },
      { key: 'tds', label: 'TDS Claim', numeric: true },
    ],
    rows: [
      { id: 1, registration: 'RANGPUR-KA-02-0113', uniqueKey: '2512231447911', chassis: 'EE96-0075355', tds: '25,000' },
      { id: 2, registration: 'DHAKA METRO-GA-45-0727', uniqueKey: '2509161060682', chassis: 'NZT260-3166542', tds: '25,000' },
      { id: 3, registration: 'DHAKA METRO-GA-28-4927', uniqueKey: '2508091268499', chassis: 'ZVW30-5744115', tds: '50,000' },
      { id: 4, registration: 'DHAKA METRO-KHA-12-0622', uniqueKey: '2602151294597', chassis: 'NZE120-0023924', tds: '25,000' },
    ],
  },
  'other-tds': {
    title: 'Other TDS Entry',
    addable: true,
    editable: true,
    deletable: true,
    summaryLabel: 'Total Claimed Amount',
    summaryValue: '69,70,044',
    targetCount: 7,
    showCount: true,
    columns: [
      { key: 'purpose', label: 'Purpose of Payment' },
      { key: 'authority', label: 'Depositing Authority' },
      { key: 'documentType', label: 'Payment Document Type' },
      { key: 'reference', label: 'Challan/ Certificate Reference No.' },
      { key: 'date', label: 'Challan/ Certificate Date' },
      { key: 'amount', label: 'Challan/ Certificate Amount', numeric: true },
      { key: 'claimed', label: 'Claimed Amount', numeric: true },
    ],
    rows: [
      { id: 1, purpose: 'Acquisition of Property [Section-111]', authority: 'ref-auth', documentType: 'Certificate', reference: 'ref-3', date: '02-09-2026', amount: '5,000', claimed: '500' },
      { id: 2, purpose: 'Actor, Producer etc. [ Section-93]', authority: 'FDC', documentType: 'Challan', reference: '2526-0058719534', date: '24-06-2026', amount: '8,221', claimed: '8,221' },
      { id: 3, purpose: 'Advertising Bill [ Section-92]', authority: 'Advertise 1', documentType: 'Challan', reference: '2526-0027752927', date: '10-02-2026', amount: '33,16,209', claimed: '33,16,209' },
      { id: 4, purpose: 'Bangladesh Bank Bill [ Section-107]', authority: 'BBB', documentType: 'Challan', reference: '2526-0000884175', date: '14-07-2025', amount: '32,77,127', claimed: '32,77,127' },
      { id: 5, purpose: 'Brick Manufacturing [ Section-130]', authority: 'Brick', documentType: 'Certificate', reference: 'ref-4', date: '01-09-2026', amount: '1,000', claimed: '1,000' },
      { id: 6, purpose: 'Convention Hall Rent [ Section-110]', authority: 'auth -3', documentType: 'Challan', reference: '2526-0003447879', date: '07-08-2025', amount: '3,66,087', claimed: '3,66,087' },
      { id: 7, purpose: 'House Property [ Section-109]', authority: 'auth', documentType: 'Challan', reference: '2526-0000443755', date: '30-07-2025', amount: '900', claimed: '900' },
    ],
  },
  'ait-car': {
    title: 'AIT on Car',
    lookupLabel: 'Transaction No.',
    lookupPrimary: 'Search',
    lookupPlaceholder: 'Transaction No.',
    targetCount: 0,
    columns: [
      { key: 'registration', label: 'Registration No.' },
      { key: 'date', label: 'Date' },
      { key: 'amount', label: 'AIT Amount', numeric: true },
      { key: 'status', label: 'Status' },
    ],
    rows: [],
  },
  'ait-154': {
    title: 'AIT under Section 154',
    lookupLabel: 'Challan No.',
    lookupPrimary: 'Save',
    lookupPlaceholder: 'Enter Challan No.',
    showReset: true,
    deletable: true,
    targetCount: 3,
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
    rows: [
      { id: 1, challan: '2526-0003384438', date: '06-08-2025', amount: '37,085', mode: 'CASH', bank: 'IFIC BANK LTD.', branch: 'ISLAMIC BANKING', zone: 'TAXZONE-15,DHAKA', circle: 'CIRCLE-319' },
      { id: 2, challan: '2526-0003681361', date: '10-08-2025', amount: '77,280', mode: 'TRANSFER', bank: 'SONALI BANK LTD.', branch: 'MIRPUR CANTT., DHAKA', zone: 'TAXZONE-11,DHAKA', circle: 'CIRCLE-238' },
      { id: 3, challan: '2526-0003954853', date: '11-08-2025', amount: '4,000', mode: 'CASH', bank: 'SONALI BANK LTD.', branch: 'Khulna KDA New Market', zone: 'TAXZONE,KHULNA', circle: 'CIRCLE-2' },
    ],
  },
  'tax-paid-return': {
    title: 'Regular Tax under Section 173',
    lookupLabel: 'Challan No.',
    lookupPrimary: 'Save',
    lookupPlaceholder: 'Enter Challan No.',
    showReset: true,
    deletable: true,
    targetCount: 5,
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
    rows: [
      { id: 1, challan: '2526-0001951606', date: '23-07-2025', amount: '5,154', mode: 'CASH', bank: 'SONALI BANK LTD.', branch: 'Gopalganj', zone: 'TAXZONE-4,DHAKA', circle: 'N/A' },
      { id: 2, challan: '2526-0019899715', date: '04-12-2025', amount: '3,01,755', mode: 'CASH', bank: 'IFIC BANK LTD.', branch: 'BOARD BAZAR', zone: 'TAXZONE-5,DHAKA', circle: 'CIRCLE-101' },
      { id: 3, challan: '2526-0023059430', date: '15-01-2026', amount: '1,95,555', mode: 'CASH', bank: 'PUBALI BANK LTD.', branch: 'SHANTIR HAT', zone: 'TAXZONE-3,CHATTOGRAM', circle: 'CIRCLE-53' },
      { id: 4, challan: '2526-0023558743', date: '21-01-2026', amount: '4,50,378', mode: 'CHEQUE', bank: 'SONALI BANK LTD.', branch: 'BARISHAL UNIVERSITY', zone: 'TAXZONE,BARISHAL', circle: 'CIRCLE-13' },
      { id: 5, challan: '2526-0060340578', date: '25-06-2026', amount: '51,500', mode: 'CASH', bank: 'JANATA BANK LTD.', branch: 'CHITTAGONG VETERINARY AND ANIMAL SCIENCES UNIVERSITY', zone: 'TAXZONE-1,CHATTOGRAM', circle: 'CIRCLE-18' },
    ],
  },
  'environmental-surcharge': {
    title: 'Environmental Surcharge',
    addable: true,
    editable: true,
    deletable: true,
    summaryLabel: 'Total Paid Amount',
    summaryValue: '50,000',
    targetCount: 3,
    columns: [
      { key: 'registration', label: 'Motor Vehicle Registration No.' },
      { key: 'transaction', label: 'Transaction ID' },
      { key: 'bank', label: 'Bank Name' },
      { key: 'branch', label: 'Branch Name' },
      { key: 'date', label: 'Payment Date' },
      { key: 'amount', label: 'Paid Amount', numeric: true },
    ],
    rows: [
      { id: 1, registration: '2345', transaction: '234234', bank: 'Community Bank Bangladesh PLC', branch: 'branch 2', date: '02-09-2026', amount: '20,000' },
      { id: 2, registration: '3455', transaction: '345345', bank: 'Community Bank Bangladesh PLC', branch: 'branch 3', date: '12-09-2026', amount: '20,000' },
      { id: 3, registration: '1234', transaction: '1223132', bank: 'AB Bank PLC', branch: 'Branch', date: '01-09-2026', amount: '10,000' },
    ],
  },
  'tax-refund': {
    title: 'Adjustment of Tax Refund',
    addable: true,
    editable: true,
    deletable: true,
    targetCount: 1,
    columns: [
      { key: 'year', label: 'Assessment Year' },
      { key: 'reference', label: 'Return Register No. / Reference No.' },
      { key: 'date', label: 'Date of Submission' },
      { key: 'zone', label: 'Return Filing Zone' },
      { key: 'circle', label: 'Return Filing Circle' },
      { key: 'refund', label: 'Refund Amount', numeric: true },
      { key: 'claimed', label: 'Adjustment Claim Amount', numeric: true },
    ],
    rows: [
      { id: 1, year: '2025-2026', reference: '112233', date: '31-08-2026', zone: 'Taxes Zone, Rajshahi', circle: 'Circle-08', refund: '10,03,333', claimed: '10,03,333' },
    ],
  },
};

const bnTitles: Record<string, string> = {
  'service-payment': 'সেবা পেমেন্ট',
  sanchayapatra: 'সঞ্চয়পত্র',
  import: 'Import (120) TDS Details',
  'commercial-vehicle': 'বাণিজ্যিক যানবাহন',
  'other-tds': 'Other TDS Entry',
  'ait-car': 'গাড়ির উপর AIT',
  'ait-154': 'ধারা ১৫৪ এর অধীন AIT',
  'tax-paid-return': 'ধারা ১৭৩ এর অধীন নিয়মিত কর',
  'environmental-surcharge': 'পরিবেশ সারচার্জ',
  'tax-refund': 'কর রিফান্ড সমন্বয়',
};

const bnLabels: Record<string, string> = {
  'Name of Scheme': 'স্কিমের নাম',
  'Registration No.': 'রেজিস্ট্রেশন নং',
  'Issue Date': 'ইস্যুর তারিখ',
  'Value': 'মূল্য',
  'TDS Claim': 'TDS দাবি',
  'Status': 'অবস্থা',
  'Bin': 'BIN',
  'Office Code': 'অফিস কোড',
  'Bill of Entry': 'বিল অব এন্ট্রি',
  'Bill of Entry Date': 'বিল অব এন্ট্রির তারিখ',
  'Receipt No.': 'রসিদ নং',
  'Receipt Date': 'রসিদের তারিখ',
  'Invoice Value': 'ইনভয়েস মূল্য',
  'Assessable Value': 'Assessable Value',
  'Total Tax & Duties': 'মোট কর ও শুল্ক',
  'TDS Claimed': 'দাবিকৃত TDS',
  'Unique Key (Transaction No.)': 'ইউনিক কী (ট্রানজ্যাকশন নং)',
  'Unique Key': 'ইউনিক কী',
  'Chasis No.': 'চ্যাসিস নং',
  'TDS Details': 'TDS বিবরণ',
  'Purpose of Payment': 'পেমেন্টের উদ্দেশ্য',
  'Depositing Authority': 'জমাদানকারী কর্তৃপক্ষ',
  'Payment Document Type': 'পেমেন্ট ডকুমেন্টের ধরন',
  'Challan/ Certificate Reference No.': 'চালান/সার্টিফিকেট রেফারেন্স নং',
  'Challan/ Certificate Date': 'চালান/সার্টিফিকেট তারিখ',
  'Challan/ Certificate Amount': 'চালান/সার্টিফিকেট পরিমাণ',
  'Claimed Amount': 'দাবিকৃত পরিমাণ',
  'Total Claimed Amount': 'মোট দাবিকৃত পরিমাণ',
  'Transaction No.': 'ট্রানজ্যাকশন নং',
  'Challan No.': 'চালান নং',
  'Date': 'তারিখ',
  'Amount': 'পরিমাণ',
  'AIT Amount': 'AIT পরিমাণ',
  'Payment Mode': 'পেমেন্ট পদ্ধতি',
  'Bank': 'ব্যাংক',
  'Branch': 'শাখা',
  'Zone': 'জোন',
  'Circle': 'সার্কেল',
  'AIT Details': 'AIT বিবরণ',
  'Regular Tax under Section 173': 'ধারা ১৭৩-এর অধীন নিয়মিত কর',
  'Assessment Year': 'করবর্ষ',
  'Return Register No. / Reference No.': 'রিটার্ন রেজিস্টার নং / রেফারেন্স নং',
  'Date of Submission': 'দাখিলের তারিখ',
  'Return Filing Zone': 'রিটার্ন দাখিল জোন',
  'Return Filing Circle': 'রিটার্ন দাখিল সার্কেল',
  'Refund Amount': 'রিফান্ডের পরিমাণ',
  'Adjustment Claim Amount': 'সমন্বয় দাবির পরিমাণ',
  'Total TDS Claimed': 'মোট দাবিকৃত TDS',
  'Count': 'সংখ্যা',
  'Action': 'অ্যাকশন',
};

export const CategoryWorkspace: React.FC<{
  categoryId: string;
  lang: Language;
  onBack: () => void;
  onUnavailableAction: (message: string) => void;
}> = ({ categoryId, lang, onUnavailableAction }) => {
  const config = configs[categoryId];
  const [rows, setRows] = usePersistentState<Row[]>(`ereturn-ledger:v2:${categoryId}-rows`, () => config?.rows || []);
  const [query, setQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<Row | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [syncOpen, setSyncOpen] = useState(false);
  const [selectedSync, setSelectedSync] = useState<number[]>([]);

  const isBn = lang === 'bn';
  const filteredRows = rows;
  const { updateCategoryAmount } = useLedgerRuntime();
  const amountKeyByCategory: Record<string, string> = {
    sanchayapatra: 'tds',
    import: 'claimed',
    'commercial-vehicle': 'tds',
    'other-tds': 'claimed',
    'ait-car': 'amount',
    'ait-154': 'amount',
    'tax-paid-return': 'amount',
    'tax-refund': 'claimed',
  };
  const amountKey = amountKeyByCategory[categoryId];
  const currentTotal = useMemo(
    () => amountKey ? rows.reduce((sum, row) => sum + parseMoney(row[amountKey] ?? 0), 0) : 0,
    [rows, amountKey]
  );

  useEffect(() => {
    if (amountKey) updateCategoryAmount(categoryId, currentTotal);
  }, [amountKey, categoryId, currentTotal, updateCategoryAmount]);

  if (categoryId === 'carry-forward') {
    return <CarryForwardPage lang={lang} />;
  }

  if (!config) return null;
  const title = isBn ? (bnTitles[categoryId] || config.title) : config.title;
  const labelText = (value: string) => isBn ? (bnLabels[value] || value) : value;

  const openAdd = () => {
    setEditing(null);
    const defaults: Record<string, string> = {};
    if (config?.columns.some((column) => column.key === 'documentType')) defaults.documentType = 'Challan';
    if (categoryId === 'tax-refund') defaults.year = '2025-2026';
    setForm(defaults);
    setAdding(true);
  };

  const formComplete = config
    ? config.columns.every((column) => String(form[column.key] ?? '').trim().length > 0)
    : false;
  const claimedWithinAmount =
    form.claimed === undefined ||
    parseMoney(form.claimed) <= parseMoney(form.amount ?? form.refund ?? form.claimed);
  const formValid = formComplete && claimedWithinAmount;

  const saveAdd = () => {
    if (!formValid) return;
    const nextRow = Object.fromEntries(config.columns.map((column) => [column.key, form[column.key] ?? '']));
    setRows((current) => [
      ...current,
      { id: Math.max(0, ...current.map((row) => row.id)) + 1, ...nextRow },
    ]);
    setAdding(false);
    setForm({});
  };

  const openEdit = (row: Row) => {
    setAdding(false);
    setEditing(row);
    setForm(Object.fromEntries(Object.entries(row).filter(([key]) => key !== 'id').map(([key, value]) => [key, String(value)])));
  };

  const saveEdit = () => {
    if (!editing || !formValid) return;
    setRows((current) => current.map((row) => row.id === editing.id ? { ...row, ...form } : row));
    setEditing(null);
    setForm({});
  };

  const removeRow = (id: number) => {
    if (window.confirm(isBn ? 'এই রেকর্ডটি মুছে ফেলবেন?' : 'Delete this record?')) {
      setRows((current) => current.filter((row) => row.id !== id));
    }
  };

  const lookupKeyByCategory: Record<string, string> = {
    'commercial-vehicle': 'uniqueKey',
    'ait-car': 'transaction',
    'ait-154': 'challan',
    'tax-paid-return': 'challan',
  };

  const lookupAction = () => {
    const value = query.trim();
    if (!value) {
      onUnavailableAction(isBn ? 'অনুসন্ধানের মান লিখুন।' : 'Enter a lookup value.');
      return;
    }

    const lookupKey = lookupKeyByCategory[categoryId];
    const catalog = config.rows;
    const match = lookupKey
      ? catalog.find((row) => String(row[lookupKey] ?? '').toLowerCase() === value.toLowerCase())
      : undefined;

    if (!match) {
      setLookupResult(null);
      onUnavailableAction(isBn ? 'কোনো মিল পাওয়া যায়নি।' : 'No matching record found.');
      return;
    }

    if (categoryId === 'commercial-vehicle' || categoryId === 'ait-car') {
      setLookupResult(match);
      return;
    }

    const alreadyAdded = rows.some((row) => row.id === match.id);
    if (!alreadyAdded) setRows((current) => [...current, { ...match }]);
    onUnavailableAction(alreadyAdded
      ? (isBn ? 'রেকর্ডটি ইতোমধ্যে যোগ করা আছে।' : 'This record is already added.')
      : (isBn ? 'রেকর্ডটি সংরক্ষিত হয়েছে।' : 'Record saved.'));
  };

  const saveLookupResult = () => {
    if (!lookupResult) return;
    const alreadyAdded = rows.some((row) => row.id === lookupResult.id);
    if (!alreadyAdded) setRows((current) => [...current, { ...lookupResult }]);
    onUnavailableAction(alreadyAdded
      ? (isBn ? 'রেকর্ডটি ইতোমধ্যে যোগ করা আছে।' : 'This record is already added.')
      : (isBn ? 'রেকর্ডটি সংরক্ষিত হয়েছে।' : 'Record saved.'));
  };

  const hasActions = !!(config.addable || config.editable || config.deletable);
  const displayCount = rows.length;

  return (
    <section className="w-full space-y-4" aria-labelledby="category-title">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 id="category-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
            {title}
          </h1>
          {config.subtitle && (
            <p className="mt-1 text-sm leading-relaxed text-[#5F6B7A]">{config.subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {config.syncable && (
            <button
              type="button"
              onClick={() => setSyncOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#0B6FA4] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B6FA4] hover:bg-blue-50"
            >
              <RefreshCw className="h-4 w-4" />
              {isBn ? 'Income থেকে Sync' : 'Sync From Income'}
            </button>
          )}
          {config.addable && (
            <button
              type="button"
              onClick={openAdd}
              disabled={adding}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A] disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {isBn ? 'যোগ করুন' : 'Add'}
            </button>
          )}
        </div>
      </header>

      {(config.summaryLabel || config.showCount) && (
        <div className="flex flex-wrap items-end gap-x-8 gap-y-2">
          {config.summaryLabel && (
            <div>
              <p className="text-xs text-[#5F6B7A]">{labelText(config.summaryLabel)}</p>
              <p className="mt-0.5 text-xl font-bold text-[#0B6FA4]">{amountKey ? formatLedgerNumber(currentTotal) : config.summaryValue}</p>
            </div>
          )}
          {config.showCount && (
            <div>
              <p className="text-xs text-[#5F6B7A]">{labelText('Count')}</p>
              <p className="mt-0.5 text-xl font-bold text-[#172033]">{displayCount}</p>
            </div>
          )}
        </div>
      )}

      {config.lookupLabel && (
        <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-semibold text-[#172033]">{labelText(config.lookupLabel)}</label>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={config.lookupPlaceholder}
                className="w-full rounded-lg border border-[#C8D4E1] bg-white px-3 py-2.5 text-sm focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20"
              />
            </div>
            {config.showReset && (
              <button
                type="button"
                onClick={() => { setQuery(''); setLookupResult(null); }}
                className="rounded-lg border border-[#C8D4E1] bg-white px-4 py-2.5 text-sm font-semibold text-[#263247] hover:bg-slate-50"
              >
                Reset
              </button>
            )}
            {categoryId === 'ait-car' ? (
              <>
                <button
                  type="button"
                  onClick={lookupAction}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0B6FA4] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B6FA4] hover:bg-blue-50"
                >
                  <Search className="h-4 w-4" />
                  {isBn ? 'অনুসন্ধান' : 'Search'}
                </button>
                <button
                  type="button"
                  onClick={saveLookupResult}
                  disabled={!lookupResult}
                  className="rounded-lg bg-[#0B6FA4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isBn ? 'সংরক্ষণ' : 'Save'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={lookupAction}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B6FA4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#095D8A]"
              >
                {config.lookupPrimary === 'Search' && <Search className="h-4 w-4" />}
                {config.lookupPrimary === 'Save' ? (isBn ? 'সংরক্ষণ' : 'Save') : (isBn ? 'অনুসন্ধান' : 'Search')}
              </button>
            )}
          </div>
        </section>
      )}

      {lookupResult && (categoryId === 'commercial-vehicle' || categoryId === 'ait-car') && (
        <section className="rounded-xl border border-[#D7E8F2] bg-[#F5FAFD] p-4" aria-live="polite">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {config.columns.map((column) => (
              <div key={column.key}>
                <p className="text-xs font-semibold text-[#5F6B7A]">{column.label}</p>
                <p className="mt-1 text-sm font-medium text-[#172033]">{String(lookupResult[column.key] ?? '—')}</p>
              </div>
            ))}
          </div>
          {categoryId === 'commercial-vehicle' && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={saveLookupResult}
                className="rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#095D8A]"
              >
                Save
              </button>
            </div>
          )}
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        {config.tableTitle && (
          <div className="border-b border-[#E2E8F0] px-4 py-3">
            <h2 className="font-bold text-[#172033]">{labelText(config.tableTitle)}</h2>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="ledger-responsive-table w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 text-[#5F6B7A]">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-semibold">SL.</th>
                {config.columns.map((column) => (
                  <th
                    scope="col"
                    key={column.key}
                    className={`px-4 py-3 font-semibold ${column.numeric ? 'text-right' : 'text-left'}`}
                  >
                    {labelText(column.label)}
                  </th>
                ))}
                {hasActions && <th scope="col" className="px-4 py-3 text-right font-semibold">{categoryId === 'commercial-vehicle' ? '' : labelText('Action')}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td data-label="SL." className="px-4 py-3 text-slate-500">{index + 1}</td>
                  {config.columns.map((column) => (
                    <td
                      key={column.key}
                      data-label={labelText(column.label)}
                      className={`px-4 py-3 ${column.numeric ? 'text-right font-medium' : 'text-left'}`}
                    >
                      {column.key === 'status' && isBn && String(row[column.key]) === 'Verified' ? 'যাচাইকৃত' : String(row[column.key] ?? '—')}
                    </td>
                  ))}
                  {hasActions && (
                    <td data-label={labelText('Action')} className="px-4 py-2">
                      <div className="flex justify-end gap-1">
                        {config.editable && (
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            aria-label="Edit"
                            className="rounded-md p-2 text-[#0B6FA4] hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {config.deletable && (
                          <button
                            type="button"
                            onClick={() => removeRow(row.id)}
                            aria-label="Delete"
                            className="rounded-md p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {adding && (
                <tr className="bg-[#F5FAFD] align-top">
                  <td data-label="SL." className="px-4 py-3 font-semibold text-[#0B6FA4]">{rows.length + 1}</td>
                  {config.columns.map((column, index) => (
                    <td key={column.key} data-label={column.label} className="px-2 py-2.5">
                      {column.key === 'documentType' ? (
                        <select
                          autoFocus={index === 0}
                          value={form[column.key] || 'Challan'}
                          onChange={(event) => setForm((current) => ({ ...current, [column.key]: event.target.value }))}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') { setAdding(false); setForm({}); }
                            if (event.key === 'Enter') { event.preventDefault(); saveAdd(); }
                          }}
                          className="w-full min-w-[140px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm"
                        >
                          <option value="Challan">Challan</option>
                          <option value="Certificate">Certificate</option>
                        </select>
                      ) : categoryId === 'other-tds' && column.key === 'purpose' ? (
                        <select
                          autoFocus={index === 0}
                          value={form[column.key] || ''}
                          onChange={(event) => setForm((current) => ({ ...current, [column.key]: event.target.value }))}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') { setAdding(false); setForm({}); }
                            if (event.key === 'Enter') { event.preventDefault(); saveAdd(); }
                          }}
                          className="w-full min-w-[180px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm"
                        >
                          <option value="">Select One</option>
                          {Array.from(new Set(config.rows.map((row) => String(row.purpose ?? '')).filter(Boolean))).map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : categoryId === 'tax-refund' && column.key === 'year' ? (
                        <select
                          autoFocus={index === 0}
                          value={form[column.key] || '2025-2026'}
                          onChange={(event) => setForm((current) => ({ ...current, [column.key]: event.target.value }))}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') { setAdding(false); setForm({}); }
                            if (event.key === 'Enter') { event.preventDefault(); saveAdd(); }
                          }}
                          className="w-full min-w-[140px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm"
                        >
                          <option value="2025-2026">2025-2026</option>
                        </select>
                      ) : (
                        <input
                          autoFocus={index === 0}
                          value={form[column.key] || ''}
                          onChange={(event) => setForm((current) => ({ ...current, [column.key]: event.target.value }))}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') { setAdding(false); setForm({}); }
                            if (event.key === 'Enter') { event.preventDefault(); saveAdd(); }
                          }}
                          aria-label={labelText(column.label)}
                          inputMode={column.numeric ? 'decimal' : undefined}
                          placeholder={labelText(column.label)}
                          className={`w-full min-w-[140px] rounded-md border border-[#9BC8DE] bg-white px-2.5 py-2 text-sm focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20 ${column.numeric ? 'text-right' : 'text-left'}`}
                        />
                      )}
                    </td>
                  ))}
                  <td data-label={labelText('Action')} className="px-3 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={saveAdd} disabled={!formValid} aria-label="Save" className="rounded-md bg-emerald-600 p-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAdding(false);
                          setForm({});
                        }}
                        aria-label="Cancel"
                        className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {filteredRows.length === 0 && !adding && (
                <tr>
                  <td
                    colSpan={config.columns.length + (hasActions ? 2 : 1)}
                    className="px-4 py-10 text-center text-[#5F6B7A]"
                  >
                    {isBn ? 'কোনো রেকর্ড পাওয়া যায়নি।' : 'No records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div role="dialog" aria-modal="true" className="flex max-h-[88vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-bold text-[#172033]">Edit</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 overflow-y-auto p-5 md:grid-cols-2">
              {config.columns.map((column) => (
                <div key={column.key}>
                  <label className="mb-1.5 block text-sm font-semibold text-[#172033]">{labelText(column.label)}</label>
                  {column.key === 'documentType' ? (
                    <select
                      value={form[column.key] || 'Challan'}
                      onChange={(event) => setForm((current) => ({ ...current, [column.key]: event.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                    >
                      <option value="Challan">Challan</option>
                      <option value="Certificate">Certificate</option>
                    </select>
                  ) : categoryId === 'other-tds' && column.key === 'purpose' ? (
                    <select
                      value={form[column.key] || ''}
                      onChange={(event) => setForm((current) => ({ ...current, [column.key]: event.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                    >
                      {Array.from(new Set(config.rows.map((row) => String(row.purpose ?? '')).filter(Boolean))).map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form[column.key] || ''}
                      onChange={(event) => setForm((current) => ({ ...current, [column.key]: event.target.value }))}
                      inputMode={column.numeric ? 'decimal' : undefined}
                      className={`w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20 ${column.numeric ? 'text-right' : ''}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
              <button type="button" onClick={saveEdit} disabled={!formValid} className="rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Save</button>
            </div>
          </div>
        </div>
      )}

      {syncOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div role="dialog" aria-modal="true" className="flex max-h-[88vh] w-full max-w-5xl flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-bold text-[#172033]">{config.title}</h2>
              <button type="button" onClick={() => setSyncOpen(false)} aria-label="Close" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Select</th>
                    {config.columns.slice(0, 5).map((column) => (
                      <th key={column.key} className={`px-4 py-3 ${column.numeric ? 'text-right' : 'text-left'}`}>
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedSync.includes(row.id)}
                          onChange={() =>
                            setSelectedSync((current) =>
                              current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id]
                            )
                          }
                        />
                      </td>
                      {config.columns.slice(0, 5).map((column) => (
                        <td key={column.key} className={`px-4 py-3 ${column.numeric ? 'text-right' : ''}`}>
                          {String(row[column.key] ?? '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t px-5 py-4">
              <span className="text-sm text-slate-500">{selectedSync.length} selected</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSyncOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
                <button
                  type="button"
                  disabled={selectedSync.length === 0}
                  onClick={() => {
                    setSyncOpen(false);
                    onUnavailableAction(isBn ? 'Sync API এখনো সংযুক্ত নয়।' : 'Sync API is not connected yet.');
                  }}
                  className="rounded-lg bg-[#0B6FA4] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Sync
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const CarryForwardPage = ({ lang }: { lang: Language }) => {
  const isBn = lang === 'bn';
  const [active, setActive] = usePersistentState('ereturn-ledger:v2:carry-forward-active', true);
  const { updateCategoryAmount } = useLedgerRuntime();
  const claimedAmount = 1003333;

  useEffect(() => {
    updateCategoryAmount('carry-forward', active ? claimedAmount : 0);
  }, [active, updateCategoryAmount]);

  const removeClaim = () => {
    const confirmed = window.confirm(isBn ? 'দাবিটি মুছে ফেলবেন?' : 'Delete this claim?');
    if (confirmed) setActive(false);
  };

  return (
    <section className="w-full space-y-4" aria-labelledby="carry-forward-title">
      <h1 id="carry-forward-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
        {isBn ? 'ধারা ১৬৩ অনুযায়ী জের টানা কর সমন্বয়' : 'Adjustment of carry forward tax u/s 163'}
      </h1>

      {active ? (
        <section className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-bold text-[#172033]">
                  {isBn ? 'ধারা ১৬৩ অনুযায়ী জের টানা কর সমন্বয়' : 'Adjustment of carry forward tax u/s 163'}
                </p>
                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {isBn ? 'দাবিকৃত' : 'Claimed'}
                </span>
              </div>
              <button
                type="button"
                onClick={removeClaim}
                className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                {isBn ? 'মুছুন' : 'Delete'}
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#C8D4E1] bg-white px-4 py-4">
              <span className="text-sm text-[#5F6B7A]">{isBn ? 'দাবিকৃত পরিমাণ' : 'Claimed Amount'}</span>
              <span className="text-xl font-bold text-[#0B6FA4]">10,03,333</span>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-[#C8D4E1] bg-white px-5 py-8 text-center">
          <p className="text-sm font-semibold text-[#172033]">
            {isBn ? 'কোনো carry forward tax দাবি নেই।' : 'No carry forward tax claim.'}
          </p>
        </section>
      )}
    </section>
  );
};
