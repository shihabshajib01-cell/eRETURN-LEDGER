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
  importPage: read('src/components/ImportReadOnlyPage.tsx'),
  otherTds: read('src/components/OtherTdsPage.tsx'),
  lookup: read('src/components/LookupClaimPage.tsx'),
  refund: read('src/components/TaxRefundPage.tsx'),
  environmental: read('src/components/EnvironmentalSurchargeLeanPage.tsx'),
  carryForward: read('src/components/CarryForwardPage.tsx'),
  status: read('src/components/TaxPaymentStatusPage.tsx'),
  statusModal: read('src/components/Modals/TaxPaymentStatusModal.tsx'),
  goto: read('src/components/Modals/GoToEReturnModal.tsx'),
  runtime: read('src/state/LedgerRuntimeContext.tsx'),
  totals: read('src/domain/ledgerTotals.ts'),
  validation: read('src/utils/validation.ts'),
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
  "type LoadState = 'loading' | 'ready' | 'empty' | 'error'",
  'void loadIbas()',
  'fetchIbasSalaryTds',
  'TDS Available',
  'TDS Claim',
  'isValidMoneyInput',
]);

expectContains('iBAS integration', files.ibasService, [
  'VITE_IBAS_TDS_LOOKUP_API',
  'Bogura Technical Training Centre, Bogura',
  'tdsAvailable: 500450',
  "credentials: 'include'",
]);

expectContains('Salary Others', files.salaryOther, [
  'Salary [ Section-86]',
  'Bank Name',
  'Branch Name',
  'Challan/ Certificate Amount',
  'Claimed Amount',
  'isValidLedgerDate',
  'parseMoneyStrict',
  'normalizeSalaryRow',
  'normalizedRows',
]);

expectContains('Bank TDS', files.bank, [
  'Bank TDS',
  'Sync From Income',
  'fetchIncomeSyncRecords',
  'updateDraftTds',
  'parseMoneyStrict',
]);

expectContains('Dividend', files.dividend, [
  'Dividend [ Section-117]',
  'Sync From Income',
  'fetchIncomeSyncRecords',
  'isValidLedgerDate',
  'parseMoneyStrict',
]);

expectContains('Service Payment', files.service, [
  'Meeting Fees, Honorarium, Professional Service, Consultancy etc. [Section-90]',
  'Sync From Income',
  'Bank Name',
  'Branch Name',
  'Add',
  'Edit',
  'Delete',
  'isValidLedgerDate',
]);

expectContains('Sanchayapatra', files.sanchay, [
  'Registration Number',
  'Sync From Income',
  'TDS Available',
  'TDS Claim',
  'For joint holding, enter only your applicable portion as TDS Claim.',
  'SOURCE_ROWS.find',
  'saveSearchResult',
  'parseMoneyStrict',
]);

const sanchayCount = (files.sanchay.match(/scheme: 'Poribar Sanchayapatra'/g) || []).length;
if (sanchayCount !== 17) fail(`Sanchayapatra expected 17 source records, found ${sanchayCount}`);

expectContains('Import', files.importPage, [
  'Import (120) TDS Details',
  'Total TDS Claimed',
  'updateCategoryAmount',
]);
const importCount = (files.importPage.match(/\{ id: \d+, bin:/g) || []).length;
if (importCount !== 7) fail(`Import expected 7 records, found ${importCount}`);

expectContains('Other TDS', files.otherTds, [
  'Other TDS Entry',
  'Purpose of Payment',
  'Bank Name',
  'Branch Name',
  'Challan/ Certificate Amount',
  'Claimed Amount',
  'other-tds-purpose-options',
  'isValidLedgerDate',
  'parseMoneyStrict',
]);
const otherTdsCount = (files.otherTds.match(/\{ id: \d+, purpose:/g) || []).length;
if (otherTdsCount !== 7) fail(`Other TDS expected 7 baseline records, found ${otherTdsCount}`);

expectContains('Lookup flows', files.lookup, [
  "'commercial-vehicle'",
  "'ait-car'",
  "'ait-154'",
  "'tax-paid-return'",
  'Unique Key (Transaction No.)',
  'directSaveLookup ? directSave() : search()',
  'lookupExternalLedgerRecord',
]);

expectContains('Lookup source data', files.lookupData, [
  'COMMERCIAL_VEHICLE_SOURCE',
  'AIT_154_SOURCE',
  'SECTION_173_SOURCE',
  'AIT_CAR_SOURCE',
]);

const ait154Count = (files.lookupData.match(/challan: '2526-0003/g) || []).length;
if (ait154Count < 3) fail('AIT 154 source catalogue is incomplete.');
const section173Count = (files.lookupData.match(/challan: '2526-00(?:01951606|19899715|23059430|23558743|60340578)'/g) || []).length;
if (section173Count !== 5) fail(`Section 173 expected 5 verified records, found ${section173Count}`);

expectContains('External lookup integration', files.lookupService, [
  'VITE_ELEDGER_LOOKUP_API',
  "credentials: 'include'",
  'LookupCategory',
]);

expectContains('Income sync integration', files.incomeSync, [
  'VITE_ERETURN_INCOME_SYNC_API',
  "category: IncomeSyncCategory",
  "credentials: 'include'",
  "response.status === 204 || response.status === 404",
]);

expectContains('Tax Refund', files.refund, [
  'Adjustment of Tax Refund',
  'Pending DCT Verification',
  'Deputy Commissioner of Taxes',
  'Refund Amount',
  'Adjustment Claim Amount',
  'isValidLedgerDate',
  'parseMoneyStrict',
]);

expectContains('Environmental Surcharge', files.environmental, [
  'Environmental Surcharge',
  'Surcharge Declared By Assessee',
  'Total Paid Amount',
  'environmental-bank-options',
  'isValidLedgerDate',
  'isValidMoneyInput',
]);

expectContains('Carry forward', files.carryForward, [
  'Adjustment of carry forward tax u/s 163',
  'carry-forward-active',
  "updateCategoryAmount('carry-forward'",
]);

expectContains('Tax Payment Status', files.status, [
  'Tax Payment Status',
  'Particulars',
  'Amount',
  'runtime.total',
  'Go to eReturn',
  'useState<ExpandableGroup | null>(null)',
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
  'VITE_ERETURN_LOGOUT_URL',
]);

expectContains('User guide', files.guide, [
  'Current NBR Income Tax Guide',
  'https://nbr.gov.bd/publications/income-tax/60',
]);

expectContains('Single-source totals', files.runtime, [
  'DEFAULT_CATEGORY_AMOUNTS',
  'computeLedgerTotals',
  'categoryAmounts',
  'updateCategoryAmount',
]);
if (files.runtime.includes('BASE_TOTALS')) fail('Ledger runtime still contains hidden base-total residuals.');

expectContains('Totals domain', files.totals, [
  'SOURCE_TAX_CATEGORY_IDS',
  'AIT_CATEGORY_IDS',
  'DEFAULT_CATEGORY_AMOUNTS',
  'computeLedgerTotals',
  "'other-tds': 6970044",
  "'ait-154': 118365",
]);

expectContains('Validation', files.validation, [
  'isValidMoneyInput',
  'parseMoneyStrict',
  'isValidLedgerDate',
  'hasText',
]);

const dedicatedRoutes = [
  '<SalaryIbasLeanPage',
  '<SalaryOtherLeanPage',
  '<BankFiLeanPage',
  '<DividendLeanPage',
  '<ServicePaymentLeanPage',
  '<EnvironmentalSurchargeLeanPage',
  '<SanchayapatraPage',
  '<ImportReadOnlyPage',
  '<OtherTdsPage',
  '<LookupClaimPage kind="commercial-vehicle"',
  '<LookupClaimPage kind="ait-car"',
  '<LookupClaimPage kind="ait-154"',
  '<LookupClaimPage kind="tax-paid-return"',
  '<TaxRefundPage',
  '<CarryForwardPage',
];
for (const route of dedicatedRoutes) {
  if (!files.app.includes(route)) fail(`App is missing dedicated route: ${route}`);
}

if (files.app.includes('CategoryWorkspace')) {
  fail('App still depends on the obsolete generic CategoryWorkspace implementation.');
}

if (!files.app.includes('taxPaymentStatusModalOpen') || !files.app.includes('<TaxPaymentStatusModal')) {
  fail('Tax Payment Status must be available through the shared modal.');
}

if (!files.app.includes("tab === 'dashboard' || tab === 'payment-status'")) {
  fail('Home and Tax Payment Status navigation must trigger the Tax Payment Status modal.');
}

expectContains('Tax Payment Status modal', files.statusModal, [
  'TaxPaymentStatusPage',
  'useDialogFocusTrap',
  'useLedgerRuntime',
  'role="dialog"',
  'aria-modal="true"',
  '<header',
  'min-h-0 flex-1 overflow-y-auto',
  '<footer',
  'showHeader={false}',
  'showTotalRow={false}',
  'showSidebar={false}',
  'formatLedgerNumber(runtime.total)',
]);

if (!files.app.includes("currentTab === 'overview-dashboard'") || !files.app.includes('<LedgerDashboardPage')) {
  fail('The separate eLedger Dashboard route is missing.');
}

if (!files.app.includes('onViewPaymentStatus={() => setTaxPaymentStatusModalOpen(true)}')) {
  fail('Dashboard View Tax Payment Status action is not wired to the modal.');
}

if (!files.app.includes("currentTab === 'ledger-guide'") || !files.app.includes('<LedgerHomePage')) {
  fail('Former eLedger Home guidance must remain available through Ledger Guide.');
}

if (!files.sidebar.includes("select('overview-dashboard')")) {
  fail('Dashboard is missing from the primary navigation.');
}

if (files.sidebar.includes("select('ledger-guide')")) {
  fail('Ledger Guide must not appear in the primary navigation; guidance remains available through the preserved guide route and User Guide modal.');
}

if (!files.sidebar.includes("select('user-guide')")) {
  fail('User Guide access is missing from the help area.');
}

if (!files.status.includes('useLedgerRuntime')) {
  fail('Tax Payment Status is not connected to shared Ledger totals.');
}

if (!process.exitCode) console.log('Ledger functional freeze audit passed.');
