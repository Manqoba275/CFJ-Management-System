# Requirement traceability through 10 October

Updated 10 October 2026. Requirement labels below are local analysis IDs mapped to docs/REQUIREMENTS.md, not externally approved rubric identifiers.

| Requirement | Acceptance evidence / specification | Current result and remaining gap |
|---|---|---|
| R-BOOK: classes, booking and cancellation | BOOK-01–07; CAP-01–05; CAN-01–06 in booking-acceptance.md and booking-rules.md | Seven preview-policy examples pass Node tests; live booking, cancellation, concurrency and idempotency are unverified. |
| R-AUTH: registration, login, SSO and roles | BOOK-03; CAP-05; CAN-03 | Sign-in-required preview behavior passes; hosted identity, SSO and server booking authorization are not established. |
| R-SYNC: central profiles and cross-device consistency | CAN-05; cross-device checks in booking-acceptance.md | Booking synchronization remains unimplemented; local preview does not establish Oracle persistence. |
| R-ATT: attendance | ATT-01–06 in payment-attendance.md | Acceptance criteria prepared; connected attendance behavior unverified. |
| R-PAY: simulated history and paid manual access | PAY-01–07 in payment-attendance.md | Criteria prepared; existing browser simulation is not authoritative server payment evidence. |
| R-PRIV: role and private-record restrictions | CAP-05; CAN-03; ATT-04; PAY-04 | Requires direct unauthorized API tests; hidden controls are insufficient. |
| R-ANDROID: Kotlin client | BookingExamples.kt; seven web/Kotlin fixture comparisons | Examples match; Android unit execution, APK compilation and physical-phone checks were not run in this analysis task. |
| R-DB: relational data and constraints | CAP-01–03; CAN-01–02; ATT-03; PAY-03 | Oracle migrations, constraints and transaction tests remain dependencies. |

| R-SOCIAL: trainers and friends | TRAIN-01–04; FRIEND-01–04 in member-services.md | Proposed criteria prepared; eligibility, consent, persistence and privacy execution pending. |
| R-EXERCISE: training guides | EXERCISE-01–03 in member-services.md | Entitlement, content and accessibility checks pending. |
| R-REPORT: management reports | REPORT-01–06 in reporting-events.md | Metric definitions/permissions require review; fixture totals and connected access unrun. |
| R-EVENT: public marathon | EVENT-01–06 in reporting-events.md | Non-member, duplicate, capacity and roster privacy criteria prepared; implementation unverified. |
| R-ROLES: complete role flows | ROLE-01–10 in acceptance-scenarios.md | Public/member/staff/admin scenarios prepared; stakeholder acceptance and physical-phone execution pending. |

## Evidence boundaries

The combined starter check was executed in a disposable checkout using scripts/prepare-team-code-check.mjs: 34 Node tests passed (seven supplied examples, two packet validation tests and 25 existing eligibility tests); 12 preview HTML pages passed static checks. This does not establish stakeholder approval, a live booking API, Android execution or complete system acceptance.

Trainer, friend, exercise, reporting, marathon and role scenarios are now specified for Days 9–11; their connected execution remains unrun. Team meeting attendance, client sign-off, reviews and physical-device evidence must come from actual events rather than this analysis.
