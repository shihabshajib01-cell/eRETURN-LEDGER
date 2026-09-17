import {
  SummaryCardData,
  PendingActionItem,
  ActivityItem,
  TaxCategoryItem,
  QuickActionItem,
} from '../types';

export const TAXPAYER_PROFILE = {
  name: 'S.M. Emdadul Haque',
  nameBn: 'এস.এম. এমদাদুল হক',
  role: 'Taxpayer',
  roleBn: 'করদাতা',
  assessmentYear: '2026-2027',
};

// Values below are grounded in the supplied current eReturn Ledger screenshots.
// Do not add tax sections, statuses, record counts, or verification behavior here
// unless they are confirmed by the current production flow or API contract.
export const VERIFIED_LEDGER_TOTALS = {
  sourceTax: 13309693,
  advanceIncomeTax: 190365,
  taxPaidWithReturn: 1004342,
  environmentalSurcharge: 50000,
  adjustmentOfTaxRefund: 1003333,
  carryForwardTax: 1003333,
};

export const OTHER_TAX_CREDITS_TOTAL =
  VERIFIED_LEDGER_TOTALS.taxPaidWithReturn +
  VERIFIED_LEDGER_TOTALS.environmentalSurcharge +
  VERIFIED_LEDGER_TOTALS.adjustmentOfTaxRefund +
  VERIFIED_LEDGER_TOTALS.carryForwardTax;

export const TOTAL_AVAILABLE_TAX_CREDIT =
  VERIFIED_LEDGER_TOTALS.sourceTax +
  VERIFIED_LEDGER_TOTALS.advanceIncomeTax +
  OTHER_TAX_CREDITS_TOTAL;

export const formatBDT = (amount: number) =>
  `৳ ${amount.toLocaleString('en-IN')}`;

export const SUMMARY_CARDS: SummaryCardData[] = [
  {
    id: 'source-tax',
    title: 'Source Tax',
    amount: VERIFIED_LEDGER_TOTALS.sourceTax,
    formattedAmount: formatBDT(VERIFIED_LEDGER_TOTALS.sourceTax),
    categoriesCount: 9,
    status: 'Complete',
    supportingText: '9 current Ledger categories',
  },
  {
    id: 'ait',
    title: 'Advance Income Tax (AIT)',
    amount: VERIFIED_LEDGER_TOTALS.advanceIncomeTax,
    formattedAmount: formatBDT(VERIFIED_LEDGER_TOTALS.advanceIncomeTax),
    categoriesCount: 2,
    status: 'Complete',
    supportingText: '2 current Ledger categories',
  },
  {
    id: 'other-credits',
    title: 'Other Tax Credits',
    amount: OTHER_TAX_CREDITS_TOTAL,
    formattedAmount: formatBDT(OTHER_TAX_CREDITS_TOTAL),
    categoriesCount: 4,
    status: 'Complete',
    supportingText: '4 current Ledger categories',
  },
  {
    id: 'total-credit',
    title: 'Total Available Tax Credit',
    amount: TOTAL_AVAILABLE_TAX_CREDIT,
    formattedAmount: formatBDT(TOTAL_AVAILABLE_TAX_CREDIT),
    categoriesCount: 15,
    isHighlighted: true,
    highlightNote: 'Current Ledger total',
    supportingText: 'Reconciled from the current Tax Payment Status screen.',
  },
];

// Do not fabricate pending work from static screenshots. This stays empty until a
// real backend/API state provides actionable records.
export const PENDING_ACTIONS: PendingActionItem[] = [];

// Recent activity requires an audit/event source. Static screenshots do not prove
// event history, so the redesign intentionally shows an empty-state until connected.
export const RECENT_ACTIVITIES: ActivityItem[] = [];

export const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'qa-1',
    title: 'Sync from eReturn Income',
    description: 'Open an income-linked Ledger category',
    iconName: 'RefreshCw',
    actionKey: 'sync-income',
  },
  {
    id: 'qa-2',
    title: 'Add Tax Payment',
    description: 'Open a supported manual-entry category',
    iconName: 'PlusCircle',
    actionKey: 'add-payment',
  },
  {
    id: 'qa-3',
    title: 'View Tax Payment Status',
    description: 'Review reconciled tax credits',
    iconName: 'FileText',
    actionKey: 'view-status',
  },
  {
    id: 'qa-4',
    title: 'Go to eReturn',
    description: 'Return to the eReturn Tax & Payment flow',
    iconName: 'ArrowUpRight',
    actionKey: 'goto-ereturn',
  },
];

export const ALL_TAX_CATEGORIES: TaxCategoryItem[] = [
  {
    id: 'salary-ibas',
    name: 'Salary (iBAS++)',
    code: '',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 0,
    formattedAmount: '—',
    recordsCount: 0,
    status: 'System Record',
    source: 'iBAS++',
    lastUpdated: '—',
  },
  {
    id: 'salary-other',
    name: 'Salary (Others)',
    code: 'Section 86',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 3636074,
    formattedAmount: formatBDT(3636074),
    recordsCount: 5,
    status: 'Claimed',
    source: 'Manual Entry',
    lastUpdated: '—',
  },
  {
    id: 'bank-fi',
    name: 'Bank/FI Interest/Profit',
    code: '',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 0,
    formattedAmount: '—',
    recordsCount: 5,
    status: 'Synced',
    source: 'eReturn Income',
    lastUpdated: '—',
  },
  {
    id: 'dividend',
    name: 'Dividend',
    code: 'Section 117',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 0,
    formattedAmount: '—',
    recordsCount: 5,
    status: 'Synced',
    source: 'eReturn Income',
    lastUpdated: '—',
  },
  {
    id: 'service-payment',
    name: 'Service Payment',
    code: 'Section 90',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 0,
    formattedAmount: '—',
    recordsCount: 6,
    status: 'Claimed',
    source: 'Manual Entry',
    lastUpdated: '—',
  },
  {
    id: 'sanchayapatra',
    name: 'Sanchayapatra',
    code: '',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 0,
    formattedAmount: '—',
    recordsCount: 17,
    status: 'Verified',
    source: 'System Record',
    lastUpdated: '—',
  },
  {
    id: 'import',
    name: 'Import',
    code: 'Section 120',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 1812218,
    formattedAmount: formatBDT(1812218),
    recordsCount: 7,
    status: 'Claimed',
    source: 'System Record',
    lastUpdated: '—',
  },
  {
    id: 'commercial-vehicle',
    name: 'Commercial Vehicle',
    code: '',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 125000,
    formattedAmount: formatBDT(125000),
    recordsCount: 4,
    status: 'Claimed',
    source: 'External Verification',
    lastUpdated: '—',
  },
  {
    id: 'other-tds',
    name: 'Others',
    code: '',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 6970044,
    formattedAmount: formatBDT(6970044),
    recordsCount: 7,
    status: 'Claimed',
    source: 'Manual Entry',
    lastUpdated: '—',
  },
  {
    id: 'ait-car',
    name: 'AIT on Car',
    code: '',
    group: 'AIT',
    groupName: 'Advance Income Tax',
    amount: 0,
    formattedAmount: '—',
    recordsCount: 0,
    status: 'System Record',
    source: 'External Verification',
    lastUpdated: '—',
  },
  {
    id: 'ait-154',
    name: 'AIT under Section 154',
    code: 'Section 154',
    group: 'AIT',
    groupName: 'Advance Income Tax',
    amount: 0,
    formattedAmount: '—',
    recordsCount: 3,
    status: 'Claimed',
    source: 'External Verification',
    lastUpdated: '—',
  },
  {
    id: 'tax-paid-return',
    name: 'Tax Paid with Return (173)',
    code: 'Section 173',
    group: 'OTHER_CREDITS',
    groupName: 'Other Tax Credits',
    amount: VERIFIED_LEDGER_TOTALS.taxPaidWithReturn,
    formattedAmount: formatBDT(VERIFIED_LEDGER_TOTALS.taxPaidWithReturn),
    recordsCount: 5,
    status: 'Claimed',
    source: 'External Verification',
    lastUpdated: '—',
  },
  {
    id: 'environmental-surcharge',
    name: 'Environmental Surcharge',
    code: '',
    group: 'OTHER_CREDITS',
    groupName: 'Other Tax Credits',
    amount: VERIFIED_LEDGER_TOTALS.environmentalSurcharge,
    formattedAmount: formatBDT(VERIFIED_LEDGER_TOTALS.environmentalSurcharge),
    recordsCount: 3,
    status: 'Claimed',
    source: 'Manual Entry',
    lastUpdated: '—',
  },
  {
    id: 'tax-refund',
    name: 'Adjustment of Tax Refund',
    code: '',
    group: 'OTHER_CREDITS',
    groupName: 'Other Tax Credits',
    amount: VERIFIED_LEDGER_TOTALS.adjustmentOfTaxRefund,
    formattedAmount: formatBDT(VERIFIED_LEDGER_TOTALS.adjustmentOfTaxRefund),
    recordsCount: 1,
    status: 'Claimed',
    source: 'Previous Return',
    lastUpdated: '—',
  },
  {
    id: 'carry-forward',
    name: 'Adjustment of carry forward tax u/s 163',
    code: 'Section 163',
    group: 'OTHER_CREDITS',
    groupName: 'Other Tax Credits',
    amount: VERIFIED_LEDGER_TOTALS.carryForwardTax,
    formattedAmount: formatBDT(VERIFIED_LEDGER_TOTALS.carryForwardTax),
    recordsCount: 1,
    status: 'Claimed',
    source: 'Previous Return',
    lastUpdated: '—',
  },
];
