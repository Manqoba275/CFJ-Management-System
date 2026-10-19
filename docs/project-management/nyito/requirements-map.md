# WIL Task 2 requirements map

Prepared 19 October 2026 from the supplied WIL TASK.pdf. Page references use printed page numbers. This is an AI-assisted coordination draft for Nyito and team review, not proof of implementation, participation or client acceptance. Owners are proposed from team roles and must be confirmed. Empty dates are intentional. “Not started” in the tracker means the evidence-verification task has not started; it does not assert that implementation is absent.

| Requirement | Source page | Deliverable / task | Proposed owner | Test/review | Evidence / status |
|---|---|---|---|---|---|
| REQ-01: Working Android prototype on physical phone | 11, 16 | APP-PHONE | Manqoba | QA-PHONE | Blocked; EV-ANDROID-01; acceptance pending |
| REQ-02: Updated website | 11, 16 | WEB-UPDATE | Manqoba | QA-WEB | Review; EV-INT-01; acceptance pending |
| REQ-03: Registration, sign-in and password protection | 16 | AUTH-LOGIN | Manqoba | QA-AUTH | Blocked; Evidence pending; acceptance pending |
| REQ-04: Single sign-on | 16 | AUTH-SSO | Manqoba | QA-SSO | Blocked; Evidence pending; acceptance pending |
| REQ-05: User settings | 16 | APP-SETTINGS | Manqoba | QA-SETTINGS | Review; EV-ANDROID-01; EV-HELP-01; acceptance pending |
| REQ-06: API creation and Android integration | 16; rubric 36–37 | API-INTEGRATION | Manqoba | QA-API | In progress; EV-INT-01; EV-ANDROID-01; acceptance pending |
| REQ-07: Database design | 11, 16; rubric 37 | DB-DESIGN | Tshifhiwa | QA-SCHEMA | Review; EV-DB-01; acceptance pending |
| REQ-08: At least ten records per database table | 11, 16 | DB-SEED | Tshifhiwa | QA-SEED | Review; EV-DB-01; acceptance pending |
| REQ-09: System verification and automated tests/build | 13, 16 | QA-AUTOMATION | Nonhlanhla | QA-CI | Review; EV-TEST-01; EV-ANDROID-01; acceptance pending |
| REQ-10: UI and invalid-input handling | 16; rubric 37 | QA-INPUT | Nonhlanhla | QA-INVALID | In progress; EV-TEST-01; acceptance pending |
| REQ-11: Help and user documentation | 11, 16; rubric 38 | DOC-HELP | Nyito | QA-HELP | Review; EV-HELP-01; acceptance pending |
| REQ-12: Ongoing DevOps lifecycle and board updates | 11, 13, 16 | PM-BOARD | Nyito | REVIEW-BOARD | Blocked; EV-REVIEW-01; acceptance pending |
| REQ-13: Regular meetings and individual accountability | 16 | PM-MEETINGS | Nyito | REVIEW-MEETINGS | Blocked; Evidence pending; acceptance pending |
| REQ-14: Professional narrated demonstration | 16; rubric 38 | DEMO-VIDEO | Manqoba | QA-VIDEO | Blocked; Evidence pending; acceptance pending |
| REQ-15: Task 2 document and GitHub submission | 17; rubric 35, 38 | PM-SUBMISSION | Nyito | REVIEW-SUBMISSION | In progress; Evidence pending; acceptance pending |
| REQ-16: Apply lecturer feedback | 16 | FEEDBACK-REVIEW | Nyito | REVIEW-FEEDBACK | Blocked; Evidence pending; acceptance pending |

## Assessment boundaries and clarification

- The manual requires regular meetings (p.16) and weekly collaborative attendance (p.6). Three meetings weekly of approximately two hours, recordings and participation records come from the separate lecturer announcement cited in Nyito’s guide; that announcement has not been independently supplied/verified here.
- Page 11 describes a prototype with some functionality; page 16 and the rubric require working features. Seek lecturer clarification rather than omitting detailed requirements.
- Page 13 calls for Azure DevOps Kanban, automated testing and deployment where possible; page 16 specifically calls for GitHub Actions tests/build. Record evidence for the applicable workflow, not just a workflow file.
- The manual says protect/encrypt passwords. Have the technical owner document the authentication service and secure password-storage approach; do not put passwords in evidence.
- Task 3 additionally requires the consolidated report, authenticity declaration, feedback, peer/self-evaluations, README and release notes, narrated video link, Kotlin source, publication preparation and presentation participation (pp.17–18). Keep these separate from Task 2 completion.
- Final submission timing/arrangement differs between pp.11,14,17. Confirm exact ARC deadline and individual/group submission instructions.
- Oracle, exact folder names and this CSV format are project choices, not prescribed assessment requirements.

## Acceptance review

Use the observable criteria in progress-tracker.csv. With Nonhlanhla, record actual test inputs, expected/actual outcomes, build/environment and evidence. Never infer a pass from source presence. Existing BOOK-01–BOOK-07 examples describe booking policy, not successful API, concurrency or cross-device integration tests.

## Evidence review on 19 October

See [evidence-review.md](evidence-review.md) for inspected source records and limitations. Tracker states now distinguish Review, In progress and Blocked from untouched verification tasks. Saved logs are attributed to their original work sessions; they are not new executions by Nyito. No implementation requirement is marked Done.

## Evidence review on 19 October

See [evidence-review.md](evidence-review.md) for inspected source records and limitations. Tracker states now distinguish Review, In progress and Blocked from untouched verification tasks. Saved logs are attributed to their original work sessions; they are not new executions by Nyito. No implementation requirement is marked Done.
