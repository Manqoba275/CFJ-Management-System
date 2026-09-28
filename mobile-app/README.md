# Kotlin Android app

Planning folder only; no runnable Android project or APK yet.

Create the Android Studio Kotlin project here with a committed Gradle wrapper and pinned compatible tooling. Implement member registration/sign-in/Google SSO, profile/settings, classes/bookings, attendance, payment history, exercise guides, friends and trainers against backend/ contracts. Configure the same identity project as the website. Store no database credentials in the app.

Use the hosted HTTPS API on a physical phone. localhost on a phone is the phone, not the development PC. Use an explicit development network configuration only when testing a LAN API; production must use HTTPS. Add JUnit core tests and GitHub Actions APK builds with the Gradle project. Cache safe read-only data later; never confirm a booking offline.
