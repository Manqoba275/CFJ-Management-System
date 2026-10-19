# Firebase-to-Oracle connection

## What is implemented

The dedicated backend/firebase-oracle-server.mjs listener uses Firebase Admin verifyIdToken for project-scoped signed token verification (signature, expiry, issuer and audience). It requires email_verified=true, looks up cfj_members.identity_uid using a bound Oracle query and assigns member access only. Client-provided role claims cannot grant staff/admin access. The development-token API remains separate.

Oracle's existing unique identity_uid field is the mapping; no email-based automatic linking or schema migration is required for identity mapping. Migrations 002-004 are still required for operations. An unknown UID returns member_not_provisioned. Registration does not silently grant a paid membership.

## Run locally

1. Restore WSL and start the existing cfj-oracle container. Keep .env.oracle private.
2. Run node --env-file=.env.oracle scripts/migrate-oracle.mjs.
3. Register/sign in using the CFJ Firebase account page or Android account screen. Verify the email. Copy the user's UID from Firebase Authentication > Users (not an ID token).
4. Explicitly map a synthetic test member: node --env-file=.env.oracle scripts/link-firebase-member.mjs 9001 FIREBASE_UID. The script refuses to replace an existing non-synthetic identity. Do not use a real member record for a test account.
5. Set FIREBASE_PROJECT_ID=cfj-management-system and CFJ_ALLOWED_ORIGINS to the exact local website origin (for example http://localhost:8080). Then run node --env-file=.env.oracle backend/firebase-oracle-server.mjs.
6. Website: open account.html through the local web server, sign in, enter http://127.0.0.1:8789 and load shared records. A hosted HTTPS page requires an HTTPS API; a localhost API is not cloud hosting.
7. Android: adb reverse tcp:8789 tcp:8789, sign in and verify, then reopen Settings. The debug panel selects the signed-in Firebase UID marker and localhost:8789. Real tokens are obtained from the SDK on background request threads; do not paste them into the token field. Release service controls remain outside this debug prototype.
8. Book a class from one client, reload the other, cancel and reload both. Capture results without credentials. Membership validity and capacity rules still apply.

## Verification and limitations

Six isolated gate tests exercise missing/invalid token handling, verified-email enforcement, unmapped identities, member-only roles, origin rejection and sanitized storage errors. These tests inject a verifier/store; they do not prove live Firebase or Oracle connectivity. Run node --test backend/firebase-gate.test.mjs.

Token verification uses the Firebase Admin standard signature/expiry check. Immediate server-side disabled-user/revocation checks are not enabled; these require configured administrative credentials and additional verification. Tokens are short lived. Emulator tokens are explicitly refused by this executable.

The adapter reuses existing handlers per request and reads a database snapshot; it is a small project implementation, not a scalable production architecture. Public event routes, staff/admin authentication, rate limiting and cloud deployment need separate work. No Firebase service-account private key is committed.

The Android BoM is pinned to 34.7.0 because 35.0.2 requires Kotlin metadata 2.4 while this project's compiler expects 2.2. Build verification must pass before distributing the replacement APK.
