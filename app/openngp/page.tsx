import { pageMetadata } from '../../lib/seo';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../../components/SiteChrome';
const title = 'OpenNGP — Campaign records, organized by workspace';
const description = 'Local-first fundraising and organizing software with separate campaign workspaces. Explore current workflows and development status.';
export const metadata = pageMetadata(title, description, '/openngp');
export default function OpenNGPPage() {
  return (
    <>
      <SiteHeader product openngp />
      <main id="main">
        <section className="intro">
          <div className="intro-copy">
            <p className="eyebrow">In development</p>
            <h1>OpenNGP</h1>
            <p className="bio">
              Campaign records, with a workspace for each team.
            </p>
            <p className="intro-note">
              Local-first fundraising and organizing software. Public
              distribution is not available yet.
            </p>
          </div>
        </section>
        <section aria-labelledby="workflow">
          <div className="section-title">
            <h2 id="workflow">Current local workflows</h2>
            <span>Tested in development</span>
          </div>
          {[
            [
              'Workspace access',
              'Create and rename workspaces, manage memberships, and revoke sessions through shared app and command-line workflows.',
            ],
            [
              'Profiles and reviewed imports',
              'Map CSV, TSV and XLSX columns, review duplicate or invalid rows, and preserve source histories when records change. Imports do not establish consent.',
            ],
            [
              'Saved filters and snapshots',
              'Keep reusable filters and immutable list snapshots. Collaborative call-time and other complete workflows remain in development.',
            ],
          ].map(([title, body]) => (
            <article className="project" key={title}>
              <div className="project-name">
                <h3>{title}</h3>
              </div>
              <p className="description">{body}</p>
            </article>
          ))}
        </section>
        <section className="contact">
          <h2>Before you use it</h2>
          <div>
            <p>
              Local acceptance checks do not establish production readiness.
              Complete backup and restore, clean installation, accessibility,
              external integrations, pricing and licensing still have open
              release decisions.
            </p>
            <Link href="/openngp/faq">Read the OpenNGP FAQ →</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
