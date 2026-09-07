import Link from 'next/link';

const projects = [
  {
    name: 'Orbit',
    platform: 'macOS',
    status: 'Release candidate',
    description: 'Your coding tools, at home on your Mac.',
    detail:
      'Native macOS control for coding-agent sessions, approvals, and questions. Designed around automatic integration, straightforward onboarding, and native interaction. Orbit is a modified fork of Open Island under GPL-3.0; public distribution is still pending.',
  },
  {
    name: 'OpenNGP',
    platform: 'Campaign software',
    status: 'In development',
    description:
      'Local-first fundraising and organizing software, with separate records for each campaign workspace.',
    detail:
      'Brings donor profiles, pledges, contributions, and call outcomes into one workflow. Public distribution is not available yet.',
  },
  {
    name: '2D0',
    platform: 'Mac & iPhone',
    status: 'In development',
    description:
      'A checklist app for quick capture, straightforward lists, and getting tasks finished.',
    detail:
      'Local-first storage and a whiteboard-inspired interface. Mac and iPhone releases are in preparation.',
  },
  {
    name: 'Dreamer',
    platform: 'Agent tools',
    status: 'In development',
    description:
      'Resume agent work from checked evidence and review proposed preferences before saving them.',
    detail:
      'The store listing is a draft and has not been submitted for review. Dreamer is not available in the store yet.',
  },
  {
    name: 'LocalModelFit',
    platform: 'Local AI',
    status: 'Preview',
    description:
      'Find AI models suited to your hardware, with runtime-aware memory estimates and Hugging Face discovery.',
    detail:
      'Release details will be posted here as the project develops. Memory estimates are guidance, not measured performance guarantees.',
  },
] satisfies ReadonlyArray<{
  name: string;
  platform: string;
  status: string;
  description: string;
  detail: string;
}>;

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <Link className="wordmark" href="/">
          <span className="mini-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          PatchworkMD
        </Link>
        <nav aria-label="Main navigation">
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="https://github.com/PatchworkMD">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href="mailto:hello@patchworkmd.dev">
            Contact <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <main id="main">
        <section className="intro" aria-labelledby="title">
          <div className="intro-copy">
            <p className="eyebrow">Independent developer</p>
            <h1 id="title">PatchworkMD</h1>
            <p className="bio">
              I build native applications, campaign software,
              <br className="desktop-break" /> and tools for working with AI.
            </p>
            <p className="intro-note">
              Native apps, useful tools, and ideas taking shape.
            </p>
          </div>
          <div className="patch-art" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </section>
        <section id="projects" aria-labelledby="projects-title">
          <div className="section-title">
            <h2 id="projects-title">Projects</h2>
            <span>Current work</span>
          </div>
          <div className="project-index">
            {projects.map((p) => (
              <article key={p.name} className="project">
                <div className="project-name">
                  <h3>
                    <Link
                      href={
                        p.name === '2D0' ? '/2d0' : '/' + p.name.toLowerCase()
                      }
                    >
                      {p.name}
                    </Link>
                  </h3>
                  <p>{p.platform}</p>
                </div>
                <div className="project-body">
                  <p className="description">{p.description}</p>
                  {p.name === 'Orbit' && (
                    <p className="download-pending">
                      Mac download coming soon.
                    </p>
                  )}
                  <details>
                    <summary>
                      <span>{p.status}</span>
                      <span className="detail-label">
                        Details{' '}
                        <span className="plus" aria-hidden="true">
                          +
                        </span>
                      </span>
                    </summary>
                    <p className="detail">{p.detail}</p>
                  </details>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="skills" aria-labelledby="more-title">
          <div className="section-title">
            <h2 id="more-title">More from PatchworkMD</h2>
          </div>
          <div className="more-projects">
            <Link href="/app-design-research">
              App Design Research <span>Design review skill →</span>
            </Link>
            <Link href="/type-b">
              Type B <span>Concept →</span>
            </Link>
            <Link href="/unicycle">
              UNICYCLE <span>Coordination tools in development →</span>
            </Link>
          </div>
        </section>
        <section className="skills" id="skills" aria-labelledby="skills-title">
          <div className="section-title">
            <h2 id="skills-title">Skills & approach</h2>
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
                  alongside them.<span>In practice: Orbit and 2D0</span>
                </dd>
              </div>
              <div>
                <dt>Web interfaces & backends</dt>
                <dd>
                  React, TypeScript, Python, and FastAPI. Clear interfaces
                  backed by useful data and straightforward workflows.
                  <span>In practice: this site and OpenNGP</span>
                </dd>
              </div>
              <div>
                <dt>Agent workflows</dt>
                <dd>
                  Connecting sessions, approvals, handoffs, and memory so a
                  person can follow what an agent is doing.
                  <span>In practice: Orbit and Dreamer</span>
                </dd>
              </div>
              <div>
                <dt>Local-first tools</dt>
                <dd>
                  Working with local data, hardware constraints, and model
                  choices instead of assuming everything belongs in the cloud.
                  <span>In practice: OpenNGP, 2D0, and LocalModelFit</span>
                </dd>
              </div>
            </dl>
          </div>
        </section>
        <section className="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Get in touch</h2>
          <div>
            <p>For project questions, feedback, or support.</p>
            <a href="mailto:hello@patchworkmd.dev">
              hello@patchworkmd.dev <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <footer>
        <span>PatchworkMD</span>
        <a href="https://github.com/PatchworkMD">
          Public repositories <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </>
  );
}
