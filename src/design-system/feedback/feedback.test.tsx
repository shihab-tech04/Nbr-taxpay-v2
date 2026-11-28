import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppSkeleton } from './AppSkeleton';
import { AppStateView } from './AppStateView';
import { AppToast } from './AppToast';

test('AppSkeleton renders requested variant and count', () => {
  const html = renderToStaticMarkup(<AppSkeleton variant="table-row" count={4} />);
  assert.match(html, /aria-busy="true"/);
  const pulseMatches = html.match(/animate-pulse/g) ?? [];
  assert.equal(pulseMatches.length, 4);
});

test('AppStateView renders error with retry button and empty/success states', () => {
  const errorHtml = renderToStaticMarkup(
    <AppStateView
      variant="error"
      title="Failed to load"
      description="Network timeout"
      onRetry={() => {}}
      retryLabel="Retry Now"
    />
  );
  assert.match(errorHtml, /role="alert"/);
  assert.match(errorHtml, /Failed to load/);
  assert.match(errorHtml, /Network timeout/);
  assert.match(errorHtml, /Retry Now/);

  const emptyHtml = renderToStaticMarkup(
    <AppStateView variant="empty" title="No items" />
  );
  assert.match(emptyHtml, /role="status"/);
  assert.match(emptyHtml, /No items/);
});

test('AppToast renders open alert message and returns empty when closed', () => {
  const openHtml = renderToStaticMarkup(
    <AppToast open onClose={() => {}} message="Saved draft" severity="success" />
  );
  assert.match(openHtml, /Saved draft/);

  const closedHtml = renderToStaticMarkup(
    <AppToast open={false} onClose={() => {}} message="Hidden toast" />
  );
  assert.doesNotMatch(closedHtml, /Hidden toast/);
});
