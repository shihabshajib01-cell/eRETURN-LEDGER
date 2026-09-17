import React from 'react';
import { ArrowLeft, ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { Language, LedgerModule } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface LedgerModulePageProps {
  module: LedgerModule;
  lang: Language;
  assessmentYear: string;
  onNavigate: (target: string) => void;
}

const modeLabels: Record<LedgerModule['mode'], { en: string; bn: string }> = {
  'direct-claim': { en: 'Direct claim', bn: 'সরাসরি দাবি' },
  'manual-records': { en: 'Manual records', bn: 'ম্যানুয়াল রেকর্ড' },
  'income-sync': { en: 'eReturn Income sync', bn: 'eReturn Income সিঙ্ক' },
  'sync-and-manual': { en: 'Sync + manual records', bn: 'সিঙ্ক + ম্যানুয়াল রেকর্ড' },
  'system-records': { en: 'System records', bn: 'সিস্টেম রেকর্ড' },
  lookup: { en: 'Lookup workflow', bn: 'অনুসন্ধান প্রবাহ' },
  'existing-flow': { en: 'Existing workflow', bn: 'বিদ্যমান প্রবাহ' },
  'challan-lookup': { en: 'Challan lookup', bn: 'চালান অনুসন্ধান' },
  reconciliation: { en: 'Reconciliation', bn: 'সমন্বয়' },
  adjustment: { en: 'Adjustment', bn: 'সমন্বয় দাবি' },
};

export const LedgerModulePage: React.FC<LedgerModulePageProps> = ({
  module,
  lang,
  assessmentYear,
  onNavigate,
}) => {
  const t = TRANSLATIONS[lang];
  const title = lang === 'bn' ? module.titleBn : module.title;
  const description = lang === 'bn' ? module.descriptionBn : module.description;
  const workflow = lang === 'bn' ? module.workflowBn : module.workflow;
  const mode = lang === 'bn' ? modeLabels[module.mode].bn : modeLabels[module.mode].en;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="mb-3 inline-flex items-center gap-1.5 rounded-md text-xs font-semibold text-[#0B6FA4] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {t.backToDashboard}
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-[#172033]">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5F6B7A]">{description}</p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-[#0B6FA4]">
            {mode}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            {t.assessmentYear}: {assessmentYear}
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#0B6FA4]">
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#172033]">{t.currentWorkflow}</h2>
              <p className="mt-2 text-sm font-semibold text-[#0B6FA4]">{workflow}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#5F6B7A]">{t.pageFoundationDesc}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-bold text-emerald-950">{t.protectedLogic}</h2>
              <p className="mt-2 text-xs leading-relaxed text-emerald-900/80">{t.protectedLogicDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-4" role="note">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-700" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-amber-950">{t.pageFoundationReady}</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-900/80">{t.pageFoundationDesc}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
