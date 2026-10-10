# Role-based business acceptance scenarios

Day 11 deliverable, prepared 10 October 2026 with AI assistance. Scope follows Nyito's Business Analyst plan through 10 October, building on Days 1–8 already delivered. Scenario definitions are complete for review; stakeholder acceptance and connected execution are pending.

The IDs below reference detailed criteria in the linked specifications. Use fictional accounts/records and the same shared API for web and Android. Collect source commit, fixture IDs, actual result, evidence and defects. **READY** in booking preview examples allows a request; it never confirms a reserved seat.

| Role / ID | Scenario and expected result | Detailed criteria |
|---|---|---|
| Public / ROLE-01 | Open public information and marathon registration; submit valid non-member details and receive persistent confirmation. Invalid/closed/full/duplicate submissions are handled without exposing the roster. | EVENT-01–06 in reporting-events.md |
| Public / ROLE-02 | Attempt booking or private/admin API access without identity; sign-in is required and protected responses disclose no data. | BOOK-03; REPORT-02; EXERCISE-02 |
| Member / ROLE-03 | Register and sign in with email or Google SSO on both clients; invalid/expired identity is rejected; sign-out removes access to private cached data. | docs/REQUIREMENTS.md; hosted identity verification remains pending |
| Member / ROLE-04 | Load/edit own profile and settings, refresh the other client and see committed values; invalid fields, another member's record and stale-version writes are rejected; offline/retry states never claim an unconfirmed save. | Shared profile requirement; API ownership, validation and conflict checks required |
| Member / ROLE-05 | Request an available class, reject duplicate/offline/guest/full/invalid capacity, cancel under agreed rules and observe shared state. Concurrent final-seat requests confirm exactly one seat. | BOOK-01–07; CAP-01–05; CAN-01–06 in booking rules |
| Member / ROLE-06 | Read own attendance/payment history and eligible manuals; another member's records and unpaid protected content are denied. Payments/messages stay explicitly simulated. | ATT-01–06; PAY-01–07 in payment-attendance.md |
| Member / ROLE-07 | Browse trainers, submit eligible requests/reviews and manage consenting friend connections; duplicate, self, invalid and unauthorized actions fail with private data excluded. | TRAIN-01–04; FRIEND-01–04; EXERCISE-01–03 |
| Staff / ROLE-08 | Record permitted attendance and simulated payments with retry protection; correct records only under agreed audited permission; direct admin-report requests are denied. | ATT-01–06; PAY-01–07; REPORT-02 |
| Admin / ROLE-09 | View filtered accurate reports and manage staff under server roles; revoked staff cannot continue protected operations; private fields remain excluded from reports. | REPORT-01–06; docs/REQUIREMENTS.md staff-management requirement |
| All / ROLE-10 | Encounter slow/offline/empty/failed services with usable loading and retry states; authorization is checked by the API and confirmed writes survive restart/refresh across clients. | Cross-client checks in booking-acceptance.md and member-services.md |

## Execution sequence

1. Agree unresolved business decisions, contract fields and supported platforms. Provision required identity/API/database and build the Android client before claiming connected acceptance.
2. Seed controlled fixtures and verify baseline counts; use separate identities for guest, two members, staff and admin.
3. Execute each role's valid flows, then direct forbidden requests, malformed input and retry cases.
4. Exercise capacity concurrency, period boundaries, revocation and cross-client refresh on a physical phone.
5. Record passed, failed, blocked and unrun separately. Re-run affected scenarios after defects are fixed. Link genuine reviewer approval separately from test results.

Preview policy and static checks are useful development evidence. They do not satisfy live server authorization, database transactions, SSO, actual payment/message delivery or physical-phone acceptance.
