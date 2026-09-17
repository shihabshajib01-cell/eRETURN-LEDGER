import React from 'react';
import { ArrowRight, CheckCircle2, Clock, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { CATEGORY_PROGRESS_DATA } from '../data/mockTaxData';
import { TRANSLATIONS } from '../data/translations';

interface CategoryProgressProps {
  lang: Language;
  onViewAllCategories: () => void;
}

export const CategoryProgress: React.FC<CategoryProgressProps> = ({ lang, onViewAllCategories }) => {
  const t = TRANSLATIONS[lang];
  const { total, completed, inProgress, notStarted } = CATEGORY_PROGRESS_DATA;

  // SVG circular calculation
  // Radius = 44, Circumference = 2 * PI * 44 ≈ 276.46
  const radius = 44;
  const circumference = 2 * Math.PI * radius;

  // Segments calculation
  const completedStroke = (completed / total) * circumference;
  const inProgressStroke = (inProgress / total) * circumference;
  const notStartedStroke = (notStarted / total) * circumference;

  return (
    <div 
      id="panel-category-progress"
      className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-2xs h-full"
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-[#172033] tracking-tight">
            {t.categoryProgress}
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {completed}/{total}
          </span>
        </div>

        {/* Circular Progress & Statistics Row */}
        <div className="py-4 flex items-center gap-6">
          {/* Circular SVG Ring */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              
              {/* Not Started Arc (gray) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-300"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={`${notStartedStroke} ${circumference - notStartedStroke}`}
                strokeDashoffset={- (completedStroke + inProgressStroke)}
                strokeLinecap="round"
              />

              {/* In Progress Arc (amber) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-amber-500"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={`${inProgressStroke} ${circumference - inProgressStroke}`}
                strokeDashoffset={- completedStroke}
                strokeLinecap="round"
              />

              {/* Completed Arc (emerald) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-emerald-600 transition-all duration-700 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={`${completedStroke} ${circumference - completedStroke}`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
            </svg>

            {/* Inner text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-bold text-xl text-[#172033] leading-none font-mono">
                {Math.round((completed / total) * 100)}%
              </span>
              <span className="text-[10px] text-[#5F6B7A] font-medium mt-0.5">
                {lang === 'bn' ? 'সম্পন্ন' : 'Complete'}
              </span>
            </div>
          </div>

          {/* Detailed Progress Breakdown */}
          <div className="flex-1 space-y-2.5">
            <div>
              <div className="text-sm font-bold text-[#172033] leading-snug">
                {lang === 'bn' ? '১৪টির মধ্যে ১০টি' : `${completed} of ${total}`}
              </div>
              <div className="text-xs text-[#5F6B7A]">
                {lang === 'bn' ? 'ক্যাটাগরি সম্পূর্ণ সমন্বিত' : 'Categories Complete'}
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>{t.completed}</span>
                </span>
                <span className="font-semibold font-mono text-emerald-800">10</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>{t.inProgress}</span>
                </span>
                <span className="font-semibold font-mono text-amber-800">2</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span>{t.notStarted}</span>
                </span>
                <span className="font-semibold font-mono text-slate-600">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer link: View All Categories -> */}
      <div className="pt-3 border-t border-slate-100">
        <button
          id="btn-view-all-categories"
          onClick={onViewAllCategories}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#0B6FA4] hover:text-[#084c72] hover:bg-blue-50/50 py-1.5 px-2 rounded transition-colors group"
        >
          <span>{t.viewAllCategories}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
