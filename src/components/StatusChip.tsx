import React from 'react';
import { TaxStatus, DataSource, Language } from '../types';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  FileCheck,
  HelpCircle,
  Database,
  Building2,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

interface StatusChipProps {
  status: TaxStatus;
  size?: 'sm' | 'md';
  className?: string;
  lang?: Language;
}

const statusBn: Record<TaxStatus, string> = {
  Verified: 'যাচাইকৃত',
  Claimed: 'দাবিকৃত',
  Synced: 'সিঙ্কড',
  Complete: 'সম্পন্ন',
  Pending: 'অপেক্ষমান',
  'Needs Review': 'পর্যালোচনা প্রয়োজন',
  Review: 'পর্যালোচনা',
  'Not Started': 'শুরু হয়নি',
  'System Record': 'সিস্টেম রেকর্ড',
};

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'md', className = '', lang = 'en' }) => {
  const config = (() => {
    switch (status) {
      case 'Complete':
      case 'Verified':
        return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> };
      case 'Claimed':
        return { bg: 'bg-blue-50 border-blue-200 text-[#0B6FA4]', icon: <FileCheck className="w-3.5 h-3.5 text-[#0B6FA4] shrink-0" /> };
      case 'Synced':
        return { bg: 'bg-sky-50 border-sky-200 text-sky-800', icon: <RefreshCw className="w-3.5 h-3.5 text-sky-600 shrink-0" /> };
      case 'Review':
      case 'Needs Review':
        return { bg: 'bg-amber-50 border-amber-200 text-amber-800', icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> };
      case 'Pending':
        return { bg: 'bg-slate-100 border-slate-200 text-slate-700', icon: <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" /> };
      case 'Not Started':
        return { bg: 'bg-gray-100 border-gray-200 text-gray-600', icon: <HelpCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" /> };
      case 'System Record':
        return { bg: 'bg-indigo-50 border-indigo-200 text-indigo-800', icon: <Database className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> };
    }
  })();

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${config.bg} ${sizeClasses} ${className} whitespace-nowrap`}>
      {config.icon}
      <span>{lang === 'bn' ? statusBn[status] : status}</span>
    </span>
  );
};

interface SourceBadgeProps {
  source: DataSource;
  size?: 'sm' | 'md';
  className?: string;
  lang?: Language;
}

const sourceBn: Record<DataSource, string> = {
  'iBAS++': 'iBAS++',
  'eReturn Income': 'eReturn Income',
  'System Record': 'সিস্টেম রেকর্ড',
  'External Verification': 'বাহ্যিক যাচাই',
  'Manual Entry': 'ম্যানুয়াল এন্ট্রি',
  'Previous Return': 'পূর্ববর্তী রিটার্ন',
};

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, size = 'md', className = '', lang = 'en' }) => {
  const getSourceIcon = (src: DataSource) => {
    switch (src) {
      case 'iBAS++': return <Building2 className="w-3 h-3 text-[#0B6FA4]" />;
      case 'eReturn Income': return <FileSpreadsheet className="w-3 h-3 text-emerald-600" />;
      case 'System Record': return <Database className="w-3 h-3 text-slate-600" />;
      case 'External Verification': return <CheckCircle2 className="w-3 h-3 text-teal-600" />;
      case 'Manual Entry': return <FileText className="w-3 h-3 text-amber-700" />;
      case 'Previous Return': return <Clock className="w-3 h-3 text-indigo-600" />;
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded bg-slate-100/90 text-slate-700 border border-slate-200 font-medium ${sizeClasses} ${className} whitespace-nowrap`}>
      {getSourceIcon(source)}
      <span>{lang === 'bn' ? sourceBn[source] : source}</span>
    </span>
  );
};
