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

## In progress / next
- Complete browser verification and a visual taste pass in an environment with browser system libraries.
- Resolve repository-wide lint separately before calling the site ship-ready.
- Orbit product and broader SEO remain behind the site/booking and referral priorities; sibling repositories were not modified.

## Gates for Austin
| Decision | Yes/no needed | Recommended option |
| --- | --- | --- |
| Confirm exact Cal.com event URL and event settings? | Yes | Use an existing hosted event; fill `lib/booking-config.json` after verification |
| Launch the referral pilot? | Yes | Manual consent-based pilot with a private tracker; approve owner and written terms first |
| Advertise referral rewards now? | Yes | No, until eligibility, reward, trigger, limits, and timing are approved |
| Merge or deploy production? | Yes, later | No until browser checks, lint, and booking confirmation are complete |

## Delivery
GitHub CLI has no authenticated account and the shell push failed for missing credentials. The connected GitHub integration is authenticated as PatchworkMD and is being used to publish the verified file tree and open a PR. Results are recorded in the final handoff. No production deployment or merge has been performed.
