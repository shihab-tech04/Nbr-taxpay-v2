import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { getTheme } from '../../design-system/theme';
import { AppProvider } from '../../shared/AppContext';
import {
  getNoticesForTin,
  ISOLATED_SECONDARY_USER,
  lookupTinIdentity,
  resolveAccountStorageScope,
  sanitizeReturnPath,
  verifyDemoCredentials,
  verifySimulationOtp,
} from './accountAdapter';
import { LoginView } from './LoginView';
import { FirstLoginNoticeDialog } from '../../components/account/FirstLoginNoticeDialog';

test('lookupTinIdentity fails closed on unknown TINs and restores * and @****.*** masks', () => {
  assert.equal(lookupTinIdentity('12345'), null);
  assert.equal(lookupTinIdentity('998877665544'), null);
  assert.deepEqual(getNoticesForTin('998877665544'), []);

  const primary = lookupTinIdentity('user1');
  assert.ok(primary);
  assert.equal(primary.tin, '882349102384');
  assert.equal(primary.maskedSms, '+880**********');
  assert.equal(primary.maskedEmail, 'ra***********@****.***');
  assert.doesNotMatch(primary.maskedNameHint, /Rafiqul/);

  const secondary = lookupTinIdentity(ISOLATED_SECONDARY_USER.tin);
  assert.ok(secondary);
  assert.equal(secondary.profile.name, 'Tasnim Chowdhury');
  assert.notDeepEqual(getNoticesForTin('882349102384'), getNoticesForTin(ISOLATED_SECONDARY_USER.tin));

  assert.ok(verifyDemoCredentials('user1', 'user1'));
  assert.ok(verifyDemoCredentials('user2', 'user2'));
  assert.equal(verifyDemoCredentials('user1', 'wrong'), null);
  assert.equal(verifyDemoCredentials('998877665544', '998877665544'), null);
});

test('resolveAccountStorageScope isolates signed-in users and walk-in session completely', () => {
  assert.equal(resolveAccountStorageScope(false, '882349102384'), 'walkin');
  assert.equal(resolveAccountStorageScope(true, '882349102384'), 'acct_882349102384');
  assert.equal(resolveAccountStorageScope(true, '112233445566'), 'acct_112233445566');
  assert.notEqual(
    resolveAccountStorageScope(true, '882349102384'),
    resolveAccountStorageScope(true, '112233445566')
  );
});

test('verifySimulationOtp and sanitizeReturnPath enforce validation and open-redirect protection', () => {
  assert.deepEqual(verifySimulationOtp('123'), { valid: false, reason: 'format' });
  assert.deepEqual(verifySimulationOtp('999999'), { valid: false, reason: 'mismatch' });
  assert.deepEqual(verifySimulationOtp('123456'), { valid: true });
  assert.deepEqual(verifySimulationOtp('111111'), { valid: true });

  assert.equal(sanitizeReturnPath('/profile'), '/profile');
  assert.equal(sanitizeReturnPath('/certificates'), '/certificates');
  assert.equal(sanitizeReturnPath('https://evil.example.com'), '/dashboard');
  assert.equal(sanitizeReturnPath('//evil.example.com'), '/dashboard');
  assert.equal(sanitizeReturnPath('/login'), '/dashboard');
  assert.equal(sanitizeReturnPath(null), '/dashboard');
});

test('LoginView starts unprefilled with password/recovery/walk-in and FirstLoginNoticeDialog queues notices', async () => {
  await i18n.changeLanguage('en');
  const loginHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <AppProvider>
        <ThemeProvider theme={getTheme('light')}>
          <MemoryRouter initialEntries={['/login?returnTo=/profile']}>
            <LoginView />
          </MemoryRouter>
        </ThemeProvider>
      </AppProvider>
    </I18nextProvider>
  );
  assert.doesNotMatch(loginHtml, /value="882349102384"/);
  assert.match(loginHtml, /TIN or User ID/);
  assert.match(loginHtml, /Recover Account/);
  assert.match(loginHtml, /Continue with OTP/);
  assert.match(loginHtml, /Continue as Walk-In Taxpayer/);

  const notices = getNoticesForTin('882349102384');
  const noticeHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={getTheme('light')}>
        <FirstLoginNoticeDialog disablePortal notices={notices} onAcknowledge={() => {}} />
      </ThemeProvider>
    </I18nextProvider>
  );
  assert.match(noticeHtml, /First-Login Account Notice/);
  assert.match(noticeHtml, /Acknowledge &amp; Next/);
});
