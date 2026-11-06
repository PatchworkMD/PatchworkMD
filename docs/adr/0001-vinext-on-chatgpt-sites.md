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
