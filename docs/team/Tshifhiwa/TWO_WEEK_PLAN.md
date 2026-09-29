# Tshifhiwa Thamagane

Role: **System Designer and Database Architect**

GitHub: `TshifhiwaThamagane`

Scope: Architecture diagrams, ERD, data dictionary, Oracle SQL migrations, seed data, constraints and database verification. Shared API contracts are in scope; unrelated UI code is not.

## Daily plan

| Day/date | Work to complete | Repository destination | Suggested commit after completion |
|---|---|---|---|
| 1: Wed 30 Sep 2026 | Review architecture and entity list | `docs/design/architecture.md` | `docs: define shared service and database architecture` |
| 2: Thu 01 Oct 2026 | Create ERD and relationship explanations | `docs/design/erd.md` | `docs: model CFJ entity relationships` |
| 3: Fri 02 Oct 2026 | Write data dictionary and role mapping | `database/data-dictionary.md` | `docs: define Oracle fields and identity mapping` |
| 4: Sat 03 Oct 2026 | Create versioned core Oracle tables | `database/migrations/` | `feat: add core Oracle schema and constraints` |
| 5: Sun 04 Oct 2026 | Create synthetic seed records and count checks | `database/seeds/` | `test: add representative Oracle seed data` |
| 6: Mon 05 Oct 2026 | Verify constraints and record real results | `database/tests/` | `test: verify database keys and invalid data rejection` |
| 7: Tue 06 Oct 2026 | Review normalization and schema changes | `docs/design/schema-review.md` | `docs: record first-week database design review` |
| 8: Wed 07 Oct 2026 | Implement booking capacity transaction design | `database/transactions/` | `feat: define safe class booking transactions` |
| 9: Thu 08 Oct 2026 | Add attendance payment and event tables as needed | `database/migrations/` | `feat: extend Oracle schema for gym operations` |
| 10: Fri 09 Oct 2026 | Define reporting queries and access views | `database/reports/` | `feat: add management report queries` |
| 11: Sat 10 Oct 2026 | Review API field and error contracts | `docs/design/api-contract.md` | `docs: align API contracts with Oracle data model` |
| 12: Sun 11 Oct 2026 | Test concurrent bookings and rollback behavior | `database/tests/` | `test: verify booking concurrency and rollback` |
| 13: Mon 12 Oct 2026 | Document backup restore and connection setup | `database/OPERATIONS.md` | `docs: document database recovery and setup` |
| 14: Tue 13 Oct 2026 | Finalize schema evidence and design handover | `docs/design/handover.md` | `docs: finalize system and database design evidence` |

## Daily evidence

For each task record: actual date, files changed, reason, checks and results, commit URL, PR URL, reviewer, and remaining blockers. Do not mark a planned task complete before its checks pass. Never put private records or credentials into evidence.
