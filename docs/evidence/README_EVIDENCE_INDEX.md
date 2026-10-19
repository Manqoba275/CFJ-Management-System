# Evidence index - CFJ project

One-page map for a marker or reviewer: what evidence exists, where it lives, what it proves, and what it does not prove. Last updated 19 October 2026; repo HEAD was 0e75de9 when this index was written, and the canonical APK was built from 78a36ff.

Single source for the build being submitted:

| Item | Value |
|---|---|
| Canonical APK | `C:\Users\mtung\OneDrive\Desktop\CFJ Submission\02-Android\CFJ-Fitness-debug.apk` |
| SHA256 | `90A810FF9248974A06E3D6BA570354E962912B398FB6F7EEBF9067835A725E76` |
| Size | 8,445,659 bytes |
| Built from commit | 78a36ff (build log: `C:\Users\mtung\OneDrive\Desktop\CFJ Task 4 Evidence\android-build.txt`, BUILD SUCCESSFUL in 7m 52s) |
| Checksum file | `C:\Users\mtung\OneDrive\Desktop\CFJ Submission\02-Android\apk-checksum.txt` |
| Do not use | `CFJ-Firebase-debug.apk` (9DA227D7..., 4,405,771 bytes) and `CFJ-debug.apk` (FF686A7A..., 921,981 bytes) - earlier builds |
| Phone screenshot | `docs/evidence/phone-2026-10-19/phone-verified-sign-in.png` (user-supplied; SHA256 `39B90412E84A70DD483E92E3C6A55CB41DF294E5AE50CF121BF50836B0A5553F`) |

## Evidence folders

| Folder | Date | What is in it | What it proves |
|---|---|---|---|
| [`api-2026-10-19`](api-2026-10-19/README.md) | 19 Oct | API status JSON/HTML, unit-test output, website checks, implementation screenshot | API/recovery implementation state and tests at commit 128921a. Oracle recovery checks failed (NJS-040); no database success claimed. |
| [`database-2026-10-18`](database-2026-10-18/README.md) | 18 Oct | Schema verification JSON/HTML, profile regression, relationship diagram | 14 tables, 160 rows and 21 schema checks passed on local Oracle on 18 Oct. Earlier schema only, not the current domain flows. |
| `firebase-2026-10-19` | 19 Oct | `account-ready.png`, `browser-check.json` (no README) | Browser account screen readiness check. Not Android or Oracle evidence. |
| [`firebase-oracle-2026-10-19`](firebase-oracle-2026-10-19/README.md) | 19 Oct | Android build/test/lint log, 44 regression tests, auth-boundary tests, website checks | Firebase/API work builds and passes tests. Invalid token rejected. Live Firebase-to-Oracle success NOT claimed. |
| [`google-schema-2026-10-19`](google-schema-2026-10-19/README.md) | 19 Oct | 51 tests, 17-page checks, Google chooser/cancel JSON + screenshots (local and Render) | Website Google hand-off and cancellation; 51 tests passed. Not consent/callback, Android Google sign-in or Oracle persistence. |
| [`integration-2026-10-19`](integration-2026-10-19/README.md) | 19 Oct | Browser booking + API cancellation screenshots, browser-verification JSON, Android build log, unit tests, review snapshot | Isolated file-backed API cross-client checks (4/4) and Android build success. ADB reported no devices; no phone install evidenced. |
| [`live-2026-10-19`](live-2026-10-19/README.md) | 19 Oct 21:04-21:07 | Live Oracle migrate/seed/schema/operations transcripts, run log, row counts, npm test output | Local Oracle container healthy: migrations idempotent, 21 schema checks PASS, 15 operations checks PASS, 51/51 npm tests. Seed refused by fixture guard by design. |
| [`local-oracle-phone-2026-10-19`](local-oracle-phone-2026-10-19/README.md) | 19 Oct | Android build log (17m49s), identity/gate notes, Oracle operations text | Android build/tests/lint passed; earlier Oracle run noted. Phone install not evidenced (ADB offline). |
| [`phone-2026-10-19`](phone-2026-10-19/README.md) | 19 Oct | `phone-verified-sign-in.png` | A real Android phone showed the CFJ account screen at "Email verified. Signed in." User-supplied; no build/device binding; installation NOT independently evidenced. |
| [`apk-2026-10-19`](apk-2026-10-19/README.md) | 19 Oct | APK inventory and hashes | Which APK is canonical (`90A810FF...`) and which older files must not be substituted, including a same-size rebuild (`2F07D9ED...`). |

## Find a claim quickly

| Claim | Look here |
|---|---|
| Debug APK builds, unit tests and lint pass | `firebase-oracle-2026-10-19/android-build.txt`, `integration-2026-10-19/android-build.txt`, `local-oracle-phone-2026-10-19/android-build.txt` |
| Submitted APK hash and source commit | `apk-2026-10-19/README.md` and `CFJ Submission/02-Android/apk-checksum.txt` |
| Account screen runs on a real phone | `phone-2026-10-19/` (screenshot only; user-supplied) |
| Phone installation / ADB-documented device run | Not available anywhere: ADB reported the phone offline / no devices (`integration-2026-10-19/README.md`, `firebase-oracle-2026-10-19/README.md`) |
| Website books/cancels through the API (browser) | `integration-2026-10-19/01-browser-booking.png`, `02-browser-sees-api-cancellation.png`, `browser-verification.json` |
| Live Oracle schema and operations pass | `live-2026-10-19/` (21 schema checks, 15 operations checks, 51/51 tests) |
| Firebase/Google admin or web sign-in | `firebase-oracle-2026-10-19/`, `google-schema-2026-10-19/`, `firebase-2026-10-19/` |
| Android Google sign-in | Untested: test Huawei has no Google Play services (see `phone-2026-10-19/`) |
| Hosted/cloud Oracle, production sign-off | Not evidenced. Hosting/deployment notes are in `docs/deployment.md` and the Render website checks; no production acceptance run. |

## Reading rules

1. Quote an APK by SHA256, never by file name alone. Three older builds share similar names; one same-size rebuild has a different hash.
2. A build log proves compilation and tests, not device installation. No ADB-documented installation of the canonical APK exists.
3. The phone screenshot is user-supplied and unbound: it proves the UI ran on a phone at least once, not that the canonical APK was installed.
4. "Tests passed" means the listed tests on the recorded machine/date; it is not acceptance testing by the intended testers.
5. Render/browser checks are website evidence, not Android or Oracle evidence. Live Oracle checks are local (WSL Podman), not hosted.
6. Historical records keep their original dates and limits. Corrected claims are marked where corrected (see `local-oracle-phone-2026-10-19/` and `integration-2026-10-19/`).