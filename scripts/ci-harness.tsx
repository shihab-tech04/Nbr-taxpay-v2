import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import '../src/index.css';
import i18n from '../src/i18n/i18n';
import { getTheme } from '../src/design-system/theme';
import {
  AppAutocomplete,
  AppDateField,
  AppDateLocalizationProvider,
  AppTinInput,
  AppTinLookupField,
  AppTinResultCard,
  INVALID_YMD_VALUE,
  sanitizeTinResultForDisplay,
} from '../src/design-system/forms';

const RECORDS = {
  A_AUTH: { tin: '012345678901', name: 'Taxpayer Alpha', classification: 'Individual', allowRevealTin: true },
  B_AUTH: { tin: '987654321098', name: 'Taxpayer Beta', classification: 'Individual', allowRevealTin: true },
  A_LOCKED: { tin: '012345678901', name: 'Taxpayer Alpha', classification: 'Individual', allowRevealTin: false },
} as const;

type RecordKey = keyof typeof RECORDS;

export function CiHarness() {
  const [recordKey, setRecordKey] = useState<RecordKey>('A_AUTH');
  const [tinValue, setTinValue] = useState('012345678901');
  const [masked, setMasked] = useState(true);
  const [autoValue, setAutoValue] = useState<string | null>(null);
  const [boundDate, setBoundDate] = useState('2026-03-10');
  const [boundValidity, setBoundValidity] = useState('valid');
  const [noFutureDate, setNoFutureDate] = useState('');

  const payload = sanitizeTinResultForDisplay(RECORDS[recordKey]);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={getTheme('light')}>
        <AppDateLocalizationProvider>
          <div style={{ padding: 24, maxWidth: 640 }}>
            <section data-testid="harness-tin-result-section">
              <button type="button" data-testid="rec-a-auth" onClick={() => setRecordKey('A_AUTH')}>
                A Auth
              </button>
              <button type="button" data-testid="rec-b-auth" onClick={() => setRecordKey('B_AUTH')}>
                B Auth
              </button>
              <button type="button" data-testid="rec-a-locked" onClick={() => setRecordKey('A_LOCKED')}>
                A Locked
              </button>
              <AppTinResultCard
                {...payload}
                testId="ci-tin-result-card"
                publicCapability="public_help_question"
              />
            </section>

            <section data-testid="harness-tin-inputs">
              <button type="button" data-testid="toggle-tin-mask" onClick={() => setMasked((m) => !m)}>
                Toggle Mask
              </button>
              <AppTinLookupField
                id="ci-tin-lookup"
                label="CI Lookup TIN"
                value={tinValue}
                onChange={setTinValue}
                onSearch={() => {}}
                canSearch
                masked={masked}
                helperText="Enter 12 numeric digits"
                suggestedTins={['012345678901', '01234567890a', '012345', '882349102384']}
                segmentsTestId="ci-tin-segments"
                inputTestId="taxpayer-tin-digits"
                publicCapability="public_help_question"
              />
              <AppTinInput
                segmented={false}
                masked={masked}
                value={tinValue}
                onChange={setTinValue}
                inputTestId="ci-plain-tin"
                publicCapability="public_help_question"
              />
            </section>

            <section data-testid="harness-autocomplete">
              <div data-testid="auto-selected-value">
                {autoValue === null ? '__NULL__' : autoValue === '' ? '__EMPTY__' : autoValue}
              </div>
              <AppAutocomplete
                id="ci-autocomplete"
                label="Tax Zone"
                value={autoValue}
                onChange={(nextVal) => setAutoValue(nextVal)}
                options={[
                  { value: '12345', code: 'ZONE-01', label: 'Tax Zone 01, Dhaka', group: 'Dhaka', secondary: 'কর অঞ্চল ০১' },
                  { value: '22901', code: 'ZONE-02', label: 'Tax Zone 02, Chattogram', group: 'Chattogram', secondary: 'কর অঞ্চল ০২' },
                ]}
                publicCapability="public_help_question"
              />
            </section>

            <section data-testid="harness-dates" data-invalid-sentinel={INVALID_YMD_VALUE}>
              <div data-testid="bound-date-value">{boundDate === '' ? '__EMPTY__' : boundDate}</div>
              <div data-testid="bound-date-validity">{boundValidity}</div>
              <AppDateField
                label="Bounded Date"
                value={boundDate}
                onChange={setBoundDate}
                onValidityChange={(v) => setBoundValidity(`${v.status}:${v.reason ?? 'ok'}`)}
                minDate="2026-01-10"
                maxDate="2026-12-20"
                testId="ci-bounded-date"
                publicCapability="public_help_question"
              />
              <AppDateField
                label="No Future Date"
                value={noFutureDate}
                onChange={setNoFutureDate}
                disableFuture
                testId="ci-no-future-date"
                publicCapability="public_help_question"
              />
            </section>
          </div>
        </AppDateLocalizationProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<CiHarness />);
}
