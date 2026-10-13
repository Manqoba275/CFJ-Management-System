# Demo deployment and Android installation

Prepared 12 October 2026. No public hosting destination or permanent release key is configured. This guide separates the static prototype from the connected local service.

## Static HTTPS demo package

Run `npm test`, `npm run check`, then `npm run package:demo` from the repository root. The last command creates a fresh `output/cfj-static-demo-*` directory containing only tracked static assets and a SHA-256 manifest. It excludes the API-only service and registration pages, repository metadata, backend stores and keys. The manifest identifies the source commit; asset hashes describe the working-tree files actually packaged.

Upload the directory's contents, with `index.html` at the root, to the team's chosen static HTTPS host. Use a separate demo URL rather than replacing CFJ's live website. Confirm the overview, navigation, CSS/images, demo login and browser-local data work at the hosted URL. Do not enter real member information. Browser localStorage is specific to that browser and origin; a static host does not provide shared accounts or database synchronization.

The hosting provider, project and demo URL must be selected before publication. This package is prepared for hosting; it has not been deployed or verified at a public URL.

## Connected local demonstration

Run `npm run start:api` with separate random `CFJ_DEV_TOKEN`, `CFJ_DEV_PEER_TOKEN`, `CFJ_DEV_STAFF_TOKEN` and `CFJ_DEV_ADMIN_TOKEN` environment variables (at least 32 characters each). See `backend/PROFILE_API.md`, `OPERATIONS_API.md`, `COMMUNITY_API.md` and `MANAGEMENT_API.md` for the flows and roles.

Open `http://127.0.0.1:8787/service.html` or `/registration.html`. Android debug Settings uses `http://10.0.2.2:8787` on the emulator. A USB device can use `adb reverse tcp:8787 tcp:8787` and `http://127.0.0.1:8787`; this is an installation recipe, not a completed phone acceptance test. The server stays bound to loopback. Do not expose this development token/JSON adapter publicly.

## Release signing configuration

The Gradle project reads these four environment variables. Set them in the build process using the team's securely managed values; do not paste passwords into commits, documentation or command history.

| Variable | Value |
| --- | --- |
| `CFJ_RELEASE_STORE_FILE` | Absolute path to the team's keystore outside the repository |
| `CFJ_RELEASE_STORE_PASSWORD` | Keystore password |
| `CFJ_RELEASE_KEY_ALIAS` | Existing signing-key alias |
| `CFJ_RELEASE_KEY_PASSWORD` | Key password |

Partial configuration fails immediately. APK/bundle release packaging fails if signing is not configured. Debug builds do not require these variables. There is no fallback to the debug signing certificate.

Keep the permanent signing key and its recoverable backup under the owner's control: future app updates must use the same signing identity. Do not adopt a temporary verification key as the production key.

From `mobile-app`, with Android Studio's JDK and the Android SDK available:

```powershell
./gradlew.bat testDebugUnitTest lintDebug assembleDebug assembleDebugAndroidTest
./gradlew.bat lintRelease assembleRelease
```

Use `bundleRelease` instead of `assembleRelease` when an Android App Bundle is required. APK output: `app/build/outputs/apk/release/app-release.apk`. Verify it with the SDK's `apksigner.bat verify --verbose --print-certs` and record the certificate SHA-256 fingerprint. Build success does not certify Play Store readiness.

Release builds retain HTTPS-only networking and hide the manual development-token panels. Hosted sign-in is still pending, so release packaging currently produces the basic native preview, not a fully connected production application.

## Install and verify on a phone

For the debug preview use `adb install -r app/build/outputs/apk/debug/app-debug.apk`. For a release-signed build use its release APK path. If an existing app has a different signature, Android rejects the update; do not uninstall it without first considering loss of local preferences. Debug and release currently share the application ID.

On a real device, verify Home/Classes/Settings navigation, saved preferences, rotation, offline messages and the appropriate API flows for a debug build. Record Android version, app version, commit, results and screenshots. Then verify the same member's service changes across website and phone. These physical-device checks remain outstanding.

## Production prerequisites

Oracle persistence/transactions, verified hosted identities, real membership rules, public endpoint abuse controls and a production API host remain pending. The static demo archive and release signing configuration do not satisfy those requirements.
