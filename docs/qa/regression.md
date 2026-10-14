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
| Android unit/build | `gradlew.bat testDebugUnitTest assembleDebug` | Not verified. Retried on 14 October with JDK 21 and Gradle 9.4.1; the daemon started but produced no task output before the run was stopped. |

## Catch-up verification — 14 October 2026

- Full Node suite: **33/33 passed**, with temporary files directed to the writable workspace.
- Prepared booking check: **34/34 passed**; static validation passed for all 12 website pages and `app.js` syntax.
- Android unit/build: still **unverified**; no task result was produced.

## Manual checklist

- [ ] Browser keyboard operation and role navigation.
- [ ] Narrow viewport layout and labelled screenshots from the running preview.
- [ ] Screen-reader announcements for status updates.
- [ ] Offline profile-sync message and recovery in an Android emulator.
- [ ] Cross-device profile update using two clients against a shared service.
- [ ] Physical Android phone run.
- [ ] Booking and cancellation interaction in the website.

The browser preview failed to attach to the in-app browser on repeated attempts. These checks remain open; source review and unit tests are not substitutes for manual interaction. The final catch-up retest on 14 October did not include browser or device interaction.

## Known issues carried forward

- The existing profile editor saves an empty name without validation.
- Class bookings, friend requests, and trainer interactions remain local prototype behavior; server authorization and shared persistence are not established.
- The reusable Android class card is not wired into the Classes screen; that integration belongs to the integrator.
- The current role routing uses browser-local session data and is not a server authorization boundary.
