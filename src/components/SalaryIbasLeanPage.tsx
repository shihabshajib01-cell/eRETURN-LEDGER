import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Language } from '../types';

export const SalaryIbasLeanPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const [claim, setClaim] = useState('1,50,000');
  const isBn = lang === 'bn';

  return (
    <section className="w-full space-y-4" aria-labelledby="salary-ibas-title">
      <header>
        <h1 id="salary-ibas-title" className="text-2xl lg:text-[28px] font-bold text-[#172033] tracking-tight">
          iBAS++ (Salary) TDS
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#5F6B7A]">
          {isBn
            ? 'iBAS++ থেকে প্রাপ্ত বেতনের তথ্য পর্যালোচনা করুন এবং আপনি যে পরিমাণ উৎস কর দাবি করতে চান তা লিখুন।'
            : 'Review salary information provided by iBAS++ and enter the TDS amount you want to claim.'}
        </p>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white" aria-labelledby="salary-info-title">
        <div className="border-b border-[#E2E8F0] bg-slate-50/50 px-5 py-3">
          <h2 id="salary-info-title" className="text-base font-bold text-[#172033]">
            {isBn ? 'iBAS++ বেতন তথ্য' : 'Salary Information from iBAS++'}
          </h2>
          <p className="mt-0.5 text-xs text-[#5F6B7A]">
            {isBn ? 'iBAS++ থেকে প্রদত্ত; শুধু দেখার জন্য।' : 'Provided by iBAS++; read-only.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-[#E2E8F0] md:grid-cols-2">
          <ReadOnlyInfo label={isBn ? 'করবর্ষ' : 'Assessment Year'} value="2026-2027" />
          <ReadOnlyInfo label={isBn ? 'অফিসের নাম' : 'Office Name'} value="Bogura Technical Training Centre, Bogura" />
          <ReadOnlyInfo label={isBn ? 'পদবি' : 'Designation'} value="Principal" />
          <ReadOnlyInfo label={isBn ? 'উপলভ্য উৎস কর' : 'TDS Available'} value="৳ 5,00,450" emphasized />
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white" aria-labelledby="tds-claim-title">
        <div className="border-b border-[#E2E8F0] px-5 py-3">
          <h2 id="tds-claim-title" className="text-base font-bold text-[#172033]">
            {isBn ? 'উৎস কর দাবি' : 'TDS Claim'}
          </h2>
        </div>

        <div className="px-5 py-4">
          <div className="max-w-2xl">
            <label htmlFor="tds-claim" className="mb-2 block text-sm font-semibold text-[#172033]">
              {isBn ? 'দাবির পরিমাণ' : 'Claim Amount'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 font-semibold text-[#5F6B7A]" aria-hidden="true">৳</span>
              <input
                id="tds-claim"
                value={claim}
                onChange={(event) => setClaim(event.target.value)}
                inputMode="decimal"
                className="w-full rounded-lg border border-[#C8D4E1] bg-white py-3 pl-8 pr-3 font-medium text-[#172033] focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20"
              />
            </div>
            <p className="mt-2 text-sm text-[#5F6B7A]">
              {isBn ? 'সর্বোচ্চ উপলভ্য:' : 'Maximum available:'}{' '}
              <span className="font-semibold text-[#172033]">৳ 5,00,450</span>
            </p>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-5 py-2.5 font-semibold text-white hover:bg-[#095D8A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 focus-visible:ring-offset-2"
              >
                <Check className="h-4 w-4" />
                {isBn ? 'দাবি সংরক্ষণ করুন' : 'Save Claim'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

const ReadOnlyInfo = ({ label, value, emphasized = false }: { label: string; value: string; emphasized?: boolean }) => (
  <div className="flex min-h-[80px] flex-col justify-center bg-white px-5 py-3.5">
    <p className="mb-1 text-xs font-semibold text-[#5F6B7A]">{label}</p>
    <p className={`${emphasized ? 'text-xl font-bold text-[#0B6FA4]' : 'text-base font-semibold text-[#263247]'} leading-snug`}>
      {value}
    </p>
  </div>
);
