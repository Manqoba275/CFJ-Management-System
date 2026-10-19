# Shared API contract proposal

All endpoints use HTTPS. The API verifies the identity-provider token and derives the member identity server-side. Clients never connect directly to Oracle.

## Class summary
GET /api/classes returns an array of objects shaped like:
{"id":"C-DEMO","name":"Strength Foundations","trainer":"Demo Coach","spaces":4}

id, name and trainer are trimmed non-empty strings. spaces is a non-negative integer calculated by the server from capacity and confirmed bookings. This is a read-only snapshot and does not reserve a seat.

## Create booking
POST /api/classes/{classId}/bookings requires authentication. The request may contain an idempotency key; it must not choose a member ID or claim available spaces.

Success: HTTP 201 with booking ID, class ID and CONFIRMED status.
- 400 invalid or missing input
- 401 missing/invalid identity token
- 403 authenticated identity not permitted to book
- 404 class not found
- 409 class full, duplicate booking or class not open
- 500 unexpected failure with generic response and server-side diagnostics

## Cancellation
DELETE /api/bookings/{bookingId} requires authentication and ownership or staff permission. Successful cancellation returns 200/204 and repeated cancellation should be idempotent. The server locks the class row and updates the booking transactionally.

Return only approved public fields in directory responses. Never return passwords, tokens, payment card data, medical details or SQL exception text. Use bind parameters. Enforce staff/admin authorization on every API request, not only in the UI.

This is a proposed contract; no live endpoint is asserted to exist.
