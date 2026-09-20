import React from 'react';
import { Language } from '../types';

export const LedgerHomePage: React.FC<{ lang: Language }> = () => {
  return (
    <section className="w-full" aria-labelledby="ledger-home-title">
      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <div className="border-b border-[#E2E8F0] px-5 py-5 sm:px-6">
          <h1 id="ledger-home-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
            eReturn <span className="font-medium">LEDGER</span>
          </h1>
        </div>

        <div className="space-y-6 px-5 py-5 text-sm leading-7 text-[#263247] sm:px-6">
          <section aria-labelledby="ledger-update-title">
            <h2 id="ledger-update-title" className="mb-2 text-base font-bold text-[#172033]">
              How you will update your source tax and AIT payments made between 1 July 2025 to 30 June 2026
            </h2>
            <ul className="list-disc space-y-1 pl-6">
              <li>Click 'Claim Source Tax' in the menu at the left to update your source tax payments.</li>
              <li>Select your source tax category. For example, if you have paid source tax against your iBAS pay bill, select 'iBAS++ (Salary)'.</li>
              <li>Input your source tax amount in 'TDS Claim' field and click 'Save' button. Verified source tax amount will display in output lines.</li>
              <li>If you want to edit any source tax figure in output line, click 'Edit' icon and enter changed source tax amount in 'TDS Claim' field.</li>
              <li>For dropping entire output line of any source tax, click 'Delete' icon.</li>
              <li>When you finish the update of all available source taxes, go to 'Tax Payment Status' in the menu to find your verified source tax amount.</li>
              <li>Select 'Go to eReturn' for going back to eReturn system and complete remaining tasks once you are done with update.</li>
            </ul>
            <p className="mt-3 font-bold text-[#172033]">Guidelines for AIT verification will be added gradually.</p>
          </section>

          <section className="border-t border-[#E2E8F0] pt-5" aria-labelledby="search-option-title">
            <h2 id="search-option-title" className="mb-1 text-base font-bold text-[#172033]">Search Option</h2>
            <p>Click 'Search' button to know what is your source tax amount according to the system of your withholding agents.</p>
          </section>

          <section className="rounded-lg border border-[#D7E8F2] bg-[#F5FAFD] p-4" aria-labelledby="want-to-know-title">
            <h2 id="want-to-know-title" className="mb-2 text-sm font-bold text-[#0B6FA4]">You may want to know</h2>
            <ul className="list-disc space-y-1 pl-6 text-[#39526A]">
              <li>Online verification of source tax usually requires connectivity with withholding agent’s system. The process may take some time ranging from few seconds to few minutes.</li>
              <li>Connectivity with many systems of withholding agents is under process. All your source tax and advance tax payments may not yet display as 'Verified Tax payment' due to the fact that your withholding agent has not yet connected to eReturn Ledger system. In such case, if you like to submit paper return instead of filing online, you may get a system-prepared offline (paper) return.</li>
              <li>Select 'Go to eReturn' option, and in 'Tax &amp; Payment' page of eReturn, click 'Proceed to offline (paper) return' to get your offline (paper) return prepared by eReturn system.</li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
};
