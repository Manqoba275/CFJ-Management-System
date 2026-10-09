# Role navigation and validation checks

**Review date:** 9 October 2026

**Scope:** website demo navigation and client-side form handling. This is a test record for the current prototype, not a security assessment of a hosted service.

## Role navigation cases

| ID | Scenario | Expected result | Result on 9 October |
|---|---|---|---|
| ROLE-01 | Logged-out visitor opens the Members page. | Profile/payment controls are unavailable until member login. | Source review confirms the page renders the logged-out state and returns before attaching member-only actions. Browser result not captured. |
| ROLE-02 | Logged-out visitor opens Reports. | Redirect to the appropriate login page; admin report data remains hidden. | Source review confirms reports require an `admin` session. Browser result not captured. |
| ROLE-03 | Member opens Reports or Staff Desk directly. | Access is denied or redirected; admin/staff navigation is not offered. | Source review confirms role redirects and role-filtered navigation. Browser result not captured. |
| ROLE-04 | Staff opens Reports or member-only pages directly. | Redirect to the Staff Desk; admin reports are not shown. | Source review confirms the staff route guard and navigation conditions. Browser result not captured. |
| ROLE-05 | Admin opens member or staff routes. | Admin remains on permitted admin routes; role-specific destinations are respected. | Source review confirms admin redirect conditions. Browser result not captured. |
| ROLE-06 | Submit a staff credential on the member login form, or vice versa. | Role-specific login must reject credentials for the wrong role. | The handlers search accounts by the expected role. Interactive result not captured. |

## Validation cases

| ID | Input | Expected result | Result on 9 October |
|---|---|---|---|
| VAL-01 | Wrong email/password or inactive staff account. | Show a failure message and do not create a session. | Handler paths reviewed; no automated role/login test exists. |
| VAL-02 | Duplicate signup email. | Reject signup without creating a second user/member. | Duplicate check exists in the signup handler; interactive result not captured. |
| VAL-03 | Blank or malformed signup fields. | Reject invalid values and explain the error next to the affected field. | The form markup has native required, email, and six-character minimum constraints. Interactive behavior was not run; the handler itself only checks duplicate email if native validation is bypassed. |
| VAL-04 | Negative, zero, or nonnumeric payment amount. | Reject the amount and leave payment history unchanged. | Payment input declares `min=1`, but the submit handler's enforcement was not verified interactively; server-side validation is absent. |
| VAL-05 | Empty profile name or invalid phone value. | Reject the change with a clear validation message. | Open gap confirmed by source review: profile edit inputs are not marked required and `updateProfile` saves values without validation. Add field validation and an automated regression case. |

## Verification limits

The source review found that role routing is implemented in `website/app.js`, but sessions and credentials are stored in browser `localStorage`; these checks are not an authorization boundary. A local preview server was started on 9 October, but the in-app browser did not attach to it, so no interactive pass is claimed. The role and validation cases remain pending browser execution. Do not use real account details; the repository's demo records are fictional.
