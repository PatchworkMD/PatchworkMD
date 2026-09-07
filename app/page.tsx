import Link from 'next/link';
import Image from 'next/image';
const projects = [
  [
    'OpenNGP',
    'Campaign software',
    'In development',
    'Local-first fundraising and organizing software, with separate records for each campaign workspace.',
    'Brings donor profiles, pledges, contributions, and call outcomes into one workflow. Public distribution is not available yet.',
  ],
  [
    '2D0',
    'Mac & iPhone',
    'In development',
    'A checklist app for quick capture, straightforward lists, and getting tasks finished.',
    'Local-first storage and a whiteboard-inspired interface. Mac and iPhone releases are in preparation.',
  ],
  [
    'Dreamer',
    'Agent tools',
    'In development',
    'Resume agent work from checked evidence and review proposed preferences before saving them.',
    'The store listing is a draft and has not been submitted for review. Dreamer is not available in the store yet.',
  ],
  [
    'Orbit',
    'macOS',
    'Release candidate',
    'Your coding tools, at home on your Mac.',
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
      <main id="main">
        <section className="cover">
          <div className="cover-copy">
            <p className="eyebrow">Independent software · 2026</p>
            <h1 className="cover-title">PatchworkMD</h1>
            <p className="bio">
              Native apps. Local tools.
              <br />
              Work in progress.
            </p>
            <p className="cover-note">
              Independent software, built one project at a time.
            </p>
          </div>
          <figure className="cover-image">
            <div className="image-frame">
              <Image
                unoptimized
                width={1536}
                height={1024}
                fetchPriority="high"
                src="/brand/studio.jpg"
                alt="Atmospheric illustration of a creative software workspace"
              />
            </div>
            <figcaption>
              Atmosphere / illustration · PatchworkMD studio
            </figcaption>
          </figure>
        </section>
        <section className="featured">
          <div className="section-kicker">
            <span>01</span>
            <span>Featured work</span>
          </div>
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
            <span>02</span>
            <h2>Selected work</h2>
            <span>Current projects</span>
          </div>
          <div className="project-index">
            {projects.map(
              ([name, platform, status, description, detail], i) => (
                <article key={name} className="project">
                  <div className="project-number">0{i + 2}</div>
                  <div className="project-name">
                    <h3>
                      <Link
                        href={
                          name === '2D0' ? '/2d0' : '/' + name.toLowerCase()
                        }
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
              ),
            )}
          </div>
        </section>
        <section className="skills" id="skills">
          <div className="section-kicker">
            <span>03</span>
            <h2>Approach</h2>
            <span>The work behind the projects</span>
          </div>
          <div className="skills-content">
            <div className="skills-intro">
              <p>I like software that earns its place.</p>
              <p>
                Native when it makes the experience better. Local when it gives
                people more control. AI when it helps get the work done.
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
              App Design Research <span>View the example &amp; install ↗</span>
            </Link>
            <Link href="/airplayify/">
              Airplayify Jam <span>Experimental macOS alpha ↗</span>
            </Link>
            <Link href="/type-b">
              Type B <span>Concept ↗</span>
            </Link>
            <Link href="/unicycle">
              UNICYCLE <span>Locally tested plugin candidate ↗</span>
            </Link>
          </div>
        </section>
        <section className="contact">
          <p className="eyebrow">Correspondence</p>
          <div>
            <h2>Let’s make something useful.</h2>
            <a href="mailto:hello@patchworkmd.dev">hello@patchworkmd.dev ↗</a>
          </div>
        </section>
      </main>
      <footer>
        <span>
          <Mark /> PatchworkMD
        </span>
        <a href="https://github.com/PatchworkMD">Public repositories ↗</a>
        <a href="https://patchworkmd.dev">Made by PatchworkMD</a>
      </footer>
    </>
  );
}
