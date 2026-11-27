import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { isFieldLockedByPreviewPolicy } from '../../shared/previewPolicy';
import type { YmdDateString } from '../../types/tax';
import { getTheme } from '../theme';
import {
  AppDateField,
  AppDateLocalizationProvider,
  AppDatePicker,
  AppDateRangeFilter,
  INVALID_YMD_VALUE,
  formatDayjsToYmd,
  formatIsoToDhakaYmd,
  formatYmdDisplay,
  getDhakaTodayYmd,
  getLocalTodayYmd,
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
      <ThemeProvider theme={getTheme(mode)}>
        <AppDateLocalizationProvider>{node}</AppDateLocalizationProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

test('YYYY-MM-DD utilities distinguish empty, invalid, and valid dates without timezone shift', () => {
  const validLiteral: YmdDateString = '2024-02-29';
  assert.equal(isValidYmd(validLiteral), true);
  // @ts-expect-error arbitrary string must not satisfy YmdDateString
  const badPlain: YmdDateString = 'not-a-date';
  // @ts-expect-error invalid month literal must not satisfy YmdDateString
  const badMonth: YmdDateString = '2026-13-01';
  // @ts-expect-error empty string must not satisfy YmdDateString
  const badEmpty: YmdDateString = '';
  assert.equal(isValidYmd(badPlain), false);
  assert.equal(isValidYmd(badMonth), false);
  assert.equal(isValidYmd(badEmpty), false);

  const dynamicCandidate: string = '2026-04-10';
  let narrowedYmd: YmdDateString | null = null;
  if (isValidYmd(dynamicCandidate)) {
    narrowedYmd = dynamicCandidate;
  }
  assert.equal(narrowedYmd, '2026-04-10');

  assert.equal(isValidYmd('2024-02-29'), true);
  assert.equal(isValidYmd('2026-02-29'), false);
  assert.equal(isValidYmd('2026-02-30'), false);
  assert.equal(isValidYmd(INVALID_YMD_VALUE), false);

  const parsed = parseYmdToDayjs('2026-03-17');
  assert.ok(parsed);
  assert.equal(formatDayjsToYmd(parsed), '2026-03-17');
  assert.equal(parseYmdToDayjs('2026-02-30'), null);
  assert.equal(parseYmdToDayjs(INVALID_YMD_VALUE), null);
  assert.equal(parseYmdToDayjs(''), null);

  assert.deepEqual(validateYmdDate('', { required: false }), { valid: true });
  assert.deepEqual(validateYmdDate('', { required: true }), { valid: false, reason: 'required' });
  assert.deepEqual(validateYmdDate(INVALID_YMD_VALUE, { required: false }), {
    valid: false,
    reason: 'invalid',
  });
  assert.deepEqual(validateYmdDate('2026-01-05', { disablePast: true, todayYmd: '2026-01-10' }), {
    valid: false,
    reason: 'past',
  });
  assert.deepEqual(validateYmdDate('2026-01-15', { disableFuture: true, todayYmd: '2026-01-10' }), {
    valid: false,
    reason: 'future',
  });
});

test('Dhaka timezone helpers govern Gift date max bound only', () => {
  const utcEvening = new Date('2026-03-17T20:30:00Z');
  assert.equal(getDhakaTodayYmd(utcEvening), '2026-03-18');
  assert.equal(formatIsoToDhakaYmd('2026-03-17T20:30:00Z'), '2026-03-18');
  assert.equal(formatIsoToDhakaYmd('2026-03-17'), '2026-03-17');
  assert.equal(isValidYmd(getLocalTodayYmd(utcEvening)), true);

  assert.deepEqual(validateGiftDate('2026-03-18', '2026-03-18'), { valid: true });
  assert.deepEqual(validateGiftDate('2026-03-17', '2026-03-18'), { valid: true });
  assert.deepEqual(validateGiftDate('2026-03-19', '2026-03-18'), { valid: false, reason: 'future' });
  assert.deepEqual(validateGiftDate('', '2026-03-18'), { valid: false, reason: 'required' });
  assert.deepEqual(validateGiftDate(INVALID_YMD_VALUE, '2026-03-18'), {
    valid: false,
    reason: 'invalid',
  });
  assert.match(formatYmdDisplay('2026-03-17', 'en'), /17.*2026/);
});

function pinnedOriginalPaymentDateFilter(
  createdAt: string,
  fromDate: string,
  toDate: string
): boolean {
  const from = fromDate.trim();
  const to = toDate.trim();
  if (!from && !to) return true;
  const ts = new Date(createdAt).getTime();
  if (Number.isNaN(ts)) return false;
  if (from) {
    const [y, m, d] = from.split('-').map(Number);
    if (ts < new Date(y, m - 1, d, 0, 0, 0, 0).getTime()) return false;
  }
  if (to) {
    const [y, m, d] = to.split('-').map(Number);
    if (ts > new Date(y, m - 1, d, 23, 59, 59, 999).getTime()) return false;
  }
  return true;
}

test('History date range filtering matches pinned original paymentDateFilter.ts with unfiltered no-bounds and rejects malformed dates', () => {
  assert.deepEqual(validateDateRangeFilter({ from: '', to: '' }), { valid: true });
  assert.deepEqual(validateDateRangeFilter({ from: '2026-02-01', to: '' }), { valid: true });
  assert.deepEqual(validateDateRangeFilter({ from: '', to: '2026-03-01' }), { valid: true });
  assert.deepEqual(validateDateRangeFilter({ from: INVALID_YMD_VALUE, to: '' }), {
    valid: false,
    reason: 'invalid_from',
  });
  assert.deepEqual(validateDateRangeFilter({ from: '2026-03-10', to: '2026-03-01' }), {
    valid: false,
    reason: 'inverted',
  });

  // No bounds retains original unfiltered behavior even on unusual/empty record timestamps
  assert.equal(isDateWithinInclusiveRange('not-a-timestamp', { from: '', to: '' }), true);
  assert.equal(isDateWithinInclusiveRange('', { from: '', to: '' }), true);
  assert.equal(isDateWithinInclusiveRange('2026-02-30', { from: '', to: '' }), true);

  const startOfDay = new Date(2026, 1, 15, 0, 0, 0, 0).toISOString();
  const endOfDay = new Date(2026, 1, 15, 23, 59, 59, 999).toISOString();
  const beforeDay = new Date(2026, 1, 14, 23, 59, 59, 999).toISOString();
  const afterDay = new Date(2026, 1, 16, 0, 0, 0, 0).toISOString();

  // Parity against pinned original paymentDateFilter.ts across browser-local timezones
  const sampleTimestamps = [
    startOfDay,
    endOfDay,
    beforeDay,
    afterDay,
    '2026-04-10T11:30:00Z',
    '2026-04-10T20:30:00Z',
    '2026-04-10T02:00:00Z',
    '2026-04-10',
  ];
  const validRanges: Array<{ from: string; to: string }> = [
    { from: '', to: '' },
    { from: '2026-02-15', to: '2026-02-15' },
    { from: '2026-02-15', to: '' },
    { from: '', to: '2026-02-15' },
    { from: '2026-04-10', to: '2026-04-10' },
    { from: '2026-04-09', to: '2026-04-10' },
    { from: '2026-04-10', to: '2026-04-11' },
  ];
  for (const ts of sampleTimestamps) {
    for (const range of validRanges) {
      assert.equal(
        isDateWithinInclusiveRange(ts, range),
        pinnedOriginalPaymentDateFilter(ts, range.from, range.to),
        `Mismatch for ts=${ts} range=${JSON.stringify(range)} in TZ=${process.env.TZ ?? 'system'}`
      );
    }
  }

  // With bounds active: reject malformed record dates (including V8 calendar rollover dates) & invalid/reversed bounds
  assert.equal(isDateWithinInclusiveRange('not-a-timestamp', { from: '2026-02-01', to: '' }), false);
  assert.equal(isDateWithinInclusiveRange('', { from: '', to: '2026-02-28' }), false);
  assert.equal(isDateWithinInclusiveRange('2026-02-30', { from: '2026-03-01', to: '2026-03-05' }), false);
  assert.equal(isDateWithinInclusiveRange('2026-02-29T12:00:00Z', { from: '2026-02-28', to: '2026-03-02' }), false);
  assert.equal(isDateWithinInclusiveRange('2026-04-31T00:00:00Z', { from: '2026-04-01', to: '2026-05-05' }), false);
  assert.equal(isDateWithinInclusiveRange(startOfDay, { from: '2026-03-10', to: '2026-03-01' }), false);
  assert.equal(isDateWithinInclusiveRange(startOfDay, { from: INVALID_YMD_VALUE, to: '' }), false);
  assert.equal(isDateWithinInclusiveRange(startOfDay, { from: '2026-02-30', to: '' }), false);
});

test('Date controls render single provider EN/BN validation errors and preview-locked range Clear', () => {
  for (const mode of ['light', 'dark'] as const) {
    for (const lang of ['en', 'bn'] as const) {
      const invalidFieldHtml = renderDateWithProviders(
        <AppDateField
          label="Assessment Date"
          value={INVALID_YMD_VALUE}
          onChange={() => {}}
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      assert.match(invalidFieldHtml, /aria-invalid="true"/);
      assert.match(
        invalidFieldHtml,
        new RegExp(lang === 'bn' ? 'সঠিক তারিখ লিখুন' : 'valid date')
      );

      const pastErrorPickerHtml = renderDateWithProviders(
        <AppDatePicker
          label="Future Only"
          value="2000-01-01"
          onChange={() => {}}
          disablePast
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      assert.match(pastErrorPickerHtml, /aria-invalid="true"/);
      assert.match(
        pastErrorPickerHtml,
        new RegExp(lang === 'bn' ? 'অতীতের হতে পারবে না' : 'cannot be in the past')
      );

      assert.equal(
        isFieldLockedByPreviewPolicy({ publicCapability: 'none', previewRestricted: true }, true),
        true
      );

      const rangeHtml = renderDateWithProviders(
        <AppDateRangeFilter
          value={{ from: '2026-03-10', to: '2026-03-01' }}
          onChange={() => {}}
          readOnly
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      const lockedClearMatch = rangeHtml.match(/<button[^>]*data-testid="date-range-clear"[^>]*>/);
      assert.ok(lockedClearMatch);
      assert.match(lockedClearMatch[0], /disabled=""/);
      assert.match(
        rangeHtml,
        new RegExp(
          lang === 'bn'
            ? 'শেষের তারিখ শুরুর তারিখের আগে হতে পারবে না।'
            : 'End date cannot be earlier than start date.'
        )
      );

      const activeRangeHtml = renderDateWithProviders(
        <AppDateRangeFilter
          value={{ from: '2026-03-01', to: '2026-03-10' }}
          onChange={() => {}}
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      const clearMatch = activeRangeHtml.match(/<button[^>]*data-testid="date-range-clear"[^>]*>/);
      assert.ok(clearMatch);
      assert.doesNotMatch(clearMatch[0], /disabled=""/);
    }
  }
});
