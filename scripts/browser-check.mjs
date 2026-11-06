import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { after, before, describe, test } from 'node:test';
import { chromium } from 'playwright-core';
import { availabilityOf, stageOf } from '../lib/products.ts';
import { startSite, waitForSite } from './site-server.mjs';

const port = process.env.SITE_CHECK_PORT ?? '3030';
const base = process.env.SITE_CHECK_URL ?? `http://127.0.0.1:${port}`;
const output = new URL('../outputs/browser-check/', import.meta.url);
const shot = (name) => new URL(`${name}.png`, output).pathname;
const widths = [1440, 390, 320];
let site;
let browser;

before(
  async () => {
    await mkdir(output, { recursive: true });
    if (!process.env.SITE_CHECK_URL) {
      site = startSite(
        'npx',
        process.env.SITE_CHECK_RUNTIME === 'worker'
          ? [
              'wrangler',
              'dev',
              '--config',
              'dist/server/wrangler.json',
              '--port',
              port,
            ]
          : ['vinext', 'start', '-p', port],
      );
    }
    const ready = waitForSite(base, { describe: site?.describe });
    await (site ? Promise.race([ready, site.exited]) : ready);
    browser = await chromium.launch({
      executablePath: process.env.BROWSER_EXECUTABLE || undefined,
      args: ['--no-sandbox'],
      timeout: 60000,
    });
  },
  { timeout: 200000 },
);

after(async () => {
  await browser?.close();
  site?.stop();
});

async function open(path, options = {}) {
  const { init, initArg, ...contextOptions } = options;
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
  if (init) await page.addInitScript(init, initArg);
  await page.goto(base + path, { waitUntil: 'networkidle' });
  return { page, errors };
}

const instrumentGraphics = (failStage) => {
  const proto = WebGLRenderingContext.prototype;
  const live = (gl, delta) => {
    gl.canvas.__live = (gl.canvas.__live ?? 0) + delta;
    window.__glCreated = (window.__glCreated ?? 0) + Math.max(delta, 0);
    window.__glDeleted = (window.__glDeleted ?? 0) + Math.max(-delta, 0);
  };
  const failing = {
    compile: ['getShaderParameter', () => false],
    link: ['getProgramParameter', () => false],
    buffer: ['createBuffer', () => null],
    texture: ['createTexture', () => null],
  }[failStage];
  for (const name of [
    'createShader',
    'createProgram',
    'createBuffer',
    'createTexture',
  ]) {
    const original = Object.getOwnPropertyDescriptor(proto, name).value;
    proto[name] = function (...args) {
      if (failing?.[0] === name) return failing[1]();
      const resource = original.apply(this, args);
      if (resource) live(this, 1);
      return resource;
    };
  }
  for (const name of [
    'deleteShader',
    'deleteProgram',
    'deleteBuffer',
    'deleteTexture',
  ]) {
    const original = Object.getOwnPropertyDescriptor(proto, name).value;
    proto[name] = function (resource) {
      if (resource) live(this, -1);
      return original.call(this, resource);
    };
  }
  if (failing && !failing[0].startsWith('create')) {
    const original = Object.getOwnPropertyDescriptor(proto, failing[0]).value;
    proto[failing[0]] = function (...args) {
      original.apply(this, args);
      return failing[1]();
    };
  }
  const drawArrays = Object.getOwnPropertyDescriptor(proto, 'drawArrays').value;
  proto.drawArrays = function (...args) {
    this.canvas.__draws = (this.canvas.__draws ?? 0) + 1;
    return drawArrays.apply(this, args);
  };
  const text = CanvasRenderingContext2D.prototype;
  const fillText = Object.getOwnPropertyDescriptor(text, 'fillText').value;
  text.fillText = function (...args) {
    this.canvas.__draws = (this.canvas.__draws ?? 0) + 1;
    return fillText.apply(this, args);
  };
};

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

  test('catalogue Stage and availability reach every page that shows them', async () => {
    const page = async (path) =>
      (await (await fetch(base + path)).text()).replaceAll('<!-- -->', '');
    const [home, orbit, openngp, localmodelmatch] = await Promise.all(
      ['/', '/orbit', '/openngp', '/localmodelmatch'].map(page),
    );
    const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const count = (html, text) =>
      html.match(new RegExp(escape(text), 'g'))?.length ?? 0;
    assert.match(home, new RegExp(`<strong>${stageOf('orbit')}</strong>`));
    assert.match(orbit, new RegExp(`<dd>${stageOf('orbit')}</dd>`));
    assert.match(openngp, new RegExp(`class="eyebrow">${stageOf('openngp')}<`));
    assert.ok(count(home, `01 / ${stageOf('localmodelmatch')}`) === 1);
    assert.match(
      localmodelmatch,
      new RegExp(`LocalModelMatch · ${stageOf('localmodelmatch')}`),
    );
    assert.ok(count(home, availabilityOf('localmodelmatch')) === 1);
    assert.ok(count(home, availabilityOf('orbit')) >= 2, 'spotlight and index');
    assert.ok(count(orbit, availabilityOf('orbit')) >= 1);
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

describe('artwork lifecycle', () => {
  for (const stage of ['compile', 'link', 'buffer', 'texture']) {
    test(`a ${stage} failure releases every WebGL resource and keeps the SVG lettering`, async () => {
      const { page, errors } = await open('/orbit', {
        init: instrumentGraphics,
        initArg: stage,
      });
      await page.locator('.orbit-ascii-rocket[data-ready="true"]').waitFor();
      const { created, deleted } = await page.evaluate(() => ({
        created: window.__glCreated,
        deleted: window.__glDeleted,
      }));
      assert.ok(created > 0, `${stage}: something was allocated first`);
      assert.equal(deleted, created, `${stage}: partial allocations released`);
      assert.equal(
        await page.locator('.orbit-ink-shader').getAttribute('data-shader'),
        null,
      );
      assert.ok(await page.locator('.orbit-lettering text').isVisible());
      assert.deepEqual(errors, []);
      await page.close();
    });
  }

  test('leaving the homepage by client navigation stops its loops and frees its WebGL resources', async () => {
    const { page, errors } = await open('/', { init: instrumentGraphics });
    await page.locator('.ink-shader[data-shader="ready"]').waitFor();
    await page.evaluate(() => {
      window.__sameDocument = true;
      window.__homeCanvases = [
        document.querySelector('.ink-shader'),
        document.querySelector('.flash-background'),
      ];
    });
    assert.ok(
      await page.evaluate(() => window.__homeCanvases[0].__live > 0),
      'shader resources were allocated',
    );
    await page.locator('header').getByRole('link', { name: 'Orbit' }).click();
    await page.locator('.orbit-ascii-rocket[data-ready="true"]').waitFor();
    assert.equal(
      await page.evaluate(() => window.__sameDocument),
      true,
      'navigation stayed in the same document',
    );
    const draws = () =>
      page.evaluate(() =>
        window.__homeCanvases.map((canvas) => [
          canvas.isConnected,
          canvas.__draws,
        ]),
      );
    const before = await draws();
    await page.waitForTimeout(600);
    assert.deepEqual(await draws(), before, 'unmounted canvases stop drawing');
    assert.ok(before.every(([connected]) => !connected));
    assert.equal(
      await page.evaluate(() => window.__homeCanvases[0].__live),
      0,
      'homepage shader resources released',
    );
    assert.deepEqual(errors, []);
    await page.close();
  });
});

describe('site-wide pause', () => {
  test('Pause motion holds while scrolling: no reveal or entrance animates', async () => {
    const { page, errors } = await open('/');
    await page.locator('.background-pause').click();
    for (let y = 0; y < 6000; y += 600) {
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(80);
      assert.equal(await runningAnimations(page), 0, `animation at ${y}px`);
    }
    assert.equal(
      await page
        .locator('.intro-call > div')
        .evaluate((el) => getComputedStyle(el).opacity),
      '1',
    );
    assert.equal(await framesDuring(page, 400), 0);
    assert.deepEqual(errors, []);
    await page.close();
  });

  test('Pause motion survives client navigation into the 2DO film, and Play film still works', async () => {
    const { page, errors } = await open('/');
    await page.evaluate(() => {
      window.__sameDocument = true;
    });
    await page.locator('.background-pause').click();
    await page.locator('.project a[href="/2d0"]').click();
    const video = page.locator('video');
    await video.waitFor();
    await page.waitForTimeout(800);
    assert.equal(await page.evaluate(() => window.__sameDocument), true);
    assert.equal(await video.evaluate((element) => element.paused), true);
    assert.equal(
      await page.locator('.background-pause').textContent(),
      'Play motion',
    );
    const film = page.locator('.film-toggle');
    assert.equal(await film.textContent(), 'Play film');
    await film.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    assert.equal(await video.evaluate((element) => element.paused), false);
    await page.locator('.background-pause').click();
    await page.locator('.background-pause').click();
    await page.waitForTimeout(300);
    assert.equal(
      await video.evaluate((element) => element.paused),
      true,
      'pausing the site again pauses the film',
    );
    assert.deepEqual(errors, []);
    await page.close();
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

  test('a film that cannot load is announced, and retry plays it once the file is back', async () => {
    const page = await browser.newPage({ reducedMotion: 'no-preference' });
    let available = false;
    await page.route('**/*.mp4', (route) =>
      available ? route.continue() : route.abort(),
    );
    await page.goto(`${base}/2d0`, { waitUntil: 'networkidle' });
    const status = page.locator('output.film-status');
    const retry = page.locator('.film-toggle');
    await status.filter({ hasText: 'could not load' }).waitFor();
    assert.equal(await retry.textContent(), 'Try the film again');
    assert.ok(await page.locator('video').getAttribute('poster'));
    await page
      .locator('.product-motion-figure')
      .screenshot({ path: shot('film-failed') });

    await retry.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
    assert.match(
      await status.textContent(),
      /could not load/,
      'second failure still explained',
    );
    assert.equal(await retry.textContent(), 'Try the film again');

    available = true;
    await retry.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('video').paused);
    assert.equal(await status.textContent(), '');
    assert.equal(await retry.textContent(), 'Pause film');
    await page.close();
  });
});
