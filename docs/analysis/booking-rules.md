# Booking capacity, cancellation and waitlist rules

Prepared 7 October 2026 for Nyito's Day 5 deliverable. Proposed business criteria; stakeholder approval and connected-system verification remain pending.

## Booking and capacity

An authenticated member may request a future, active class with an available seat. The server derives the member identity from verified authentication, rejects duplicates, and reserves capacity in one transaction. Client READY only enables a request; it does not confirm a seat. Only a successful server response displays a confirmed booking.

| ID | Given / when | Required result |
|---|---|---|
| CAP-01 | Two eligible members request the final seat concurrently | One confirmation; the other receives a capacity conflict; capacity never becomes negative. |
| CAP-02 | A confirmed member requests the same class again | No second active booking and no extra capacity reduction. |
| CAP-03 | A request times out and is retried with the same idempotency key | The original result is returned; capacity changes once. |
| CAP-04 | Class capacity is invalid or eligibility is unknown | Reject the request; refresh authoritative state. |
| CAP-05 | A member supplies another member's identifier | The server uses authenticated identity and denies unauthorized access. |

## Cancellation

Proposed default: members can cancel their own upcoming bookings before the class starts; the precise cutoff requires stakeholder agreement. Do not assume a refund or cancellation fee.

| ID | Given / when | Required result |
|---|---|---|
| CAN-01 | Owner cancels an active booking within the agreed window | Booking becomes cancelled; one seat is released in the same transaction. |
| CAN-02 | Cancellation is retried | Return the existing cancellation result; release no additional seat. |
| CAN-03 | Another member tries to cancel the booking | Deny without mutation. |
| CAN-04 | Member cancels offline or response is lost | Show pending/unknown outcome; confirm from server before claiming cancellation. |
| CAN-05 | Booking is cancelled on one client | The other client shows cancellation and updated availability after refresh. |
| CAN-06 | Class has started or attendance is already recorded | Reject member cancellation under the proposed default; staff correction policy needs approval. |

## Waitlist decision

Waitlisting is not approved or implemented. A full class must show FULL and must not silently create a booking or waiting-list entry. Proposed later flow requires explicit opt-in, unique active entries, a documented ordering rule, an expiring seat offer and transactional acceptance. Automatic charging or automatic confirmation is excluded until explicitly agreed.

Open decisions: cancellation cutoff, late-cancellation handling, class rescheduling, refund handling, waitlist priority and offer duration. See decision-log.md. These scenarios have not been executed against a live booking API.
