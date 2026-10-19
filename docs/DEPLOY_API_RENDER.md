# Deploying the shared API (Render + hosted Oracle)

This is the exact remaining route to satisfy the brief's "online-hosted API and database" requirement. The repository is deployment-ready; the cloud resources and secrets were not available during the final development session.

## 1. Host Oracle

1. Create an Oracle Cloud **Autonomous Database** (or use a school-provided Oracle service). Record the region, compartment, service alias and administrator password privately.
2. Create an application schema/user (for example `CFJ_APP`) with a bounded quota. Never run the app as ADMIN or SYS.
3. Download the instance wallet (mTLS) or configure TLS. Keep wallet files and passwords outside Git.
4. Run the reviewed migrations and seed script as the schema owner:

```bash
node --env-file=.env.oracle scripts/migrate-oracle.mjs
node --env-file=.env.oracle scripts/seed-oracle.mjs
node --env-file=.env.oracle scripts/verify-oracle-schema.mjs
```

5. Record `SELECT COUNT(*) FROM cfj_members` and one count per table as hosting evidence.

## 2. Deploy the API on Render

1. In Render, create a **Web Service** from this repository and branch `main` (or use `render.yaml` as a Blueprint).
2. Build command: `npm ci`. Start command: `node backend/firebase-oracle-server.mjs`. Health check path: `/healthz`.
3. Set the environment variables in the Render dashboard (never commit them):
   - `CFJ_BIND_HOST=0.0.0.0`
   - `FIREBASE_PROJECT_ID=cfj-management-system`
   - `CFJ_ALLOWED_ORIGINS=https://gym-management-system-11sn.onrender.com`
   - `ORACLE_USER`, `ORACLE_PASSWORD`, `ORACLE_CONNECT_STRING`
   - Oracle wallet files via Render secret files, if mTLS is used.
4. Add the Firebase Admin service-account JSON as a Render **secret file** at `/etc/secrets/firebase-service-account.json` and keep `GOOGLE_APPLICATION_CREDENTIALS` pointing at it.
5. Wait for the deploy, open `https://<service>.onrender.com/healthz` and confirm `{"status":"ready"}`.
6. Map the verified Firebase UID to a synthetic member:

```bash
node --env-file=.env.oracle scripts/link-firebase-member.mjs 9001 <FIREBASE_UID>
```

7. Re-test a signed-in request from the website and the phone, with the development PC switched off. Save the service ID, commit, health result, redacted API response and database row counts.

## 3. Point the clients at the hosted API

- Website: open `account.html`, sign in, enter the HTTPS API origin in the "API address" field (or update the default), then load memberships and bookings.
- Android: set the API origin in Settings and sign in with the Firebase test account; use the debug build for the demonstration.
- Update the README and report with the final HTTPS URL and the evidence folder.

## What is already verified locally

- 14-table `cfj_*` schema, 114 constraints, 160 seeded rows.
- 51 web/API tests, 6 authentication-boundary tests, 16 Android unit tests.
- Firebase token verification and member-only role enforcement (isolated tests).
- `/healthz` readiness endpoint and bounded Oracle call timeouts added for deployment.

## What is not verified

- No hosted Oracle instance, Render API service or signed-in end-to-end request has been evidenced yet. Do not claim these as complete until the steps above are executed and saved.
