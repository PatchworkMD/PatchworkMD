# SEO and link previews

Canonical origin: https://patchworkmd.dev

Each of 12 public pages has a server-rendered title, description, canonical URL, Open Graph image and large Twitter card. Homepage WebSite JSON-LD uses the public developer name. Sitemap includes public routes and privacy; unpublished app privacy remains excluded. No invented reviews, ratings, offers, or availability claims.

Checks: TypeScript, lint and production build pass. Playwright with JavaScript disabled validates all 12 page metadata sets and one H1 per page. Both public origins loaded HTTP 200 in Chromium without an X-Robots-Tag restriction. Direct urllib requests were rejected with 403; Googlebot reachability and Search Console indexing are not verified.

Search Console property verification, sitemap submission, and indexing outcomes are not claimed. Existing Messages previews may remain cached.

References:
- https://developer.apple.com/videos/play/tech-talks/205/
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/appearance/title-link
