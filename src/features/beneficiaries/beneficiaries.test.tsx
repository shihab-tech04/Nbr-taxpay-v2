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
import { INITIAL_BENEFICIARIES, INITIAL_BENEFICIARY_LISTS, INITIAL_TRANSACTIONS } from '../../shared/mockData';
import type { Beneficiary, PaymentTransaction } from '../../types/tax';
import {
  APPROVED_RELATIONSHIPS,
  formatBeneficiaryDisplayTag,
  getBeneficiaryTimelineEntries,
  validateBeneficiaryInput,
} from './beneficiaryLogic';
import { BeneficiariesView } from './BeneficiariesView';

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

test('beneficiaryLogic enforces 9 relationships, Others 1-80 chars, no duplicate standard tags, optional phone', () => {
  assert.equal(APPROVED_RELATIONSHIPS.length, 9);

  // Empty Others note rejected
  const emptyNote = validateBeneficiaryInput(
    { name: 'Partner A', tin: '551122334455', relationship: 'Others', relationshipNote: '' },
    INITIAL_BENEFICIARIES
  );
  assert.ok(emptyNote.relationshipNote);

  // Over 80 chars rejected
  const longNote = validateBeneficiaryInput(
    { name: 'Partner A', tin: '551122334455', relationship: 'Others', relationshipNote: 'x'.repeat(81) },
    INITIAL_BENEFICIARIES
  );
  assert.ok(longNote.relationshipNote);

  // Duplicate built-in relationship label rejected in Others
  const dupStandard = validateBeneficiaryInput(
    { name: 'Partner A', tin: '551122334455', relationship: 'Others', relationshipNote: 'Father' },
    INITIAL_BENEFICIARIES
  );
  assert.ok(dupStandard.relationshipNote);

  // Valid 1-80 char Others note & empty optional phone accepted
  const validOthers = validateBeneficiaryInput(
    { name: 'Partner A', tin: '551122334455', relationship: 'Others', relationshipNote: 'Auditor', phone: '' },
    INITIAL_BENEFICIARIES
  );
  assert.deepEqual(validOthers, {});

  // Format finalTag omits redundant 'Others'
  const b: Beneficiary = {
    id: 'b-x', name: 'Partner A', tin: '551122334455', relationship: 'Others', relationshipNote: 'Auditor', createdAt: '2026-01-01',
  };
  assert.equal(formatBeneficiaryDisplayTag(b, (k) => k), 'Auditor');

  // Duplicate TIN rejected for create, allowed for self-edit
  const dupTin = validateBeneficiaryInput(
    { name: 'Clone', tin: INITIAL_BENEFICIARIES[0].tin, relationship: 'Mother' },
    INITIAL_BENEFICIARIES
  );
  assert.ok(dupTin.tin);
  const selfEdit = validateBeneficiaryInput(
    { name: 'Mrs. Fatema Begum', tin: INITIAL_BENEFICIARIES[0].tin, relationship: 'Mother' },
    INITIAL_BENEFICIARIES,
    INITIAL_BENEFICIARIES[0].id
  );
  assert.deepEqual(selfEdit, {});
});

test('getBeneficiaryTimelineEntries enforces ownerScope isolation and item-level allocation sums', () => {
  const combinedTx: PaymentTransaction = {
    ...INITIAL_TRANSACTIONS[0],
    id: 'tx-comb-1',
    transactionRef: 'SOHO-COMB-1',
    ownerScope: 'acct_882349102384',
    items: [
      { ...INITIAL_TRANSACTIONS[0].items[0], taxpayerTin: '882349102384', amount: 10000 },
      { ...INITIAL_TRANSACTIONS[0].items[0], taxpayerTin: '992384102938', amount: 4500 },
    ],
    totalAmount: 14500,
  };
  const otherOwnerTx: PaymentTransaction = {
    ...combinedTx,
    id: 'tx-other-owner',
    ownerScope: 'acct_112233445566',
  };

  const entries = getBeneficiaryTimelineEntries([combinedTx, otherOwnerTx], 'acct_882349102384', '992384102938');
  assert.equal(entries.length, 1);
  assert.equal(entries[0].allocatedAmount, 4500);
  assert.equal(entries[0].transaction.transactionRef, 'SOHO-COMB-1');
});

test('BeneficiariesView, BeneficiaryListManager, and BeneficiariesTable render lists, display format, Make Payment, and omit Excel', async () => {
  const { BeneficiariesTable } = await import('./components/BeneficiariesTable');
  const { BeneficiaryListManager } = await import('./components/BeneficiaryListManager');
  assert.equal(INITIAL_BENEFICIARY_LISTS.length, 3);
  const viewHtml = renderWithProviders(
    <AppProvider>
      <MemoryRouter initialEntries={['/beneficiaries']}>
        <BeneficiariesView />
      </MemoryRouter>
    </AppProvider>
  );
  assert.match(viewHtml, /data-testid="beneficiary-list-filters"/);
  assert.doesNotMatch(viewHtml, /\b(Excel|CSV|XLSX|Import\s+Excel|Export\s+Excel|Export\s+CSV)\b/i);

  const listHtml = renderWithProviders(
    <BeneficiaryListManager
      lists={INITIAL_BENEFICIARY_LISTS}
      beneficiaries={INITIAL_BENEFICIARIES}
      selectedListId="all"
      onSelectList={() => {}}
      onCreateList={() => null}
      onRenameList={() => {}}
      onDeleteList={() => false}
    />
  );
  assert.match(listHtml, /All \(3\)/);
  assert.match(listHtml, /Family \(2\)/);

  const tableHtml = renderWithProviders(
    <BeneficiariesTable
      beneficiaries={INITIAL_BENEFICIARIES}
      lists={INITIAL_BENEFICIARY_LISTS}
      onMakePayment={() => {}}
      onViewTimeline={() => {}}
      onRequestEdit={() => {}}
      onRequestDelete={() => {}}
    />
  );
  assert.match(tableHtml, /Mrs\. Fatema Begum · Mother/);
  assert.match(tableHtml, /Make Payment/);
  assert.doesNotMatch(tableHtml, /\b(Excel|CSV|XLSX|Import\s+Excel|Export\s+Excel|Export\s+CSV)\b/i);
});
