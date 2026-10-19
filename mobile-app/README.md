# Kotlin Android app

Native Android app with three main screens (Home, Classes and Settings), CFJ styling, validated local preferences and navigation. Home hosts the illustrated training dashboard. Settings hosts local preferences, the CFJ account entry point and, in debug builds only, the development API panels for profile sync and shared membership/class/booking records.

## Implemented features

- **CFJ account (Firebase).** The account screen offers Create account, Sign in, Send verification email, Check verification, Reset password and Sign out. Google sign-in appears only when Google Play services are installed; on a phone without them the screen says so and offers email/password instead. Firebase owns credentials: application code never stores or logs passwords, and the account screen does not grant Oracle access or assign roles. See [Firebase integration](../docs/FIREBASE_INTEGRATION.md).
- **Training dashboard and exercise guides (Home).** An illustrated dashboard with three beginner movements (sit to stand, wall press-up, supported calf raise), written technique steps and form cues, a two-set routine with five repetitions per set, an optional 60-second rest timer, a completed-session count saved on the phone, and an NHS demonstration-video link. An in-progress workout restarts if the screen is recreated; completed-session totals remain stored. The library has three movements, not a complete catalogue. See [Android fitness update](../docs/ANDROID_FITNESS_UPDATE.md).
- **Classes.** CFJ training overview plus a button that opens the official timetable in a browser. This screen does not book a class.
- **Settings.** Display name and fitness goal are validated and saved on the phone; Reset preferences clears them after confirmation. A "CFJ account — sign in or register" button opens the account screen.
- **Debug-only API controls (Settings, debug builds only).** Development profile sync loads and saves the synthetic profile against a configurable API origin with a development token. The shared-records panel loads memberships, classes, bookings, trainers and friend connections, can book or cancel a class, request a trainer and accept a connection through the API, and lists exercise guides from `/exercises`. When a Firebase user is signed in, the debug token field is prefilled with `firebase:<uid>` and disabled. These are development-token controls, not verified member authentication: never expose the development server publicly and never paste Firebase tokens into the controls.

## Open and build

Open this `mobile-app` folder in Android Studio. Use its bundled JDK 21 and installed Android SDK. The pinned toolchain is Android Gradle Plugin 9.2.1, Gradle 9.4.1 and compile/target SDK 36; minimum Android version is 8.0 (API 26). AGP provides Kotlin support.

Create an ignored `local.properties` containing your own `sdk.dir` if Android Studio has not created it. Never commit another member's PC path.

On Windows, escape the drive colon in this Java properties file, for example `sdk.dir=C\:/Users/YOUR_NAME/AppData/Local/Android/Sdk`. Forward slashes are supported. An unescaped colon may build but fails Android lint's `PropertyEscape` check.

Windows: `gradlew.bat testDebugUnitTest lintDebug assembleDebug`

Linux/macOS: `bash ./gradlew testDebugUnitTest lintDebug assembleDebug`

Debug APK: `app/build/outputs/apk/debug/app-debug.apk`. It is a development build, not a signed release ready for the Play Store. GitHub Actions runs the same checks and uploads the APK as a build artifact. Local verification on 19 October 2026: `testDebugUnitTest`, `lintDebug` and `assembleDebug` passed with 16 unit tests, zero failures (see [build log](../docs/evidence/local-oracle-phone-2026-10-19/android-build.txt)). The earlier 18 October record (16 unit tests, debug assembly and lint passed with 10 lint warnings, GitHub Android workflow passed) is in [the verification record](../docs/WIL_VERIFICATION_2026-10-18.md).

The submitted debug APK is 8,445,659 bytes with SHA256 `90A810FF9248974A06E3D6BA570354E962912B398FB6F7EEBF9067835A725E76`, built from commit 78a36ff (build log `C:\Users\mtung\OneDrive\Desktop\CFJ Task 4 Evidence\android-build.txt`, BUILD SUCCESSFUL in 7m 52s). The APK inventory and the older builds it must not be confused with are in [docs/evidence/apk-2026-10-19](../docs/evidence/apk-2026-10-19/README.md).

## Real-phone evidence limit

The only phone evidence for this app is a user-supplied screenshot showing the CFJ account screen at "Email verified. Signed in." ([phone evidence](../docs/evidence/phone-2026-10-19/README.md)). It has no build, device or installation binding, and ADB checks recorded the test phone offline. Installation of the submitted APK on a real device is therefore NOT independently evidenced.

## Next integration step

Remaining work: link the Firebase UID to a member record on the server, complete the hosted HTTPS API and Oracle-backed booking flow, and re-test each account and booking path on a real phone with an ADB-documented installation. Android Google sign-in is blocked on the test Huawei because it has no Play services; the OAuth fingerprint is registered but device execution is unverified, so Google-on-Android and live Oracle/database acceptance remain outstanding. Store no database credentials in the app.

Use a hosted HTTPS API for production/real-account testing. localhost on a phone is the phone, not the development PC. The debug panels make GET/PATCH/POST API calls with a development token; a successful call is not proof of member authentication. Local emulator and USB development instructions are in backend/PROFILE_API.md. Complete device testing on a physical Android phone before claiming assessment readiness.

An optional instrumentation smoke test is included for the synthetic server: build `assembleDebugAndroidTest`, install the app and test APKs, then run `adb shell am instrument -w -e devToken <local-token> za.co.cfjlifestylefitness.app.test/za.co.cfjlifestylefitness.app.ProfileConnectionInstrumentation`. It loads, edits, reloads, checks stale/unauthorized calls and restores the original values. Do not use a production token or include the token in evidence. Expected output is PROFILE_SYNC_OK. The emulator needs sufficient available memory; a build pass alone does not establish this runtime test passed.

Toolchain reference: https://developer.android.com/build/releases/agp-9-2-0-release-notes (checked 28 September 2026).

## User help
See the [user guide](../docs/user-guide/USER_GUIDE.md) for the current screen behaviour, troubleshooting and the distinction between local preferences and API profile saving.
