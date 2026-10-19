> Integration status, 19 October 2026: the running API uses the `cfj_*` schema from `database/001_profiles.sql` through `004_api_retries.sql`. The unprefixed tables in `database/migrations`, `seeds`, `reports` and `tests` are Tshifhiwa's alternative design contribution, not migrations for that API. Do not run both sets as a single migration chain. Reconcile requirements and data mappings before adopting that alternative. See `docs/TEAM_REVIEW_2026-10-19.md`.
# Oracle database operations

## Current status
Oracle has not been provisioned as part of the current repository setup. This is a setup checklist, not confirmation of a live database.

## Development setup
1. Install a supported Oracle Database Free version and SQL*Plus or SQLcl.
2. Create a dedicated non-production schema with only required privileges.
3. Store credentials in environment variables or a local ignored configuration file. Never commit passwords, wallets, identity tokens or private member data.
4. Apply migrations in numeric order and record Oracle version, date, operator and migration result.
5. Apply synthetic seeds only in a disposable development schema.
6. Run database/tests/constraints_and_seed_checks.sql and save the real output.
7. Configure the Node.js API to use a connection pool and bind variables. Oracle credentials stay server-side.

## Backup and restore
Before schema migrations, take a DBA-approved Oracle Data Pump or environment-appropriate backup. Store backup files in approved restricted storage, not GitHub. Periodically restore into an isolated test schema and record the restore date, duration, checks and issues. A backup is not verified until restore succeeds and row/application checks pass. Agree retention, encryption, access control and recovery objectives with the supervisor.

## Safeguards
Use fictional seed data only. Do not store card numbers or CVVs; payments are currently simulated. Do not log tokens, passwords or private profile fields. Keep schema changes versioned and reviewed. Do not edit an already-applied migration in a shared environment; add a new migration.
