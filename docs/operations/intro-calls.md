# Intro-call setup and release check

The homepage uses `components/IntroCallLink.tsx` in its hero and contact section. Navigation links to the contact section. All booking links share `lib/booking-config.json`.

Set `calBookingUrl` to Austin’s confirmed `https://cal.com/account/event` URL. Leave it empty until confirmed: visitors see “Request an intro call” and open an email with a project-intro subject. A configured URL changes the label to “Book an intro call”. Invalid destinations fail validation instead of silently redirecting visitors.

A direct hosted link avoids iframe scrolling on small screens, extra client JavaScript, and loading the calendar provider before a visitor chooses to schedule. No new dependency, account, tracking system, or paid service is required.

## Release gate

1. The event-creation bot creates the event using Austin sign-in and returns the exact event URL, duration, timezone, availability, conferencing location, and booking questions. Do not place credentials in this repository.
2. Set the URL, then run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
3. At desktop, 390px, and 320px, follow both CTAs with keyboard and touch. Confirm focus visibility, no horizontal overflow, and no browser errors. Check the motion-rich presentation with the normal preference, then reduced motion before load and after changing the preference while the page is open. Artwork must stop moving, pointer effects must stop, and scrolling must not animate under reduced motion; keep the booking CTA readable in both modes.
4. On Cal.com, confirm available slots and the time-zone selector. Complete a test booking with Austin’s approval; check confirmation, calendar delivery, cancellation, and rescheduling. Do not create a booking on someone else’s calendar without permission.
5. Austin reviews the PR and separately authorizes merge and production deployment.
6. After authorized deployment, verify the production site and live event together and record the result. Only then may Patchy take real leads. A preview or email fallback does not clear this gate.

## Manual conversion review

For each received inquiry, record date, source if volunteered, fit, whether a call was booked, and the next action in the private referral tracker. Review weekly. Do not add visitor tracking or claim conversion improvement without evidence.

## Runnable browser check

Run `npm run build && npm run check:browser`. The suite starts the built site with `vinext start` (set `SITE_CHECK_RUNTIME=worker` for Wrangler, or `SITE_CHECK_URL` for an already running server). Install a browser with `npx playwright-core install chromium`, or set `BROWSER_EXECUTABLE`. Screenshots go to ignored `outputs/browser-check/`.

The suite covers Product-page routing, Alias redirects, 404s and metadata; catalogue Stage on custom pages; layout at 1440px, 390px, and 320px; skip-link order, booking targets, and focus; the site-wide pause, hidden-tab and reduced-motion frame scheduling, and the WebGL fallback; the 2DO film's motion permission, keyboard toggle, and failed-load message; and console, page, and HTTP errors. It opens no booking and makes no external submission.
