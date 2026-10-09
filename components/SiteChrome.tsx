import Link from 'next/link';

type SiteHeaderProps = {
  product?: boolean;
  faq?: boolean;
  openngp?: boolean;
  install?: boolean;
};

function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export function SiteHeader({ product = false, faq = false, openngp = false, install = false }: SiteHeaderProps) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <Link className="wordmark" href="/" aria-label="PatchworkMD home">
          <Mark />
          <span>patchwork.md</span>
        </Link>
        <nav aria-label={product ? 'Product navigation' : 'Main navigation'}>
          {product ? (
            <>
              {openngp ? (
                <Link href="/openngp/faq">FAQ</Link>
              ) : faq ? (
                <Link href="/openngp">OpenNGP</Link>
              ) : (
                <a href={install ? '#install' : '#start'}>{install ? 'Install' : 'Availability'}</a>
              )}
              {!openngp && !faq && <a href="#faq">FAQ</a>}
              {faq && <Link href="/openngp/faq">FAQ</Link>}
              <Link href="/#projects">All projects</Link>
            </>
          ) : (
            <>
              <Link href="/#projects">Projects</Link>
              <Link href="/#skills">Approach</Link>
              <Link href="/orbit">Orbit</Link>
              <a href="https://github.com/PatchworkMD">GitHub ↗</a>
              <a href="mailto:hello@patchworkmd.dev">Contact ↗</a>
            </>
          )}
        </nav>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <Link className="footer-brand" href="/">
        <Mark />
        <span>PatchworkMD</span>
      </Link>
      <a href="https://github.com/PatchworkMD">Public repositories ↗</a>
      <Link href="/privacy">Privacy &amp; site information</Link>
      <Link href="/">Made by PatchworkMD</Link>
    </footer>
  );
}
