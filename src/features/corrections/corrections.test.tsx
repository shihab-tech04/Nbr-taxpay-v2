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
  deriveActualCurrentCircle,
  formatCorrectionChanges,
  isTransactionCorrectionEligible,
  validateUnverifiedInquiry,
  validateVerifiedCorrection,
} from '../../shared/correctionLogic';
import { appendVerifiedCorrectionSafely } from '../../shared/domainMutations';
import { INITIAL_CORRECTIONS, INITIAL_TRANSACTIONS, INITIAL_USER, TAX_HEADS } from '../../shared/mockData';
import { createExperimentalUnverifiedInquiry } from '../../shared/mockLedgerAdapter';
import type { ScopedDomainData } from '../../shared/scopedDomainSeeds';
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

test('Verified challan correction safeguards: trusted records, derived circle, explicit allocation, duplicate & ledger immutability', () => {
  const ownedTx = INITIAL_TRANSACTIONS[0];
  assert.equal(isTransactionCorrectionEligible(ownedTx, 'acct_882349102384', true), true);
  assert.equal(isTransactionCorrectionEligible(ownedTx, 'acct_882349102384', false), false);
  assert.equal(isTransactionCorrectionEligible(ownedTx, 'acct_112233445566', true), false);

  // Derived circle checks: never invent 'Circle-112 (Company)'
  assert.equal(
    deriveActualCurrentCircle({ transaction: { ...ownedTx, taxpayerTin: '112233445566', items: [{ ...ownedTx.items[0], taxpayerTin: '112233445566' }] } }),
    'Circle-019'
  );
  assert.equal(
    deriveActualCurrentCircle({ transaction: { ...ownedTx, taxpayerTin: '999999999999', items: [{ ...ownedTx.items[0], taxpayerTin: '999999999999' }] } }),
    ''
  );
  assert.equal(
    deriveActualCurrentCircle({ transaction: { ...ownedTx, circle: 'Circle-055 (Sylhet)' } }),
    'Circle-055 (Sylhet)'
  );

  // Forged/untrusted transaction rejected when trustedTransactions is provided
  const forgedCheck = validateVerifiedCorrection({
    transaction: { ...ownedTx, id: 'tx-forged-123', transactionRef: 'FORGED-999' },
    trustedTransactions: INITIAL_TRANSACTIONS,
    allocationIndex: 0,
    currentCircle: 'Circle-112 (Company)',
    proposedAssessmentYear: '2026-2027',
    proposedCircle: 'Circle-112 (Company)',
    proposedHeadId: TAX_HEADS[0].id,
    reason: 'Attempted submission on forged client-side transaction object.',
    activeScope: 'acct_882349102384',
    isAuthenticated: true,
    existingCorrections: INITIAL_CORRECTIONS,
  });
  assert.equal(forgedCheck.ok, false);
  if (!forgedCheck.ok) assert.equal(forgedCheck.code, 'unauthorized');

  // Duplicate active submission on allocation 0 blocked
  const dupRes = validateVerifiedCorrection({
    transaction: ownedTx,
    trustedTransactions: INITIAL_TRANSACTIONS,
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

  const combinedTx: PaymentTransaction = {
    ...ownedTx,
    id: 'tx-combined',
    challanNumber: 'NBR-CHL-2026-999001',
    items: [ownedTx.items[0], { ...ownedTx.items[0], headId: TAX_HEADS[1].id, headCode: TAX_HEADS[1].code, headNameEn: TAX_HEADS[1].nameEn }],
  };

  // Multi-allocation transaction MUST require explicit combined allocation selection
  const unselectedAlloc = validateVerifiedCorrection({
    transaction: combinedTx,
    trustedTransactions: [combinedTx],
    allocationIndex: null,
    currentCircle: 'Circle-112 (Company)',
    proposedAssessmentYear: '2026-2027',
    proposedCircle: 'Circle-112 (Company)',
    proposedHeadId: TAX_HEADS[1].id,
    reason: 'Attempted submit without picking an allocation item.',
    activeScope: 'acct_882349102384',
    isAuthenticated: true,
    existingCorrections: INITIAL_CORRECTIONS,
  });
  assert.equal(unselectedAlloc.ok, false);
  if (!unselectedAlloc.ok) assert.equal(unselectedAlloc.code, 'invalid_allocation');

  // Valid correction on combined allocation 1 succeeds and appendVerifiedCorrectionSafely never mutates transactions
  const validRes = validateVerifiedCorrection({
    transaction: combinedTx,
    trustedTransactions: [combinedTx],
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
    const seedDomain: ScopedDomainData = {
      beneficiaryLists: [],
      beneficiaries: [],
      drafts: [],
      transactions: [combinedTx],
      corrections: INITIAL_CORRECTIONS,
      unverifiedInquiries: [],
      supportTickets: [],
      notifications: [],
    };
    const snapshotBefore = JSON.stringify(seedDomain.transactions);
    const firstWrite = appendVerifiedCorrectionSafely(seedDomain, validRes.payload, 'acct_882349102384', true);
    assert.ok(firstWrite.created);
    const committed = appendVerifiedCorrectionSafely(seedDomain, validRes.payload, 'acct_882349102384', true, firstWrite.created);
    assert.equal(committed.created?.id, firstWrite.created.id);
    assert.equal(committed.created?.ticketNumber, firstWrite.created.ticketNumber);
    assert.equal(firstWrite.next.transactions, seedDomain.transactions);
    assert.equal(JSON.stringify(firstWrite.next.transactions), snapshotBefore);

    // Second write for same challan + allocation blocked cleanly
    const secondWrite = appendVerifiedCorrectionSafely(firstWrite.next, validRes.payload, 'acct_882349102384', true);
    assert.equal(secondWrite.created, null);
  }

  assert.match(formatCorrectionChanges(INITIAL_CORRECTIONS[0], false), /2024-2025 → 2025-2026/);
});

test('Unverified inquiry regex boundary validation and history formatting helpers', () => {
  for (const badRef of ['12345', '-ABC123', '.ABC123', 'ABC 1234', 'ABC#1234']) {
    const badRes = validateUnverifiedInquiry({
      originalReference: badRef,
      reason: 'Walk-in challan printed with wrong tax year on guest receipt.',
      requestedOutcome: 'Please log inquiry for manual verification at helpdesk.',
      evidenceNote: '',
    });
    assert.equal(badRes.ok, false, `Expected invalid ref rejection for "${badRef}"`);
  }

  const validInq = validateUnverifiedInquiry({
    originalReference: 'A1._/-',
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

test('Corrections views and modals enforce account authentication and render cleanly in SSR', () => {
  const prevWindow = (globalThis as unknown as { window?: unknown }).window;
  const localMap = new Map<string, string>([
    ['sohojkor_auth', 'true'],
    ['sohojkor_user', JSON.stringify(INITIAL_USER)],
  ]);
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      getItem: (k: string) => localMap.get(k) ?? null,
      setItem: (k: string, v: string) => { localMap.set(k, v); },
      removeItem: (k: string) => { localMap.delete(k); },
    },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  };
  try {
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

    // Untrusted/foreign initialTransaction must not open as an editable form
    const foreignModalHtml = renderWithProviders(
      <AppProvider>
        <MemoryRouter initialEntries={['/history']}>
          <CorrectionRequestModal open disablePortal onClose={() => {}} initialTransaction={{ ...INITIAL_TRANSACTIONS[0], id: 'tx-foreign', transactionRef: 'FOREIGN-1', ownerScope: 'acct_112233445566' }} />
        </MemoryRouter>
      </AppProvider>
    );
    assert.match(foreignModalHtml, /correction-unavailable-alert/);
  } finally {
    if (prevWindow === undefined) delete (globalThis as unknown as { window?: unknown }).window;
    else (globalThis as unknown as { window: unknown }).window = prevWindow;
  }

  const dashSummaryHtml = renderWithProviders(
    <MemoryRouter>
      <DashboardCorrectionSummary corrections={INITIAL_CORRECTIONS} />
    </MemoryRouter>
  );
  assert.match(dashSummaryHtml, /CORR-2026-881920/);
  assert.match(dashSummaryHtml, /View Correction Requests/);
});
