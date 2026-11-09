import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}) });
const url = process.env.MATCHA_URL || 'http://127.0.0.1:5173/';
const errors = [];
async function open(viewport) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  await page.waitForSelector('.venue-card');
  return page;
}
try {
  const page = await open({ width: 1440, height: 1000 });
  const total = await page.locator('.venue-card').count();
  assert.ok(total > 0);
  assert.equal(await page.locator('.map-pin').count(), total);
  await page.locator('#search').fill('stonemill');
  assert.equal(await page.locator('.venue-card').count(), 1);
  assert.equal(await page.locator('.map-pin').count(), 1);
  await page.locator('[data-open="stonemill"]').click();
  assert.equal(await page.locator('#detail').isVisible(), true);
  assert.match(await page.locator('#detail h2').innerText(), /Stonemill/);
  await page.locator('.detail-save').click();
  assert.equal(await page.locator('#saved-count').innerText(), '1');
  assert.equal(await page.locator('.detail-save').evaluate(node => node === document.activeElement), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#detail').isVisible(), false);
  assert.equal(await page.locator('[data-open="stonemill"]').evaluate(node => node === document.activeElement), true);
  await page.reload(); await page.waitForSelector('.venue-card');
  assert.equal(await page.locator('#saved-count').innerText(), '1');
  await page.locator('#saved').click();
  assert.equal(await page.locator('.venue-card').count(), 1);
  await page.locator('[data-marker="stonemill"]').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-marker="stonemill"]').evaluate(node => node === document.activeElement), true);
  await page.locator('[data-save="stonemill"]').click();
  assert.equal(await page.locator('.venue-card').count(), 0);
  assert.equal(await page.locator('#clear-empty').evaluate(node => node === document.activeElement), true);
  await page.locator('#clear-empty').click();
  assert.equal(await page.locator('.venue-card').count(), total);
  await page.locator('#filters summary').click();
  await page.locator('#budget').selectOption('7');
  for (const price of await page.locator('.card-price').allTextContents()) {
    const amount = Number(price.match(/\$([\d.]+)/)?.[1]); assert.ok(amount > 0 && amount <= 7);
    assert.equal(price.includes('Check menu'), false);
  }
  await page.locator('#food').selectOption('drinks');
  await page.locator('#business').selectOption('boutique');
  // The combination can legitimately be empty, but must always keep map and list in sync.
  assert.equal(await page.locator('.map-pin').count(), await page.locator('.venue-card').count());
  await page.locator('#reset').click();
  await page.locator('#about').click();
  assert.equal(await page.locator('#about-dialog').evaluate(node => node.open), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#about-dialog').evaluate(node => node.open), false);
  await page.waitForTimeout(1800);
  const boxes = await page.locator('.map-pin').evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; }));
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a=boxes[i],b=boxes[j];
    assert.equal(a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y, false, `Pins ${i} and ${j} overlap`);
  }
  console.log(`Desktop: ${total} places; search, filters, details, save persistence, keyboard focus and pin collision checks passed.`);

  const mobile = await open({ width: 390, height: 844 });
  assert.equal(await mobile.locator('#mobile-view').isVisible(), true);
  await mobile.locator('#mobile-view').click();
  assert.equal(await mobile.locator('body').evaluate(node => node.classList.contains('show-map')), true);
  await mobile.waitForTimeout(600);
  const mobilePins = await mobile.locator('.map-pin').evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}; }));
  for (const pin of mobilePins) { assert.ok(pin.left >= 0 && pin.right <= 390 && pin.top >= 70 && pin.bottom <= 844, JSON.stringify(pin)); }
  for (let i = 0; i < mobilePins.length; i++) for (let j = i + 1; j < mobilePins.length; j++) {
    const a = mobilePins[i], b = mobilePins[j];
    assert.equal(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top, false, `Mobile pins ${i} and ${j} overlap`);
  }
  await mobile.locator('#mobile-view').click();
  await mobile.locator('#search').fill('stonemill');
  await mobile.locator('[data-open="stonemill"]').click();
  assert.equal(await mobile.locator('#detail').isVisible(), true);
  assert.equal(await mobile.locator('body').evaluate(node => node.classList.contains('show-map')), true);
  await mobile.locator('.detail-save').click();
  await mobile.locator('.detail-close').click();
  assert.equal(await mobile.locator('body').evaluate(node => node.classList.contains('show-map')), false);
  assert.equal(await mobile.locator('[data-open="stonemill"]').evaluate(node => node === document.activeElement), true);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await mobile.locator('#saved').click();
  await mobile.locator('[data-open="stonemill"]').click();
  await mobile.locator('.detail-save').click();
  assert.equal(await mobile.locator('#detail').isVisible(), false);
  assert.equal(await mobile.locator('body').evaluate(node => node.classList.contains('show-map')), false);
  assert.equal(await mobile.locator('#clear-empty').evaluate(node => node === document.activeElement), true);
  console.log('Mobile: map/list toggle, list-to-detail navigation, save/unsave, close focus and page width passed.');

  const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      if (type === 'webgl' || type === 'webgl2') return null;
      return original.call(this, type, ...args);
    };
  });
  await fallback.goto(url); await fallback.waitForSelector('.venue-card');
  assert.equal(await fallback.locator('.venue-card').count(), total);
  await fallback.locator('#search').fill('stonemill');
  await fallback.locator('[data-open="stonemill"]').click();
  assert.equal(await fallback.locator('#detail').isVisible(), true);
  assert.equal(await fallback.locator('#map-status').isVisible(), true);
  console.log('WebGL fallback: venue list, search and details remain usable.');
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
