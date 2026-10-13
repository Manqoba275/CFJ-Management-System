# QA summary — 13 October 2026

## Result

The verified automated web, booking, synthetic profile API, and combined prepared-pack checks pass. Manual browser and device testing remains outstanding, so this evidence does not establish release readiness or production behavior.

## Verification completed

- Full Node suite: **33 passed, 0 failed** with temporary files directed to the writable workspace.
- Prepared team-code check: **34 passed, 0 failed**; static website validation passed for 12 HTML pages.
- Synthetic profile API: **3 passed, 0 failed**, including malformed input, authentication, persistence, concurrent stale-write rejection, and reload.
- Android unit/build: **unverified**. Gradle 9.4.1 started with JDK 21, but the run produced no task result before being stopped.
- Manual browser, screen-reader, emulator, and physical-phone checks: **not completed**.

## Open defects and limits

1. Profile editing accepts an empty name in the local prototype.
2. Website roles and member-service actions use browser-local demo state; no production server authorization or shared persistence is established.
3. The reusable Android class card is not connected to the Classes screen.
4. Android-to-API and two-client device synchronization were not demonstrated; only the synthetic API service tests passed.
5. Labelled runtime screenshots were not captured because the local browser could not attach and no device UI was available.

See [the regression checklist](regression.md), [cross-device checks](cross-device.md), and [demo script](demo-script.md) for the detailed evidence and follow-up steps.
