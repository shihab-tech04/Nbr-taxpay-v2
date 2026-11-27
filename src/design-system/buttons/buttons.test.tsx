import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { isActionBlockedByPreviewPolicy } from '../../shared/previewPolicy';
import { getTheme } from '../theme';
import { buildDisabledLinkHandlers } from './buttonConfig';
import {
  AppButton,
  AppCardButton,
  AppIconButton,
  type ButtonGeometry,
  type ButtonPalette,
  type SecondarySurface,
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

test('AppButton renders primary and secondary action hierarchies with orthogonal modifiers in light and dark themes', () => {
  const primaryIntents = ['default', 'confirm', 'destructive'] as const;
  const secondaryIntents = ['default', 'destructive'] as const;
  const palettes: readonly ButtonPalette[] = ['brand', 'home'];
  const surfaces: readonly SecondarySurface[] = ['outlined', 'soft', 'ghost'];
  const geometries: readonly ButtonGeometry[] = ['standard', 'hero', 'compact', 'pill'];

  for (const mode of ['light', 'dark'] as const) {
    for (const palette of palettes) {
      for (const intent of primaryIntents) {
        const html = renderWithTheme(
          <AppButton actionType="primary" intent={intent} palette={palette}>
            {`primary-${intent}-${palette}`}
          </AppButton>,
          mode
        );
        assert.match(html, new RegExp(`>primary-${intent}-${palette}<`));
        assert.match(html, /type="button"/);
      }

      for (const intent of secondaryIntents) {
        const html = renderWithTheme(
          <AppButton actionType="secondary" intent={intent} palette={palette}>
            {`secondary-${intent}-${palette}`}
          </AppButton>,
          mode
        );
        assert.match(html, new RegExp(`>secondary-${intent}-${palette}<`));
        assert.match(html, /type="button"/);
      }
    }

    for (const surface of surfaces) {
      for (const geometry of geometries) {
        const html = renderWithTheme(
          <AppButton actionType="secondary" surface={surface} geometry={geometry} palette="home">
            {`${surface}-${geometry}`}
          </AppButton>,
          mode
        );
        assert.match(html, new RegExp(`>${surface}-${geometry}<`));
      }
    }
  }
});

test('AppButton enforces loading state, duplicate-submission prevention, and disabled link/button contracts', () => {
  const submitHtml = renderWithTheme(
    <AppButton actionType="primary" intent="confirm" type="submit">
      Confirm Payment
    </AppButton>
  );
  assert.match(submitHtml, /type="submit"/);

  const loadingHtml = renderWithTheme(
    <AppButton actionType="primary" loading loadingLabel="Submitting...">
      Submit
    </AppButton>
  );
  assert.match(loadingHtml, /aria-busy="true"/);
  assert.match(loadingHtml, /disabled=""/);
  assert.match(loadingHtml, /Submitting\.\.\./);
  assert.match(loadingHtml, /role="progressbar"/);

  const disabledAnchorHtml = renderWithTheme(
    <AppButton actionType="secondary" href="https://nbr.gov.bd/" disabled>
      NBR Disabled
    </AppButton>
  );
  assert.match(disabledAnchorHtml, /<a\b/);
  assert.match(disabledAnchorHtml, /aria-disabled="true"/);
  assert.match(disabledAnchorHtml, /tabindex="-1"/i);
  assert.doesNotMatch(disabledAnchorHtml, /href="https:\/\/nbr\.gov\.bd\/"/);

  const routerLinkHtml = renderWithTheme(
    <AppButton actionType="primary" to="/login">
      Sign In
    </AppButton>
  );
  assert.match(routerLinkHtml, /<a\b/);
  assert.match(routerLinkHtml, /href="\/login"/);

  const externalLinkHtml = renderWithTheme(
    <AppButton actionType="secondary" surface="ghost" href="https://nbr.gov.bd/" target="_blank">
      NBR Portal
    </AppButton>
  );
  assert.match(externalLinkHtml, /<a\b/);
  assert.match(externalLinkHtml, /rel="noopener noreferrer"/);
});

test('Disabled link handlers block mouse clicks and Enter/Space keyboard activation', () => {
  let clickCount = 0;
  let keyCount = 0;
  const disabledHandlers = buildDisabledLinkHandlers(
    true,
    () => {
      clickCount += 1;
    },
    () => {
      keyCount += 1;
    }
  );

  let prevented = false;
  let stopped = false;
  disabledHandlers.handleClick({
    preventDefault: () => {
      prevented = true;
    },
    stopPropagation: () => {
      stopped = true;
    },
  } as unknown as React.MouseEvent<HTMLAnchorElement>);
  assert.equal(prevented, true);
  assert.equal(stopped, true);
  assert.equal(clickCount, 0);

  for (const key of ['Enter', ' ']) {
    let keyPrevented = false;
    let keyStopped = false;
    disabledHandlers.handleKeyDown({
      key,
      preventDefault: () => {
        keyPrevented = true;
      },
      stopPropagation: () => {
        keyStopped = true;
      },
    } as unknown as React.KeyboardEvent<HTMLAnchorElement>);
    assert.equal(keyPrevented, true);
    assert.equal(keyStopped, true);
    assert.equal(keyCount, 0);
  }

  const enabledHandlers = buildDisabledLinkHandlers(
    false,
    () => {
      clickCount += 1;
    },
    () => {
      keyCount += 1;
    }
  );
  enabledHandlers.handleClick({
    preventDefault: () => {},
    stopPropagation: () => {},
  } as unknown as React.MouseEvent<HTMLAnchorElement>);
  enabledHandlers.handleKeyDown({
    key: 'Enter',
    preventDefault: () => {},
    stopPropagation: () => {},
  } as unknown as React.KeyboardEvent<HTMLAnchorElement>);
  assert.equal(clickCount, 1);
  assert.equal(keyCount, 1);
});

test('AppIconButton, AppCardButton, and preview policy enforce accessibility and restricted actions', () => {
  for (const mode of ['light', 'dark'] as const) {
    const iconHtml = renderWithTheme(
      <AppIconButton aria-label="Delete item" intent="destructive" surface="tinted">
        <span>X</span>
      </AppIconButton>,
      mode
    );
    assert.match(iconHtml, /aria-label="Delete item"/);
    assert.match(iconHtml, /type="button"/);

    const loadingIconHtml = renderWithTheme(
      <AppIconButton
        aria-label="Submitting"
        palette="home"
        surface="submit"
        publicCapability="public_help_question"
        loading
      >
        <span>Go</span>
      </AppIconButton>,
      mode
    );
    assert.match(loadingIconHtml, /aria-busy="true"/);
    assert.match(loadingIconHtml, /disabled=""/);
    assert.match(loadingIconHtml, /role="progressbar"/);

    const cardHtml = renderWithTheme(
      <AppCardButton selected>
        <div>Travel Tax</div>
      </AppCardButton>,
      mode
    );
    assert.match(cardHtml, /aria-pressed="true"/);
  }

  assert.equal(isActionBlockedByPreviewPolicy({ previewRestricted: true }, true), true);
  assert.equal(
    isActionBlockedByPreviewPolicy({ publicCapability: 'public_help_question' }, true),
    false
  );
  assert.equal(isActionBlockedByPreviewPolicy({ publicCapability: 'none' }, true), true);
});
