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
  AppAutocomplete,
  AppCurrencyField,
  AppNumberField,
  AppPasswordField,
  AppSearchField,
  AppSelectField,
  AppTextArea,
  AppTextField,
  AppTinInput,
  AppTinLookupField,
  AppTinResultCard,
  filterMatchingTinSuggestions,
  findSelectedAutocompleteOption,
  groupAutocompleteOptionsPreserveOrder,
  insertDigitsAtRange,
  isValidNumericSuggestion,
  maskTinForDisplay,
  matchAutocompleteOptions,
  parseCurrencyAmount,
  parsePastedIdentifierDigits,
  replaceDigitAtFullLength,
  resolveTinPasteUpdate,
  sanitizeCurrencyInput,
  sanitizeDigits,
  sanitizeIdentifierDigits,
  sanitizePassport,
  validateBangladeshPhone,
  validateCurrencyAmount,
  validateIdentifierLength,
  validateOtp,
  validatePassport,
  validateTin,
  type AppAutocompleteOption,
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

  assert.deepEqual(validateCurrencyAmount('99.99', { minAmount: 100, decimalScale: 2 }), { valid: false, numericValue: 99.99, reason: 'min' });
  assert.deepEqual(validateCurrencyAmount('100.50', { minAmount: 100, decimalScale: 2 }), { valid: true, numericValue: 100.5 });
  assert.deepEqual(validateCurrencyAmount('999.99', { minAmount: 1000, decimalScale: 2 }), { valid: false, numericValue: 999.99, reason: 'min' });
  assert.deepEqual(validateCurrencyAmount('1000.25', { minAmount: 1000, decimalScale: 2 }), { valid: true, numericValue: 1000.25 });
  assert.deepEqual(validateCurrencyAmount('1000.123', { minAmount: 1000, decimalScale: 2 }), { valid: false, numericValue: null, reason: 'precision' });
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
  assert.equal(isFieldLockedByPreviewPolicy({ publicCapability: 'public_help_question', previewRestricted: true }, true), true);
  assert.equal(isFieldLockedByPreviewPolicy({ publicCapability: 'none' }, false), false);
});

test('All seven base MUI form components render cleanly in light and dark themes', () => {
  for (const mode of ['light', 'dark'] as const) {
    const textHtml = renderWithProviders(<AppTextField label="Taxpayer Name" value="Md. Rafiqul Islam" readOnly />, mode);
    assert.match(textHtml, /Taxpayer Name/);
    assert.match(textHtml, /Mui-readOnly/);

    const numberHtml = renderWithProviders(<AppNumberField label="Taxpayer TIN" maxLength={12} value="012345678901" />, mode);
    assert.match(numberHtml, /inputmode="numeric"/i);
    assert.match(numberHtml, /value="012345678901"/);

    const currencyHtml = renderWithProviders(<AppCurrencyField label="Amount (BDT)" value="1500.50" minAmount={100} />, mode);
    assert.match(currencyHtml, /৳/);

    const selectHtml = renderWithProviders(
      <AppSelectField label="Relationship" value="Mother" options={[{ value: 'Father', label: 'Father' }, { value: 'Mother', label: 'Mother' }]} />,
      mode
    );
    assert.match(selectHtml, /Mother/);

    const passwordHtml = renderWithProviders(<AppPasswordField label="Password" value="secret" />, mode, 'bn');
    assert.match(passwordHtml, /পাসওয়ার্ড দেখুন/);

    const searchHtml = renderWithProviders(<AppSearchField label="Search" value="SOHO-2026" onClear={() => {}} />, mode, 'bn');
    assert.match(searchHtml, /অনুসন্ধান মুছুন/);

    const textAreaHtml = renderWithProviders(<AppTextArea label="Description" rows={3} value="Details" />, mode);
    assert.match(textAreaHtml, /rows="3"/);
  }
});

test('AppAutocomplete helpers search labels, codes, groups, and EN/BN secondary text while preserving stable values', () => {
  const options: AppAutocompleteOption[] = [
    { value: '', label: 'Select zone' },
    { value: '12345', code: 'ZONE-01', label: 'Tax Zone 01, Dhaka', group: 'Dhaka Division', secondary: 'কর অঞ্চল ০১, ঢাকা · Circle 04' },
    { value: '22901', code: 'ZONE-02', label: 'Tax Zone 02, Chattogram', group: 'Chattogram Division', secondary: 'কর অঞ্চল ০২, চট্টগ্রাম' },
    { value: '12399', code: 'LTU-DHK', label: 'LTU Dhaka', group: 'Dhaka Division', secondary: 'বৃহৎ করদাতা ইউনিট', disabled: true },
  ];

  const grouped = groupAutocompleteOptionsPreserveOrder(options);
  assert.deepEqual(grouped.map((o) => o.value), ['12345', '12399', '22901']);

  assert.deepEqual(matchAutocompleteOptions(grouped, '').map((o) => o.value), ['12345', '12399', '22901']);
  assert.deepEqual(matchAutocompleteOptions(grouped, '22901').map((o) => o.value), ['22901']);
  assert.deepEqual(matchAutocompleteOptions(grouped, 'zone-02').map((o) => o.value), ['22901']);
  assert.deepEqual(matchAutocompleteOptions(grouped, 'চট্টগ্রাম').map((o) => o.value), ['22901']);
  assert.deepEqual(matchAutocompleteOptions(grouped, 'Dhaka Division').map((o) => o.value), ['12345', '12399']);
  assert.deepEqual(matchAutocompleteOptions(grouped, '   circle 04  ').map((o) => o.value), ['12345']);

  assert.equal(findSelectedAutocompleteOption(grouped, '12345')?.label, 'Tax Zone 01, Dhaka');
  assert.equal(findSelectedAutocompleteOption(grouped, ''), null);
  assert.equal(findSelectedAutocompleteOption(grouped, 'unknown'), null);
});

test('AppAutocomplete renders combobox, validation, loading, readOnly, disabled, EN/BN, and light/dark themes', () => {
  const options: AppAutocompleteOption[] = [
    { value: '12345', label: 'Tax Zone 01, Dhaka', group: 'Dhaka', secondary: 'কর অঞ্চল ০১' },
    { value: '22901', label: 'Tax Zone 02, Chattogram', group: 'Chattogram', secondary: 'কর অঞ্চল ০২', disabled: true },
  ];

  for (const mode of ['light', 'dark'] as const) {
    for (const lang of ['en', 'bn'] as const) {
      const html = renderWithProviders(
        <AppAutocomplete
          label="Tax Zone"
          ariaLabel="Tax Zone selector"
          value="12345"
          onChange={() => {}}
          options={options}
          required
          loading
          helperText="Select your circle"
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      assert.match(html, /role="combobox"/);
      assert.match(html, /value="Tax Zone 01, Dhaka"/);
      assert.match(html, /role="progressbar"/);
      assert.match(html, /Select your circle/);

      const readOnlyHtml = renderWithProviders(
        <AppAutocomplete label="Tax Zone" value="12345" onChange={() => {}} options={options} readOnly error />,
        mode,
        lang
      );
      assert.match(readOnlyHtml, /Mui-readOnly/);
      assert.match(readOnlyHtml, /aria-readonly="true"/);
      assert.match(readOnlyHtml, /aria-invalid="true"/);

      const disabledHtml = renderWithProviders(
        <AppAutocomplete label="Tax Zone" value={null} onChange={() => {}} options={options} disabled />,
        mode,
        lang
      );
      assert.match(disabledHtml, /disabled=""/);
    }
  }
});

test('Segmented TIN helpers preserve leading zeros, configurable length, masking, paste caret, and numeric-only suggestions', () => {
  assert.equal(sanitizeIdentifierDigits('0123-4567-8901-99', 12), '012345678901');
  assert.equal(sanitizeIdentifierDigits('001234567890199', 13), '0012345678901');
  assert.equal(parsePastedIdentifierDigits(' 0123 4567 8901 ', 12), '012345678901');

  assert.deepEqual(insertDigitsAtRange('01299567', 3, 5, '34', 12), {
    nextValue: '01234567',
    nextCaretIndex: 5,
  });
  assert.deepEqual(resolveTinPasteUpdate('01299567', '34', 3, 5, 12), {
    nextValue: '01234567',
    nextCaretIndex: 5,
    activeDigit: 5,
  });
  assert.deepEqual(resolveTinPasteUpdate('012', '0123-4567-8901', 1, 1, 12), {
    nextValue: '012345678901',
    nextCaretIndex: 12,
    activeDigit: 11,
  });
  assert.deepEqual(replaceDigitAtFullLength('012345678901', 0, '9', 12), {
    nextValue: '912345678901',
    nextCaretIndex: 1,
  });
  assert.deepEqual(replaceDigitAtFullLength('012345678901', 11, '7', 12), {
    nextValue: '012345678907',
    nextCaretIndex: 12,
  });
  assert.equal(replaceDigitAtFullLength('012345678901', 12, '7', 12), null);
  assert.equal(replaceDigitAtFullLength('012345678901', 3, 'a', 12), null);

  assert.equal(isValidNumericSuggestion('012345678901', 12), true);
  assert.equal(isValidNumericSuggestion('01234567890a', 12), false);
  assert.equal(isValidNumericSuggestion('012345', 12), false);

  const mixedSuggestions = ['012345678901', '01234567890a', '882349102384', '0123456789012'];
  assert.deepEqual(filterMatchingTinSuggestions(mixedSuggestions, '01-23', 12), ['012345678901']);
  assert.deepEqual(filterMatchingTinSuggestions(mixedSuggestions, '0123', 13), ['0123456789012']);
  assert.deepEqual(filterMatchingTinSuggestions(mixedSuggestions, '', 12), []);

  assert.equal(maskTinForDisplay('012345678901'), '012*********');
  assert.equal(maskTinForDisplay('12'), '**');
  assert.equal(maskTinForDisplay(''), '');

  assert.deepEqual(validateIdentifierLength('0123456789012', 13), { valid: true });
  assert.deepEqual(validateIdentifierLength('012345678901', 13), { valid: false, reason: 'format' });
  assert.deepEqual(validateIdentifierLength('', 12), { valid: false, reason: 'required' });
});

test('AppTinInput, AppTinLookupField, and AppTinResultCard enforce Cycle 07 masking, reveal defaults, and helper associations', () => {
  for (const mode of ['light', 'dark'] as const) {
    for (const lang of ['en', 'bn'] as const) {
      const segmented12Html = renderWithProviders(
        <AppTinInput
          value="012345"
          onChange={() => {}}
          required
          helperText="Enter 12 digits"
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      assert.match(segmented12Html, /data-testid="taxpayer-tin-digits"/);
      assert.match(segmented12Html, /inputmode="numeric"/i);
      assert.match(segmented12Html, /value="012345"/);
      assert.match(segmented12Html, /Enter 12 digits/);

      const plainMaskedReadOnlyHtml = renderWithProviders(
        <AppTinInput
          segmented={false}
          masked
          readOnly
          value="012345678901"
          onChange={() => {}}
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      assert.match(plainMaskedReadOnlyHtml, /type="password"/);
      assert.match(plainMaskedReadOnlyHtml, /Mui-readOnly/);
      assert.match(plainMaskedReadOnlyHtml, /readonly=""/i);

      const segmented13Html = renderWithProviders(
        <AppTinInput value="00123" onChange={() => {}} maxLength={13} readOnly error />,
        mode,
        lang
      );
      assert.match(segmented13Html, /maxlength="13"/i);
      assert.match(segmented13Html, /aria-readonly="true"/);
      assert.match(segmented13Html, /aria-invalid="true"/);

      const lookupHtml = renderWithProviders(
        <AppTinLookupField
          id="tin-lookup-test"
          heading="Verify TIN"
          value="012345678901"
          onChange={() => {}}
          onSearch={() => {}}
          canSearch
          error
          helperText="TIN lookup error"
          suggestedTins={['012345678901']}
          card
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      assert.match(lookupHtml, /data-testid="shared-taxpayer-tin-lookup"/);
      assert.match(lookupHtml, /aria-describedby="tin-lookup-test-helper"/);
      assert.match(lookupHtml, /id="tin-lookup-test-helper"/);
      assert.match(lookupHtml, /role="alert"/);
      assert.match(lookupHtml, new RegExp(lang === 'bn' ? 'খুঁজুন' : 'Search'));
      assert.match(lookupHtml, /role="combobox"/);

      const defaultLockedResultHtml = renderWithProviders(
        <AppTinResultCard
          tin="012345678901"
          name="Sample Record"
          classification="Individual"
          testId="taxpayer-tin-result"
          canAdd
          onAdd={() => {}}
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      assert.match(defaultLockedResultHtml, /data-testid="taxpayer-tin-result"/);
      assert.match(defaultLockedResultHtml, /012\*{9}/);
      assert.doesNotMatch(defaultLockedResultHtml, /টিআইএন দেখুন|Reveal TIN/);
      assert.match(defaultLockedResultHtml, new RegExp(lang === 'bn' ? 'করদাতা যোগ করুন' : 'Add taxpayer'));

      const authorizedResultHtml = renderWithProviders(
        <AppTinResultCard
          tin="012345678901"
          name="Sample Record"
          allowRevealTin
          testId="taxpayer-tin-result-auth"
          publicCapability="public_help_question"
        />,
        mode,
        lang
      );
      assert.match(authorizedResultHtml, new RegExp(lang === 'bn' ? 'টিআইএন দেখুন' : 'Reveal TIN'));
    }
  }
});
