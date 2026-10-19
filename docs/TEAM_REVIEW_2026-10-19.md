# Team contribution review 19 October 2026

Reviewed remote branches after git fetch. Commit dates are author/committer timestamps, not proof of the exact time a push reached GitHub.

## Nonhlanhla

Commit e826cbd on test/nonhlanhla-website-acceptance changes only nine testing/evidence files. The message is meaningful and the scope fits her testing role. All 28 test-case, seven result and seven evidence-index CSV rows parse with the expected column counts. No production code is changed by this commit.

The uploaded Downloads test plan is an earlier preparation version referencing c738963, 12 pages and blocked checks. The pushed report additionally records checks at 10faec3. Use a single clearly versioned report for submission; retain earlier runs as history.

Follow-ups before acceptance sign-off:

- The recorded 34-test command runs four test files, while npm test at 10faec3 also includes operations, memberships, community, management and messages. It is a valid scoped check, not the full regression suite. Label its scope and attach the raw output on the next run.
- The screenshots folder contains only .gitkeep. Evidence-index entries currently point to narrative run logs, not UI screenshots. Capture actual acceptance evidence and record tester/date/build for every executed case.
- Rerun against the supplied Firebase APK. Android has a real account screen and debug API booking controls in Settings; the Classes screen is still a timetable preview. Update steps and prerequisites rather than treating all booking code as absent.
- Keep Google-on-Android and shared Oracle acceptance blocked until those features are actually ready. Email/password can now be tested on the new APK with an inbox the tester controls.
- Entries repeated across several cases should describe the actual attempt. A browser-attachment failure blocks the run but does not independently execute each case.

The report accurately distinguishes assistance, automated checks and manual testing. Do not change its provenance to imply manual tests that were not performed.

## Other remote commits dated today

Manqoba/mtung: 128921a Oracle operations adapter, 6f9121e API evidence, e98aee5 Android booking controls, 3551970 Firebase account screens. PR #3 was merged into main as 10faec3. Firebase work after that merge is still on the integration branch; main and the Render website release are not automatically updated by this review.

No new commits dated 19 October from Nyito or Tshifhiwa were found among fetched remote branches. This does not establish that no earlier-dated commits were pushed today or that work exists nowhere else.

## Current developer verification

Android assembleDebug, testDebugUnitTest and lintDebug passed after pinning Firebase BoM 34.7.0 for compiler compatibility: 16 tests, zero failures; lint zero errors and 22 warnings. New APK SHA256: 9DA227D7B8F50F34F84D5BD0155536FCCCEB09A21537367A3F9645C7EEEE7B76.

44 existing web/API tests and six added authentication-boundary tests passed. Static checks passed for 17 pages. Invalid-token rejection was also exercised using Firebase Admin SDK. Live Oracle/Firebase verification is blocked by local Oracle ECONNREFUSED and missing verified test-account mapping. ADB reported the phone offline; no new phone installation/runtime result is claimed.
