# Integrating the prepared web and Android code

The four packs are prepared starting code, held under docs/team so each member can review and copy their own files into the working source tree. They implement a small class-card/booking-eligibility preview. They do not implement the whole website, native app, API or database. Do not manufacture individual contribution evidence from the prepared pack.

1. Manqoba reviews and pushes the website policy and Kotlin policy.
2. Tshifhiwa reviews and pushes the JavaScript/Kotlin class models and response contract.
3. Nyito reviews and pushes the matching acceptance examples and business rules.
4. Nonhlanhla reviews and pushes the web/Android class-card components and tests, after the dependencies are available in the same checkout.
5. Manqoba integrates the reviewed files and runs the combined tests. All other members keep edits within their named roles.

Each code/ directory mirrors target paths from the repository root. Files are new; if a target now exists, compare changes rather than overwriting someone else's work. Commit each coherent stage when complete, not just because a date has arrived. Prepared examples should be acknowledged as shared starter material in contribution records, with actual changes and verification attributed to the member who performed them.

## Website

After copying all packs, run `node --test scripts/booking-packet.test.mjs`, then `npm start` and open http://127.0.0.1:8765/class-card-preview.html . This uses the existing local preview server, which now supports .mjs modules. The standalone preview does not replace the existing Operations screen. Its selector deliberately simulates available, offline, guest, duplicate and full states. No booking is sent.

## Android

After copying all packs, run `gradlew.bat testDebugUnitTest assembleDebug` from mobile-app (JDK 21). The packet supplies a reusable class-card view plus its binder. It compiles without changing the existing Activity, but is not automatically displayed until Manqoba wires it into a screen.

For a visible sample card, in MainActivity.kt inside showScreen, replace the existing `"classes"` branch of the final `when (destination)` with this entire block. Do not replace the earlier layout-selection `when`:

```kotlin
"classes" -> {
    findViewById<Button>(R.id.timetable).setOnClickListener {
        openSite("https://cfjlifestylefitness.co.za/timetable/")
    }
    val parent = container.getChildAt(0) as android.view.ViewGroup
    val summary = za.co.cfjlifestylefitness.app.model.FitnessClassSummary(
        "C-DEMO", "Strength Foundations (preview)", "Demo Coach", 4
    )
    val previewState = za.co.cfjlifestylefitness.app.booking.BookingEligibility.evaluate(
        online = true, signedIn = true, alreadyBooked = false, spaces = summary.spaces
    )
    parent.addView(za.co.cfjlifestylefitness.app.ui.FitnessClassCard.create(parent, summary, previewState) {
        Toast.makeText(this, "Preview only: no place has been reserved.", Toast.LENGTH_LONG).show()
    })
}
```

This block deliberately uses fictional signed-in/online flags for demonstration. Replace them with verified app state when implementing the real API. Neither client logic nor a displayed availability count may authorize a booking. The backend must verify the identity and enforce capacity in a transaction.

## What is actually verified

For a combined review before everyone has integrated their files, run `node scripts/prepare-team-code-check.mjs` from the repository root. It creates a disposable checkout under `tmp/`, preserves existing tracked application files and fills only missing paths from the prepared packs. It runs both the packet checks and Friday's shared booking contract (34 Node tests), then checks website references. It does not apply teammates' files to the working source tree or establish their individual contributions.

Use the printed checkout path with `node scripts/check-team-android-integration.mjs <checkout-path>` to apply the documented screen example there, then run the Android tests/build inside that checkout's mobile-app directory. The combined Android suite currently has 11 JUnit tests, including the shared 24-case contract. Inspect the actual results before recording completion; UI interaction and real API booking still require separate verification.

Node tests cover the seven business scenarios, malformed inputs, and class-model validation. Kotlin JUnit tests cover the same seven scenarios and model constraints. An APK compilation validates resource names and imports. Physical-phone testing, screen accessibility, server authorization, concurrency and synchronization require separate checks; a unit-test pass does not establish them.
