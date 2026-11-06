# PatchworkMD status — November 6, 2026

## Current gates

This is the only current list. Everything below "History" is a past receipt.

| Gate                                                                  | Owner                                   | Evidence needed to clear                                                                                                                     | Recommended option                                                              |
| --------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Cal.com event created and exact URL returned                          | Event-creation bot, signed in as Austin | Event URL, duration, time zone, availability, location, and booking questions; then `lib/booking-config.json` set and `npm run verify` green | Create the event; until then keep the honest email fallback                     |
| Production site and Cal.com booking live                              | Austin (release owner)                  | Production URL and event URL verified together: booking, confirmation, rescheduling, and cancellation                                        | Merge and deploy only on Austin's separate authorization                        |
| Patchy takes real Leads                                               | Austin                                  | Both rows above cleared and recorded in the private operating record                                                                         | Keep Lead intake off until then                                                 |
| Advertise referral rewards                                            | Austin                                  | Approved eligibility, reward, trigger, limits, timing, and owner                                                                             | No until written terms exist                                                    |
| Homepage cover photo                                                  | Austin                                  | A cleared photo with its intended crop                                                                                                       | Keep the current approved illustration until a photo is supplied                |
| Remove the unused `components/ui/` kit (60 files, no page imports it) | Austin                                  | Archive branch named, then removal PR                                                                                                        | Yes: archive to a branch, then remove it from `main`                            |
| Rename the 2DO slug `/2d0` → `/2do`                                   | Austin                                  | Decision only                                                                                                                                | Yes, with a permanent redirect from `/2d0`                                      |
| Merge order                                                           | Austin                                  | Review of #6 and the round-2 PR                                                                                                              | Merge the round-2 PR (it contains #6, #5, and #4), then close those as included |

## Quality push

Round 1 (#6, `push/20261105-quality`) merged #4 and #5 and added the verify gate, domain and agent docs, the Product catalogue, and the pausable 2DO film. Round 2 (`push/20261106-quality-10-r2`, stacked on #6) closes the independent round-1 score report. Details and counts: `/workspace/t3-scratch/quality-eval-20261106/PatchworkMD-hillclimb-r2.md`.

Commands: `npm run verify` (format, lint, typecheck, unit tests); `npm run build && npm run check:browser` (built-site checks at 1440, 390, and 320px); `npm run agents:preflight` (read-only triage-label check).

## History

### November 5, 2026 push

Delivery was split into [#4](https://github.com/PatchworkMD/PatchworkMD/pull/4) (intro calls, referral preparation, motion polish) and [#5](https://github.com/PatchworkMD/PatchworkMD/pull/5) (all 20 lint errors).

- Added shared, validated Cal.com configuration and intro-call CTAs in the hero and contact section. The empty configuration opens an email request.
- Prepared scheduling privacy information, event handoff and release instructions, and a consent-based referral operating draft. No incentive is published.
- Added masthead entrance, scroll-driven reveals, and a booking-arrow interaction, all limited to `prefers-reduced-motion: no-preference`.
- Tightened the 320px contact heading and moved the mobile motion control so it cannot cover contact links.
- #5 fixed all 20 reproduced lint errors without weakening rules.
- Receipts at the time: #5 tests 5 / pass 5 / fail 0 / skip 0 on Node 22.15.0; #4 build, TypeScript, three booking tests, and browser checks at 1440, 390, and 320px. Existing non-fatal Vite JSON-import and vinext route-classification notices remain.
