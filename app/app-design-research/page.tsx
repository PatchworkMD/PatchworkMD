import { pageMetadata } from '../../lib/seo';
import Image from "next/image";
import Link from 'next/link';
const title = 'App Design Research | PatchworkMD';
const description = 'Review screenshots, interface text, and app code in Codex.';
export const metadata = pageMetadata(title, description, '/app-design-research');
const faq = [
  [
    'What can I review?',
    'Screenshots, interface copy, and code you provide. Ask for a focused critique with concrete improvements.',
  ],
  [
    'Does it fetch AppLlama content?',
    'No. External AppLlama access is disabled. Supply the material you want reviewed.',
  ],
  [
    'Do I need an API key or server?',
    'The plugin is skills-only and does not require its own server or API key. Your Codex account and model processing still apply.',
  ],
  [
    'Which version is available?',
    'Version 0.1.1 is published on GitHub. The plugin directory listing remains a draft and has not been submitted.',
  ],
  [
    'What should I avoid sharing?',
    'Remove private task names, credentials and personal information from screenshots or code before submitting them. This is not a separate privacy guarantee for Codex processing.',
  ],
];
export default function Page() {
  return (
    <>
      <header>
        <Link className="wordmark" href="/">
          PatchworkMD
        </Link>
        <nav>
          <a href="#install">Install</a>
          <a href="#faq">FAQ</a>
        </nav>
      </header>
      <main>
        <section className="intro adr-intro">
          <div className="intro-copy">
            <div className="adr-identity"><Image src="/app-design-research-icon.svg" alt="" width={40} height={40} unoptimized /><p className="eyebrow">App Design Research<span>Version 0.1.1</span></p></div>
            <h1>
              A second look at
              <br />
              your interface.
            </h1>
            <p className="bio">
              Review screenshots, interface text, and app code in Codex.
            </p>
            <p className="intro-note">
              Bring screenshots, text or code to Codex. Ask for a critique you
              can turn into specific changes.
            </p>
            <a href="https://github.com/PatchworkMD/app-design-research/releases/tag/v0.1.1">
              View the GitHub release →
            </a>
          </div>
        </section>
        <figure className="product-art">
          <Image src="/adr-hero.png" alt="" width={1672} height={941} unoptimized />
          <figcaption>
            Original marketing illustration; abstract screens are not app
            screenshots.
          </figcaption>
        </figure>
        <section>
          <div className="section-title">
            <h2>How it works</h2>
            <span>Bring your own material</span>
          </div>
          {[
            [
              '1. Share the interface',
              'Attach a screenshot or paste relevant interface text or code. Explain what the user is trying to do.',
            ],
            [
              '2. Name the problem',
              'Ask about hierarchy, navigation, copy, accessibility or a specific interaction.',
            ],
            [
              '3. Review the suggestions',
              'Check the proposed changes against your product and test them with real users. A critique is not a usability study.',
            ],
          ].map(([a, b]) => (
            <article className="project" key={a}>
              <h3>{a}</h3>
              <p>{b}</p>
            </article>
          ))}
        </section>
        <section className="skills" aria-labelledby="demo-title">
          <div className="section-title">
            <h2 id="demo-title">A small example</h2>
            <span>Synthetic text review</span>
          </div>
          <blockquote className="demo-input">
            A confirmation screen has Yes and No buttons. Yes copies a draft,
            shows “Copied!” before the write finishes, and clears the draft if
            copying fails. It says “Nothing leaves your phone until you say
            yes.”
          </blockquote>
          <ol className="demo-findings">
            <li>
              <strong>Wait for success.</strong> Show the toast after the
              clipboard write succeeds. Test rejected writes.
            </li>
            <li>
              <strong>Keep the draft.</strong> Preserve text after a failure so
              the person can retry.
            </li>
            <li>
              <strong>Check the promise.</strong> Verify actual data flows
              before claiming that nothing leaves the device.
            </li>
          </ol>
          <p className="intro-note">
            Condensed results from a text-only trial of the v0.1.1 candidate.
            Visual, accessibility and runtime behavior were not tested by this
            example.
          </p>
        </section>
        <section className="skills" id="install">
          <div className="section-title">
            <h2>Get started</h2>
          </div>
          <p>Run these commands, then start a new Codex task.</p>
          <pre style={{ overflowX: 'auto', padding: '20px 0', fontSize: 13 }}>
            <code>
              {
                'codex plugin marketplace add PatchworkMD/app-design-research --ref v0.1.1\ncodex plugin add app-design-research@app-design-research-public'
              }
            </code>
          </pre>
          <h3>Try a focused prompt</h3>
          <p className="detail">
            “Review this screenshot. Identify the three biggest sources of
            friction in the navigation and suggest specific changes. Separate
            visible evidence from assumptions.”
          </p>
        </section>
        <section className="skills" id="faq">
          <div className="section-title">
            <h2>FAQ</h2>
          </div>
          {faq.map(([a, b]) => (
            <details className="faq-entry" key={a}>
              <summary>
                <h2>{a}</h2>
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="detail">{b}</p>
            </details>
          ))}
        </section>
        <section className="contact">
          <h2>Source and feedback</h2>
          <div>
            <a href="https://github.com/PatchworkMD/app-design-research">
              View source on GitHub →
            </a>
            <p>
              <a href="mailto:hello@patchworkmd.dev">hello@patchworkmd.dev</a>
            </p>
            <p>
              Public feedback belongs in the repository. Do not include
              sensitive material in public issues.
            </p>
          </div>
        </section>
      </main>
      <footer>
        <Link href="/">All projects</Link>
        <a href="https://patchworkmd.dev">Made by PatchworkMD</a>
      </footer>
    </>
  );
}
