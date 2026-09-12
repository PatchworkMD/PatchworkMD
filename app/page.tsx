import Link from 'next/link';
import Image from 'next/image';
import FilmStudy from '../components/FilmStudy';
const projects = [
  [
    'OpenNGP',
    'Campaign software',
    'In development',
    'Fundraising and organizing software with separate campaign workspaces.',
    'Brings donor profiles, pledges, contributions, and call outcomes into one workflow. Public distribution is not available yet.',
  ],
  [
    '2D0',
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
export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <Link className="wordmark" href="/">
          <Mark />
          <span>PatchworkMD</span>
        </Link>
        <nav aria-label="Main navigation">
          <a href="#projects">Projects</a>
          <a href="#skills">Approach</a>
          <a href="https://github.com/PatchworkMD">GitHub ↗</a>
          <a href="mailto:hello@patchworkmd.dev">Contact ↗</a>
        </nav>
      </header>
      <main id="main" className="portfolio-candidate">
        <section className="cover">
          <div className="cover-masthead">
            <h1 className="cover-title">PatchworkMD</h1>
            <span>
              Independent software / Selected work / 2026
            </span>
          </div>
          <div className="cover-copy">
            <p className="bio">
              Mac apps.
              <br />
              <span>Web tools.</span>
            </p>
            <p className="cover-note">
              I build software for the Mac, campaign teams, and people working
              with AI. Browse the public previews and projects in development.
            </p>
            <a className="portfolio-cta" href="#featured-work">
              View projects <span aria-hidden="true">↓</span>
            </a>
          </div>
          <figure className="cover-image">
            <div className="image-frame">
              <span className="frame-index" aria-hidden="true">PW—01 / STUDIO STUDY</span>
              <Image
                unoptimized
                width={1536}
                height={1024}
                fetchPriority="high"
                src="/brand/studio.jpg"
                alt="Atmospheric illustration of a creative software workspace"
              />
              <FilmStudy />
            </div>
            <figcaption>Studio study / Illustration<span>01 — 2026</span></figcaption>
          </figure>
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
                  {name === 'Dreamer' && (
                    <Image
                      src="/dreamer-icon.png"
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                    />
                  )}
                  <h3>
                    <Link
                      href={name === '2D0' ? '/2d0' : '/' + name.toLowerCase()}
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
                  alongside them.<span>Orbit · 2D0</span>
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
            <Link href="/appdesignresearch/">
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
            <Link href="/airplayify/">
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
      <footer>
        <span>
          <Mark /> PatchworkMD
        </span>
        <a href="https://github.com/PatchworkMD">Public repositories ↗</a>
        <Link href="/privacy">Privacy &amp; site information</Link>
        <a href="https://patchworkmd.dev">Made by PatchworkMD</a>
      </footer>
    </>
  );
}
