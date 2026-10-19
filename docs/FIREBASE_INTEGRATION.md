# Firebase integration status

Project: cfj-management-system. Android package: za.co.cfjlifestylefitness.app.

Android uses the downloaded client configuration and Firebase Authentication SDK. Open Settings, then CFJ account to register, sign in, request verification, refresh verification, reset a password or sign out. Passwords are not stored by application code or written to logs. Firebase manages the authenticated session.

Enable Email/Password in the Firebase console. Registration sends a real verification email to the entered address; use an address you control. Verification status is refreshed from Firebase. This screen does not grant Oracle access or assign roles.

Outstanding: Android Google SSO/signing fingerprints, server-side Firebase ID-token verification and Oracle UID mapping. Existing debug development-token API controls remain separate. Do not paste Firebase tokens into those controls or treat a local demo role as verified authentication.

The google-services.json file is a Firebase client configuration, not a service-account private key. Never commit service-account credentials. Restrict project access and configure authorized domains/providers in Firebase.

Website account.html now uses the registered web client configuration. It supports email/password, Google popup, verification, reset and logout using session persistence. login.html links to it. It does not populate demo role/localStorage state. Authorize the actual website domain in Firebase before Google sign-in testing. Real account testing and hosted publication remain separate verification steps.

Update 19 October: Firebase-to-Oracle verification, UID mapping and member-only gateway code is now implemented in backend/firebase-oracle-server.mjs; see FIREBASE_ORACLE_CONNECTION.md. Android Firebase build/tests/lint now pass with BoM 34.7.0. Live database integration remains unverified because Oracle is unavailable and no verified account UID has been linked.
