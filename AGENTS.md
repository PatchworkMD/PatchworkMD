# Agent guide

Read `CONTEXT.md`, `GLOSSARY.md`, and `docs/adr/` first. `STATUS.md` holds the current push and Austin's gates.

## Map

- `app/page.tsx`: homepage. `app/[product]/page.tsx`: Product pages from the catalogue. `app/orbit/` and `app/openngp/`: hand-built Product pages.
- `lib/products.ts`: the Product catalogue (name, Stage, availability, Release status, links) and `resolveProduct`, the product route's seam. Pages read shared facts through `stageOf` and `availabilityOf`; editorial copy stays in the page.
- `lib/booking.ts`, `lib/booking-config.json`: intro-call destination ([ADR 0002](docs/adr/0002-direct-cal-com-link-with-email-fallback.md)).
- `components/`: site chrome and motion artwork. `components/ui/` is a generated shadcn kit no page imports yet.
- `components/artwork/`: the shared artwork lifecycle (`loop.ts`), WebGL ink shader, and `AsciiArtwork`; `FlashMark`, `OrbitAsciiArt`, and `FlashBackground` are its adapters. `lib/motion.ts` is the one motion policy: `allowsMotion()` combines the Pause motion control with `prefers-reduced-motion`, and its `subscribe` fires on either. The artwork loop, `FlashBackground`, and `ProductFilm` read it; the CSS side is the single `data-motion` block at the end of `app/globals.css`. `components/MotionToggle.tsx` is the control.
- `scripts/stake.mjs`: the stake tier runner (`npm run stake`); `scripts/private-data.mjs`: its private-data scan. `knip.json`: knip entry points and the allowlist for the gated `components/ui` kit.
- `scripts/*.test.mjs`: `node --test` unit suites. `scripts/site-server.mjs`: starts the built site with bounded readiness checks and captured output. `scripts/browser-check.mjs`: built-site browser suite.

## Commands

- `npm ci`, then `npm run stake`: format, oxlint, `tsc`, knip, the private-data scan, and each unit test file, in parallel, under 60 s. Its last line is the metric, `stake: <s> s · <pass>/<total> pass · slowest: <name> <s> s`. The pre-commit hook and CI's `stake` job run it; `npm run verify` is an alias.
- `scripts/private-data.mjs` fails on personal email addresses, phone numbers, or data-export files (CSV, XLSX, VCF, databases) in the repository. Only patchworkmd.dev and synthetic domains (example.com, .test, .invalid) pass.
- `npm run build && npm run check:browser` (UI changes only; CI's slower `browser` job runs it after `stake`): built-site browser checks (routes, metadata, layout at 1440/390/320px, keyboard, motion, film failure). It starts the site itself; `BROWSER_EXECUTABLE` overrides the Chromium binary. CI runs it on the Worker runtime and uploads screenshots per commit.
- `npm run agents:preflight`: read-only check that the documented triage labels exist on GitHub.
- `npm run dev` for a local server; `npm run format` to fix formatting.

## Rules

- Before every push, run `npm run stake` and paste its last line in the PR body under `Stake:` (`.github/pull_request_template.md`). It must finish in 60 s.
- Fix the root cause of a failing stake check; never loosen or skip it. After two identical failures, stop and report the exact error.
- A new regression class gets a stake check (one offline file, under 10 s) rather than a prose rule.

- Feature branches and PRs only. Never merge, deploy, force-push, or push `main`.
- `.claude/hooks/block-dangerous-git.sh` enforces this for Claude Code's Bash tool only: it blocks force and forced-refspec pushes, pushes to `main`/`master`, local and PR merges, hard resets, forced cleans, forced branch deletes, and discarding the working tree. It does not cover Codex, other agents, or GitHub connector tools; those rely on these rules. `scripts/guardrails.test.mjs` lists the exact cases.
- No AI attribution in commits or PRs.
- No Introduction, Lead, or Referral data in the repository, fixtures, or logs.
- Keep every moving element pausable and honour `prefers-reduced-motion`: route new automatic motion through `lib/motion.ts`, not a new `matchMedia` check.
- CSS cascade order: `app/globals.css` (base), then `app/portfolio.css` (portfolio theme, loaded after), then route CSS such as `app/orbit/orbit.css`. Edit a selector in the block that already owns it rather than appending a new override.

## Agent skills

### Issue tracker

GitHub Issues in `PatchworkMD/PatchworkMD`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md`, `GLOSSARY.md`, `docs/adr/`. See `docs/agents/domain.md`.
