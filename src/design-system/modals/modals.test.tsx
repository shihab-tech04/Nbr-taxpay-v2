import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { AppDialog } from './AppDialog';
import { AppDrawer } from './AppDrawer';
import { AppBottomSheet } from './AppBottomSheet';
import { AppConfirmDialog } from './AppConfirmDialog';

test('AppDialog, AppDrawer, and AppBottomSheet render correctly when open and return null when closed', () => {
  const closedDialog = renderToStaticMarkup(
    <AppDialog open={false} onClose={() => {}} title="Dialog">
      <p>Content</p>
    </AppDialog>
  );
  assert.doesNotMatch(closedDialog, /Content/);
  assert.doesNotMatch(closedDialog, /role="dialog"/);

  const openDialog = renderToStaticMarkup(
    <AppDialog
      open
      disablePortal
      id="custom-test-dialog"
      onBack={() => {}}
      onClose={() => {}}
      title="Test Dialog"
      subtitle="Dialog Subtitle"
    >
      <p>Dialog Body</p>
    </AppDialog>
  );
  assert.match(openDialog, /Test Dialog/);
  assert.match(openDialog, /Dialog Subtitle/);
  assert.match(openDialog, /Dialog Body/);
  assert.match(openDialog, /aria-labelledby="custom-test-dialog-title"/);
  assert.match(openDialog, /aria-label="Go back"/);

  const openDrawer = renderToStaticMarkup(
    <AppDrawer
      open
      disablePortal
      id="custom-test-drawer"
      onBack={() => {}}
      onClose={() => {}}
      title="Test Drawer"
      subtitle="Drawer Subtitle"
    >
      <p>Drawer Body</p>
    </AppDrawer>
  );
  assert.match(openDrawer, /Test Drawer/);
  assert.match(openDrawer, /Drawer Subtitle/);
  assert.match(openDrawer, /Drawer Body/);
  assert.match(openDrawer, /id="custom-test-drawer-title"/);
  assert.match(openDrawer, /aria-label="Go back"/);

  const openSheet = renderToStaticMarkup(
    <AppBottomSheet open disablePortal onBack={() => {}} onClose={() => {}} title="Test Sheet" subtitle="Sheet Subtitle">
      <p>Sheet Body</p>
    </AppBottomSheet>
  );
  assert.match(openSheet, /Test Sheet/);
  assert.match(openSheet, /Sheet Subtitle/);
  assert.match(openSheet, /Sheet Body/);
  assert.match(openSheet, /aria-label="Go back"/);
  assert.match(openSheet, /safe-area-inset-bottom/);
});

test('AppConfirmDialog renders confirmation and destructive action variants', async () => {
  await i18n.changeLanguage('en');
  const confirmHtml = renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <AppConfirmDialog
        open
        disablePortal
        id="delete-confirm"
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirm Delete"
        message="Are you sure you want to delete this beneficiary?"
        confirmLabel="Yes, Delete"
        intent="destructive"
      />
    </I18nextProvider>
  );
  assert.match(confirmHtml, /Confirm Delete/);
  assert.match(confirmHtml, /Are you sure you want to delete this beneficiary\?/);
  assert.match(confirmHtml, /Yes, Delete/);
  assert.match(confirmHtml, /aria-labelledby="delete-confirm-title"/);
});
