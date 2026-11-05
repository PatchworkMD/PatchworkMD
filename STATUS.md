# PatchworkMD lint cleanup — November 5, 2026

Branch: `push/20261105-lint`, based on `main`. Separate from the booking/motion PR.

## Done
- Reproduced all 20 existing lint errors and corrected every reported site, template, hook, and chart issue without weakening lint rules.
- Used native grouping/list/separator/status semantics; kept exported component names and standalone Item behavior. Input adornments still focus their input on click.
- Made label association and pagination content explicit; kept chart key string conversion.
- Replaced effect-driven mobile/carousel state with external-store subscriptions and cleaned up both carousel events.
- Corrected the WebGL method’s false hook classification by binding its native method to an unambiguous name.
- Added runnable component-rendering checks using installed React and TypeScript; `npm test` runs them. The test loader uses Node 22.15+ module hooks (verification used 22.23.2).
- Full lint, TypeScript, production build, and whitespace checks pass. Component checks are recorded after the final run in the PR.

## Remaining project gates
- Booking and motion work remains in PR #4, including desktop/390px/320px browser checks.
- Cal.com event-creation bot must return the confirmed event URL after Austin sign-in.
- Patchy real-lead intake stays disabled until production site and Cal.com booking are live and verified.
- No merge or production deployment is authorized by this cleanup.
