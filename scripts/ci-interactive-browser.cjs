const assert = require('node:assert/strict');

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

async function runInteractiveChecks(page, baseUrl = 'http://127.0.0.1:4174') {
  const errors = [];
  const onPageError = (err) => errors.push(err.message);
  const onConsole = (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  };
  page.on('pageerror', onPageError);
  page.on('console', onConsole);

  try {
    await page.setViewportSize({ width: 1280, height: 900 });

    // 1. Isolated interactive harness: TIN A->B->A, masking, paste caret, suggestions, helper, Autocomplete clear, Date bounds
    await page.goto(`${baseUrl}/scripts/ci-harness.html`, { waitUntil: 'networkidle' });
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
    await boundedGroup.locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('05012026');
    assert.equal(await page.getByTestId('bound-date-value').innerText(), '2026-01-05');
    assert.equal(await page.getByTestId('bound-date-validity').innerText(), 'invalid:min');
    await page.getByTestId('harness-dates').getByRole('button', { name: 'Clear' }).first().click();
    assert.equal(await page.getByTestId('bound-date-value').innerText(), '__EMPTY__');

    // 2. Real routes in dev mode: Mobile Navbar at 320px/390px EN & BN
    for (const route of ['/all-taxes', '/history', '/gift-tax']) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      await assertMobileNavbar(page, `${route}-en`);
      await page.setViewportSize({ width: 320, height: 568 });
      await page.locator('header button[title*="Language"]').click();
      await assertMobileNavbar(page, `${route}-bn`);
      await page.locator('header button[title*="Language"]').click();
      await page.setViewportSize({ width: 1280, height: 900 });
    }

    // 3. History route: inclusive range, reversed range fails closed, Clear resets, Escape closes calendar
    await page.goto(`${baseUrl}/history`, { waitUntil: 'networkidle' });
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

    // Malformed bound fails closed (0 rows)
    await historyGroups.nth(0).locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('30022026');
    assert.equal(await page.locator('tbody tr').count(), 0);

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
    await page.goto(`${baseUrl}/gift-tax`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Proceed to Gift Details/i }).click();
    await page.getByText('Stage 2: Gift & Valuation Information').waitFor({ state: 'visible' });
    await page.getByText(/Sample Gift Tax Preview/i).waitFor({ state: 'visible' });

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
    await page.getByText(/Sample Gift Tax Estimate \(Not Official\):/i).waitFor({ state: 'visible' });
    assert.match(await page.locator('main').innerText(), /10 Apr 2026/);
    await page.getByRole('button', { name: /Confirm/i }).click();
    await page.getByText('Sample Gift Tax Preview Recorded').waitFor({ state: 'visible' });
    await page.locator('[role="dialog"]').getByText('Sample challan — not valid for payment').waitFor({ state: 'visible' });
    assert.match(await page.locator('[role="dialog"] [data-testid="receipt-gift-date"]').innerText(), /2026-04-10/);

    await page.keyboard.press('Escape');
    await page.locator('[role="dialog"]').waitFor({ state: 'hidden', timeout: 3000 });

    // 5. History AppTable sorting + EN/BN pagination + Receipt modal inner table sort & focus restore
    await page.goto(`${baseUrl}/history`, { waitUntil: 'networkidle' });
    const amountHeaderBtn = page.locator('thead th', { hasText: /Amount \(BDT\)/i }).locator('[role="button"]');
    await amountHeaderBtn.click(); // asc: 12,500 first
    assert.match(await page.locator('tbody tr').first().innerText(), /SOHO-2026-88342/);
    await amountHeaderBtn.click(); // desc: 25,000 first (Gift Tax or sample row)
    assert.match(await page.locator('tbody tr').first().innerText(), /৳ 25,000/);
    await page.getByText(/1–3 of 3/).waitFor({ state: 'visible' });

    await page.locator('header button[title*="Language"]').click();
    await page.getByText(/প্রতি পৃষ্ঠায় সারি:/).waitFor({ state: 'visible' });
    await page.locator('header button[title*="Language"]').click();

    const firstReceiptBtn = page.locator('tbody tr').first().getByRole('button', { name: /Receipt/i });
    await firstReceiptBtn.click();
    const receiptDialog = page.locator('[role="dialog"]');
    await receiptDialog.waitFor({ state: 'visible' });
    assert.match(await receiptDialog.innerText(), /Tax Head Allocations/);
    await page.keyboard.press('Escape');
    await receiptDialog.waitFor({ state: 'hidden', timeout: 3000 });
    assert.equal(await firstReceiptBtn.evaluate((el) => document.activeElement === el), true);

    // 6. Beneficiaries: sort, search, dirty-close guard, focus restore, and AppConfirmDialog delete
    await page.goto(`${baseUrl}/beneficiaries`, { waitUntil: 'networkidle' });
    await page.locator('table').waitFor({ state: 'visible' });
    assert.equal(await page.locator('tbody tr').count(), 3);
    assert.match(await page.locator('tbody tr').first().innerText(), /GreenCorp Ltd\./);

    // Sort Name & TIN desc -> Tanvir Islam first
    await page.locator('thead th', { hasText: /Name & TIN/i }).locator('[role="button"]').click();
    assert.match(await page.locator('tbody tr').first().innerText(), /Tanvir Islam/);

    // Search filters down & restores
    const benSearch = page.getByLabel(/Search Beneficiaries/i);
    await benSearch.fill('Fatema');
    assert.equal(await page.locator('tbody tr').count(), 1);
    assert.match(await page.locator('tbody tr').first().innerText(), /Mrs\. Fatema Begum/);
    await page.getByRole('button', { name: /Clear search/i }).click();
    assert.equal(await page.locator('tbody tr').count(), 3);

    // Open Add modal -> unfinished edit -> Escape shows dirty guard -> Keep editing -> Close -> Discard closes & restores focus
    const addBenBtn = page.getByRole('button', { name: /Add New Beneficiary/i });
    await addBenBtn.click();
    const benDialog = page.locator('[role="dialog"]');
    await benDialog.waitFor({ state: 'visible' });
    await benDialog.getByLabel(/Name/i).fill('Unsaved Person');
    await page.keyboard.press('Escape');
    await page.getByTestId('modal-dirty-guard').waitFor({ state: 'visible' });
    await page.getByRole('button', { name: /Keep editing/i }).click();
    assert.equal(await benDialog.isVisible(), true);
    await benDialog.getByRole('button', { name: /Close dialog/i }).click();
    await page.getByTestId('modal-dirty-guard').waitFor({ state: 'visible' });
    await page.getByRole('button', { name: /Discard/i }).click();
    await benDialog.waitFor({ state: 'hidden', timeout: 3000 });
    assert.equal(await addBenBtn.evaluate((el) => document.activeElement === el), true);

    // Delete Tanvir Islam via AppConfirmDialog -> row count drops & toast shows
    await page.getByRole('button', { name: 'Delete Tanvir Islam' }).click();
    const confirmDialog = page.locator('[role="dialog"]');
    await confirmDialog.waitFor({ state: 'visible' });
    assert.match(await confirmDialog.innerText(), /Delete Beneficiary\?/);
    await confirmDialog.getByRole('button', { name: /^Delete$/i }).click();
    await confirmDialog.waitFor({ state: 'hidden', timeout: 3000 });
    assert.equal(await page.locator('tbody tr').count(), 2);
    await page.getByText('Beneficiary removed').waitFor({ state: 'visible' });

    // 7. Corrections: table + dirty-close guard on CorrectionFormDialog
    await page.goto(`${baseUrl}/corrections`, { waitUntil: 'networkidle' });
    await page.locator('table').waitFor({ state: 'visible' });
    assert.ok((await page.locator('tbody tr').count()) >= 1);
    await page.getByRole('button', { name: /Apply for Correction/i }).click();
    const corrDialog = page.locator('[role="dialog"]');
    await corrDialog.waitFor({ state: 'visible' });
    await corrDialog.getByLabel(/Challan Number/i).fill('NBR-TEST-999');
    await corrDialog.getByRole('button', { name: /Close dialog/i }).click();
    await page.getByTestId('modal-dirty-guard').waitFor({ state: 'visible' });
    await page.getByRole('button', { name: /Discard/i }).click();
    await corrDialog.waitFor({ state: 'hidden', timeout: 3000 });

    // 8. Drafts: table + AppConfirmDialog delete cancellation preserves row
    await page.goto(`${baseUrl}/drafts`, { waitUntil: 'networkidle' });
    await page.locator('table').waitFor({ state: 'visible' });
    const initialDrafts = await page.locator('tbody tr').count();
    assert.ok(initialDrafts >= 1);
    await page.locator('tbody tr').first().getByRole('button', { name: /Delete draft/i }).click();
    const draftConfirm = page.locator('[role="dialog"]');
    await draftConfirm.waitFor({ state: 'visible' });
    await draftConfirm.getByRole('button', { name: /Cancel/i }).click();
    await draftConfirm.waitFor({ state: 'hidden', timeout: 3000 });
    assert.equal(await page.locator('tbody tr').count(), initialDrafts);

    // 9. All Tax Items table: sorting + removing sorted row deletes exact item by originalIndex
    await page.goto(`${baseUrl}/all-taxes`, { waitUntil: 'networkidle' });
    await page.locator('main button', { hasText: /Other Tax/i }).first().click();
    assert.equal(await page.locator('tbody tr').count(), 1);
    await page.getByLabel(/Tax Head/i).click();
    await page.getByRole('option', { name: /0112/i }).click();
    await page.getByLabel(/Amount \(BDT\)/i).fill('1000');
    await page.getByRole('button', { name: /Add Tax Head/i }).click();

    assert.equal(await page.locator('tbody tr').count(), 2);
    // Sort by Amount asc -> 1000 (Advance Income Tax 0112, originalIndex 1) moves to visual row 0; removing it preserves 0111 (originalIndex 0)!
    await page.locator('thead th', { hasText: /Amount \(BDT\)/i }).locator('[role="button"]').click();
    assert.match(await page.locator('tbody tr').first().innerText(), /Advance Income Tax/);
    await page.getByRole('button', { name: /Remove Advance Income Tax/i }).click();
    assert.equal(await page.locator('tbody tr').count(), 1);
    assert.match(await page.locator('tbody tr').first().innerText(), /Income Tax with Return/);

    // 10. Taxpayer Profile (24 fields): exact grouping, first-3-digit masking, email domain mask, no duplicates
    await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle' });
    for (const key of ['taxpayerName', 'tin', 'tinType', 'taxesCircle', 'registeredOn', 'lastLoginAt', 'mobileNumber', 'emailAddress', 'taxOfficePhone', 'previousTin']) {
      await page.getByTestId(`profile-field-${key}`).waitFor({ state: 'visible' });
    }
    assert.equal(await page.locator('[data-testid^="profile-field-"]').count(), 24);
    assert.equal(await page.locator('[data-testid="profile-field-taxesCircle"]').count(), 1);
    assert.match(await page.getByTestId('profile-field-tin').innerText(), /882•••••••••/);
    assert.match(await page.getByTestId('profile-field-previousTin').innerText(), /654•••••••/);
    assert.match(await page.getByTestId('profile-field-emailAddress').innerText(), /ra••••@e••••\.•••/);
    assert.match(await page.getByTestId('profile-field-taxOfficePhone').innerText(), /880••••••••/);
    assert.equal(await page.getByRole('button', { name: /Reveal TIN/i }).isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: /Copy TIN/i }).isDisabled(), true);

    // 11. Auth & Account journey: masked contacts, wrong-OTP validation, Resend OTP, ?returnTo=, sequential FirstLoginNoticeDialog
    await page.goto(`${baseUrl}/login?returnTo=/dashboard`, { waitUntil: 'networkidle' });
    await page.getByTestId('login-masked-contacts').waitFor({ state: 'visible' });
    assert.match(await page.getByTestId('login-masked-contacts').innerText(), /880••••••••••/);
    await page.getByRole('radio', { name: /Email/i }).click();
    await page.getByRole('button', { name: /Continue with OTP/i }).click();

    await page.getByRole('button', { name: /Resend OTP/i }).click();
    await page.getByTestId('otp-resent-status').waitFor({ state: 'visible' });
    await page.getByLabel(/One-Time Password|OTP/i).fill('999999');
    await page.getByRole('button', { name: /Verify & Sign In/i }).click();
    await page.getByRole('alert').filter({ hasText: /Incorrect OTP code/i }).waitFor({ state: 'visible' });

    await page.getByLabel(/One-Time Password|OTP/i).fill('123456');
    await page.getByRole('button', { name: /Verify & Sign In/i }).click();
    await page.waitForURL('**/dashboard');

    // First-login queued notice 1 -> Acknowledge & Next -> notice 2 -> Acknowledge
    const noticeDialog = page.locator('[role="dialog"]');
    await noticeDialog.waitFor({ state: 'visible' });
    assert.match(await noticeDialog.innerText(), /First-Login Account Notice/);
    await noticeDialog.getByRole('button', { name: /Acknowledge & Next/i }).click();
    assert.match(await noticeDialog.innerText(), /Verify Assessment Year/);
    await noticeDialog.getByRole('button', { name: /^Acknowledge$/i }).click();
    await noticeDialog.waitFor({ state: 'hidden', timeout: 3000 });

    // Navigate to Profile: reveal TIN, copy toast, Sample Certificate modal, then switch to Account B for isolation
    await page.getByRole('button', { name: /Taxpayer Profile/i }).click();
    await page.waitForURL('**/profile');
    await page.getByRole('button', { name: /Reveal TIN/i }).click();
    assert.match(await page.getByTestId('profile-field-tin').innerText(), /882349102384/);
    await page.getByRole('button', { name: /Copy TIN/i }).click();
    await page.getByText(/Copied TIN to clipboard/i).waitFor({ state: 'visible' });

    const certBtn = page.getByRole('button', { name: /View Sample Certificate/i });
    await certBtn.click();
    const certDialog = page.locator('[role="dialog"]');
    await certDialog.waitFor({ state: 'visible' });
    assert.match(await certDialog.innerText(), /Sample e-TIN Certificate Preview/);
    await page.keyboard.press('Escape');
    await certDialog.waitFor({ state: 'hidden', timeout: 3000 });
    assert.equal(await certBtn.evaluate((el) => document.activeElement === el), true);
    await assertMobileNavbar(page, 'profile-en');

    // 12. Certificates separation & Combined Payment Certificate modal
    await page.goto(`${baseUrl}/certificates`, { waitUntil: 'networkidle' });
    await page.getByTestId('tax-credit-certificates-section').waitFor({ state: 'visible' });
    await page.getByTestId('payment-certificates-section').waitFor({ state: 'visible' });
    assert.match(await page.getByTestId('tax-credit-certificates-section').innerText(), /Official Tax Credit Certificates Require Live NBR Verification/);
    await page.locator('[data-testid="payment-certificates-section"] tbody tr').first().getByRole('button', { name: /^View$/i }).click();
    const payCertDialog = page.locator('[role="dialog"]');
    await payCertDialog.waitFor({ state: 'visible' });
    assert.match(await payCertDialog.innerText(), /Combined Payment Certificate/);
    await payCertDialog.getByRole('button', { name: /Download PDF/i }).click();
    await page.getByText(/Downloaded CERT-/i).waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await payCertDialog.waitFor({ state: 'hidden', timeout: 3000 });

    assert.deepEqual(errors, []);
    return 'CI interactive browser checks (Cycle 10-11: Profile 24 parity, Tables/Modals, Combined Payment Certificates & Tax Credit separation, Auth OTP/Resend/First-Login Queue) PASS';
  } finally {
    page.off('pageerror', onPageError);
    page.off('console', onConsole);
  }
}

module.exports = { runInteractiveChecks };

if (require.main === module) {
  const { chromium } = require('playwright');
  (async () => {
    const { createServer } = await import('vite');
    const viteServer = await createServer({
      server: { host: '127.0.0.1', port: 4174, strictPort: true },
    });

    await viteServer.listen();
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      const summary = await runInteractiveChecks(page, 'http://127.0.0.1:4174');
      console.log(summary);
    } finally {
      await browser.close();
      await viteServer.close();
    }
  })().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
