import assert from 'node:assert/strict';
import {
  computeLedgerTotals,
  DEFAULT_CATEGORY_AMOUNTS,
} from '../src/domain/ledgerTotals';
import {
  isValidLedgerDate,
  isValidMoneyInput,
  parseMoneyStrict,
} from '../src/utils/validation';

const baseline = computeLedgerTotals(DEFAULT_CATEGORY_AMOUNTS);

assert.equal(baseline.sourceTax, 13_304_252, 'Source Tax must equal the visible source-tax category records.');
assert.equal(baseline.advanceIncomeTax, 118_365, 'AIT must equal the visible AIT category records.');
assert.equal(baseline.taxPaidWithReturn, 1_004_342);
assert.equal(baseline.environmentalSurcharge, 50_000);
assert.equal(baseline.adjustmentOfTaxRefund, 1_003_333);
assert.equal(baseline.carryForwardTax, 1_003_333);
assert.equal(baseline.total, 16_483_625, 'Ledger total must reconcile from category amounts without hidden residuals.');

const withoutAit154 = computeLedgerTotals({
  ...DEFAULT_CATEGORY_AMOUNTS,
  'ait-154': 0,
});
assert.equal(withoutAit154.advanceIncomeTax, 0, 'Deleting all AIT claims must leave no hidden AIT residual.');
assert.equal(withoutAit154.total, baseline.total - 118_365);

const withoutOtherTds = computeLedgerTotals({
  ...DEFAULT_CATEGORY_AMOUNTS,
  'other-tds': 0,
});
assert.equal(
  withoutOtherTds.sourceTax,
  baseline.sourceTax - 6_970_044,
  'Source Tax must react exactly to category changes.'
);

assert.equal(isValidMoneyInput('1,00,000'), true);
assert.equal(isValidMoneyInput('100000'), true);
assert.equal(isValidMoneyInput('100.50'), true);
assert.equal(isValidMoneyInput('abc'), false);
assert.equal(isValidMoneyInput(''), false);
assert.equal(isValidMoneyInput('-10'), false);
assert.equal(isValidMoneyInput('1,2,3'), false);
assert.equal(parseMoneyStrict('1,00,000'), 100000);
assert.equal(parseMoneyStrict('bad input'), null);

assert.equal(isValidLedgerDate('31-08-2026'), true);
assert.equal(isValidLedgerDate('29-02-2024'), true);
assert.equal(isValidLedgerDate('31-02-2026'), false);
assert.equal(isValidLedgerDate('2026-08-31'), false);
assert.equal(isValidLedgerDate(''), false);

console.log('Ledger domain and validation tests passed.');
