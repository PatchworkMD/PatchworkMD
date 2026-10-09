import Image from 'next/image';
import type { Metadata } from 'next';
import { pageMetadata } from '../../lib/seo';
import { SiteFooter, SiteHeader } from '../../components/SiteChrome';
import OrbitFilm from '../../components/OrbitFilm';
import OrbitStarfield from '../../components/OrbitStarfield';
import OrbitAsciiArt from '../../components/OrbitAsciiArt';
import './orbit.css';

const showcase = [
  ['/orbit/screenshots/orbit-sessions.png', 'Sessions', 'Every running, idle and recent session at a glance.'],
  ['/orbit/screenshots/orbit-question.png', 'Question', 'Answer an agent question without leaving the flow.'],
  ['/orbit/screenshots/orbit-approval.png', 'Approval', 'Review the exact command, then Allow or Deny.'],
  ['/orbit/screenshots/orbit-results.png', 'Results', 'See what finished and reply straight from the card.'],
] as const;

export const metadata: Metadata = pageMetadata(
  'Orbit — Coding sessions and approvals.',
  'Orbit is a native macOS companion for coding-agent sessions, questions and approvals. Explore the release candidate and product film.',
  '/orbit',
);

const questions = [
  [
    'Can I download Orbit?',
    'Not yet. Orbit has a local release candidate. Signing, notarization and public distribution checks remain open, so this page does not offer a public installer.',
  ],
  [
    'Which tools work?',
    'Provider support is still being tested. Check availability before relying on an integration.',
  ],
  [
    'What permissions does it need?',
    'Permissions depend on the features you enable, including terminal automation for enabled workflows.',
  ],
  [
    'What is the license?',
    'Orbit is a modified Open Island fork under GPL-3.0, with upstream and asset attribution retained.',
  ],
  [
    'Are updates automatic?',
    'The update system still needs a populated feed and signing configuration. The candidate makes no automatic-update promise.',
  ],
] as const;

export default function OrbitPage() {
  return (
    <>
      <SiteHeader product />
      <main id="main" className="orbit-page">
        <OrbitStarfield />
        <section className="orbit-hero" aria-labelledby="orbit-title">
          <div className="orbit-hero-copy">
            <p className="eyebrow">Orbit · Release candidate</p>
            <div className="orbit-title-lockup">
              <Image
                src="/orbit-icon.png"
                alt="Orbit app icon"
                width={88}
                height={88}
                className="orbit-icon"
                unoptimized
              />
              <h1 id="orbit-title">Your coding agents, in view.</h1>
            </div>
            <p className="orbit-lede">
              A native macOS companion that keeps coding-agent sessions, questions and approvals close.
            </p>
            <a className="orbit-cta" href="#film">
              Watch Orbit <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="orbit-hero-aside">
            <figure className="orbit-hero-preview">
              <Image
                src="/orbit/orbit-question.png"
                alt="Demonstration Orbit question view with session context"
                width={1152}
                height={1038}
                unoptimized
              />
              <figcaption>Question capture · demonstration session</figcaption>
            </figure>
            <aside className="orbit-hero-meta" aria-label="Orbit release details">
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>Release candidate</dd>
                </div>
                <div>
                  <dt>Platform</dt>
                  <dd>macOS 14 and later</dd>
                </div>
                <div>
                  <dt>Distribution</dt>
                  <dd>Notarization and public installer pending</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="orbit-mark-section" aria-labelledby="mark-heading">
          <div className="orbit-section-heading">
            <p className="eyebrow">Signature</p>
            <h2 id="mark-heading">Drag your cursor through it.</h2>
          </div>
          <OrbitAsciiArt />
        </section>

        <section id="film" className="orbit-film-section" aria-labelledby="film-heading">
          <div className="orbit-section-heading">
            <p className="eyebrow">Product film · 01</p>
            <h2 id="film-heading">Watch Orbit at work.</h2>
            <p>
              See Orbit’s session list, questions and approval requests, recorded with demonstration sessions. Playback is optional; the transcript keeps the product focus readable without sound.
            </p>
          </div>
          <OrbitFilm />
          <details className="orbit-transcript">
            <summary>
              <span>Read the film transcript</span>
              <span className="orbit-plus" aria-hidden="true">+</span>
            </summary>
            <div className="orbit-transcript-copy">
              <p><strong>Opening.</strong> Orbit. Your coding agents, in view.</p>
              <p><strong>Sessions.</strong> Stay with the work.</p>
              <p><strong>Question.</strong> Read the question. Consider the choices.</p>
              <p><strong>Approval.</strong> Review the request. Choose Allow or Deny.</p>
              <p><strong>Close.</strong> Orbit. Release candidate. A native macOS companion for coding-agent sessions, questions and approvals.</p>
              <p><strong>Demonstration note.</strong> The native UI uses synthetic sessions for this product film.</p>
            </div>
          </details>
        </section>

        <section className="orbit-showcase" aria-labelledby="showcase-heading">
          <div className="orbit-section-heading orbit-section-heading-wide">
            <p className="eyebrow">In the app · 02</p>
            <h2 id="showcase-heading">The app itself, running.</h2>
          </div>
          <div className="orbit-showcase-grid">
            {showcase.map(([src, title, caption]) => (
              <figure key={src}>
                <Image src={src} alt={`Orbit ${title.toLowerCase()} view`} width={1152} height={960} unoptimized />
                <figcaption>{title} · {caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="orbit-principles" aria-labelledby="principles-heading">
          <div className="orbit-section-heading orbit-section-heading-wide">
            <p className="eyebrow">Features · 03</p>
            <h2 id="principles-heading">Sessions, questions and approvals.</h2>
          </div>
          <div className="orbit-principle-grid">
            <article>
              <span className="orbit-index">01</span>
              <h3>Coding sessions</h3>
              <p>Keep the active coding-agent session visible in a native macOS companion.</p>
            </article>
            <article>
              <span className="orbit-index">02</span>
              <h3>Questions in place</h3>
              <p>Follow an agent question while the related session stays close by.</p>
            </article>
            <article>
              <span className="orbit-index">03</span>
              <h3>Approvals before action</h3>
              <p>Read the proposed command and choose Allow or Deny.</p>
            </article>
          </div>
        </section>

        <section id="start" className="orbit-availability" aria-labelledby="availability-heading">
          <div className="orbit-section-heading">
            <p className="eyebrow">Availability · 04</p>
            <h2 id="availability-heading">The candidate is still local.</h2>
          </div>
          <div className="orbit-availability-copy">
            <p>
              A public signed installer is not available yet. Orbit has a local release candidate; signing, notarization and public distribution checks remain open.
            </p>
            <p>Orbit is designed for macOS 14 and later. Installation instructions will follow the remaining release checks.</p>
          </div>
        </section>

        <section id="faq" className="orbit-faq" aria-labelledby="faq-heading">
          <div className="orbit-section-heading">
            <p className="eyebrow">Questions · 05</p>
            <h2 id="faq-heading">Before you try it.</h2>
          </div>
          <div>
            {questions.map(([question, answer]) => (
              <details className="orbit-faq-entry" key={question}>
                <summary>
                  <span>{question}</span>
                  <span className="orbit-plus" aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="orbit-contact" aria-labelledby="orbit-contact-heading">
          <h2 id="orbit-contact-heading">Stay close to the work.</h2>
          <div>
            <p>For project questions, feedback and support.</p>
            <a href="mailto:hello@patchworkmd.dev">hello@patchworkmd.dev ↗</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
