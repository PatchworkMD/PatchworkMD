# PatchworkMD context

The public portfolio site for PatchworkMD (patchworkmd.dev): Austin's independent software for Mac, the web, and campaign teams. Domain terms live in [GLOSSARY.md](GLOSSARY.md); hard-to-reverse decisions live in [docs/adr/](docs/adr/).

## Audience

- People deciding whether to bring Austin a project. They need to see the work, trust its stated availability, and start an intro call.
- People checking one Product. They need its Stage, Release status, and the honest way to get it.
- Referrers who already know Austin's work.

## Brand

- Name: **PatchworkMD** in prose and the footer; **patchwork.md** is the wordmark and the site name in metadata.
- Line: "Find the friction. Fix the flow. Ship the useful thing."
- Voice: plain, specific, first person singular. State availability exactly; never imply a Product is released when it is not.
- Visual direction: motion-rich traditional-flash artwork (ASCII and WebGL) on a warm editorial page. All motion respects `prefers-reduced-motion`, including changes while the page is open, and every moving element can be paused.

## Decisions

- Intro calls are the primary call to action. Booking goes to a direct Cal.com event link with an email fallback ([ADR 0002](docs/adr/0002-direct-cal-com-link-with-email-fallback.md)).
- No visitor analytics, advertising trackers, or browser storage.
- Referral rewards are not advertised until Austin approves eligibility, reward, trigger, limits, timing, and owner ([docs/operations/referrals.md](docs/operations/referrals.md)).
- Patchy takes real Leads only after the production site and Cal.com booking are both live and verified.
- Product facts (name, Stage, availability, Release status, links) have one source: `lib/products.ts`.
- One Pause motion control pauses every automatic motion on the site, and its state holds across client navigation. A visitor's explicit Play film still plays.
- Agents work on feature branches and open PRs. Austin merges and deploys.
