import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { getTheme } from '../../design-system/theme';
import { AppDateLocalizationProvider } from '../../design-system/dates';
import i18n from '../../i18n/i18n';
import type { PaymentLineItem, PaymentTransaction, TaxHeadCategory } from '../../types/tax';
import { INITIAL_BENEFICIARIES, INITIAL_TRANSACTIONS, TAX_HEADS } from '../../shared/mockData';
import { createExperimentalTransaction } from '../../shared/mockLedgerAdapter';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import { PaymentSuccessCard } from '../../components/payments/PaymentSuccessCard';
import { ReceiptModal } from '../../components/ReceiptModal';
import {
  calculateGiftTaxAmount,
  validateGiftPartiesStep,
  validateGiftValuationStep,
} from '../gift-tax/giftTaxLogic';
import { GiftTaxPreviewStep } from '../gift-tax/components/GiftTaxPreviewStep';
import { GiftTaxValuationStep } from '../gift-tax/components/GiftTaxValuationStep';
import {
  calculateTravelDisplayTotal,
  resolveDestinationBaseTax,
  validateTravelFormStep,
} from '../travel-tax/travelTaxLogic';
import { TravelTaxFormStep } from '../travel-tax/components/TravelTaxFormStep';
import { ALL_TAX_CATEGORIES } from './allTaxCatalogue';
import {
  calculateItemsTotal,
  INITIAL_ALL_TAX_ITEMS,
  normalizeChallanRemarks,
  rankFrequentPaymentCategories,
  validateAndBuildTaxItem,
  validateCombinedLineAddition,
} from './allTaxLogic';
import { AllTaxCategoryStep } from './components/AllTaxCategoryStep';
import { AllTaxFormStep } from './components/AllTaxFormStep';
import { AllTaxPreviewStep } from './components/AllTaxPreviewStep';
import { AllTaxResultStep } from './components/AllTaxResultStep';
import { ACTIVE_PAYMENT_CHANNEL_OPTIONS } from './paymentChannels';

function renderPaymentsWithProviders(node: React.ReactElement): string {
  void i18n.changeLanguage('en');
  return renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={getTheme('light')}>
        <AppDateLocalizationProvider>{node}</AppDateLocalizationProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

test('allTaxCatalogue and allTaxLogic enforce 7 categories, max 5 frequent, Return AY & multi-taxpayer rules', () => {
  assert.equal(ALL_TAX_CATEGORIES.length, 7);
  assert.equal(calculateItemsTotal(INITIAL_ALL_TAX_ITEMS), 15000);

  // Frequent categories: signed-out -> []; <2 completed -> []; signed-in >=2 -> max 5 deduplicated
  assert.deepEqual(rankFrequentPaymentCategories(INITIAL_TRANSACTIONS, false), []);
  assert.deepEqual(rankFrequentPaymentCategories([INITIAL_TRANSACTIONS[0]], true), []);

  const cats: TaxHeadCategory[] = [
    'tax_with_return', 'advance_tax', 'assessed_demand', 'penalty', 'source_tax', 'appellate_tribunal',
  ];
  const syntheticHistory: PaymentTransaction[] = cats.map((cat, idx) => ({
    ...INITIAL_TRANSACTIONS[0],
    id: `tx-f-${idx}`,
    category: cat,
    createdAt: `2026-0${idx + 1}-10T10:00:00Z`,
    items: [{ ...INITIAL_TRANSACTIONS[0].items[0], category: cat }],
  }));
  const frequent = rankFrequentPaymentCategories(syntheticHistory, true, 5);
  assert.equal(frequent.length, 5);

  // Per-taxpayer Return AY & mixing rules: allow Taxpayer A Return + Taxpayer B Advance, block same-taxpayer mixing
  const taxpayerAReturn: PaymentLineItem = {
    headId: 'h1',
    headCode: '0111',
    headNameEn: 'Income Tax with Return',
    headNameBn: 'রিটার্নসহ কর',
    assessmentYear: '2025-2026',
    amount: 10000,
    taxpayerTin: '882349102384',
    category: 'tax_with_return',
  };
  const taxpayerAReturnOtherAy: PaymentLineItem = { ...taxpayerAReturn, assessmentYear: '2026-2027' };
  const taxpayerAAdvance: PaymentLineItem = { ...taxpayerAReturn, headId: 'h2', headCode: '0112', category: 'advance_tax' };
  const taxpayerBAdvance: PaymentLineItem = { ...taxpayerAAdvance, taxpayerTin: '992384102938' };

  assert.deepEqual(validateCombinedLineAddition([taxpayerAReturn], taxpayerAReturnOtherAy), {
    ok: false,
    reason: 'return_single_ay_per_taxpayer',
  });
  assert.deepEqual(validateCombinedLineAddition([taxpayerAReturn], taxpayerAAdvance), {
    ok: false,
    reason: 'return_cannot_mix_same_taxpayer',
  });
  assert.deepEqual(validateCombinedLineAddition([taxpayerAReturn], taxpayerBAdvance), { ok: true });

  assert.equal(normalizeChallanRemarks('Line 1\r\nবাংলা মন্তব্য'), 'Line 1\nবাংলা মন্তব্য');

  const valid = validateAndBuildTaxItem({
    selectedHeadId: TAX_HEADS[0].id,
    amountInput: '2500.50',
    assessmentYear: '2025-2026',
    remarks: 'Q1\nLine 2',
  });
  assert.equal(valid.ok, true);
});

test('giftTaxLogic and travelTaxLogic preserve 1:1 original calculations and validation', () => {
  assert.deepEqual(calculateGiftTaxAmount('250000'), { giftAmount: 250000, calculatedTax: 12500 });
  const giftPartiesErrors = validateGiftPartiesStep(
    { donorTin: '123', donorName: '', doneeTin: '991234567890', doneeName: 'Receiver' },
    { invalidTin: 'Invalid TIN', requiredDonorName: 'Required', requiredDoneeName: 'Required' }
  );
  assert.equal(giftPartiesErrors.donorTin, 'Invalid TIN');
  const giftValuationErrors = validateGiftValuationStep(
    { giftAmountInput: '500', description: '', giftDate: '2099-01-01' },
    { amountMin: 'Min 1000', amountInvalid: 'Invalid', requiredDescription: 'Desc required', futureGiftDate: 'Future date blocked' }
  );
  assert.equal(giftValuationErrors.giftAmount, 'Min 1000');

  assert.equal(resolveDestinationBaseTax('India (By Air)'), 2000);
  assert.equal(calculateTravelDisplayTotal(2000, 'Business'), 3000);
  const travelErrors = validateTravelFormStep(
    { passportNumber: 'AB', passengerName: '' },
    { invalidPassport: 'Bad passport', requiredPassengerName: 'Name required' }
  );
  assert.equal(travelErrors.passport, 'Bad passport');
});

test('AllTax Chooser, Form, Preview, and Walk-In Result components render cleanly', () => {
  const chooserHtml = renderPaymentsWithProviders(
    <AllTaxCategoryStep
      selectedCategory="tax_with_return"
      frequentCategories={['tax_with_return', 'advance_tax']}
      onSelectCategory={() => {}}
    />
  );
  assert.match(chooserHtml, /data-testid="frequent-tax-categories"/);
  assert.match(chooserHtml, /all-tax-category-tax_with_return/);
  assert.match(chooserHtml, /all-tax-category-appellate_tribunal/);

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
      isAuthenticated={false}
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
  assert.match(formHtml, /role="combobox"/);
  assert.match(formHtml, /<textarea/);
  assert.doesNotMatch(formHtml, /Save as Draft/);

  const previewHtml = renderPaymentsWithProviders(
    <AllTaxPreviewStep
      userTin="882349102384"
      userName="Md. Rafiqul Islam"
      isForBeneficiary={false}
      beneficiaryTin=""
      selectedCategory="tax_with_return"
      paymentChannel="bKash"
      items={INITIAL_ALL_TAX_ITEMS}
      totalAmount={15000}
      onChangeChannel={() => {}}
      onBack={() => {}}
      onConfirmPayment={() => {}}
    />
  );
  assert.equal((previewHtml.match(/type="radio"/g) ?? []).length, ACTIVE_PAYMENT_CHANNEL_OPTIONS.length);

  const walkInResultHtml = renderPaymentsWithProviders(
    <AllTaxResultStep
      transaction={INITIAL_TRANSACTIONS[0]}
      isAuthenticated={false}
      onViewReceipt={() => {}}
      onViewCertificate={() => {}}
      onSignInToClaim={() => {}}
      onContinueWalkIn={() => {}}
      onReturnDashboard={() => {}}
    />
  );
  assert.match(walkInResultHtml, /data-testid="walkin-payment-result"/);
  assert.match(walkInResultHtml, /Sign in to Claim Payment/);
  assert.match(walkInResultHtml, /Continue without signing in/);
  assert.equal(isRestrictedOperationAllowed('payment_submit', true), false);
});

test('Gift Tax, Travel Tax, and Receipt enforce strict giftDate and non-official claims', () => {
  const giftTx = INITIAL_TRANSACTIONS.find((tx) => tx.category === 'gift_tax')!;
  const receiptHtml = renderPaymentsWithProviders(
    <ReceiptModal open disablePortal onClose={() => {}} transaction={{ ...giftTx, giftDate: '2026-04-10' }} />
  );
  assert.match(receiptHtml, /2026-04-10/);
  assert.throws(() => createExperimentalTransaction({ ...giftTx, giftDate: '2026-02-30' }), /Invalid giftDate/);

  const valuationHtml = renderPaymentsWithProviders(
    <GiftTaxValuationStep giftAmountInput="500000" giftDate="2026-04-10" description="Land gift" calculatedTax={25000} errors={{}} onChangeAmount={() => {}} onChangeGiftDate={() => {}} onChangeDescription={() => {}} onBack={() => {}} onNext={() => {}} />
  );
  assert.match(valuationHtml, /Sample Gift Tax Preview/);

  const giftPreviewHtml = renderPaymentsWithProviders(
    <GiftTaxPreviewStep donorName="Donor" donorTin="882349102384" doneeName="Donee" doneeTin="992384102938" relationship="Mother" giftAmount={500000} giftDate="2026-04-10" calculatedTax={25000} onBack={() => {}} onPay={() => {}} />
  );
  assert.match(giftPreviewHtml, /Sample Gift Tax Estimate/);

  const travelFormHtml = renderPaymentsWithProviders(
    <TravelTaxFormStep passportNumber="A06829102" passengerName="Passenger" destination="India (By Air)" travelClass="Economy" baseAmount={2000} errors={{}} onChangePassport={() => {}} onChangePassengerName={() => {}} onChangeDestination={() => {}} onChangeTravelClass={() => {}} onSubmit={() => {}} />
  );
  assert.match(travelFormHtml, /Sample Travel Tax Preview/);

  const successHtml = renderPaymentsWithProviders(
    <PaymentSuccessCard title="Sample Gift Tax Preview Recorded" subtitle="Illustrative prototype record" onViewReceipt={() => {}} onReturnDashboard={() => {}} />
  );
  assert.match(successHtml, /View Sample Receipt/);
});
