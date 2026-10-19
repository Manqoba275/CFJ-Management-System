# CFJ website and Android test plan

**Owner:** Nonhlanhla (assignment owner; confirm with team)  
**Draft prepared:** 19 October 2026  
**Review status:** Draft - acceptance requirements supplied by Nonhlanhla on 19 October; review with Nyito and Manqoba still needed  
**Baseline source:** `work/nonhlanhla-through-2026-10-13` at `c738963` (`test: finalize Nonhlanhla QA catch-up through Oct 14`)  
**Due date:** Not supplied; agree a date with the team.

## Purpose

Prepare repeatable checks for the current CFJ website prototype and Kotlin Android development app. This plan separates what the current local demo can demonstrate from features that are still planned or require an integrated build. A planned expected result is not an executed result. The execution log and evidence index record only work that has actually been carried out.

## Acceptance requirements supplied for this assignment

The following six requirement groups were supplied for Nonhlanhla's UI/UX and acceptance-testing role. The assignment did not include formal requirement IDs, so `REQ-NHL-01` through `REQ-NHL-06` are traceability labels for this draft, not IDs approved by the Business Analyst.

| Draft requirement ID | Supplied requirement | Planned case coverage | Current preparation status |
|---|---|---|---|
| REQ-NHL-01 | Registration, email/password login, verification email, password reset and logout | AUTH-REG-01, AUTH-LOGIN-01, AUTH-VERIFY-01, AUTH-RESET-01; WEB-04 remains a separate local-demo login check | Hosted account creation/login, verification email and reset are Blocked until identity/email integration is available. Local demo login/logout has not been manually checked. |
| REQ-NHL-02 | Google sign-in when integration is ready | AUTH-GOOGLE-01 | Blocked until shared identity integration is supplied. |
| REQ-NHL-03 | Clear validation and error messages | UI-ERR-01, WEB-06, ANDROID-03, ANDROID-07 | Not run for the supplied acceptance requirement; existing automated checks do not establish visible message clarity. |
| REQ-NHL-04 | Membership details, class availability, booking and cancellation | MEMBER-01, WEB-05, APP-BOOK-01 | Website local-demo booking is separate from shared booking. Android booking remains unavailable; shared membership/class state is Blocked until the API integration is ready. |
| REQ-NHL-05 | Website-app synchronization after the shared API is ready | SYNC-01, ANDROID-06, ANDROID-07, ANDROID-08 | Blocked until a shared API and integrated build are available. |
| REQ-NHL-06 | Professional blue theme, readable text, navigation and phone layouts | UI-BRAND-01, WEB-01, WEB-02, WEB-07, ANDROID-01, ANDROID-08 | Not run as a visual acceptance check. Phone layout acceptance requires a real phone; a narrow browser viewport is supporting website evidence only. |

No app or website acceptance interaction was performed while incorporating this requirement list. Leave Actual result, Status and Evidence blank in the case plan until a permitted execution occurs. For a known missing prerequisite, record Blocked in the results sheet; use Not run when no execution was attempted and no prerequisite blocked it. Never convert source inspection or automated test output into a manual acceptance Pass.

## Product and current baseline

- **Website:** `website/` is a local HTML/CSS/JavaScript prototype. Demo accounts, profiles, bookings, payments, staff actions and reports use browser-local demo state. Payment confirmations are simulated. This is not hosted authentication, a shared database, or production authorization.
- **Android:** `mobile-app/` is a Kotlin development app with Home, Classes and Settings screens, local preferences and a debug-only synthetic profile-sync panel. The Classes screen links to the public timetable and states that booking is not connected. The reusable class card is not wired into the screen.
- **Development API:** `backend/` provides an optional local synthetic profile API for debug integration. It is not a hosted service or Oracle integration. Never publish its token or expose its local server publicly.
- **Source baseline:** this plan was prepared from commit `c738963`. If the checked-out or deployed code changes, record the actual commit/build on every execution record and keep results for different builds separate.
- **Prior evidence:** earlier repository QA records contain automated and source-review results through 14 October 2026. They are historical context, not proof that a current browser, emulator, or physical-phone run has passed.

## Scope for the current preparation

### In scope

- Map the website and Android checks to the six supplied requirement groups above; replace draft IDs if Nyito provides the approved IDs.
- Prepare repeatable cases for account lifecycle, visible validation/errors, membership and class availability, web/app synchronization, theme/readability/navigation, phone layouts, local booking behavior, keyboard/focus behavior, Android navigation, local preferences, reset confirmation and the current Classes-screen limitation.
- Record current static-check and test-environment outcomes without describing blocked or source-reviewed behavior as a manual pass.
- Use fictional/demo data in a separate browser profile. Use only the synthetic profile for optional development-API work.

### Deferred until prerequisites are available

- Hosted identity/SSO, secure role authorization, production API, Oracle-backed persistence, real shared bookings/payments/attendance and website-to-phone synchronization.
- Registration verification emails, password-reset emails and Google sign-in until the shared identity/email integration is ready.
- Final acceptance tests on the supplied integrated Android build and a physical phone.
- Narrated demonstration recording and final upload.

### Out of scope

- Real member records, real payments/messages, production credentials, public deployment, or changes to shared production data.
- Treating mobile-width browser rendering as Android-device evidence, local Oracle evidence as hosted-database evidence, or a build/unit test as proof of physical-device behavior.

## Environments and data

| Environment | Intended use | Record for each run | Limits |
|---|---|---|---|
| Local website preview from this repository | Page navigation, layout and fictional demo flows | Exact preview URL, browser/version, viewport, source commit, date and separate browser-profile identifier (not personal data) | Browser storage is local to that browser/origin; role checks are UI behavior, not a security boundary. |
| Android debug build | Navigation, local preference validation/save/reset and debug-only synthetic profile panel | APK/build variant, source commit, Android version, device/emulator model and date | Debug API panel is not hosted identity; Android runtime behavior remains unverified until installed and exercised. |
| Synthetic local profile API | Optional debug-profile load/save/error checks | API source commit, app build, emulator/USB route and outcome; never record token | Local development service only; not Oracle or production. |
| Hosted integration / physical phone | Later acceptance testing | Hosted release/build IDs, phone model, Android version, date, service/database evidence reference | Not ready or available for the current plan. Keep cases Blocked/Not run until ready. |

Use only the fictional demo records documented in `website/README.md` and reset the dedicated browser profile to a known starting state before each independent scenario. Do not copy passwords into test records. Use a synthetic profile for API checks; do not include a token in screenshots, logs or commits.

## Entry criteria

1. Nyito confirms the approved requirements, scope, expected behavior and requirement IDs.
2. Manqoba reviews the test cases and confirms which build/branch is appropriate; coordinate before editing any shared file.
3. The tester records the exact source commit or website release, environment, browser/device and date.
4. A separate browser profile or disposable test state and fictional data are ready. Personal browser data is not to be cleared or reused.
5. For Android execution, the reviewed APK, installation instructions and a permitted emulator/phone are available. For API checks, the approved synthetic service is available and its token can be kept private.

## Exit criteria

- Every case is marked Pass, Fail, Blocked or Not run based on an actual attempt; no unavailable feature is marked Pass.
- Failures have reproducible steps, expected and actual outcomes, severity/impact, environment, linked evidence and a defect owner or triage request.
- Fixes are rerun against the new commit/build, with the original failure retained and linked to the retest.
- Evidence is readable, indexed, limited to synthetic data, and accurately states what it proves and what it does not prove.
- Nyito and Manqoba review the plan/results. Deferred integration and device checks remain visible as open blockers.

## Execution and status rules

1. Start each case from its stated precondition and record the actual URL/build/commit before the action.
2. Follow numbered steps and record the actual response and persisted state where relevant. Save evidence immediately.
3. Use **Pass** only when every expected condition is observed; **Fail** for an observed mismatch; **Blocked** when a prerequisite or environment prevents an attempt; **Not run** when no attempt was made.
4. Keep source review, automated checks, browser interaction, emulator runs and physical-device runs distinct. A test may have evidence from more than one method, but one method cannot substitute for another.
5. Do not change an expected result to match a defect. Ask Nyito when the requirement is unclear; route UI/API issues to Manqoba and schema/data issues to Tshifhiwa.

## Preparation status before the latest website rerun (19 October 2026)

- Repository and current website/Android source inspected at `c738963`.
- Static website link/asset and JavaScript syntax check: Pass (12 HTML pages checked).
- Existing Node regression run: 31 passed; 2 local-server tests could not connect because the execution environment denied connections to `127.0.0.1` (`EACCES`). This is an environment-blocked run, not evidence of a product defect.
- Local website browser interaction: Blocked. The preview started at `http://127.0.0.1:8765`, but the available in-app browser timed out connecting to it. No navigation, rendered layout, login, booking, or screenshot result is claimed.
- Android/emulator/physical phone: Not run in this preparation; no usable Android device/SDK tooling was detected in the current environment. Earlier repository notes also leave the current Android build/runtime unverified.
- Requirement IDs and expected behavior: draft until Nyito confirms the official requirements.

See `test-cases.csv`, `test-results.csv`, `defects.md`, `evidence-index.csv`, and `video-plan.md` for the working records.


## Latest website checks (19 October 2026)

The website static checker passed on source commit `10faec3`, validating 16 HTML pages, inline scripts and `app.js` syntax. The relevant Node regression suite passed all 34 tests with no failures or skips. This retested the earlier environment-blocked run.

Interactive browser acceptance remains blocked. The local preview reported that it started, but the in-app browser timed out before attaching to the page. No navigation, login, booking, responsive layout or screenshot result is claimed. See `test-results.csv`, `run-log-2026-10-19.md` and `evidence-index.csv` for the run records. Android was not tested in this task.
