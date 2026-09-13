import type { Metadata } from 'next';
export const SITE_URL = 'https://patchworkmd.dev';
export function pageMetadata(title: string, description: string, path = '/'): Metadata {
  const url = SITE_URL + path;
  const image = SITE_URL + '/social/' + (path === '/' ? 'patchwork' : path.slice(1).replaceAll('/', '-')) + '-v1.png';
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'patchwork.md', type: 'website', locale: 'en_US', images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
