import { 
  SummaryCardData, 
  PendingActionItem, 
  ActivityItem, 
  TaxCategoryItem, 
  QuickActionItem 
} from '../types';

export const TAXPAYER_PROFILE = {
  name: 'S.M. Emdadul Haque',
  nameBn: 'এস.এম. এমদাদুল হক',
  role: 'Taxpayer',
  roleBn: 'করদাতা',
  tin: '4829-1039-4812',
  circle: 'Taxes Circle-120 (Companies & Individuals)',
  zone: 'Taxes Zone-06, Dhaka',
  assessmentYear: '2026–2027',
};

export const SUMMARY_CARDS: SummaryCardData[] = [
  {
    id: 'source-tax',
    title: 'Source Tax',
    amount: 13309693,
    formattedAmount: '৳ 1,33,09,693',
    categoriesCount: 8,
    recordsCount: 142,
    status: 'Complete',
    supportingText: 'From 8 categories • 142 records'
  },
  {
    id: 'ait',
    title: 'Advance Income Tax (AIT)',
    amount: 190365,
    formattedAmount: '৳ 1,90,365',
    categoriesCount: 2,
    recordsCount: 18,
    status: 'Complete',
    supportingText: '2 categories • 18 records'
  },
  {
    id: 'other-credits',
    title: 'Other Tax Credits',
    amount: 3107675,
    formattedAmount: '৳ 31,07,675',
    categoriesCount: 4,
    recordsCount: 32,
    status: 'Review',
    supportingText: '4 categories • 32 records'
  },
  {
    id: 'total-credit',
    title: 'Total Available Tax Credit',
    amount: 16561066,
    formattedAmount: '৳ 1,65,61,066',
    categoriesCount: 14,
    recordsCount: 192,
    isHighlighted: true,
    highlightNote: 'Ready to use in eReturn',
    supportingText: 'All eligible tax credits are summarized.'
  }
];

export const CATEGORY_PROGRESS_DATA = {
  total: 14,
  completed: 10,
  inProgress: 2,
  notStarted: 2,
  percentage: Math.round((10 / 14) * 100) // 71%
};

export const PENDING_ACTIONS: PendingActionItem[] = [
  {
    id: 'pa-1',
    title: 'Dividend',
    description: '3 income records available to sync from eReturn Income',
    actionText: 'Sync Now',
    actionType: 'sync',
    categoryKey: 'dividend',
    recordsAvailable: 3,
    amount: 145000
  },
  {
    id: 'pa-2',
    title: 'AIT under Section 154',
    description: '1 challan available to claim',
    actionText: 'Claim Now',
    actionType: 'claim',
    categoryKey: 'ait-154',
    recordsAvailable: 1,
    amount: 65365
  },
  {
    id: 'pa-3',
    title: 'Environmental Surcharge',
    description: 'Declared amount is not matched with payment records',
    actionText: 'Review',
    actionType: 'review',
    categoryKey: 'environmental-surcharge',
    amount: 350000
  }
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    dateTime: '24 Nov 2025 10:42 AM',
    activity: 'Claimed TDS',
    category: 'Import (120)',
    status: 'Success',
    source: 'iBAS++',
    amount: '৳ 4,20,500'
  },
  {
    id: 'act-2',
    dateTime: '24 Nov 2025 09:15 AM',
    activity: 'Synced 5 records',
    category: 'Bank/FI Interest',
    status: 'Success',
    source: 'eReturn Income',
    amount: '৳ 1,15,400'
  },
  {
    id: 'act-3',
    dateTime: '23 Nov 2025 05:30 PM',
    activity: 'Added payment',
    category: 'Environmental Surcharge',
    status: 'Success',
    source: 'Manual Entry',
    amount: '৳ 3,50,000'
  },
  {
    id: 'act-4',
    dateTime: '21 Nov 2025 01:10 PM',
    activity: 'Updated challan',
    category: 'AIT (154)',
    status: 'Success',
    source: 'System Record',
    amount: '৳ 65,365'
  },
  {
    id: 'act-5',
    dateTime: '19 Nov 2025 11:22 AM',
    activity: 'Claimed refund',
    category: 'Adjustment of Tax Refund',
    status: 'Success',
    source: 'Previous Return',
    amount: '৳ 8,57,675'
  }
];

export const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'qa-1',
    title: 'Sync from eReturn Income',
    description: 'Import eligible income records',
    iconName: 'RefreshCw',
    actionKey: 'sync-income'
  },
  {
    id: 'qa-2',
    title: 'Add Tax Payment',
    description: 'Manually add a tax record',
    iconName: 'PlusCircle',
    actionKey: 'add-payment'
  },
  {
    id: 'qa-3',
    title: 'View Tax Payment Status',
    description: 'Review total available credits',
    iconName: 'FileText',
    actionKey: 'view-status'
  },
  {
    id: 'qa-4',
    title: 'Go to eReturn',
    description: 'Continue to Tax & Payment',
    iconName: 'ArrowUpRight',
    actionKey: 'goto-ereturn'
  }
];

export const ALL_TAX_CATEGORIES: TaxCategoryItem[] = [
  // Group 1: Source Tax (TDS)
  {
    id: 'cat-1',
    name: 'Salary',
    code: 'Section 117 / 118',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 4520000,
    formattedAmount: '৳ 45,20,000',
    recordsCount: 12,
    status: 'Verified',
    source: 'iBAS++',
    lastUpdated: '24 Nov 2025'
  },
  {
    id: 'cat-2',
    name: 'Financial Assets & Interest',
    code: 'Section 102 / 103',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 3815400,
    formattedAmount: '৳ 38,15,400',
    recordsCount: 48,
    status: 'Verified',
    source: 'External Verification',
    lastUpdated: '24 Nov 2025'
  },
  {
    id: 'cat-3',
    name: 'Service & Professional',
    code: 'Section 119 / 120',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 3254293,
    formattedAmount: '৳ 32,54,293',
    recordsCount: 64,
    status: 'Claimed',
    source: 'iBAS++',
    lastUpdated: '24 Nov 2025'
  },
  {
    id: 'cat-4',
    name: 'Trade & Other',
    code: 'Section 121 - 135',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 1720000,
    formattedAmount: '৳ 17,20,000',
    recordsCount: 18,
    status: 'Verified',
    source: 'iBAS++',
    lastUpdated: '22 Nov 2025'
  },
  {
    id: 'cat-5',
    name: 'Dividend Income',
    code: 'Section 117A',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 0,
    formattedAmount: '৳ 0',
    recordsCount: 0,
    status: 'Pending',
    source: 'eReturn Income',
    lastUpdated: 'Pending Sync'
  },
  {
    id: 'cat-6',
    name: 'Contractor & Supplier',
    code: 'Section 115',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 0,
    formattedAmount: '৳ 0',
    recordsCount: 0,
    status: 'Not Started',
    source: 'System Record',
    lastUpdated: 'None'
  },

  // Group 2: Advance Income Tax (AIT)
  {
    id: 'cat-7',
    name: 'AIT on Motor Car',
    code: 'Section 153',
    group: 'AIT',
    groupName: 'Advance Income Tax',
    amount: 125000,
    formattedAmount: '৳ 1,25,000',
    recordsCount: 2,
    status: 'Verified',
    source: 'External Verification',
    lastUpdated: '20 Nov 2025'
  },
  {
    id: 'cat-8',
    name: 'AIT under Section 154',
    code: 'Section 154 (Challan)',
    group: 'AIT',
    groupName: 'Advance Income Tax',
    amount: 65365,
    formattedAmount: '৳ 65,365',
    recordsCount: 16,
    status: 'Needs Review',
    source: 'iBAS++',
    lastUpdated: '21 Nov 2025'
  },

  // Group 3: Other Tax Credits
  {
    id: 'cat-9',
    name: 'Tax Paid with Return (173)',
    code: 'Section 173',
    group: 'OTHER_CREDITS',
    groupName: 'Other Tax Credits',
    amount: 1500000,
    formattedAmount: '৳ 15,00,000',
    recordsCount: 1,
    status: 'Verified',
    source: 'Manual Entry',
    lastUpdated: '23 Nov 2025'
  },
  {
    id: 'cat-10',
    name: 'Environmental Surcharge',
    code: 'Surcharge Schedule',
    group: 'OTHER_CREDITS',
    groupName: 'Other Tax Credits',
    amount: 350000,
    formattedAmount: '৳ 3,50,000',
    recordsCount: 1,
    status: 'Needs Review',
    source: 'Manual Entry',
    lastUpdated: '23 Nov 2025'
  },
  {
    id: 'cat-11',
    name: 'Adjustment of Tax Refund',
    code: 'Section 160 / Previous AY',
    group: 'OTHER_CREDITS',
    groupName: 'Other Tax Credits',
    amount: 857675,
    formattedAmount: '৳ 8,57,675',
    recordsCount: 2,
    status: 'Verified',
    source: 'Previous Return',
    lastUpdated: '19 Nov 2025'
  },
  {
    id: 'cat-12',
    name: 'Adjustment of Carry Forward Tax u/s 163',
    code: 'Section 163',
    group: 'OTHER_CREDITS',
    groupName: 'Other Tax Credits',
    amount: 400000,
    formattedAmount: '৳ 4,00,000',
    recordsCount: 1,
    status: 'Verified',
    source: 'Previous Return',
    lastUpdated: '18 Nov 2025'
  },
  {
    id: 'cat-13',
    name: 'AIT on Export',
    code: 'Section 123',
    group: 'AIT',
    groupName: 'Advance Income Tax',
    amount: 0,
    formattedAmount: '৳ 0',
    recordsCount: 0,
    status: 'Not Started',
    source: 'External Verification',
    lastUpdated: 'None'
  },
  {
    id: 'cat-14',
    name: 'TDS on House Property Rent',
    code: 'Section 114',
    group: 'SOURCE_TAX',
    groupName: 'Claim Source Tax',
    amount: 0,
    formattedAmount: '৳ 0',
    recordsCount: 0,
    status: 'Not Started',
    source: 'System Record',
    lastUpdated: 'None'
  }
];
