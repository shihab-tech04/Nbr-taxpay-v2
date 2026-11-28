import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { getTheme } from '../../design-system/theme';
import { AppProvider } from '../../shared/AppContext';
import { INITIAL_TRANSACTIONS } from '../../shared/mockData';
import {
  buildCertificatePdfLines,
  buildPaymentCertificateRecord,
  buildSamplePdfBytes,
} from '../../shared/certificateUtils';
import { PaymentCertificateDialog } from '../../components/certificates/PaymentCertificateDialog';
import { TaxCreditCertificatesView } from './TaxCreditCertificatesView';

test('buildPaymentCertificateRecord emits 1 combined certificate per completed transaction with all line heads', () => {
  const multiItemTx = {
    ...INITIAL_TRANSACTIONS[0],
    items: [
      INITIAL_TRANSACTIONS[0].items[0],
      {
        headId: 'h2',
        headCode: '0112',
        headNameEn: 'Advance Income Tax (AIT)',
        headNameBn: 'অগ্রিম আয়কর (এআইটি)',
        assessmentYear: '2026-2027',
        amount: 10000,
      },
    ],
    totalAmount: 35000,
  };

  const cert = buildPaymentCertificateRecord(multiItemTx, true);
  assert.ok(cert);
  assert.equal(cert.certificateId, 'CERT-SOHO-2026-98124');
  assert.equal(cert.items.length, 2);
  assert.equal(cert.assessmentYears, '2025-2026, 2026-2027');
  assert.equal(cert.lifecycleMode, 'signed_in');

  const walkInCert = buildPaymentCertificateRecord(multiItemTx, false);
  assert.ok(walkInCert);
  assert.equal(walkInCert.lifecycleMode, 'walk_in');
  assert.match(walkInCert.lifecycleNoteEn, /Walk-in/);

  const pendingCert = buildPaymentCertificateRecord({ ...multiItemTx, status: 'Pending' }, true);
  assert.equal(pendingCert, null);
});

test('buildSamplePdfBytes produces valid %PDF-1.4 payload without official verification claims', () => {
  const cert = buildPaymentCertificateRecord(INITIAL_TRANSACTIONS[0], true)!;
  const lines = buildCertificatePdfLines(cert);
  const bytes = buildSamplePdfBytes(lines);
  const text = new TextDecoder().decode(bytes);
  assert.ok(text.startsWith('%PDF-1.4\n'));
  assert.match(text, /%%EOF\n$/);
  assert.match(text, /CERT-SOHO-2026-98124/);
  assert.match(text, /Illustrative preview only/);
});

test('PaymentCertificateDialog and TaxCreditCertificatesView keep Tax Credit and Payment Certificates separate', async () => {
  await i18n.changeLanguage('en');

  const dialogHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={getTheme('light')}>
        <PaymentCertificateDialog
          open
          disablePortal
          onClose={() => {}}
          transaction={INITIAL_TRANSACTIONS[0]}
          isAuthenticated
        />
      </ThemeProvider>
    </I18nextProvider>
  );
  assert.match(dialogHtml, /Combined Payment Certificate \(Sample\)/);
  assert.match(dialogHtml, /CERT-SOHO-2026-98124/);
  assert.match(dialogHtml, /Download PDF/);
  assert.match(dialogHtml, /Print/);

  const pageHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <AppProvider>
        <ThemeProvider theme={getTheme('light')}>
          <MemoryRouter initialEntries={['/certificates']}>
            <TaxCreditCertificatesView />
          </MemoryRouter>
        </ThemeProvider>
      </AppProvider>
    </I18nextProvider>
  );
  assert.match(pageHtml, /data-testid="tax-credit-certificates-section"/);
  assert.match(pageHtml, /data-testid="payment-certificates-section"/);
  assert.match(pageHtml, /Official Tax Credit Certificates Require Live NBR Verification/);
  assert.match(pageHtml, /CERT-SOHO-2026-98124/);
});
