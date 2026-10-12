# Booking capacity transaction

The API authenticates the caller and resolves member ID from the verified identity UID. It must not trust a client-supplied member ID or the displayed spaces value.

## Transaction steps
1. Begin a database transaction.
2. Select the target fitness_class row by ID using SELECT ... FOR UPDATE. Reject a missing or non-SCHEDULED class.
3. Check for an existing booking for this member and class.
4. Count CONFIRMED bookings while holding the class row lock.
5. If count is at capacity, rollback and return HTTP 409.
6. Insert the confirmed booking and commit.
7. On any exception, rollback and return a generic error without exposing SQL details.

Every booking writer must lock the same parent class row before counting/inserting. Keep the lock until commit. Use bound parameters. A retry should use an idempotency key or existing-booking lookup. Cancellation must follow the same locking discipline.

## SQL outline (adapt to backend transaction wrapper)
SELECT capacity, status INTO v_capacity, v_status
FROM fitness_class WHERE class_id = :class_id FOR UPDATE;

SELECT COUNT(*) INTO v_confirmed FROM booking
WHERE class_id = :class_id AND status = 'CONFIRMED';

-- If not scheduled or v_confirmed >= v_capacity: rollback and return conflict.
INSERT INTO booking(booking_id,class_id,member_id,status)
VALUES (:booking_id,:class_id,:authenticated_member_id,'CONFIRMED');

Do not COMMIT inside a lower-level routine if the API transaction manager owns the transaction. Include duplicate detection, exception rollback and connection cleanup in the backend.

## Concurrency acceptance test
Set capacity to 1 with no confirmed bookings and issue two concurrent requests for different members. Exactly one should confirm; the other should return 409. Verify one confirmed row remains. Force an insert failure and verify no partial booking remains. These are instructions, not test results.
