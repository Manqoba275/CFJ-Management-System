# APK inventory and canonical build - 19 October 2026

Several debug APKs exist with similar names. Hashes below were re-computed with `Get-FileHash -Algorithm SHA256` on 19 October 2026. Use this page to pick the right file; never infer the build from the file name alone.

## Canonical APK for submission
- File: `C:\Users\mtung\OneDrive\Desktop\CFJ Submission\02-Android\CFJ-Fitness-debug.apk`
- Size: 8,445,659 bytes
- SHA256: `90A810FF9248974A06E3D6BA570354E962912B398FB6F7EEBF9067835A725E76`
- Built from commit: 78a36ff (78a36ff5974b7e16e745e220539dfb7fd64d0e63, branch feature/team-and-app-setup)
- Build log: `C:\Users\mtung\OneDrive\Desktop\CFJ Task 4 Evidence\android-build.txt` - BUILD SUCCESSFUL in 7m 52s, 51 actionable tasks (26 executed, 25 up-to-date).
- Build content: Firebase account screen (register, verify, sign in, reset, Google when Play services exist), illustrated training dashboard and exercise guides, Classes and Settings screens, and the debug-only profile/shared-records API panels.
- Checksum file: `02-Android\apk-checksum.txt` (Algorithm, SHA256, Path, Built-from-commit, Size).
- Status: unsigned debug/development build, not a Play Store release. It is the only APK that should be described as the submitted build.

## Other APKs that must not be substituted
| File | Size | SHA256 | What it is |
|---|---|---|---|
| `C:\Users\mtung\OneDrive\Desktop\CFJ Task 4 Evidence\CFJ-Firebase-debug.apk` | 4,405,771 | `9DA227D7B8F50F34F84D5BD0155536FCCCEB09A21537367A3F9645C7EEEE7B76` | Earlier Firebase/API build. It predates the training dashboard and account-navigation work, so it lacks those screens. Not canonical. |
| `C:\Users\mtung\OneDrive\Desktop\CFJ Task 4 Evidence\CFJ-debug.apk` | 921,981 | `FF686A7AC5A900CA6AC5A6DF4A2320B1697E518DEC2211EAC2A2CF37DE74F618` | Third, older build. This is the file named by the stale `CFJ Task 4 Evidence\apk-checksum.txt`; that checksum file does not describe the submitted APK. |
| `C:\Users\mtung\OneDrive\Desktop\CFJ Task 4 Evidence\CFJ-Fitness-updated-debug.apk` | 8,445,659 | `2F07D9ED2FE5F1D1336E472BA8A07F22B4A4C0FB3787CFBA29D6EF9E293A5F42` | Same size as the canonical APK but a byte-different rebuild found during this verification. Not canonical; do not substitute it for the hash above. |

Additional copy: `C:\Users\mtung\OneDrive\Desktop\CFJ Submission\CFJ-Fitness-updated-debug.apk` hashes to the canonical `90A810FF...` value (same 8,445,659 bytes), so it is a duplicate of the submitted APK, not a separate build.

## Why this matters
`docs/TEAM_REVIEW_2026-10-19.md` recorded the 9DA227D7 APK as the current build at the time it was reviewed. The submitted APK is the later 78a36ff build identified above. A reviewer checking an older checksum (`FF686A7A...`) or an older file name would test the wrong binary, so quote the SHA256, not the file name, when claiming which build was submitted.

Device evidence limit: no APK hash is bound to a device. The only phone evidence is a user-supplied screenshot (see `../phone-2026-10-19/README.md`), and independent installation of the canonical APK is not evidenced.
