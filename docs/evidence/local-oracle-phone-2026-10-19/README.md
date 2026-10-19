# Local Oracle and Android verification - 19 October 2026

- Earlier live Oracle run: 21 schema checks and 15 operations checks passed. The operations test used two independent HTTP servers and removed its temporary fixtures.
- Firebase UID mapping to synthetic member 9001 succeeded and was resolved through a fresh Oracle connection earlier in the session. No UID or credentials are included here.
- A later repeat connection timed out (NJS-040). Current database availability is therefore not accepted as reliable.
- Android build, unit tests and lint passed in 17m49s for the illustrated training/account update. A passing build is not evidence of installation: a later ADB check reported the phone offline with no connected devices, so installation on the Huawei CTR-LX2 is not independently evidenced. The only device-side evidence is a user-supplied screenshot; see ../phone-2026-10-19/README.md.
- Phone has no Google Play services; native Google account selection is unavailable there. Email/password acceptance is pending the user's private test.
- No successful Firebase sign-in, registration or cross-client booking acceptance is claimed by these files.
- No credential-entry screenshot is retained. New training screenshots remain pending while the user tests login.
