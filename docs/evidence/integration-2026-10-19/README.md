# Tasks 4 and 6 evidence — 19 October 2026

Task 4: Android debug settings now loads memberships, classes and bookings, and can submit/cancel bookings using the same routes as the website service desk. Website class buttons now use API-returned IDs instead of a fixed demo ID.

Android verification: testDebugUnitTest, lintDebug and assembleDebug completed successfully. All 16 unit tests passed (zero failures/errors); see android-build.txt. This proves build and unit-test results, not a physical-device integration run. ADB reported no connected devices during the follow-up check, so installation and runtime on a phone are not evidenced by this folder. The only device-side evidence is a user-supplied screenshot (see ../phone-2026-10-19/README.md); it is not bound to this build or to any specific APK.

The two browser screenshots show actual isolated file-backed development API runs. browser-verification.json records four passing cross-client checks. They are not screenshots of Android or Oracle. unit-tests.txt records 44 passing tests; website-checks.txt contains structural validation.

Task 6: review-status.json is an actual GitHub connector snapshot of PR #3 and its outstanding review request. No teammate approval is claimed. Existing CONTRIBUTING.md and pull-request template define contribution and review requirements. Nyito and Nonhlanhla retain their assigned evidence work.

Still required: restore WSL/Oracle, validate the new Oracle API adapter and recovery checks, provision hosted API/authentication/database, test on a real Android phone, and receive actual teammate review and contribution records.

To verify Android after installing the debug APK: open Settings, enter the agreed API origin and member token, load membership and service records, book a returned class, reload the website service desk with the same member identity, cancel from the app and reload both clients. Use adb reverse tcp:8787 tcp:8787 for a USB debug device if appropriate. Never expose the development-token server publicly or include tokens in screenshots.
