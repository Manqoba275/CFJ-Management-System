# Development bookings, attendance and simulated payments

Run one API process from the repository root. Set CFJ_DEV_TOKEN to a random member token of at least 32 characters and CFJ_DEV_STAFF_TOKEN to a different random staff token of at least 32 characters, then run `npm run start:api`. Keep both values out of source control. Staff endpoints are unavailable without a configured staff token.

Open http://127.0.0.1:8787/service.html for the connected service desk. Enter the member token to load classes, book/cancel and read personal attendance/payment history. Enter the staff token to list bookings and record attendance or simulated payments against a booking ID. Reload with the member token to see those records. Tokens remain in page memory; no card details or real payments are used. The existing operations.html page remains a separate browser-local prototype.

## Endpoints

All endpoints below require the development bearer token; identity and role are derived on the server, never from request member IDs.

- GET /api/v1/classes: persisted demo classes with remaining places.
- GET /api/v1/bookings: the member's bookings, or all bookings for staff.
- POST /api/v1/bookings: `{ "classId": "C-DEMO" }`. Member only. Returns 201 or 409 when full/already booked.
- DELETE /api/v1/bookings/{id}: owner only; repeated cancellation succeeds. Attended bookings cannot be cancelled.
- POST /api/v1/attendance: staff only; `{ "bookingId": "...", "requestId": "unique-key" }` for an active booking. At most one attendance record per booking.
- POST /api/v1/payments: staff only; same body plus integer `amountCents` (1–10000000). Always returns currency ZAR and simulated=true. Multiple intentional payment records are allowed; retry the same request ID for the same logical payment.
- GET /api/v1/me/attendance and /api/v1/me/payments: records for the authenticated member only.

Request IDs are 8–80 ASCII letters/digits/hyphens. Staff record retries use the same ID and payload, including after server restart; changed payloads with a reused ID return 409. A page reload loses an unconfirmed request ID, so inspect records before entering the same payment again. The service desk preserves request IDs while the page remains open and a response is uncertain.

## Persistence and tests

Single-process writes are serialized, validated against the latest state, written to a temporary file and atomically renamed before success. Store: ignored tmp/profile-api/operations.json. Run exactly one process per data file; this is not a multi-process database transaction implementation. Do not delete the file to reset real records; use synthetic data only.

`npm test` covers simultaneous last-place requests, duplicate booking, foreign cancellation/history isolation, cancellation releasing capacity, attendance roles/duplicates, invalid payment amounts, idempotent retries, changed-payload rejection and persistence after restart. Profile tests remain included.

This extends the local development API. Hosted sign-in, Oracle transactions, real member accounts, deployment and physical-device acceptance remain pending. The current demo has one member and one staff identity; automated tests inject a second synthetic member to verify isolation and capacity contention. The Android app still exposes profile sync and booking eligibility, not the new booking/attendance/payment screens.
