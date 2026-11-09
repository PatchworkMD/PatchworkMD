import Image from 'next/image';
import Link from 'next/link';
import { pageMetadata } from '../../lib/seo';
import { resolveProduct } from '../../lib/products';
import { SiteFooter, SiteHeader } from '../../components/SiteChrome';

export const metadata = pageMetadata(
  '2DO — privacy and support',
  'Privacy policy and support for 2DO, the whiteboard task app.',
  '/2do',
  '2d0',
);

export default function TwoDo() {
  const resolution = resolveProduct('2d0');
  if (resolution.kind !== 'page')
    throw new Error('2DO is missing from lib/products.ts');
  const { name, logo, page } = resolution.product;
  return (
    <>
      <SiteHeader />
      <main id="main" className="site-information">
        <section className="intro">
          <div>
            <p className="eyebrow">
              {name} · {page.release}
            </p>
            {logo && (
              <Image
                src={logo.src}
                alt={logo.alt}
                width={88}
                height={88}
                className="app-logo"
                unoptimized
              />
            )}
            <h1>{name}</h1>
            <p className="bio">
              {page.tagline} {page.intro}
            </p>
          </div>
        </section>
        <section>
          <h2>Privacy</h2>
          <p>
            Your tasks stay on your device and there is no account.{' '}
            <Link href="/2do/privacy">Read the 2DO privacy policy</Link>.
          </p>
        </section>
        <section>
          <h2>Support</h2>
          <p>
            Questions, restoring purchases, and cancelling a subscription.{' '}
            <Link href="/2do/support">Get 2DO support</Link>.
          </p>
        </section>
        <section>
          <h2>More about 2DO</h2>
          <p>
            Features, the product film, and beta access are on the{' '}
            <Link href="/2d0">2DO product page</Link>.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
