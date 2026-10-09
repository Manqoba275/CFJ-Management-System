# Booking and cancellation test cases

**Prepared:** 9 October 2026
**Scope:** the website's local class booking preview and the shared booking eligibility rule. These cases do not validate a server-side reservation service.

## Cases

| ID | Scenario | Steps | Expected result | Evidence/status |
|---|---|---|---|---|
| BOOK-01 | Available class | Sign in as a member; request a class with spaces remaining. | One booking appears for that member and class; displayed capacity decreases once. | Eligibility rule covered by automated tests. Website interaction not run in this environment. |
| BOOK-02 | Guest request | Open Operations while logged out; request a class. | No booking is added; prompt the visitor to sign in as a member. | Source path reviewed; browser interaction not run. |
| BOOK-03 | Full class | Request a class with zero spaces. | A waitlist entry is created; capacity stays at zero. | Source path reviewed; automated flow test not present. |
| BOOK-04 | Duplicate request | Request the same class twice as one member. | The second request is rejected and no second booking is added. | Duplicate eligibility and starter rule tests pass; website interaction not run. |
| BOOK-05 | Offline, signed-in member | Select Offline in the class-card preview and try the action. | Request action is disabled; no reservation is reported. | Covered by eligibility and card component tests. |
| BOOK-06 | Cancel own confirmed booking | Cancel a `Booked` entry from Your Bookings. | Entry is removed and one space is restored. | Source path reviewed; cancellation has no automated test in this branch. |
| BOOK-07 | Cancel own waitlist entry | Cancel a `Waitlist` entry. | Entry is removed and class capacity is unchanged. | Source path reviewed; cancellation has no automated test in this branch. |
| BOOK-08 | Unknown/removed class | Render a booking whose class record was removed, then cancel it. | The row remains understandable and cancellation does not crash. | Source path reviewed; no automated test. |
| BOOK-09 | Malformed capacity or class response | Supply a negative, fractional, nonnumeric, or incomplete value to the shared policy/model. | Input is rejected as invalid; no booking is enabled. | Covered by Node starter tests when the prepared dependency pack is assembled. |

## Execution record

On 9 October, `scripts/prepare-team-code-check.mjs` assembled a disposable checkout from tracked source and the four prepared team packs. The booking eligibility, model, class-card, and malformed-input tests passed there. `node scripts/check-website.mjs` also passed. A direct run from the member branch fails before tests load because the teammate-owned `website/modules/fitness-class.mjs` and booking examples are intentionally not installed in the application tree.

The website's booking and cancellation handlers currently update local demo state. The behavior is not evidence of an API reservation, transaction safety, authorization, or cross-device persistence. Browser interaction could not be recorded in this run; rerun BOOK-01–04 and BOOK-06–08 in a browser after the UI is available.
