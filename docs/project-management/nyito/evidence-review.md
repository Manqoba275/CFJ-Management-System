# Requirement and evidence review

Reviewed locally on 19 October 2026 with Codex assistance against source commit e98aee5. This is a document/evidence inspection, not an independent runtime test or teammate approval.

## Findings

| Requirement | Observed evidence | Assessment |
|---|---|---|
| Database schema and sample records | Saved Oracle JSON lists 14 tables, 160 rows, at least ten per table and 21 checks | Ready for owner/reviewer confirmation; does not prove hosting or current API transaction behavior |
| Website/API booking visibility | Four saved checks: browser creates, independent client reads/cancels, browser reload sees cancellation | Supports file-backed development integration only |
| Android | Saved integration report and build log document 16 unit tests, lint and assembly | Phone execution and hosted authentication remain unverified |
| Automated tests | Saved Node log reports 44 passes | Selected local regression evidence; not every assessment feature |
| User help | Existing user guide and website help exist | Needs consistency review against newer Android booking changes |
| Collaboration | Saved PR 3 snapshot has requested reviewer, no submitted review | Does not establish reviewer acceptance or ongoing Azure activity |
| Meetings | Supplied guide contains planned dates and blank minutes | Cannot establish occurrence, attendance or participation |

## Document conflicts to resolve

1. mobile-app/README.md and docs/user-guide/USER_GUIDE.md state Android bookings are unfinished/unavailable. The newer integration README says Settings can load/book/cancel through shared routes. Use the newer evidence for a provisional review finding; Manqoba must demonstrate current behavior before help text is accepted.
2. Earlier verification mentions only two Oracle tables. The later database result lists fourteen. Retain dated records, reference the later schema evidence, and do not apply old counts as the current baseline.
3. Physical-phone, hosted identity/SSO and online data evidence remain missing. A successful build or browser request cannot replace these.
4. Five planned October meetings do not prove sessions happened. No minutes are completed in this pack.

## Decisions proposed for review

- Put DB-DESIGN and DB-SEED in Review, not Done, pending owner confirmation and reviewer acceptance.
- Keep API integration In progress and phone/hosted identity tasks Blocked pending their specific evidence.
- Treat the source evidence as team implementation records; do not label it Nyito’s independent testing or original coding.
- Confirm dates with owners; the meeting plan supplies no implementation due dates.
