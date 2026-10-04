# Shared API — planned contract

The development profile endpoint is implemented: see [PROFILE_API.md](PROFILE_API.md) for running it and connecting Android Settings. It uses one token-selected synthetic member and ignored local JSON persistence. Production implementation remains pending: use Node.js with node-oracledb and server-side identity-token verification. Keep Oracle credentials on the server. Both clients must call the same versioned HTTPS endpoints.

Proposed endpoints: GET/PATCH /api/v1/me; GET /api/v1/classes; POST /api/v1/bookings; DELETE /api/v1/bookings/{id}; POST /api/v1/attendance; GET /api/v1/me/payments; POST /api/v1/payments (staff/admin simulated recording); GET /api/v1/exercises; GET /api/v1/trainers; POST /api/v1/trainer-requests; POST /api/v1/friend-connections; POST /api/v1/marathon-registrations; GET /api/v1/admin/reports.

Document JSON schemas, role permissions, error responses and idempotency in OpenAPI before implementing both clients. Profile mutations require ownership checks; admin endpoints require server-side roles. Return 401 for missing/invalid identity, 403 for denied permissions, 409 for capacity/duplicate/version conflicts and 400 for invalid input. Tests must cover these failures as well as success.
