# Task 2 release — 19 October 2026

This release is the XISD6329 Task 2 submission version (tag `task2-submission`, commit `12c0312`). It consolidates the Firebase account work, the Oracle identity gate, the Android training dashboard, the evidence set and the deployment readiness changes.

## Added

- Firebase email/password account screens on the website (`website/account.html`) and Android (`AccountActivity.kt`): create account, sign in, email verification, resend/refresh verification, password reset and sign out.
- Google sign-in: website popup flow and Android Credential Manager exchange where Google Play Services are installed.
- Backend Firebase ID-token gate (`backend/firebase-gate.mjs`, `backend/firebase-oracle-server.mjs`): signature, expiry, issuer and audience checks; `email_verified` requirement; member-only role; UID mapping to `cfj_members.identity_uid`; sanitised errors; no client-supplied role accepted.
- Android training dashboard with three illustrated beginner movements, written technique, sets/reps, rest timer and a local completed-session count.
- API readiness endpoint `/healthz` and bounded Oracle call timeouts; configurable bind host for deployment.
- `render.yaml` blueprint and `docs/DEPLOY_API_RENDER.md` for the remaining hosted API/Oracle deployment.
- Evidence index, live Oracle verification set, canonical APK checksum and honest phone-evidence record.

## Verified on 19 October 2026

- Local Oracle: migrations 001–004 applied and idempotent; schema verification **PASS** — 14 tables, 160 rows, 21 checks, all constraints ENABLED and VALIDATED.
- Operations/API verification: **PASS** — 15 checks across two independent HTTP servers (last-seat booking, idempotent payments, attendance, weekly allowance, reports, event capacity, fresh-connection persistence).
- Web/API regression suite: **51 passed, 0 failed**.
- Android: debug build, 16 unit tests and lint passed; GitHub Actions Android and setup workflows succeeded at `78a36ff`.
- Phone: a user-supplied screenshot shows the account screen at "Email verified. Signed in." on a physical phone.

## Not included / still unproven

- Hosted API and hosted Oracle database; no public API URL or cloud database connection is configured.
- Google sign-in acceptance on Android (the available Huawei phone has no Google Play Services) and full Google consent/callback on the website.
- ADB-documented installation of the canonical APK and a recorded physical-device acceptance run.
- The narrated demonstration video, Azure DevOps board history, Microsoft Teams meeting evidence and organisation feedback.

The API and database remain local to the development computer. Do not read this release as evidence of cloud hosting or completed physical-device acceptance.

# Week-one development review — 6 October 2026

## Deployment preparation — 12 October 2026

Added `npm run package:demo` to prepare tracked static assets with checksums, excluding API-only pages. Added environment-based Android release signing and CI verification using an ephemeral certificate. Missing signing configuration prevents release packaging. See `docs/deployment.md` for installation and deployment steps. No public deployment or permanent release key is configured; the temporary verification build is not a distribution release.

## Weekend development update — 10 October 2026

Saturday's admin reports and public marathon registration are connected to the local API. Reports are restricted to admins and expose aggregates only. Non-members can register with consent; capacity, duplicate email, persisted retries and restart recovery are checked by the service. The blue website provides both flows. See `backend/MANAGEMENT_API.md`.

Sunday's QA work was performed early on 10 October: duplicate identity rejection gained regression coverage, Android community failures now use safe messages, the Windows local SDK property was corrected, and report access wording was clarified. Browser QA confirmed registration and report permissions; the Node suite has 38 passing tests. Final Android pipeline checks are attached to PR #3. Production Oracle, hosted identities and physical-device acceptance remain pending.

Update, 8 October: the development API now supports capacity-checked bookings, owner cancellation, staff attendance and simulated payment records with persisted retry IDs. The new website service desk calls this API. HTTP and browser checks passed; see backend/OPERATIONS_API.md and the Wednesday/Thursday evidence. This does not complete the Oracle, hosted identity or physical-device requirements listed below.

This is a development checkpoint on `feature/team-and-app-setup`, not a production deployment or completed assessment submission.

## Working source

- Existing website prototype and local preview launcher, with explicit notices that browser data and simulated payments/messages are local.
- Native Kotlin Home, Classes and Settings screens, local preferences and debug-only profile API controls.
- Matching website/Android booking eligibility rules and a shared 24-scenario fixture. READY allows a request; it does not reserve a place.
- Loopback development GET/PATCH profile API: one synthetic member selected by a development token, validation, atomic JSON persistence and stale-version rejection.
- Android profile requests run off the UI thread, update local preferences only after success, and require reload after failure/conflict. Production cleartext HTTP is disabled.

## Monday fixes (performed 6 October)

Request bodies now preserve Unicode names across network chunk boundaries and reject invalid UTF-8. Android rejects coerced, fractional, negative or unsafe profile versions before using them for saves. HTTP regression tests cover a second client's stale save, reload, successful update and persisted result after restart.

## Tuesday integration

Reviewed and integrated the saved-state recovery code and four regression tests from PR #2, original commit `cec0207`. Malformed browser collections no longer prevent startup or discard unrelated valid records. The integration preserves the later prototype notice and existing app changes. Recovery tests now run through `npm test` in CI.

Updated the root README, which still described the Kotlin app, API and Android CI as wholly unimplemented. Full production versions remain pending, but the development components above now exist.

## Verification and evidence

- `npm test`: 33 passing tests across profile API, booking contract, preview server and browser recovery.
- `npm run check`: links/assets for 11 HTML pages and JavaScript syntax passed.
- Android CI runs unit tests, lint, debug APK and device-test APK compilation; see PR #3 for the final commit's checks.
- Saturday's separate combined starter review passed 34 Node checks and 11 JUnit tests at that point. Those historical numbers describe the temporary combined packs, not the current application suite.
- Sunday's emulator attempt could not start because of PC memory pressure. A compiled device-test APK is not an executed device test. No new physical-device, screen-interaction or cross-device acceptance pass is claimed here.

Daily evidence is under `docs/team/Manqoba/`. Planned task dates are distinct from actual execution dates. Other members' independent contributions and recorded meetings are not certified by these development checks.

## Pending before production/assessment readiness

1. Provision Oracle and replace development JSON persistence with the documented relational schema and transactions.
2. Implement and verify hosted sign-in/Google SSO, identity-token verification and server-side member/role authorization.
3. Connect website profile editing to the shared API and test the same real account on the website and Android.
4. Complete real booking/cancellation, attendance, simulated payment records, social/trainer features and reports against the API.
5. Integrate teammates' reviewed contributions; prepared code packets are not proof that those members completed the work.
6. Complete physical-phone testing, deployment, demonstration video, recorded meeting evidence and the final assessment checklist.

No public deployment, main-branch merge or release tag was created by this review.
