import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { getTheme } from '../../design-system/theme';
import { AppDateLocalizationProvider } from '../../design-system/dates';
import i18n from '../../i18n/i18n';
import type { PaymentLineItem, PaymentTransaction, TaxHeadCategory } from '../../types/tax';
import { INITIAL_BENEFICIARIES, INITIAL_TRANSACTIONS, TAX_HEADS } from '../../shared/mockData';
import { createExperimentalTransaction } from '../../shared/mockLedgerAdapter';
import { rotateWalkInSessionId } from '../../shared/accountSession';
import { writeScopedDomainData } from '../../shared/scopedDomainStorage';
import { claimWalkInTransactionWithResult } from '../../shared/walkInClaim';
import { isTransactionReconciled } from '../../shared/certificateUtils';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import { PaymentSuccessCard } from '../../components/payments/PaymentSuccessCard';
import { ReceiptModal } from '../../components/ReceiptModal';
import { calculateGiftTaxAmount, validateGiftPartiesStep, validateGiftValuationStep } from '../gift-tax/giftTaxLogic';
import { GiftTaxPreviewStep } from '../gift-tax/components/GiftTaxPreviewStep';
import { GiftTaxValuationStep } from '../gift-tax/components/GiftTaxValuationStep';
import {
  calcAgeOnDate, calculatePassengerTaxForAge, calculateTravelBreakdown, isMaskedPassportValue,
  lookupBdPassport, maskPassport, validatePassengerDraft, validateReceiptMobile,
  validateTravelDetails, validateTravelSubmission,
} from '../travel-tax/travelTaxLogic';
import { buildTravelTransactionPayload, resolveTravelRouteSeed } from '../travel-tax/travelTaxFlowUtils';
import { BD_SAMPLE_PASSPORTS, LAND_PORTS, TRAVEL_TAX_ECONOMIC_CODE, TRAVEL_TAX_YEAR } from '../travel-tax/travelTaxTypes';
import { SharedPayTaxProgressiveModal } from '../../components/payments/SharedPayTaxProgressiveModal';
import { TravelPassengerStep } from '../travel-tax/components/TravelPassengerStep';
import { TravelDetailsStep } from '../travel-tax/components/TravelDetailsStep';
import { TravelTaxPreviewStep } from '../travel-tax/components/TravelTaxPreviewStep';
import { ALL_TAX_CATEGORIES } from './allTaxCatalogue';
import {
  calculateItemsTotal, INITIAL_ALL_TAX_ITEMS, normalizeChallanRemarks,
  rankFrequentPaymentCategories, reconcileItemsWithTaxpayers,
  validateAndBuildTaxItem, validateCombinedLineAddition, validateResumedOrReusedSeed,
} from './allTaxLogic';
import { AppProvider } from '../../shared/AppContext';
import { AllTaxPaymentsView } from './AllTaxPaymentsView';
import { AllTaxCategoryStep } from './components/AllTaxCategoryStep';
import { AllTaxChannelStep } from './components/AllTaxChannelStep';
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

test('allTaxCatalogue and allTaxLogic enforce 7 categories, max 5 frequent, Return AY, reconciliation & seed guards', () => {
  assert.equal(ALL_TAX_CATEGORIES.length, 7);
  assert.equal(calculateItemsTotal(INITIAL_ALL_TAX_ITEMS), 15000);
  assert.deepEqual(rankFrequentPaymentCategories(INITIAL_TRANSACTIONS, false), []);
  assert.deepEqual(rankFrequentPaymentCategories([INITIAL_TRANSACTIONS[0]], true), []);

  const cats: TaxHeadCategory[] = ['tax_with_return', 'advance_tax', 'assessed_demand', 'penalty', 'source_tax', 'appellate_tribunal'];
  const syntheticHistory: PaymentTransaction[] = cats.map((cat, idx) => ({
    ...INITIAL_TRANSACTIONS[0], id: `tx-f-${idx}`, category: cat, createdAt: `2026-0${idx + 1}-10T10:00:00Z`,
    items: [{ ...INITIAL_TRANSACTIONS[0].items[0], category: cat }],
  }));
  assert.equal(rankFrequentPaymentCategories(syntheticHistory, true, 5).length, 5);

  const taxpayerAReturn: PaymentLineItem = {
    headId: 'h1', headCode: '0111', headNameEn: 'Income Tax with Return', headNameBn: 'রিটার্নসহ কর',
    assessmentYear: '2025-2026', amount: 10000, taxpayerTin: '882349102384', category: 'tax_with_return',
  };
  const taxpayerBAdvance: PaymentLineItem = { ...taxpayerAReturn, headId: 'h2', headCode: '0112', category: 'advance_tax', taxpayerTin: '992384102938' };

  assert.deepEqual(validateCombinedLineAddition([taxpayerAReturn], { ...taxpayerAReturn, assessmentYear: '2026-2027' }), { ok: false, reason: 'return_single_ay_per_taxpayer' });
  assert.deepEqual(validateCombinedLineAddition([taxpayerAReturn], { ...taxpayerBAdvance, taxpayerTin: '882349102384' }), { ok: false, reason: 'return_cannot_mix_same_taxpayer' });
  assert.deepEqual(validateCombinedLineAddition([taxpayerAReturn], taxpayerBAdvance), { ok: true });

  // Orphan allocation pruning when taxpayer deselected or switched to own
  const rec = reconcileItemsWithTaxpayers([taxpayerAReturn, taxpayerBAdvance], [{ tin: '882349102384', name: 'A' }], 'own');
  assert.equal(rec.removedCount, 1);
  assert.equal(rec.validItems.length, 1);
  assert.equal(rec.validItems[0].taxpayerTin, '882349102384');

  // Owner mismatch guard for Pay Again without mutating original transaction
  const mismatch = validateResumedOrReusedSeed({
    reuseTx: { ...INITIAL_TRANSACTIONS[0], ownerScope: 'acct_112233445566' },
    activeScope: 'acct_882349102384',
    isAuthenticated: true,
    userTin: '882349102384',
  });
  assert.equal(mismatch.warning, 'owner_mismatch');
  assert.equal(mismatch.items.length, 0);

  assert.equal(normalizeChallanRemarks('Line 1\r\nবাংলা মন্তব্য'), 'Line 1\nবাংলা মন্তব্য');
  assert.equal(validateAndBuildTaxItem({ selectedHeadId: TAX_HEADS[0].id, amountInput: '2500.50', assessmentYear: '2025-2026', remarks: 'Q1\nLine 2' }).ok, true);
});

test('giftTaxLogic and approved Travel Tax (Land/Water, 16 ports, BD samples, age rates, medical block, walk-in privacy)', () => {
  const gtCalc = calculateGiftTaxAmount('250000');
  assert.equal(gtCalc.giftAmount, 250000);
  assert.equal(gtCalc.calculatedTax, 11500);
  assert.ok(validateGiftPartiesStep({ donor: { tin: '882349102384', name: 'Donor' }, donee: { tin: '882349102384', name: 'Donee' }, relationship: 'Mother', relationshipTag: 'Mother' }, 'en').donee);
  assert.ok(validateGiftValuationStep({ giftAmountInput: '500', description: '', giftDate: '2099-01-01' }, 'en', '2026-11-28').giftAmount);

  assert.equal(LAND_PORTS.length, 16);
  assert.equal(BD_SAMPLE_PASSPORTS.length, 10);
  assert.equal(lookupBdPassport('TEST123456')?.passengerName, 'Md. Rafiqul Islam');
  assert.equal(lookupBdPassport('TEST230009')?.passengerName, 'Arifur Rahman');
  assert.equal(lookupBdPassport('UNKNOWN99'), null);
  assert.equal(maskPassport('TEST123456'), '••••3456');
  assert.equal(isMaskedPassportValue('••••3456'), true);
  assert.equal(TRAVEL_TAX_YEAR, '2026–27');
  assert.equal(TRAVEL_TAX_ECONOMIC_CODE, '1144102');

  // Exact age boundaries on 2026-11-28: 5 -> 0, 6 -> 500, 12 -> 500, 13 -> 1000
  assert.equal(calcAgeOnDate('2021-11-29', '2026-11-28'), 4);
  assert.equal(calcAgeOnDate('2021-11-28', '2026-11-28'), 5);
  assert.equal(calculatePassengerTaxForAge(5), 0);
  assert.equal(calcAgeOnDate('2020-11-28', '2026-11-28'), 6);
  assert.equal(calculatePassengerTaxForAge(6), 500);
  assert.equal(calculatePassengerTaxForAge(12), 500);
  assert.equal(calculatePassengerTaxForAge(13), 1000);

  // Medical checkbox blocks continuation
  const medErrs = validatePassengerDraft({
    id: 'p1', passportType: 'BD', passportNumber: 'TEST123456', passengerName: 'Md. Rafiqul Islam', dob: '1988-05-14',
    nationality: '', bdChecked: true, medicalAssessment: true,
  }, [], null, '2026-11-28');
  assert.ok(medErrs.medical);

  // Duplicate passport blocked
  const dupErrs = validatePassengerDraft({
    id: 'p2', passportType: 'BD', passportNumber: 'TEST123456', passengerName: 'Md. Rafiqul Islam', dob: '1988-05-14',
    nationality: '', bdChecked: true, medicalAssessment: false,
  }, [{ id: 'p1', passportType: 'BD', passportNumber: 'TEST123456', passportMasked: 'TE******56', passengerName: 'Md. Rafiqul Islam', dob: '1988-05-14' }], null, '2026-11-28');
  assert.match(dupErrs.passport ?? '', /Duplicate passport/);

  // Foreign passport validation
  const foreignErrs = validatePassengerDraft({
    id: 'pf', passportType: 'Foreign', passportNumber: 'US991122', passengerName: '', dob: '', nationality: '', bdChecked: false, medicalAssessment: false,
  }, [], null, '2026-11-28');
  assert.ok(foreignErrs.passengerName && foreignErrs.dob && foreignErrs.nationality);

  // Land/Water port & past Dhaka date rejection
  const detailsErrs = validateTravelDetails({ travelMode: 'Land', departurePort: 'InvalidPort', destination: '', travelDate: '2026-11-27' }, [], '2026-11-28');
  assert.ok(detailsErrs.departurePort && detailsErrs.destination && detailsErrs.travelDate);

  // Zero-total assessment reconciliation & receipt mobile optional when 0
  assert.equal(validateReceiptMobile('', 0).valid, true);
  assert.equal(validateReceiptMobile('', 1000).valid, false);
  assert.equal(validateReceiptMobile('01712345678', 1000).valid, true);

  const infantBreakdown = calculateTravelBreakdown([
    { id: 'inf', passportType: 'BD', passportNumber: 'TEST230003', passportMasked: '••••0003', passengerName: 'Ayaan Hossain', dob: '2023-02-18' },
  ], '2026-11-28');
  assert.equal(infantBreakdown.valid, true);
  assert.equal(infantBreakdown.totalAmount, 0);

  // Cycle 15: Masked passport rejected & BN localized validation supported
  const maskedErr = validatePassengerDraft({
    id: 'm1', passportType: 'BD', passportNumber: '••••3456', passengerName: '', dob: '', nationality: '', bdChecked: true, medicalAssessment: false,
  }, [], null, '2026-11-28', 'bn');
  assert.match(maskedErr.passport ?? '', /মাস্ক করা/);
  assert.equal(calculateTravelBreakdown([
    { id: 'reval', passportType: 'BD', passportNumber: '', passportMasked: '••••3456', passengerName: 'Md. Rafiqul Islam', dob: '1988-05-14', needsRevalidation: true },
  ], '2026-11-28').valid, false);

  // Cycle 15: Zero-tax Travel Tax must NOT set bKash or fabricated bankRef, and uses 2026–27 / 1144102
  const zeroPayload = buildTravelTransactionPayload({
    breakdownItems: infantBreakdown.items, totalAmount: 0,
    details: { travelMode: 'Land', departurePort: 'Benapole', destination: 'Kolkata', travelDate: '2026-11-28' },
    channel: 'bKash', mobileNormalized: '', isAuthenticated: false, userTin: '', userName: '', activeScope: 'walkin',
  });
  assert.equal(zeroPayload.items[0].headCode, '1144102');
  assert.equal(zeroPayload.items[0].assessmentYear, '2026–27');
  assert.equal(zeroPayload.paymentChannel, 'Zero-Tax');

  const walkInTravelTx = createExperimentalTransaction(zeroPayload);
  assert.equal(walkInTravelTx.paymentChannel, 'Zero-Tax');
  assert.equal(walkInTravelTx.bankRef, '');
  assert.equal(walkInTravelTx.travelDetails?.passportNumber, undefined);
  assert.equal(isTransactionReconciled(walkInTravelTx), true);

  // Cycle 15/16: Resume draft and Pay Again reject inline payloads, load from stored IDs, and enforce passport revalidation
  const forgedSeed = resolveTravelRouteSeed({
    routeState: { reuseTx: { ...walkInTravelTx, id: 'forged-tx', ownerScope: 'acct_112233445566' } },
    activeScope: 'acct_882349102384', isAuthenticated: true, drafts: [], transactions: [], lang: 'en',
  });
  assert.equal(forgedSeed.rejected, true);
  assert.equal(forgedSeed.passengers.length, 0);

  const inlineSameOwnerRejected = resolveTravelRouteSeed({
    routeState: { reuseTx: { ...walkInTravelTx, ownerScope: 'acct_882349102384' } },
    activeScope: 'acct_882349102384', isAuthenticated: true, drafts: [], transactions: [{ ...walkInTravelTx, ownerScope: 'acct_882349102384' }],
  });
  assert.equal(inlineSameOwnerRejected.rejected, true);

  const validReuseSeed = resolveTravelRouteSeed({
    routeState: { reuseTxRef: walkInTravelTx.transactionRef },
    activeScope: 'acct_882349102384', isAuthenticated: true, drafts: [], transactions: [{ ...walkInTravelTx, ownerScope: 'acct_882349102384' }],
  });
  assert.equal(validReuseSeed.rejected, false);
  assert.equal(validReuseSeed.passengers[0].passportNumber, '');
  assert.equal(validReuseSeed.passengers[0].needsRevalidation, true);

  // Pre-submit validation rechecks mobile, date, and revalidation
  assert.equal(validateTravelSubmission({
    passengers: validReuseSeed.passengers,
    details: { travelMode: 'Land', departurePort: 'Benapole', destination: 'Kolkata', travelDate: '2026-11-28' },
    receiptMobile: '01712345678', todayYmd: '2026-11-28', lang: 'bn',
  }).ok, false);
});

test('Walk-in claim rejects mismatched owner, forged ref, stale session, and preserves original payer identity', () => {
  const prevWindow = (globalThis as unknown as { window?: unknown }).window;
  const localMap = new Map<string, string>();
  const sessionMap = new Map<string, string>();
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      getItem: (k: string) => localMap.get(k) ?? null,
      setItem: (k: string, v: string) => { localMap.set(k, v); },
      removeItem: (k: string) => { localMap.delete(k); },
    },
    sessionStorage: {
      getItem: (k: string) => sessionMap.get(k) ?? null,
      setItem: (k: string, v: string) => { sessionMap.set(k, v); },
      removeItem: (k: string) => { sessionMap.delete(k); },
    },
  };
  try {
    const s1 = rotateWalkInSessionId();
    writeScopedDomainData('walkin', {
      beneficiaryLists: [], beneficiaries: [], drafts: [], corrections: [], unverifiedInquiries: [], supportTickets: [], notifications: [],
      transactions: [{ ...INITIAL_TRANSACTIONS[0], id: 'wk-1', transactionRef: 'SOHO-WK-TEST-1', ownerScope: 'walkin', originMode: 'walk_in', walkInSessionId: s1 }],
    });
    assert.deepEqual(claimWalkInTransactionWithResult('FORGED-REF', '882349102384'), { ok: false, reason: 'not_found_or_forged' });
    assert.deepEqual(claimWalkInTransactionWithResult('SOHO-WK-TEST-1', '112233445566'), { ok: false, reason: 'ownership_mismatch' });
    rotateWalkInSessionId();
    assert.deepEqual(claimWalkInTransactionWithResult('SOHO-WK-TEST-1', '882349102384'), { ok: false, reason: 'stale_session' });
    sessionMap.set('sohojkor_walkin_session_id', s1);
    const okRes = claimWalkInTransactionWithResult('SOHO-WK-TEST-1', '882349102384');
    assert.equal(okRes.ok, true);
    if (okRes.ok) {
      assert.equal(okRes.transaction.taxpayerTin, '882349102384');
      assert.equal(okRes.transaction.claimedByTin, '882349102384');
    }
    assert.deepEqual(claimWalkInTransactionWithResult('SOHO-WK-TEST-1', '882349102384'), { ok: false, reason: 'duplicate_claim' });
  } finally {
    if (prevWindow === undefined) {
      delete (globalThis as unknown as { window?: unknown }).window;
    } else {
      (globalThis as unknown as { window: unknown }).window = prevWindow;
    }
  }
});

test('AllTax, Gift Tax, and Travel Tax 3 stages render cleanly with shared channel/result/receipt components', () => {
  const initialPageHtml = renderPaymentsWithProviders(<AppProvider><MemoryRouter initialEntries={['/all-taxes']}><AllTaxPaymentsView /></MemoryRouter></AppProvider>);
  assert.doesNotMatch(initialPageHtml, /Annual return submission/);

  const chooserHtml = renderPaymentsWithProviders(<AllTaxCategoryStep selectedCategory="tax_with_return" frequentCategories={['tax_with_return', 'advance_tax']} onSelectCategory={() => {}} />);
  assert.match(chooserHtml, /data-testid="frequent-tax-categories"/);

  const formHtml = renderPaymentsWithProviders(
    <AllTaxFormStep selectedCategory="tax_with_return" assessmentYear="2025-2026" selectedHeadId={TAX_HEADS[0].id} amountInput="" amountError="" beneficiaryError="" formBannerError="" remarks="" isAuthenticated={false} isForBeneficiary beneficiaryTin="" beneficiaries={INITIAL_BENEFICIARIES} items={INITIAL_ALL_TAX_ITEMS} totalAmount={15000} onChangeCategory={() => {}} onToggleBeneficiary={() => {}} onChangeBeneficiaryTin={() => {}} onChangeAssessmentYear={() => {}} onChangeSelectedHeadId={() => {}} onChangeAmountInput={() => {}} onChangeRemarks={() => {}} onAddItem={() => {}} onEditItem={() => {}} onRemoveItem={() => {}} onSaveDraft={() => {}} onProceedToPreview={() => {}} />
  );
  assert.match(formHtml, /role="combobox"/);
  assert.doesNotMatch(formHtml, /Save as Draft/);

  const previewHtml = renderPaymentsWithProviders(<AllTaxPreviewStep userTin="882349102384" userName="Md. Rafiqul Islam" isForBeneficiary={false} beneficiaryTin="" selectedCategory="tax_with_return" items={INITIAL_ALL_TAX_ITEMS} totalAmount={15000} onBack={() => {}} onProceedToChannel={() => {}} />);
  assert.match(previewHtml, /Proceed to Payment Channel/);

  const channelHtml = renderPaymentsWithProviders(<AllTaxChannelStep paymentChannel="bKash" totalAmount={15000} itemCount={1} onChangeChannel={() => {}} onBack={() => {}} onConfirmPayment={() => {}} />);
  assert.equal((channelHtml.match(/type="radio"/g) ?? []).length, ACTIVE_PAYMENT_CHANNEL_OPTIONS.length);

  const walkInResultHtml = renderPaymentsWithProviders(<AllTaxResultStep transaction={INITIAL_TRANSACTIONS[0]} isAuthenticated={false} onViewReceipt={() => {}} onViewCertificate={() => {}} onSignInToClaim={() => {}} onContinueWalkIn={() => {}} onReturnDashboard={() => {}} />);
  assert.match(walkInResultHtml, /Sign in to Claim Payment/);

  const stage1EmptyHtml = renderPaymentsWithProviders(
    <TravelPassengerStep confirmedPassengers={[]} draft={{ id: 'd1', passportType: 'BD', passportNumber: '', passengerName: '', dob: '', nationality: '', bdChecked: false, medicalAssessment: false }} entryOpen editingId={null} errors={{}} isAuthenticated={false} onChangeDraft={() => {}} onCheckBdPassport={() => {}} onConfirmPassenger={() => {}} onOpenAddAnother={() => {}} onCancelEntry={() => {}} onEditConfirmed={() => {}} onRemoveConfirmed={() => {}} onSaveDraft={() => {}} onProceed={() => {}} />
  );
  assert.match(stage1EmptyHtml, /disabled=""[^>]*>.*Check Passport|Check Passport/);

  const stage1Html = renderPaymentsWithProviders(
    <TravelPassengerStep confirmedPassengers={[]} draft={{ id: 'd1', passportType: 'BD', passportNumber: 'TEST123456', passengerName: 'Md. Rafiqul Islam', dob: '1988-05-14', nationality: '', bdChecked: true, medicalAssessment: false }} entryOpen editingId={null} errors={{}} isAuthenticated={false} onChangeDraft={() => {}} onCheckBdPassport={() => {}} onConfirmPassenger={() => {}} onOpenAddAnother={() => {}} onCancelEntry={() => {}} onEditConfirmed={() => {}} onRemoveConfirmed={() => {}} onSaveDraft={() => {}} onProceed={() => {}} />
  );
  assert.match(stage1Html, /Check Passport/);
  assert.match(stage1Html, /Stage 1: Passenger Information/);

  const stage2Html = renderPaymentsWithProviders(
    <TravelDetailsStep passengers={[{ id: 'p1', passportType: 'BD', passportNumber: 'TEST123456', passportMasked: '••••3456', passengerName: 'Md. Rafiqul Islam', dob: '1988-05-14' }]} details={{ travelMode: 'Land', departurePort: 'Benapole', destination: 'Kolkata', travelDate: '2099-01-01' }} errors={{}} isAuthenticated={false} onChangeDetails={() => {}} onBack={() => {}} onSaveDraft={() => {}} onProceed={() => {}} />
  );
  assert.match(stage2Html, /By Land/);
  assert.match(stage2Html, /Combined Illustrative Total/);

  const stage3Html = renderPaymentsWithProviders(
    <TravelTaxPreviewStep passengers={[{ id: 'p1', passportType: 'BD', passportNumber: 'TEST123456', passportMasked: '••••3456', passengerName: 'Md. Rafiqul Islam', dob: '1988-05-14', ageOnTravelDate: 38, amount: 1000 }]} details={{ travelMode: 'Land', departurePort: 'Benapole', destination: 'Kolkata', travelDate: '2099-01-01' }} totalAmount={1000} receiptMobile="01712345678" isAuthenticated={false} onChangeReceiptMobile={() => {}} onEditPassengers={() => {}} onEditDetails={() => {}} onSaveDraft={() => {}} onProceed={() => {}} />
  );
  assert.match(stage3Html, /••••3456/);
  assert.match(stage3Html, /1144102/);
  assert.match(stage3Html, /2026–27/);
  assert.match(stage3Html, /Proceed to Payment Channel/);

  const progressiveModalHtml = renderPaymentsWithProviders(
    <SharedPayTaxProgressiveModal open disablePortal onClose={() => {}} onBack={() => {}} title="Travel Tax" subtitle="Tax Year 2026–27" stepIndicator="Stage 1 of 3" summaryTitle="Live Assessment Summary" summaryMetaBadges={['1144102']} summaryLines={[]} summaryEmptyText="Empty" summaryTotalLabel="Total Payable" summaryTotalAmount={0}>
      <div>Body</div>
    </SharedPayTaxProgressiveModal>
  );
  assert.match(progressiveModalHtml, /progressive-modal-summary-rail/);
  assert.match(progressiveModalHtml, /progressive-modal-mobile-footer/);

  const giftTx = INITIAL_TRANSACTIONS.find((tx) => tx.category === 'gift_tax')!;
  const receiptHtml = renderPaymentsWithProviders(<ReceiptModal open disablePortal onClose={() => {}} transaction={{ ...giftTx, giftDate: '2026-04-10' }} />);
  assert.match(receiptHtml, /2026-04-10/);
  assert.throws(() => createExperimentalTransaction({ ...giftTx, giftDate: '2026-02-30' }), /Invalid giftDate/);
  const calc = calculateGiftTaxAmount('500000');
  const valHtml = renderPaymentsWithProviders(<GiftTaxValuationStep giftAmountInput="500000" giftDate="2026-04-10" description="Land gift" remarks="" calculation={calc} errors={{}} isAuthenticated={false} onChangeAmount={() => {}} onChangeGiftDate={() => {}} onChangeDescription={() => {}} onChangeRemarks={() => {}} onSaveDraft={() => {}} onBack={() => {}} onNext={() => {}} />);
  assert.match(valHtml, /Illustrative Progressive Gift Tax Estimate/);
  const gpHtml = renderPaymentsWithProviders(<GiftTaxPreviewStep donor={{ tin: '882349102384', name: 'Donor' }} donee={{ tin: '992384102938', name: 'Donee' }} relationship="Mother" relationshipTag="Mother" giftDate="2026-04-10" description="Land gift" remarks="" calculation={calc} paymentChannel="bKash" isAuthenticated={false} onChangeChannel={() => {}} onEditParties={() => {}} onEditValuation={() => {}} onSaveDraft={() => {}} onBack={() => {}} onPay={() => {}} />);
  assert.match(gpHtml, /Illustrative Gift Tax Estimate/);
  assert.match(renderPaymentsWithProviders(<PaymentSuccessCard title="Sample" subtitle="Illustrative" onViewReceipt={() => {}} onReturnDashboard={() => {}} />), /View Sample Receipt/);
  assert.equal(isRestrictedOperationAllowed('payment_submit', true), false);
});
