import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Language } from '../types';

export const SalaryIbasLeanPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const [claim, setClaim] = useState('1,50,000');
  const isBn = lang === 'bn';

  return (
    <section className="w-full space-y-4" aria-labelledby="salary-ibas-title">
      <header>
        <h1 id="salary-ibas-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
          iBAS++ (Salary) TDS
        </h1>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="grid grid-cols-1 gap-px bg-[#E2E8F0] md:grid-cols-2">
          <ReadOnlyInfo label={isBn ? 'করবর্ষ' : 'Assessment Year'} value="2026-2027" />
          <ReadOnlyInfo label={isBn ? 'অফিসের নাম' : 'Office Name'} value="Bogura Technical Training Centre, Bogura" />
          <ReadOnlyInfo label={isBn ? 'পদবি' : 'Designation'} value="Principal" />
          <ReadOnlyInfo label={isBn ? 'উপলভ্য উৎস কর' : 'TDS Available'} value="5,00,450" emphasized />
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white" aria-labelledby="tds-claim-title">
        <div className="px-5 py-4">
          <div className="max-w-2xl">
            <label id="tds-claim-title" htmlFor="tds-claim" className="mb-2 block text-sm font-semibold text-[#172033]">TDS Claim</label>
            <input
              id="tds-claim"
              value={claim}
              onChange={(event) => setClaim(event.target.value)}
              inputMode="decimal"
              className="w-full rounded-lg border border-[#C8D4E1] bg-white px-3 py-3 font-medium text-[#172033] focus:border-[#0B6FA4] focus:outline-none focus:ring-2 focus:ring-[#0B6FA4]/20"
            />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0B6FA4] px-5 py-2.5 font-semibold text-white hover:bg-[#095D8A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6FA4]/30 focus-visible:ring-offset-2"
              >
                <Check className="h-4 w-4" />
                Save
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
