# Shared booking eligibility review

Friday task: 2 October 2026. Owner: Manqoba, Lead Software Developer.

This review covers the website and Android eligibility modules introduced for Wednesday and Thursday. It does not implement a reservation or connect the clients to the server.

## Agreed starter decision order

1. Reject invalid capacity.
2. Reject an offline request.
3. Require sign-in.
4. Reject an existing booking, even when the class is full.
5. Reject a class with zero spaces.
6. Otherwise return READY, meaning the client may request a booking from the server.

The web module also rejects unknown booking state and non-integer/unsafe capacity. Kotlin accepts typed Boolean and Int inputs; future API parsing must validate untrusted JSON before calling it. These input representations differ, but valid shared inputs must produce identical results.

## Repeatable verification

Both test suites read `mobile-app/app/src/test/resources/booking-eligibility.tsv`. Its 24 explicit expected results cover every combination of online, signed-in and already-booked status for negative, zero and available capacity. Expected decisions are fixed in the fixture rather than generated from either implementation.

- `npm test`: shared website contract, malformed web inputs and preview server regression checks.
- `npm run check`: website source and local asset references.
- From `mobile-app`, `./gradlew.bat testDebugUnitTest assembleDebug`: shared Android contract, existing rules/preferences tests and debug APK.
- GitHub additionally runs `lintDebug` on Linux.

GitHub's website workflow now runs the booking contract on every push and pull request. Android's existing workflow runs its shared test whenever Android files change, including this fixture.

## Remaining integration work

READY is not a booking confirmation. The API must authenticate the member and atomically check duplicate bookings and remaining capacity before storing a reservation. Concurrent last-place requests, expired sessions, cancellations, UI integration and physical-device behaviour remain unverified. This review does not mark another member's assigned tasks complete.
