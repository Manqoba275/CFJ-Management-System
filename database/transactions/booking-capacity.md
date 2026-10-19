# Booking transaction in the active API

The Firebase gateway resolves member identity from a verified UID. The operations handler never trusts a caller-supplied member ID or available-space count.

The active oracleOperationsStore.transact takes exclusive locks on the participating cfj_* tables, reads the current state, evaluates membership validity, weekly/credit limits, ownership, duplicate and capacity rules, then persists and commits the change. A failed operation rolls back. This coarse lock also serializes competing bookings in different classes that share a weekly entitlement.

Cancellation and rebooking use that same transaction path. Cancellation after attendance is refused. Rebooking reuses the unique member/session row. A browser's displayed spaces value never reserves a seat.

The earlier class-row-lock proposal remains useful for a future finer-grained adapter, but is not the current algorithm. A replacement must also serialize membership-wide limits and follow a consistent lock order.

Run scripts/verify-oracle-operations.mjs against the approved synthetic schema to test competing API instances, last-seat conflicts, weekly limits, cancellation/rebooking, retries and ownership. This document is not proof those database tests have passed.
