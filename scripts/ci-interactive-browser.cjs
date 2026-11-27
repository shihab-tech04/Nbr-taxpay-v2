const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const HARNESS_CODE = `
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '/src/i18n/i18n.ts';
import { getTheme } from '/src/design-system/theme';
import {
  AppAutocomplete,
  AppDateField,
  AppDateLocalizationProvider,
  AppTinInput,
  AppTinLookupField,
  AppTinResultCard,
  INVALID_YMD_VALUE,
  sanitizeTinResultForDisplay,
} from '/src/design-system/forms';

const RECORDS = {
  A_AUTH: { tin: '012345678901', name: 'Taxpayer Alpha', classification: 'Individual', allowRevealTin: true },
  B_AUTH: { tin: '987654321098', name: 'Taxpayer Beta', classification: 'Individual', allowRevealTin: true },
  A_LOCKED: { tin: '012345678901', name: 'Taxpayer Alpha', classification: 'Individual', allowRevealTin: false },
};

function CiHarness() {
  const [recordKey, setRecordKey] = useState('A_AUTH');
  const [tinValue, setTinValue] = useState('012345678901');
  const [masked, setMasked] = useState(true);
  const [autoValue, setAutoValue] = useState(null);
  const [boundDate, setBoundDate] = useState('2026-03-10');
  const [boundValidity, setBoundValidity] = useState('valid');
  const [noFutureDate, setNoFutureDate] = useState('');

  const payload = sanitizeTinResultForDisplay(RECORDS[recordKey]);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={getTheme('light')}>
        <AppDateLocalizationProvider>
          <div style={{ padding: 24, maxWidth: 640 }}>
            <section data-testid="harness-tin-result-section">
              <button type="button" data-testid="rec-a-auth" onClick={() => setRecordKey('A_AUTH')}>A Auth</button>
              <button type="button" data-testid="rec-b-auth" onClick={() => setRecordKey('B_AUTH')}>B Auth</button>
              <button type="button" data-testid="rec-a-locked" onClick={() => setRecordKey('A_LOCKED')}>A Locked</button>
              <AppTinResultCard
                {...payload}
                testId="ci-tin-result-card"
                publicCapability="public_help_question"
              />
            </section>

            <section data-testid="harness-tin-inputs">
              <button type="button" data-testid="toggle-tin-mask" onClick={() => setMasked((m) => !m)}>
                Toggle Mask
              </button>
              <AppTinLookupField
                id="ci-tin-lookup"
                label="CI Lookup TIN"
                value={tinValue}
                onChange={setTinValue}
                onSearch={() => {}}
                canSearch
                masked={masked}
                helperText="Enter 12 numeric digits"
                suggestedTins={['012345678901', '01234567890a', '012345', '882349102384']}
                publicCapability="public_help_question"
              />
              <AppTinInput
                segmented={false}
                masked={masked}
                value={tinValue}
                onChange={setTinValue}
                testId="ci-plain-tin"
                publicCapability="public_help_question"
              />
            </section>

            <section data-testid="harness-autocomplete">
              <div data-testid="auto-selected-value">
                {autoValue === null ? '__NULL__' : autoValue === '' ? '__EMPTY__' : autoValue}
              </div>
              <AppAutocomplete
                id="ci-autocomplete"
                label="Tax Zone"
                value={autoValue}
                onChange={(nextVal) => setAutoValue(nextVal)}
                options={[
                  { value: '12345', code: 'ZONE-01', label: 'Tax Zone 01, Dhaka', group: 'Dhaka', secondary: 'কর অঞ্চল ০১' },
                  { value: '22901', code: 'ZONE-02', label: 'Tax Zone 02, Chattogram', group: 'Chattogram', secondary: 'কর অঞ্চল ০২' },
                ]}
                publicCapability="public_help_question"
              />
            </section>

            <section data-testid="harness-dates">
              <div data-testid="bound-date-value">{boundDate === '' ? '__EMPTY__' : boundDate}</div>
              <div data-testid="bound-date-validity">{boundValidity}</div>
              <AppDateField
                label="Bounded Date"
                value={boundDate}
                onChange={setBoundDate}
                onValidityChange={(v) => setBoundValidity(v.status + ':' + (v.reason ?? 'ok'))}
                minDate="2026-01-10"
                maxDate="2026-12-20"
                testId="ci-bounded-date"
                publicCapability="public_help_question"
              />
              <AppDateField
                label="No Future Date"
                value={noFutureDate}
                onChange={setNoFutureDate}
                disableFuture
                testId="ci-no-future-date"
                publicCapability="public_help_question"
              />
            </section>
          </div>
        </AppDateLocalizationProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

createRoot(document.getElementById('root')).render(<CiHarness />);
`;

async function assertMobileNavbar(page, routeLabel) {
  for (const vp of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(vp);
    const metrics = await page.evaluate(() => {
      const vw = window.innerWidth;
      const docOverflow = document.documentElement.scrollWidth > vw;
      const header = document.querySelector('header');
      const headerOverflow = header ? header.scrollWidth > vw : false;
      const clipped = Array.from(document.querySelectorAll('header a, header button')).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && (rect.left < -1 || rect.right > vw + 1);
      }).length;
      return { docOverflow, headerOverflow, clipped };
    });
    assert.equal(metrics.docOverflow, false, `${routeLabel} docOverflow at ${vp.width}`);
    assert.equal(metrics.headerOverflow, false, `${routeLabel} headerOverflow at ${vp.width}`);
    assert.equal(metrics.clipped, 0, `${routeLabel} clipped header at ${vp.width}`);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
}

(async () => {
  const { createServer } = await import('vite');
  const viteServer = await createServer({
    server: { host: '127.0.0.1', port: 4174, strictPort: true },
    plugins: [
      {
        name: 'ci-interactive-harness',
        resolveId(id) {
          if (id === '/__ci_harness__.tsx') return '\0/__ci_harness__.tsx';
          return null;
        },
        load(id) {
          if (id === '\0/__ci_harness__.tsx') return HARNESS_CODE;
          return null;
        },
        configureServer(server) {
          server.middlewares.use('/__ci_harness__.html', async (_req, res) => {
            const html = await server.transformIndexHtml(
              '/__ci_harness__.html',
              '<!doctype html><html><head><meta charset="utf-8" /></head><body><div id="root"></div><script type="module" src="/__ci_harness__.tsx"></script></body></html>'
            );
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
          });
        },
      },
    ],
  });

  await viteServer.listen();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // 1. Isolated interactive harness: TIN A->B->A, masking, paste caret, suggestions, helper, Autocomplete clear, Date bounds
    await page.goto('http://127.0.0.1:4174/__ci_harness__.html', { waitUntil: 'networkidle' });
    const card = page.getByTestId('ci-tin-result-card');
    await card.waitFor({ state: 'visible' });

    // Record A starts masked; reveal -> visible -> B resets -> back to A resets (A -> B -> A)
    assert.match(await card.innerText(), /012\*{9}/);
    await card.getByRole('button', { name: /Reveal TIN/i }).click();
    assert.match(await card.innerText(), /012345678901/);

    await page.getByTestId('rec-b-auth').click();
    assert.match(await card.innerText(), /987\*{9}/);
    assert.doesNotMatch(await card.innerText(), /987654321098/);

    await page.getByTestId('rec-a-auth').click();
    assert.match(await card.innerText(), /012\*{9}/);
    assert.doesNotMatch(await card.innerText(), /012345678901/);

    // Permission revocation: unauthorized payload hides Reveal button and omits raw TIN
    await card.getByRole('button', { name: /Reveal TIN/i }).click();
    assert.match(await card.innerText(), /012345678901/);
    await page.getByTestId('rec-a-locked').click();
    assert.match(await card.innerText(), /012\*{9}/);
    assert.doesNotMatch(await card.innerText(), /012345678901/);
    assert.equal(await card.getByRole('button', { name: /Reveal TIN|Hide TIN/i }).count(), 0);

    // Masking parity between segmented and plain inputs
    const segInput = page.getByTestId('taxpayer-tin-digits');
    const plainInput = page.getByTestId('ci-plain-tin');
    assert.equal(await segInput.getAttribute('type'), 'password');
    assert.equal(await plainInput.getAttribute('type'), 'password');
    assert.equal(await segInput.getAttribute('aria-describedby'), 'ci-tin-lookup-helper');
    assert.match(await page.getByTestId('shared-taxpayer-tin-lookup').innerText(), /•/);

    // Paste + caret restoration and suggestion filtering + Escape dismissal
    await page.getByTestId('toggle-tin-mask').click();
    assert.equal(await segInput.getAttribute('type'), 'text');
    await segInput.focus();
    await segInput.evaluate((el) => el.setSelectionRange(2, 12));
    await page.keyboard.type('9');
    assert.equal(await segInput.inputValue(), '019');
    await segInput.evaluate((el) => {
      const dt = new DataTransfer();
      dt.setData('text/plain', '34-56');
      el.setSelectionRange(3, 3);
      el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    });
    assert.equal(await segInput.inputValue(), '0193456');
    const caretAfterPaste = await segInput.evaluate((el) => el.selectionStart);
    assert.equal(caretAfterPaste, 7);

    // Non-numeric / wrong-length suggestions excluded
    await segInput.fill('0123');
    await page.getByRole('listbox').waitFor({ state: 'visible' });
    const suggestionTexts = await page.getByRole('option').allInnerTexts();
    assert.deepEqual(suggestionTexts, ['012345678901']);
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('listbox').count(), 0);

    // AppAutocomplete keyboard navigation, Escape overlay dismissal, nullable Clear
    const combo = page.getByRole('combobox', { name: /Tax Zone/i });
    await combo.click();
    await page.getByRole('listbox').waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('listbox').count(), 0);
    await combo.press('ArrowDown');
    await page.getByRole('listbox').waitFor({ state: 'visible' });
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    assert.equal(await page.getByTestId('auto-selected-value').innerText(), '22901');
    await page.locator('[data-testid="harness-autocomplete"] button[aria-label="Clear"]').click();
    assert.equal(await page.getByTestId('auto-selected-value').innerText(), '__EMPTY__');

    // AppDateField empty vs invalid vs valid and min/max checks
    const boundedInput = page.getByTestId('ci-bounded-date');
    const boundedGroup = page.locator('[data-testid="harness-dates"] [role="group"]').first();
    await boundedGroup.locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('30022026');
    assert.equal(await page.getByTestId('bound-date-value').innerText(), '__INVALID_DATE__');
    assert.equal(await boundedInput.getAttribute('aria-invalid'), null);
    assert.equal(await boundedGroup.getAttribute('aria-invalid'), 'true');
    await page.keyboard.type('05012026');
    assert.equal(await page.getByTestId('bound-date-value').innerText(), '2026-01-05');
    assert.equal(await page.getByTestId('bound-date-validity').innerText(), 'invalid:min');
    await page.locator('[data-testid="harness-dates"] button[aria-label="Clear value"]').first().click();
    assert.equal(await page.getByTestId('bound-date-value').innerText(), '__EMPTY__');

    // 2. Real routes in dev mode: Mobile Navbar at 320px/390px EN & BN
    for (const route of ['/all-taxes', '/history', '/gift-tax']) {
      await page.goto(`http://127.0.0.1:4174${route}`, { waitUntil: 'networkidle' });
      await assertMobileNavbar(page, `${route}-en`);
      await page.setViewportSize({ width: 320, height: 568 });
      await page.locator('header button[title*="Language"]').click();
      await assertMobileNavbar(page, `${route}-bn`);
      await page.locator('header button[title*="Language"]').click();
      await page.setViewportSize({ width: 1280, height: 900 });
    }

    // 3. History route: inclusive range, reversed range fails closed, Clear resets, Escape closes calendar
    await page.goto('http://127.0.0.1:4174/history', { waitUntil: 'networkidle' });
    const initialRows = await page.locator('tbody tr').count();
    assert.ok(initialRows >= 2);

    const historyGroups = page.locator('main [role="group"]');
    await historyGroups.nth(0).locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('10042026');
    await historyGroups.nth(1).locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('10042026');
    assert.equal(await page.locator('tbody tr').count(), 1);
    assert.match(await page.locator('tbody').innerText(), /SOHO-2026-98124/);

    // Reversed range: fail closed (0 rows) + inline error
    await historyGroups.nth(0).locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('20042026');
    assert.equal(await page.locator('tbody tr').count(), 0);
    await page.getByText('End date cannot be earlier than start date.').waitFor({ state: 'visible' });

    // Clear restores rows
    await page.getByTestId('date-range-clear').click();
    assert.equal(await page.locator('tbody tr').count(), initialRows);

    // Calendar button opens popper and Escape dismisses it
    await page.locator('main button[aria-label*="Choose date"]').first().click();
    const calendar = page.locator('.MuiDateCalendar-root').first();
    await calendar.waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await calendar.waitFor({ state: 'hidden', timeout: 2000 });

    // 4. Gift Tax route: invalid date prevents stale valid Stage 3 progress; valid date preserves giftDate
    await page.goto('http://127.0.0.1:4174/gift-tax', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Proceed to Gift Details/i }).click();
    await page.getByText('Stage 2: Gift & Valuation Information').waitFor({ state: 'visible' });

    const giftGroup = page.locator('main [role="group"]').first();
    await giftGroup.locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('30022026');
    await page.getByRole('button', { name: /Proceed to Preview/i }).click();
    await page.getByText('Stage 2: Gift & Valuation Information').waitFor({ state: 'visible' });
    await page.getByText(/valid date|valid gift date/i).first().waitFor({ state: 'visible' });

    await giftGroup.locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('10042026');
    await page.getByRole('button', { name: /Proceed to Preview/i }).click();
    await page.getByText('Stage 3: Final Payment Preview').waitFor({ state: 'visible' });
    assert.match(await page.locator('main').innerText(), /10 Apr 2026/);
    await page.getByRole('button', { name: /Confirm/i }).click();
    await page.getByText('Gift Tax Paid Successfully!').waitFor({ state: 'visible' });
    assert.match(await page.locator('[role="dialog"]').innerText(), /2026-04-10/);

    assert.deepEqual(errors, []);
    console.log('CI interactive browser checks (TIN A->B->A, masking, caret, suggestions, Autocomplete clear, Date bounds, History, Gift Tax, Navbar 320/390px) PASS');
  } finally {
    await browser.close();
    await viteServer.close();
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
