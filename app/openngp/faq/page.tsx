import Link from 'next/link';
export const metadata = { title: 'OpenNGP FAQ — PatchworkMD' };
const questions = [
  [
    'Who is OpenNGP for?',
    'Campaign fundraising and organizing teams that need separate workspaces for their records. It is in development; public distribution is not yet ready.',
  ],
  [
    'What works in the current local build?',
    'Local acceptance evidence covers workspace identity, memberships and sessions, profile/contact records, reviewed imports, and saved filters with list snapshots. This is synthetic local testing, not full-product release qualification.',
  ],
  [
    'How are campaign workspaces separated?',
    'Workspace IDs and server-enforced membership controls scope access. New workspace identities cannot select legacy donor records automatically. Role changes and session revocation have dedicated local checks.',
  ],
  [
    'What can I import?',
    'The current reviewed import workflow inspects CSV, TSV and XLSX files, maps columns, and separates accepted, duplicate, invalid and ambiguous rows for explicit review. Legacy workbook support is not a promise of complete migration fidelity.',
  ],
  [
    'Does importing a contact establish consent?',
    'No. Imported records do not establish consent or verified contact status. Review source rights and contact permissions separately.',
  ],
  [
    'Can I merge duplicate profiles?',
    'Merge and unmerge previews preserve source histories in the local implementation. The broader workflow remains partial while allocation and consent conflict checks are completed.',
  ],
  [
    'Can I save filters and call lists?',
    'Saved filters and immutable list snapshots have local acceptance evidence. This does not establish a complete collaborative phonebank, dialing or reminder workflow.',
  ],
  [
    'Can I export or restore my data?',
    'Local workflows include scoped archives and call-sheet exports. Identity, profile and import archives have different contents. A workflow archive is not a complete portable backup of every record, credential or integration.',
  ],
  [
    'What should I know before a restore?',
    'The relevant workspace identity and current local authority must match. Restore validation and interruption checks use synthetic records. Complete clean-machine recovery, upgrades and realistic production backups remain release gates.',
  ],
  [
    'Does local-first mean no data leaves my device?',
    'No. Local storage and optional external processing are separate. AI providers, research sources, telephony or synchronization may require network access and configuration. Provider readiness is not proof of a completed external operation.',
  ],
  [
    'Is AI required?',
    'Research is designed to keep AI optional and preserve fallback behavior. A configured provider or availability indicator does not guarantee a live response.',
  ],
  [
    'Does OpenNGP process payments or submit compliance filings?',
    'Contribution records and rule lookups are not payment processing or filing submission. These complete workflows remain unfinished; the current build should not be represented as providing them.',
  ],
  [
    'How do I install it?',
    'A supported public installer, clean-install qualification and distribution instructions are not available yet. No download is offered on this page.',
  ],
  [
    'What are the price and license?',
    'Pricing and the public distribution license remain unresolved. No price, subscription or open-source license commitment is made here.',
  ],
  [
    'Where can I get support?',
    'The portfolio contact is hello@patchworkmd.dev. A dedicated support policy and response commitment have not been established.',
  ],
  [
    'When will it launch?',
    'There is no confirmed public launch date. Remaining workflows, accessibility, scale, clean installation and distribution must pass their release reviews first.',
  ],
];
export default function FAQ() {
  return (
    <>
      <header>
        <Link className="wordmark" href="/">
          PatchworkMD
        </Link>
        <nav aria-label="Product navigation">
          <Link href="/openngp">OpenNGP</Link>
          <Link href="/">All projects</Link>
        </nav>
      </header>
      <main>
        <section className="intro">
          <div className="intro-copy">
            <p className="eyebrow">OpenNGP</p>
            <h1>Questions, answered.</h1>
            <p className="bio">
              What the current build does, and what still needs work.
            </p>
          </div>
        </section>
        <section aria-label="Frequently asked questions">
          {questions.map(([question, answer]) => (
            <details key={question} className="faq-entry">
              <summary>
                <h2>{question}</h2>
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="detail">{answer}</p>
            </details>
          ))}
        </section>
        <section className="contact">
          <h2>Still have a question?</h2>
          <div>
            <p>For project questions and feedback.</p>
            <a href="mailto:hello@patchworkmd.dev">hello@patchworkmd.dev</a>
          </div>
        </section>
      </main>
      <footer>
        <Link href="/openngp">Back to OpenNGP</Link>
        <span>In development</span>
      </footer>
    </>
  );
}
