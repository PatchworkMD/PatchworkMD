# Intro-call setup and release check

The homepage uses `components/IntroCallLink.tsx` in its hero and contact section. Navigation links to the contact section. All booking links share `lib/booking-config.json`.

Set `calBookingUrl` to Austin’s confirmed `https://cal.com/account/event` URL. Leave it empty until confirmed: visitors see “Request an intro call” and open an email with a project-intro subject. A configured URL changes the label to “Book an intro call”. Invalid destinations fail validation instead of silently redirecting visitors.

A direct hosted link avoids iframe scrolling on small screens, extra client JavaScript, and loading the calendar provider before a visitor chooses to schedule. No new dependency, account, tracking system, or paid service is required.

## Release gate
1. Austin confirms the exact event URL, duration, timezone, availability, conferencing location, and booking questions in the existing Cal.com account.
2. Set the URL, then run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
3. At desktop, 390px, and 320px, follow both CTAs with keyboard and touch. Confirm focus visibility, no horizontal overflow, and no browser errors.
4. On Cal.com, confirm available slots and the time-zone selector. Complete a test booking with Austin’s approval; check confirmation, calendar delivery, cancellation, and rescheduling. Do not create a booking on someone else’s calendar without permission.
5. Austin reviews the PR and separately authorizes merge and production deployment.

## Manual conversion review
For each received inquiry, record date, source if volunteered, fit, whether a call was booked, and the next action in the private referral tracker. Review weekly. Do not add visitor tracking or claim conversion improvement without evidence.
