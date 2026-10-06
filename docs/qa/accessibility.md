# Week-one class-card accessibility review

**Review date:** 6 October 2026
**Scope:** the CFJ website class-card preview and reusable Android class-card component.

The plan schedules this work from 30 September to 6 October. The source changes and checks recorded here were carried out on 6 October; they are not backdated as daily activity.

## Checks and findings

- Website controls are native links, a labelled selector, and a button. The button and selector have a 48px minimum height; the focus-visible state provides a 3px high-contrast outline.
- The preview declares a viewport and constrains the page to 700px with flexible content. The selector is capped at the available width.
- The class-card status is now a polite, atomic live region. The ready/full behavior, request label, and one-space wording have a regression test.
- Android class cards use a full-width, wrap-height vertical layout; text sizes use sp, the action target has a 52dp minimum height, the class title is marked as a heading, and booking status uses a polite live region.
- Contrast ratios calculated from the actual theme values:

| Foreground on background | Ratio |
|---|---:|
| #F8F4EF on #0D1014 | 17.41:1 |
| #F8F4EF on #1C2229 | 14.64:1 |
| #55D6AD on #0D1014 | 10.54:1 |
| #55D6AD on #1C2229 | 8.86:1 |
| #0D1014 on #FF684E | 6.67:1 |
| #FFFFFF on #56606B | 6.40:1 |
| #BFC7CD on #1C2229 | 9.36:1 |

All listed pairs exceed the WCAG AA 4.5:1 threshold for normal text.

## Verification

- node --test scripts/booking-packet.test.mjs: 10 passed, 0 failed.
- node scripts/check-website.mjs: local links/assets validated in 12 pages; app.js syntax passed.
- From mobile-app with Android Studio JDK 21 and SDK 36: gradlew.bat --offline testDebugUnitTest assembleDebug succeeded; 17 Android unit tests passed, 0 failures/errors, and the debug APK was assembled.
- The Android and combined booking checks used a temporary local copy of the Tshifhiwa and Nyito dependency packs. Those packs remain under docs/team and were not included in this member branch. Their owners' source changes must be merged into the application tree before the new tests can pass in standalone CI.

## Not verified manually

Browser keyboard navigation, a rendered 320px screenshot, screen-reader announcements, and physical-phone accessibility were not confirmed. The local preview server started, but this environment could not connect to its loopback address, so no manual browser result is claimed. The reusable Android card is not wired into the Classes screen; the team integration guide assigns that step to the integrator.
