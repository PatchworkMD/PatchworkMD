export const introEmail =
  'mailto:hello@patchworkmd.dev?subject=Project%20intro';

export function bookingDestination(value: string): string {
  if (!value.trim()) return introEmail;
  const url = new URL(value.trim());
  const segments = url.pathname.split('/').filter(Boolean);
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'cal.com' ||
    url.port ||
    url.username ||
    url.password ||
    segments.length !== 2 ||
    !segments.every((segment) => /^[a-zA-Z0-9_-]+$/.test(segment)) ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'Booking URL must be a direct HTTPS cal.com account/event URL without query parameters.',
    );
  }
  return url.href;
}
