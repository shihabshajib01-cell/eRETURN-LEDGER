# Current eReturn Ledger Functional Baseline

This document is the functional source-of-truth for redesign work.

## Golden rule

The redesign must preserve every function, field, action, workflow, status, search/sync path, edit/delete action, tax-credit relationship, and eReturn handoff that exists in the current eReturn Ledger unless a newer verified NBR source explicitly changes it.

A cleaner UI is not permission to remove functionality.

## Source priority

1. Latest current-system screenshots supplied for this project
2. Official NBR eReturn guidance / FAQ
3. Current verified eReturn Ledger behavior
4. Existing repository implementation
5. UX improvements

When sources conflict, newer verified current-system evidence wins.

## Entry and exit

- eReturn Tax & Payment -> Update Tax Payment Status -> eReturn Ledger
- Ledger Home instructions
- Tax Payment Status
- Go to eReturn / Go to Return handoff

## Claim Source Tax

### Salary (iBAS++)
- Retrieve/search iBAS salary TDS
- Show available TDS
- Allow taxpayer TDS claim amount
- Save claim
- Existing claimed record can be updated according to current-system behavior

### Salary (Others)
- Manual entry
- Depositing authority
- Payment document type
- Challan/certificate reference
- Challan/certificate date
- Challan/certificate amount
- Claimed amount
- Add
- Edit
- Delete
- Save/cancel current entry

### Bank/FI Interest/Profit
- Sync From Income
- Show Income-side source records
- Select records
- Capture/confirm required TDS information
- Save/sync selected records
- Existing Ledger records remain manageable as current system permits

### Dividend [Section 117]
- Sync From Income
- Show Income-side dividend records
- Select records
- Capture/confirm certificate/challan information
- Save selected records
- Delete existing Ledger record when current system exposes Delete

### Sanchayapatra
- Sync From Income
- Income-side Financial Asset > Sanchayapatra records are available to sync
- Registration-number search where current system exposes it
- TDS available
- TDS claim, including taxpayer's own portion for joint holding
- Save
- Search/reset behavior where exposed
- Do not remove Sync From Income

### Service Payment [Section 90]
- Sync From Income where available
- Manual Add
- Payment document fields
- Claimed amount
- Edit
- Delete
- Save/cancel

### Import
- Preserve current system-provided import TDS records and fields
- Preserve read-only/system behavior unless verified source shows editable actions

### Commercial Vehicle
- Unique Key / Transaction No. lookup
- Search
- Display returned payment/TDS record
- Save into Ledger
- Preserve existing records and delete behavior where current system exposes it

### Other TDS
- Purpose of Payment selection
- Depositing authority
- Payment document type
- Challan/certificate details
- Claimed amount
- Add
- Edit
- Delete
- Save/cancel

## Claim AIT

### AIT on Car
- Unique Key (Transaction No.) input
- Search
- Show retrieved AIT payment data
- Save claim
- Do not replace Search -> Result -> Save with table filtering

### AIT (154)
- Challan information input/search/save path
- Retrieved challan details
- Save into Ledger
- Delete current claim where current system exposes Delete

## Other tax/payment credits

### Tax Paid with Return (173)
- Challan input
- Reset
- Save
- Retrieved/payment details
- Delete where current system exposes it

### Environmental Surcharge
- Motor vehicle registration
- Transaction ID
- Bank
- Branch
- Payment date
- Paid amount
- Add/delete row behavior
- Total paid amount
- Surcharge Declared By Assessee
- Save

### Adjustment of Tax Refund
- Prior-year excess tax/refund adjustment
- Assessment year
- Return register/reference
- Submission date
- Return filing zone
- Return filing circle
- Refund amount
- Adjustment claim amount
- Add/edit/delete/save behavior exposed by current system
- Preserve the fact that final validity is subject to tax authority verification

### Adjustment of carry-forward tax u/s 163
- Preserve current claimed amount/status
- Delete/remove claim if current system exposes it
- Keep Tax Payment Status synchronized

## Tax Payment Status

- Source Tax total
- Advance Income Tax (AIT) total
- Tax Paid With Return
- Environmental Surcharge
- Adjustment of Tax Refund
- Carry-forward adjustment when present in current system
- Total
- Source Tax / AIT drilldown if current system exposes it
- Update tax payment using left menu
- Done?
- Go to eReturn / Go to Return

## Cross-cutting behavior

- Assessment year context
- EN/BN
- Search and Reset
- Sync From Income
- Add
- Edit
- Delete
- Save
- Cancel/Close
- Selection checkboxes where current system uses them
- Empty/no-data state
- Validation
- Error state
- Success state
- Refresh/reload persistence appropriate to actual system
- Mobile access to every action
- Keyboard accessibility
- Current user/taxpayer context
- No silent loss of a current-system action during redesign

## Verified NBR functional rules

- Bank/FI, Sanchayapatra, and Dividend can use Sync From Income after the related Income data has been entered.
- Sanchayapatra joint holders claim only their own applicable TDS portion.
- AIT on Car uses Unique Key (Transaction No.) -> Search -> Save.
- AIT (154) uses challan information to update advance-tax payment.
- Source-tax manual claims use the full Challan/Certificate Amount and the taxpayer-specific Claimed Amount.
- Adjustment of tax refund is subject to later tax-authority verification.
- Tax Payment Status is the final Ledger checkpoint before returning to eReturn.

## Redesign gate

No new UI phase is considered ready until:
1. Every current-system feature above exists in the implementation.
2. Every feature has a tested happy path.
3. Add/Edit/Delete/Search/Sync/Save/Reset/Go-to-eReturn behavior has regression coverage where applicable.
4. No current-system field or action is removed merely because it looks redundant.
5. Any intentional functional change is explicitly approved and backed by a verified newer requirement.
