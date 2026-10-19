# Development profile connection

Sunday scope: Kotlin Settings can load and update one synthetic profile through a local HTTP API. The existing local Save preferences action remains separate. This does not create real member accounts. Oracle and Firebase identity verification remain production prerequisites; do not deploy this development server publicly.

## Run on Manqoba's PC

From the repository root in PowerShell:

```powershell
$env:CFJ_DEV_TOKEN = [Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
npm run start:api
```

Retain the generated token securely in that terminal session. To copy it for the app before starting the server, run `Set-Clipboard $env:CFJ_DEV_TOKEN`. Never commit it or include it in screenshots/evidence. The server binds only to 127.0.0.1:8787. Synthetic data is persisted atomically at ignored `tmp/profile-api/member.json`; retain this file across restarts to preserve the profile.

Build/open the debug Android app, then Settings → Development profile sync. For an Android emulator use `http://10.0.2.2:8787`. Enter the token, select Load from service, edit display name/goal, then Save to service. Load again to verify the server value. Loading deliberately replaces unsaved form values and caches the returned profile on the phone. Tokens remain in memory only and are not restored after recreation. Release builds hide this panel and prohibit cleartext HTTP.

For a USB-connected development phone use `adb reverse tcp:8787 tcp:8787` and `http://127.0.0.1:8787` in the debug app. Real-phone operation must be tested separately before claiming it works. Do not expose the local service on a public network.

## Contract

All calls require `Authorization: Bearer <development-token>`. This token selects the single synthetic member; no caller-supplied member ID is accepted.

- GET `/api/v1/me`: returns `{ "displayName": "Demo Member", "goal": "Build strength", "version": 0 }`.
- PATCH `/api/v1/me`, JSON content type: send all three fields with the version returned by GET. A successful save returns the trimmed name, accepted goal and incremented version.
- Names: 2–60 characters after trimming. Goals: Build strength, Weight loss, Muscle tone, Endurance.
- 400: invalid JSON/fields/value; 401: missing/incorrect token; 409: stale version (reload); 413: body over 4 KiB; 415: wrong content type; 500: storage failure.

Writes are serialized and saved before success is returned. Failed or conflicting writes do not overwrite local preferences. Android performs network calls off the UI thread, has connection/read timeouts, does not follow redirects carrying credentials, and requires a fresh load after a failed write. A timeout can mean the server saved the value but the response was lost; reload before retrying.

## Verification and next steps

`npm test` includes a real HTTP server test for authentication, validation, competing writes and persistence after restart. Android unit tests validate endpoint restrictions. Android build/lint checks validate integration. These do not prove interaction on a physical phone.

Replace the development identity/storage adapter with Firebase token verification and Oracle transactions before production. Then connect website profile editing to the same endpoints and test the same signed-in account across devices. The current website still uses its existing local prototype data.
