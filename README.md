# CFJ Management System — Team Forge

Website and planned Kotlin Android application for CFJ Lifestyle Fitness.

## Setup status

The HTML/CSS/JavaScript prototype under `website/` uses browser localStorage and simulated payments/messages. A separate connected service desk and registration page use the local development API. A native Kotlin debug APK is available; production database and hosted sign-in integration remain pending.

Open `website/index.html` to preview the inherited prototype. Demo accounts are documented in `website/README.md`; use only fictional data.

## Project layout

- `website/`: existing website to migrate to the shared API.
- `mobile-app/`: native Kotlin preview, development API panels and release signing configuration.
- `backend/`: local development API for profiles, bookings, attendance, simulated payments, community features, reports and event registration.
- `database/`: Oracle database design and migration plan.
- `docs/`: requirements, architecture, progress tracker, meeting evidence templates.
- `.github/`: pull-request template and setup checks.

Read [the implementation plan](docs/IMPLEMENTATION_PLAN.md), [requirements](docs/REQUIREMENTS.md), and [team Git workflow](CONTRIBUTING.md).

## Checks

See [deployment and installation](docs/deployment.md) for the static demo package, local API demonstration and Android signing setup. `npm run package:demo` prepares static hosting files; it does not publish them.

With Node.js 22 or later: `npm test` and `npm run check`. These cover saved-state recovery, booking rules, the local server and development profile API.
Android CI runs unit tests, lint and app/test APK builds. See mobile-app/README.md for local commands. A successful build does not establish physical-device behaviour.

## Release notes

- Setup: recovered the existing prototype, retained repository history, established project structure, requirements traceability, and contribution rules.
- Week one: Kotlin starter, booking eligibility checks, local development profile API and Android sync panel; reviewed browser-state recovery. See [release notes](docs/release-notes.md) for verification and limitations.
- Pending: Oracle integration, production API/identity, website-to-API profile connection, physical cross-device tests, deployment, real-phone demonstration video, and final assessment evidence.
