import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { getTheme } from '../design-system/theme';
import { AppDateLocalizationProvider } from '../design-system/dates';
import i18n from '../i18n/i18n';
import { AppProvider } from './AppContext';
import { getNoticesForTin } from './accountSession';
import { buildPaymentNotification, prependScopedNotification } from './domainNotifications';
import { getSeedForScope } from './scopedDomainSeeds';
import { createExperimentalTransaction } from '../shared/mockLedgerAdapter';
import { NotificationsView } from '../features/notifications/NotificationsView';
import { NotificationItemCard } from '../features/notifications/NotificationItemCard';

function renderWithProviders(node: React.ReactElement): string {
  void i18n.changeLanguage('en');
  return renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={getTheme('light')}>
        <AppDateLocalizationProvider>{node}</AppDateLocalizationProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

test('notifications are isolated per account scope, ordered newest-first, and Zero-Tax builds clean notification copy', () => {
  const user1Seed = getSeedForScope('acct_882349102384');
  const user2Seed = getSeedForScope('acct_112233445566');
  const walkInSeed = getSeedForScope('walkin');

  assert.ok(user1Seed.notifications.length >= 2);
  assert.ok(user2Seed.notifications.length >= 1);
  assert.equal(walkInSeed.notifications.length, 0);
  assert.equal(user1Seed.notifications.every((n) => n.ownerScope === 'acct_882349102384'), true);
  assert.equal(user2Seed.notifications.every((n) => n.ownerScope === 'acct_112233445566'), true);

  const zeroTx = createExperimentalTransaction({
    taxpayerTin: '882349102384',
    taxpayerName: 'Md. Rafiqul Islam',
    ownerScope: 'acct_882349102384',
    originMode: 'signed_in',
    category: 'travel_tax',
    items: [{
      headId: 'h5', headCode: '1144102', headNameEn: 'Travel Tax - Land (••••0003)',
      headNameBn: 'ভ্রমণ কর', assessmentYear: '2026–27', amount: 0,
    }],
    totalAmount: 0,
    paymentChannel: 'Zero-Tax',
    status: 'Completed',
  });
  const zeroNotif = buildPaymentNotification('acct_882349102384', zeroTx);
  assert.match(zeroNotif.titleEn, /Zero-Tax Travel Assessment/);
  assert.doesNotMatch(zeroNotif.bodyEn, /bKash/);

  const merged = prependScopedNotification(user1Seed.notifications, zeroNotif);
  assert.equal(merged[0].id, zeroNotif.id);
  const deduped = prependScopedNotification(merged, zeroNotif);
  assert.equal(deduped.filter((n) => n.id === zeroNotif.id).length, 1);

  // First-login notice pools are isolated per TIN
  const u1Notices = getNoticesForTin('882349102384');
  const u2Notices = getNoticesForTin('112233445566');
  assert.notEqual(u1Notices[0].id, u2Notices[0].id);
});

test('NotificationsView enforces signed-out auth gate and NotificationItemCard renders unread/read & deep link', () => {
  const signedOutHtml = renderWithProviders(
    <AppProvider>
      <MemoryRouter initialEntries={['/notifications']}>
        <NotificationsView />
      </MemoryRouter>
    </AppProvider>
  );
  assert.match(signedOutHtml, /Please sign in with your TIN to view account notifications/);
  assert.doesNotMatch(signedOutHtml, /SOHO-2026-98124/);

  const unreadItem = getSeedForScope('acct_882349102384').notifications.find((n) => !n.readAt)!;
  const cardHtml = renderWithProviders(
    <NotificationItemCard item={unreadItem} onMarkRead={() => {}} onOpenTarget={() => {}} />
  );
  assert.match(cardHtml, /Mark as read/);
  assert.match(cardHtml, /View Details/);
});
