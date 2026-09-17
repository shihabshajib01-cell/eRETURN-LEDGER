import React, { useState } from 'react';
import { X, Search, Filter, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import { Language, TaxCategoryItem } from '../../types';
import { ALL_TAX_CATEGORIES } from '../../data/mockTaxData';
import { TRANSLATIONS } from '../../data/translations';
import { StatusChip, SourceBadge } from '../StatusChip';

interface AllCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AllCategoriesModal: React.FC<AllCategoriesModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredCategories = ALL_TAX_CATEGORIES.filter((cat) => {
    const matchesSearch = 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'ALL' || cat.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const totalAmount = ALL_TAX_CATEGORIES.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        id="all-categories-modal-panel"
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0B6FA4] border border-blue-100 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#172033]">
                All Tax Categories & Reconciled Heads
              </h3>
              <p className="text-xs text-[#5F6B7A]">
                14 Total Heads • Assessment Year 2026–2027
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Filter, Record Count */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search category or tax section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B6FA4]/20 focus:border-[#0B6FA4]"
            />
          </div>

          {/* Group Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'ALL', label: 'All (14)' },
              { id: 'SOURCE_TAX', label: 'Source Tax (6)' },
              { id: 'AIT', label: 'AIT (3)' },
              { id: 'OTHER_CREDITS', label: 'Other Credits (5)' }
            ].map((grp) => (
              <button
                key={grp.id}
                onClick={() => setSelectedGroup(grp.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedGroup === grp.id
                    ? 'bg-[#0B6FA4] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Table */}
        <div className="overflow-y-auto flex-1 p-0">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Category & Section</th>
                <th className="py-2.5 px-4">Group</th>
                <th className="py-2.5 px-4">Origin Source</th>
                <th className="py-2.5 px-4">Records</th>
                <th className="py-2.5 px-4 text-right">Amount (BDT)</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{cat.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{cat.code}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {cat.groupName}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <SourceBadge source={cat.source} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {cat.recordsCount > 0 ? `${cat.recordsCount} records` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold font-mono text-slate-900">
                    {cat.formattedAmount}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusChip status={cat.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with grand total */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-600 font-medium">
            Showing {filteredCategories.length} categories
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-600 font-semibold">Total Verified Credit:</span>
            <span className="font-bold font-mono text-base text-[#0B6FA4]">
              ৳ {totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
