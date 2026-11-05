# PatchworkMD status — November 5, 2026

Delivery is split into two independent PRs against `main`:
- [#4 — Intro calls, referral preparation, and motion polish](https://github.com/PatchworkMD/PatchworkMD/pull/4), branch `push/20261105-intro-calls`.
- [#5 — All 20 existing lint errors](https://github.com/PatchworkMD/PatchworkMD/pull/5), branch `push/20261105-lint`.

## Done
- Added shared, validated Cal.com configuration and intro-call CTAs in the hero/contact section. The empty configuration honestly opens an email request.
- Prepared scheduling privacy information, event handoff/release instructions, and a consent-based referral operating draft. No incentive is published.
- Added masthead entrance, scroll-driven reveals, and a booking-arrow interaction, all limited to `prefers-reduced-motion: no-preference`.
- Background drawing stops scheduling frames when paused, hidden, or reduced-motion is requested, and resumes on preference/visibility/resize/control changes.
- Tightened the 320px contact heading and moved the mobile background control to the top row so it cannot cover contact links.
- PR #5 fixes all 20 reproduced lint errors without weakening rules: native semantics, explicit labels/link content, chart key conversion, external-store mobile/carousel state, subscription cleanup, and WebGL method binding.

## Verification
- PR #5: full lint, TypeScript, production build, five component-rendering checks, and whitespace checks pass. The package and root lockfile now require Node >=22.15.0, matching the test loader. Minimum-version verification on Node 22.15.0: tests total 5 / pass 5 / fail 0 / skip 0.
- PR #4: production build, TypeScript, three booking tests, changed-file lint, and whitespace checks pass. The 20 inherited full-lint errors are resolved separately in PR #5; they remain on #4 until the independent cleanup is integrated by the release owner.
- Final production browser checks pass locally at desktop 1440px, 390px, and 320px with zero console, page, or HTTP errors, covering homepage, Orbit, and privacy layouts, booking hit targets, keyboard focus, console/page/HTTP errors, pause behavior, and reduced motion on load and after a preference change. Final results and screenshots are under ignored `outputs/browser-check/`.
- Initial screenshot review prompted the mobile heading/control fixes. The final browser check explicitly tests branding/contact-link overlap.
- T3 preview repeatedly reported its browser was still unpacking. Local Playwright was used after these failures, with browser libraries extracted under ignored `outputs/`; no system installation or paid service was used. `/opt/tools/bin/gh` is authenticated as PatchworkMD.
- Existing non-fatal Vite JSON-import and vinext route-classification notices remain.

## Gates for Austin / event-creation bot
| Gate | Yes/no needed | Recommended option |
| --- | --- | --- |
| Cal.com event created and exact event URL returned? | Yes, bot handoff | Event-creation bot uses Austin sign-in; verify event settings, then populate `lib/booking-config.json` |
| Production site and working Cal.com booking live? | Yes, release owner | Keep Patchy real-lead intake disabled until both are live and booking/confirmation/rescheduling/cancellation are verified |
| Advertise referral rewards? | Yes | No until eligibility, reward, trigger, limits, timing, and owner are approved |
| Merge or deploy production? | Separate authorization | Neither performed in this push |

Orbit product and broader SEO remain after the site/booking and referral priorities. Sibling repositories were not modified.
