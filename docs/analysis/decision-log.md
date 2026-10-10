# Stakeholder questions and decision log

Prepared 7 October 2026 for Day 7. No stakeholder meeting, approval or teammate review was observed during this work. Proposed defaults are recommendations; all stakeholder questions below remain open.

| ID | Question | Proposed default / existing requirement | Status | Impact |
|---|---|---|---|---|
| DEC-01 | How late can a member cancel? | Before class start; exact cutoff to be agreed. | Open | Cancellation eligibility and UI wording. |
| DEC-02 | Do late cancellation or no-show rules affect payment/access? | No automatic fee or penalty without approval. | Open | Payment and attendance policy. |
| DEC-03 | Is a waitlist required in this delivery? | Full classes reject requests; separate explicit opt-in flow if approved. | Open | Booking scope and capacity transactions. |
| DEC-04 | What determines a valid attendance entry? | Authorized staff verifies a member's booking and actual presence; correction policy to be agreed. | Open | Attendance permissions and audit trail. |
| DEC-05 | Are walk-ins or retrospective attendance allowed? | No inferred permission; confirm staff exception workflow. | Open | Data validation and reporting. |
| DEC-06 | Which payment states grant monthly manual access? | Accepted simulated payment for the current membership month; no real charge. | Open | Eligibility and reversal handling. |
| DEC-07 | Are partial payments, refunds or backdated entries allowed? | No automatic entitlement from partial/pending/reversed entries. | Open | Amount rules and staff corrections. |
| DEC-08 | Which timezone defines classes and membership periods? | Africa/Johannesburg, subject to client approval; server computes boundaries. | Open | Month-end and class cutoff tests. |
| DEC-09 | Which staff may correct records and what audit retention is needed? | Authorized staff only; preserve actor, time and reason. | Open | Privacy and accountability. |

## Additional questions recorded 10 October

| ID | Question | Proposed default | Status |
|---|---|---|---|
| DEC-10 | Who can request/review trainers and moderate reviews? | Eligible authenticated members; 1–5 rating; exact eligibility/moderation to agree. | Open |
| DEC-11 | Which discovery fields and connection controls are permitted? | Explicit consent; minimal public fields; no self/duplicate requests. | Open |
| DEC-12 | Who owns exercise content and which eligibility rules apply? | Approved guides with server-side monthly entitlement. | Open |
| DEC-13 | What metrics, statuses, periods and exports should admin reports include? | Shared records, ZAR simulation labels and agreed business-time boundaries; minimal private fields. | Open |
| DEC-14 | What marathon fields, consent, capacity, closing/cancellation and roster permissions apply? | Non-member registration allowed; no fee assumed; roster protected. | Open |

## Documented constraints

The existing implementation plan requires a shared API, server-side identity/role verification, Oracle transaction rules and consistent web/Android data. The requirements explicitly describe simulated payments and messages. These are repository requirements, not new stakeholder sign-off.

When a real decision is made, append its actual date, decision-maker, agreed wording, affected scenario IDs and evidence link. Do not convert an open item into an agreed decision merely because a deadline has passed.
