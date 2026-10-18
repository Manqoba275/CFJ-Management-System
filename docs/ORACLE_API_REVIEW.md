# Oracle API and recovery review

## What changed

The operations handler accepts an Oracle store while retaining the existing file adapter for isolated unit tests. The Oracle store reads membership, class, booking, attendance, payment, trainer, connection, event, registration, resource and message data from relational tables. The profile adapter continues to use the member/profile tables.

The local Oracle server now maps its synthetic member token to member 9001 so its profile and operations identity agree. Optional peer, staff and admin tokens remain development-only credentials. No Firebase login, public deployment, verified email or real payment processor is implied.

Migration 004 retains the actor and original retry key for attendance/payment records. Retry fingerprints are reconstructed from persisted values after restart. Rebooking reactivates the existing member/session row instead of violating its unique constraint. Friend messages require an accepted connection and are visible only to its participants.

## Transaction design

For this small prototype, Oracle writers take a coarse exclusive lock over the affected domain tables, load a consistent state, apply the existing rules and commit the resulting row changes. All API instances use the same lock, including weekly usage across different sessions. This trades throughput for simple, auditable correctness. Read-only transactions provide consistent multi-table reads. Snapshot reads stop with an error above 10,000 rows instead of silently truncating capacity/eligibility calculations.

Production scale requires query-based pagination and narrower locks, verified server-side identities/roles, rate limiting, hosted TLS/database configuration and monitoring. Direct database writers must honor the same business rules; a database account is not a substitute for API authorization.

## Run the checks

```powershell
node --env-file=.env.oracle scripts/migrate-oracle.mjs
node --env-file=.env.oracle scripts/verify-oracle-operations.mjs
node --env-file=.env.oracle scripts/verify-oracle-recovery.mjs
npm test
npm run check
```

The operations verifier uses temporary synthetic members/classes/events and cleans only its own fixtures. The recovery verifier writes an ignored local logical backup, restores rows into new scratch tables, compares row counts/hashes and drops only the scratch tables created by that run. It does not overwrite the application tables. Recovery here means data restoration; it does not certify RMAN, full schema/grant/index restoration, off-site retention or cloud disaster recovery.

## Teammate review checklist

Suggested reviewer: Tshifhiwa, for database architecture. A review must be submitted by that teammate's own GitHub account.

- Inspect migrations 002-004 and confirm schema relationships, retry columns and type constraints.
- Confirm the application never runs as SYS/SYSTEM and does not expose secrets.
- Review cancellation/rebooking, ownership, last-place races and weekly limits across instances.
- Review request-key behavior for retries with the same or changed payload.
- Check guest registrations and consent, private messages and recipient-only acceptance.
- Rerun the SQL-backed verification in the agreed synthetic environment.
- Inspect backup location, restored hashes, cleanup and stated recovery limits.
- Record findings, requested fixes and the actual GitHub review outcome. Do not mark approval before it happens.

Nonhlanhla's acceptance tests and Nyito's meeting/progress records remain separate assigned work.
