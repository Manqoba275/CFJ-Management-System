# Week-one class-card defect log

**Review date:** 6 October 2026
**Scope:** the week-one website and Android class-card starter.

The prepared files were reviewed against the shared booking rules, model, and examples. The following reproducible issues were corrected within the UI/accessibility scope.

| ID | Finding | Status | Evidence |
|---|---|---|---|
| DEF-01 | Changing the website preview scenario changed the booking status without announcing the new status to assistive technology. | Fixed | The status now has role=status, aria-live=polite, and aria-atomic=true. The Node card test checks these attributes. A screen-reader run remains pending. |
| DEF-02 | The Android class details used “spaces” for a count of one. | Fixed | Added Android quantity strings and formatted the count with getQuantityString; Android unit tests and resource compilation passed. |

No additional reproducible defect was found in the automated week-one checks. Manual keyboard, browser rendering, screen-reader, and physical-device checks remain unverified as recorded in accessibility.md.

The teammate model and acceptance-example starter files were copied only for the local combined check. They were not added to this member branch. Standalone branch CI still depends on those owners merging their source files from docs/team.

The component is a preview only. Its client-side eligibility display does not reserve a place; server-side authorization and capacity enforcement remain outside this UI task.
