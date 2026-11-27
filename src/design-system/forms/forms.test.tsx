import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import {
  isFieldLockedByPreviewPolicy,
  isPublicCapabilityAllowed,
} from '../../shared/previewPolicy';
import { getTheme } from '../theme';
import {
  AppTextField,
  AppNumberField,
  AppCurrencyField,
  AppSelectField,
  AppPasswordField,
  AppSearchField,
  AppTextArea,
  sanitizeDigits,
  sanitizeCurrencyInput,
  parseCurrencyAmount,
  validateCurrencyAmount,
  validateTin,
  validateOtp,
  validateBangladeshPhone,
  sanitizePassport,
  validatePassport,
} from './index';

function renderWithProviders(
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

test('TIN validation preserves leading zeros and enforces 12 numeric digits', () => {
  assert.equal(sanitizeDigits('0123-4567-8901-99', 12), '012345678901');
  assert.deepEqual(validateTin('012345678901'), { valid: true });
  assert.deepEqual(validateTin('882349102384'), { valid: true });
  assert.deepEqual(validateTin('12345'), { valid: false, reason: 'format' });
  assert.deepEqual(validateTin('88234910238a'), { valid: false, reason: 'format' });
  assert.deepEqual(validateTin(''), { valid: false, reason: 'required' });
});

test('OTP validation restricts to 6 numeric digits', () => {
  assert.equal(sanitizeDigits('12a34b5678', 6), '123456');
  assert.deepEqual(validateOtp('123456'), { valid: true });
  assert.deepEqual(validateOtp('000123'), { valid: true });
  assert.deepEqual(validateOtp('12345'), { valid: false, reason: 'format' });
  assert.deepEqual(validateOtp('12345a'), { valid: false, reason: 'format' });
  assert.deepEqual(validateOtp(''), { valid: false, reason: 'required' });
});

test('Currency sanitization and validation enforce decimal precision and minimum amounts', () => {
  assert.equal(sanitizeCurrencyInput('12,345.678', 2), '12345.67');
  assert.equal(sanitizeCurrencyInput('abc100.5.9', 2), '100.59');
  assert.equal(sanitizeCurrencyInput('.50', 2), '0.50');
  assert.equal(parseCurrencyAmount('1500.25'), 1500.25);
  assert.equal(parseCurrencyAmount('abc'), null);

  assert.deepEqual(
    validateCurrencyAmount('99.99', { minAmount: 100, decimalScale: 2 }),
    { valid: false, numericValue: 99.99, reason: 'min' }
  );
  assert.deepEqual(
    validateCurrencyAmount('100.50', { minAmount: 100, decimalScale: 2 }),
    { valid: true, numericValue: 100.5 }
  );
  assert.deepEqual(
    validateCurrencyAmount('999.99', { minAmount: 1000, decimalScale: 2 }),
    { valid: false, numericValue: 999.99, reason: 'min' }
  );
  assert.deepEqual(
    validateCurrencyAmount('1000.25', { minAmount: 1000, decimalScale: 2 }),
    { valid: true, numericValue: 1000.25 }
  );
  assert.deepEqual(
    validateCurrencyAmount('1000.123', { minAmount: 1000, decimalScale: 2 }),
    { valid: false, numericValue: null, reason: 'precision' }
  );
});

test('Phone and passport utilities validate expected formats', () => {
  assert.equal(validateBangladeshPhone('+8801712345678'), true);
  assert.equal(validateBangladeshPhone('01811122233'), true);
  assert.equal(validateBangladeshPhone('12345'), false);

  assert.equal(sanitizePassport('a06-829102xyz', 12), 'A06829102XYZ');
  assert.equal(validatePassport('A06829102'), true);
  assert.equal(validatePassport('A06'), false);
});

test('Scoped publicCapability policy replaces broad preview bypasses', () => {
  assert.equal(isPublicCapabilityAllowed('none', true), false);
  assert.equal(isPublicCapabilityAllowed('public_help_question', true), true);
  assert.equal(isPublicCapabilityAllowed('experimental_record_search', true), true);
  assert.equal(isFieldLockedByPreviewPolicy({ publicCapability: 'none' }, true), true);
  assert.equal(isFieldLockedByPreviewPolicy({ publicCapability: 'public_help_question' }, true), false);
  assert.equal(
    isFieldLockedByPreviewPolicy({ publicCapability: 'public_help_question', previewRestricted: true }, true),
    true
  );
  assert.equal(isFieldLockedByPreviewPolicy({ publicCapability: 'none' }, false), false);

  const restrictedHtml = renderWithProviders(
    <AppTextField label="Help" publicCapability="public_help_question" previewRestricted value="Hi" />
  );
  assert.match(restrictedHtml, /Help/);
});

test('All seven shared MUI form components render cleanly in light and dark themes', () => {
  for (const mode of ['light', 'dark'] as const) {
    const textHtml = renderWithProviders(
      <AppTextField label="Taxpayer Name" value="Md. Rafiqul Islam" readOnly />,
      mode
    );
    assert.match(textHtml, /Taxpayer Name/);
    assert.match(textHtml, /readonly/i);
    assert.match(textHtml, /Mui-readOnly/);

    const numberHtml = renderWithProviders(
      <AppNumberField label="Taxpayer TIN" maxLength={12} value="012345678901" />,
      mode
    );
    assert.match(numberHtml, /inputmode="numeric"/i);
    assert.match(numberHtml, /pattern="\[0-9\]\*"/);
    assert.match(numberHtml, /maxlength="12"/i);
    assert.match(numberHtml, /value="012345678901"/);

    const currencyHtml = renderWithProviders(
      <AppCurrencyField label="Amount (BDT)" value="1500.50" minAmount={100} />,
      mode
    );
    assert.match(currencyHtml, /inputmode="decimal"/i);
    assert.match(currencyHtml, /min="100"/);
    assert.match(currencyHtml, /৳/);

    const selectHtml = renderWithProviders(
      <AppSelectField
        label="Relationship"
        value="Mother"
        options={[
          { value: 'Father', label: 'Father' },
          { value: 'Mother', label: 'Mother' },
        ]}
      />,
      mode
    );
    assert.match(selectHtml, /role="combobox"/);
    assert.match(selectHtml, /Mother/);

    const selectDisabledHtml = renderWithProviders(
      <AppSelectField
        label="Relationship"
        value="Mother"
        disabled
        options={[
          { value: 'Father', label: 'Father' },
          { value: 'Mother', label: 'Mother' },
        ]}
      />,
      mode
    );
    assert.match(selectDisabledHtml, /aria-disabled="true"/);

    const passwordHtml = renderWithProviders(
      <AppPasswordField label="Password" value="secret" />,
      mode,
      'bn'
    );
    assert.match(passwordHtml, /type="password"/);
    assert.match(passwordHtml, /পাসওয়ার্ড দেখুন/);

    const passwordDisabledHtml = renderWithProviders(
      <AppPasswordField label="Password" value="secret" disabled />,
      mode,
      'en'
    );
    assert.match(passwordDisabledHtml, /aria-label="Show password"/);
    assert.match(passwordDisabledHtml, /disabled=""/);

    const searchHtml = renderWithProviders(
      <AppSearchField label="Search" value="SOHO-2026" onClear={() => {}} />,
      mode,
      'bn'
    );
    assert.match(searchHtml, /অনুসন্ধান মুছুন/);

    const searchDisabledHtml = renderWithProviders(
      <AppSearchField label="Search" value="SOHO-2026" onClear={() => {}} readOnly />,
      mode,
      'en'
    );
    assert.match(searchDisabledHtml, /aria-label="Clear search"/);
    assert.match(searchDisabledHtml, /disabled=""/);

    const textAreaHtml = renderWithProviders(
      <AppTextArea label="Description" rows={3} value="Details" />,
      mode
    );
    assert.match(textAreaHtml, /<textarea/);
    assert.match(textAreaHtml, /rows="3"/);
  }
});
