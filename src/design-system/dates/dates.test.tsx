import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { getTheme } from '../theme';
import {
  AppDateField,
  AppDatePicker,
  AppDateRangeFilter,
  formatDayjsToYmd,
  formatIsoToDhakaYmd,
  formatYmdDisplay,
  getDhakaTodayYmd,
  isDateWithinInclusiveRange,
  isValidYmd,
  parseYmdToDayjs,
  validateDateRangeFilter,
  validateGiftDate,
  validateYmdDate,
} from './index';

function renderDateWithProviders(
  node: React.ReactElement,
  mode: 'light' | 'dark' = 'light',
  lang: 'en' | 'bn' = 'en'
): string {
  void i18n.changeLanguage(lang);
  return renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={getTheme(mode)}>{node}</ThemeProvider>
    </I18nextProvider>
  );
}

test('YYYY-MM-DD utilities parse and format without timezone shift and reject invalid calendar dates', () => {
  assert.equal(isValidYmd('2024-02-29'), true);
  assert.equal(isValidYmd('2026-02-29'), false);
  assert.equal(isValidYmd('2026-02-30'), false);
  assert.equal(isValidYmd('2026-13-01'), false);
  assert.equal(isValidYmd('03-17-2026'), false);

  const parsed = parseYmdToDayjs('2026-03-17');
  assert.ok(parsed);
  assert.equal(formatDayjsToYmd(parsed), '2026-03-17');
  assert.equal(parseYmdToDayjs('2026-02-30'), null);
  assert.equal(parseYmdToDayjs(''), null);
});

test('Dhaka timezone helpers compute Asia/Dhaka date and validate Gift date max bound', () => {
  // 2026-03-17T20:30:00Z is already 2026-03-18 02:30 in Asia/Dhaka (+06:00)
  const utcEvening = new Date('2026-03-17T20:30:00Z');
  assert.equal(getDhakaTodayYmd(utcEvening), '2026-03-18');
  assert.equal(formatIsoToDhakaYmd('2026-03-17T20:30:00Z'), '2026-03-18');
  assert.equal(formatIsoToDhakaYmd('2026-03-17'), '2026-03-17');

  assert.deepEqual(validateGiftDate('2026-03-18', '2026-03-18'), { valid: true });
  assert.deepEqual(validateGiftDate('2026-03-17', '2026-03-18'), { valid: true });
  assert.deepEqual(validateGiftDate('2026-03-19', '2026-03-18'), { valid: false, reason: 'future' });
  assert.deepEqual(validateGiftDate('', '2026-03-18'), { valid: false, reason: 'required' });
  assert.deepEqual(validateGiftDate('2026-02-30', '2026-03-18'), { valid: false, reason: 'invalid' });

  assert.deepEqual(
    validateYmdDate('2026-01-10', { minDate: '2026-01-15', maxDate: '2026-03-18' }),
    { valid: false, reason: 'min' }
  );
  assert.match(formatYmdDisplay('2026-03-17', 'en'), /17.*2026/);
});

test('History date range validation and inclusive boundary checks handle optional bounds', () => {
  assert.deepEqual(validateDateRangeFilter({ from: '', to: '' }), { valid: true });
  assert.deepEqual(validateDateRangeFilter({ from: '2026-02-01', to: '' }), { valid: true });
  assert.deepEqual(validateDateRangeFilter({ from: '', to: '2026-03-01' }), { valid: true });
  assert.deepEqual(validateDateRangeFilter({ from: '2026-02-15', to: '2026-02-15' }), { valid: true });
  assert.deepEqual(validateDateRangeFilter({ from: '2026-03-10', to: '2026-03-01' }), {
    valid: false,
    reason: 'inverted',
  });

  // Inclusive endpoints in Asia/Dhaka
  assert.equal(
    isDateWithinInclusiveRange('2026-02-15T10:30:00Z', { from: '2026-02-15', to: '2026-02-15' }),
    true
  );
  assert.equal(
    isDateWithinInclusiveRange('2026-02-14T18:30:00Z', { from: '2026-02-15', to: '' }),
    true
  );
  assert.equal(
    isDateWithinInclusiveRange('2026-02-14T17:30:00Z', { from: '2026-02-15', to: '' }),
    false
  );
  assert.equal(
    isDateWithinInclusiveRange('2026-03-01T10:00:00Z', { from: '', to: '2026-02-28' }),
    false
  );
});

test('AppDateField, AppDatePicker, and AppDateRangeFilter render in EN/BN, light/dark, error, disabled, and readOnly states', () => {
  for (const mode of ['light', 'dark'] as const) {
    for (const lang of ['en', 'bn'] as const) {
      const fieldHtml = renderDateWithProviders(
        <AppDateField
          label="Assessment Date"
          value="2026-03-17"
          onChange={() => {}}
          readOnly
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      assert.match(fieldHtml, /Assessment Date/);
      assert.match(fieldHtml, /Mui-readOnly/);

      const pickerHtml = renderDateWithProviders(
        <AppDatePicker
          label="Gift Date"
          value="2026-03-17"
          onChange={() => {}}
          error
          helperText="Invalid date"
          disabled
        />,
        mode,
        lang
      );
      assert.match(pickerHtml, /Gift Date/);
      assert.match(pickerHtml, /Invalid date/);
      assert.match(pickerHtml, /Mui-disabled/);

      const rangeHtml = renderDateWithProviders(
        <AppDateRangeFilter
          value={{ from: '2026-03-10', to: '2026-03-01' }}
          onChange={() => {}}
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      assert.match(rangeHtml, /date-range-from/);
      assert.match(rangeHtml, /date-range-to/);
      assert.match(
        rangeHtml,
        new RegExp(
          lang === 'bn'
            ? 'শেষের তারিখ শুরুর তারিখের আগে হতে পারবে না।'
            : 'End date cannot be earlier than start date.'
        )
      );
    }
  }
});
