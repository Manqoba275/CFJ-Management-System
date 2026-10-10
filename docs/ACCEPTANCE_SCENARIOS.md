# Acceptance scenarios — 10 October 2026

Prepared with AI assistance for Nyito's proposed requirements and acceptance work. These are executable acceptance specifications, not claims that the planned API, database or Android features have been delivered. Task deadlines and team allocation still require confirmation.

Use fictional records, a dedicated development identity project and an isolated database. Run connected scenarios against both clients and the same API. Record the commit, environment, platform, actual result and evidence for each run. An unavailable prerequisite means **blocked**, not passed.

| ID | Requirement | Given / When / Then | Required evidence |
|---|---|---|---|
| AUTH-01 | Registration | Given an unused email, when a valid registration completes, then one identity and member profile exist and both clients can sign in as that member. | Web and phone sign-in; matching API member ID |
| AUTH-02 | Invalid registration | Given missing mandatory fields, invalid email or an existing identity, when registration is submitted, then a useful error appears and no duplicate member is created. | Negative cases and database/API counts |
| AUTH-03 | Sign-in and Google SSO | Given a registered account, when email or Google sign-in succeeds, then the API verifies its token; incorrect passwords and invalid/expired tokens fail without exposing private data. | Both clients; API 401 responses |
| AUTH-04 | Role access | Given member, staff and admin identities, when each calls another role's protected endpoint directly, then unauthorized calls return 403; a missing identity returns 401. | Direct API requests, beyond hidden menus |
| PROFILE-01 | Shared profile | Given the same member signed in on web and Android, when permitted profile fields are saved on web and Android reloads, then Android displays the committed values; repeat in reverse. | Physical-phone recording and API record |
| PROFILE-02 | Ownership and privacy | Given members A and B, when A requests or changes B's private profile, then access is denied and B's record is unchanged; social responses exclude medical details. | API responses and unchanged record |
| PROFILE-03 | Validation and conflicts | Given invalid input or an outdated record version, when a profile save is attempted, then validation returns 400 or a version conflict returns 409 and no silent overwrite occurs. | Before/after record and client error |
| SETTINGS-01 | Preferences | Given an authenticated member, when supported notification, workout, intensity or preferred-time settings are saved, then they persist after restart and appear on the other client. | Web/phone restart and matching preferences |
| CLIENT-01 | Loading, offline and retry | Given slow/unavailable connectivity, when profile/settings are loaded or saved, then loading and useful retry states appear; cached data is identified and an unconfirmed save is never shown as successful. | Controlled network interruption on both clients |
| BOOK-01 | Booking and cancellation | Given an available class, when a member books then cancels, then both clients show the same confirmed booking state and capacity is restored once. | API and capacity before/after |
| BOOK-02 | Final seat concurrency | Given one seat and two members, when simultaneous booking requests arrive, then exactly one succeeds and the other returns 409; capacity never becomes negative. | Concurrent API test and committed records |
| BOOK-03 | Duplicate and retry | Given a confirmed booking, when a duplicate or the same idempotent request is sent, then at most one booking and one capacity deduction exist. | API responses and unique record count |
| ATT-01 | Attendance | Given an authorized attendance operation, when a request is retried, then one attendance entry is retained; unauthorized identities cannot record it. | Role checks and retry record count |
| PAY-01 | Simulated payments | Given a member and an authorized simulated payment, when it is recorded, then matching history is visible on both clients without storing card details or claiming a real charge/message. | Shared history and explicit simulation text |
| MANUAL-01 | Paid access | Given paid and unpaid members for the current period, when each requests restricted manuals, then the server allows the eligible member and denies the other. | Direct protected-content requests |
| STAFF-01 | Staff and reports | Given staff and admin identities, when staff performs permitted operations and attempts admin reports, then operations succeed and reports are denied; admin staff changes are enforced by the API. | Allowed and forbidden API calls |
| SOCIAL-01 | Friends and trainers | Given eligible members and trainers, when a connection, trainer request or review is submitted, then eligibility is checked and results persist across clients using only approved public fields. | Persistence, rejection and privacy checks |
| MARATHON-01 | Public registration | Given a non-member and a valid public event, when registration completes, then it persists and duplicate/invalid submissions are handled without requiring a member account. | API response and registration record |
| DB-01 | Relational integrity | Given an empty development schema, when versioned migrations and synthetic seeds run, then required tables contain at least ten records, and foreign keys, uniqueness and check constraints reject invalid writes. | Migration/seed logs and constraint tests |
| ANDROID-01 | Installable Kotlin client | Given pinned tooling and the committed Gradle wrapper, when CI builds and tests the actual app, then an APK installs on a physical phone and supports the connected member workflow. | CI run, test counts, APK and phone demonstration |
| DELIVERY-01 | Evidence | Given a release candidate, when the team reviews delivery, then help, screenshots, release notes, narrated phone demonstration, actual contribution links and AI-use disclosure are available. | Real artifact links; no invented participation |

## Profile/settings handoff

Nyito's proposed Kotlin scope depends on an actual Gradle project, agreed OpenAPI schemas and a reachable shared identity/API service. Use GET/PATCH `/api/v1/me` with verified identity, ownership checks and agreed version handling. Agree permitted preference fields, validation and error schemas before implementing the client. Do not put Oracle credentials or member passwords in Android code.

The profile screen must load the signed-in member, distinguish loading/error/offline states, edit only permitted fields and show success after server confirmation. Settings must use the same member record and persist supported preferences. On a conflict, offer reload and reconciliation rather than silently overwriting newer data. Keep uncommitted edits available for a retry where practical. Sign-out must clear session access and private cached data.

## Current prototype evidence

Checks executed on 10 October 2026 against source commit `ea830fd9117a393a36416006fd5c236d87164f8e`:

- `node scripts/check-website.mjs`: passed local references across 11 HTML pages and JavaScript syntax validation.
- Python static HTTP server: 29 HTML, JavaScript, CSS and image responses returned HTTP 200 and matched checkout bytes.
- Headless Chromium: homepage rendered three seeded members; the documented demo member signed in and reached the member dashboard; its localStorage session survived a reload; no JavaScript exceptions were observed in that smoke flow.

These smoke checks demonstrate the existing local prototype only. Connected acceptance scenarios above remain unrun: there is no implemented shared API, provisioned Oracle schema or runnable Kotlin project in this checkout. Demo passwords/localStorage roles do not satisfy hosted authentication or authorization acceptance criteria.

## Run record

For each scenario, capture: ID; source commit; date/time; tester; web/Android/API versions; fictional fixture IDs; steps; expected result; actual result; status (passed, failed, blocked or unrun); evidence link; defect/task link. Capture real outcomes and repeat affected scenarios after fixes. Keep credentials and private personal records out of evidence.
