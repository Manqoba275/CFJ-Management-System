# Narrated CFJ demonstration plan

**Status:** Draft outline only - no recording has been made.  
**Build requirement:** use the exact integrated build that will be demonstrated; record its commit/build and the physical phone model/Android version.  
**Narrators:** to confirm with the team. Nonhlanhla can introduce the test scope and results; the technical/API/database explanation needs review and an agreed speaker (Manqoba/Tshifhiwa as appropriate).

## Before recording

- Confirm the approved requirements and demonstration build with Nyito and Manqoba.
- Use a physical Android phone for app evidence. A browser resized to phone width is website responsive evidence only.
- Prepare separate browser demo data and synthetic app/API data. Do not show real personal information, passwords, device serials, API tokens or database secrets.
- Rehearse each action and speaker handoff. Keep status/error messages visible long enough to read.
- Verify screenshots and logs against the evidence index. Keep the original failure and its retest linked if demonstrating a fix.
- Have Manqoba review technical claims before final upload. Agree the recording destination and access with the team; do not publish raw recordings or secrets to a public repository.

## Suggested narrated sequence

| Segment | Suggested speaker (confirm) | Show / say | Evidence needed | Limitation to state |
|---|---|---|---|---|
| 1. Scope and build | Nonhlanhla | Identify the test-plan version, exact commit/build, date, website URL and Android device/version. Explain the prototype versus integrated scope. | Build/commit reference and evidence-index entry. | Do not imply untested services are live. |
| 2. Website navigation and layout | Nonhlanhla | Navigate Overview, Members, Operations, Library and role-specific pages; show desktop and narrow-width views once browser testing is available. | Readable screenshots linked to WEB cases. | Website-only layout is not physical Android evidence. |
| 3. Website demo flow | Nonhlanhla | Use fictional member data for login, booking/duplicate/cancel and profile/Library behavior, narrating actual observed outcomes. | Actual result rows and matching screenshots/logs. | Local bookings/payments/roles are prototype behavior unless the integrated service proves otherwise. |
| 4. Android app | Nonhlanhla or assigned presenter | On the physical phone, show Home, Classes and Settings, preference validation/save/reopen and external timetable behavior. | Phone screenshots linked to Android cases; device and build recorded. | The current Classes screen is a preview and has no live booking until wired to the service. |
| 5. Shared profile/service flow | Manqoba or assigned technical presenter | Only when hosted integration is ready: demonstrate same synthetic account/profile across website and phone and show the matching service/database evidence. | Website result, phone result and approved API/Oracle evidence tied to one test ID. | A local dev profile API is not hosted authentication or Oracle persistence. |
| 6. Results, defects and close | Nonhlanhla | Summarize passes, failures, blocked/not-run tests, open defects and retests; point to the reviewed PR and evidence index. | Current result summary and PR/commit links. | State remaining blockers and do not claim a release-ready system unless exit criteria are met. |

## Capture checklist

- [ ] Agree the audience, destination, access and speakers.
- [ ] Rehearse the website and phone actions on the exact build.
- [ ] Record clear voice-over explaining the actions and outcomes; silent screen capture alone is insufficient.
- [ ] Keep sensitive values out of the frame and narration.
- [ ] Check audio, screen readability, edits and captions before sharing.
- [ ] Ask the technical reviewer to verify API/database statements.
- [ ] Add the final recording link and its limitations to `evidence-index.csv`.

No speaker, recording date, hosted endpoint or final destination is assumed by this plan.
