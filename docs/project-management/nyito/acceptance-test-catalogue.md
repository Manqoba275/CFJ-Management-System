# Acceptance criteria and test catalogue

**Test execution status:** Not executed or independently verified as part of this documentation package. These are proposed tests, not pass results.

| Test ID | Scenario | Expected result | Actual result | Status |
|---|---|---|---|---|
| T-AUTH-01 | Member registration and sign-in | Unverified or invalid session rejected | Awaiting execution evidence | Not verified |
| T-INT-01 | Member profile and settings | Same member update visible across clients | Awaiting execution evidence | Not verified |
| T-BOOK-01 | Class booking and cancellation | Last-seat concurrency creates one booking only | Awaiting execution evidence | Not verified |
| T-ATT-01 | Attendance records | Only correct member can see their attendance | Awaiting execution evidence | Not verified |
| T-PAY-01 | Simulated payment history | No real charge; member sees only own payments | Awaiting execution evidence | Not verified |
| T-TRAIN-01 | Trainer requests | Request remains pending until authorised decision | Awaiting execution evidence | Not verified |
| T-FRIEND-01 | Friend connections | Private fields hidden; only recipient accepts | Awaiting execution evidence | Not verified |
| T-GUIDE-01 | Exercise guide entitlement | Unpaid or expired membership cannot access restricted guides | Awaiting execution evidence | Not verified |
| T-ROLE-01 | Admin reports and staff permissions | Staff/member denied admin report | Awaiting execution evidence | Not verified |
| T-EVENT-01 | Public marathon registration | Non-member may register; duplicates/capacity rejected | Awaiting execution evidence | Not verified |
| T-DB-01 | Oracle shared database | Required tables and constraints verified by executed SQL | Awaiting execution evidence | Not verified |
| T-PHONE-01 | Real-phone and cross-client acceptance | Real device tests with actual results and version evidence | Awaiting execution evidence | Not verified |
| T-PM-01 | WIL task and contribution evidence | Reviewed traceable links and genuine meeting evidence | Awaiting execution evidence | Not verified |

For each executed test, attach environment, build/commit, tester, date, actual outcome and raw log/screenshot.

## Relationship to existing checks

T-* identifiers describe feature-level proposals; AC-* identifiers in acceptance-checklist.csv provide additional step-based procedures. Neither catalogue asserts new execution. Saved team results remain in evidence-index.csv and must not be copied into these test rows as independent Nyito passes.
