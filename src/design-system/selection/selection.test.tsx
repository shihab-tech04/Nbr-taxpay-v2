import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { isFieldLockedByPreviewPolicy } from '../../shared/previewPolicy';
import { getTheme } from '../theme';
import {
  AppCheckbox,
  AppRadioCard,
  AppRadioGroup,
  AppSwitch,
  createBlockedSelectionHandlers,
  isSelectionInteractionBlocked,
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

test('AppCheckbox supports checked, indeterminate, readOnly, error, description, EN/BN, and light/dark themes', () => {
  for (const mode of ['light', 'dark'] as const) {
    for (const lang of ['en', 'bn'] as const) {
      const labelText = lang === 'bn' ? 'সুবিধাভোগীর জন্য প্রদান' : 'Pay for beneficiary';
      const checkedHtml = renderWithProviders(
        <AppCheckbox
          label={labelText}
          description="Verify relationship"
          checked
          onChange={() => {}}
          helperText="Required for third-party payment"
        />,
        mode,
        lang
      );
      assert.match(checkedHtml, /type="checkbox"/);
      assert.match(checkedHtml, /checked=""/);
      assert.match(checkedHtml, new RegExp(labelText));
      assert.match(checkedHtml, /Verify relationship/);
      assert.match(checkedHtml, /aria-describedby/);

      const indeterminateHtml = renderWithProviders(
        <AppCheckbox label="Select all" indeterminate readOnly error helperText="Selection invalid" />,
        mode,
        lang
      );
      assert.match(indeterminateHtml, /Mui-readOnly/);
      assert.match(indeterminateHtml, /aria-readonly="true"/);
      assert.match(indeterminateHtml, /aria-invalid="true"/);
      assert.match(indeterminateHtml, /Selection invalid/);

      const uncontrolledReadOnlyHtml = renderWithProviders(
        <AppCheckbox label="Uncontrolled locked" defaultChecked readOnly />,
        mode,
        lang
      );
      assert.match(uncontrolledReadOnlyHtml, /checked=""/);
      assert.match(uncontrolledReadOnlyHtml, /aria-readonly="true"/);
    }
  }
});

test('AppRadioGroup and AppRadioCard render accessible radio options, columns, palettes, and no nested interactive tags', () => {
  for (const mode of ['light', 'dark'] as const) {
    const groupHtml = renderWithProviders(
      <AppRadioGroup
        label="Payment Channel"
        value="bKash"
        onChange={() => {}}
        columns={3}
        palette="home"
        helperText="Choose a payment gateway"
      >
        <AppRadioCard value="bKash" title="bKash" description="Mobile financial service" />
        <AppRadioCard value="Nagad" title="Nagad" description="Mobile financial service" />
        <AppRadioCard value="CityBank" title="CityBank" description="Online banking" />
      </AppRadioGroup>,
      mode
    );
    assert.match(groupHtml, /role="radiogroup"/);
    assert.match(groupHtml, /Payment Channel/);
    assert.match(groupHtml, /Choose a payment gateway/);
    const radioMatches = groupHtml.match(/type="radio"/g) ?? [];
    assert.equal(radioMatches.length, 3);
    assert.match(groupHtml, /checked=""/);
    const labelMatches = groupHtml.match(/<label\b/g) ?? [];
    assert.equal(labelMatches.length, 3);
    assert.doesNotMatch(groupHtml, /<button\b/);

    const optionsGroupHtml = renderWithProviders(
      <AppRadioGroup
        label="Mode"
        orientation="horizontal"
        defaultValue="a"
        readOnly
        error
        helperText="Choose mode"
        options={[
          { value: 'a', label: 'Option A', description: 'First option' },
          { value: 'b', label: 'Option B', disabled: true },
        ]}
      />,
      mode
    );
    assert.match(optionsGroupHtml, /Mui-readOnly/);
    assert.match(optionsGroupHtml, /aria-readonly="true"/);
    assert.match(optionsGroupHtml, /checked=""/);
    assert.match(optionsGroupHtml, /aria-invalid="true"/);
    assert.match(optionsGroupHtml, /Option A/);
    assert.match(optionsGroupHtml, /Option B/);
  }
});

test('AppSwitch renders switch role, label placements, readOnly, disabled, and preview policy lock', () => {
  for (const mode of ['light', 'dark'] as const) {
    for (const lang of ['en', 'bn'] as const) {
      const labelText = lang === 'bn' ? 'ডার্ক মোড' : 'Dark Mode';
      const switchHtml = renderWithProviders(
        <AppSwitch
          label={labelText}
          description="Use high-contrast dark theme"
          checked
          labelPlacement="start"
          onChange={() => {}}
        />,
        mode,
        lang
      );
      assert.match(switchHtml, /role="switch"/);
      assert.match(switchHtml, /checked=""/);
      assert.match(switchHtml, /MuiFormControlLabel-labelPlacementStart/);
      assert.match(switchHtml, new RegExp(labelText));
    }

    const uncontrolledReadOnlyHtml = renderWithProviders(
      <AppSwitch label="Uncontrolled switch" defaultChecked readOnly helperText="Protected" />,
      mode
    );
    assert.match(uncontrolledReadOnlyHtml, /checked=""/);
    assert.match(uncontrolledReadOnlyHtml, /Mui-readOnly/);
    assert.match(uncontrolledReadOnlyHtml, /aria-readonly="true"/);

    const lockedHtml = renderWithProviders(
      <AppSwitch label="Locked Switch" readOnly disabled helperText="Locked" />,
      mode
    );
    assert.match(lockedHtml, /disabled=""/);
    assert.match(lockedHtml, /Locked/);
  }

  assert.equal(isFieldLockedByPreviewPolicy({ publicCapability: 'none' }, true), true);
  assert.equal(isFieldLockedByPreviewPolicy({ publicCapability: 'none' }, false), false);
});

test('Selection guards block mouse clicks and Space/Enter/Arrow keys when disabled or readOnly without blocking Tab', () => {
  assert.equal(isSelectionInteractionBlocked(false, false), false);
  assert.equal(isSelectionInteractionBlocked(true, false), true);
  assert.equal(isSelectionInteractionBlocked(false, true), true);

  const radioKeys = [' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  const blocked = createBlockedSelectionHandlers(true, radioKeys);

  let prevented = 0;
  let stopped = 0;
  blocked.handleClick({
    preventDefault: () => { prevented += 1; },
    stopPropagation: () => { stopped += 1; },
  });
  assert.equal(prevented, 1);
  assert.equal(stopped, 1);

  for (const key of radioKeys) {
    prevented = 0;
    stopped = 0;
    blocked.handleKeyDown({
      key,
      preventDefault: () => { prevented += 1; },
      stopPropagation: () => { stopped += 1; },
    });
    assert.equal(prevented, 1, `Expected key '${key}' to be prevented when blocked`);
    assert.equal(stopped, 1, `Expected key '${key}' propagation to stop when blocked`);
  }

  prevented = 0;
  stopped = 0;
  blocked.handleKeyDown({
    key: 'Tab',
    preventDefault: () => { prevented += 1; },
    stopPropagation: () => { stopped += 1; },
  });
  assert.equal(prevented, 0);
  assert.equal(stopped, 0);

  const unblocked = createBlockedSelectionHandlers(false, radioKeys);
  unblocked.handleClick({
    preventDefault: () => { prevented += 1; },
    stopPropagation: () => { stopped += 1; },
  });
  unblocked.handleKeyDown({
    key: ' ',
    preventDefault: () => { prevented += 1; },
    stopPropagation: () => { stopped += 1; },
  });
  assert.equal(prevented, 0);
  assert.equal(stopped, 0);
});
