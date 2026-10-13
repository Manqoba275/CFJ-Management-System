# Demo script and screenshot checklist

**Prepared:** 13 October 2026

**Data:** use only the repository's fictional demo records and the synthetic development profile. Never show a development token or personal account details.

## Suggested walkthrough

1. **Website overview:** show the main navigation and Operations / Library entry points. Explain that this is a local prototype.
2. **Class preview:** select Available, Full, Offline, Guest, and Already booked. Show that only the ready preview enables “Request place” and that the control does not reserve a class.
3. **Member services:** show trainer filters, friend match empty/results states, and the exercise guide lock/filter behavior using fictional records.
4. **Android navigation:** show Home, Classes, and Settings; explain that the reusable class card is not yet wired into the Classes screen.
5. **Development profile sync (optional emulator only):** connect to the synthetic local API, load the profile, save a changed display name/goal, reload it, and show stale-version rejection after a second client changes it. Stop if the service is unavailable; show the offline guidance without retrying a write until the profile is reloaded.
6. **Close with limits:** no production authentication, Oracle-backed member records, live class booking, or physical-phone verification is demonstrated.

## Labelled screenshot plan

| Filename | Label/caption | Capture status |
|---|---|---|
| `01-website-overview.png` | “CFJ website prototype — fictional data” | Not captured: browser could not attach to the local preview. |
| `02-class-preview-available.png` | “Class preview — request is not a reservation” | Not captured: browser unavailable. |
| `03-class-preview-offline.png` | “Offline state — request disabled” | Not captured: browser unavailable. |
| `04-member-services.png` | “Trainer and friend matching — local demo” | Not captured: browser unavailable. |
| `05-android-home-classes.png` | “Android development preview — synthetic data” | Not captured: no emulator/phone UI session. |
| `06-profile-sync-conflict.png` | “Development-only sync conflict — reload required” | Not captured: no emulator/phone UI session. |

The local preview server started, but the in-app browser failed to attach on two attempts. This file is a script and capture checklist; it does not claim to contain screenshots or replace live-device evidence.
