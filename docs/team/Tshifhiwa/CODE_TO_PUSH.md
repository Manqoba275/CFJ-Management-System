# Tshifhiwa: code to copy and push

Role: System Designer and Database Architect.

Matching website/Android data models and the shared class response contract.

Open COPY_AND_PASTE.html for complete code and Copy buttons. The code/ folder contains the same files, with paths matching their destinations from the repository root. Copy each whole file into its listed path, creating folders as necessary. This is a prepared shared starter: review and understand it, run the checks, and describe your actual edits and verification in your own commit/PR. The packet itself is not evidence of completed independent work.

## Dated code contributions

- Wednesday 30 September (Day 1): review and copy the web files; suggested commit: `feat: define website fitness class response model`.
- Thursday 1 October (Day 2): review and copy the Android files; suggested commit: `feat: define Android fitness class data model`.
- Friday 2 October (Day 3): copy the supporting specification/test files below, compare both platforms and record checks.
- Saturday 3 October (Day 4): review integration with the other members, fix any confirmed issues, and push those fixes with a message describing what changed.
- Days 5–14 continue the work in TWO_WEEK_PLAN.md. The supplied files are a starter feature, not prewritten completion evidence for the whole fortnight.

## File destinations

- `docs/design/class-response-contract.md`
- `mobile-app/app/src/main/java/za/co/cfjlifestylefitness/app/model/FitnessClassSummary.kt`
- `website/modules/fitness-class.mjs`

## Dependencies and verification

Manqoba supplies eligibility logic, Tshifhiwa supplies data models, Nyito supplies examples, and Nonhlanhla supplies UI/tests. Each member stages only their own listed files. Model/logic/example files should be merged before running Nonhlanhla's combined tests or class-card preview. Until then, missing imports mean a prerequisite is missing; do not mark tests passed.

After all four packs are in one checkout:

```powershell
node --test scripts/booking-packet.test.mjs
node scripts/check-website.mjs
cd mobile-app
.\gradlew.bat testDebugUnitTest assembleDebug
```

Use JDK 21 as documented in mobile-app/README.md. Start the website with `npm start` and visit /class-card-preview.html. Change the scenario selector and verify only Available enables Request place. Clicking it must say no place was reserved. Manqoba connects the Android component using ../CODE_INTEGRATION.md. These client checks do not replace API authorization or database transactions.

## Push only your files

Create a branch using your own name and task, follow PUSH_GUIDE.md, then stage the exact files for the completed stage (do not stage code/ or this whole packet):

Web stage:

```powershell
git add -- "website/modules/fitness-class.mjs"
git diff --cached
git commit -m "feat: define website fitness class response model"
git push -u origin HEAD
```

Android stage:

```powershell
git add -- "mobile-app/app/src/main/java/za/co/cfjlifestylefitness/app/model/FitnessClassSummary.kt"
git diff --cached
git commit -m "feat: define Android fitness class data model"
git push
```

Supporting files for Day 3: `docs/design/class-response-contract.md`

Commit only when Git shows a real change and you have checked the result. Open a pull request and request review. Never use another member's account or change commit authors to simulate their participation.
