# Database design handover

## Deliverables on this branch
- Website and Kotlin fitness-class response models and shared contract.
- Proposed Oracle migration covering identity mapping, member preferences, trainers, classes, bookings, attendance, simulated payments, exercise catalogue, friend connections, trainer requests/reviews, marathon events and registrations.
- Constraint and seed-count verification queries.
- Booking capacity transaction design and concurrency-test acceptance criteria.
- Reporting queries, API contract, operations notes and schema review.

## Verification status
The SQL scripts and design documents are prepared but have not been executed against Oracle in this environment. Do not report seed counts, constraint behavior, concurrency, backup restore or live API operation as verified until actually tested and recorded. Website/Android starter checks are separate from database verification.

## Before merge
1. Review the migration and requirements with the team.
2. Apply it in a disposable Oracle development schema.
3. Run seed scripts and confirm each table count.
4. Run positive and negative constraint tests.
5. Implement and run concurrent booking and rollback tests in the backend integration environment.
6. Confirm API/database naming with the backend owner.
7. Record real outputs and reviewer feedback; resolve blockers before production.
8. Keep credentials and private member data out of commits.

## Outstanding decisions
- No Oracle instance or shared API is configured by this work.
- Booking reactivation, canonical friendship-pair uniqueness, payment event history and review eligibility require team/product decisions.
- This is a design handover, not evidence of deployment.
