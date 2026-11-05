# PatchworkMD status — November 5, 2026

Branch: `push/20261105-intro-calls`. Not ship-ready; release gates remain.

## Done
- Read the binding Austin decisions and project brief; preserved clean baseline and product routes.
- Added intro-call CTAs in the hero and contact section, plus a navigation handoff.
- Shared Cal.com configuration validates a direct HTTPS event URL; the empty default honestly requests a call by email.
- Added scheduling privacy information, setup/release instructions, and three passing Node test cases including invalid destinations.
- Prepared referral intake, private tracker fields, weekly review, and launch decisions without publishing an offer.
- Production build and TypeScript check pass. Changed-file lint and whitespace checks pass.

## Verification limits
- Full `npm run lint` reports 20 errors in unchanged template components and hooks, including accessibility rules, effect state updates, and chart template expressions. This chunk does not resolve them.
- Desktop/390px/320px visual and console checks are incomplete: Playwright Chromium cannot launch because system libraries including `libnspr4.so` are missing. Package lists are absent, so an isolated apt download could not resolve them. No screenshots or preview deployment are claimed.
- Build emits the existing Vite JSON import compatibility warning and vinext route-classification notice.
- Node dependencies installed from the lockfile using a temporary npm CLI because npm is absent from PATH. No project dependency was added.

## Austin clarification — grill 02:30
- The site should remain motion-rich and respect `prefers-reduced-motion`. Existing canvas and shader motion check the preference; CSS disables animations and transitions for reduced motion. Browser verification is still outstanding.
- Patchy takes real leads only after the production site and Cal.com booking are live and verified. Keep real-lead intake disabled until then.
- An event-creation bot will create the Cal.com event using Austin sign-in and return the exact URL. This repository task does not create the event or request credentials.

## In progress / next
- Complete browser verification and a visual taste pass in an environment with browser system libraries.
- Resolve repository-wide lint separately before calling the site ship-ready.
- Orbit product and broader SEO remain behind the site/booking and referral priorities; sibling repositories were not modified.

## Gates for Austin
| Decision | Yes/no needed | Recommended option |
| --- | --- | --- |
| Event-creation bot returns confirmed Cal.com event URL and settings? | Yes, bot handoff | Create with Austin sign-in; fill `lib/booking-config.json` after verification |
| Enable Patchy real-lead intake? | Yes, after live verification | Keep disabled until production site and working Cal.com booking are live; approve referral owner and terms separately |
| Advertise referral rewards now? | Yes | No, until eligibility, reward, trigger, limits, and timing are approved |
| Merge or deploy production? | Yes, later | No until browser checks, lint, and booking confirmation are complete |

## Delivery
GitHub CLI has no authenticated account and the shell push failed for missing credentials. The connected GitHub integration is authenticated as PatchworkMD and is being used to publish the verified file tree and open a PR. Results are recorded in the final handoff. No production deployment or merge has been performed.
