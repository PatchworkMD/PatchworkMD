# PatchworkMD quality push — November 6, 2026

Goal: raise the repository to at least 7/10 on Austin's quality rubric without changing product claims. Detailed plan: `.humanlayer/tasks/quality-hillclimb/01-plan-quality-hillclimb.md` (local, ignored).

1. One verify command, enforced by a pre-commit hook and CI.
2. Product context, glossary, ADRs, and the agent guide.
3. One Product catalogue behind a tested route seam.
4. Remove type escapes; pausable 2DO film; FAQ semantics.

Gates: UI kit removal, 2DO slug rename, merge order (see STATUS.md).

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
