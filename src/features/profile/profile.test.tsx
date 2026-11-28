import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { AppProvider } from '../../shared/AppContext';
import { PROFILE_24_FIELD_MANIFEST } from './profileTypes';
import { SAMPLE_TAXPAYER_PROFILE_24 } from './profileData';
import {
  formatProfileValue,
  maskProfileEmail,
  maskProfilePhone,
  maskProfileTin,
  resolveTaxpayerProfile,
} from './profileUtils';
import { ProfileView } from './ProfileView';
import { MaskedProfileValue } from './components/MaskedProfileValue';

test('PROFILE_24_FIELD_MANIFEST matches exact 24 unique keys, groups, sources, and ordering', () => {
  assert.equal(PROFILE_24_FIELD_MANIFEST.length, 24);
  const uniqueKeys = new Set(PROFILE_24_FIELD_MANIFEST.map((f) => f.key));
  assert.equal(uniqueKeys.size, 24);

  const byGroup = PROFILE_24_FIELD_MANIFEST.reduce<Record<string, string[]>>((acc, item) => {
    acc[item.group] = [...(acc[item.group] ?? []), item.key];
    return acc;
  }, {});

  assert.deepEqual(byGroup, {
    identity: ['taxpayerName', 'tin'],
    summary: ['tinType', 'taxesCircle', 'registeredOn', 'lastLoginAt'],
    personal: ['taxpayerStatus', 'tinSubtype', 'userType', 'localTaxpayer'],
    contact: ['mobileNumber', 'emailAddress', 'registeredAddress', 'currentAddress'],
    jurisdiction: ['taxesZone', 'taxesRange', 'district', 'country'],
    certificate: [
      'certificateIssuedOn',
      'certificateLastUpdatedOn',
      'issuingOfficer',
      'taxOfficeAddress',
      'taxOfficePhone',
      'previousTin',
    ],
  });

  for (const field of PROFILE_24_FIELD_MANIFEST) {
    assert.ok(field.source === 'certificate' || field.source === 'tin_profile' || field.source === 'account');
    assert.ok(SAMPLE_TAXPAYER_PROFILE_24[field.key].length > 0);
  }
});

test('Masking follows first-3-digits-only for TIN/phones, masks email domains, and hides sensitive certificate refs', () => {
  assert.equal(maskProfileTin('882349102384'), '882•••••••••');
  assert.equal(maskProfileTin('6543210987'), '654•••••••');
  assert.equal(maskProfileTin('N/A'), 'N/A');
  assert.equal(maskProfilePhone('+8801712345678'), '880••••••••••');
  assert.equal(maskProfilePhone('+880-2-9355555'), '880••••••••');
  assert.equal(maskProfileEmail('rafiqul.islam@example.com'), 'ra••••@e••••.•••');

  assert.equal(formatProfileValue('tin', '882349102384', false), '882•••••••••');
  assert.equal(formatProfileValue('previousTin', '6543210987', false), '654•••••••');
  assert.equal(formatProfileValue('taxOfficePhone', '+880-2-9355555', false), '880••••••••');
  assert.equal(formatProfileValue('tin', '882349102384', true), '882349102384');
});

test('resolveTaxpayerProfile isolates fixtures from unrelated signed-in user identities', () => {
  const { profile, isSampleIdentity } = resolveTaxpayerProfile(
    {
      tin: '112233445566',
      name: 'Tasnim Chowdhury',
      circle: 'Circle-019',
      zone: 'Tax Zone-02, Chattogram',
      email: 'tasnim@chattogram.org',
      phone: '+8801911223344',
      registeredDate: '2024-02-11',
      taxpayerType: 'Individual',
    },
    true,
    false
  );

  assert.equal(isSampleIdentity, false);
  assert.equal(profile.taxpayerName, 'Tasnim Chowdhury');
  assert.equal(profile.registeredAddress, '—');
  assert.equal(profile.previousTin, '—');
  assert.equal(profile.taxOfficePhone, '—');
});

test('MaskedProfileValue resets reveal visibility cleanly when unauthorized and uses bilingual aria labels', async () => {
  const tinMeta = PROFILE_24_FIELD_MANIFEST.find((f) => f.key === 'tin')!;
  await i18n.changeLanguage('bn');
  const bnHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <MaskedProfileValue meta={tinMeta} value="882349102384" identityKey="882349102384" canReveal={false} />
    </I18nextProvider>
  );
  assert.match(bnHtml, /882•••••••••/);
  assert.match(bnHtml, /aria-label="টিআইএন দেখুন"/);
  await i18n.changeLanguage('en');
});

test('ProfileView renders exact 24 fields once each with zero duplicated Summary or Circle nodes', async () => {
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
  assert.doesNotMatch(html, /6543210987/);
  assert.doesNotMatch(html, /example\.com/);
  assert.match(html, /882•••••••••/);
  assert.match(html, /654•••••••/);
  assert.match(html, /ra••••@e••••\.•••/);
  assert.doesNotMatch(html, /Account &amp; Registration Summary/);

  for (const field of PROFILE_24_FIELD_MANIFEST) {
    const matches = html.match(new RegExp(`data-testid="profile-field-${field.key}"`, 'g')) ?? [];
    assert.equal(matches.length, 1, `Expected exactly 1 occurrence of ${field.key}`);
  }
});
