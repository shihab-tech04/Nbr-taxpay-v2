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
import { buildCertificatePdfLines, buildPaymentCertificateRecord } from '../../shared/certificateUtils';
import { createExperimentalTransaction } from '../../shared/mockLedgerAdapter';
import { INITIAL_TRANSACTIONS } from '../../shared/mockData';
import type { PaymentDraft } from '../../types/tax';
import { ReceiptModal } from '../../components/ReceiptModal';
import { CertificatePaper } from '../../components/certificates/CertificatePaper';
import { GiftTaxView } from './GiftTaxView';
import { GiftTaxPartiesStep } from './components/GiftTaxPartiesStep';
import { GiftTaxPreviewStep } from './components/GiftTaxPreviewStep';
import { GiftTaxRightRailExtras } from './components/GiftTaxRightRailExtras';
import { GiftTaxValuationStep } from './components/GiftTaxValuationStep';
import {
  buildGiftTransactionPayload,
  calculateGiftTaxAmount,
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

test('Gift Tax progressive brackets, 20k exempt allowance, distinct TINs, and 1-80 char relationship tag', () => {
  assert.equal(calculateGiftTaxAmount('20000').calculatedTax, 0);
  assert.equal(calculateGiftTaxAmount('250000').calculatedTax, 11500);
  assert.equal(calculateGiftTaxAmount('520000').calculatedTax, 25000);
  assert.equal(calculateGiftTaxAmount('1520000').calculatedTax, 125000);
  assert.equal(calculateGiftTaxAmount('3520000').calculatedTax, 425000);
  assert.equal(calculateGiftTaxAmount('4520000').calculatedTax, 625000);

  assert.equal(APPROVED_GIFT_RELATIONSHIPS.length, 9);
  assert.equal(lookupGiftTaxpayer('992384102938')?.name, 'Mrs. Fatema Begum');
  assert.equal(lookupGiftTaxpayer('000000000000'), null);

  const donor = { tin: '882349102384', name: 'Md. Rafiqul Islam' };
  const donee = { tin: '992384102938', name: 'Mrs. Fatema Begum' };
  assert.ok(validateGiftPartiesStep({ donor, donee: donor, relationship: 'Mother', relationshipTag: 'Mother' }, 'en').donee);
  assert.ok(validateGiftPartiesStep({ donor, donee, relationship: 'Mother', relationshipTag: '' }, 'en').relationshipTag);
  assert.ok(validateGiftPartiesStep({ donor, donee, relationship: 'Mother', relationshipTag: 'x'.repeat(81) }, 'en').relationshipTag);
  assert.deepEqual(validateGiftPartiesStep({ donor, donee, relationship: 'Friends', relationshipTag: 'Close family friend' }, 'en'), {});

  assert.ok(validateGiftValuationStep({ giftAmountInput: '20000', description: 'Gift', giftDate: '2026-11-28' }, 'en', '2026-11-28').giftAmount);
  assert.ok(validateGiftValuationStep({ giftAmountInput: '50000', description: 'Gift', giftDate: '2099-01-01' }, 'en', '2026-11-28').giftDate);
  assert.deepEqual(validateGiftValuationStep({ giftAmountInput: '520000', description: 'Residential plot gift', giftDate: '2026-11-20', remarks: 'Deed #441' }, 'en', '2026-11-28'), {});
});

test('Gift Tax Donor credit attribution, Through/On Behalf Of challan/certificate lines, and secure draft/reuse seeding', () => {
  const donor = { tin: '882349102384', name: 'Md. Rafiqul Islam' };
  const donee = { tin: '992384102938', name: 'Mrs. Fatema Begum' };
  const payload = buildGiftTransactionPayload({
    donor, donee, relationship: 'Mother', relationshipTag: 'Mother — Family Residence',
    giftValue: 520000, giftDate: '2026-11-20', description: 'Plot registration', remarks: 'Reg #902',
    calculatedTax: 25000, assessmentYear: '2026-2027', channel: 'Nagad', isAuthenticated: true, activeScope: 'acct_882349102384',
  });
  assert.equal(payload.taxpayerTin, '882349102384');
  assert.equal(payload.items[0].taxpayerTin, '882349102384');
  assert.equal(payload.items[0].assessmentYear, '2026-2027');
  assert.equal(payload.giftDetails?.creditAttributionRole, 'donor');
  assert.equal(payload.giftDetails?.throughTin, '992384102938');
  assert.equal(payload.giftDetails?.onBehalfOfTin, '882349102384');

  const tx = createExperimentalTransaction(payload);
  const cert = buildPaymentCertificateRecord(tx, true);
  assert.ok(cert);
  const lines = buildCertificatePdfLines(cert).join('\n');
  assert.match(lines, /Credit Attribution & On Behalf Of \(Donor\): Md\. Rafiqul Islam/);
  assert.match(lines, /Through \(Donee\): Mrs\. Fatema Begum/);

  const draft: PaymentDraft = {
    id: 'dr-gift-1', title: 'Gift Draft', category: 'gift_tax', updatedAt: '2026-11-28',
    items: [{ ...payload.items[0], assessmentYear: '2024-2025' }],
    giftDraft: { donor, donee: { ...donee, relationship: 'Mother', relationshipTag: 'Mother — Family Residence' }, giftAmountInput: '520000', giftDate: '2026-11-20', description: 'Plot registration', remarks: 'Reg #902', stage: 2 },
  };
  assert.equal(resolveGiftTaxRouteSeed({ routeState: { reuseTx: tx }, drafts: [], transactions: [tx], activeScope: 'acct_882349102384', isAuthenticated: true }).rejected, true);
  const resumed = resolveGiftTaxRouteSeed({ routeState: { draftId: 'dr-gift-1' }, drafts: [draft], transactions: [], activeScope: 'acct_882349102384', isAuthenticated: true });
  assert.equal(resumed.rejected, false);
  assert.equal(resumed.assessmentYear, '2024-2025');
  assert.equal(resumed.stage, 2);

  // Foreign reuse rejected
  assert.equal(resolveGiftTaxRouteSeed({ routeState: { reuseTxRef: tx.transactionRef }, drafts: [], transactions: [tx], activeScope: 'acct_112233445566', isAuthenticated: true }).rejected, true);
});

test('Gift Tax progressive modal, right rail, 4 stages, challan, and certificate render cleanly in EN/BN SSR', async () => {
  const initialHtml = await renderGift(<AppProvider><MemoryRouter initialEntries={['/gift-tax']}><GiftTaxView /></MemoryRouter></AppProvider>, 'en');
  assert.match(initialHtml, /Stage 1 of 4/);
  assert.match(initialHtml, /No Donor added yet/);
  assert.doesNotMatch(initialHtml, /Save as Draft/);

  const donor = { tin: '882349102384', name: 'Md. Rafiqul Islam' };
  const donee = { tin: '992384102938', name: 'Mrs. Fatema Begum' };
  const railHtml = await renderGift(
    <GiftTaxRightRailExtras donor={donor} donee={donee} relationship="Mother" relationshipTag="Mother" undoParty={null} onEditParty={() => {}} onRemoveParty={() => {}} onUndoRemove={() => {}} />,
    'bn'
  );
  assert.match(railHtml, /882\*\*\*\*\*\*\*\*\*/);
  assert.match(railHtml, /মাতা/);

  const stage1Html = await renderGift(
    <GiftTaxPartiesStep donor={donor} donee={null} donorTinInput="" doneeTinInput="" donorLookupResult={null} doneeLookupResult={null} donorLookupError="" doneeLookupError="" relationship="" relationshipTag="" undoParty={null} errors={{}} isAuthenticated onChangeDonorTin={() => {}} onChangeDoneeTin={() => {}} onSearchDonor={() => {}} onSearchDonee={() => {}} onAddDonor={() => {}} onAddDonee={() => {}} onEditParty={() => {}} onRemoveParty={() => {}} onUndoRemove={() => {}} onSelectRelationship={() => {}} onChangeRelationshipTag={() => {}} onSaveDraft={() => {}} onNext={() => {}} />,
    'en'
  );
  assert.match(stage1Html, /Save as Draft/);

  const calc = calculateGiftTaxAmount('520000');
  const stage2Html = await renderGift(
    <GiftTaxValuationStep giftAmountInput="520000" description="Land gift" giftDate="2026-11-20" remarks="Deed #1" calculation={calc} errors={{}} isAuthenticated={false} onChangeAmount={() => {}} onChangeDescription={() => {}} onChangeGiftDate={() => {}} onChangeRemarks={() => {}} onSaveDraft={() => {}} onBack={() => {}} onNext={() => {}} />,
    'en'
  );
  assert.match(stage2Html, /Illustrative estimate only/);
  assert.match(stage2Html, /25,000/);

  const stage3Html = await renderGift(
    <GiftTaxPreviewStep donor={donor} donee={donee} relationship="Mother" relationshipTag="Mother" giftDate="2026-11-20" description="Land gift" remarks="Deed #1" calculation={calc} paymentChannel="bKash" isAuthenticated={false} onChangeChannel={() => {}} onEditParties={() => {}} onEditValuation={() => {}} onSaveDraft={() => {}} onBack={() => {}} onPay={() => {}} />,
    'en'
  );
  assert.match(stage3Html, /Credit Attribution/);
  assert.match(stage3Html, /Donee \(Through\)/);

  const tx = createExperimentalTransaction(buildGiftTransactionPayload({
    donor, donee, relationship: 'Mother', relationshipTag: 'Mother', giftValue: 520000, giftDate: '2026-11-20',
    description: 'Land gift', remarks: 'Deed #1', calculatedTax: 25000, channel: 'bKash', isAuthenticated: true, activeScope: 'acct_882349102384',
  }));
  assert.match(await renderGift(<ReceiptModal open disablePortal onClose={() => {}} transaction={tx} isAuthenticated />), /receipt-gift-attribution/);
  const cert = buildPaymentCertificateRecord(tx, true)!;
  assert.match(await renderGift(<CertificatePaper cert={cert} />), /certificate-gift-details/);
  assert.equal(INITIAL_TRANSACTIONS[1].category, 'gift_tax');
});
