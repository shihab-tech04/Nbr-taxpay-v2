import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { AppProvider } from '../../shared/AppContext';
import type { UserProfile } from '../../types/tax';
import { PROFILE_24_FIELD_MANIFEST } from './profileTypes';
import { SAMPLE_TAXPAYER_PROFILE_24 } from './profileData';
import {
  formatProfileValue,
  isSensitiveMaskValue,
  maskProfileEmail,
  maskProfilePhone,
  maskProfileTin,
  resolveTaxpayerProfile,
} from './profileUtils';
import { ProfileView } from './ProfileView';
import { MaskedProfileValue } from './components/MaskedProfileValue';

test('PROFILE_24_FIELD_MANIFEST matches exact 24 unique keys, Previous TIN first, and certificate sources', () => {
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
      'previousTin',
      'certificateIssuedOn',
      'certificateLastUpdatedOn',
      'issuingOfficer',
      'taxOfficeAddress',
      'taxOfficePhone',
    ],
  });

  const byKey = new Map(PROFILE_24_FIELD_MANIFEST.map((f) => [f.key, f]));
  assert.equal(byKey.get('taxpayerStatus')?.source, 'certificate');
  assert.equal(byKey.get('registeredAddress')?.source, 'certificate');
  assert.equal(byKey.get('currentAddress')?.source, 'certificate');
  assert.equal(byKey.get('taxpayerName')?.labelBn, 'নাম');
  assert.equal(byKey.get('tinType')?.labelBn, 'টিআইএন ধরন');

  for (const field of PROFILE_24_FIELD_MANIFEST) {
    assert.ok(SAMPLE_TAXPAYER_PROFILE_24[field.key].length > 0);
  }
});

test('Masking follows original thresholds (>=8 TIN, >=6 phone), preserves separators with *, and hides email domains', () => {
  assert.equal(isSensitiveMaskValue('1234567', 'tin'), false);
  assert.equal(isSensitiveMaskValue('12345678', 'tin'), true);
  assert.equal(isSensitiveMaskValue('12345', 'mobileNumber'), false);
  assert.equal(isSensitiveMaskValue('123456', 'mobileNumber'), true);

  assert.equal(maskProfileTin('882349102384'), '882*********');
  assert.equal(maskProfileTin('6543210987'), '654*******');
  assert.equal(maskProfileTin('123-45678'), '123-*****');
  assert.equal(maskProfileTin('N/A'), 'N/A');
  assert.equal(maskProfilePhone('+8801712345678'), '+880**********');
  assert.equal(maskProfilePhone('+880-2-9355555'), '+880-*-*******');
  assert.equal(maskProfileEmail('rafiqul.islam@example.com'), 'ra***********@****.***');

  assert.equal(formatProfileValue('tin', '882349102384', false), '882*********');
  assert.equal(formatProfileValue('previousTin', '6543210987', false), '654*******');
  assert.equal(formatProfileValue('taxOfficePhone', '+880-2-9355555', false), '+880-*-*******');
  assert.equal(formatProfileValue('tin', '882349102384', true), '882349102384');
});

test('resolveTaxpayerProfile blocks signed-out access and isolates unlinked secondary accounts', () => {
  const secondary: UserProfile = {
    tin: '112233445566',
    name: 'Tasnim Chowdhury',
    circle: 'Circle-019',
    zone: 'Tax Zone-02, Chattogram',
    email: 'tasnim@chattogram.org',
    phone: '+8801911223344',
    registeredDate: '2024-02-11',
    taxpayerType: 'Individual',
  };

  assert.equal(resolveTaxpayerProfile(secondary, false, false), null);
  assert.equal(resolveTaxpayerProfile(secondary, true, true), null);

  const resolved = resolveTaxpayerProfile(secondary, true, false);
  assert.ok(resolved);
  assert.equal(resolved.isSampleIdentity, false);
  assert.equal(resolved.registrationNotLinked, true);
  assert.equal(resolved.profile.taxpayerName, 'Tasnim Chowdhury');
  assert.equal(resolved.profile.registeredAddress, '—');
  assert.equal(resolved.profile.previousTin, '—');
  assert.equal(resolved.profile.taxOfficePhone, '—');
});

test('MaskedProfileValue enforces profileContext on TIN copy and uses bilingual reveal aria labels', async () => {
  const tinMeta = PROFILE_24_FIELD_MANIFEST.find((f) => f.key === 'tin')!;
  await i18n.changeLanguage('bn');
  const bnHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <MaskedProfileValue meta={tinMeta} value="882349102384" identityKey="882349102384" canReveal={false} />
    </I18nextProvider>
  );
  assert.match(bnHtml, /882\*{9}/);
  assert.match(bnHtml, /aria-label="টিআইএন দেখুন"/);
  assert.doesNotMatch(bnHtml, /কপি করুন/);

  await i18n.changeLanguage('en');
  const enWithCopyHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <MaskedProfileValue meta={tinMeta} value="882349102384" identityKey="882349102384" canReveal profileContext />
    </I18nextProvider>
  );
  assert.match(enWithCopyHtml, /aria-label="Copy TIN"/);
});

test('ProfileView renders signed-out auth gate without leaking sample taxpayer data', async () => {
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

  assert.match(html, /data-testid="profile-auth-gate"/);
  assert.match(html, /Sign in to view your profile\./);
  assert.doesNotMatch(html, /Rafiqul/);
  assert.doesNotMatch(html, /882349102384/);
});
