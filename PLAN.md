# PatchworkMD push — November 5, 2026

Goal: turn the existing portfolio into a clear path to intro calls, then prepare referral operations. Keep the established motion-rich visual direction and all product routes. Respect `prefers-reduced-motion`, including preference changes while the page is open.

## Gaps against done
- No intro-call CTA or booking destination.
- No approved Cal.com event URL in project context.
- No referral operating procedure or approved incentive terms.
- Build, lint, mobile layout, and console checks need fresh evidence.

## Ordered work
1. Add a shared, validated Cal.com destination with an honest email fallback; link hero, navigation, and contact section.
2. Explain who the conversation is for and what to bring. Preserve product availability claims.
3. Add booking privacy information, setup instructions, and a runnable destination validation check.
4. Prepare a consent-based referral intake and tracking procedure without publishing unapproved incentives.
5. Build, lint, typecheck, capture 390px/320px evidence, commit, and open a PR.

## Gates
- The event-creation bot creates the Cal.com event using Austin sign-in and supplies the confirmed event URL. Use direct hosted scheduling, avoiding an iframe and third-party scripts.
- Patchy must not accept real leads until the production site and Cal.com booking are both live and verified. An email fallback or preview does not clear this gate.
- Austin approves referral eligibility, reward, trigger, and operating owner before launch. Recommend a manual pilot with no advertised reward until terms are settled.
- Production deployment and merging remain outside this push.

Orbit product and SEO follow these priorities; sibling repositories are context only for this repository push.
