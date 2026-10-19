# Public website review and school-project scope

Reviewed 13 October 2026. Manqoba confirmed this is a school project; CFJ has not agreed to replace Octiv or integrate its private systems.

## Evidence

- https://cfjlifestylefitness.co.za/ : CrossFit, HYROX, Concept Cardio, personal training, nutrition coaching and a 20-minute introductory conversation.
- https://cfjlifestylefitness.co.za/timetable/ : advance bookings through Octiv; weekly 3/4/unlimited sessions, R300 drop-ins and 10/15/20-session concessions with 6/9/12-month validity.
- https://cfjlifestylefitness.co.za/contact-us/ : Bedfordview address and public contact number.

The public website does not establish CFJ's private database, identity-verification process or which Octiv administration features it enables. Do not claim the gym has no digital system.

## Implemented presentation changes

The public homepage introduces actual programme categories, membership options and the introductory journey. It no longer shows member counts, payment totals or revenue. Operational totals remain in the admin demo. Public navigation and footer explain the school scope, fictional data and local storage. External links clearly identify CFJ's real website.

Browser role redirects are demo navigation only, not server-side security. The hosted demo contains synthetic data and must never be used for real records. The separate API performs its own role checks.

## Remaining integration work

1. Provision an educational Oracle database and implement migrations and synthetic seed data.
2. Configure an educational identity project; implement email verification, password recovery and Google SSO. Verify tokens and roles on the API, not in browser storage.
3. Host the API over HTTPS and migrate both clients onto it. Prove website-to-phone data consistency with a real-device demonstration.
4. Confirm school-project assumptions for calendar weeks, cancellation cutoffs, refunds and concession validity boundaries; public marketing text does not specify these details.
5. Keep Octiv out of the implementation unless a separate authorized integration is agreed. No real customer migration or payments are part of this demo.
