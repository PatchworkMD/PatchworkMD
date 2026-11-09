import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright-core');
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE || undefined,
  args: ['--no-sandbox'],
});
const base = process.env.SITE_CHECK_URL ?? 'http://localhost:3010';
const output = new URL('../outputs/browser-check/', import.meta.url);
await mkdir(output, { recursive: true });
const results = [];
try {
  for (const width of [1440, 390, 320]) {
    console.log(`Checking ${width}px`);
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(base, { waitUntil: 'networkidle', timeout: 120000 });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.flash-background[data-ready="true"]').waitFor();
    await page.waitForTimeout(1100);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `home overflow at ${width}`);
    assert.equal(await page.evaluate(() => {
      const control = document.querySelector('.background-pause').getBoundingClientRect();
      const brand = document.querySelector('header .wordmark').getBoundingClientRect();
      return control.left < brand.right && control.right > brand.left && control.top < brand.bottom && control.bottom > brand.top;
    }), false, `control overlaps branding at ${width}`);
    const calls = page.locator('.intro-call-button');
    assert.equal(await calls.count(), 2);
    for (const link of await calls.all()) {
      assert.match(await link.getAttribute('href'), /^(mailto:hello@patchworkmd.dev\?subject=Project%20intro|https:\/\/cal\.com\/)/);
      const box = await link.boundingBox();
      assert.ok(box && box.height >= 44 && box.x >= 0 && box.x + box.width <= width, `call target at ${width}`);
    }
    const background = () => page.locator('.flash-background').evaluate(canvas => canvas.toDataURL());
    const moving = await background();
    await page.waitForTimeout(250);
    assert.notEqual(await background(), moving, `background should move at ${width}`);
    await page.getByRole('button', { name: 'Pause background', exact: true }).click();
    await page.waitForTimeout(100);
    const paused = await background();
    await page.waitForTimeout(250);
    assert.equal(await background(), paused, `pause control at ${width}`);
    await page.getByRole('button', { name: 'Play background', exact: true }).click();
    await page.screenshot({ path: new URL(`home-${width}.png`, output).pathname, fullPage: true });
    await page.getByRole('link', { name: 'Let’s talk' }).click();
    const overlap = await page.evaluate(() => {
      const control = document.querySelector('.background-pause').getBoundingClientRect();
      return [...document.querySelectorAll('.intro-call a')].some(link => {
        const box = link.getBoundingClientRect();
        return control.left < box.right && control.right > box.left && control.top < box.bottom && control.bottom > box.top;
      });
    });
    assert.equal(overlap, false, `control overlaps contact links at ${width}`);
    await page.locator('#intro-call').screenshot({ path: new URL(`intro-${width}.png`, output).pathname });
    await page.keyboard.press('Tab');
    await calls.last().focus();
    assert.notEqual(await calls.last().evaluate(link => getComputedStyle(link).outlineStyle), 'none');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(250);
    const still = await background();
    await page.mouse.move(width / 2, 200);
    await page.waitForTimeout(250);
    assert.equal(await background(), still, `dynamic reduced motion at ${width}`);
    assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0);
    await page.screenshot({ path: new URL(`reduced-${width}.png`, output).pathname });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('.flash-background[data-ready="true"]').waitFor();
    const initialStill = await background();
    await page.waitForTimeout(250);
    assert.equal(await background(), initialStill, `initial reduced motion at ${width}`);
    for (const path of ['/orbit', '/privacy']) {
      await page.goto(base + path, { waitUntil: 'networkidle' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${path} overflow at ${width}`);
      await page.screenshot({ path: new URL(`${path.slice(1)}-${width}.png`, output).pathname, fullPage: true });
    }
    results.push({ width, errors, layout: 'pass', bookingTargets: 'pass', motion: 'pass', reducedMotion: 'pass' });
    assert.deepEqual(errors, [], `console and HTTP errors at ${width}`);
    await page.close();
  }
  await writeFile(new URL('results.json', output), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
