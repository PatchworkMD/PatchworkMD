import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { text } from 'node:stream/consumers';
import { parseArgs, stripVTControlCharacters } from 'node:util';
import { chromium } from 'playwright-core';
import {
  assertNothingServing,
  startSite,
  waitForSite,
} from './site-server.mjs';

const usage = `Usage:
  node scripts/pr-shot.mjs pages --out <dir> [--label before|after] [--url <base>] [--selector <css>] <path>...
    Full-page shots of each path at 1440 and 390 px, light and dark (or just the first --selector match).
    Without --url it serves the built site in the current directory (run npm run build first).
  <command> | node scripts/pr-shot.mjs terminal --out <dir> --name <file>
    Renders piped output as a terminal-style PNG.`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    out: { type: 'string' },
    label: { type: 'string', default: 'after' },
    url: { type: 'string' },
    port: { type: 'string', default: '3041' },
    name: { type: 'string', default: 'checks' },
    selector: { type: 'string' },
  },
});
const [mode, ...paths] = positionals;
if (!values.out || !['pages', 'terminal'].includes(mode)) {
  console.error(usage);
  process.exit(2);
}
await mkdir(values.out, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE || undefined,
  args: ['--no-sandbox'],
});
try {
  if (mode === 'terminal') await shootTerminal(await text(process.stdin));
  else await shootPages(paths);
} finally {
  await browser.close();
}

async function shootPages(paths) {
  if (!paths.length) throw new Error('pages needs at least one path');
  const base = values.url ?? `http://127.0.0.1:${values.port}`;
  let site;
  if (!values.url) {
    await assertNothingServing(base);
    site = startSite('npx', ['vinext', 'start', '-p', values.port]);
  }
  try {
    const ready = waitForSite(base, { describe: site?.describe });
    await (site ? Promise.race([ready, site.exited]) : ready);
    for (const path of paths)
      for (const width of [1440, 390])
        for (const colorScheme of ['light', 'dark']) {
          const page = await browser.newPage({
            viewport: { width, height: 900 },
            colorScheme,
            reducedMotion: 'reduce',
          });
          const response = await page.goto(base + path, {
            waitUntil: 'networkidle',
          });
          const slug =
            path === '/' ? 'home' : path.slice(1).replaceAll('/', '-');
          const file = join(
            values.out,
            `${values.label}-${slug}-${width}-${colorScheme}.png`,
          );
          await (values.selector
            ? page.locator(values.selector).first().screenshot({ path: file })
            : page.screenshot({ path: file, fullPage: true }));
          console.log(`${response?.status() ?? '?'} ${path} → ${file}`);
          await page.close();
        }
  } finally {
    site?.stop();
  }
}

async function shootTerminal(output) {
  const escaped = stripVTControlCharacters(output)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trimEnd();
  const page = await browser.newPage({
    viewport: { width: 1000, height: 400 },
  });
  await page.setContent(
    `<body style="margin:0;background:#11151a"><pre style="margin:0;padding:20px 24px;width:max-content;min-width:952px;box-sizing:border-box;color:#e6e9ef;background:#11151a;font:14px/1.5 ui-monospace,Menlo,Consolas,monospace">${escaped}</pre></body>`,
  );
  const file = join(values.out, `${values.name}.png`);
  await page.locator('pre').screenshot({ path: file });
  console.log(`terminal → ${file}`);
}
