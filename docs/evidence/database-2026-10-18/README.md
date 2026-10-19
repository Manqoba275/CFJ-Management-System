# Local Oracle database implementation evidence

Captured on 18 October 2026 by the lead-developer work session. This is implementation verification, not Nonhlanhla's acceptance-test record or Nyito's contribution/meeting record. No teammate review or attendance is claimed.

## Results

- 12 new domain tables, plus the existing member/profile tables: **14 tables** total.
- **160 synthetic rows**: 20 members and 20 profiles, 10 in each other table.
- Initial seed inserted 140 rows; a second run inserted 0. Original member/profile records were retained.
- **21 schema checks passed**, including FK/ownership, duplicate booking/check-in/request rejection, consent, fractional/negative-value rejection, all enabled/validated constraints and a fresh-connection persistence check.
- Existing Oracle profile verification passed: authentication rejection, optimistic concurrency, cross-instance visibility and profile restoration.
- Existing 43 web/API tests passed; website structural checks passed for 16 pages.

## Files

- `schema-verification.json`: actual count, constraint and column output and check names.
- `profile-regression.json`: actual pre-existing profile integration result.
- `verification.html` / `01-oracle-verification.png`: readable report of the saved database output. This is NOT a SQL Developer or terminal screenshot.
- `02-relational-overview.png`: diagram of the implemented FK relationships, not runtime evidence by itself.
- [Database design](../../../database/design/README.md): relationship source, rules and data dictionary.

The first seed attempt failed a date-only constraint because JavaScript timestamps used the workstation timezone; its DML was rolled back. The final script binds those values explicitly with TO_DATE. Numeric capacity/payment fields use NUMBER plus integer checks to avoid silently rounding fractional inputs before validation.

## Remaining work

The new domain schema is local. Most operational API flows still use JSON, and the public website still uses browser-local demo data. Domain transaction/concurrency and role enforcement must be integrated into Oracle adapters and tested separately. Cloud hosting, real identities, physical-phone acceptance, backup/recovery verification and actual teammate review remain outstanding. These screenshots do not certify any of those tasks.

Nyito and Nonhlanhla should reference these implementation results in their own work where appropriate, but must execute and record their assigned activities themselves.
