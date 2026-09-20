import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');

const files = {
  app: read('src/App.tsx'),
  home: read('src/components/LedgerHomePage.tsx'),
  ibas: read('src/components/SalaryIbasLeanPage.tsx'),
  salaryOther: read('src/components/SalaryOtherLeanPage.tsx'),
  bank: read('src/components/BankFiLeanPage.tsx'),
  dividend: read('src/components/DividendLeanPage.tsx'),
  service: read('src/components/ServicePaymentLeanPage.tsx'),
  workspace: read('src/components/CategoryWorkspace.tsx'),
  status: read('src/components/TaxPaymentStatusPage.tsx'),
  runtime: read('src/state/LedgerRuntimeContext.tsx'),
};

const fail = (message) => {
  console.error('Ledger audit failed:', message);
  process.exitCode = 1;
};

const expectContains = (name, content, expected) => {
  for (const value of expected) {
    if (!content.includes(value)) fail(`${name} is missing: ${value}`);
  }
};

expectContains('Home', files.home, [
  'How you will update your source tax and AIT payments made between 1 July 2025 to 30 June 2026',
  'Search Option',
  'You may want to know',
]);

expectContains('iBAS', files.ibas, [
  'iBAS++ (Salary) TDS',
  'Bogura Technical Training Centre, Bogura',
  'Principal',
  '5,00,450',
  'TDS Claim',
]);

expectContains('Salary Others', files.salaryOther, [
  'Salary [ Section-86]',
  '36,36,074',
  'Challan/ Certificate Reference No.',
  'Challan/ Certificate Date',
  'Challan/ Certificate Amount',
]);

expectContains('Bank TDS', files.bank, [
  'Bank TDS',
  'Interest/Profit (Bank & FI - With TDS Deduction)',
  'Sync From Income',
]);

expectContains('Dividend', files.dividend, [
  'Dividend [ Section-117]',
  'Certificate Reference No',
  'Certificate Reference Date',
]);

expectContains('Service Payment', files.service, [
  'Meeting Fees, Honorarium, Professional Service, Consultancy etc. [Section-90]',
  'Sync From Income',
  'Challan/ Certificate Amount',
]);

expectContains('Tax Payment Status', files.status, [
  'Tax Payment Status',
  'Particulars',
  'Amount',
  'Update tax payment using Menu in left',
  'Go to eReturn',
  'runtime.total',
]);

expectContains('Shared runtime', files.runtime, [
  'sourceTax: 13309693',
  'advanceIncomeTax: 190365',
  'taxPaidWithReturn: 1004342',
  'environmentalSurcharge: 50000',
  'adjustmentOfTaxRefund: 1003333',
  'carryForwardTax: 1003333',
]);

const countRowsBetween = (startMarker, endMarker, expected) => {
  const start = files.workspace.indexOf(startMarker);
  const end = files.workspace.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) {
    fail(`Unable to inspect ${startMarker}`);
    return;
  }
  const section = files.workspace.slice(start, end);
  const count = (section.match(/\{ id: \d+,/g) || []).length;
  if (count !== expected) fail(`${startMarker} expected ${expected} records, found ${count}`);
};

countRowsBetween('sanchayapatra: {', '  import: {', 17);
countRowsBetween("  import: {", "  'commercial-vehicle': {", 7);
countRowsBetween("  'other-tds': {", "  'ait-car': {", 7);
countRowsBetween("  'ait-154': {", "  'tax-paid-return': {", 3);
countRowsBetween("  'tax-paid-return': {", "  'environmental-surcharge': {", 5);

if (files.workspace.includes("rows.filter((row) => !query")) {
  fail('Lookup input must not filter already-saved Ledger rows.');
}

if (!files.app.includes('LedgerRuntimeProvider')) fail('App is not connected to LedgerRuntimeProvider.');
if (!files.app.includes('key={currentCategory.id}')) fail('Generic category workspace must remount per category.');

if (!process.exitCode) console.log('Ledger source-fidelity and integrity audit passed.');
