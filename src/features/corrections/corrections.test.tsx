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
import {
  formatCorrectionChanges,
  isTransactionCorrectionEligible,
  validateUnverifiedInquiry,
  validateVerifiedCorrection,
} from '../../shared/correctionLogic';
import { INITIAL_CORRECTIONS, INITIAL_TRANSACTIONS, TAX_HEADS } from '../../shared/mockData';
import { createExperimentalUnverifiedInquiry } from '../../shared/mockLedgerAdapter';
import type { PaymentTransaction } from '../../types/tax';
import { CorrectionRequestModal } from '../../components/corrections/CorrectionRequestModal';
import { DashboardCorrectionSummary } from '../dashboard/components/DashboardCorrectionSummary';
import { formatTxAySummary, formatTxBeneficiarySummary, formatTxHeadSummary, matchesHistorySearch } from '../history/historyLogic';
import { CorrectionsView } from './CorrectionsView';

function renderWithProviders(node: React.ReactElement): string {
  void i18n.changeLanguage('en');
  return renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={getTheme('light')}>
        <AppDateLocalizationProvider>{node}</AppDateLocalizationProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

test('Verified challan correction eligibility, duplicate/no-change/reason guards, and combined allocations', () => {
  const ownedTx = INITIAL_TRANSACTIONS[0];
  assert.equal(isTransactionCorrectionEligible(ownedTx, 'acct_882349102384', true), true);
  assert.equal(isTransactionCorrectionEligible(ownedTx, 'acct_882349102384', false), false);
  assert.equal(isTransactionCorrectionEligible(ownedTx, 'acct_112233445566', true), false);
  assert.equal(
    isTransactionCorrectionEligible({ ...ownedTx, status: 'Pending' }, 'acct_882349102384', true),
    false
  );
  assert.equal(
    isTransactionCorrectionEligible({ ...ownedTx, ownerScope: 'walkin', originMode: 'walk_in' }, 'walkin', false),
    false
  );
  assert.equal(
    isTransactionCorrectionEligible({ ...ownedTx, originMode: 'walk_in', claimedByTin: '882349102384' }, 'acct_882349102384', true),
    true
  );

  // Duplicate active submission on allocation 0 blocked
  const dupRes = validateVerifiedCorrection({
    transaction: ownedTx,
    allocationIndex: 0,
    currentCircle: 'Circle-112 (Company)',
    proposedAssessmentYear: '2026-2027',
    proposedCircle: 'Circle-112 (Company)',
    proposedHeadId: TAX_HEADS[0].id,
    reason: 'Wrong assessment year entered on initial return submission.',
    activeScope: 'acct_882349102384',
    isAuthenticated: true,
    existingCorrections: INITIAL_CORRECTIONS,
  });
  assert.equal(dupRes.ok, false);
  if (!dupRes.ok) assert.equal(dupRes.code, 'duplicate');

  // No-change submission blocked even without existing active request
  const combinedTx: PaymentTransaction = {
    ...ownedTx,
    id: 'tx-combined',
    challanNumber: 'NBR-CHL-2026-999001',
    items: [ownedTx.items[0], { ...ownedTx.items[0], headId: TAX_HEADS[1].id, headCode: TAX_HEADS[1].code, headNameEn: TAX_HEADS[1].nameEn }],
  };
  const unchangedRes = validateVerifiedCorrection({
    transaction: combinedTx,
    allocationIndex: 1,
    currentCircle: 'Circle-112 (Company)',
    proposedAssessmentYear: '2025-2026',
    proposedCircle: 'Circle-112 (Company)',
    proposedHeadId: TAX_HEADS[1].id,
    reason: 'Valid long explanation reason.',
    activeScope: 'acct_882349102384',
    isAuthenticated: true,
    existingCorrections: INITIAL_CORRECTIONS,
  });
  assert.equal(unchangedRes.ok, false);
  if (!unchangedRes.ok) assert.equal(unchangedRes.code, 'no_change');

  // Short reason blocked
  const shortReason = validateVerifiedCorrection({
    transaction: combinedTx,
    allocationIndex: 1,
    currentCircle: 'Circle-112 (Company)',
    proposedAssessmentYear: '2026-2027',
    proposedCircle: 'Circle-112 (Company)',
    proposedHeadId: TAX_HEADS[1].id,
    reason: 'Too short',
    activeScope: 'acct_882349102384',
    isAuthenticated: true,
    existingCorrections: INITIAL_CORRECTIONS,
  });
  assert.equal(shortReason.ok, false);
  if (!shortReason.ok) assert.equal(shortReason.code, 'reason_length');

  // Valid correction on combined allocation 1 succeeds
  const validRes = validateVerifiedCorrection({
    transaction: combinedTx,
    allocationIndex: 1,
    currentCircle: 'Circle-112 (Company)',
    proposedAssessmentYear: '2026-2027',
    proposedCircle: 'Circle-118 (Dhaka)',
    proposedHeadId: TAX_HEADS[2].id,
    reason: 'Update second allocation AY, circle, and head per assessment order.',
    activeScope: 'acct_882349102384',
    isAuthenticated: true,
    existingCorrections: INITIAL_CORRECTIONS,
  });
  assert.equal(validRes.ok, true);
  if (validRes.ok) {
    assert.equal(validRes.payload.allocationIndex, 1);
    assert.equal(validRes.payload.proposedAssessmentYear, '2026-2027');
    assert.equal(validRes.payload.proposedHeadCode, TAX_HEADS[2].code);
  }

  assert.match(formatCorrectionChanges(INITIAL_CORRECTIONS[0], false), /2024-2025 → 2025-2026/);
});

test('Unverified inquiry boundary validation and history formatting helpers', () => {
  const invalidInq = validateUnverifiedInquiry({
    originalReference: '12345',
    reason: 'short',
    requestedOutcome: 'short',
    evidenceNote: 'x'.repeat(2001),
  });
  assert.equal(invalidInq.ok, false);
  if (!invalidInq.ok) {
    assert.ok(invalidInq.errors.originalReference && invalidInq.errors.reason && invalidInq.errors.requestedOutcome && invalidInq.errors.evidenceNote);
  }

  const validInq = validateUnverifiedInquiry({
    originalReference: 'WALKIN-REF-123456',
    reason: 'Walk-in challan printed with wrong tax year on guest receipt.',
    requestedOutcome: 'Please log inquiry for manual verification at helpdesk.',
    evidenceNote: 'Guest counter slip #441',
  });
  assert.equal(validInq.ok, true);
  if (validInq.ok) {
    const rec = createExperimentalUnverifiedInquiry({ ...validInq.normalized, ownerScope: 'walkin' });
    assert.match(rec.ticketNumber, /^INQ-2026-/);
    assert.equal(rec.status, 'Logged (Unverified Inquiry)');
  }

  const giftTx = INITIAL_TRANSACTIONS[1];
  assert.match(formatTxBeneficiarySummary(giftTx, false), /Fatema Begum/);
  assert.match(formatTxHeadSummary(giftTx, false), /0130/);
  assert.equal(formatTxAySummary(giftTx), '2025-2026');
  assert.equal(matchesHistorySearch(giftTx, 'Fatema', false), true);
  assert.equal(matchesHistorySearch(giftTx, 'SOHO-2026-88342', false), true);
});

test('Corrections views and modals render cleanly in SSR', () => {
  const viewHtml = renderWithProviders(
    <AppProvider>
      <MemoryRouter initialEntries={['/corrections']}>
        <CorrectionsView />
      </MemoryRouter>
    </AppProvider>
  );
  assert.match(viewHtml, /Unverified Correction Inquiry/);

  const modalHtml = renderWithProviders(
    <AppProvider>
      <MemoryRouter initialEntries={['/history']}>
        <CorrectionRequestModal open disablePortal onClose={() => {}} initialTransaction={INITIAL_TRANSACTIONS[0]} />
      </MemoryRouter>
    </AppProvider>
  );
  assert.match(modalHtml, /NBR-CHL-2026-881920/);
  assert.match(modalHtml, /Proposed Assessment Year/);

  const dashSummaryHtml = renderWithProviders(
    <MemoryRouter>
      <DashboardCorrectionSummary corrections={INITIAL_CORRECTIONS} />
    </MemoryRouter>
  );
  assert.match(dashSummaryHtml, /CORR-2026-881920/);
  assert.match(dashSummaryHtml, /View Correction Requests/);
});
