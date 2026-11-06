import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { after, before, describe, test } from 'node:test';
import { chromium } from 'playwright-core';
import { stageOf } from '../lib/products.ts';

const port = process.env.SITE_CHECK_PORT ?? '3030';
const base = process.env.SITE_CHECK_URL ?? `http://127.0.0.1:${port}`;
const output = new URL('../outputs/browser-check/', import.meta.url);
const shot = (name) => new URL(`${name}.png`, output).pathname;
const widths = [1440, 390, 320];
let server;
let browser;

async function waitForSite() {
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Site did not start at ${base}`);
}

before(async () => {
  await mkdir(output, { recursive: true });
  if (!process.env.SITE_CHECK_URL) {
    const command =
      process.env.SITE_CHECK_RUNTIME === 'worker'
        ? [
            'wrangler',
            'dev',
            '--config',
            'dist/server/wrangler.json',
            '--port',
            port,
          ]
        : ['vinext', 'start', '-p', port];
    server = spawn('npx', command, {
      detached: true,
      stdio: 'ignore',
    });
  }
  await waitForSite();
  browser = await chromium.launch({
    executablePath: process.env.BROWSER_EXECUTABLE || undefined,
    args: ['--no-sandbox'],
  });
});

after(async () => {
  await browser?.close();
  if (server) process.kill(-server.pid);
});

async function open(path, options = {}) {
  const { init, ...contextOptions } = options;
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
    ...contextOptions,
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().endsWith('.mp4'))
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.addInitScript(() => {
    window.__frames = 0;
    const request = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
      window.__frames++;
      return request(callback);
    };
  });
  if (init) await page.addInitScript(init);
  await page.goto(base + path, { waitUntil: 'networkidle' });
  return { page, errors };
}

const overflows = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
const pixels = (locator) => locator.evaluate((canvas) => canvas.toDataURL());
const framesDuring = async (page, ms) => {
  const start = await page.evaluate(() => window.__frames);
  await page.waitForTimeout(ms);
  return (await page.evaluate(() => window.__frames)) - start;
};
const runningAnimations = (page) =>
  page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((animation) => animation.playState === 'running').length,
  );

describe('routes and metadata', () => {
  test('a catalogue Product page renders with canonical and social metadata', async () => {
    const response = await fetch(`${base}/2d0`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(
      html,
      /<link rel="canonical" href="https:\/\/patchworkmd\.dev\/2d0"/,
    );
    assert.match(
      html,
      /<meta property="og:url" content="https:\/\/patchworkmd\.dev\/2d0"/,
    );
    assert.match(html, /<title>2DO — A whiteboard for your tasks\.<\/title>/);
  });

  test('an Alias permanently redirects and an unknown slug is 404', async () => {
    const alias = await fetch(`${base}/localmodelfit`, { redirect: 'manual' });
    assert.equal(alias.status, 308);
    assert.equal(
      new URL(alias.headers.get('location'), base).pathname,
      '/localmodelmatch',
    );
    assert.equal((await fetch(`${base}/not-a-product`)).status, 404);
  });

  test('homepage, Orbit, and OpenNGP show the catalogue Stage', async () => {
    const home = await (await fetch(base)).text();
    const orbit = await (await fetch(`${base}/orbit`)).text();
    const openngp = await (await fetch(`${base}/openngp`)).text();
    assert.match(home, new RegExp(`<strong>${stageOf('orbit')}</strong>`));
    assert.match(orbit, new RegExp(`<dd>${stageOf('orbit')}</dd>`));
    assert.match(openngp, new RegExp(`class="eyebrow">${stageOf('openngp')}<`));
  });
});

describe('layout, keyboard, and booking at every width', () => {
  for (const width of widths) {
    test(`${width}px: no overflow, skip link first, booking targets usable`, async () => {
      const { page, errors } = await open('/', {
        viewport: { width, height: 900 },
      });
      assert.equal(await overflows(page), false);
      await page.keyboard.press('Tab');
      assert.equal(
        await page.evaluate(() => document.activeElement?.textContent),
        'Skip to content',
      );
      const calls = page.locator('.intro-call-button');
      assert.equal(await calls.count(), 2);
      for (const link of await calls.all()) {
        assert.match(
          await link.getAttribute('href'),
          /^(mailto:hello@patchworkmd.dev\?subject=Project%20intro|https:\/\/cal\.com\/)/,
        );
        const box = await link.boundingBox();
        assert.ok(
          box && box.height >= 44 && box.x >= 0 && box.x + box.width <= width,
        );
      }
      await calls.last().focus();
      assert.notEqual(
        await calls
          .last()
          .evaluate((link) => getComputedStyle(link).outlineStyle),
        'none',
      );
      const control = await page.locator('.background-pause').boundingBox();
      const brand = await page.locator('header .wordmark').boundingBox();
      assert.ok(
        control.x >= brand.x + brand.width ||
          control.y >= brand.y + brand.height ||
          control.x + control.width <= brand.x,
        'motion control overlaps the wordmark',
      );
      await page.screenshot({ path: shot(`home-${width}`), fullPage: true });
      for (const path of ['/orbit', '/privacy', '/2d0']) {
        await page.goto(base + path, { waitUntil: 'networkidle' });
        assert.equal(await overflows(page), false, `${path} overflow`);
        await page.screenshot({
          path: shot(`${path.slice(1)}-${width}`),
          fullPage: true,
        });
      }
      assert.deepEqual(errors, []);
      await page.close();
    });
  }
});

describe('homepage motion', () => {
  test('Pause motion stops the background and lettering shader, and Play resumes them', async () => {
    const { page, errors } = await open('/');
    const background = page.locator('.flash-background');
    await page.locator('.ink-shader[data-shader="ready"]').waitFor();
    assert.ok((await framesDuring(page, 400)) > 4, 'artwork schedules frames');
    await page.locator('.background-pause').click();
    await page.waitForTimeout(150);
    assert.equal(await framesDuring(page, 400), 0, 'no frames while paused');
    const stillBackground = await pixels(background);
    await page.mouse.move(700, 300);
    await page.waitForTimeout(300);
    assert.equal(await pixels(background), stillBackground);
    await page.locator('.background-pause').click();
    assert.ok((await framesDuring(page, 400)) > 4, 'frames resume on Play');
    assert.deepEqual(errors, []);
    await page.close();
  });

  test('hidden documents and reduced motion schedule no frames', async () => {
    const { page, errors } = await open('/');
    await page.locator('.ink-shader[data-shader="ready"]').waitFor();
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => true,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(150);
    assert.equal(await framesDuring(page, 400), 0, 'hidden');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => false,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.ok((await framesDuring(page, 400)) > 4, 'visible again');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(150);
    assert.equal(await framesDuring(page, 400), 0, 'dynamic reduced motion');
    assert.equal(await runningAnimations(page), 0);
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('.ink-shader[data-shader="ready"]').waitFor();
    await page.waitForTimeout(150);
    assert.equal(await framesDuring(page, 400), 0, 'initial reduced motion');
    await page.screenshot({ path: shot('reduced-1440') });
    assert.deepEqual(errors, []);
    await page.close();
  });

  test('without WebGL the lettering falls back to SVG and the ASCII art still draws', async () => {
    const init = () => {
      const getContext = Object.getOwnPropertyDescriptor(
        HTMLCanvasElement.prototype,
        'getContext',
      ).value;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        return type === 'webgl' ? null : getContext.call(this, type, ...rest);
      };
    };
    for (const [path, shader, lettering, ascii] of [
      ['/', '.ink-shader', '.flash-lettering text', '.flash-background'],
      [
        '/orbit',
        '.orbit-ink-shader',
        '.orbit-lettering text',
        '.orbit-ascii-rocket',
      ],
    ]) {
      const { page, errors } = await open(path, { init });
      await page.locator(`${ascii}[data-ready="true"]`).waitFor();
      assert.equal(
        await page.locator(shader).getAttribute('data-shader'),
        null,
      );
      assert.ok(await page.locator(lettering).isVisible(), `${path} lettering`);
      assert.deepEqual(errors, [], path);
      await page.close();
    }
  });
});

describe('Orbit motion', () => {
  test('one Pause motion control stops stars, UFO, and artwork', async () => {
    const { page, errors } = await open('/orbit');
    await page.locator('.orbit-ascii-rocket[data-ready="true"]').waitFor();
    assert.ok((await runningAnimations(page)) > 0, 'stars twinkle');
    await page.keyboard.press('Tab');
    assert.equal(
      await page.evaluate(() => document.activeElement?.textContent),
      'Skip to content',
    );
    await page.locator('.background-pause').click();
    await page.waitForTimeout(150);
    assert.equal(await runningAnimations(page), 0);
    assert.equal(await framesDuring(page, 400), 0);
    await page.locator('.background-pause').click();
    assert.ok((await runningAnimations(page)) > 0, 'stars resume');
    assert.deepEqual(errors, []);
    await page.close();
  });
});

describe('2DO product film', () => {
  for (const width of widths) {
    test(`${width}px: autoplays only with motion permission and toggles by keyboard`, async () => {
      for (const reducedMotion of ['no-preference', 'reduce']) {
        const { page, errors } = await open('/2d0', {
          viewport: { width, height: 900 },
          reducedMotion,
        });
        const video = page.locator('video');
        const button = page.locator('.film-toggle');
        await page.waitForTimeout(600);
        const paused = await video.evaluate((element) => element.paused);
        assert.equal(paused, reducedMotion === 'reduce');
        assert.equal(
          await button.textContent(),
          paused ? 'Play film' : 'Pause film',
        );
        await button.focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(300);
        assert.equal(
          await video.evaluate((element) => element.paused),
          !paused,
        );
        const box = await button.boundingBox();
        assert.ok(box.height >= 44 && box.width >= 44);
        assert.equal(await page.locator('summary h2').count(), 0);
        assert.deepEqual(errors, []);
        await page.close();
      }
    });
  }

  test('reduced motion turned on while playing pauses the film', async () => {
    const { page } = await open('/2d0');
    const video = page.locator('video');
    await page.waitForTimeout(600);
    assert.equal(await video.evaluate((element) => element.paused), false);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(200);
    assert.equal(await video.evaluate((element) => element.paused), true);
    await page.close();
  });

  test('a film that cannot load is announced and can be retried', async () => {
    const page = await browser.newPage({ reducedMotion: 'no-preference' });
    await page.route('**/*.mp4', (route) => route.abort());
    await page.goto(`${base}/2d0`, { waitUntil: 'networkidle' });
    const status = page.getByRole('status');
    await status.filter({ hasText: 'could not load' }).waitFor();
    assert.equal(
      await page.locator('.film-toggle').textContent(),
      'Try the film again',
    );
    assert.ok(await page.locator('video').getAttribute('poster'));
    await page
      .locator('.product-motion-figure')
      .screenshot({ path: shot('film-failed') });
    await page.close();
  });
});
