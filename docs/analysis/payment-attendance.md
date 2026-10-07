# Attendance and simulated-payment acceptance criteria

Prepared 7 October 2026 for Day 8. Proposed criteria for review; the connected attendance/payment services are not verified by this document. Only fictional member records are used in tests.

## Attendance

| ID | Given / when | Expected result |
|---|---|---|
| ATT-01 | Authorized staff records a booked member actually attending an active class | One attendance record identifies member, class, timestamp and recording actor; both clients read the same result. |
| ATT-02 | A cancelled booking, unknown member or unknown class is supplied | Reject without recording attendance; walk-in exceptions require an agreed separate policy. |
| ATT-03 | The same attendance submission is retried or two staff submit concurrently | One member/class attendance record; retries do not inflate totals. |
| ATT-04 | A member accesses another member's attendance or tries staff recording | Deny direct API request without disclosing private records. |
| ATT-05 | Staff submits offline or loses the response | No confirmed-success claim; refresh authoritative state before retrying with the same idempotency key. |
| ATT-06 | Authorized correction is requested | Preserve the original audit trail and correction actor/reason; recalculate totals once. Correction permissions need agreement. |

Attendance does not itself create a payment or entitlement. No-show, late-arrival and walk-in handling remain open in decision-log.md.

## Simulated payments and manual access

The system records fictional payment events; no money is moved. Label forms, history and confirmations as simulated. Never collect card numbers, CVVs or real bank credentials.

| ID | Given / when | Expected result |
|---|---|---|
| PAY-01 | Authorized staff/admin records a valid simulated membership payment | Persist member, membership month, amount, method, status, timestamp and actor; display a simulation label. |
| PAY-02 | Member, month or amount is missing/invalid, or amount is negative/non-finite | Reject without changing history or access. Zero/partial-payment policy requires approval. |
| PAY-03 | A successful recording is retried with the same key | Return its original result; no duplicate payment/history entry. |
| PAY-04 | A member requests another member's history or attempts a staff-only recording | Deny at the API; members may read only their own history. |
| PAY-05 | An accepted payment covers the current agreed membership month | Server grants eligible manual access; pending, previous-month or reversed payments do not automatically grant it. |
| PAY-06 | Payment is corrected/reversed, or membership month changes | Re-evaluate access on both clients after refresh; preserve audit and avoid duplicate financial totals. |
| PAY-07 | A simulated confirmation is shown | Clearly state simulation; do not claim email/SMS delivery without an actual transport result. |

## Required boundary and integration checks

Check membership month transitions using the agreed business timezone, leap-year dates, unauthorized direct requests, timeout/retry behavior and duplicate concurrent writes. Record on the website, refresh Android and verify the same authoritative history; reverse the test direction for supported writes. Exercise expired identity and unavailable API states. Paid content must be protected by the server rather than shipped to every browser and hidden with UI controls.

These are future acceptance checks. No API-backed attendance/payment result, stakeholder agreement or physical-phone result is claimed. Traceability is recorded in traceability.md.
