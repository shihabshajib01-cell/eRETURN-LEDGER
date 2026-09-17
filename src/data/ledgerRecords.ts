export type LedgerValue = string | number;

export interface LedgerRecord {
  id: string;
  [key: string]: LedgerValue;
}

export type LedgerColumnType = 'text' | 'amount' | 'date' | 'status' | 'select';

export interface LedgerColumn {
  key: string;
  label: string;
  type?: LedgerColumnType;
  align?: 'left' | 'right';
  editable?: boolean;
  required?: boolean;
  options?: string[];
}

export interface LedgerTableConfig {
  id: string;
  title: string;
  subtitle?: string;
  columns: LedgerColumn[];
  records: LedgerRecord[];
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canSync?: boolean;
  readOnly?: boolean;
  totalKey?: string;
  totalLabel?: string;
  lookupLabel?: string;
  lookupPlaceholder?: string;
  lookupKeys?: string[];
}

export const SALARY_IBAS_DETAILS = {
  assessmentYear: '2026-2027',
  officeName: 'Bogura Technical Training Centre, Bogura',
  designation: 'Principal',
  tdsAvailable: 500450,
  initialClaim: 150000,
};

export const TABLE_CONFIGS: Record<string, LedgerTableConfig> = {
  'salary-other': {
    id: 'salary-other',
    title: 'Salary (Others)',
    subtitle: 'Salary [ Section-86 ]',
    canAdd: true,
    canEdit: true,
    canDelete: true,
    totalKey: 'claimedAmount',
    totalLabel: 'Total Claimed Amount',
    columns: [
      { key: 'depositingAuthority', label: 'Depositing Authority', editable: true, required: true },
      { key: 'documentType', label: 'Payment Document Type', type: 'select', editable: true, required: true, options: ['Challan', 'Certificate'] },
      { key: 'referenceNo', label: 'Challan/Certificate Reference No.', editable: true, required: true },
      { key: 'referenceDate', label: 'Challan/Certificate Date', type: 'date', editable: true, required: true },
      { key: 'certificateAmount', label: 'Challan/Certificate Amount', type: 'amount', align: 'right', editable: true, required: true },
      { key: 'claimedAmount', label: 'Claimed Amount', type: 'amount', align: 'right', editable: true, required: true },
    ],
    records: [
      { id: 'sal-1', depositingAuthority: 'test', documentType: 'Certificate', referenceNo: '123456', referenceDate: '04-09-2026', certificateAmount: 10000, claimedAmount: 1000 },
      { id: 'sal-2', depositingAuthority: 'test 2', documentType: 'Challan', referenceNo: '2526-0003286477', referenceDate: '07-08-2025', certificateAmount: 3273823, claimedAmount: 3273823 },
      { id: 'sal-3', depositingAuthority: 'test 3', documentType: 'Challan', referenceNo: '2526-0003264262', referenceDate: '06-08-2025', certificateAmount: 137700, claimedAmount: 137700 },
      { id: 'sal-4', depositingAuthority: 'test 4', documentType: 'Challan', referenceNo: '2526-0003336839', referenceDate: '06-08-2025', certificateAmount: 3529, claimedAmount: 3529 },
      { id: 'sal-5', depositingAuthority: 'test 5', documentType: 'Certificate', referenceNo: '11223344', referenceDate: '04-09-2026', certificateAmount: 220022, claimedAmount: 220022 },
    ],
  },
  'bank-fi': {
    id: 'bank-fi',
    title: 'Bank/FI Interest/Profit',
    canSync: true,
    readOnly: true,
    columns: [
      { key: 'bankName', label: 'Bank Name' },
      { key: 'accountType', label: 'Account Type' },
      { key: 'branchName', label: 'Branch Name' },
      { key: 'accountNumber', label: 'Account Number' },
      { key: 'interestAmount', label: 'Interest Amount', type: 'amount', align: 'right' },
      { key: 'tds', label: 'TDS', type: 'amount', align: 'right' },
    ],
    records: [
      { id: 'bank-1', bankName: 'BRAC Bank PLC', accountType: 'DPS', branchName: 'Karwan Bazar', accountNumber: '1111111', interestAmount: 100000, tds: 1000 },
      { id: 'bank-2', bankName: 'Dhaka Bank PLC', accountType: 'FDR/ Term Deposit', branchName: 'Karwan Bazar', accountNumber: '11111111', interestAmount: 500000, tds: 50000 },
      { id: 'bank-3', bankName: 'AB Bank PLC', accountType: 'Savings/ SND/ Others', branchName: 'Karwan Bazar -3', accountNumber: '22222222', interestAmount: 600000, tds: 60000 },
      { id: 'bank-4', bankName: 'Dhaka Bank PLC', accountType: 'DPS', branchName: 'Bandarban', accountNumber: '3333333', interestAmount: 990000, tds: 100200 },
      { id: 'bank-5', bankName: 'EXIM Bank PLC', accountType: 'FDR/ Term Deposit', branchName: 'Chuyadanga', accountNumber: '555555', interestAmount: 10002004, tds: 100200 },
    ],
  },
  dividend: {
    id: 'dividend',
    title: 'Dividend',
    subtitle: 'Dividend [ Section-117 ]',
    canSync: true,
    canDelete: true,
    totalKey: 'claimedAmount',
    totalLabel: 'Total Claimed Amount',
    columns: [
      { key: 'depositingAuthority', label: 'Depositing Authority / Person / Company' },
      { key: 'referenceNo', label: 'Certificate Reference No' },
      { key: 'referenceDate', label: 'Certificate Reference Date', type: 'date' },
      { key: 'certificateAmount', label: 'Challan / Certificate Amount', type: 'amount', align: 'right' },
      { key: 'claimedAmount', label: 'Claimed Amount', type: 'amount', align: 'right' },
    ],
    records: [
      { id: 'div-1', depositingAuthority: 'Synesis IT PLC', referenceNo: 'test-1', referenceDate: '01-09-2026', certificateAmount: 50000, claimedAmount: 50000 },
      { id: 'div-2', depositingAuthority: 'Synosis IT PLC', referenceNo: 'test-2', referenceDate: '04-09-2026', certificateAmount: 60000, claimedAmount: 60000 },
      { id: 'div-3', depositingAuthority: 'Sinosis LPG', referenceNo: 'test-3', referenceDate: '04-09-2026', certificateAmount: 22022, claimedAmount: 22022 },
      { id: 'div-4', depositingAuthority: 'Syncronis', referenceNo: 'test-4', referenceDate: '06-09-2026', certificateAmount: 44003, claimedAmount: 44003 },
      { id: 'div-5', depositingAuthority: 'Syncromium', referenceNo: 'test-5', referenceDate: '04-09-2026', certificateAmount: 34302, claimedAmount: 34302 },
    ],
  },
  'service-payment': {
    id: 'service-payment',
    title: 'Service Payment',
    subtitle: 'Meeting Fees, Honorarium, Professional Service, Consultancy etc. [Section-90]',
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canSync: true,
    totalKey: 'claimedAmount',
    totalLabel: 'Total Claimed Amount',
    columns: [
      { key: 'depositingAuthority', label: 'Depositing Authority', editable: true, required: true },
      { key: 'documentType', label: 'Payment Document Type', type: 'select', editable: true, required: true, options: ['Challan', 'Certificate'] },
      { key: 'referenceNo', label: 'Challan/Certificate Reference No.', editable: true, required: true },
      { key: 'referenceDate', label: 'Challan/Certificate Date', type: 'date', editable: true, required: true },
      { key: 'certificateAmount', label: 'Challan/Certificate Amount', type: 'amount', align: 'right', editable: true, required: true },
      { key: 'claimedAmount', label: 'Claimed Amount', type: 'amount', align: 'right', editable: true, required: true },
    ],
    records: [
      { id: 'svc-1', depositingAuthority: 'Plumber corp', documentType: 'Challan', referenceNo: '2526-0002912865', referenceDate: '30-07-2025', certificateAmount: 70000, claimedAmount: 5000 },
      { id: 'svc-2', depositingAuthority: 'Doctor', documentType: 'Challan', referenceNo: '2526-0002968652', referenceDate: '30-07-2025', certificateAmount: 10000, claimedAmount: 5000 },
      { id: 'svc-3', depositingAuthority: 'Lawyer', documentType: 'Challan', referenceNo: '2526-0003205455', referenceDate: '03-08-2025', certificateAmount: 16778, claimedAmount: 10000 },
      { id: 'svc-4', depositingAuthority: 'Engineer', documentType: 'Challan', referenceNo: '2526-0003734605', referenceDate: '07-08-2025', certificateAmount: 2605887, claimedAmount: 5000 },
      { id: 'svc-5', depositingAuthority: 'Astronaut', documentType: 'Challan', referenceNo: '2526-0003810112', referenceDate: '11-08-2025', certificateAmount: 7577604, claimedAmount: 3000 },
      { id: 'svc-6', depositingAuthority: 'Mail Man', documentType: 'Certificate', referenceNo: 'ref-1', referenceDate: '30-09-2026', certificateAmount: 10000, claimedAmount: 10000 },
    ],
  },
  sanchayapatra: {
    id: 'sanchayapatra',
    title: 'Sanchayapatra',
    readOnly: true,
    columns: [
      { key: 'schemeName', label: 'Name of Scheme' },
      { key: 'registrationNo', label: 'Registration No.' },
      { key: 'issueDate', label: 'Issue Date', type: 'date' },
      { key: 'value', label: 'Value', type: 'amount', align: 'right' },
      { key: 'tdsClaim', label: 'TDS Claim', type: 'amount', align: 'right' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    records: [
      { id: 'san-1', schemeName: 'Poribar Sanchayapatra', registrationNo: '2021-0023507', issueDate: '07-01-2021', value: 1600000, tdsClaim: 10752, status: 'Verified' },
      { id: 'san-2', schemeName: 'Poribar Sanchayapatra', registrationNo: '2021-0486873', issueDate: '27-05-2021', value: 100000, tdsClaim: 1056, status: 'Verified' },
      { id: 'san-3', schemeName: 'Poribar Sanchayapatra', registrationNo: '2021-1011941', issueDate: '23-09-2021', value: 100000, tdsClaim: 950, status: 'Verified' },
      { id: 'san-4', schemeName: 'Poribar Sanchayapatra', registrationNo: '2022-0441765', issueDate: '04-04-2022', value: 200000, tdsClaim: 1900, status: 'Verified' },
      { id: 'san-5', schemeName: 'Poribar Sanchayapatra', registrationNo: '2022-0917245', issueDate: '25-07-2022', value: 100000, tdsClaim: 950, status: 'Verified' },
      { id: 'san-6', schemeName: 'Poribar Sanchayapatra', registrationNo: '2022-1242189', issueDate: '19-10-2022', value: 100000, tdsClaim: 950, status: 'Verified' },
      { id: 'san-7', schemeName: 'Poribar Sanchayapatra', registrationNo: '2023-0144432', issueDate: '05-02-2023', value: 100000, tdsClaim: 950, status: 'Verified' },
      { id: 'san-8', schemeName: 'Poribar Sanchayapatra', registrationNo: '2023-0438170', issueDate: '07-05-2023', value: 100000, tdsClaim: 950, status: 'Verified' },
      { id: 'san-9', schemeName: 'Poribar Sanchayapatra', registrationNo: '2023-0872614', issueDate: '28-08-2023', value: 100000, tdsClaim: 950, status: 'Verified' },
      { id: 'san-10', schemeName: 'Poribar Sanchayapatra', registrationNo: '2023-1177864', issueDate: '22-11-2023', value: 100000, tdsClaim: 950, status: 'Verified' },
      { id: 'san-11', schemeName: 'Poribar Sanchayapatra', registrationNo: '2024-0204923', issueDate: '25-02-2024', value: 100000, tdsClaim: 950, status: 'Verified' },
      { id: 'san-12', schemeName: 'Poribar Sanchayapatra', registrationNo: '2024-0430947', issueDate: '09-05-2024', value: 100000, tdsClaim: 950, status: 'Verified' },
      { id: 'san-13', schemeName: 'Poribar Sanchayapatra', registrationNo: '2025-0038731', issueDate: '19-01-2025', value: 200000, tdsClaim: 2474, status: 'Verified' },
      { id: 'san-14', schemeName: 'Poribar Sanchayapatra', registrationNo: '2025-0293593', issueDate: '24-03-2025', value: 900000, tdsClaim: 11133, status: 'Verified' },
      { id: 'san-15', schemeName: 'Poribar Sanchayapatra', registrationNo: '2025-0290852', issueDate: '25-03-2025', value: 600000, tdsClaim: 7422, status: 'Verified' },
      { id: 'san-16', schemeName: 'Poribar Sanchayapatra', registrationNo: '2026-0019673', issueDate: '12-01-2026', value: 900000, tdsClaim: 4425, status: 'Verified' },
      { id: 'san-17', schemeName: 'Poribar Sanchayapatra', registrationNo: '2026-0026431', issueDate: '12-01-2026', value: 700000, tdsClaim: 3477, status: 'Verified' },
    ],
  },
  import: {
    id: 'import',
    title: 'Import (120) TDS Details',
    readOnly: true,
    totalKey: 'tdsClaimed',
    totalLabel: 'Total TDS Claimed',
    columns: [
      { key: 'bin', label: 'BIN' },
      { key: 'officeCode', label: 'Office Code' },
      { key: 'billOfEntry', label: 'Bill of Entry' },
      { key: 'billOfEntryDate', label: 'Bill of Entry Date', type: 'date' },
      { key: 'receiptNo', label: 'Receipt No' },
      { key: 'receiptDate', label: 'Receipt Date', type: 'date' },
      { key: 'invoiceValue', label: 'Invoice Value', type: 'amount', align: 'right' },
      { key: 'assessableValue', label: 'Assessable Value', type: 'amount', align: 'right' },
      { key: 'totalTaxDuties', label: 'Total Tax & Duties', type: 'amount', align: 'right' },
      { key: 'tdsClaimed', label: 'TDS Claimed', type: 'amount', align: 'right' },
    ],
    records: [
      { id: 'imp-1', bin: '004905634-0503', officeCode: '301', billOfEntry: '1629442', billOfEntryDate: '01-09-2025', receiptNo: '1694061', receiptDate: '02-09-2025', invoiceValue: 3975049, assessableValue: 4054550, totalTaxDuties: 2510891, tdsClaimed: 202727 },
      { id: 'imp-2', bin: '004905634-0503', officeCode: '101', billOfEntry: '939642', billOfEntryDate: '22-09-2025', receiptNo: '968764', receiptDate: '23-09-2025', invoiceValue: 613, assessableValue: 626, totalTaxDuties: 431, tdsClaimed: 31 },
      { id: 'imp-3', bin: '004905634-0503', officeCode: '301', billOfEntry: '1674032', billOfEntryDate: '09-09-2025', receiptNo: '1768177', receiptDate: '15-09-2025', invoiceValue: 3108500, assessableValue: 6356829, totalTaxDuties: 4919743, tdsClaimed: 317841 },
      { id: 'imp-4', bin: '004905634-0503', officeCode: '301', billOfEntry: '1776639', billOfEntryDate: '28-09-2025', receiptNo: '1907828', receiptDate: '09-10-2025', invoiceValue: 3679553, assessableValue: 6463299, totalTaxDuties: 4994297, tdsClaimed: 323164 },
      { id: 'imp-5', bin: '004905634-0503', officeCode: '301', billOfEntry: '2021438', billOfEntryDate: '09-11-2025', receiptNo: '2118668', receiptDate: '12-11-2025', invoiceValue: 3487332, assessableValue: 6840260, totalTaxDuties: 5306753, tdsClaimed: 342013 },
      { id: 'imp-6', bin: '004905634-0503', officeCode: '301', billOfEntry: '2085468', billOfEntryDate: '18-11-2025', receiptNo: '2199946', receiptDate: '24-11-2025', invoiceValue: 3532407, assessableValue: 6204982, totalTaxDuties: 4794367, tdsClaimed: 310249 },
      { id: 'imp-7', bin: '004905634-0503', officeCode: '301', billOfEntry: '2319200', billOfEntryDate: '22-12-2025', receiptNo: '2421826', receiptDate: '24-12-2025', invoiceValue: 3540758, assessableValue: 6323863, totalTaxDuties: 4906327, tdsClaimed: 316193 },
    ],
  },
  'commercial-vehicle': {
    id: 'commercial-vehicle',
    title: 'Commercial Vehicle',
    canDelete: true,
    lookupLabel: 'Unique Key (Transaction No.)',
    lookupPlaceholder: 'Transaction No. or Chassis No.',
    lookupKeys: ['uniqueKey', 'chassisNo', 'registrationNo'],
    totalKey: 'tdsClaim',
    totalLabel: 'Total TDS Claim',
    columns: [
      { key: 'registrationNo', label: 'Registration No' },
      { key: 'uniqueKey', label: 'Unique Key' },
      { key: 'chassisNo', label: 'Chassis No' },
      { key: 'tdsClaim', label: 'TDS Claim', type: 'amount', align: 'right' },
    ],
    records: [
      { id: 'veh-1', registrationNo: 'RANGPUR-KA-02-0113', uniqueKey: '2512231447911', chassisNo: 'EE96-0075355', tdsClaim: 25000 },
      { id: 'veh-2', registrationNo: 'DHAKA METRO-GA-45-0727', uniqueKey: '2509161060682', chassisNo: 'NZT260-3166542', tdsClaim: 25000 },
      { id: 'veh-3', registrationNo: 'DHAKA METRO-GA-28-4927', uniqueKey: '2508091268499', chassisNo: 'ZVW30-5744115', tdsClaim: 50000 },
      { id: 'veh-4', registrationNo: 'DHAKA METRO-KHA-12-0622', uniqueKey: '2602151294597', chassisNo: 'NZE120-0023924', tdsClaim: 25000 },
    ],
  },
  'other-tds': {
    id: 'other-tds',
    title: 'Other TDS Entry',
    canAdd: true,
    canEdit: true,
    canDelete: true,
    totalKey: 'claimedAmount',
    totalLabel: 'Total Claimed Amount',
    columns: [
      { key: 'purpose', label: 'Purpose of the Payment', editable: true, required: true },
      { key: 'depositingAuthority', label: 'Depositing Authority', editable: true, required: true },
      { key: 'documentType', label: 'Payment Document Type', type: 'select', editable: true, required: true, options: ['Challan', 'Certificate'] },
      { key: 'referenceNo', label: 'Challan/Certificate Reference No.', editable: true, required: true },
      { key: 'referenceDate', label: 'Challan/Certificate Date', type: 'date', editable: true, required: true },
      { key: 'certificateAmount', label: 'Challan/Certificate Amount', type: 'amount', align: 'right', editable: true, required: true },
      { key: 'claimedAmount', label: 'Claimed Amount', type: 'amount', align: 'right', editable: true, required: true },
    ],
    records: [
      { id: 'oth-1', purpose: 'Acquisition of Property [Section-111]', depositingAuthority: 'ref-auth', documentType: 'Certificate', referenceNo: 'ref-3', referenceDate: '02-09-2026', certificateAmount: 5000, claimedAmount: 500 },
      { id: 'oth-2', purpose: 'Actor, Producer etc. [ Section-93]', depositingAuthority: 'FDC', documentType: 'Challan', referenceNo: '2526-0058719534', referenceDate: '24-06-2026', certificateAmount: 8221, claimedAmount: 8221 },
      { id: 'oth-3', purpose: 'Advertising Bill [ Section-92]', depositingAuthority: 'Advertise 1', documentType: 'Challan', referenceNo: '2526-0027752927', referenceDate: '10-02-2026', certificateAmount: 3316209, claimedAmount: 3316209 },
      { id: 'oth-4', purpose: 'Bangladesh Bank Bill [ Section-107]', depositingAuthority: 'BBB', documentType: 'Challan', referenceNo: '2526-0000884175', referenceDate: '14-07-2025', certificateAmount: 3277127, claimedAmount: 3277127 },
      { id: 'oth-5', purpose: 'Brick Manufacturing [ Section-130]', depositingAuthority: 'Brick', documentType: 'Certificate', referenceNo: 'ref-4', referenceDate: '01-09-2026', certificateAmount: 1000, claimedAmount: 1000 },
      { id: 'oth-6', purpose: 'Convention Hall Rent [ Section-110]', depositingAuthority: 'auth -3', documentType: 'Challan', referenceNo: '2526-0003447879', referenceDate: '07-08-2025', certificateAmount: 366087, claimedAmount: 366087 },
      { id: 'oth-7', purpose: 'House Property [ Section-109]', depositingAuthority: 'auth', documentType: 'Challan', referenceNo: '2526-0000443755', referenceDate: '30-07-2025', certificateAmount: 900, claimedAmount: 900 },
    ],
  },
  'ait-154': {
    id: 'ait-154',
    title: 'AIT under Section 154',
    canDelete: true,
    lookupLabel: 'Challan No.',
    lookupPlaceholder: 'Enter Challan No.',
    lookupKeys: ['challanNo'],
    totalKey: 'amount',
    totalLabel: 'Total AIT',
    columns: [
      { key: 'challanNo', label: 'Challan No' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'amount', label: 'Amount', type: 'amount', align: 'right' },
      { key: 'paymentMode', label: 'Payment Mode' },
      { key: 'bank', label: 'Bank' },
      { key: 'branch', label: 'Branch' },
      { key: 'zone', label: 'Zone' },
      { key: 'circle', label: 'Circle' },
    ],
    records: [
      { id: 'ait154-1', challanNo: '2526-0003384438', date: '06-08-2025', amount: 37085, paymentMode: 'CASH', bank: 'IFIC BANK LTD.', branch: 'ISLAMIC BANKING', zone: 'TAXZONE-15,DHAKA', circle: 'CIRCLE-319' },
      { id: 'ait154-2', challanNo: '2526-0003681361', date: '10-08-2025', amount: 77280, paymentMode: 'TRANSFER', bank: 'SONALI BANK LTD.', branch: 'MIRPUR CANTT., DHAKA', zone: 'TAXZONE-11,DHAKA', circle: 'CIRCLE-238' },
      { id: 'ait154-3', challanNo: '2526-0003954853', date: '11-08-2025', amount: 4000, paymentMode: 'CASH', bank: 'SONALI BANK LTD.', branch: 'Khulna KDA New Market', zone: 'TAXZONE,KHULNA', circle: 'CIRCLE-2' },
    ],
  },
  'tax-paid-return': {
    id: 'tax-paid-return',
    title: 'Regular Tax under Section 173',
    canDelete: true,
    lookupLabel: 'Challan No.',
    lookupPlaceholder: 'Enter Challan No.',
    lookupKeys: ['challanNo'],
    totalKey: 'amount',
    totalLabel: 'Total Tax Paid',
    columns: [
      { key: 'challanNo', label: 'Challan No' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'amount', label: 'Amount', type: 'amount', align: 'right' },
      { key: 'paymentMode', label: 'Payment Mode' },
      { key: 'bank', label: 'Bank' },
      { key: 'branch', label: 'Branch' },
      { key: 'zone', label: 'Zone' },
      { key: 'circle', label: 'Circle' },
    ],
    records: [
      { id: 'reg173-1', challanNo: '2526-0001951606', date: '23-07-2025', amount: 5154, paymentMode: 'CASH', bank: 'SONALI BANK LTD.', branch: 'Gopalganj', zone: 'TAXZONE-4,DHAKA', circle: 'N/A' },
      { id: 'reg173-2', challanNo: '2526-0019899715', date: '04-12-2025', amount: 301755, paymentMode: 'CASH', bank: 'IFIC BANK LTD.', branch: 'BOARD BAZAR', zone: 'TAXZONE-5,DHAKA', circle: 'CIRCLE-101' },
      { id: 'reg173-3', challanNo: '2526-0023059430', date: '15-01-2026', amount: 195555, paymentMode: 'CASH', bank: 'PUBALI BANK LTD.', branch: 'SHANTIR HAT', zone: 'TAXZONE-3,CHATTOGRAM', circle: 'CIRCLE-53' },
      { id: 'reg173-4', challanNo: '2526-0023558743', date: '21-01-2026', amount: 450378, paymentMode: 'CHEQUE', bank: 'SONALI BANK LTD.', branch: 'BARISHAL UNIVERSITY', zone: 'TAXZONE,BARISHAL', circle: 'CIRCLE-13' },
      { id: 'reg173-5', challanNo: '2526-0060340578', date: '25-06-2026', amount: 51500, paymentMode: 'CASH', bank: 'JANATA BANK LTD.', branch: 'CHITTAGONG VETERINARY AND ANIMAL SCIENCES UNIVERSITY', zone: 'TAXZONE-1,CHATTOGRAM', circle: 'CIRCLE-18' },
    ],
  },
  'environmental-surcharge': {
    id: 'environmental-surcharge',
    title: 'Environmental Surcharge',
    canAdd: true,
    canEdit: true,
    canDelete: true,
    totalKey: 'paidAmount',
    totalLabel: 'Total Paid Amount',
    columns: [
      { key: 'registrationNo', label: 'Motor Vehicle Registration No', editable: true, required: true },
      { key: 'transactionId', label: 'Transaction ID', editable: true, required: true },
      { key: 'bankName', label: 'Bank Name', type: 'select', editable: true, required: true, options: ['Community Bank Bangladesh PLC', 'AB Bank PLC', 'BRAC Bank PLC', 'Dhaka Bank PLC'] },
      { key: 'branchName', label: 'Branch Name', editable: true, required: true },
      { key: 'paymentDate', label: 'Payment Date', type: 'date', editable: true, required: true },
      { key: 'paidAmount', label: 'Paid Amount', type: 'amount', align: 'right', editable: true, required: true },
    ],
    records: [
      { id: 'env-1', registrationNo: '2345', transactionId: '234234', bankName: 'Community Bank Bangladesh PLC', branchName: 'branch 2', paymentDate: '02-09-2026', paidAmount: 20000 },
      { id: 'env-2', registrationNo: '3455', transactionId: '345345', bankName: 'Community Bank Bangladesh PLC', branchName: 'branch 3', paymentDate: '12-09-2026', paidAmount: 20000 },
      { id: 'env-3', registrationNo: '1234', transactionId: '1223132', bankName: 'AB Bank PLC', branchName: 'Branch', paymentDate: '01-09-2026', paidAmount: 10000 },
    ],
  },
  'tax-refund': {
    id: 'tax-refund',
    title: 'Adjustment of Tax Refund',
    canAdd: true,
    canEdit: true,
    canDelete: true,
    totalKey: 'claimAmount',
    totalLabel: 'Adjustment Claim Amount',
    columns: [
      { key: 'assessmentYear', label: 'Assessment Year', editable: true, required: true },
      { key: 'returnReference', label: 'Return Register No. / Reference No.', editable: true, required: true },
      { key: 'submissionDate', label: 'Date of Submission', type: 'date', editable: true, required: true },
      { key: 'zone', label: 'Return Filing Zone', editable: true, required: true },
      { key: 'circle', label: 'Return Filing Circle', editable: true, required: true },
      { key: 'refundAmount', label: 'Refund Amount', type: 'amount', align: 'right', editable: true, required: true },
      { key: 'claimAmount', label: 'Adjustment Claim Amount', type: 'amount', align: 'right', editable: true, required: true },
    ],
    records: [
      { id: 'refund-1', assessmentYear: '2025-2026', returnReference: '112233', submissionDate: '31-08-2026', zone: 'Taxes Zone, Rajshahi', circle: 'Circle-08', refundAmount: 1003333, claimAmount: 1003333 },
    ],
  },
};

export const CARRY_FORWARD_DETAILS = {
  claimed: true,
  amount: 1003333,
};

export const ENVIRONMENTAL_DECLARED_AMOUNT = 50000;

export const AIT_ON_CAR_SUMMARY = {
  amount: 72000,
  note: 'The supplied current-state screenshots confirm the AIT group total, but do not expose the AIT on Car row-level table. No row data is invented.',
};

export const SYNC_CANDIDATES: Record<string, LedgerRecord[]> = {
  'bank-fi': TABLE_CONFIGS['bank-fi'].records,
  dividend: TABLE_CONFIGS.dividend.records,
  'service-payment': TABLE_CONFIGS['service-payment'].records,
};
