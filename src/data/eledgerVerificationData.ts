export type CommercialVehicleRecord = {
  id: number;
  uniqueKey: string;
  registration: string;
  chassis: string;
  tds: string;
};

export type ChallanRecord = {
  id: number;
  challan: string;
  date: string;
  amount: string;
  mode: string;
  bank: string;
  branch: string;
  zone: string;
  circle: string;
};

export type AitCarRecord = {
  id: number;
  transactionNo: string;
  registration: string;
  date: string;
  amount: string;
  status: string;
};

// Current-system records already evidenced in the project.
// These are kept separate from the taxpayer's saved Ledger rows so
// Search -> Result -> Save can behave like the existing eLedger flow.
export const COMMERCIAL_VEHICLE_SOURCE: CommercialVehicleRecord[] = [
  { id: 1, registration: 'RANGPUR-KA-02-0113', uniqueKey: '2512231447911', chassis: 'EE96-0075355', tds: '25,000' },
  { id: 2, registration: 'DHAKA METRO-GA-45-0727', uniqueKey: '2509161060682', chassis: 'NZT260-3166542', tds: '25,000' },
  { id: 3, registration: 'DHAKA METRO-GA-28-4927', uniqueKey: '2508091268499', chassis: 'ZVW30-5744115', tds: '50,000' },
  { id: 4, registration: 'DHAKA METRO-KHA-12-0622', uniqueKey: '2602151294597', chassis: 'NZE120-0023924', tds: '25,000' },
];

export const AIT_154_SOURCE: ChallanRecord[] = [
  { id: 1, challan: '2526-0003384438', date: '06-08-2025', amount: '37,085', mode: 'CASH', bank: 'IFIC BANK LTD.', branch: 'ISLAMIC BANKING', zone: 'TAXZONE-15,DHAKA', circle: 'CIRCLE-319' },
  { id: 2, challan: '2526-0003681361', date: '10-08-2025', amount: '77,280', mode: 'TRANSFER', bank: 'SONALI BANK LTD.', branch: 'MIRPUR CANTT., DHAKA', zone: 'TAXZONE-11,DHAKA', circle: 'CIRCLE-238' },
  { id: 3, challan: '2526-0003954853', date: '11-08-2025', amount: '4,000', mode: 'CASH', bank: 'SONALI BANK LTD.', branch: 'Khulna KDA New Market', zone: 'TAXZONE,KHULNA', circle: 'CIRCLE-2' },
];

export const SECTION_173_SOURCE: ChallanRecord[] = [
  { id: 1, challan: '2526-0001951606', date: '23-07-2025', amount: '5,154', mode: 'CASH', bank: 'SONALI BANK LTD.', branch: 'Gopalganj', zone: 'TAXZONE-4,DHAKA', circle: 'N/A' },
  { id: 2, challan: '2526-0019899715', date: '04-12-2025', amount: '3,01,755', mode: 'CASH', bank: 'IFIC BANK LTD.', branch: 'BOARD BAZAR', zone: 'TAXZONE-5,DHAKA', circle: 'CIRCLE-101' },
  { id: 3, challan: '2526-0023059430', date: '15-01-2026', amount: '1,95,555', mode: 'CASH', bank: 'PUBALI BANK LTD.', branch: 'SHANTIR HAT', zone: 'TAXZONE-3,CHATTOGRAM', circle: 'CIRCLE-53' },
  { id: 4, challan: '2526-0023558743', date: '21-01-2026', amount: '4,50,378', mode: 'CHEQUE', bank: 'SONALI BANK LTD.', branch: 'BARISHAL UNIVERSITY', zone: 'TAXZONE,BARISHAL', circle: 'CIRCLE-13' },
  { id: 5, challan: '2526-0060340578', date: '25-06-2026', amount: '51,500', mode: 'CASH', bank: 'JANATA BANK LTD.', branch: 'CHITTAGONG VETERINARY AND ANIMAL SCIENCES UNIVERSITY', zone: 'TAXZONE-1,CHATTOGRAM', circle: 'CIRCLE-18' },
];

// The public NBR documentation defines the AIT-on-Car lookup contract
// (Unique Key/Transaction No. -> Search -> Save) but does not publish
// real taxpayer transaction IDs. Keep this catalogue empty rather than
// inventing tax records. The UI still implements the complete lookup state.
export const AIT_CAR_SOURCE: AitCarRecord[] = [];
