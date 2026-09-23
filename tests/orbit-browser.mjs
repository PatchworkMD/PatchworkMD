// Run with BASE_URL=http://localhost:4174 node tests/orbit-browser.mjs
import assert from 'node:assert/strict';

const playwright = await import(process.env.PLAYWRIGHT_MODULE || '/Users/austinwise/node_modules/playwright/index.js');
const { chromium } = playwright.chromium ? playwright : playwright.default;
const base = process.env.BASE_URL || 'http://localhost:4174';
const executablePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

try {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 1000 });
    const response = await page.goto(`${base}/orbit`, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), 200, `/orbit at ${width}`);
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const video = document.querySelector('video');
      const track = video?.querySelector('track');
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        hasSkip: Boolean(document.querySelector('.skip')),
        hasMain: Boolean(document.querySelector('#main')),
        hasHeader: Boolean(document.querySelector('header')),
        hasFooter: Boolean(document.querySelector('footer')),
        availabilityLink: document.querySelector('header a[href="#start"]')?.getAttribute('href'),
        availabilityTarget: Boolean(document.querySelector('#start')),
        hasFilm: Boolean(video),
        controls: video?.controls,
        accessibleName: video?.getAttribute('aria-label'),
        autoplay: video?.autoplay,
        preload: video?.preload,
        poster: video?.poster,
        source: video?.querySelector('source')?.getAttribute('src'),
        captions: track?.getAttribute('src'),
        transcript: Boolean(document.querySelector('.orbit-transcript')),
        download: document.querySelector('a[download]')?.getAttribute('href'),
        textContrast: (() => {
          const rgb = (value) => value.match(/\d+/g).slice(0, 3).map(Number);
          const luminance = (value) => rgb(value).map((channel) => {
            const scaled = channel / 255;
            return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
          }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
          const background = luminance(getComputedStyle(document.querySelector('.orbit-page')).backgroundColor);
          return ['.orbit-faq-entry summary span:first-child', '.orbit-faq-entry p', '.orbit-availability-copy p:first-child', '.orbit-availability-copy p:last-child', '.orbit-film-status', '.orbit-transcript summary', '.orbit-transcript-copy p'].map((selector) => {
            const foreground = luminance(getComputedStyle(document.querySelector(selector)).color);
            return { selector, ratio: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05) };
          });
        })(),
        localAnchors: [...document.querySelectorAll('a[href^="#"]')].map((anchor) => ({
          href: anchor.getAttribute('href'),
          exists: Boolean(document.querySelector(anchor.getAttribute('href') || '')),
        })),
      };
    });
    assert.equal(result.overflow, false, `/orbit overflows at ${width}`);
    assert.equal(result.hasSkip, true, 'Orbit is missing a skip link');
    assert.equal(result.hasMain, true, 'Orbit is missing the skip-link target');
    assert.equal(result.hasHeader, true, 'Orbit is missing shared header');
    assert.equal(result.hasFooter, true, 'Orbit is missing shared footer');
    assert.equal(result.availabilityLink, '#start', 'Orbit Availability link must land on the availability section');
    assert.equal(result.availabilityTarget, true, 'Orbit is missing the Availability target');
    assert.equal(result.localAnchors.every((anchor) => anchor.exists), true, 'Orbit has a local link without a target');
    assert.equal(result.hasFilm, true, 'Orbit is missing its native film player');
    assert.equal(result.controls, true, 'Orbit film must expose native controls');
    assert.equal(result.accessibleName, 'Orbit product film', 'Orbit film must have an accessible name');
    assert.equal(result.autoplay, false, 'Orbit film must not autoplay');
    assert.equal(result.preload, 'metadata', 'Orbit film should load metadata only');
    assert.match(result.poster || '', /\/orbit\/orbit-film-poster\.jpg$/);
    assert.equal(result.source, '/orbit/orbit-film.mp4');
    assert.equal(result.captions, '/orbit/orbit-film.vtt');
    assert.equal(result.transcript, true, 'Orbit needs a text transcript');
    assert.equal(result.download, '/orbit/orbit-film.mp4');
    assert.equal(result.textContrast.every(({ ratio }) => ratio >= 4.5), true, `Orbit text contrast below 4.5:1 at ${width}: ${JSON.stringify(result.textContrast)}`);
  }

  assert.match(await page.locator('main').innerText(), /public signed installer is not available yet/i);
  assert.match(await page.locator('main').innerText(), /signing, notarization and public distribution checks remain open/i);
  assert.doesNotMatch(await page.locator('main').innerText(), /signed local release candidate/i);
  await page.locator('header a[href="#start"]').click();
  assert.equal(new URL(page.url()).hash, '#start', 'Orbit Availability link must update the URL hash');
  await page.locator('video').evaluate((video) => video.dispatchEvent(new Event('error')));
  assert.match(await page.locator('#orbit-film-status').innerText(), /Film unavailable/i, 'Orbit must expose a media-error fallback');
  assert.equal(await page.locator('a[href="https://github.com/PatchworkMD/orbit"]').count(), 0, 'Orbit must not claim an unverified public repository');
  assert.equal(errors.length, 0, `Runtime page errors: ${errors.join('; ')}`);
  console.log('PASS: Orbit route x 4 widths; shared chrome; native film attrs; captions; transcript; availability boundary.');
} finally {
  await browser.close();
}
