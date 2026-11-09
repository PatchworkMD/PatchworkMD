import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  indexedProducts,
  products,
  resolveProduct,
  stageOf,
} from '../lib/products.ts';

test('a catalogue slug resolves to its Product page', () => {
  const resolution = resolveProduct('2d0');
  assert.equal(resolution.kind, 'page');
  assert.equal(resolution.product.name, '2DO');
  assert.equal(resolution.product.page.release, 'iOS beta · build 2 approved');
});

test('an alias permanently redirects to the canonical Product page', () => {
  assert.deepEqual(resolveProduct('localmodelfit'), {
    kind: 'redirect',
    to: '/localmodelmatch',
  });
});

test('unknown slugs and hand-built Product pages are missing from the route', () => {
  for (const slug of ['nope', 'orbit', 'openngp', 'constructor', '__proto__']) {
    assert.deepEqual(resolveProduct(slug), { kind: 'missing' }, slug);
  }
});

test('the homepage index lists OpenNGP, 2DO, Dreamer, and Orbit with their Stage', () => {
  assert.deepEqual(
    indexedProducts().map(({ name, href, index }) => [name, href, index.stage]),
    [
      ['OpenNGP', '/openngp', 'In development'],
      ['2DO', '/2d0', 'In development'],
      ['Dreamer', '/dreamer', 'In development'],
      ['Orbit', '/orbit', 'Release candidate'],
    ],
  );
});

test('the sitemap lists every Product and nothing unknown', () => {
  const sitemap = readFileSync(
    new URL('../public/sitemap.xml', import.meta.url),
    'utf8',
  );
  const paths = [
    ...sitemap.matchAll(/<loc>https:\/\/patchworkmd\.dev(\/[^<]*)<\/loc>/g),
  ]
    .map(([, path]) => path)
    .sort((a, b) => a.localeCompare(b));
  const expected = [
    '/',
    '/openngp/faq',
    '/privacy',
    ...products.map((product) => product.href),
  ].sort((a, b) => a.localeCompare(b));
  assert.deepEqual(paths, expected);
});

test('hand-built Product pages read their Stage from the catalogue', () => {
  assert.equal(stageOf('orbit'), 'Release candidate');
  assert.equal(stageOf('openngp'), 'In development');
  assert.throws(() => stageOf('type-b'), /No Stage recorded for type-b/);
});
