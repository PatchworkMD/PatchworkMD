# 2. Book intro calls through a direct Cal.com link with an email fallback

Date: 2026-11-05
Status: Accepted

## Context

The site needs a way to start an Intro call before Austin's Cal.com event exists. Options were an embedded scheduler (iframe or script), a direct hosted link, or email only.

## Decision

All booking links read one validated value, `calBookingUrl` in `lib/booking-config.json`. An empty value opens an email with a project-intro subject. A value must be a direct `https://cal.com/<account>/<event>` URL with no query or fragment, or validation fails the build and tests.

## Consequences

- No third-party script, iframe, tracking, or extra client JavaScript loads before a visitor chooses to schedule.
- The label is honest: "Request an intro call" for email, "Book an intro call" for Cal.com.
- Switching provider means changing `lib/booking.ts` validation and its tests.
- Setup and release checks: [docs/operations/intro-calls.md](../operations/intro-calls.md).
