# Member services acceptance criteria

Day 9 deliverable, prepared 10 October 2026 with AI assistance. These proposed business criteria require review. They describe target shared web/Android behavior; they do not certify the local prototype or a live implementation.

| ID | Given / When / Then |
|---|---|
| TRAIN-01 | Given a signed-in member, when the trainer directory loads, then approved public trainer names, specialisations, availability and ratings are shown consistently on both clients; loading, empty and retry states are clear. |
| TRAIN-02 | Given a valid trainer and eligible member, when a request is confirmed by the API, then one persistent request appears on both clients; a timeout retry with the same idempotency key does not duplicate it. |
| TRAIN-03 | Given an invalid/inactive trainer, guest or another member's identity, when a request is submitted directly, then it fails without creating a record or exposing private details. |
| TRAIN-04 | Given an eligible reviewer, when a valid review is submitted, then its allowed rating/text persists and the aggregate updates; invalid ratings, duplicate reviews and ineligible reviewers are rejected under the agreed policy. |
| FRIEND-01 | Given member discovery, when results are returned, then only opt-in/approved public fields are shown; medical details, passwords, contact details and private measurements are excluded by default. |
| FRIEND-02 | Given two eligible distinct members, when a connection request is sent, then it persists with a visible pending state; self-requests, duplicate requests and retries do not create additional connections. |
| FRIEND-03 | Given a pending request, when its recipient accepts or declines, then both clients show the resulting state; another member cannot act on it. Withdrawal/disconnection must follow an agreed policy. |
| FRIEND-04 | Given an offline client or rejected request, when a social action is attempted, then no successful connection is claimed before server confirmation and a useful retry/error state is shown. |
| EXERCISE-01 | Given an eligible paid member and selected goal, when a manual opens, then the server returns the permitted guide, safe instructions and the agreed goal/body-area filters; both clients show equivalent content. |
| EXERCISE-02 | Given an unpaid member, guest or expired entitlement, when protected exercise content is requested directly, then access is denied even if the client hides its controls. |
| EXERCISE-03 | Given missing content or an unavailable service, when a guide loads, then an empty/retry state appears; images have meaningful alternatives and instructions remain readable. |

## Use cases and boundaries

Members browse trainers, submit requests, discover consenting members, manage their own connections and use eligible exercise guides. Staff/admin permissions must be defined explicitly; possessing a role must not confer access to private social records automatically. No client-only rating or payment check authorizes server actions. Use synthetic records for verification.

Open decisions: trainer request eligibility/capacity and cancellation; review eligibility, rating range and moderation; discovery consent and searchable fields; friend acceptance/blocking/disconnection; exercise content ownership and medical guidance wording. Recommended pending defaults: explicit connection consent, no self/duplicate requests, rating range 1–5 and server entitlement checks. These defaults are proposals, not client approval.

Verify happy paths, direct unauthorized requests, invalid inputs, duplicate/time-out retries, cross-client refresh and offline states. Record real results against each ID after implementation; no connected scenario was executed for this document.
