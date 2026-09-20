import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');

const files = {
  app: read('src/App.tsx'),
  home: read('src/components/LedgerHomePage.tsx'),
  header: read('src/components/Header.tsx'),
  sidebar: read('src/components/Sidebar.tsx'),
  ibas: read('src/components/SalaryIbasLeanPage.tsx'),
  ibasService: read('src/services/iBasLookup.ts'),
  incomeSync: read('src/services/eReturnIncomeSync.ts'),
  guide: read('src/components/Modals/HowItWorksModal.tsx'),
  salaryOther: read('src/components/SalaryOtherLeanPage.tsx'),
  bank: read('src/components/BankFiLeanPage.tsx'),
  dividend: read('src/components/DividendLeanPage.tsx'),
  service: read('src/components/ServicePaymentLeanPage.tsx'),
  sanchay: read('src/components/SanchayapatraPage.tsx'),
  lookup: read('src/components/LookupClaimPage.tsx'),
  refund: read('src/components/TaxRefundPage.tsx'),
  environmental: read('src/components/EnvironmentalSurchargeLeanPage.tsx'),
  workspace: read('src/components/CategoryWorkspace.tsx'),
  status: read('src/components/TaxPaymentStatusPage.tsx'),
  goto: read('src/components/Modals/GoToEReturnModal.tsx'),
  runtime: read('src/state/LedgerRuntimeContext.tsx'),
  lookupService: read('src/services/eledgerLookup.ts'),
  lookupData: read('src/data/eledgerVerificationData.ts'),
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
  'Search',
  'const [searched, setSearched] = useState(false)',
  'fetchIbasSalaryTds',
  'TDS Available',
  'TDS Claim',
  'Save',
]);

expectContains('iBAS integration boundary', files.ibasService, [
  'VITE_IBAS_TDS_LOOKUP_API',
  'Bogura Technical Training Centre, Bogura',
  'tdsAvailable: 500450',
  "credentials: 'include'",
]);

expectContains('Salary Others', files.salaryOther, [
  'Salary [ Section-86]',
  'Bank Name',
  'Branch Name',
  'Challan/ Certificate Reference No.',
  'Challan/ Certificate Date',
  'Challan/ Certificate Amount',
  'Claimed Amount',
  'usePersistentState',
]);

expectContains('Bank TDS', files.bank, [
  'Bank TDS',
  'Sync From Income',
  'fetchIncomeSyncRecords',
  'draftRows',
  'updateDraftTds',
  'Save',
]);

expectContains('Dividend', files.dividend, [
  'Dividend [ Section-117]',
  'Sync From Income',
  'fetchIncomeSyncRecords',
  'Certificate Reference No',
  'Certificate Reference Date',
  'Save',
]);

expectContains('Service Payment', files.service, [
  'Meeting Fees, Honorarium, Professional Service, Consultancy etc. [Section-90]',
  'Sync From Income',
  'fetchIncomeSyncRecords',
  'Bank Name',
  'Branch Name',
  'Add',
  'Edit',
  'Delete',
]);

expectContains('Sanchayapatra', files.sanchay, [
  'Registration Number',
  'Sync From Income',
  'TDS Available',
  'TDS Claim',
  'For joint holding, enter only your applicable portion as TDS Claim.',
  'fetchIncomeSyncRecords',
  'SOURCE_ROWS.find',
  'saveSearchResult',
]);

const sanchaySourceCount = (files.sanchay.match(/scheme: 'Poribar Sanchayapatra'/g) || []).length;
if (sanchaySourceCount !== 17) fail(`Sanchayapatra expected 17 source records, found ${sanchaySourceCount}`);

expectContains('Lookup flows', files.lookup, [
  "kind: LookupKind",
  "'commercial-vehicle'",
  "'ait-car'",
  "'ait-154'",
  "'tax-paid-return'",
  'Unique Key (Transaction No.)',
  'directSaveLookup',
  'resolveRecord',
  'saveResult',
  'lookupExternalLedgerRecord',
]);

expectContains('Lookup source data', files.lookupData, [
  'COMMERCIAL_VEHICLE_SOURCE',
  'AIT_154_SOURCE',
  'SECTION_173_SOURCE',
  'AIT_CAR_SOURCE',
]);

expectContains('External lookup boundary', files.lookupService, [
  'VITE_ELEDGER_LOOKUP_API',
  'credentials: \'include\'',
  'LookupCategory',
]);

expectContains('Income sync boundary', files.incomeSync, [
  'VITE_ERETURN_INCOME_SYNC_API',
  "category: IncomeSyncCategory",
  "credentials: 'include'",
  "response.status === 204 || response.status === 404",
]);

expectContains('Tax refund', files.refund, [
  'Adjustment of Tax Refund',
  'Pending DCT Verification',
  'Deputy Commissioner of Taxes',
  'Refund Amount',
  'Adjustment Claim Amount',
  'Add',
  'Edit',
  'Delete',
]);

expectContains('Environmental Surcharge', files.environmental, [
  'Environmental Surcharge',
  'Surcharge Declared By Assessee',
  'Total Paid Amount',
  'environmental-bank-options',
]);

expectContains('Other TDS manual claim', files.workspace, [
  "title: 'Other TDS Entry'",
  "label: 'Purpose of Payment'",
  "label: 'Bank Name'",
  "label: 'Branch Name'",
  "label: 'Challan/ Certificate Amount'",
  "label: 'Claimed Amount'",
  'other-tds-purpose-options',
]);

expectContains('Tax Payment Status', files.status, [
  'Tax Payment Status',
  'Particulars',
  'Amount',
  'runtime.total',
  'Go to eReturn',
]);

expectContains('Go to eReturn', files.goto, [
  "params.get('returnTo')",
  "hostname === 'etaxnbr.gov.bd'",
  "https://etaxnbr.gov.bd/",
]);

expectContains('Header shell', files.header, [
  'Taxpayer Profile',
  'Log Out',
  'Notifications',
  'There are no new notifications right now.',
]);

expectContains('User guide', files.guide, [
  'Current NBR Income Tax Guide',
  'https://nbr.gov.bd/publications/income-tax/60',
]);

expectContains('Shared runtime', files.runtime, [
  'sourceTax',
  'advanceIncomeTax',
  'taxPaidWithReturn',
  'environmentalSurcharge',
  'adjustmentOfTaxRefund',
  'carryForwardTax',
  'updateCategoryAmount',
]);

if (!files.app.includes('<SanchayapatraPage')) fail('App is not routing to the dedicated Sanchayapatra flow.');
if (!files.app.includes('<LookupClaimPage kind="ait-car"')) fail('AIT on Car is not routed to Search -> Result -> Save flow.');
if (!files.app.includes('<LookupClaimPage kind="ait-154"')) fail('AIT 154 is not routed to challan Save flow.');
if (!files.app.includes('<LookupClaimPage kind="tax-paid-return"')) fail('Section 173 is not routed to challan Save flow.');
if (!files.app.includes('<TaxRefundPage')) fail('Tax refund is not routed to its verification-aware page.');
if (!files.status.includes('useLedgerRuntime')) fail('Tax Payment Status is not connected to live Ledger totals.');
if (!files.workspace.includes('ledger-responsive-table')) fail('Generic Ledger tables are missing responsive card behavior.');

if (!process.exitCode) console.log('Ledger functional parity audit passed.');
