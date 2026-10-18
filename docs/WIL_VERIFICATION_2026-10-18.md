# WIL Part 2 verification on 18 October 2026

## Verified locally
- Website links/assets and script syntax: 15 pages passed.
- Web/API regression suite: 43 passed, 0 failed.
- Android debug APK assembly and lint completed successfully. Lint retains 10 warnings; passing does not mean warning-free.
- Android unit tests were rerun with --rerun-tasks: 16 passed, 0 failed.
- Oracle Free Lite database opened locally in WSL2. A restricted CFJ_APP account uses its own tablespace.
- CFJ_MEMBERS and CFJ_PROFILES each contain 10 synthetic records, with primary/foreign keys and constraints.
- Real Oracle profile integration verified: unauthorized requests rejected; invalid goals rejected; concurrent writes through two API instances yield one success and one conflict; committed data is visible through another connection.

## Evidence scope
Screenshots and raw logs are kept in the local Desktop evidence folder. They demonstrate the current development implementation. Website account screenshots show browser-only demo behaviour, not hosted authentication. Mobile-sized website captures are not Android-phone evidence. Oracle query screenshots are labelled query-output reports, not SQL Developer screenshots. Local build results are not GitHub Actions results.

## Still required
- Hosted authentication, registration, SSO and account verification.
- Relational migrations and integration for bookings, attendance, payments and community features. Ten records in the two current tables do not satisfy the entire system database requirement.
- Replace browser-local data for the remaining website flows and complete Android feature integration.
- Online deployment, cross-device checks and backup/restore verification.
- Physical Android phone operation and narrated demonstration video.
- Actual teammate contributions, Teams records, Azure DevOps progress and final report/rubric assembly.

No physical-phone run, hosted identity, online database or team attendance is asserted by this record.

## GitHub Actions
Both workflows passed for implementation commit 2eb5d62da819c0dd672933bd6f361f763549d06e.
- Setup checks: https://github.com/Manqoba275/CFJ-Management-System/actions/runs/39109136780
- Android build and tests, including signing verification: https://github.com/Manqoba275/CFJ-Management-System/actions/runs/39109136635

