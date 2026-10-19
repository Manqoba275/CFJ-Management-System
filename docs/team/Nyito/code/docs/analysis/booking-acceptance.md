# Booking acceptance rules

These are proposed examples for review, not proof of client approval or passing acceptance tests.

The website and Android examples share IDs BOOK-01 through BOOK-07. Nonhlanhla's tests apply these examples to Manqoba's preview policy. READY means a request may be sent, not that a booking succeeded. The eventual API must recheck permissions and availability.

Decision priority: reject invalid capacity first; require an online connection; require sign-in; reject duplicate bookings; reject a full class; otherwise allow a request. Waiting-list behavior requires a separate explicit flow.

Further acceptance checks for the eventual connected system:

- Two requests for the final seat: only one server confirmation succeeds.
- Repeating the same request after a network timeout does not create a second booking.
- A confirmed website booking appears on Android after refresh.
- A cancelled booking releases capacity once and is reflected on both clients.
- A member cannot read another member's private booking or profile records.

Review each scenario against the requirements. Record any agreed changes, reviewer, actual result and evidence link separately. Do not label these integration scenarios passed using only the preview-policy tests.
