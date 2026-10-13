# Regression checklist — 13 October 2026

## Automated checks

| Area | Check | Result |
|---|---|---|
| Website | `node scripts/check-website.mjs` | Pass: 12 HTML pages and `app.js` syntax validated. |
| Website server and stored demo state | `node --test scripts/serve-website.test.mjs scripts/test-state.mjs` | Pass in the complete Node suite. |
| Booking policy | `node --test scripts/booking-eligibility.test.mjs` | Pass in the complete Node suite. |
| Development profile API | `node --test backend/profile-server.test.mjs` | Pass: 3/3 with `TEMP` and `TMP` set to the workspace's `tmp` directory. |
| Combined prepared booking pack | `node scripts/prepare-team-code-check.mjs` | Pass: 34/34; static website check also passed. |
| Full Node suite | `node --test scripts/serve-website.test.mjs scripts/booking-eligibility.test.mjs scripts/test-state.mjs backend/profile-server.test.mjs` | Pass: 33/33 with workspace-local temporary files. |
| Android unit/build | `gradlew.bat testDebugUnitTest assembleDebug` | Not verified. Gradle 9.4.1 and its daemon started with JDK 21, but the command produced no task result before it was stopped. |

## Manual checklist

- [ ] Browser keyboard operation and role navigation.
- [ ] Narrow viewport layout and labelled screenshots from the running preview.
- [ ] Screen-reader announcements for status updates.
- [ ] Offline profile-sync message and recovery in an Android emulator.
- [ ] Cross-device profile update using two clients against a shared service.
- [ ] Physical Android phone run.
- [ ] Booking and cancellation interaction in the website.

The browser preview failed to attach to the in-app browser on repeated attempts. These checks remain open; source review and unit tests are not substitutes for manual interaction.

## Known issues carried forward

- The existing profile editor saves an empty name without validation.
- Class bookings, friend requests, and trainer interactions remain local prototype behavior; server authorization and shared persistence are not established.
- The reusable Android class card is not wired into the Classes screen; that integration belongs to the integrator.
- The current role routing uses browser-local session data and is not a server authorization boundary.
