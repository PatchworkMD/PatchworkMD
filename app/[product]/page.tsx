import { pageMetadata } from '../../lib/seo';
import { resolveProduct } from '../../lib/products';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { SiteFooter, SiteHeader } from '../../components/SiteChrome';
import ProductFilm from '../../components/ProductFilm';
import MotionToggle from '../../components/MotionToggle';

type Params = { params: Promise<{ product: string }> };

function productPage(slug: string) {
  const resolution = resolveProduct(slug);

  if (resolution.kind === 'redirect') permanentRedirect(resolution.to);

  if (resolution.kind === 'missing') notFound();

  return resolution.product;
}

export async function generateMetadata({ params }: Params) {
  const resolution = resolveProduct((await params).product);

  if (resolution.kind === 'missing')
    return { title: 'Not found', robots: { index: false } };

  const product =
    resolution.kind === 'redirect'
      ? productPage(resolution.to.slice(1))
      : resolution.product;

  return pageMetadata(
    product.name + ' — ' + product.page.tagline,
    product.page.intro + ' ' + product.page.release + '.',
    product.href,
  );
}

export default async function Product({ params }: Params) {
  const { slug, name, logo, page } = productPage((await params).product);

  return (
    <>
      <SiteHeader product />
      {page.film && <MotionToggle className="background-pause" />}
      <main id="main">
        <section className={`intro product-intro product-${slug}`}>
          <div className="intro-copy">
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
            <h1>{page.tagline}</h1>
            <p className="bio">{page.intro}</p>
            {page.links?.map((link) => (
              <a className="product-cta" href={link.href} key={link.href}>
                {link.label} →
              </a>
            ))}
          </div>
        </section>
        {page.preview && (
          <figure className="product-preview-figure">
            <Image
              src={page.preview.src}
              alt={page.preview.alt}
              width={1200}
              height={630}
              unoptimized
            />
            <figcaption>{page.preview.caption}</figcaption>
          </figure>
        )}
        {page.film && <ProductFilm film={page.film} name={name} />}
        <section aria-label="Product overview">
          {page.benefits.map(([a, b]) => (
            <article className="project" key={a}>
              <h2>{a}</h2>
              <p>{b}</p>
            </article>
          ))}
        </section>
        <section className="skills" id="start">
          <div className="section-title">
            <h2>Availability</h2>
            <span>{page.release}</span>
          </div>
          <p className="detail">{page.setup}</p>
        </section>
        <section className="skills" id="faq">
          <div className="section-title">
            <h2>Questions and answers</h2>
          </div>
          {page.faq.map(([a, b]) => (
            <details className="faq-entry" key={a}>
              <summary>
                <span className="faq-question">{a}</span>
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="detail">{b}</p>
            </details>
          ))}
        </section>
        <section className="contact">
          <h2>Get in touch</h2>
          <div>
            <p>For project questions, feedback and support.</p>
            <a href="mailto:hello@patchworkmd.dev">hello@patchworkmd.dev</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
