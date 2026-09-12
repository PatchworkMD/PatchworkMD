import Link from 'next/link';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
type ProductInfo = {
  name: string;
  status: string;
  tagline: string;
  intro: string;
  benefits: string[][];
  setup: string;
  faq: string[][];
  url?: string;
  cta?: string;
  repo?: string;
};
const products: Record<string, ProductInfo> = {
  airplayify: {
    name: 'Airplayify Jam',
    status: 'Experimental alpha · 0.1.0-alpha.2',
    tagline: 'Explore grouped audio on your Mac.',
    intro: 'An experimental macOS app for audio-output grouping with Spotify.',
    url: 'https://github.com/PatchworkMD/airplayify-jam/releases/tag/v0.1.0-alpha.2',
    cta: 'View alpha download',
    repo: 'https://github.com/PatchworkMD/airplayify-jam',
    benefits: [
      [
        'Made for Apple Silicon',
        'Requires an Apple Silicon Mac running macOS 14 or later.',
      ],
      [
        'Open source',
        'Explore the MIT-licensed source and report reproducible issues on GitHub.',
      ],
      [
        'An early audio experiment',
        'Real-world audio acceptance is still pending. This alpha is not a verified playback release.',
      ],
    ],
    setup:
      'Read the GitHub release notes before downloading the Apple Silicon ZIP. This alpha is ad-hoc signed and not notarized. It is not available in the Mac App Store. Keep macOS security protections enabled.',
    faq: [
      [
        'Is playback verified?',
        'No. Audio acceptance remains pending; this is an experimental alpha.',
      ],
      [
        'Is it on the Mac App Store?',
        'No. Mac App Store support is in development.',
      ],
      [
        'Where do I get help?',
        'Use the GitHub repository for reproducible issues or email hello@patchworkmd.dev.',
      ],
    ],
  },

  orbit: {
    name: 'Orbit',
    status: 'Release candidate',
    tagline: 'Your coding tools, at home on your Mac.',
    intro:
      'A native macOS companion for coding-agent sessions, questions and approvals.',
    benefits: [
      [
        'Stay close to your tools',
        'A SwiftUI and AppKit interface brings coding-session context into a native Mac surface.',
      ],
      [
        'Keep decisions visible',
        'Follow questions and approval requests as part of your workflow.',
      ],
      [
        'Start with your Mac',
        'Designed for macOS 14 and later. Universal packaging has been tested; physical Intel testing remains open.',
      ],
    ],
    setup:
      'A public signed installer is not available yet. Installation instructions will be added after Developer ID signing, notarization and provider acceptance checks.',
    faq: [
      [
        'Can I download it?',
        'Not yet. The current package is a local, ad-hoc-signed release candidate. No public download is offered.',
      ],
      [
        'Which tools work?',
        'Integrations are in development. An implementation entry does not mean every provider has passed a real end-to-end check.',
      ],
      [
        'What permissions does it need?',
        'Permissions depend on the features you enable, including terminal automation for returning to a session.',
      ],
      [
        'What is the license?',
        'Orbit is a modified Open Island fork under GPL-3.0, with upstream and asset attribution retained.',
      ],
      [
        'Are updates automatic?',
        'The update system still needs a populated feed and signing configuration. No automatic-update promise is made for the candidate.',
      ],
    ],
  },
  '2d0': {
    name: '2D0',
    status: 'Private beta preparation',
    tagline: 'Make your list feel like yours.',
    intro:
      'A customizable task app with a whiteboard-marker character, quick capture and small celebrations for progress.',
    benefits: [
      [
        'Capture and return',
        'Write down a task, complete it, undo it, and return to your list.',
      ],
      [
        'Set your style',
        'Choose a writing tool, color and mood. Sound and haptics are optional.',
      ],
      [
        'Keep the basics close',
        'Local task storage and a widget snapshot are part of the current development work.',
      ],
    ],
    setup:
      'The iOS 1.0 (2) TestFlight build is waiting for review. Public installation and open beta invitations are not available here.',
    faq: [
      [
        'Is it released?',
        'No. TestFlight review and a public App Store release are separate steps.',
      ],
      [
        'What should testers try?',
        'Skippable onboarding, style choices, adding and completing tasks, undo, persistence after reopening, and optional sound and haptics.',
      ],
      [
        'Does it sync securely between devices?',
        'Secure cross-device sync is not included in this beta. The optional development LAN bridge is off by default and is not ready for public release.',
      ],
      [
        'Are friends and referral rewards included?',
        'No. Friends, referral upgrades and collectible rewards are planned, not active beta features.',
      ],
      [
        'Where do I send feedback?',
        'Use hello@patchworkmd.dev. Include a short description and remove private task content from screenshots.',
      ],
    ],
  },
  dreamer: {
    name: 'Dreamer',
    status: 'In development',
    tagline: 'Pick up the work with its context intact.',
    intro:
      'Agent workflow tools for resuming from checked evidence and reviewing proposed preferences before saving them.',
    benefits: [
      [
        'Resume from evidence',
        'Keep the last known result and the next action connected.',
      ],
      [
        'Review proposed memory',
        'Make preference changes reviewable before saving.',
      ],
      [
        'Work within your host',
        'The agent host still controls its own model access, permissions and processing.',
      ],
    ],
    setup:
      'Public installation instructions and directory availability are not confirmed here. Contact PatchworkMD for the current status.',
    faq: [
      [
        'Is Dreamer in the plugin directory?',
        'A listing has been prepared, but this page does not claim a live directory release.',
      ],
      [
        'Does it run everything automatically?',
        'No blanket automation promise is made. Host permissions and the requested workflow still apply.',
      ],
      [
        'Is all processing local?',
        'That depends on the agent host and model configuration. Local workflow files do not guarantee local model processing.',
      ],
    ],
  },
  localmodelmatch: {
    name: 'LocalModelMatch',
    status: 'Public preview',
    tagline: 'Find a model that fits your machine.',
    intro:
      'Compare local AI models with runtime-aware memory estimates and Hugging Face discovery.',
    url: 'https://localmodelmatch.com',
    cta: 'Open LocalModelMatch',
    benefits: [
      [
        'Start with your hardware',
        'Enter and confirm your hardware before comparing models.',
      ],
      [
        'Compare runtime choices',
        'Use memory estimates that account for the selected runtime and model format.',
      ],
      [
        'Explore available models',
        'Browse model options and source details from Hugging Face.',
      ],
    ],
    setup:
      'Open the preview, confirm your hardware and runtime, then compare model estimates. Check the model source and license before downloading.',
    faq: [
      [
        'Are these benchmark results?',
        'No. Fit and memory estimates are guidance, not measurements of speed, quality or stability on your machine.',
      ],
      [
        'Can the browser detect my hardware exactly?',
        'Automatic detection may be incomplete. Confirm or enter your hardware manually.',
      ],
      [
        'Does a model fitting mean it will run?',
        'No. Runtime compatibility, model format, context length and other workloads also matter.',
      ],
    ],
  },
  'type-b': {
    name: 'Type B',
    status: 'Concept',
    tagline: 'A quieter way to work with your assistant.',
    intro:
      'An early concept exploring native Mac setup, connections and memory controls, with everyday interaction through iMessage.',
    benefits: [
      [
        'Native setup',
        'A SwiftUI direction for onboarding, connections and preferences.',
      ],
      [
        'Visible memory controls',
        'An interface concept for reviewing the information an assistant keeps.',
      ],
      [
        'Everyday interaction',
        'Exploring a messaging surface for day-to-day requests.',
      ],
    ],
    setup:
      'There is no verified public app or installer. Current HTML previews are design explorations; native source and scalable transport decisions remain open.',
    faq: [
      [
        'Can I use it today?',
        'No public product is available. This is a concept page.',
      ],
      [
        'Has the native app been tested?',
        'A native build and manual product QA are not verified.',
      ],
      [
        'Where is it hosted?',
        'Cloud hosting and transport choices have not been selected.',
      ],
    ],
  },
  unicycle: {
    name: 'UNICYCLE',
    status: 'Locally tested candidate · 0.1.0',
    tagline: 'Keep agent coordination accountable.',
    intro:
      'A Codex workflow plugin for tracking requests, handoffs and acknowledgements across agent work.',
    benefits: [
      [
        'Track coordination state',
        'Keep workflow state local and make progress visible.',
      ],
      [
        'Use explicit handoffs',
        'Connect requests and acknowledgements rather than treating dispatch as completion.',
      ],
      [
        'Preserve host boundaries',
        'The agent host and adapters retain their own permissions and processing behavior.',
      ],
    ],
    setup:
      'The 0.1.0 candidate has passed local installation checks. A public directory link and a supported public ZIP installation flow are not yet verified. Contact hello@patchworkmd.dev for availability; this page will link the verified release when ready.',
    faq: [
      [
        'Can I install it from this page?',
        'A public download and installation path are not available here yet. Local testing does not establish a public directory release.',
      ],
      [
        'Is local state encrypted by the plugin?',
        'The helper uses local SQLite state with file permissions. It does not add application-level encryption.',
      ],
      [
        'Does removing local state erase everything?',
        'No. Host histories, logs and backups are separate. Review the supported reset instructions before changing state.',
      ],
    ],
  },
};
type Slug = keyof typeof products;
function product(slug: string) {
  return Object.prototype.hasOwnProperty.call(products, slug)
    ? products[slug as Slug]
    : null;
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const requested = (await params).product;
  const slug = requested === 'localmodelfit' ? 'localmodelmatch' : requested;
  const p = product(slug);
  if (!p) return { title: 'Not found', robots: { index: false } };
  const title = p.name + ' — ' + p.tagline;
  const description = p.intro + ' ' + p.status + '.';
  const url = 'https://patchworkmd.dev/' + slug;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}
export default async function Product({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const slug = (await params).product;
  if (slug === 'localmodelfit') permanentRedirect('/localmodelmatch');
  const p = product(slug);
  if (!p) notFound();
  return (
    <>
      <header>
        <Link className="wordmark" href="/">
          PatchworkMD
        </Link>
        <nav aria-label="Product navigation">
          <a href="#start">Get started</a>
          <a href="#faq">FAQ</a>
        </nav>
      </header>
      <main id="main">
        <section className="intro">
          <div className="intro-copy">
            <p className="eyebrow">
              {p.name} · {p.status}
            </p>
            {slug === 'unicycle' && (
              <Image
                src="/unicycle-icon.png"
                alt="UNICYCLE spoke logo"
                width={88}
                height={88}
                unoptimized
              />
            )}
            {slug === 'dreamer' && (
              <Image
                src="/dreamer-icon.png"
                alt="Dreamer logo"
                width={88}
                height={88}
                unoptimized
              />
            )}
            <h1>{p.tagline}</h1>
            <p className="bio">{p.intro}</p>
            {p.repo && (
              <a className="product-cta" href={p.repo}>
                View source on GitHub →
              </a>
            )}
            {p.url && (
              <a className="product-cta" href={p.url}>
                {p.cta} →
              </a>
            )}
          </div>
        </section>
        <section aria-label="Product overview">
          {p.benefits.map(([a, b]) => (
            <article className="project" key={a}>
              <h2>{a}</h2>
              <p>{b}</p>
            </article>
          ))}
        </section>
        <section className="skills" id="start">
          <div className="section-title">
            <h2>Get started</h2>
            <span>{p.status}</span>
          </div>
          <p className="detail">{p.setup}</p>
        </section>
        <section className="skills" id="faq">
          <div className="section-title">
            <h2>Questions and answers</h2>
          </div>
          {p.faq.map(([a, b]) => (
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
          <h2>Get in touch</h2>
          <div>
            <p>For project questions, feedback and support.</p>
            <a href="mailto:hello@patchworkmd.dev">hello@patchworkmd.dev</a>
            <p className="support-note">
              If this project is useful, you can support the work:
            </p>
            <a
              className="support-link"
              href="mailto:support@patchworkmd.dev?subject=Support%20this%20project"
            >
              Buy me a coffee ↗
            </a>
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
