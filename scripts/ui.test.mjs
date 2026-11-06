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

test('groups retain labels, children, and native semantics', () => {
  assert.match(
    html(ButtonGroup, { 'aria-label': 'Actions' }, 'Save'),
    /^<fieldset[^>]*aria-label="Actions"[^>]*>Save<\/fieldset>$/,
  );
  const markup = html(
    InputGroup,
    {},
    React.createElement(InputGroupAddon, {}, '$'),
    React.createElement(InputGroupInput, { id: 'amount' }),
  );
  assert.match(markup, /^<fieldset/);
  assert.match(markup, /id="amount"/);
  assert.match(
    html(Label, { htmlFor: 'amount' }, 'Amount'),
    /for="amount"[^>]*>Amount<\/label>/,
  );
});

test('pagination renders its link text and active state', () => {
  const markup = html(
    PaginationLink,
    { href: '/?page=2', isActive: true },
    '2',
  );
  assert.match(markup, /href="\/\?page=2"/);
  assert.match(markup, /aria-current="page"/);
  assert.match(markup, />2<\/a>/);
});

test('item groups create native list items without changing standalone items', () => {
  const markup = html(
    ItemGroup,
    {},
    React.createElement(Item, {}, 'First'),
    React.createElement(Item, {}, 'Second'),
  );
  assert.match(markup, /^<ul/);
  assert.equal((markup.match(/<li>/g) ?? []).length, 2);
  assert.match(html(Item, {}, 'Standalone'), /^<div/);
});

test('carousel has a named region and initially disabled navigation during SSR', () => {
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
  assert.match(markup, /^<section[^>]*aria-label="Work samples"/);
  assert.equal((markup.match(/ disabled=""/g) ?? []).length, 2);
  assert.match(markup, /<fieldset[^>]*aria-roledescription="slide"/);
});

test('spinner exposes its supplied accessible name and mobile hook has a server snapshot', () => {
  assert.match(
    html(Spinner, { 'aria-label': 'Saving' }),
    /^<output aria-label="Saving"/,
  );
  function MobileState() {
    return React.createElement('span', {}, String(useIsMobile()));
  }
  assert.equal(html(MobileState), '<span>false</span>');
});
