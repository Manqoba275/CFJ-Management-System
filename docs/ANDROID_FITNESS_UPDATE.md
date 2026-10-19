# Android fitness update

The home screen now opens a blue training dashboard with a guided routine, movement manual and links to CFJ classes and account management.

## Included
- Three beginner movements: sit to stand, wall press-up and supported calf raise.
- Written technique steps, form cues, and an explanation of reps, sets and recovery.
- A two-set routine with five repetitions per set and an optional 60-second rest timer.
- Completed-session count saved locally, separate from bookings and attendance.
- A link to NHS demonstration videos: https://www.nhs.uk/live-well/exercise/strength-and-flex-exercise-plan-how-to-videos/
- Firebase Google account chooser and updated Android OAuth configuration.

Technique reference: https://www.nhs.uk/live-well/exercise/strength-exercises/
The routine is a general starting example, not a personal training prescription.

## Verification still needed on a phone
1. Install the new APK when its build passes.
2. Open every exercise guide and the external demonstration link.
3. Complete a set, check the countdown, skip rest, and complete all six sets. Confirm the local session count increases once.
4. Leave partway through a session: it must not increase the completed count.
5. Navigate to Classes and Settings, then return Home. Check scrolling and large text.
6. Sign in with Google using a test account, sign out, and sign in again. Do not photograph credentials or tokens.
7. Confirm shared bookings only after Oracle and the API are running and the Firebase UID is linked to a member.

In-progress workouts restart when the screen is recreated; completed-session totals remain stored. The current library contains three movements, not a complete equipment catalogue. No phone runtime screenshots have been captured for this update.
