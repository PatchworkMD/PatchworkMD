import { pageMetadata } from '../lib/seo';
export const metadata = pageMetadata('patchwork.md | Mac apps, web tools & campaign software', 'Independent software from PatchworkMD. Explore Orbit, 2DO, Dreamer, LocalModelMatch, and OpenNGP, with demos and current release details.');
import Link from 'next/link';
import Image from 'next/image';
import FlashMark from '../components/FlashMark';
import FlashBackground from '../components/FlashBackground';
import { SiteFooter, SiteHeader } from '../components/SiteChrome';
const appLogos: Record<string,string> = { '2DO':'/2do-current-icon.png', Orbit:'/orbit-icon.png', Dreamer:'/dreamer-nightcap.png' };
const projects = [
  [
    'OpenNGP',
    'Campaign software',
    'In development',
    'Fundraising and organizing software with separate campaign workspaces.',
    'Brings donor profiles, pledges, contributions, and call outcomes into one workflow. Public distribution is not available yet.',
  ],
  [
    '2DO',
    'Mac & iPhone',
    'In development',
    'Capture tasks and keep lists on Mac and iPhone.',
    'Local-first storage and a whiteboard-inspired interface. Mac and iPhone releases are in preparation.',
  ],
  [
    'Dreamer',
    'Agent tools',
    'In development',
    'Review what an agent finished and carry context into the next session.',
    'The store listing is a draft and has not been submitted for review. Dreamer is not available in the store yet.',
  ],
  [
    'Orbit',
    'macOS',
    'Release candidate',
    'A Mac app for coding-agent sessions and approvals.',
    'Native coding-agent sessions and approvals. Public distribution is not available yet.',
  ],
] as const;
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'patchwork.md', alternateName: 'PatchworkMD', url: 'https://patchworkmd.dev/', description: 'Independent Mac apps, web tools, and campaign software.' }) }} />
      <FlashBackground />
      <SiteHeader />
      <main id="main" className="portfolio-candidate">
        <section className="cover">
          <h1 className="visually-hidden">patchwork.md</h1>
          <FlashMark />
          <div className="flash-intro">
            <p>Independent tools for Mac, the web, and campaign work.</p>
            <a className="portfolio-cta" href="#projects">Projects <span aria-hidden="true">↓</span></a>
          </div>
        </section>
        <section className="featured" id="featured-work">
          <div className="section-kicker">
            <span>01 / Public preview</span>
            <span>Local AI / Web app</span>
          </div>
          <a
            className="product-preview"
            href="https://localmodelmatch.com"
            aria-label="Open the LocalModelMatch live preview"
          >
            <Image
              src="/brand/localmodelmatch-preview.png"
              alt="LocalModelMatch interface showing computer setup and model discovery"
              width={1440}
              height={1000}
              unoptimized
            />
            <span>Open live preview ↗</span>
          </a>
          <p className="preview-caption">
            LocalModelMatch · Live interface captured September 7, 2026 ·
            Example setup
          </p>
          <div className="featured-grid">
            <div>
              <p className="availability">Public preview · Local AI</p>
              <h2>
                <Link href="/localmodelmatch">LocalModelMatch</Link>
              </h2>
              <p className="feature-lede">
                Find a model that fits your machine.
              </p>
            </div>
            <div>
              <p className="feature-detail">
                Explore AI models for your hardware with runtime-aware memory
                estimates. Confirm your machine, choose a runtime, and compare
                the options.
              </p>
              <p className="feature-status">
                Available to try · Estimates, not benchmarks
              </p>
              <a className="text-link" href="https://localmodelmatch.com">
                Try the live preview ↗
              </a>
              <br />
              <Link className="text-link" href="/localmodelmatch">
                How it works ↗
              </Link>
            </div>
          </div>
        </section>
        <section className="orbit-spotlight" id="orbit-spotlight" aria-labelledby="orbit-title">
          <div className="section-kicker">
            <span>02 / Mac app</span>
            <span>Release candidate</span>
          </div>
          <div className="orbit-spotlight-grid">
            <div>
              <p className="availability">Orbit · Native macOS</p>
              <h2 id="orbit-title">Coding sessions, with the next handoff in view.</h2>
              <p className="feature-detail">
                Orbit brings coding-agent sessions, questions, and approvals into a native Mac surface.
              </p>
              <Link className="text-link" href="/orbit">
                View the Orbit campaign ↗
              </Link>
            </div>
            <aside className="orbit-status" aria-label="Orbit availability">
              <span className="orbit-status-label">Current status</span>
              <strong>Release candidate</strong>
              <p>Local candidate only. A public signed installer is not available yet.</p>
              <Link className="text-link" href="/orbit#start">
                Check Orbit availability ↗
              </Link>
            </aside>
          </div>
        </section>
        <section id="projects" className="work">
          <div className="section-kicker">
            <h2>Projects in development</h2>
            <span>Current projects</span>
          </div>
          <div className="project-index">
            {projects.map(([name, platform, status, description, detail], index) => (
              <article key={name} className="project">
                <div className="project-name">
                  <span className="project-number">0{index + 2}</span>
                  {appLogos[name] && (
                    <Image
                      src={appLogos[name]} className="app-logo"
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                    />
                  )}
                  <h3>
                    <Link
                      href={name === '2DO' ? '/2d0' : '/' + name.toLowerCase()}
                    >
                      {name}
                    </Link>
                  </h3>
                  <p>{platform}</p>
                </div>
                <div className="project-body">
                  <p className="description">{description}</p>
                  <details>
                    <summary>
                      <span>{status}</span>
                      <span className="detail-label">
                        Details <span className="plus">+</span>
                      </span>
                    </summary>
                    <p className="detail">{detail}</p>
                  </details>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="skills" id="skills">
          <div className="section-kicker">
            <h2>How I work</h2>
            <span>The work behind the projects</span>
          </div>
          <div className="skills-content">
            <div className="skills-intro">
              <p>Behind
                the work.</p>
              <p>
                I work across Mac apps, web interfaces, and campaign software.
                These projects come from the tools I use and the work I do.
              </p>
            </div>
            <dl className="skill-list">
              <div>
                <dt>Native applications</dt>
                <dd>
                  SwiftUI and AppKit interfaces for the Mac, with iPhone work
                  alongside them.<span>Orbit · 2DO</span>
                </dd>
              </div>
              <div>
                <dt>Web interfaces &amp; backends</dt>
                <dd>
                  React, TypeScript, Python, and FastAPI. Clear interfaces
                  backed by useful data.<span>This site · OpenNGP</span>
                </dd>
              </div>
              <div>
                <dt>Agent workflows</dt>
                <dd>
                  Connecting sessions, approvals, handoffs, and memory so a
                  person can follow what an agent is doing.
                  <span>Orbit · Dreamer</span>
                </dd>
              </div>
            </dl>
          </div>
        </section>
        <section className="more">
          <div className="section-kicker">
            <span>04</span>
            <h2>More from PatchworkMD</h2>
          </div>
          <div className="more-projects">
            <Link href="/app-design-research">
              <span className="product-wordmark">
                <Image
                  src="/app-design-research-icon.svg"
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                />{' '}
                App Design Research
              </span>{' '}
              <span>View the example &amp; install ↗</span>
            </Link>
            <Link href="/airplayify">
              Airplayify Jam <span>Experimental macOS alpha ↗</span>
            </Link>
            <Link href="/type-b">
              Type B <span>Concept ↗</span>
            </Link>
            <Link href="/unicycle">
              <span className="product-wordmark">
                <Image
                  src="/unicycle-icon.png"
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                />{' '}
                UNICYCLE
              </span>{' '}
              <span>Locally tested plugin candidate ↗</span>
            </Link>
          </div>
        </section>
        <section className="contact">
          <p className="eyebrow">Correspondence</p>
          <div>
            <h2>Say hello.</h2>
            <a href="mailto:hello@patchworkmd.dev">hello@patchworkmd.dev ↗</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
