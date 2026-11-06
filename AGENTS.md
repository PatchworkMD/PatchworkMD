# Agent guide

Read `CONTEXT.md`, `GLOSSARY.md`, and `docs/adr/` first. `STATUS.md` holds the current push and Austin's gates.

## Map

- `app/page.tsx`: homepage. `app/[product]/page.tsx`: Product pages from the catalogue. `app/orbit/` and `app/openngp/`: hand-built Product pages.
- `lib/products.ts`: the Product catalogue and `resolveProduct`, the product route's seam.
- `lib/booking.ts`, `lib/booking-config.json`: intro-call destination ([ADR 0002](docs/adr/0002-direct-cal-com-link-with-email-fallback.md)).
- `components/`: site chrome and motion artwork. `components/ui/` is a generated shadcn kit no page imports yet.
- `components/artwork/`: the shared artwork lifecycle (`loop.ts`), WebGL ink shader, and `AsciiArtwork`; `FlashMark`, `OrbitAsciiArt`, and `FlashBackground` are its adapters. `lib/motion.ts` + `components/MotionToggle.tsx`: the one site-wide pause.
- `scripts/*.test.mjs`: `node --test` unit suites. `scripts/browser-check.mjs`: built-site browser suite.

## Commands

- `npm ci`, then `npm run verify` (format check, lint, typecheck, tests). The pre-commit hook and CI run the same command; CI also runs `npm run build`.
- `npm run build && npm run check:browser`: built-site browser checks (routes, metadata, layout at 1440/390/320px, keyboard, motion, film failure). It starts the site itself; `BROWSER_EXECUTABLE` overrides the Chromium binary. CI runs it on the Worker runtime and uploads screenshots per commit.
- `npm run agents:preflight`: read-only check that the documented triage labels exist on GitHub.
- `npm run dev` for a local server; `npm run format` to fix formatting.

## Rules

- Feature branches and PRs only. Never merge, deploy, force-push, or push `main`.
- `.claude/hooks/block-dangerous-git.sh` enforces this for Claude Code's Bash tool only: it blocks force and forced-refspec pushes, pushes to `main`/`master`, local and PR merges, hard resets, forced cleans, forced branch deletes, and discarding the working tree. It does not cover Codex, other agents, or GitHub connector tools; those rely on these rules. `scripts/guardrails.test.mjs` lists the exact cases.
- No AI attribution in commits or PRs.
- No Introduction, Lead, or Referral data in the repository, fixtures, or logs.
- Keep every moving element pausable and honour `prefers-reduced-motion`.

## Agent skills

### Issue tracker

GitHub Issues in `PatchworkMD/PatchworkMD`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md`, `GLOSSARY.md`, `docs/adr/`. See `docs/agents/domain.md`.
