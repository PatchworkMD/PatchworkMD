import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findPrivateData } from './private-data.mjs';

const at = '@';
const phone = ['412', '555', '0134'];

test('personal email addresses and phone numbers are flagged', () => {
  assert.deepEqual(
    findPrivateData(
      'scripts/fixture.mjs',
      `lead: jane.doe${at}gmail.com, call ${phone.join('-')} or (${phone[0]}) ${phone[1]}-${phone[2]}`,
    ),
    [
      `scripts/fixture.mjs: email jane.doe${at}gmail.com`,
      `scripts/fixture.mjs: phone ${phone.join('-')}`,
      `scripts/fixture.mjs: phone (${phone[0]}) ${phone[1]}-${phone[2]}`,
    ],
  );
  assert.deepEqual(
    findPrivateData('a.tsx', `href="mailto:someone${at}gmail.com"`),
    [`a.tsx: email someone${at}gmail.com`],
  );
});

test('site mailboxes, synthetic domains, URL credentials, and dates pass', () => {
  assert.deepEqual(
    findPrivateData(
      'lib/x.ts',
      [
        `hello${at}patchworkmd.dev`,
        `mailto:support${at}patchworkmd.dev`,
        `ada${at}example.com`,
        `lead${at}clinic.test`,
        `https://user:pass${at}cal.com/austin/intro`,
        '2026-11-10 12:30:45',
        'sha512-AbC123==',
      ].join('\n'),
    ),
    [],
  );
});

test('tracked data exports are flagged by name', () => {
  for (const path of ['fixtures/leads.csv', 'referrals.xlsx', 'contacts.vcf'])
    assert.deepEqual(findPrivateData(path, ''), [`${path}: data export file`]);
});
