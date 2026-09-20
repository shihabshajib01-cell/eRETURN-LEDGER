# eReturn Ledger Functional Freeze

This document freezes the functional baseline before UI/UX redesign work begins.

## Rule

The UI may change. The current eLedger capability set may not be silently reduced.

A redesign is acceptable only when every existing function, field, action, status, lookup, sync path, validation rule, tax relationship, and eReturn handoff remains available or is explicitly replaced by a newer verified NBR requirement.

## Current functional routes

- Home / Ledger guidance
- Salary (iBAS++)
- Salary (Others)
- Bank/FI Interest/Profit
- Dividend
- Service Payment
- Sanchayapatra
- Import
- Commercial Vehicle
- Others / Other TDS
- AIT on Car
- AIT under section 154
- Tax Paid with Return under section 173
- Environmental Surcharge
- Adjustment of Tax Refund
- Adjustment of carry-forward tax under section 163
- Tax Payment Status
- Go to eReturn
- User Guide
- FAQ
- Taxpayer Profile
- Notifications
- Logout

## Non-negotiable journeys

### iBAS
Search -> retrieved salary/TDS -> claim -> Save.

### Income-linked source tax
Bank/FI, Dividend, Service Payment, and Sanchayapatra preserve Sync From Income behavior. If the related Income source has no records, the sync result may be empty.

### Manual claims
Salary (Others), Service Payment, Other TDS, Environmental Surcharge, and other current manual flows preserve Add, validation, Save/Cancel, Edit, Delete, and taxpayer-specific claim amounts.

### Sanchayapatra
Registration search, Sync From Income, TDS Available, taxpayer TDS Claim, joint-holder own-portion rule, Save, Edit, Delete.

### External verification
Commercial Vehicle and AIT on Car preserve Search -> Result -> Save.
AIT 154 and section 173 preserve challan verification and Save.

### Refund adjustment
Preserve prior-year details, claimed amount, Add/Edit/Delete, and tax-authority verification status.

### Final reconciliation
Tax Payment Status derives from the same category amounts used by Ledger pages. No hidden residual amount is allowed.

## State and totals

- Tax Payment Status is derived from category amounts through the shared Ledger total model.
- No hard-coded master Source Tax or AIT total may override visible category data.
- Category delete/edit/save operations must update reconciliation totals.
- The current prototype may use local persistence, but UI work must not introduce a second competing source of truth.
- Authenticated backend integration points remain explicit and replaceable.

## Private integration boundaries

The public UI is already prepared for verified production connections through:

- `VITE_IBAS_TDS_LOOKUP_API`
- `VITE_ERETURN_INCOME_SYNC_API`
- `VITE_ELEDGER_LOOKUP_API`
- `VITE_ERETURN_LOGOUT_URL`
- eReturn return target / handoff

Do not invent undocumented NBR endpoints or taxpayer data.

## Validation baseline

- Amounts must be valid non-negative numeric values.
- Malformed text must not silently become zero.
- Ledger dates use validated DD-MM-YYYY values where the current flow uses that format.
- Claimed amount cannot exceed the related document/available amount where that relationship applies.
- Required fields stay required.
- Current duplicate/search/sync protections must be preserved.

## Manual table baseline

For manual-entry tables:

- Add creates an editable row in the table.
- Existing saved rows remain visible.
- Save commits the row.
- Cancel removes the unsaved row.
- Only one unfinished Add row is allowed at a time.
- Enter saves when valid.
- Escape cancels.
- Edit/Delete remain available where the current system exposes them.
- Mobile must preserve every desktop action.

## Responsive and accessibility baseline

- Every action must be reachable on mobile.
- Complex tables may transform into mobile cards, but fields/actions cannot disappear.
- Dialogs remain keyboard-operable.
- Focus must be trapped/restored for modal workflows.
- EN/BN behavior must remain functionally equivalent.
- Validation and error states must be associated with the relevant control.

## UI/UX redesign gate

A redesigned screen passes only if:

1. It contains every function from the frozen current screen.
2. It preserves the same business rules and data relationships.
3. Search, Sync, Add, Edit, Delete, Save, Reset, Cancel/Close and handoff actions still work where applicable.
4. Tax Payment Status still reconciles from actual Ledger category amounts.
5. Mobile and EN/BN retain the complete journey.
6. CI typecheck, functional freeze audit, executable domain tests and production build all pass.
7. Any removed function has an explicit verified newer requirement approving its removal.

## Redesign principle

Better UX means making the same required capability clearer, faster, safer, more accessible, or easier to understand.

It does not mean deleting a current eLedger capability because the screen looks cleaner without it.
