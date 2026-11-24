export type Stage =
  | 'Concept'
  | 'In development'
  | 'Release candidate'
  | 'Public preview'
  | 'Experimental alpha';

export type Note = readonly [title: string, body: string];

type Link = { href: string; label: string };

export type ProductPage = {
  release?: string;
  tagline: string;
  intro: string;
  benefits: Note[];
  setup: string;
  faq: Note[];
  links?: Link[];
  preview?: { src: string; alt: string; caption: string };
  film?: { src: string; poster: string; label: string; caption: string };
};

export type Product = {
  slug: string;
  name: string;
  href: string;
  stage?: Stage;
  availability?: string;
  logo?: { src: string; alt: string };
  index?: { platform: string; summary: string; detail: string };
  page?: ProductPage;
};

export type Resolution =
  | {
      kind: 'page';
      product: Product & { page: ProductPage & { release: string } };
    }
  | { kind: 'redirect'; to: string }
  | { kind: 'missing' };

const pages = {
  airplayify: {
    release: 'Experimental alpha · 0.1.0-alpha.2',
    tagline: 'Explore grouped audio on your Mac.',
    intro: 'An experimental macOS app for audio-output grouping with Spotify.',
    links: [
      {
        href: 'https://github.com/PatchworkMD/airplayify-jam',
        label: 'View source on GitHub',
      },
      {
        href: 'https://github.com/PatchworkMD/airplayify-jam/releases/tag/v0.1.0-alpha.2',
        label: 'View alpha download',
      },
    ],
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

  '2d0': {
    release: 'iOS beta · build 2 approved',
    tagline: 'A whiteboard for your tasks.',
    intro:
      'A customizable task app with a whiteboard-marker character, quick capture and small celebrations for progress.',
    links: [
      {
        href: 'mailto:hello@patchworkmd.dev?subject=2DO%20beta%20access',
        label: 'Ask about beta access',
      },
    ],
    preview: {
      src: '/social/2d0-v1.png',
      alt: '2DO product preview with a whiteboard-inspired task message',
      caption:
        '2DO · public product preview · current availability listed below',
    },
    film: {
      src: '/2do-iphone-motion.mp4',
      poster: '/social/2d0-v1.png',
      label: '2DO product film showing the whiteboard app on a real iPhone',
      caption: '2DO · iPhone motion study · 5-second silent product film',
    },
    benefits: [
      [
        'Capture and return',
        'Write down a task, complete it, undo it, and return to your list. The Mac app also has a Quick Capture panel.',
      ],
      [
        'Set your style',
        'Choose a writing tool, ink color, mood and Marky’s personality. Sound and haptics are optional.',
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
    release: 'In development',
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
    tagline: 'Find a model that fits your machine.',
    intro:
      'Compare local AI models with runtime-aware memory estimates and Hugging Face discovery.',
    links: [
      { href: 'https://localmodelmatch.com', label: 'Open LocalModelMatch' },
    ],
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
    release: 'Concept',
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
    release: 'Locally tested candidate · 0.1.0',
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
} satisfies Record<string, ProductPage>;

export const products: Product[] = [
  {
    slug: 'openngp',
    name: 'OpenNGP',
    href: '/openngp',
    stage: 'In development',
    index: {
      platform: 'Campaign software',
      summary:
        'Fundraising and organizing software with separate campaign workspaces.',
      detail:
        'Brings donor profiles, pledges, contributions, and call outcomes into one workflow. Public distribution is not available yet.',
    },
  },
  {
    slug: '2d0',
    name: '2DO',
    href: '/2d0',
    logo: { src: '/2do-current-icon.png', alt: '2DO app icon' },
    stage: 'In development',
    index: {
      platform: 'Mac & iPhone',
      summary: 'Capture tasks and keep lists on Mac and iPhone.',
      detail:
        'Local-first storage and a whiteboard-inspired interface. Mac and iPhone releases are in preparation.',
    },
    page: pages['2d0'],
  },
  {
    slug: 'dreamer',
    name: 'Dreamer',
    href: '/dreamer',
    logo: { src: '/dreamer-nightcap.png', alt: 'Dreamer logo' },
    stage: 'In development',
    index: {
      platform: 'Agent tools',
      summary:
        'Review what an agent finished and carry context into the next session.',
      detail:
        'The store listing is a draft and has not been submitted for review. Dreamer is not available in the store yet.',
    },
    page: pages.dreamer,
  },
  {
    slug: 'orbit',
    name: 'Orbit',
    href: '/orbit',
    availability: 'A public signed installer is not available yet.',
    logo: { src: '/orbit-icon.png', alt: 'Orbit app icon' },
    stage: 'Release candidate',
    index: {
      platform: 'macOS',
      summary: 'A Mac app for coding-agent sessions and approvals.',
      detail: 'Native coding-agent sessions and approvals.',
    },
  },
  {
    slug: 'localmodelmatch',
    name: 'LocalModelMatch',
    href: '/localmodelmatch',
    stage: 'Public preview',
    availability: 'Available to try · Estimates, not benchmarks',
    page: pages.localmodelmatch,
  },
  {
    slug: 'airplayify',
    name: 'Airplayify Jam',
    href: '/airplayify',
    page: pages.airplayify,
  },
  { slug: 'type-b', name: 'Type B', href: '/type-b', page: pages['type-b'] },
  {
    slug: 'unicycle',
    name: 'UNICYCLE',
    href: '/unicycle',
    logo: { src: '/unicycle-icon.png', alt: 'UNICYCLE spoke logo' },
    page: pages.unicycle,
  },
  {
    slug: 'app-design-research',
    name: 'App Design Research',
    href: '/app-design-research',
  },
];

const aliases = new Map([['localmodelfit', 'localmodelmatch']]);

export function resolveProduct(slug: string): Resolution {
  const canonical = aliases.get(slug);
  if (canonical) return { kind: 'redirect', to: '/' + canonical };
  const product = products.find((candidate) => candidate.slug === slug);
  const release = product?.page?.release ?? product?.stage;
  if (!product?.page || !release) return { kind: 'missing' };
  return {
    kind: 'page',
    product: { ...product, page: { ...product.page, release } },
  };
}

export function stageOf(slug: string): Stage {
  const stage = productFact(slug).stage;
  if (!stage) throw new Error(`No Stage recorded for ${slug}`);
  return stage;
}

export function availabilityOf(slug: string): string {
  const availability = productFact(slug).availability;
  if (!availability) throw new Error(`No availability recorded for ${slug}`);
  return availability;
}

function productFact(slug: string) {
  const product = products.find((candidate) => candidate.slug === slug);
  if (!product) throw new Error(`No Product ${slug}`);
  return product;
}

export function indexedProducts() {
  return products.flatMap(({ index, stage, ...product }) =>
    index && stage ? [{ ...product, index, stage }] : [],
  );
}
