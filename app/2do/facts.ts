export const supportEmail = 'support@patchworkmd.dev';

export const TESTFLIGHT_URL = '[TESTFLIGHT LINK]';

export function testflightLink(value: string = TESTFLIGHT_URL): string | null {
  const trimmed = value.trim();
  if (!trimmed || /^\[.*\]$/.test(trimmed)) return null;
  const url = new URL(trimmed);
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'testflight.apple.com' ||
    url.port ||
    url.username ||
    url.password ||
    !/^\/join\/[A-Za-z0-9]+$/.test(url.pathname) ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'TESTFLIGHT_URL must be a public TestFlight invite: https://testflight.apple.com/join/<code>.',
    );
  }
  return url.href;
}

export const prices = {
  removeAds: '$2.99',
  plusMonthly: '$3.99 a month',
  plusYearly: '$29.99 a year',
  plusLifetime: '$79.99',
  trial: '7-day free trial',
};

export const appleCancelUrl = 'https://support.apple.com/en-us/118428';
export const appleRefundUrl = 'https://support.apple.com/en-us/118223';
