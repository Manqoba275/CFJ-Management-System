# Oracle development database

Oracle Free Lite runs locally in Ubuntu WSL2 using Podman. Container: cfj-oracle. Persistent volume: cfj-oracle-lite-data. Service: 127.0.0.1:1521/FREEPDB1. This is local development, not online hosting.

## Schema
Provision CFJ_APP in FREEPDB1 with CREATE SESSION, CREATE TABLE and a bounded quota on a dedicated tablespace. Never run the application as SYSTEM. Lite does not necessarily include USERS; this installation uses CFJ_DATA and a 50 MB account quota.

Run 001_profiles.sql once as CFJ_APP. It creates members and profiles, with a foreign key, unique identity/email fields, allowed goals and version constraints. Both tables receive ten fictional records. Booking, attendance, payments and community still need relational migrations and integration.

## Run
Install locked dependencies with npm ci. Set ORACLE_USER, ORACLE_PASSWORD, ORACLE_CONNECT_STRING and a random CFJ_DEV_TOKEN of at least 32 characters in an ignored .env.oracle file. Never include secret values in screenshots or client source.

Run: node --env-file=.env.oracle backend/oracle-server.mjs
Open: http://127.0.0.1:8788/profile-sync.html

The token grants access only to synthetic member 1. This is not real registration, SSO or account verification. The existing public website still uses browser storage; this page is a separate integration step.

The Android development profile screen uses the same GET/PATCH /api/v1/me contract. With a USB phone connected, use adb reverse tcp:8788 tcp:8788 and service address http://127.0.0.1:8788. Physical phone operation still needs verification.

## Verify
Run: node --env-file=.env.oracle scripts/verify-oracle-profile.mjs
This checks authentication rejection, competing writes from two API instances, committed database persistence, invalid input and table counts. It temporarily updates synthetic member 10, restores its fields and advances its version. Never run against real member data.

Run npm test and npm run check for existing regression checks. Retain raw logs with screenshots. Driver reference: https://node-oracledb.readthedocs.io/en/latest/user_guide/txn_management.html

Start: wsl -d Ubuntu -u root -- podman start cfj-oracle
Stop cleanly: wsl -d Ubuntu -u root -- podman stop --time 120 cfj-oracle
Never delete the volume to restart the database. Backup and restore verification remains outstanding.
