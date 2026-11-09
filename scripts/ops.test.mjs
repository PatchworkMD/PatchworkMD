import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { balanceOnDelivery, opsPricing } from '../lib/ops-pricing.ts';

const root = new URL('../', import.meta.url);
const priceOwners = new Set(['lib/ops-pricing.ts', 'app/2do/facts.ts']);

test('PatchworkMD Ops prices match Austin’s RGE 2081 decision', () => {
  assert.deepEqual(opsPricing, { pilot: 750, deposit: 375, care: 500 });
  assert.equal(opsPricing.deposit + balanceOnDelivery, opsPricing.pilot);
});

test('every price in the site source comes from one config constant', () => {
  const sources = ['app', 'components', 'lib'].flatMap((dir) =>
    readdirSync(new URL(dir, root), { recursive: true })
      .filter((file) => /\.(tsx?|json|mjs)$/.test(file))
      .map((file) => `${dir}/${file}`),
  );
  assert.ok(sources.includes('app/ops/page.tsx'), 'the Ops page is scanned');
  const scattered = sources.filter(
    (file) =>
      !priceOwners.has(file) &&
      /\$\d/.test(readFileSync(new URL(file, root), 'utf8')),
  );
  assert.deepEqual(scattered, []);
});
