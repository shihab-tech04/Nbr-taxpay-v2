const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem('sohojkor_user', JSON.stringify({name:'PRIVATE_SENTINEL',tin:'PRIVATE_SENTINEL'})));
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith('http://127.0.0.1:4173/') && response.status() >= 400) errors.push(response.status() + ' ' + response.url());
    });
    const base = 'http://127.0.0.1:4173/Nbr-taxpay-v2/';
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    await page.getByText('Experimental read-only UI preview', { exact: false }).waitFor({state:'visible'});
    assert.equal(await page.getByText('PRIVATE_SENTINEL', {exact:false}).count(),0);
    await page.locator('main').getByRole('button').first().click();
    await page.waitForURL('**/#/all-taxes');
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    await page.goto(base + '#/travel-tax', { waitUntil: 'networkidle' });
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    assert.equal(await page.locator('main input').first().isDisabled(),true);
    await page.goto(base + '#/login', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('main input').first().isDisabled(),true);
    assert.equal(await page.evaluate(() => localStorage.getItem('sohojkor_transactions')),null);
    assert.deepEqual(errors, []);
    console.log('Compiled Pages homepage, navigation, refresh and direct hash route PASS');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
