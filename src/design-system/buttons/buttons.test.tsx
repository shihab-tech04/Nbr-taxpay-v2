import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '../theme';
import {
  AppButton,
  AppCardButton,
  AppIconButton,
  type ButtonTone,
} from './index';

function renderWithTheme(
  node: React.ReactElement,
  mode: 'light' | 'dark' = 'light'
): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <ThemeProvider theme={getTheme(mode)}>{node}</ThemeProvider>
    </MemoryRouter>
  );
}

test('AppButton renders all semantic tones cleanly across light and dark themes', () => {
  const tones: readonly ButtonTone[] = [
    'primary',
    'secondary',
    'neutral',
    'danger',
    'confirm',
    'ghost',
    'hero',
    'heroSecondary',
    'homeOutlined',
    'homeSoft',
  ];

  for (const mode of ['light', 'dark'] as const) {
    for (const tone of tones) {
      const html = renderWithTheme(<AppButton tone={tone}>{tone}</AppButton>, mode);
      assert.match(html, new RegExp(`>${tone}<`));
      assert.match(html, /type="button"/);
    }
  }
});

test('AppButton enforces loading state, type semantics, and router/external link semantics', () => {
  const submitHtml = renderWithTheme(
    <AppButton type="submit" tone="confirm">
      Confirm Payment
    </AppButton>
  );
  assert.match(submitHtml, /type="submit"/);

  const loadingHtml = renderWithTheme(
    <AppButton loading loadingLabel="Submitting...">
      Submit
    </AppButton>
  );
  assert.match(loadingHtml, /aria-busy="true"/);
  assert.match(loadingHtml, /disabled=""/);
  assert.match(loadingHtml, /Submitting\.\.\./);
  assert.match(loadingHtml, /role="progressbar"/);

  const routerLinkHtml = renderWithTheme(
    <AppButton tone="primary" to="/login">
      Sign In
    </AppButton>
  );
  assert.match(routerLinkHtml, /<a\b/);
  assert.match(routerLinkHtml, /href="\/login"/);

  const externalLinkHtml = renderWithTheme(
    <AppButton tone="ghost" href="https://nbr.gov.bd/" target="_blank">
      NBR Portal
    </AppButton>
  );
  assert.match(externalLinkHtml, /<a\b/);
  assert.match(externalLinkHtml, /rel="noopener noreferrer"/);
});

test('AppIconButton requires aria-label and supports loading and tones', () => {
  for (const mode of ['light', 'dark'] as const) {
    const iconHtml = renderWithTheme(
      <AppIconButton aria-label="Delete item" tone="danger">
        <span>X</span>
      </AppIconButton>,
      mode
    );
    assert.match(iconHtml, /aria-label="Delete item"/);
    assert.match(iconHtml, /type="button"/);

    const loadingIconHtml = renderWithTheme(
      <AppIconButton aria-label="Submitting" tone="homeSubmit" loading>
        <span>Go</span>
      </AppIconButton>,
      mode
    );
    assert.match(loadingIconHtml, /aria-busy="true"/);
    assert.match(loadingIconHtml, /disabled=""/);
    assert.match(loadingIconHtml, /role="progressbar"/);
  }
});

test('AppCardButton renders pressed state and disabled styling across light and dark themes', () => {
  for (const mode of ['light', 'dark'] as const) {
    const selectedHtml = renderWithTheme(
      <AppCardButton selected>
        <div>bKash</div>
      </AppCardButton>,
      mode
    );
    assert.match(selectedHtml, /aria-pressed="true"/);
    assert.match(selectedHtml, /type="button"/);

    const disabledHtml = renderWithTheme(
      <AppCardButton disabled>
        <div>Travel Tax</div>
      </AppCardButton>,
      mode
    );
    assert.match(disabledHtml, /disabled=""/);
  }
});
