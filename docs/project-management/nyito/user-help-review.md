# User help review supplement

Draft for Nyito and technical-owner review, 19 October 2026. Supplements the existing [user guide](../../../user-guide/USER_GUIDE.md); no shared help files were edited. These are source-based instructions, not a claim of new device testing.

## Choose the correct version

The main website demo stores data in its browser. Development service pages call an API; Android local preferences use phone storage. A change in one is not automatically visible in all others. Ask the demonstrator which service and storage the build uses. Use fictional records only.

## Website member workflow

1. Open Member Login and use the documented synthetic member account from website/README.md. Do not use a real password.
2. Open Members to view/edit the demo profile. Save and reload to check the displayed result.
3. Open Operations, filter classes, choose Book and inspect Your Bookings. Cancel through the listed booking. This browser-local demo does not reserve a real gym place.
4. Treat payments, QR scanning and messages as simulations. Never enter card or private health details.
5. Log out before switching to Staff or Admin demonstration views. Client navigation is not production authorization.

## Android preferences and development bookings

Home, Classes and Settings are implemented. Save preferences is local-only; Reset requires confirmation. The 19 October integration report describes debug controls to load memberships/classes/bookings and book/cancel through the API. This supersedes the earlier “bookings unavailable” text for review purposes, but physical-phone execution remains to be demonstrated.

For a supervised synthetic test, the developer supplies the correct API origin and development identity privately. Load records, select an API-returned class, submit once, and wait for the confirmed response. Reload the website service desk with the same identity and verify the same booking. Cancel and reload both. Do not claim success if offline or if the server has not confirmed. Do not publish development tokens or expose the development-token service publicly.

## Troubleshooting

| Symptom | Action |
|---|---|
| Account missing in another browser | Browser demo accounts are local; use the original browser or synthetic seed account |
| Data differs across clients | Confirm identity, API origin and storage mode before reporting an integration defect |
| Service unavailable | Ask the technical owner to verify the service; localhost on a phone refers to the phone |
| Stale edit / conflict | Reload, review current values and reapply the intended edit |
| Duplicate or full class | Inspect existing booking and availability; do not repeatedly submit |
| Access denied | Ask the technical owner to verify identity/role; never share tokens in screenshots |

## Review acceptance

Run AC-11 in acceptance-checklist.csv with another permitted reviewer. Record actual build, steps, result, difficulties and corrections. This supplement remains Review until that occurs.
