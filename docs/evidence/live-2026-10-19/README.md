# Live Oracle evidence — 2026-10-19 (local WSL Podman)

Capture window: **21:04–21:07 SAST (UTC+02:00), 2026-10-19**. Machine: this Windows host, repo
`C:\Users\mtung\OneDrive\Documentos\ChatGPT\The forge 2`, branch `feature/team-and-app-setup`.
Nothing was committed or pushed; `.env.oracle` values were never printed to logs or this file.

## Bottom line

| Step | Command | Exit | Result |
| --- | --- | --- | --- |
| Migrations | `node --env-file=.env.oracle scripts/migrate-oracle.mjs` | 0 | Idempotent: all 23 objects reported `EXISTS … not modified` |
| Fixtures | `node --env-file=.env.oracle scripts/seed-oracle.mjs` | **1** | Refused by design — see "Seed refusal" below; rollback, **no data changed** |
| Schema verification | `node --env-file=.env.oracle scripts/verify-oracle-schema.mjs` | 0 | **PASS** — 14 tables, 160 rows, 21 constraint/behaviour checks |
| Operations / API | `node --env-file=.env.oracle scripts/verify-oracle-operations.mjs` | 0 | **PASS** — 15 checks against local Oracle with two independent HTTP servers |
| Row counts | derived from schema JSON | 0 | `row-counts.txt` (14 tables, 160 rows) |
| Regression suite | `npm test` (repo root, `CI=1`) | 0 | **51 tests, 51 pass, 0 fail, 0 skipped** (7.0 s) |

Raw output and timestamps per step: `run-log.txt`. Files are UTF-8 without BOM, no NUL bytes.

## Environment at capture time

Container was **already running and healthy**; it was not restarted and no data was reset.

```
cfj-oracle | Up 6 hours (healthy) | container-registry.oracle.com/database/free:23.26.3.0-lite-amd64 | 127.0.0.1:1521->1521/tcp
podman inspect cfj-oracle -> running; health=healthy
```

- Podman inside `wsl -d Ubuntu`; Docker is not installed in that distro.
- Listener `127.0.0.1:1521` inside WSL is reachable from Windows (TCP connect OK), FREEPDB1 used by the scripts.
- Node `v24.19.0` (`C:\Program Files\nodejs\node.exe`), npm `11.17.0`, Windows PowerShell 5.1 for capture only.
- Repo HEAD moved during the capture window: task brief said `78a36ff`; at capture time it was
  `0e75de9` ("docs: rewrite README around the implemented Task 2 system"), created by another session,
  not by this run. No git write commands were executed here.

## Seed refusal (not a database fault)

`scripts/seed-oracle.mjs` is a reserved-fixture seeder: it aborts with
`Reserved member 9001 is already used; no data changed` and rolls back.

Read-only confirmation (`seed-precondition-readonly.txt`): member 9001 exists with a 28-character
**external binding** (Firebase UID) instead of the fixture value `SEED-UID-1`; members 9002–9010
still hold their seed identities, and the 14 tables still hold the expected 160 rows. This is the
documented state left by `scripts/link-firebase-member.mjs 9001 <FIREBASE_UID>` in
`docs/FIREBASE_ORACLE_CONNECTION.md`, not corruption. A fresh database seeds cleanly; this shared
dev database intentionally refuses to overwrite the linked synthetic member. Re-running seed here is
therefore **expected to exit 1** until that link is cleared or the fixture guard is changed.

## What this proves

- The local Oracle Free Lite container is running, healthy and reachable at 127.0.0.1:1521/FREEPDB1.
- Migrations 001–004 are applied and re-runnable with no schema drift (all objects already exist).
- Live schema verification passes: every FK/unique/check constraint is ENABLED and VALIDATED, and
  behaviour probes (orphan rows, bad plans, duplicate bookings, double attendance, zero payments,
  reciprocal friends, consent, self-messages, …) are rejected by the database.
- Live operations verification passes end-to-end against real Oracle rows, including two independent
  HTTP server instances: last-seat booking, cross-server visibility, cancel/rebook, payment retry
  idempotency, attendance, weekly allowance, private messages, trainer requests, paid resource access,
  public event capacity and an admin report, plus a fresh connection confirming the committed payment.
- `npm test` at HEAD `0e75de9` is green: 51/51.

## What is still unproven

- **Firebase live token exchange** against Oracle: `backend/firebase-gate.test.mjs` injects a verifier
  and store, and no real Firebase ID token was verified in this capture. Need a real account UID run.
- **Hosted/cloud Oracle**, Render/Render PostgreSQL deployment, or any public hosting.
- **Android device / phone acceptance** (`adb reverse`, real APK) — not exercised here.
- **Backup and restore verification** of the Podman volume — still outstanding (never delete the volume).
- **Seed idempotency** on a database where member 9001 has been re-linked (see above).
- Public website flows that still use browser storage; staff/admin auth, rate limiting, screenshots.
- Evidence files are untracked; this is raw local output, not CI output.

## File inventory

| File | Contents |
| --- | --- |
| `run-log.txt` | Timestamped command log, exit codes, container state, summary |
| `oracle-migrate.txt` | Full migrate-oracle.mjs output (all objects `EXISTS`) |
| `oracle-seed.txt` | Full seed refusal stack trace (exit 1, rollback) |
| `oracle-schema.txt` | verify-oracle-schema.mjs JSON: counts, 21 checks, 84 columns, 116 constraints, limitations |
| `oracle-operations.txt` | verify-oracle-operations.mjs JSON: 15 checks, fixture cleanup completed |
| `row-counts.txt` | Per-table row counts (14 tables / 160 rows) + status |
| `seed-precondition-readonly.txt` | Read-only explanation of the seed refusal (no UID value printed) |
| `npm-test.txt` | Raw `npm test` output: 51 pass / 0 fail |
