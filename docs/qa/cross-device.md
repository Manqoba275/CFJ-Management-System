# Cross-device and offline sync checks

**Review date:** 13 October 2026

**Scope:** synthetic development profile sync only. The app does not yet have hosted sign-in, Oracle storage, or a production service.

## Checks and results

| ID | Scenario | Expected behavior | Result |
|---|---|---|---|
| SYNC-01 | Two clients load the same synthetic profile/version, then submit edits concurrently. | One current write is accepted; the stale write is rejected with a conflict and must reload. | Backend API automated test passed as part of the 33/33 Node regression run. The test used a temporary directory inside the writable workspace. |
| SYNC-02 | Reload after a successful update. | The service returns the saved name, goal, and incremented version. | Covered by `backend/profile-server.test.mjs`; passed. |
| SYNC-03 | Send an invalid token or malformed profile. | Service rejects the request and does not save the profile. | Covered by the backend API test; passed. |
| SYNC-04 | Open the Android debug sync panel with the development server unavailable. | Show the offline message; do not update the locally saved preferences; require a fresh load before another save. | Reviewed in `ProfileSyncPanel.kt` and `profile_sync_strings.xml`; not exercised in an emulator. |
| SYNC-05 | Use two Android devices against one hosted service. | Both devices read the same service-owned profile; a stale update prompts a reload. | Not run. No hosted service or two-device environment is available. |

## Limits and setup notes

The app's debug panel uses an in-memory token and a local development API. The backend integration test verifies the service's persistence and stale-write behavior, but it is not an Android-to-server or physical-device test. The Android instrumentation smoke test was not run. No token, account credential, or member data belongs in a screenshot or test record.

The sandbox's default temporary path was outside the writable workspace and caused test writes to fail. The passing run set `TEMP` and `TMP` to the repository's ignored `tmp` directory; the test's temporary profile data is removed by the test harness.
