import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TESTFLIGHT_URL, testflightLink } from '../app/2do/facts.ts';

test('a TestFlight placeholder or blank link means the beta is not open yet', () => {
  assert.equal(testflightLink('[TESTFLIGHT LINK]'), null);
  assert.equal(testflightLink('  '), null);
  assert.equal(testflightLink(TESTFLIGHT_URL), null);
});

test('only a public TestFlight invite link is accepted', () => {
  assert.equal(
    testflightLink(' https://testflight.apple.com/join/AbC123xy '),
    'https://testflight.apple.com/join/AbC123xy',
  );
  for (const value of [
    'http://testflight.apple.com/join/AbC123xy',
    'https://testflight.apple.com/',
    'https://testflight.apple.com/join/',
    'https://testflight.apple.com.evil.example/join/AbC123xy',
    'https://testflight.apple.com/join/AbC123xy?ref=site',
    'https://apps.apple.com/join/AbC123xy',
  ])
    assert.throws(() => testflightLink(value), /TestFlight/, value);
});
