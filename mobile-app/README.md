# Kotlin Android app

Native Android starter with Home, Classes and Settings screens, CFJ styling, official website/timetable links, validated local preferences, navigation and four JUnit validation tests. Preferences are stored on this phone only. Sign-in, SSO, actual bookings and shared member data are not implemented yet.

## Open and build

Open this `mobile-app` folder in Android Studio. Use its bundled JDK 21 and installed Android SDK. The pinned toolchain is Android Gradle Plugin 9.2.1, Gradle 9.4.1 and compile/target SDK 36; minimum Android version is 8.0 (API 26). AGP provides Kotlin support.

Create an ignored `local.properties` containing your own `sdk.dir` if Android Studio has not created it. Never commit another member's PC path.

Windows: `gradlew.bat testDebugUnitTest lintDebug assembleDebug`

Linux/macOS: `bash ./gradlew testDebugUnitTest lintDebug assembleDebug`

Debug APK: `app/build/outputs/apk/debug/app-debug.apk`. It is a development build, not a signed release ready for the Play Store. GitHub Actions runs the same checks and uploads the APK as a build artifact. Local verification on 28 September 2026: `testDebugUnitTest` and `assembleDebug` passed offline. `lintDebug` requires Android lint artifacts that are not cached on this PC; CI downloads them from the configured repositories.

## Next integration step

Implement registration/sign-in/Google SSO and member profile against the shared API before adding booking, attendance, payment history, exercise guides, friends and trainers. Configure the same identity project as the website. Store no database credentials in the app.

Use a hosted HTTPS API for real-phone testing. localhost on a phone is the phone, not the development PC. The starter makes no API calls and does not pretend to reserve class spaces. Complete device testing on a physical Android phone before claiming assessment readiness.

Toolchain reference: https://developer.android.com/build/releases/agp-9-2-0-release-notes (checked 28 September 2026).
