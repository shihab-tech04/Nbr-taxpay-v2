const assert = require('node:assert/strict');
const { chromium } = require('playwright');

async function assertNoMobileNavbarOverflow(page, routeLabel) {
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
      const clippedControls = Array.from(document.querySelectorAll('header a, header button')).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && (rect.left < -1 || rect.right > vw + 1);
      }).length;
      return { vw, docOverflow, headerOverflow, clippedControls };
    });
    assert.equal(metrics.docOverflow, false, `${routeLabel} overflowX at ${vp.width}px`);
    assert.equal(metrics.headerOverflow, false, `${routeLabel} header overflow at ${vp.width}px`);
    assert.equal(metrics.clippedControls, 0, `${routeLabel} clipped header control at ${vp.width}px`);
  }
  await page.setViewportSize({ width: 1280, height: 800 });
}

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.addInitScript(() =>
      localStorage.setItem('sohojkor_user', JSON.stringify({ name: 'PRIVATE_SENTINEL', tin: 'PRIVATE_SENTINEL' }))
    );
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('response', (response) => {
      if (response.url().startsWith('http://127.0.0.1:4173/') && response.status() >= 400) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });

    const base = 'http://127.0.0.1:4173/Nbr-taxpay-v2/';
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    await page.getByText('Experimental read-only UI preview', { exact: false }).waitFor({ state: 'visible' });
    assert.equal(await page.getByText('PRIVATE_SENTINEL', { exact: false }).count(), 0);
    await assertNoMobileNavbarOverflow(page, 'home');

    await page.locator('main').getByRole('button').first().click();
    await page.waitForURL('**/#/all-taxes');
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    await assertNoMobileNavbarOverflow(page, 'all-taxes-en');

    await page.goto(base + '#/history', { waitUntil: 'networkidle' });
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    assert.equal(await page.getByTestId('date-range-clear').isDisabled(), true);
    assert.equal(await page.getByTestId('date-range-from').isDisabled(), true);
    assert.equal(await page.getByTestId('date-range-to').isDisabled(), true);
    await assertNoMobileNavbarOverflow(page, 'history-en');

    // Switch header locale EN -> BN on mobile and verify no Navbar clipping/overflow
    await page.setViewportSize({ width: 320, height: 568 });
    await page.locator('header button[title*="Language"]').click();
    await assertNoMobileNavbarOverflow(page, 'history-bn');
    await page.locator('header button[title*="Language"]').click();

    await page.goto(base + '#/gift-tax', { waitUntil: 'networkidle' });
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    assert.equal(await page.locator('main input').first().isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: /Proceed to Gift Details/i }).isDisabled(), true);
    await assertNoMobileNavbarOverflow(page, 'gift-tax-en');

    await page.goto(base + '#/travel-tax', { waitUntil: 'networkidle' });
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    assert.equal(await page.locator('main input').first().isDisabled(), true);

    await page.goto(base + '#/profile', { waitUntil: 'networkidle' });
    await page.getByTestId('profile-auth-gate').waitFor({ state: 'visible' });
    assert.match(await page.getByTestId('profile-auth-gate').innerText(), /Sign in to view your profile\./);
    assert.equal(await page.locator('[data-testid^="profile-field-"]').count(), 0);
    assert.equal(await page.getByText('PRIVATE_SENTINEL', { exact: false }).count(), 0);
    assert.equal(await page.getByText('882349102384', { exact: false }).count(), 0);
    await assertNoMobileNavbarOverflow(page, 'profile-en');

    await page.goto(base + '#/certificates', { waitUntil: 'networkidle' });
    await page.getByTestId('tax-credit-certificates-section').waitFor({ state: 'visible' });
    await page.getByTestId('payment-certificates-section').waitFor({ state: 'visible' });
    assert.equal(await page.locator('[data-testid="payment-certificates-section"] tbody tr').count(), 0);
    assert.equal(await page.getByText('882349102384', { exact: false }).count(), 0);

    await page.goto(base + '#/login', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('main input').first().isDisabled(), true);
    assert.equal(await page.evaluate(() => localStorage.getItem('sohojkor_transactions')), null);
    assert.deepEqual(errors, []);
    console.log('Compiled Pages homepage, navigation, preview-policy, profile auth gate, isolated certificates, mobile Navbar 320/390px, and route smoke PASS');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
