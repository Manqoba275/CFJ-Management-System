# Trainer, friend, and exercise-guide checks

**Review date:** 9 October 2026
**Scope:** the existing website Operations and Library screens, plus the Android preview. Manual browser/phone interaction was unavailable for this run.

## Trainer directory and requests

| ID | Scenario | Expected result | Result on 9 October |
|---|---|---|---|
| TRAIN-01 | Filter trainers by specialisation, language, and minimum rating. | Only trainers meeting every selected filter are shown; empty results have a clear message. | Source path and selectors reviewed; browser interaction not captured. |
| TRAIN-02 | Logged-out visitor requests a session or sends a trainer message. | No request is saved; visitor is asked to log in. | Handler contains a member check; browser interaction not captured. |
| TRAIN-03 | Member submits a request with no message/date/time. | Defaults are sensible and the request identifies the selected trainer. | Source uses today's date, member's preferred time, and an empty message; no explicit required-field validation. Interactive result not captured. |
| TRAIN-04 | Member rates a trainer with a valid star selection and optional comment. | Review is saved once with member and trainer IDs. | Source path reviewed; browser interaction not captured. Persistence is local demo state. |

## Friend matching

| ID | Scenario | Expected result | Result on 9 October |
|---|---|---|---|
| FRIEND-01 | Member has a goal or preferred training time matching another member. | Matching member appears; the signed-in member is excluded. | Matching predicate reviewed in source; browser interaction not captured. |
| FRIEND-02 | No other member matches. | Show the empty-state message. | Source path reviewed; browser interaction not captured. |
| FRIEND-03 | Member selects Connect. | One friend request is saved and confirmation is announced. | Handler reviewed; duplicate connections and recipient consent are not enforced in the local prototype. |
| FRIEND-04 | Logged-out visitor opens Operations. | Show sign-in guidance and do not expose match cards. | Source path reviewed; browser interaction not captured. |

## Exercise guide and Android preview

| ID | Scenario | Expected result | Result on 9 October |
|---|---|---|---|
| GUIDE-01 | Logged-out or unpaid member opens Library. | Detailed guide stays locked; login/payment guidance is visible. | Source path reviewed; browser interaction not captured. |
| GUIDE-02 | Paid member changes goal and body-area filters. | Matching guide cards update; selected member goals sort first. | Source path reviewed; browser interaction not captured. |
| GUIDE-03 | Open an exercise guide. | Instructions and safe progression guidance appear; closing returns to the list. | Source path reviewed; browser interaction not captured. |
| ANDROID-01 | Navigate among Home, Classes, and Settings; rotate/recreate the Activity. | Selected screen is restored and navigation selection is clear. | Existing unit/build evidence is recorded in the 6 October contribution record; no physical phone result is claimed. |
| ANDROID-02 | Open Classes and look for the reusable class card. | The card appears with live class data and safe booking behavior. | Not implemented in the current screen: `screen_classes.xml` shows a preview notice; integration guide assigns the reusable card wiring to the integrator. |

## Findings and limits

These screens are local prototype features. Trainer requests, reviews, friend connections, and guide access are stored or decided in browser state; they are not backed by a shared service or access-controlled API. A browser session and physical Android device were unavailable during this check. Cases above are execution-ready; entries marked as source review are not represented as interactive passes.
