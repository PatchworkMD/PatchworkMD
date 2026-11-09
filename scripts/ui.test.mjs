import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { test } from 'node:test';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = fileURLToPath(new URL('../', import.meta.url));
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier.startsWith('@/') ||
      (specifier.startsWith('.') &&
        !context.parentURL?.includes('/node_modules/'))
    ) {
      const base = specifier.startsWith('@/')
        ? pathToFileURL(root + specifier.slice(2)).href
        : new URL(specifier, context.parentURL).href;
      for (const suffix of ['', '.tsx', '.ts']) {
        if (existsSync(fileURLToPath(base + suffix))) {
          return nextResolve(base + suffix, context);
        }
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (/\.tsx?$/.test(url) && !url.includes('/node_modules/')) {
      return {
        format: 'module',
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
          compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.ESNext,
          },
        }).outputText,
      };
    }
    return nextLoad(url, context);
  },
});

const { ButtonGroup } = await import('../components/ui/button-group.tsx');
const { InputGroup, InputGroupAddon, InputGroupInput } =
  await import('../components/ui/input-group.tsx');
const { Label } = await import('../components/ui/label.tsx');
const { PaginationLink } = await import('../components/ui/pagination.tsx');
const { ItemGroup, Item } = await import('../components/ui/item.tsx');
const {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} = await import('../components/ui/carousel.tsx');
const { Spinner } = await import('../components/ui/spinner.tsx');
const { useIsMobile } = await import('../hooks/use-mobile.ts');
const html = (component, props, ...children) =>
  renderToStaticMarkup(React.createElement(component, props, ...children));

const IMPLICIT_ROLES = {
  a: 'link',
  button: 'button',
  fieldset: 'group',
  li: 'listitem',
  ol: 'list',
  output: 'status',
  section: 'region',
  ul: 'list',
};
const elements = (markup) =>
  [...markup.matchAll(/<([a-z]+)([^>]*)>/g)].map(([, tag, attrs]) => ({
    role:
      /\brole="([^"]+)"/.exec(attrs)?.[1] ?? IMPLICIT_ROLES[tag] ?? 'generic',
    name: /\baria-label="([^"]*)"/.exec(attrs)?.[1],
    attrs,
  }));
const roles = (markup) => elements(markup).map((element) => element.role);

test('groups expose a named group role around their controls', () => {
  const [buttons] = elements(
    html(ButtonGroup, { 'aria-label': 'Actions' }, 'Save'),
  );
  assert.deepEqual([buttons.role, buttons.name], ['group', 'Actions']);
  const markup = html(
    InputGroup,
    {},
    React.createElement(InputGroupAddon, {}, '$'),
    React.createElement(InputGroupInput, { id: 'amount' }),
  );
  assert.equal(roles(markup)[0], 'group');
  assert.match(markup, /<input[^>]*id="amount"/);
  assert.match(
    html(Label, { htmlFor: 'amount' }, 'Amount'),
    /<label[^>]*for="amount"[^>]*>Amount<\/label>/,
  );
});

test('pagination renders its link text and active state', () => {
  const markup = html(
    PaginationLink,
    { href: '/?page=2', isActive: true },
    '2',
  );
  const [link] = elements(markup);
  assert.equal(link.role, 'link');
  assert.match(link.attrs, /href="\/\?page=2"/);
  assert.match(link.attrs, /aria-current="page"/);
  assert.match(markup, />2</);
});

test('item groups are lists of items, and a standalone item claims no list role', () => {
  const markup = html(
    ItemGroup,
    {},
    React.createElement(Item, {}, 'First'),
    React.createElement(Item, {}, 'Second'),
  );
  assert.equal(roles(markup)[0], 'list');
  assert.equal(roles(markup).filter((role) => role === 'listitem').length, 2);
  assert.ok(!roles(html(Item, {}, 'Standalone')).includes('listitem'));
});

test('carousel is a named region with slide groups and disabled navigation before hydration', () => {
  const markup = html(
    Carousel,
    { 'aria-label': 'Work samples' },
    React.createElement(
      CarouselContent,
      {},
      React.createElement(CarouselItem, {}, 'Slide'),
    ),
    React.createElement(CarouselPrevious),
    React.createElement(CarouselNext),
  );
  const [region] = elements(markup);
  assert.deepEqual([region.role, region.name], ['region', 'Work samples']);
  const slide = elements(markup).find(({ attrs }) =>
    attrs.includes('aria-roledescription="slide"'),
  );
  assert.equal(slide?.role, 'group');
  const buttons = elements(markup).filter(({ role }) => role === 'button');
  assert.equal(buttons.length, 2);
  assert.ok(buttons.every(({ attrs }) => /\bdisabled\b/.test(attrs)));
});

test('spinner is a named status and the mobile hook has a server snapshot', () => {
  const [spinner] = elements(html(Spinner, { 'aria-label': 'Saving' }));
  assert.deepEqual([spinner.role, spinner.name], ['status', 'Saving']);
  function MobileState() {
    return React.createElement('span', {}, String(useIsMobile()));
  }
  assert.equal(html(MobileState), '<span>false</span>');
});

test('the product film renders without autoplay and with a play control and empty status', async () => {
  const { default: ProductFilm } =
    await import('../components/ProductFilm.tsx');
  const markup = html(ProductFilm, {
    name: '2DO',
    film: {
      src: '/film.mp4',
      poster: '/poster.png',
      label: 'Product film',
      caption: 'Silent film',
    },
  });
  assert.doesNotMatch(markup, /autoplay/i);
  assert.match(markup, /<video[^>]*aria-label="Product film"/);
  const button = elements(markup).find(({ role }) => role === 'button');
  assert.ok(button);
  assert.match(markup, />Play film<\/button>/);
  const status = elements(markup).find(({ role }) => role === 'status');
  assert.ok(status);
  assert.match(markup, /<output[^>]*><\/output>/);
});

test('the 2DO beta button waits for the TestFlight link, then links to it', async () => {
  const { default: BetaButton } = await import('../app/2do/BetaButton.tsx');
  const waiting = html(BetaButton, { href: null });
  assert.match(
    waiting,
    /<button[^>]*disabled=""[^>]*>beta opens soon<\/button>/,
  );
  assert.doesNotMatch(waiting, /<a /);
  const open = html(BetaButton, {
    href: 'https://testflight.apple.com/join/AbC123xy',
  });
  assert.match(
    open,
    /<a [^>]*href="https:\/\/testflight\.apple\.com\/join\/AbC123xy"[^>]*>Join the TestFlight beta<\/a>/,
  );
  assert.doesNotMatch(open, /<button/);
});

test('the Cal.com deposit line shows only when a booking URL is configured', async () => {
  const { default: DepositNote } =
    await import('../components/DepositNote.tsx');
  assert.equal(html(DepositNote, { bookingUrl: '' }), '');
  assert.match(
    html(DepositNote, { bookingUrl: 'https://cal.com/austin/ops-pilot' }),
    />Deposit: \$375, taken by Cal\.com at booking<\//,
  );
});
