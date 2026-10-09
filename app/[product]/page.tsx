import { pageMetadata } from '../../lib/seo';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { SiteFooter, SiteHeader } from '../../components/SiteChrome';
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
  previewImage?: string;
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
    tagline: 'Coding sessions and approvals.',
    intro:
      'A native macOS companion for coding-agent sessions, questions and approvals.',
    benefits: [
      [
        'Native Mac interface',
        'A SwiftUI and AppKit interface brings coding-session context into a native Mac surface.',
      ],
      [
        'Questions and approvals',
        'Follow questions and approval requests as part of your workflow.',
      ],
      [
        'Mac requirements',
        'Designed for macOS 14 and later. Universal packaging has been tested; physical Intel testing remains open.',
      ],
    ],
    setup:
      'A public signed installer is not available yet. Orbit has a local release candidate; signing, notarization and public distribution checks remain open.',
    faq: [
      [
        'Can I download it?',
        'Not yet. Orbit has a local release candidate. Signing, notarization and public distribution checks remain open, so no public download is offered.',
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
        'The update system still needs a populated feed and signing configuration. No automatic-update promise is made for the candidate.',
      ],
    ],
  },
  '2d0': {
    name: '2DO',
    status: 'iOS beta · build 2 approved',
    tagline: 'A whiteboard for your tasks.',
    intro:
      'A customizable task app with a whiteboard-marker character, quick capture and small celebrations for progress.',
    previewImage: '/social/2d0-v1.png',
    benefits: [
      [
        'Capture and return',
        'Write down a task, complete it, undo it, and return to your list. The Mac app also has a Quick Capture panel.',
      ],
      [
        'Set your style',
        'Choose a writing tool, ink color, mood and buddy personality. Sound and haptics are optional.',
      ],
      [
        'On-device task storage',
        'Task data stays on the device. The app can mirror to configured local files and writes a local widget snapshot.',
      ],
      [
        'Completion feels physical',
        'Marker streaks, a short reward animation, haptics and optional sounds make finishing the task the payoff.',
      ],
    ],
    setup:
      'Apple approved iOS 1.0 build 2 for beta testing. The newer illustrated local candidate is not uploaded. Public installation and open beta invitations are not available here; email hello@patchworkmd.dev for current beta access.',
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
      [
        'Can I download a Mac build here?',
        'No. The Mac build is a private local candidate, and no public build is offered here.',
      ],
    ],
  },
  dreamer: {
    name: 'Dreamer',
    status: 'In development',
    tagline: 'Continue an agent’s work.',
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
    tagline: 'An iMessage assistant concept.',
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
    tagline: 'Track requests between agents.',
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
  return pageMetadata(title, description, '/' + slug);
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
      <SiteHeader product />
      <main id="main">
        <section className={`intro product-intro product-${slug}`}>
          <div className="intro-copy">
            <p className="eyebrow">
              {p.name} · {p.status}
            </p>
            {(slug === '2d0' || slug === 'orbit') && (
              <Image src={slug === '2d0' ? '/2do-current-icon.png' : '/orbit-icon.png'} alt={`${p.name} app icon`} width={88} height={88} className="app-logo" unoptimized />
            )}
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
                src="/dreamer-nightcap.png"
                alt="Dreamer logo"
                width={88}
                height={88}
                unoptimized
              />
            )}
            <h1>{p.tagline}</h1>
            <p className="bio">{p.intro}</p>
            {slug === 'orbit' && (
              <p className="intro-note orbit-campaign-note">
                This page presents the current release candidate. It is not a public download or a promise of provider support.
              </p>
            )}
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
            {slug === '2d0' && (
              <a className="product-cta" href="mailto:hello@patchworkmd.dev?subject=2DO%20beta%20access">
                Ask about beta access →
              </a>
            )}
          </div>
        </section>
        {p.previewImage && (
          <figure className="product-preview-figure">
            <Image
              src={p.previewImage}
              alt="2DO product preview with a whiteboard-inspired task message"
              width={1200}
              height={630}
              unoptimized
            />
            <figcaption>2DO · public product preview · current availability listed below</figcaption>
          </figure>
        )}
        {slug === '2d0' && (
          <figure className="product-motion-figure">
            <video
              className="product-motion-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/social/2d0-v1.png"
              aria-label="2DO product film showing the whiteboard app on a real iPhone"
            >
              <source src="/2do-iphone-motion.mp4" type="video/mp4" />
              Your browser does not support the 2DO product film.
            </video>
            <figcaption>2DO · iPhone motion study · 5-second silent product film</figcaption>
          </figure>
        )}
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
            <h2>Availability</h2>
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
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
