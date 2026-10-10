# Week-one development review — 6 October 2026

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
