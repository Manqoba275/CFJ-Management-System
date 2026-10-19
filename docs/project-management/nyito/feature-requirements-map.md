# CFJ requirements and acceptance traceability

**Prepared:** 19 October 2026 | **Owner:** Nyito Ramudzuli | **Status:** Draft for team validation; imported baseline retained for comparison

This feature-level mapping was imported from the uploaded package. The formal assessment map is requirements-map.md, which was checked against the supplied WIL manual. Baseline descriptions below are historical guide statements, not current runtime findings. See evidence-review.md for later saved evidence.

| ID | Requirement | Source-described baseline | Task | Test | Acceptance check | Evidence status |
|---|---|---|---|---|---|---|
| R01 | Member registration and sign-in | Hosted identity planned; browser demo is not verified identity | AUTH-API | T-AUTH-01 | Unverified or invalid session rejected | Not supplied |
| R02 | Member profile and settings | Website local prototype; Android partial | APP-INTEG | T-INT-01 | Same member update visible across clients | Not supplied |
| R03 | Class booking and cancellation | Local API supports operations; Oracle not verified | API-ORACLE | T-BOOK-01 | Last-seat concurrency creates one booking only | Not supplied |
| R04 | Attendance records | Local API supports staff attendance | API-ORACLE | T-ATT-01 | Only correct member can see their attendance | Not supplied |
| R05 | Simulated payment history | Local API supports simulated payments | BA-RULE | T-PAY-01 | No real charge; member sees only own payments | Not supplied |
| R06 | Trainer requests | Pending request is not confirmed appointment | BA-RULE | T-TRAIN-01 | Request remains pending until authorised decision | Not supplied |
| R07 | Friend connections | Recipient approval required | BA-RULE | T-FRIEND-01 | Private fields hidden; only recipient accepts | Not supplied |
| R08 | Exercise guide entitlement | Current local unlock uses positive simulated payment; expiry check pending | BA-RULE | T-GUIDE-01 | Unpaid or expired membership cannot access restricted guides | Not supplied |
| R09 | Admin reports and staff permissions | Local aggregate reports; full staff management outstanding | AUTH-API | T-ROLE-01 | Staff/member denied admin report | Not supplied |
| R10 | Public marathon registration | Local API handles consent, duplicate and capacity checks | QA-PLAN | T-EVENT-01 | Non-member may register; duplicates/capacity rejected | Not supplied |
| R11 | Oracle shared database | Later saved local evidence lists 14 tables and 160 rows; see EV-DB-01; hosted/API acceptance pending | DB-MIG | T-DB-01 | Required tables and constraints verified by executed SQL | Not supplied |
| R12 | Real-phone and cross-client acceptance | Not yet confirmed by source guides | QA-PHONE | T-PHONE-01 | Real device tests with actual results and version evidence | Not supplied |
| R13 | WIL task and contribution evidence | Tracker, board, meetings and contributions required | PM-HANDOVER | T-PM-01 | Reviewed traceable links and genuine meeting evidence | Not supplied |

## Cross-cutting rules
- Only the server handles Oracle credentials; never put them in browser or Android source.
- Role and ownership are verified server-side; verified email is not staff/admin authorisation.
- No confirmed booking without a successful API transaction.
- Synthetic records only for demonstrations.
- A task is **Done** only after its artifact, checks, and reviewer approval are evidenced.

## Clarifications needed
- Confirm mandatory Task 2 vs Task 3 requirements against the original POE.
- Confirm final architecture and lecturer approval of Oracle replacing Room as shared database.
- Confirm current source branch, Azure project, owners, deadlines and test outcomes.
