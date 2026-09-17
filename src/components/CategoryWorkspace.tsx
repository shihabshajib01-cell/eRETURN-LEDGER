import React from 'react';
import { ArrowLeft, Database, Plus, RefreshCw, Search } from 'lucide-react';
import { Language } from '../types';
import { ALL_TAX_CATEGORIES } from '../data/mockTaxData';
import { SourceBadge, StatusChip } from './StatusChip';

interface CategoryWorkspaceProps {
  categoryId: string;
  lang: Language;
  onBack: () => void;
  onUnavailableAction: (message: string) => void;
}

const actionFor = (id: string, lang: Language) => {
  if (['bank-fi', 'dividend', 'service-payment'].includes(id)) return { label: lang === 'bn' ? 'eReturn Income থেকে সিঙ্ক' : 'Sync from eReturn Income', Icon: RefreshCw };
  if (['commercial-vehicle', 'ait-154', 'tax-paid-return'].includes(id)) return { label: lang === 'bn' ? 'রেকর্ড খুঁজুন' : 'Find Record', Icon: Search };
  if (['salary-other', 'service-payment', 'other-tds', 'environmental-surcharge', 'tax-refund'].includes(id)) return { label: lang === 'bn' ? 'এন্ট্রি যোগ করুন' : 'Add Entry', Icon: Plus };
  return null;
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

export const CategoryWorkspace: React.FC<CategoryWorkspaceProps> = ({ categoryId, lang, onBack, onUnavailableAction }) => {
  const category = ALL_TAX_CATEGORIES.find((item) => item.id === categoryId);
  if (!category) return null;

  const action = actionFor(category.id, lang);
  const ActionIcon = action?.Icon;

  return (
    <section className="space-y-5" aria-labelledby="category-page-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B6FA4] hover:underline mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 rounded">
            <ArrowLeft className="w-3.5 h-3.5" />
            {lang === 'bn' ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}
          </button>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <SourceBadge source={category.source} size="sm" lang={lang} />
            <StatusChip status={category.status} size="sm" lang={lang} />
          </div>
          <h1 id="category-page-title" className="text-2xl lg:text-[28px] font-bold text-[#172033] tracking-tight">{category.name}</h1>
          {category.code && <p className="text-xs font-semibold text-[#0B6FA4] mt-1">{category.code}</p>}
          <p className="text-sm text-[#5F6B7A] mt-2 max-w-3xl leading-relaxed">{descriptionFor(category.id, lang)}</p>
        </div>

        {action && ActionIcon && (
          <button
            type="button"
            onClick={() => onUnavailableAction(lang === 'bn' ? 'এই অ্যাকশনটি বাস্তব API চুক্তি সংযুক্ত না হওয়া পর্যন্ত সিমুলেট করা হচ্ছে না।' : 'This action is not simulated until its real API contract is connected.')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B6FA4] text-white text-sm font-semibold hover:bg-[#095782] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/40 self-start"
          >
            <ActionIcon className="w-4 h-4" />
            {action.label}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#5F6B7A]">{lang === 'bn' ? 'গ্রুপ' : 'Ledger Group'}</p>
          <p className="text-base font-bold text-[#172033] mt-2">{category.groupName}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#5F6B7A]">{lang === 'bn' ? 'রেকর্ড' : 'Visible Records'}</p>
          <p className="text-2xl font-bold text-[#172033] mt-2">{category.recordsCount || '—'}</p>
          <p className="text-xs text-[#5F6B7A] mt-1">{lang === 'bn' ? 'আপলোডকৃত বর্তমান স্ক্রিনশট অনুযায়ী' : 'From the supplied current-state screens'}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#5F6B7A]">{lang === 'bn' ? 'পরিমাণ' : 'Verified Screen Amount'}</p>
          <p className="text-2xl font-bold text-[#172033] mt-2">{category.formattedAmount}</p>
          <p className="text-xs text-[#5F6B7A] mt-1">{lang === 'bn' ? 'যেখানে বর্তমান স্ক্রিনে মোট দেখানো হয়েছে' : 'Only where a current screen exposed a total'}</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#0B6FA4]" />
          <h2 className="text-base font-bold text-[#172033]">{lang === 'bn' ? 'ইমপ্লিমেন্টেশন সীমা' : 'Implementation Boundary'}</h2>
        </div>
        <div className="p-5 text-sm text-[#5F6B7A] leading-relaxed">
          {lang === 'bn'
            ? 'এই পেজটি এখন বাস্তব লেজার নেভিগেশন এবং যাচাইকৃত বর্তমান শ্রেণি কাঠামো ব্যবহার করে। কোনো ট্যাক্স গণনা, সিঙ্ক, যাচাই, চালান অনুসন্ধান বা সেভ আচরণ অনুমান করা হয়নি। পরবর্তী ধাপে বিদ্যমান API/ব্যবসায়িক চুক্তি অনুসারে প্রতিটি ক্যাটাগরির পূর্ণ ফ্লো বসানো যাবে।'
            : 'This page now uses real Ledger navigation and the verified current category structure. No tax calculation, sync, verification, challan lookup, or save behavior is being invented. Each category can now be completed against its existing API and business contract without changing the application shell.'}
        </div>
      </div>
    </section>
  );
};
