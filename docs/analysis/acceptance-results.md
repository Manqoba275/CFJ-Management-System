# Business acceptance results and requirement gaps — 11 October 2026

Nyito's Day 12 deliverable from the supplied two-week plan. Checks were performed on 11 October 2026 against source commit `cea9f56b565dfac4b28be5775c4a4e0163781b7a`, using Node.js v24.19.0 in the Linux cloud environment. AI assistance was used for analysis, execution and documentation. All data exercised by the tests is synthetic; no stakeholder acceptance, physical-phone execution or historical participation is claimed.

## Actual checks

| Check | Result | Evidence and practical scope |
|---|---|---|
| Repository test suite | Passed: 33 tests; 0 failed, skipped, cancelled or todo | [Raw TAP output](evidence/2026-10-11/repository-tests.tap). Tests exercise the local preview server, booking policy, browser-state normalization and synthetic profile API. |
| Combined starter check | Passed: 34 tests; 0 failed, skipped, cancelled or todo | [Runner output](evidence/2026-10-11/starter-check.txt). Preview policy/model/packet checks; teammates' packs assembled only in an ignored temporary directory. |
| Actual website static check | Passed: 11 HTML pages and app.js syntax | `node scripts/check-website.mjs`; local links/assets exist. This is not runtime acceptance. |
| Combined starter static check | Passed: 12 preview HTML pages and app.js syntax | Included in starter output; disposable preview differs from the actual application. |

Reproduction from repository root:

```sh
node --test --test-reporter=tap scripts/serve-website.test.mjs scripts/booking-eligibility.test.mjs scripts/test-state.mjs backend/profile-server.test.mjs
node scripts/prepare-team-code-check.mjs
node scripts/check-website.mjs
```

The suites overlap on policy tests; do not add their counts and describe them as 67 distinct acceptance scenarios. No test failure was observed in these executed suites. Android Gradle, browser end-to-end, physical-phone and production service checks were not executed today.

## Scenario-level disposition

Status **blocked** means the complete acceptance scenario cannot currently be demonstrated with the selected checkout and available prerequisites. A passing subset is stated separately and does not make the full scenario passed. IDs refer to acceptance-scenarios.md; supporting IDs refer to the linked analysis specifications.

| Scenario | Full acceptance status | Observed evidence / missing requirement |
|---|---|---|
| ROLE-01: public marathon | Blocked | Public prototype exists, but persistent event registration, capacity/closing rules and protected roster API are not implemented in the development profile service. EVENT-01–06 unrun. |
| ROLE-02: guest restrictions | Blocked | BOOK-03 sign-in-required preview case passes. Synthetic profile API rejects missing/incorrect token with 401. Actual booking/report/manual API authorization is unrun. |
| ROLE-03: email/Google identity | Blocked | Development token is not hosted identity or Google SSO. Cross-client identity and sign-out/private-cache acceptance unrun. |
| ROLE-04: profile/settings | Blocked | Real HTTP test verifies profile GET/PATCH, invalid input rejection, competing writes yielding one 200 and one 409, refreshed update and restart persistence. It uses one synthetic member with JSON storage. Two-member ownership, Oracle persistence and web/physical-Android synchronization unrun. |
| ROLE-05: booking/cancellation | Blocked | Seven BOOK preview examples and policy boundary checks pass. No real reservation is created; final-seat transactions, cancellation and cross-client booking remain unrun. |
| ROLE-06: attendance/payments/manuals | Blocked | No server attendance/payment/manual service in the development profile endpoint. ATT-01–06 and PAY-01–07 connected checks unrun. Browser simulations cannot establish server entitlement. |
| ROLE-07: trainers/friends/exercises | Blocked | TRAIN, FRIEND and EXERCISE server eligibility, consent, persistence and privacy criteria unrun. Local UI behavior is not shared-service acceptance. |
| ROLE-08: staff operations | Blocked | Staff authorization, audit corrections, idempotency and report rejection require implemented role-aware endpoints. Connected staff scenarios unrun. |
| ROLE-09: admin reports/staff | Blocked | Accurate persisted report fixtures, role restrictions and staff revocation unrun. The prototype's client controls do not prove API authorization. |
| ROLE-10: error/retry/cross-client | Blocked | Browser-state tests verify recovery from damaged local data. Profile API tests verify conflicts and restart persistence. Full offline/loading/retry UI and physical-phone cross-client checks unrun. |

## Requirement gaps and next verification

| Gap | Required next action / exit evidence | Proposed responsibility; not a new assignment |
|---|---|---|
| G-01: hosted identity and server roles | Configure shared identity; verify valid/expired tokens and direct forbidden calls for all roles. | API/identity lead |
| G-02: authoritative business storage | Implement versioned Oracle migrations, synthetic seeds and transaction/constraint tests. | Database + API leads |
| G-03: real booking and cancellation | Implement API capacity/idempotency; run simultaneous final-seat and retry/cancellation checks. | API/integration leads |
| G-04: cross-client profile workflow | Connect website to the shared profile service; replace synthetic adapter; execute same-account edits in both directions on a physical phone. | Web/Android integration leads |
| G-05: attendance, payments and guides | Implement audited role-aware operations and server-side entitlement; execute ATT/PAY/EXERCISE criteria. | API + client leads |
| G-06: social and public events | Implement approved consent/eligibility/registration rules; execute TRAIN/FRIEND/EVENT positive and forbidden flows. | API + client leads |
| G-07: reporting and revocation | Agree metric definitions; independently calculate fixtures and verify report permissions and revoked staff. | Business review + API leads |
| G-08: unresolved business decisions | Obtain actual decisions for DEC-01–14 and record date, decision-maker and evidence. | Nyito + stakeholders |
| G-09: Android/device evidence | Run pinned Gradle tests/build and physical-phone flows; preserve actual counts, artifacts and recording links. | Android lead + testers |

These are documented implementation/evidence gaps, not newly reproduced application defects. No production-readiness or client sign-off is asserted. No secret values, private member records or fabricated meeting/review links are included.

## Contribution and review

Branch: `nyito/acceptance-results-2026-10-11`, based on the completed 10 October analysis. Today's change is the Day 12 results document and captured test evidence only; application code and teammate files are unchanged.

Review/PR entry point: https://github.com/Manqoba275/CFJ-Management-System/compare/main...nyito/acceptance-results-2026-10-11

Reviewer and stakeholder sign-off: pending; no PR or approval observed in this session. Days 13–14 (rubric traceability and final handover) remain scheduled after today's requested work. Re-execute affected acceptance scenarios when their prerequisites are implemented and keep blocked, unrun, failed and passed results distinct.
