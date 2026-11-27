import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { getTheme } from '../../design-system/theme';
import i18n from '../../i18n/i18n';
import { INITIAL_BENEFICIARIES, TAX_HEADS } from '../../shared/mockData';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import {
  calculateGiftTaxAmount,
  validateGiftPartiesStep,
  validateGiftValuationStep,
} from '../gift-tax/giftTaxLogic';
import {
  calculateTravelDisplayTotal,
  resolveDestinationBaseTax,
  validateTravelFormStep,
} from '../travel-tax/travelTaxLogic';
import {
  calculateItemsTotal,
  INITIAL_ALL_TAX_ITEMS,
  validateAndBuildTaxItem,
} from './allTaxLogic';
import { AllTaxFormStep } from './components/AllTaxFormStep';
import { AllTaxPreviewStep } from './components/AllTaxPreviewStep';
import { ACTIVE_PAYMENT_CHANNEL_OPTIONS } from './paymentChannels';

function renderPaymentsWithProviders(node: React.ReactElement): string {
  void i18n.changeLanguage('en');
  return renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={getTheme('light')}>{node}</ThemeProvider>
    </I18nextProvider>
  );
}

test('allTaxLogic validates line items and computes totals deterministically', () => {
  assert.equal(calculateItemsTotal(INITIAL_ALL_TAX_ITEMS), 15000);

  const valid = validateAndBuildTaxItem({
    selectedHeadId: TAX_HEADS[0].id,
    amountInput: '2500.50',
    assessmentYear: '2025-2026',
    remarks: 'Q1',
  });
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(valid.item.amount, 2500.5);
    assert.equal(calculateItemsTotal([...INITIAL_ALL_TAX_ITEMS, valid.item]), 17500.5);
  }

  const belowMin = validateAndBuildTaxItem({
    selectedHeadId: TAX_HEADS[0].id,
    amountInput: '50',
    assessmentYear: '2025-2026',
    remarks: '',
  });
  assert.deepEqual(belowMin, { ok: false, reason: 'min' });

  const invalidHead = validateAndBuildTaxItem({
    selectedHeadId: 'non-existent',
    amountInput: '500',
    assessmentYear: '2025-2026',
    remarks: '',
  });
  assert.deepEqual(invalidHead, { ok: false, reason: 'missing_head' });
});

test('giftTaxLogic and travelTaxLogic preserve 1:1 original calculations and validation', () => {
  assert.deepEqual(calculateGiftTaxAmount('250000'), {
    giftAmount: 250000,
    calculatedTax: 12500,
  });

  const giftPartiesErrors = validateGiftPartiesStep(
    { donorTin: '123', donorName: '', doneeTin: '991234567890', doneeName: 'Receiver' },
    { invalidTin: 'Invalid TIN', requiredDonorName: 'Required', requiredDoneeName: 'Required' }
  );
  assert.equal(giftPartiesErrors.donorTin, 'Invalid TIN');
  assert.equal(giftPartiesErrors.donorName, 'Required');
  assert.equal(giftPartiesErrors.doneeTin, undefined);

  const giftValuationErrors = validateGiftValuationStep(
    { giftAmountInput: '500', description: '', giftDate: '2099-01-01' },
    {
      amountMin: 'Min 1000',
      amountInvalid: 'Invalid',
      requiredDescription: 'Desc required',
      futureGiftDate: 'Future date blocked',
    }
  );
  assert.equal(giftValuationErrors.giftAmount, 'Min 1000');
  assert.equal(giftValuationErrors.giftDate, 'Future date blocked');
  assert.equal(giftValuationErrors.description, 'Desc required');

  const emptyAndInvalidDateErrors = [
    validateGiftValuationStep(
      { giftAmountInput: '500000', description: 'Land gift', giftDate: '' },
      {
        amountMin: 'Min 1000',
        amountInvalid: 'Invalid',
        requiredDescription: 'Desc required',
        requiredGiftDate: 'Date required',
        invalidGiftDate: 'Invalid date',
      }
    ),
    validateGiftValuationStep(
      { giftAmountInput: '500000', description: 'Land gift', giftDate: '__INVALID_DATE__' },
      {
        amountMin: 'Min 1000',
        amountInvalid: 'Invalid',
        requiredDescription: 'Desc required',
        requiredGiftDate: 'Date required',
        invalidGiftDate: 'Invalid date',
      }
    ),
  ];
  assert.equal(emptyAndInvalidDateErrors[0].giftDate, 'Date required');
  assert.equal(emptyAndInvalidDateErrors[1].giftDate, 'Invalid date');

  assert.equal(resolveDestinationBaseTax('India (By Air)'), 2000);
  assert.equal(resolveDestinationBaseTax('SAARC Countries'), 3000);
  assert.equal(resolveDestinationBaseTax('Other International'), 5000);
  assert.equal(calculateTravelDisplayTotal(2000, 'Economy'), 2000);
  assert.equal(calculateTravelDisplayTotal(2000, 'Business'), 3000);

  const travelErrors = validateTravelFormStep(
    { passportNumber: 'AB', passengerName: '' },
    { invalidPassport: 'Bad passport', requiredPassengerName: 'Name required' }
  );
  assert.equal(travelErrors.passport, 'Bad passport');
  assert.equal(travelErrors.passengerName, 'Name required');
});

test('AllTaxFormStep renders AppCheckbox and AllTaxPreviewStep renders accessible payment channel AppRadioCards', () => {
  const formHtml = renderPaymentsWithProviders(
    <AllTaxFormStep
      selectedCategory="tax_with_return"
      assessmentYear="2025-2026"
      selectedHeadId={TAX_HEADS[0].id}
      amountInput="15000"
      amountError=""
      beneficiaryError=""
      formBannerError=""
      remarks=""
      isForBeneficiary
      beneficiaryTin=""
      beneficiaries={INITIAL_BENEFICIARIES}
      items={INITIAL_ALL_TAX_ITEMS}
      totalAmount={15000}
      onChangeCategory={() => {}}
      onToggleBeneficiary={() => {}}
      onChangeBeneficiaryTin={() => {}}
      onChangeAssessmentYear={() => {}}
      onChangeSelectedHeadId={() => {}}
      onChangeAmountInput={() => {}}
      onChangeRemarks={() => {}}
      onAddItem={() => {}}
      onRemoveItem={() => {}}
      onSaveDraft={() => {}}
      onProceedToPreview={() => {}}
    />
  );
  assert.match(formHtml, /type="checkbox"/);
  assert.match(formHtml, /Select Beneficiary/);

  const previewHtml = renderPaymentsWithProviders(
    <AllTaxPreviewStep
      userTin="882349102384"
      userName="Md. Rafiqul Islam"
      isForBeneficiary={false}
      beneficiaryTin=""
      selectedCategory="tax_with_return"
      paymentChannel="bKash"
      totalAmount={15000}
      onChangeChannel={() => {}}
      onBack={() => {}}
      onConfirmPayment={() => {}}
    />
  );
  assert.match(previewHtml, /role="radiogroup"/);
  const radioCount = (previewHtml.match(/type="radio"/g) ?? []).length;
  assert.equal(radioCount, ACTIVE_PAYMENT_CHANNEL_OPTIONS.length);
  assert.match(previewHtml, /bKash/);
  assert.match(previewHtml, /CityBank/);
  assert.match(previewHtml, /৳ 15,000/);

  // Handler-level preview boundary blocks restricted write operations
  assert.equal(isRestrictedOperationAllowed('payment_submit', true), false);
  assert.equal(isRestrictedOperationAllowed('draft_write', true), false);
  assert.equal(isRestrictedOperationAllowed('payment_submit', false), true);
});
