const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith('http://127.0.0.1:4173/') && response.status() >= 400) errors.push(response.status() + ' ' + response.url());
    });
    const base = 'http://127.0.0.1:4173/Nbr-taxpay-v2/';
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    await page.locator('main').getByRole('button').first().click();
    await page.waitForURL('**/#/all-taxes');
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    await page.goto(base + '#/travel-tax', { waitUntil: 'networkidle' });
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    assert.deepEqual(errors, []);
    console.log('Compiled Pages homepage, navigation, refresh and direct hash route PASS');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
