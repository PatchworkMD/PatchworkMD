// Run with BASE_URL=http://localhost:4173 PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/portfolio-browser.mjs
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://localhost:4173';
const output = process.env.QA_OUTPUT || '/tmp/patchworkmd-browser-qa';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  await page.locator('canvas[data-ready="true"]').waitFor({ timeout: 20000 });
  await page.getByRole('button', { name: 'Pause motion' }).click();
  assert.equal(await page.getByRole('button', { name: 'Play motion' }).getAttribute('aria-pressed'), 'true');
  const still = await page.locator('canvas').screenshot();
  await page.waitForTimeout(180);
  assert.deepEqual(await page.locator('canvas').screenshot(), still, 'Pause must hold the image still');
  await page.getByRole('button', { name: 'Play motion' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Pause motion' }).waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('summary').first().click();
  assert.equal(await page.locator('details').first().getAttribute('open'), '');
  await page.locator('summary').first().click();
  await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  assert.notEqual(focus, 'none', 'Keyboard navigation needs a visible focus indicator');
  const routes = ['/', '/localmodelmatch', '/openngp', '/openngp/faq', '/2d0', '/dreamer', '/orbit', '/app-design-research', '/airplayify', '/type-b', '/unicycle', '/privacy'];
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 1000 });
    for (const route of routes) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, route);
      await page.evaluate(async () => { for (const image of document.images) { image.loading = 'eager'; await image.decode().catch(() => {}); } await document.fonts.ready; });
      const result = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter(image => !image.naturalWidth).map(image => image.src), forms: document.querySelectorAll('form,input,textarea').length }));
      assert.equal(result.overflow, false, `${route} overflows at ${width}`);
      assert.deepEqual(result.broken, [], `${route} has broken images`);
      assert.equal(result.forms, 0, `${route} unexpectedly collects visitor input`);
      if (route === '/') {
        assert.equal(await page.locator('.cover-image').evaluate(element => getComputedStyle(element).opacity), '1', 'The hero must be visible from the first frame');
        await page.locator('canvas[data-ready="true"]').waitFor();
        await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true });
      }
      if (width === 1440 && ['/privacy','/app-design-research','/openngp','/2d0','/unicycle'].includes(route)) await page.screenshot({ path: `${output}/${route.slice(1)}.png`, fullPage: true });
    }
  }
  assert.deepEqual(errors, [], 'No runtime page errors');
  const draft = await page.goto(base + '/2d0/privacy');
  assert.equal(draft.status(), 404, 'The private app policy draft must not be a published route');
  const fallback = await browser.newPage();
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) { return type === 'webgl' ? null : original.call(this, type, ...args); };
  });
  await fallback.goto(base);
  await fallback.locator('.image-frame img').evaluate(image => image.decode());
  assert.equal(await fallback.locator('canvas').getAttribute('data-ready'), 'false');
  assert.equal(await fallback.getByRole('button', { name: 'Pause motion' }).count(), 0);
  assert.equal(await fallback.locator('.image-frame img').isVisible(), true);
  console.log('PASS: 12 routes × 3 widths; images; overflow; no forms; shader; pause; reduced motion; keyboard; WebGL fallback; unpublished draft excluded.');
} finally { await browser.close(); }
