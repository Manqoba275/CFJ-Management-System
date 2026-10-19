> Reconciled 19 October 2026: this historical design is retained under database/design/alternative-proposal. Use database/OPERATIONS.md for the active cfj_* schema and docs/design/api-contract.md for implemented endpoints. No automatic data migration between the two designs is claimed.

# Database schema review

Oracle is the authoritative relational store. Website and Android clients call the shared API and never connect directly to Oracle. The class response is a display projection, not a table.

## Relationships
- app_user stores the identity-provider UID and role, never passwords.
- member extends an app user; member_preference is one-to-one with member.
- trainer can lead many fitness_class records.
- fitness_class has many booking records; unique (class_id, member_id) prevents duplicate booking rows.
- attendance has at most one record per booking.
- payment records simulated/payment status and a reference only; no card data.
- friend_connection, trainer_request, and trainer_review represent separate workflows.
- marathon_event has many public marathon_registration records, which do not require an app account.
- exercise is a standalone catalogue until class/exercise assignments are required.

## Normalization and constraints
Identity, member profile, trainer, class, booking and attendance data are separated by keys. Trainer display names are joined from trainer. Availability is derived from capacity minus confirmed bookings in v_class_availability rather than maintained as a mutable counter. Foreign keys preserve relationships; checks constrain statuses, ratings, capacity and preferences.

## Decisions for team review
1. Whether cancelled bookings may be reactivated.
2. Whether reviews require attendance.
3. How roles map to verified Firebase UIDs.
4. Whether payment events need immutable history.
5. Whether friendship pairs should be canonicalized to prevent reversed duplicates.
6. Privacy and retention rules for member and public registration data.

This is a design review, not evidence that the migration has been run. Test it against a disposable Oracle schema before claiming verification.
