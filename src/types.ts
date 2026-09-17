export type Language = 'en' | 'bn';

export type AssessmentYear = '2026-2027' | '2025-2026' | '2024-2025';

export type TaxStatus = 
  | 'Verified'
  | 'Claimed'
  | 'Synced'
  | 'Complete'
  | 'Pending'
  | 'Needs Review'
  | 'Review'
  | 'Not Started'
  | 'System Record';

export type DataSource = 
  | 'iBAS++'
  | 'eReturn Income'
  | 'System Record'
  | 'External Verification'
  | 'Manual Entry'
  | 'Previous Return';

export interface SummaryCardData {
  id: string;
  title: string;
  amount: number;
  formattedAmount: string;
  categoriesCount: number;
  recordsCount: number;
  status?: 'Complete' | 'Review' | 'Pending';
  isHighlighted?: boolean;
  highlightNote?: string;
  supportingText?: string;
}

export interface PendingActionItem {
  id: string;
  title: string;
  description: string;
  actionText: string;
  actionType: 'sync' | 'claim' | 'review';
  categoryKey: string;
  recordsAvailable?: number;
  amount?: number;
}

export interface ActivityItem {
  id: string;
  dateTime: string;
  activity: string;
  category: string;
  status: 'Success' | 'Pending' | 'Failed';
  source?: DataSource;
  amount?: string;
}

export interface TaxCategoryItem {
  id: string;
  name: string;
  code: string;
  group: 'SOURCE_TAX' | 'AIT' | 'OTHER_CREDITS';
  groupName: string;
  amount: number;
  formattedAmount: string;
  recordsCount: number;
  status: TaxStatus;
  source: DataSource;
  lastUpdated: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  actionKey: 'sync-income' | 'add-payment' | 'view-status' | 'goto-ereturn';
}
