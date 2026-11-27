import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppDialog } from './AppDialog';
import { AppDrawer } from './AppDrawer';
import { AppBottomSheet } from './AppBottomSheet';

test('AppDialog, AppDrawer, and AppBottomSheet render correctly when open and return null when closed', () => {
  const closedDialog = renderToStaticMarkup(
    <AppDialog open={false} onClose={() => {}} title="Dialog">
      <p>Content</p>
    </AppDialog>
  );
  assert.equal(closedDialog, '');

  const openDialog = renderToStaticMarkup(
    <AppDialog open onClose={() => {}} title="Test Dialog">
      <p>Dialog Body</p>
    </AppDialog>
  );
  assert.match(openDialog, /Test Dialog/);
  assert.match(openDialog, /Dialog Body/);

  const openDrawer = renderToStaticMarkup(
    <AppDrawer open onClose={() => {}} title="Test Drawer">
      <p>Drawer Body</p>
    </AppDrawer>
  );
  assert.match(openDrawer, /Test Drawer/);
  assert.match(openDrawer, /Drawer Body/);

  const openSheet = renderToStaticMarkup(
    <AppBottomSheet open onClose={() => {}} title="Test Sheet">
      <p>Sheet Body</p>
    </AppBottomSheet>
  );
  assert.match(openSheet, /Test Sheet/);
  assert.match(openSheet, /Sheet Body/);
});
