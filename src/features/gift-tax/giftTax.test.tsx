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
import { AppProvider } from '../../shared/AppContext';
import { buildCertificatePdfLines, buildPaymentCertificateRecord, isTransactionReconciled } from '../../shared/certificateUtils';
import { createExperimentalTransaction } from '../../shared/mockLedgerAdapter';
import { INITIAL_TRANSACTIONS } from '../../shared/mockData';
import type { PaymentDraft } from '../../types/tax';
import { ReceiptModal } from '../../components/ReceiptModal';
import { SharedPaymentChannelStep } from '../../components/payments/SharedPaymentChannelStep';
import { executePaymentAttempt } from '../../components/payments/paymentSubmission';
import { CertificatePaper } from '../../components/certificates/CertificatePaper';
import { GiftTaxView } from './GiftTaxView';
import { GiftTaxPartiesStep } from './components/GiftTaxPartiesStep';
import { GiftTaxPreviewStep } from './components/GiftTaxPreviewStep';
import { GiftTaxRightRailExtras } from './components/GiftTaxRightRailExtras';
import { GiftTaxValuationStep } from './components/GiftTaxValuationStep';
import {
  buildGiftTransactionPayload,
  calculateGiftTaxAmount,
  canUndoGiftPartyRemoval,
  isGiftRelationshipValid,
  lookupGiftTaxpayer,
  resolveGiftTaxRouteSeed,
  validateGiftPartiesStep,
  validateGiftValuationStep,
} from './giftTaxLogic';
import { APPROVED_GIFT_RELATIONSHIPS } from './giftTaxTypes';

async function renderGift(node: React.ReactElement, lang: 'en' | 'bn' = 'en'): Promise<string> {
  await i18n.changeLanguage(lang);
  return renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={getTheme('light')}>
        <AppDateLocalizationProvider>{node}</AppDateLocalizationProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

test('Gift Tax progressive brackets, 20k exempt allowance, distinct TINs, relationship rules, and Undo guard', () => {
  assert.equal(calculateGiftTaxAmount('20000').calculatedTax, 0);
  assert.equal(calculateGiftTaxAmount('250000').calculatedTax, 11500);
  assert.equal(calculateGiftTaxAmount('520000').calculatedTax, 25000);
  assert.equal(calculateGiftTaxAmount('1520000').calculatedTax, 125000);
  assert.equal(calculateGiftTaxAmount('3520000').calculatedTax, 425000);
  assert.equal(calculateGiftTaxAmount('4520000').calculatedTax, 625000);

  assert.equal(APPROVED_GIFT_RELATIONSHIPS.length, 9);
  assert.equal(lookupGiftTaxpayer('992384102938')?.name, 'Mrs. Fatema Begum');
  assert.equal(lookupGiftTaxpayer('000000000000'), null);

  assert.equal(isGiftRelationshipValid('', ''), false);
  assert.equal(isGiftRelationshipValid('Mother', ''), true);
  assert.equal(isGiftRelationshipValid('Others', ''), false);
  assert.equal(isGiftRelationshipValid('Others', 'x'.repeat(81)), false);
  assert.equal(isGiftRelationshipValid('Others', 'Mentor & Guardian'), true);

  const donor = { tin: '882349102384', name: 'Md. Rafiqul Islam' };
  const donee = { tin: '992384102938', name: 'Mrs. Fatema Begum' };
  assert.ok(validateGiftPartiesStep({ donor, donee: donor, relationship: 'Mother', relationshipTag: '' }, 'en').donee);
  assert.ok(validateGiftPartiesStep({ donor, donee, relationship: 'Others', relationshipTag: '' }, 'en').relationshipTag);
  assert.ok(validateGiftPartiesStep({ donor, donee, relationship: 'Others', relationshipTag: 'x'.repeat(81) }, 'en').relationshipTag);
  assert.deepEqual(validateGiftPartiesStep({ donor, donee, relationship: 'Mother', relationshipTag: '' }, 'en'), {});
  assert.deepEqual(validateGiftPartiesStep({ donor, donee, relationship: 'Others', relationshipTag: 'Close family friend' }, 'en'), {});

  // Undo duplicate-TIN guard blocks restoring a removed party whose TIN is now confirmed on the opposite role
  assert.deepEqual(canUndoGiftPartyRemoval({ role: 'donee', party: donor }, donor, null), { ok: false, reason: 'duplicate_tin' });
  assert.deepEqual(canUndoGiftPartyRemoval({ role: 'donor', party: donee }, null, donee), { ok: false, reason: 'duplicate_tin' });
  assert.deepEqual(canUndoGiftPartyRemoval({ role: 'donee', party: donee }, donor, null), { ok: true });

  // Zero-tax value <= 20,000 is valid; <= 0 or future date is rejected
  assert.ok(validateGiftValuationStep({ giftAmountInput: '0', description: 'Gift', giftDate: '2026-11-28' }, 'en', '2026-11-28').giftAmount);
  assert.deepEqual(validateGiftValuationStep({ giftAmountInput: '20000', description: 'Eid Gift', giftDate: '2026-11-28' }, 'en', '2026-11-28'), {});
  assert.ok(validateGiftValuationStep({ giftAmountInput: '50000', description: 'Gift', giftDate: '2099-01-01' }, 'en', '2026-11-28').giftDate);
  assert.deepEqual(validateGiftValuationStep({ giftAmountInput: '520000', description: 'Residential plot gift', giftDate: '2026-11-20', remarks: 'Deed #441' }, 'en', '2026-11-28'), {});
});

test('Gift Tax Donor credit attribution, Zero-Tax channel/certificate, and secure draft/reuse seeding', () => {
  const donor = { tin: '882349102384', name: 'Md. Rafiqul Islam' };
  const donee = { tin: '992384102938', name: 'Mrs. Fatema Begum' };
  const payload = buildGiftTransactionPayload({
    donor, donee, relationship: 'Mother', relationshipTag: 'Mother',
    giftValue: 520000, giftDate: '2026-11-20', description: 'Plot registration', remarks: 'Reg #902',
    calculatedTax: 25000, assessmentYear: '2026-2027', channel: 'Nagad', isAuthenticated: true, activeScope: 'acct_882349102384',
  });
  assert.equal(payload.taxpayerTin, '882349102384');
  assert.equal(payload.items[0].taxpayerTin, '882349102384');
  assert.equal(payload.items[0].assessmentYear, '2026-2027');
  assert.equal(payload.giftDetails?.creditAttributionRole, 'donor');
  assert.equal(payload.giftDetails?.throughTin, '992384102938');
  assert.equal(payload.giftDetails?.onBehalfOfTin, '882349102384');
  assert.equal(payload.giftDetails?.remarks, 'Reg #902');

  const tx = createExperimentalTransaction(payload);
  const cert = buildPaymentCertificateRecord(tx, true);
  assert.ok(cert);
  const lines = buildCertificatePdfLines(cert).join('\n');
  assert.match(lines, /Credit Attribution & On Behalf Of \(Donor\): Md\. Rafiqul Islam/);
  assert.match(lines, /Through \(Donee\): Mrs\. Fatema Begum/);

  // Zero-tax declaration resolves to Zero-Tax with no bankRef and valid certificate reconciliation
  const zeroPayload = buildGiftTransactionPayload({
    donor, donee, relationship: 'Father', relationshipTag: 'Father',
    giftValue: 18000, giftDate: '2026-11-20', description: 'Cash gift', remarks: 'Family occasion',
    calculatedTax: 0, channel: 'bKash', isAuthenticated: true, activeScope: 'acct_882349102384',
  });
  assert.equal(zeroPayload.paymentChannel, 'Zero-Tax');
  const zeroTx = createExperimentalTransaction(zeroPayload);
  assert.equal(zeroTx.paymentChannel, 'Zero-Tax');
  assert.equal(zeroTx.bankRef, '');
  assert.equal(isTransactionReconciled(zeroTx), true);
  assert.ok(buildPaymentCertificateRecord(zeroTx, true));

  const draft: PaymentDraft = {
    id: 'dr-gift-1', title: 'Gift Draft', category: 'gift_tax', updatedAt: '2026-11-28',
    items: [{ ...payload.items[0], assessmentYear: '2024-2025' }],
    giftDraft: {
      donor,
      donee: { ...donee, relationship: 'Others', relationshipTag: 'Guardian' },
      relationship: 'Others',
      relationshipTag: 'Guardian',
      giftAmountInput: '520000',
      giftDate: '2026-11-20',
      description: 'Plot registration',
      remarks: 'Reg #902',
      stage: 2,
    },
  };
  assert.equal(resolveGiftTaxRouteSeed({ routeState: { reuseTx: tx }, drafts: [], transactions: [tx], activeScope: 'acct_882349102384', isAuthenticated: true }).rejected, true);
  const resumed = resolveGiftTaxRouteSeed({ routeState: { draftId: 'dr-gift-1' }, drafts: [draft], transactions: [], activeScope: 'acct_882349102384', isAuthenticated: true });
  assert.equal(resumed.rejected, false);
  assert.equal(resumed.relationship, 'Others');
  assert.equal(resumed.relationshipTag, 'Guardian');
  assert.equal(resumed.remarks, 'Reg #902');
  assert.equal(resumed.assessmentYear, '2024-2025');
  assert.equal(resumed.stage, 2);

  // Foreign reuse rejected
  assert.equal(resolveGiftTaxRouteSeed({ routeState: { reuseTxRef: tx.transactionRef }, drafts: [], transactions: [tx], activeScope: 'acct_112233445566', isAuthenticated: true }).rejected, true);
});

test('Gift Tax payment submission helper prevents concurrent submits and recovers on failure', () => {
  const lockRef = { current: false };
  let capturedError = '';
  let capturedSuccess = '';

  const firstFailed = executePaymentAttempt({
    lockRef,
    run: () => { throw new Error('Simulated ledger failure'); },
    onSuccess: (val: string) => { capturedSuccess = val; },
    onError: (msg) => { capturedError = msg; },
    fallbackError: 'Fallback',
  });
  assert.equal(firstFailed, false);
  assert.equal(capturedError, 'Simulated ledger failure');
  assert.equal(lockRef.current, false);

  // Retry succeeds once error released lock
  const retryOk = executePaymentAttempt({
    lockRef,
    run: () => 'SOHO-OK-1',
    onSuccess: (val: string) => { capturedSuccess = val; },
    onError: (msg) => { capturedError = msg; },
    fallbackError: 'Fallback',
  });
  assert.equal(retryOk, true);
  assert.equal(capturedSuccess, 'SOHO-OK-1');
  assert.equal(lockRef.current, true);

  // Duplicate attempt while locked is ignored
  const duplicateBlocked = executePaymentAttempt({
    lockRef,
    run: () => 'SOHO-DUP-2',
    onSuccess: (val: string) => { capturedSuccess = val; },
    onError: (msg) => { capturedError = msg; },
    fallbackError: 'Fallback',
  });
  assert.equal(duplicateBlocked, false);
  assert.equal(capturedSuccess, 'SOHO-OK-1');
});

test('Gift Tax progressive modal (3 stages + separated Payment Channel), conditional Others input, and SSR rendering', async () => {
  const initialHtml = await renderGift(<AppProvider><MemoryRouter initialEntries={['/gift-tax']}><GiftTaxView /></MemoryRouter></AppProvider>, 'en');
  assert.match(initialHtml, /Stage 1 of 3/);
  assert.match(initialHtml, /No Donor added yet/);
  assert.doesNotMatch(initialHtml, /Save as Draft/);
  assert.doesNotMatch(initialHtml, /gift-others-relationship-input/);

  const donor = { tin: '882349102384', name: 'Md. Rafiqul Islam' };
  const donee = { tin: '992384102938', name: 'Mrs. Fatema Begum' };
  const railHtml = await renderGift(
    <GiftTaxRightRailExtras donor={donor} donee={donee} relationship="Mother" relationshipTag="Mother" undoParty={null} onEditParty={() => {}} onRemoveParty={() => {}} onUndoRemove={() => {}} />,
    'bn'
  );
  assert.match(railHtml, /882\*\*\*\*\*\*\*\*\*/);
  assert.match(railHtml, /মাতা/);

  // Custom relationship input shown ONLY when relationship === 'Others'
  const stage1MotherHtml = await renderGift(
    <GiftTaxPartiesStep donor={donor} donee={null} donorTinInput="" doneeTinInput="" donorLookupResult={null} doneeLookupResult={donee} donorLookupError="" doneeLookupError="" relationship="Mother" relationshipTag="" undoParty={null} errors={{}} isAuthenticated onChangeDonorTin={() => {}} onChangeDoneeTin={() => {}} onSearchDonor={() => {}} onSearchDonee={() => {}} onAddDonor={() => {}} onAddDonee={() => {}} onEditParty={() => {}} onRemoveParty={() => {}} onUndoRemove={() => {}} onSelectRelationship={() => {}} onChangeRelationshipTag={() => {}} onSaveDraft={() => {}} onNext={() => {}} />,
    'en'
  );
  assert.match(stage1MotherHtml, /Save as Draft/);
  assert.doesNotMatch(stage1MotherHtml, /gift-others-relationship-input/);

  const stage1OthersHtml = await renderGift(
    <GiftTaxPartiesStep donor={donor} donee={null} donorTinInput="" doneeTinInput="" donorLookupResult={null} doneeLookupResult={donee} donorLookupError="" doneeLookupError="" relationship="Others" relationshipTag="" undoParty={null} errors={{}} isAuthenticated onChangeDonorTin={() => {}} onChangeDoneeTin={() => {}} onSearchDonor={() => {}} onSearchDonee={() => {}} onAddDonor={() => {}} onAddDonee={() => {}} onEditParty={() => {}} onRemoveParty={() => {}} onUndoRemove={() => {}} onSelectRelationship={() => {}} onChangeRelationshipTag={() => {}} onSaveDraft={() => {}} onNext={() => {}} />,
    'en'
  );
  assert.match(stage1OthersHtml, /gift-others-relationship-input/);

  const calc = calculateGiftTaxAmount('520000');
  const stage2Html = await renderGift(
    <GiftTaxValuationStep giftAmountInput="520000" description="Land gift" giftDate="2026-11-20" remarks="Deed #1" calculation={calc} errors={{}} isAuthenticated={false} onChangeAmount={() => {}} onChangeDescription={() => {}} onChangeGiftDate={() => {}} onChangeRemarks={() => {}} onSaveDraft={() => {}} onBack={() => {}} onNext={() => {}} />,
    'en'
  );
  assert.match(stage2Html, /Illustrative estimate only/);
  assert.match(stage2Html, /25,000/);

  // Paid Stage 3 Final Preview proceeds to Payment Channel rather than rendering payment radios inline
  const stage3PaidHtml = await renderGift(
    <GiftTaxPreviewStep donor={donor} donee={donee} relationship="Mother" relationshipTag="Mother" giftDate="2026-11-20" description="Land gift" remarks="Deed #1" calculation={calc} acknowledged={false} isAuthenticated={false} onChangeAcknowledged={() => {}} onEditParties={() => {}} onEditValuation={() => {}} onSaveDraft={() => {}} onBack={() => {}} onProceed={() => {}} />,
    'en'
  );
  assert.match(stage3PaidHtml, /Credit Attribution/);
  assert.match(stage3PaidHtml, /Donee \(Through\)/);
  assert.match(stage3PaidHtml, /Proceed to Payment Channel/);
  assert.doesNotMatch(stage3PaidHtml, /type="radio"/);

  // Zero-tax Stage 3 Final Preview renders exemption alert & preview acknowledgement checkbox
  const zeroCalc = calculateGiftTaxAmount('18000');
  const stage3ZeroHtml = await renderGift(
    <GiftTaxPreviewStep donor={donor} donee={donee} relationship="Mother" relationshipTag="Mother" giftDate="2026-11-20" description="Cash gift" remarks="Occasion" calculation={zeroCalc} acknowledged={false} isAuthenticated={false} onChangeAcknowledged={() => {}} onEditParties={() => {}} onEditValuation={() => {}} onSaveDraft={() => {}} onBack={() => {}} onProceed={() => {}} />,
    'en'
  );
  assert.match(stage3ZeroHtml, /gift-zero-tax-notice/);
  assert.match(stage3ZeroHtml, /gift-preview-ack-checkbox/);
  assert.match(stage3ZeroHtml, /Complete Zero-Tax Declaration/);

  // Separated Gift Tax Payment Channel step renders acknowledgement checkbox & submit error recovery
  const channelHtml = await renderGift(
    <SharedPaymentChannelStep testId="gift-tax-channel-step" paymentChannel="bKash" totalAmount={25000} itemCount={1} requireAcknowledgement acknowledged={false} submitError="Channel failed" onChangeAcknowledged={() => {}} onChangeChannel={() => {}} onBack={() => {}} onConfirmPayment={() => {}} />,
    'en'
  );
  assert.match(channelHtml, /gift-tax-channel-step/);
  assert.match(channelHtml, /channel-acknowledgement-checkbox/);
  assert.match(channelHtml, /payment-submit-error/);
  assert.match(channelHtml, /Retry Payment/);

  const tx = createExperimentalTransaction(buildGiftTransactionPayload({
    donor, donee, relationship: 'Mother', relationshipTag: 'Mother', giftValue: 520000, giftDate: '2026-11-20',
    description: 'Land gift', remarks: 'Deed #1', calculatedTax: 25000, channel: 'bKash', isAuthenticated: true, activeScope: 'acct_882349102384',
  }));
  const receiptHtml = await renderGift(<ReceiptModal open disablePortal onClose={() => {}} transaction={tx} isAuthenticated />);
  assert.match(receiptHtml, /receipt-gift-attribution/);
  assert.match(receiptHtml, /receipt-gift-remarks/);
  assert.match(receiptHtml, /Deed #1/);
  const cert = buildPaymentCertificateRecord(tx, true)!;
  assert.match(await renderGift(<CertificatePaper cert={cert} />), /certificate-gift-details/);
  assert.equal(INITIAL_TRANSACTIONS[1].category, 'gift_tax');
});
