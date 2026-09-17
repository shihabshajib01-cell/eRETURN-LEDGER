import React, { useState } from 'react';
import { X, Search, Layers } from 'lucide-react';
import { Language } from '../../types';
import { ALL_TAX_CATEGORIES } from '../../data/mockTaxData';
import { StatusChip, SourceBadge } from '../StatusChip';

interface AllCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AllCategoriesModal: React.FC<AllCategoriesModalProps> = ({ isOpen, onClose, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredCategories = ALL_TAX_CATEGORIES.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || cat.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'ALL' || cat.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const sourceCount = ALL_TAX_CATEGORIES.filter((cat) => cat.group === 'SOURCE_TAX').length;
  const aitCount = ALL_TAX_CATEGORIES.filter((cat) => cat.group === 'AIT').length;
  const otherCount = ALL_TAX_CATEGORIES.filter((cat) => cat.group === 'OTHER_CREDITS').length;

  const groups = [
    { id: 'ALL', label: lang === 'bn' ? `সব (${ALL_TAX_CATEGORIES.length})` : `All (${ALL_TAX_CATEGORIES.length})` },
    { id: 'SOURCE_TAX', label: lang === 'bn' ? `উৎস কর (${sourceCount})` : `Source Tax (${sourceCount})` },
    { id: 'AIT', label: `AIT (${aitCount})` },
    { id: 'OTHER_CREDITS', label: lang === 'bn' ? `অন্যান্য ক্রেডিট (${otherCount})` : `Other Credits (${otherCount})` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-categories-title"
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0B6FA4] flex items-center justify-center shrink-0"><Layers className="w-4 h-4" /></div>
            <div className="min-w-0">
              <h2 id="all-categories-title" className="font-bold text-base text-[#172033] truncate">
                {lang === 'bn' ? 'লেজারের সকল বর্তমান ক্যাটাগরি' : 'Current Ledger Categories'}
              </h2>
              <p className="text-xs text-[#5F6B7A]">{ALL_TAX_CATEGORIES.length} {lang === 'bn' ? 'টি যাচাইকৃত বর্তমান গন্তব্য' : 'verified current destinations'}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'} className="p-2 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 border-b border-slate-200 bg-white flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          <div className="relative w-full lg:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="search"
              aria-label={lang === 'bn' ? 'ক্যাটাগরি খুঁজুন' : 'Search categories'}
              placeholder={lang === 'bn' ? 'ক্যাটাগরি বা ধারা খুঁজুন...' : 'Search category or section...'}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20 focus:border-[#0B6FA4]"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {groups.map((group) => (
              <button
                type="button"
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40 ${selectedGroup === group.id ? 'bg-[#0B6FA4] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse text-xs min-w-[880px]">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold tracking-wider z-10">
              <tr>
                <th className="py-2.5 px-4">{lang === 'bn' ? 'ক্যাটাগরি ও ধারা' : 'Category & Section'}</th>
                <th className="py-2.5 px-4">{lang === 'bn' ? 'গ্রুপ' : 'Group'}</th>
                <th className="py-2.5 px-4">{lang === 'bn' ? 'ডেটা উৎস' : 'Origin Source'}</th>
                <th className="py-2.5 px-4">{lang === 'bn' ? 'রেকর্ড' : 'Records'}</th>
                <th className="py-2.5 px-4 text-right">{lang === 'bn' ? 'স্ক্রিনে প্রদর্শিত মোট' : 'Screen Total'}</th>
                <th className="py-2.5 px-4 text-right">{lang === 'bn' ? 'অবস্থা' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4"><div className="font-bold text-slate-900">{cat.name}</div>{cat.code && <div className="text-[11px] text-slate-500">{cat.code}</div>}</td>
                  <td className="py-3 px-4 text-slate-600">{cat.groupName}</td>
                  <td className="py-3 px-4"><SourceBadge source={cat.source} size="sm" /></td>
                  <td className="py-3 px-4 text-slate-600">{cat.recordsCount > 0 ? cat.recordsCount : '—'}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">{cat.formattedAmount}</td>
                  <td className="py-3 px-4 text-right"><StatusChip status={cat.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
          {lang === 'bn'
            ? `দেখানো হচ্ছে ${filteredCategories.length} টি ক্যাটাগরি। ক্যাটাগরি-ভিত্তিক পরিমাণগুলো আংশিক স্ক্রিন মোট; এগুলো যোগ করে মোট ট্যাক্স ক্রেডিট গণনা করা হয় না।`
            : `Showing ${filteredCategories.length} categories. Category-level amounts are partial screen totals and are not summed to calculate the overall tax credit.`}
        </div>
      </div>
    </div>
  );
};
