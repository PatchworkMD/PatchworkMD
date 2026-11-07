import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bookingDestination, introEmail } from '../lib/booking.ts';
import { readFileSync } from 'node:fs';

test('missing booking configuration keeps a working email destination', () => {
  assert.equal(bookingDestination(''), introEmail);
  assert.equal(bookingDestination('  '), introEmail);
});

test('only a direct Cal.com event is accepted', () => {
  assert.equal(
    bookingDestination(' https://cal.com/austin/intro '),
    'https://cal.com/austin/intro',
  );

  for (const value of [
    'https://cal.com',
    'https://cal.com/austin',
    'http://cal.com/austin/intro',
    'https://cal.com.evil.example/austin/intro',
    'https://evil.example/austin/intro',
    'javascript:alert(1)',
    'https://user:pass@cal.com/austin/intro',
    'https://cal.com:8443/austin/intro',
    'https://cal.com/austin/intro?redirect=elsewhere',
    'https://cal.com/austin/intro#fragment',
    'https://cal.com/austin/%2Fintro',
  ]) {
    assert.throws(() => bookingDestination(value), value);
  }
});

test('checked-in configuration is valid', () => {
  const config = JSON.parse(
    readFileSync(new URL('../lib/booking-config.json', import.meta.url)),
  );

  assert.equal(typeof config.calBookingUrl, 'string');
  assert.ok(bookingDestination(config.calBookingUrl));
});
