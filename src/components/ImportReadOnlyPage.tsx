import React, { useEffect, useMemo } from 'react';
import { Language } from '../types';
import { LedgerTable, LedgerTableBody, LedgerTableFrame, LedgerTableHead, LedgerTableSummaryGroup, LedgerTableSummaryItem, LedgerTableToolbar, LedgerTableViewport } from './table/LedgerTable';
import { useLedgerRuntime } from '../state/LedgerRuntimeContext';
import { formatLedgerNumber, parseMoney } from '../utils/money';

type ImportRow = {
  id: number;
  bin: string;
  office: string;
  bill: string;
  billDate: string;
  receipt: string;
  receiptDate: string;
  invoice: string;
  assessable: string;
  duties: string;
  claimed: string;
};

const IMPORT_ROWS: ImportRow[] = [
  { id: 1, bin: '004905634-0503', office: '301', bill: '1629442', billDate: '01-09-2025', receipt: '1694061', receiptDate: '02-09-2025', invoice: '39,75,049', assessable: '40,54,550', duties: '25,10,891', claimed: '2,02,727' },
  { id: 2, bin: '004905634-0503', office: '101', bill: '939642', billDate: '22-09-2025', receipt: '968764', receiptDate: '23-09-2025', invoice: '613', assessable: '626', duties: '431', claimed: '31' },
  { id: 3, bin: '004905634-0503', office: '301', bill: '1674032', billDate: '09-09-2025', receipt: '1768177', receiptDate: '15-09-2025', invoice: '31,08,500', assessable: '63,56,829', duties: '49,19,743', claimed: '3,17,841' },
  { id: 4, bin: '004905634-0503', office: '301', bill: '1776639', billDate: '28-09-2025', receipt: '1907828', receiptDate: '09-10-2025', invoice: '36,79,553', assessable: '64,63,299', duties: '49,94,297', claimed: '3,23,164' },
  { id: 5, bin: '004905634-0503', office: '301', bill: '2021438', billDate: '09-11-2025', receipt: '2118668', receiptDate: '12-11-2025', invoice: '34,87,332', assessable: '68,40,260', duties: '53,06,753', claimed: '3,42,013' },
  { id: 6, bin: '004905634-0503', office: '301', bill: '2085468', billDate: '18-11-2025', receipt: '2199946', receiptDate: '24-11-2025', invoice: '35,32,407', assessable: '62,04,982', duties: '47,94,367', claimed: '3,10,249' },
  { id: 7, bin: '004905634-0503', office: '301', bill: '2319200', billDate: '22-12-2025', receipt: '2421826', receiptDate: '24-12-2025', invoice: '35,40,758', assessable: '63,23,863', duties: '49,06,327', claimed: '3,16,193' },
];

const columns = [
  ['bin', 'Bin', 'BIN'],
  ['office', 'Office Code', 'অফিস কোড'],
  ['bill', 'Bill of Entry', 'বিল অব এন্ট্রি'],
  ['billDate', 'Bill of Entry Date', 'বিল অব এন্ট্রির তারিখ'],
  ['receipt', 'Receipt No.', 'রসিদ নং'],
  ['receiptDate', 'Receipt Date', 'রসিদের তারিখ'],
  ['invoice', 'Invoice Value', 'ইনভয়েস মূল্য'],
  ['assessable', 'Assessable Value', 'Assessable Value'],
  ['duties', 'Total Tax & Duties', 'মোট কর ও শুল্ক'],
  ['claimed', 'TDS Claimed', 'দাবিকৃত TDS'],
] as const;

export const ImportReadOnlyPage: React.FC<{ lang: Language }> = ({ lang }) => {
  const isBn = lang === 'bn';
  const { updateCategoryAmount } = useLedgerRuntime();

  const total = useMemo(
    () => IMPORT_ROWS.reduce((sum, row) => sum + parseMoney(row.claimed), 0),
    []
  );

  useEffect(() => {
    updateCategoryAmount('import', total);
  }, [total, updateCategoryAmount]);

  return (
    <section className="ledger-page w-full" aria-labelledby="import-title">
      <header className="min-w-0">
        <h1 id="import-title" className="text-2xl lg:text-[28px] font-bold tracking-tight text-[#172033]">
          {isBn ? 'Import (120) TDS Details' : 'Import (120) TDS Details'}
        </h1>
      </header>

      <LedgerTableFrame>
        <LedgerTableToolbar>
          <LedgerTableSummaryGroup>
            <LedgerTableSummaryItem label={isBn ? 'মোট দাবিকৃত TDS' : 'Total TDS Claimed'} value={formatLedgerNumber(total)} accent />
            <div className="h-9 w-px bg-[#E2E8F0]" aria-hidden="true" />
            <LedgerTableSummaryItem label={isBn ? 'রেকর্ড' : 'Records'} value={IMPORT_ROWS.length} />
          </LedgerTableSummaryGroup>
        </LedgerTableToolbar>
        <LedgerTableViewport>
          <LedgerTable className="ledger-responsive-table w-full min-w-[1180px] text-sm">
            <LedgerTableHead>
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-semibold">SL.</th>
                {columns.map(([key, en, bn]) => (
                  <th
                    key={key}
                    scope="col"
                    className={`px-4 py-3 font-semibold ${['invoice', 'assessable', 'duties', 'claimed'].includes(key) ? 'text-right' : 'text-left'}`}
                  >
                    {isBn ? bn : en}
                  </th>
                ))}
              </tr>
            </LedgerTableHead>
            <LedgerTableBody>
              {IMPORT_ROWS.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td data-label="SL." className="px-4 py-3 text-slate-500">{index + 1}</td>
                  {columns.map(([key, en, bn]) => (
                    <td
                      key={key}
                      data-label={isBn ? bn : en}
                      className={`px-4 py-3 ${['invoice', 'assessable', 'duties', 'claimed'].includes(key) ? 'text-right font-medium' : ''}`}
                    >
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </LedgerTableBody>
          </LedgerTable>
        </LedgerTableViewport>
      </LedgerTableFrame>
    </section>
  );
};
