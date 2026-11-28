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

    // 3. Signed-out isolation checks before signing in: Profile auth gate & isolated empty Certificates
    await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle' });
    await page.getByTestId('profile-auth-gate').waitFor({ state: 'visible' });
    assert.match(await page.getByTestId('profile-auth-gate').innerText(), /Sign in to view your profile\./);
    assert.equal(await page.locator('[data-testid^="profile-field-"]').count(), 0);
    assert.equal(await page.getByText('882349102384', { exact: false }).count(), 0);

    await page.goto(`${baseUrl}/certificates`, { waitUntil: 'networkidle' });
    await page.getByTestId('tax-credit-certificates-section').waitFor({ state: 'visible' });
    await page.getByTestId('payment-certificates-section').waitFor({ state: 'visible' });
    assert.equal(await page.locator('[data-testid="payment-certificates-section"] tbody tr').count(), 0);
    assert.equal(await page.getByText('882349102384', { exact: false }).count(), 0);

    // 4. Gift Tax route (walk-in): empty initial parties, Donor/Donee distinct TIN lookup, Stage 2 invalid/future date rejection, Stage 3/4 Attribution
    await page.goto(`${baseUrl}/gift-tax`, { waitUntil: 'networkidle' });
    assert.equal(await page.getByTestId('gift-donor-confirmed').count(), 0);
    assert.equal(await page.getByTestId('gift-donee-confirmed').count(), 0);
    await page.getByTestId('gift-donor-tin-input').fill('882349102384');
    await page.getByRole('button', { name: /Search Donor TIN/i }).click();
    await page.getByTestId('gift-add-donor-btn').click();
    await page.getByTestId('gift-donee-tin-input').fill('992384102938');
    await page.getByRole('button', { name: /Search Donee TIN/i }).click();
    await page.getByTestId('gift-add-donee-btn').click();
    await page.getByRole('combobox', { name: /Relationship/i }).click();
    await page.getByRole('option', { name: /^Mother$/i }).click();
    await page.getByLabel(/Donee Tag/i).fill('Mother - Homestead Gift');
    await page.getByRole('button', { name: /Next: Gift & Tax Information/i }).click();
    await page.getByTestId('gift-stage-2').waitFor({ state: 'visible' });

    await page.getByLabel(/Gift Value \(BDT\)/i).fill('520000');
    await page.getByLabel(/Gift Description/i).fill('Gift plot');
    const giftGroup = page.locator('[data-testid="gift-stage-2"] [role="group"]').first();
    await giftGroup.locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('30022026');
    await page.getByRole('button', { name: /Next: Final Preview/i }).click();
    await page.getByTestId('gift-stage-2').waitFor({ state: 'visible' });
    await page.getByText(/valid date|future/i).first().waitFor({ state: 'visible' });

    await giftGroup.locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('10042026');
    await page.getByRole('button', { name: /Next: Final Preview/i }).click();
    await page.getByTestId('gift-stage-3').waitFor({ state: 'visible' });
    await page.getByText(/Illustrative Gift Tax Estimate \(Not Official\):/i).waitFor({ state: 'visible' });
    assert.match(await page.locator('main').innerText(), /10 Apr 2026/);
    await page.getByRole('button', { name: /Confirm & Pay/i }).click();
    const walkinGiftResult = page.getByTestId('walkin-payment-result');
    await walkinGiftResult.waitFor({ state: 'visible' });
    await walkinGiftResult.getByRole('button', { name: /Challan Details & Print/i }).click();
    await page.locator('[role="dialog"]').getByText('Sample challan — not valid for payment').waitFor({ state: 'visible' });
    assert.match(await page.locator('[role="dialog"] [data-testid="receipt-gift-date"]').innerText(), /2026-04-10/);

    await page.keyboard.press('Escape');
    await page.getByTestId('receipt-gift-attribution').waitFor({ state: 'hidden', timeout: 3000 });

    // 5. All Tax Payments (F-21 walk-in): 7 categories, taxpayer step, Return single-AY guard, sort/remove by originalIndex, remarks & Walk-in Claim option
    await page.goto(`${baseUrl}/all-taxes`, { waitUntil: 'networkidle' });
    await page.getByTestId('all-tax-category-grid').waitFor({ state: 'visible' });
    assert.equal(
      await page.locator('[data-testid="all-tax-category-grid"] > [data-testid^="all-tax-category-"]').count(),
      7
    );
    assert.equal(await page.getByTestId('frequent-tax-categories').count(), 0);

    await page.getByTestId('all-tax-category-other_tax').click();
    await page.getByRole('radio', { name: /Facilitation/i }).click();
    await page.getByRole('textbox', { name: /Taxpayer TIN/i }).fill('882349102384');
    await page.getByPlaceholder(/Taxpayer Name/i).fill('Taxpayer A');
    await page.getByRole('button', { name: /Use \/ Add TIN/i }).click();
    await page.getByRole('textbox', { name: /Taxpayer TIN/i }).fill('992384102938');
    await page.getByPlaceholder(/Taxpayer Name/i).fill('Taxpayer B');
    await page.getByRole('button', { name: /Use \/ Add TIN/i }).click();
    await page.getByRole('button', { name: /Continue to Payment Head/i }).click();

    assert.equal(await page.getByRole('button', { name: /Save as Draft/i }).count(), 0);
    assert.equal(await page.locator('tbody tr').count(), 0);
    await page.getByLabel(/Tax Head/i).click();
    await page.getByRole('option', { name: /0111/i }).click();
    await page.getByLabel(/Amount \(BDT\)/i).fill('5000');
    await page.getByLabel(/Remarks/i).fill('Line 1 note\nবাংলা চালান মন্তব্য');
    await page.getByRole('button', { name: /Add Tax Head/i }).click();

    // Same-taxpayer mixing of Return (0111) + non-Return (0112) is blocked
    await page.getByLabel(/Tax Head/i).click();
    await page.getByRole('option', { name: /0112/i }).click();
    await page.getByLabel(/Amount \(BDT\)/i).fill('1000');
    await page.getByRole('button', { name: /Add Tax Head/i }).click();
    await page.getByRole('alert').first().waitFor({ state: 'visible' });
    assert.equal(await page.locator('tbody tr').count(), 1);

    // Switching to Taxpayer B allows Taxpayer A Return + Taxpayer B Advance in the same transaction
    await page.getByLabel(/Taxpayer for this Line Item/i).click();
    await page.getByRole('option', { name: /992384102938/i }).click();
    await page.getByRole('button', { name: /Add Tax Head/i }).click();

    assert.equal(await page.locator('tbody tr').count(), 2);
    // Edit Advance Income Tax line item before sorting/removing
    await page.getByRole('button', { name: /Edit Advance Income Tax/i }).click();
    await page.getByLabel(/Amount \(BDT\)/i).fill('1500');
    await page.getByRole('button', { name: /Update Tax Head/i }).click();
    assert.match(await page.locator('tbody').innerText(), /1,500/);

    // Sort by Amount asc -> 1500 (Advance Income Tax 0112, originalIndex 1) moves to visual row 0; removing it preserves 0111!
    await page.locator('thead th', { hasText: /Amount \(BDT\)/i }).locator('[role="button"]').click();
    assert.match(await page.locator('tbody tr').first().innerText(), /Advance Income Tax/);
    await page.getByRole('button', { name: /Remove Advance Income Tax/i }).click();
    assert.equal(await page.locator('tbody tr').count(), 1);
    assert.match(await page.locator('tbody tr').first().innerText(), /Income Tax with Return/);

    await page.getByRole('button', { name: /Proceed to Preview/i }).click();
    await page.getByTestId('all-tax-preview-step').waitFor({ state: 'visible' });
    assert.match(await page.locator('main').innerText(), /বাংলা চালান মন্তব্য/);
    await page.getByRole('button', { name: /Proceed to Payment Channel/i }).click();
    await page.getByTestId('all-tax-channel-step').waitFor({ state: 'visible' });
    await page.getByRole('radio', { name: /Nagad/i }).click();
    await page.getByRole('button', { name: /Confirm & Pay/i }).click();
    const walkinResult = page.getByTestId('walkin-payment-result');
    await walkinResult.waitFor({ state: 'visible' });
    await walkinResult.getByRole('button', { name: /Challan Details & Print/i }).waitFor({ state: 'visible' });
    await walkinResult.getByRole('button', { name: /View Payment Certificate/i }).waitFor({ state: 'visible' });
    await walkinResult.getByRole('button', { name: /Continue without signing in/i }).waitFor({ state: 'visible' });
    await walkinResult.getByRole('button', { name: /Sign in to Claim Payment/i }).click();
    await page.waitForURL('**/login?returnTo=*');

    // Forged/unknown TIN in localStorage session must fail closed on reload
    await page.evaluate(() => {
      window.localStorage.setItem('sohojkor_user', JSON.stringify({ tin: '998877665544', name: 'Forged User' }));
    });
    await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle' });
    await page.getByTestId('profile-auth-gate').waitFor({ state: 'visible' });

    // 6. Auth & Account journey (User1 / Rafiqul): unknown TIN fail-closed, wrong password, masked contacts, Resend, OTP, ?returnTo=, sequential FirstLoginNoticeDialog
    await page.goto(`${baseUrl}/login?returnTo=/dashboard`, { waitUntil: 'networkidle' });
    assert.equal(await page.getByLabel(/TIN or User ID/i).inputValue(), '');
    assert.equal(await page.getByTestId('login-masked-contacts').count(), 0);

    await page.getByLabel(/TIN or User ID/i).fill('998877665544');
    await page.getByLabel(/^Password/i).fill('badpass');
    assert.equal(await page.getByTestId('login-masked-contacts').count(), 0);
    await page.getByRole('button', { name: /Continue with OTP/i }).click();
    await page.getByRole('alert').filter({ hasText: /Unknown TIN or User ID/i }).waitFor({ state: 'visible' });

    await page.getByRole('button', { name: 'user1', exact: true }).click();
    await page.getByTestId('login-masked-contacts').waitFor({ state: 'visible' });
    assert.match(await page.getByTestId('login-masked-contacts').innerText(), /\+880\*{10}/);
    assert.match(await page.getByTestId('login-masked-contacts').innerText(), /ra\*{11}@\*{4}\.\*{3}/);

    await page.getByLabel(/^Password/i).fill('wrongpass');
    await page.getByRole('button', { name: /Continue with OTP/i }).click();
    await page.getByRole('alert').filter({ hasText: /Incorrect User ID\/TIN or password/i }).waitFor({ state: 'visible' });

    await page.getByLabel(/^Password/i).fill('user1');
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

    // 7. Signed-in User1 History (isolated from walk-in records), inclusive date bounds, sort, Receipt modal, Pay Again
    await page.goto(`${baseUrl}/history`, { waitUntil: 'networkidle' });
    const initialRows = await page.locator('tbody tr').count();
    assert.equal(initialRows, 2);

    const historyGroups = page.locator('main [role="group"]');
    await historyGroups.nth(0).locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('10042026');
    await historyGroups.nth(1).locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('10042026');
    assert.equal(await page.locator('tbody tr').count(), 1);
    assert.match(await page.locator('tbody').innerText(), /SOHO-2026-98124/);

    await historyGroups.nth(0).locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('20042026');
    assert.equal(await page.locator('tbody tr').count(), 0);
    await page.getByText('End date cannot be earlier than start date.').waitFor({ state: 'visible' });

    await historyGroups.nth(0).locator('[role="spinbutton"]').first().click();
    await page.keyboard.type('30022026');
    assert.equal(await page.locator('tbody tr').count(), 0);

    await page.getByTestId('date-range-clear').click();
    assert.equal(await page.locator('tbody tr').count(), initialRows);

    await page.locator('main button[aria-label*="Choose date"]').first().click();
    const calendar = page.locator('.MuiDateCalendar-root').first();
    await calendar.waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await calendar.waitFor({ state: 'hidden', timeout: 2000 });

    const amountHeaderBtn = page.locator('thead th', { hasText: /Amount \(BDT\)/i }).locator('[role="button"]');
    await amountHeaderBtn.click(); // asc: 12,500 first
    assert.match(await page.locator('tbody tr').first().innerText(), /SOHO-2026-88342/);
    await amountHeaderBtn.click(); // desc: 25,000 first
    assert.match(await page.locator('tbody tr').first().innerText(), /SOHO-2026-98124/);
    await page.getByText(/1–2 of 2/).waitFor({ state: 'visible' });

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

    await page.locator('tbody tr').first().getByRole('button', { name: /Pay Again/i }).click();
    await page.waitForURL('**/all-taxes');
    assert.ok((await page.locator('tbody tr').count()) >= 1);

    // 8. Signed-in Beneficiaries, Corrections, & Drafts Resume
    await page.goto(`${baseUrl}/beneficiaries`, { waitUntil: 'networkidle' });
    await page.locator('table').waitFor({ state: 'visible' });
    assert.equal(await page.locator('tbody tr').count(), 3);
    assert.match(await page.locator('tbody tr').first().innerText(), /GreenCorp Ltd\./);

    await page.locator('thead th', { hasText: /Name & TIN/i }).locator('[role="button"]').click();
    assert.match(await page.locator('tbody tr').first().innerText(), /Tanvir Islam/);

    const benSearch = page.getByLabel(/Search Beneficiaries/i);
    await benSearch.fill('Fatema');
    assert.equal(await page.locator('tbody tr').count(), 1);
    assert.match(await page.locator('tbody tr').first().innerText(), /Mrs\. Fatema Begum/);
    await page.getByRole('button', { name: /Clear search/i }).click();
    assert.equal(await page.locator('tbody tr').count(), 3);

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

    await page.getByRole('button', { name: 'Delete Tanvir Islam' }).click();
    const confirmDialog = page.locator('[role="dialog"]');
    await confirmDialog.waitFor({ state: 'visible' });
    assert.match(await confirmDialog.innerText(), /Delete Beneficiary\?/);
    await confirmDialog.getByRole('button', { name: /^Delete$/i }).click();
    await confirmDialog.waitFor({ state: 'hidden', timeout: 3000 });
    assert.equal(await page.locator('tbody tr').count(), 2);
    await page.getByText('Beneficiary removed').waitFor({ state: 'visible' });

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

    await page.locator('tbody tr').first().getByRole('button', { name: /Resume/i }).click();
    await page.waitForURL('**/all-taxes');
    assert.match(await page.locator('tbody').innerText(), /Advance Income Tax/);

    // 9. Signed-in 24-Field Profile parity & Certificates Unicode PDF export
    await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle' });
    for (const key of ['taxpayerName', 'tin', 'tinType', 'taxesCircle', 'registeredOn', 'lastLoginAt', 'mobileNumber', 'emailAddress', 'taxOfficePhone', 'previousTin']) {
      await page.getByTestId(`profile-field-${key}`).waitFor({ state: 'visible' });
    }
    assert.equal(await page.locator('[data-testid^="profile-field-"]').count(), 24);
    assert.equal(await page.locator('[data-testid="profile-field-taxesCircle"]').count(), 1);
    assert.equal(await page.getByTestId('profile-field-taxesCircle').getAttribute('data-source'), 'certificate');
    assert.equal(await page.getByTestId('profile-field-taxpayerStatus').getAttribute('data-source'), 'certificate');
    assert.equal(await page.locator('[data-testid="profile-group-certificate"] [data-testid^="profile-field-"]').first().getAttribute('data-testid'), 'profile-field-previousTin');
    assert.match(await page.getByTestId('profile-field-tin').innerText(), /882\*{9}/);
    assert.match(await page.getByTestId('profile-field-previousTin').innerText(), /654\*{7}/);
    assert.match(await page.getByTestId('profile-field-emailAddress').innerText(), /ra\*{11}@\*{4}\.\*{3}/);
    assert.match(await page.getByTestId('profile-field-taxOfficePhone').innerText(), /\+?880-\*-\*{7}/);

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

    await page.goto(`${baseUrl}/certificates`, { waitUntil: 'networkidle' });
    await page.getByTestId('tax-credit-certificates-section').waitFor({ state: 'visible' });
    await page.getByTestId('payment-certificates-section').waitFor({ state: 'visible' });
    assert.match(await page.getByTestId('tax-credit-certificates-section').innerText(), /Official Tax Credit Certificates Require Live NBR Verification/);
    await page.locator('[data-testid="payment-certificates-section"] tbody tr').first().getByRole('button', { name: /^View$/i }).click();
    const payCertDialog = page.locator('[role="dialog"]');
    await payCertDialog.waitFor({ state: 'visible' });
    assert.match(await payCertDialog.innerText(), /Combined Payment Certificate/);
    await payCertDialog.getByRole('button', { name: /^Print$/i }).waitFor({ state: 'visible' });
    await payCertDialog.getByRole('button', { name: /Download PDF/i }).click();
    await page.getByText(/Downloaded CERT-/i).waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await payCertDialog.waitFor({ state: 'hidden', timeout: 3000 });

    // 10. User1 -> User2 -> User1 Account Isolation, Reveal Reset, Switching Guard, & Acknowledged Notice Retention
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    await page.getByText(/Signed in as Md\. Rafiqul Islam/i).waitFor({ state: 'visible' });
    assert.equal(await page.getByRole('button', { name: /Continue with OTP/i }).isDisabled(), true);
    await page.getByRole('main').getByRole('button', { name: /Sign Out/i }).click();

    await page.getByRole('button', { name: 'user2', exact: true }).click();
    await page.getByRole('button', { name: /Continue with OTP/i }).click();
    await page.getByLabel(/One-Time Password|OTP/i).fill('111111');
    await page.getByRole('button', { name: /Verify & Sign In/i }).click();
    await page.waitForURL('**/dashboard');
    await noticeDialog.waitFor({ state: 'visible' });
    assert.match(await noticeDialog.innerText(), /Chattogram Zone Notice/);
    await noticeDialog.getByRole('button', { name: /^Acknowledge$/i }).click();
    await noticeDialog.waitFor({ state: 'hidden', timeout: 3000 });

    await page.goto(`${baseUrl}/history`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('tbody tr').count(), 1);
    assert.match(await page.locator('tbody').innerText(), /SOHO-2026-44109/);
    assert.equal(await page.getByText('SOHO-2026-98124').count(), 0);

    await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle' });
    await page.getByTestId('registration-not-linked').waitFor({ state: 'visible' });
    assert.match(await page.getByTestId('profile-field-tin').innerText(), /112\*{9}/);
    assert.equal(await page.getByText('882349102384', { exact: false }).count(), 0);

    await page.locator('header button[aria-haspopup="menu"]').click();
    await page.getByRole('menuitem', { name: /Sign Out/i }).click();
    await page.goto(`${baseUrl}/login?returnTo=/dashboard`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'user1', exact: true }).click();
    await page.getByRole('button', { name: /Continue with OTP/i }).click();
    await page.getByLabel(/One-Time Password|OTP/i).fill('123456');
    await page.getByRole('button', { name: /Verify & Sign In/i }).click();
    await page.waitForURL('**/dashboard');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('[role="dialog"]').count(), 0);

    await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle' });
    assert.match(await page.getByTestId('profile-field-tin').innerText(), /882\*{9}/);
    await page.goto(`${baseUrl}/history`, { waitUntil: 'networkidle' });
    assert.match(await page.locator('tbody').innerText(), /SOHO-2026-98124/);
    assert.equal(await page.getByText('SOHO-2026-44109').count(), 0);

    assert.deepEqual(errors, []);
    return 'CI interactive browser checks (Cycle 11-12: Account Isolation User1->User2->User1, 24-Field Profile, F-21 All Taxes, Unicode Certificate PDF, Tables & Modals) PASS';
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
