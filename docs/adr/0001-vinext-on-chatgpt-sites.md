# 1. Build with vinext and host on ChatGPT Sites

Date: 2026-11-06 (recorded retroactively; the stack dates from 2026-09-06, commit `6c9554d`)
Status: Accepted

## Context

The site was created with ChatGPT Sites. Its project (`.openai/hosting.json`) deploys through `@openai/sites-vite-plugin` to a Cloudflare Worker. The code uses the Next.js App Router conventions (`app/`, `next/link`, `next/image`, `generateMetadata`).

## Decision

Keep vinext (the Next.js App Router API on Vite) as the framework and ChatGPT Sites as the host. Do not port to Next.js on another host.

## Consequences

- Imports from `next/*` resolve to vinext shims. Check vinext behaviour, not Next.js documentation, when routing or metadata looks wrong.
- Builds print non-fatal vinext route-classification and Vite JSON-import notices.
- The Worker runtime has no Node filesystem at request time. Product data ships as modules (`lib/products.ts`), not files read on request.
- Moving hosts means replacing the Sites plugin, the Worker entry, and the privacy page's hosting paragraph together.

## Amendment, 2026-11-14 (RGE 2170)

Austin moved hosting to Cloudflare Pages so bots can deploy. The vinext build is unchanged. `npm run build:pages`
assembles `out/`: the static files, the vinext Worker as `out/_worker.js/`, and a `_routes.json` that sends every
built file to Pages directly. The Worker only calls `env.ASSETS` for some paths, so without those rules the
`/_next/static` chunks returned 404. Pages project: `patchworkmd-site` (`nodejs_compat`, compatibility date
2026-09-03). Deploy with `npx wrangler pages deploy out --project-name patchworkmd-site --no-bundle`. The `cf` CLI
creates and edits the project but does not upload files. The privacy page now names Cloudflare as the host. The
`@openai/sites-vite-plugin` stays in the build until the DNS cutover is done and checked; remove it after that.
