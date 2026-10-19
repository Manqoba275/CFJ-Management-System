# Current shared API contract

Both clients send a Firebase ID token in Authorization: Bearer. The Firebase listener requires a verified email and an existing cfj_members.identity_uid mapping. It never accepts a member ID or role supplied by the browser as authentication.

- GET /api/v1/classes returns id, name, trainer, date, capacity and spaces. Trainer names are joined from cfj_trainers for Oracle; development fixtures without one show Trainer to be assigned. spaces is a snapshot, not a reservation.
- GET /api/v1/me/memberships returns the authenticated member's entitlements.
- GET /api/v1/bookings returns the member's bookings.
- POST /api/v1/bookings accepts {"classId":"SEED-CLASS-1"}. Success is 201 with status active. Membership, ownership, duplicate and capacity rules are checked server-side. IDs must come from the class response, not this example.
- DELETE /api/v1/bookings/{id} cancels an owned booking and returns 200 with status cancelled. It refuses cancellation after attendance. A cancelled row can be reactivated by a later eligible booking.
- GET/PATCH /api/v1/me uses profile version checks; stale writes return 409.

Missing/invalid tokens return 401; unverified or unmapped identities return 403. Foreign ownership returns 404, conflicts 409, invalid bodies 400 and unavailable storage 503. Do not expose SQL errors or tokens.

The Firebase gateway currently grants member access only. Development staff/admin tokens belong to the separate local-only development server. Hosted staff/admin authentication is still outstanding.

The former /api/classes/{id}/bookings and CONFIRMED examples were design proposals; they are not the implemented route or status. The active store serializes writes inside Oracle using table locks before rule validation, rather than the proposal's class-row-lock algorithm. This is a small prototype implementation; load and concurrency testing remain required.
