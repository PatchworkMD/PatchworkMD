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

/** The App Store page. A placeholder until Apple approves 2DO; set it on approval day. */
export const APP_STORE_URL = '[APP STORE LINK]';

export function appStoreLink(value: string = APP_STORE_URL): string | null {
  const trimmed = value.trim();
  if (!trimmed || /^\[.*\]$/.test(trimmed)) return null;
  const url = new URL(trimmed);
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'apps.apple.com' ||
    url.port ||
    url.username ||
    url.password ||
    !/^\/(?:[a-z]{2}\/)?app\/(?:[a-z0-9-]+\/)?id6809248837$/.test(
      url.pathname,
    ) ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'APP_STORE_URL must be the 2DO App Store page: https://apps.apple.com/app/id6809248837.',
    );
  }
  return url.href;
}

export const prices = {
  removeAds: '$1.99',
  plusMonthly: '$2.99 a month',
  plusLifetime: '$19.99',
  trial: '7-day free trial',
};

export const appleCancelUrl = 'https://support.apple.com/en-us/118428';
export const appleRefundUrl = 'https://support.apple.com/en-us/118223';
