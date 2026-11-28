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

test('buildPaymentCertificateRecord emits 1 combined certificate bound to tx originMode, ownerScope & reconciled total', () => {
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
        remarks: '২য় কিস্তি মন্তব্য',
      },
    ],
    totalAmount: 35000,
  };

  const cert = buildPaymentCertificateRecord(multiItemTx, false);
  assert.ok(cert);
  assert.equal(cert.certificateId, 'CERT-SOHO-2026-98124');
  assert.equal(cert.items.length, 2);
  assert.equal(cert.assessmentYears, '2025-2026, 2026-2027');
  assert.equal(cert.lifecycleMode, 'signed_in');
  assert.equal(cert.ownerScope, 'acct_882349102384');

  const walkInTx = {
    ...multiItemTx,
    originMode: 'walk_in' as const,
    ownerScope: 'walkin',
    travelDetails: {
      passportNumber: 'A06829102',
      passengerName: 'Walk-In Traveler',
      destination: 'India (By Air)',
      travelClass: 'Economy' as const,
    },
  };
  const walkInCert = buildPaymentCertificateRecord(walkInTx, true);
  assert.ok(walkInCert);
  assert.equal(walkInCert.lifecycleMode, 'walk_in');
  assert.equal(walkInCert.ownerScope, 'walkin');
  assert.equal(walkInCert.travelDetails?.passportNumber, 'A06829102');

  const unreconciled = buildPaymentCertificateRecord({ ...multiItemTx, totalAmount: 999999 }, true);
  assert.equal(unreconciled, null);

  const pendingCert = buildPaymentCertificateRecord({ ...multiItemTx, status: 'Pending' }, true);
  assert.equal(pendingCert, null);
});

test('buildCertificatePdfLines preserves Unicode/Bengali remarks and ৳ symbol without stripping', () => {
  const tx = {
    ...INITIAL_TRANSACTIONS[0],
    items: [{ ...INITIAL_TRANSACTIONS[0].items[0], remarks: 'বাংলা মন্তব্য সহ লাইন' }],
  };
  const cert = buildPaymentCertificateRecord(tx, true)!;
  const lines = buildCertificatePdfLines(cert);
  const joined = lines.join('\n');
  assert.match(joined, /বাংলা মন্তব্য সহ লাইন/);
  assert.match(joined, /৳ 25,000/);

  const bytes = buildSamplePdfBytes(lines);
  const text = new TextDecoder().decode(bytes);
  assert.ok(text.startsWith('%PDF-1.4\n'));
  assert.match(text, /CERT-SOHO-2026-98124/);
});

test('PaymentCertificateDialog renders printable paper and TaxCreditCertificatesView isolates signed-out walk-in ledger', async () => {
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
  assert.match(dialogHtml, /data-testid="payment-certificate-paper"/);
  assert.match(dialogHtml, /Download PDF/);

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
  // When signed out (walkin scope), sample Rafiqul transaction must NOT leak into /certificates!
  assert.doesNotMatch(pageHtml, /CERT-SOHO-2026-98124/);
});
