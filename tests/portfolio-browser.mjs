// Run with BASE_URL=http://localhost:4173 node tests/portfolio-browser.mjs
import assert from 'node:assert/strict';
const playwright = await import(process.env.PLAYWRIGHT_MODULE || '/Users/austinwise/node_modules/playwright/index.js');
const { chromium } = playwright.chromium ? playwright : playwright.default;

const base = process.env.BASE_URL || 'http://localhost:4173';
const executablePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const routes = [
  '/', '/localmodelmatch', '/openngp', '/openngp/faq', '/2d0', '/dreamer', '/orbit',
  '/app-design-research', '/appdesignresearch', '/airplayify', '/type-b', '/unicycle', '/privacy',
];

const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

try {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 1000 });
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(response?.status(), 200, route);
      await page.evaluate(async () => {
        for (const image of document.images) {
          image.loading = 'eager';
          await image.decode().catch(() => {});
        }
        await document.fonts.ready;
      });
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        broken: [...document.images].filter((image) => !image.naturalWidth).map((image) => image.src),
        forms: document.querySelectorAll('form,input,textarea').length,
        hasSkip: Boolean(document.querySelector('.skip')),
        hasMain: Boolean(document.querySelector('#main')),
        hasHeader: Boolean(document.querySelector('header')),
        hasFooter: Boolean(document.querySelector('footer')),
      }));
      assert.equal(result.overflow, false, `${route} overflows at ${width}`);
      assert.deepEqual(result.broken, [], `${route} has broken images`);
      assert.equal(result.forms, 0, `${route} unexpectedly collects visitor input`);
      assert.equal(result.hasSkip, true, `${route} is missing a skip link`);
      assert.equal(result.hasMain, true, `${route} is missing the skip-link target`);
      assert.equal(result.hasHeader, true, `${route} is missing shared header`);
      assert.equal(result.hasFooter, true, `${route} is missing shared footer`);
    }
  }

  await page.goto(base + '/', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('#orbit-spotlight').count(), 1, 'Homepage needs the Orbit campaign spotlight');
  assert.equal(await page.locator('a[href="/orbit"]').count() > 0, true, 'Homepage needs an Orbit campaign link');
  await page.getByRole('button', { name: 'Pause background' }).click();
  assert.equal(await page.getByRole('button', { name: 'Play background' }).count(), 1, 'Background pause control must be reversible');

  await page.goto(base + '/orbit', { waitUntil: 'networkidle' });
  assert.match(await page.locator('main').innerText(), /public signed installer is not available yet/i);
  assert.equal(await page.locator('a[href="https://github.com/PatchworkMD/orbit"]').count(), 0, 'Orbit must not claim an unverified public repository');

  await page.goto(base + '/appdesignresearch', { waitUntil: 'networkidle' });
  assert.equal(new URL(page.url()).pathname, '/app-design-research', 'Legacy App Design Research alias must redirect');
  assert.equal(errors.length, 0, `Runtime page errors: ${errors.join('; ')}`);
  console.log(`PASS: ${routes.length} routes x 3 widths; shared chrome; images; overflow; no forms; Orbit campaign; alias; motion control.`);
} finally {
  await browser.close();
}
