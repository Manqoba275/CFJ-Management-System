# Google sign-in and database reconciliation

The website uses the Firebase Google popup flow. The Android account screen now uses Credential Manager's Google account chooser and exchanges the Google ID token for a Firebase session. Both are configured for cfj-management-system. Neither client stores a Google password.

## Console requirements

The Android debug signing SHA-1 is 16:5B:BA:2B:C9:28:86:FD:8A:F6:9F:5C:70:D0:8F:02:30:23:E0:EF. Register it against za.co.cfjlifestylefitness.app, then download the updated google-services.json. A release signed with another certificate requires that certificate's fingerprint as well. The current downloaded config contains the Web OAuth client; updated Android OAuth registration is still awaiting confirmation.

Read-only Firebase project configuration confirmed localhost and gym-management-system-11sn.onrender.com are authorised. Google provider was enabled in the user's console screenshot. Live account sign-in still requires the tester to select an account and complete consent; no credentials were entered during automated browser checks.

## Database fixes

The cfj_* schema remains the active schema. Tshifhiwa's unprefixed proposal, seeds, reports and checks are preserved under database/design/alternative-proposal and removed from competing application migration paths. No source database data was changed.

Fractional capacity/rating values are now rejected in the proposal without Oracle's fixed-scale rounding bypass. Reversed friendship duplicates are prevented by a canonical pair index. Executable negative SQL checks are included, but Oracle execution remains pending.

The Oracle class adapter now joins trainer names. Development responses supply an explicit unassigned-trainer label. The HTTP response is tested against the shared website class projection. API documentation now matches /api/v1 paths, active/cancelled statuses, membership checks and the actual transaction-lock strategy.

## Nyito package review

The supplied ZIP contains draft requirements, trackers, evidence indexes, a meeting schedule and five minutes templates. Dates, attendees, recordings, Azure work-item links and review approvals are not supplied as completed evidence. The package does not independently verify the POE rubric. Keep these items pending until actual records are entered by the responsible people; do not treat the templates as meetings held.

## Still required

- Complete Android fingerprint registration, rebuild with the updated client config and test Google sign-in on a connected supported phone.
- Test a real Google account on both clients and confirm the same Firebase UID, cancellation, sign-out and account switching.
- Restore Oracle, run migration/API/recovery checks, and map the verified test UID to the intended synthetic member.
- Finish hosted API/database and authenticated staff/admin roles; static Render hosting alone does not provide them.
- Complete Nonhlanhla's acceptance evidence, Nyito's real tracker/meeting records, teammate review and final report/video evidence.
