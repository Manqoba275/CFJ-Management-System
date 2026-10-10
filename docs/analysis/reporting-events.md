# Management reporting and public marathon requirements

Day 10 deliverable, prepared 10 October 2026 with AI assistance. Proposed criteria for stakeholder review; no report approval, real event or connected execution is asserted.

| ID | Given / When / Then |
|---|---|
| REPORT-01 | Given an authenticated admin, when the agreed period is selected, then reports show member counts, class bookings/cancellations, recorded attendance and simulated payment totals derived from shared persisted records. |
| REPORT-02 | Given a guest, member or staff identity, when an admin report is requested directly, then the API returns 401 for missing/invalid identity or 403 for insufficient role, without returning report data. |
| REPORT-03 | Given known synthetic fixtures, when period/metric filters are applied, then totals match the fixture ledger, duplicate retries are counted once and empty periods return zero/empty results rather than fabricated data. |
| REPORT-04 | Given records at a period boundary, when reports are generated, then the agreed business timezone and inclusive start/exclusive end are applied consistently; currency is labelled ZAR and payment totals explicitly say simulated. |
| REPORT-05 | Given a report view/export if export is approved, when data is returned, then only necessary fields are included; passwords, medical details and private social data are excluded. Export permission and retention require agreement. |
| REPORT-06 | Given a service failure or invalid date range, when the report is requested, then an actionable error appears and stale/partial data is not represented as a fresh complete report. |
| EVENT-01 | Given a published open marathon event and a non-member, when valid agreed registration fields are submitted, then the server confirms a persistent registration without requiring membership or sign-in. |
| EVENT-02 | Given missing/invalid fields, a closed event or exhausted approved capacity, when registration is attempted, then a useful rejection appears and no registration is created. |
| EVENT-03 | Given a timeout or repeated submission, when the same registration is retried, then idempotency/uniqueness rules prevent duplicate entries and any capacity decrement happens once. |
| EVENT-04 | Given a public visitor, when event information is requested, then approved details are visible but participant contact details and the registration roster remain protected. |
| EVENT-05 | Given an authorized event manager, when registration data is accessed, then approved management permissions and audit rules apply; unauthorized direct requests are denied. |
| EVENT-06 | Given a confirmed registration, when acknowledgement is shown, then the registration reference and actual outcome are clear; simulated messages/payments are labelled and no real delivery or charge is claimed. |

## Definitions to agree

Define whether member count is current active members or period registrations; booking and attendance measures; payment statuses included in totals; cancellations/reversals; report freshness and permitted exports. Proposed reporting periods use Africa/Johannesburg and [start, end) boundaries; do not assume approval.

For marathon registration, agree event date/location, public fields, required consent, duplicate identity rule, capacity, closing date, cancellation, minors/guardian handling if applicable, and who manages the roster. Do not use an email address alone as authentication or expose roster details through a public confirmation lookup. No registration fee is assumed.

## Verification fixtures

Create fictional records spanning a period boundary, a cancellation, a retry and a simulated payment correction; independently compute expected totals. Exercise admin success and all other roles' rejection. For public registration test valid non-member entry, invalid input, duplicate/time-out retry, full/closed event and unauthorized roster access. Validate on both clients where the feature is offered. Connected results remain unrun.
