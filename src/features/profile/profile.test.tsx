import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { AppProvider } from '../../shared/AppContext';
import { PROFILE_24_FIELD_MANIFEST } from './profileTypes';
import { DEFAULT_TAXPAYER_PROFILE_24 } from './profileData';
import { formatProfileValue, maskProfileEmail, maskProfilePhone, maskProfileTin } from './profileUtils';
import { ProfileView } from './ProfileView';

test('PROFILE_24_FIELD_MANIFEST contains exact 24 unique keys across 6 approved groups', () => {
  assert.equal(PROFILE_24_FIELD_MANIFEST.length, 24);
  const uniqueKeys = new Set(PROFILE_24_FIELD_MANIFEST.map((f) => f.key));
  assert.equal(uniqueKeys.size, 24);

  const counts = PROFILE_24_FIELD_MANIFEST.reduce<Record<string, number>>((acc, item) => {
    acc[item.group] = (acc[item.group] ?? 0) + 1;
    return acc;
  }, {});
  assert.deepEqual(counts, {
    identity: 2,
    summary: 4,
    personal: 4,
    contact: 4,
    jurisdiction: 5,
    certificate: 5,
  });

  // Verify every manifest key has populated default sample data
  for (const field of PROFILE_24_FIELD_MANIFEST) {
    assert.ok(typeof DEFAULT_TAXPAYER_PROFILE_24[field.key] === 'string');
    assert.ok(DEFAULT_TAXPAYER_PROFILE_24[field.key].length > 0);
  }
});

test('Profile masking helpers protect sensitive fields by default and reveal when authorized', () => {
  assert.equal(maskProfileTin('882349102384'), '882 •••• •384');
  assert.equal(maskProfilePhone('+8801712345678'), '+8801••••678');
  assert.equal(maskProfileEmail('rafiqul.islam@example.com'), 'ra••••@example.com');

  assert.equal(formatProfileValue('tin', '882349102384', false), '882 •••• •384');
  assert.equal(formatProfileValue('tin', '882349102384', true), '882349102384');
});

test('ProfileView renders all 24 fields with masked defaults and Sample taxpayer label', async () => {
  await i18n.changeLanguage('en');
  const html = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <AppProvider>
        <MemoryRouter initialEntries={['/profile']}>
          <ProfileView />
        </MemoryRouter>
      </AppProvider>
    </I18nextProvider>
  );

  assert.match(html, /Sample taxpayer/);
  assert.doesNotMatch(html, /Verified Taxpayer/);
  assert.doesNotMatch(html, /882349102384/);
  assert.match(html, /882 •••• •384/);

  for (const field of PROFILE_24_FIELD_MANIFEST) {
    assert.match(html, new RegExp(`data-testid="profile-field-${field.key}"`));
  }
});
