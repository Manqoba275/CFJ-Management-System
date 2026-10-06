# Week-one contribution evidence

**Planned period:** 30 September–6 October 2026
**Work performed:** 6 October 2026, completing the planned first-week scope as a catch-up. This record does not claim work on earlier dates.
**Branch:** work/nonhlanhla-first-task
**Scope:** website class-card preview, reusable Android class-card UI, booking behavior tests, accessibility review, and defect log.

## Completed work

- Added the website preview page and reusable card module. Updated the changing status to announce itself to assistive technology.
- Added the Android class-card view, localized strings, and singular/plural availability formatting.
- Added shared booking behavior tests and UI semantics checks.
- Recorded code-level responsive/accessibility checks and reproducible issues in docs/qa.

## Checks run

- node --test scripts/booking-packet.test.mjs — 10 passed, 0 failed.
- node scripts/check-website.mjs — 12 pages and app.js passed.
- In mobile-app, with Android Studio JDK 21 and Android SDK 36: gradlew.bat --offline testDebugUnitTest assembleDebug — build successful; 17 Android unit tests passed; debug APK assembled.
- Git whitespace check — passed for the staged contribution files.

The Android and booking checks used temporary local copies of the Tshifhiwa and Nyito prepared dependency packs. They remain under docs/team and were not committed here to preserve each member's scoped contribution. Standalone CI needs those files merged by their owners.

## Pending verification and review

- Browser keyboard operation, a rendered small-viewport screenshot, screen-reader behavior, and physical-phone behavior remain unverified; see docs/qa/accessibility.md.
- The team integration guide assigns wiring the reusable Android component into the Classes screen to the integrator.
- Reviewer: pending.
- Pull request: not opened; this request was to push the branch.
- Earlier commits: [website preview](https://github.com/Manqoba275/CFJ-Management-System/commit/33fea1cb826245378ea0324572964656a4cee6c0), [Android card](https://github.com/Manqoba275/CFJ-Management-System/commit/2c59cacfe7fa39ed4b1f325193b1b6d430520520), [booking tests](https://github.com/Manqoba275/CFJ-Management-System/commit/1b3fb29afcd3cebe944120d9c3202d77c903f598).
