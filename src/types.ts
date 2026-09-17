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
  id: 'source-tax' | 'ait' | 'other-credits' | 'total-credit';
  title: string;
  titleBn: string;
  amount: number;
  formattedAmount: string;
  supportingText: string;
  supportingTextBn: string;
  isHighlighted?: boolean;
}

export type LedgerWorkflowMode =
  | 'direct-claim'
  | 'manual-records'
  | 'income-sync'
  | 'sync-and-manual'
  | 'system-records'
  | 'lookup'
  | 'existing-flow'
  | 'challan-lookup'
  | 'reconciliation'
  | 'adjustment';

export interface LedgerModule {
  id: string;
  group: 'source-tax' | 'ait' | 'other-credits';
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  workflow: string;
  workflowBn: string;
  mode: LedgerWorkflowMode;
}

export interface LedgerNavGroup {
  id: 'source-tax' | 'ait' | 'other-credits';
  title: string;
  titleBn: string;
  itemIds: string[];
}

export interface TaxPaymentStatusItem {
  id: string;
  label: string;
  labelBn: string;
  amount: number;
  formattedAmount: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  target: string;
}
