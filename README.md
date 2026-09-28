# CFJ Management System — Team Forge

Website and planned Kotlin Android application for CFJ Lifestyle Fitness.

## Setup status

The existing HTML/CSS/JavaScript prototype is restored under `website/`. It uses browser localStorage and simulated payments/messages. It is not yet connected to a shared database or secure authentication. No Android APK exists yet.

Open `website/index.html` to preview the inherited prototype. Demo accounts are documented in `website/README.md`; use only fictional data.

## Project layout

- `website/`: existing website to migrate to the shared API.
- `mobile-app/`: planned native Kotlin Android client.
- `backend/`: shared API setup and contract plan.
- `database/`: Oracle database design and migration plan.
- `docs/`: requirements, architecture, progress tracker, meeting evidence templates.
- `.github/`: pull-request template and setup checks.

Read [the implementation plan](docs/IMPLEMENTATION_PLAN.md), [requirements](docs/REQUIREMENTS.md), and [team Git workflow](CONTRIBUTING.md).

## Checks

With Node.js 22 or later: `node scripts/check-website.mjs`.
CI runs the same baseline validation on pushes and pull requests. Android build/test CI will be added with the actual Gradle project; the current checks do not claim to build an APK.

## Release notes

- Setup: recovered the existing prototype, retained repository history, established project structure, requirements traceability, and contribution rules.
- Pending: database provisioning, API implementation, hosted authentication/SSO, Kotlin app, cross-device tests, deployment, real-phone demonstration video, and final evidence.
