# CFJ user guide

Updated 18 October 2026. This guide describes the current school project, not CFJ's operational booking service.

## Which version am I using?
- Website demo: open the project website or run `npm start` and visit http://127.0.0.1:8765. Accounts, bookings and payments here stay in that browser. Payments, QR scanning and messages are simulated.
- Oracle profile page: a separate local page at http://127.0.0.1:8788/profile-sync.html. It saves the synthetic member's name and goal through the API to Oracle. It does not sign you in to the main website.
- Android debug app: Home, Classes and Settings are available. Local preferences and development API panels exist. Physical-phone operation still needs verification. A website screenshot at a narrow width is not a phone-app screenshot.

## Start with the website
Open Home to browse programmes, memberships and visit information. Links labelled official open CFJ's separate website. For the member demo, open Member Login from the account page and use the prefilled sample account, then select Login As Member. Use fictional details and a password you do not use elsewhere if creating another demo account. Registration does not send a verification email or create a real gym membership. Sign in to the same browser to recover your demo records; clearing browser storage removes local changes.

## Edit a member profile
On Members, scroll to Edit Profile and Preferences. Change your name, goal or other sample details and select Save Profile Changes. The profile shown on this page reflects browser data, not Oracle. Do not enter real health information. Select Logout on the profile card when finished.

## Book or cancel a class
Open Operations as a member. Use the type, date and instructor filters under Class Booking. Choose Book on a class. Look under Your Bookings for its status. A full class offers Waitlist in this browser demo. Select Cancel on your booking to remove it and release its reserved place. These actions do not reserve places at the real gym. The server-side membership rules and the browser demo are separate implementations pending full integration.

## Other member features
Operations also provides simulated Check In Now, Scan QR and Check Out actions, trainer requests and member connections. A trainer request is not a confirmed appointment. On Members, Pay Membership records a simulated payment and displays a confirmation; no money is charged and no email or SMS is delivered. Library shows sample training guides according to the selected goal and demo payment status. These are sample project flows, not a substitute for a trainer's advice.

## Staff and administrator views
Staff use Staff Login and administrators use Admin Login. The seeded local demonstration accounts are staff@cfjfit.co.za with staff123 and admin@cfjfit.co.za with admin123. These are public sample credentials in the source, not real gym accounts. Staff work in Staff Desk; administrators use Admin Reports. Generated totals refer to the demo data. Use Logout in the footer before switching roles. Client-side role navigation does not provide production access control.

## Oracle profile connection
The developer must first start Oracle and the profile API as described in database/README.md. Open http://127.0.0.1:8788/profile-sync.html. Enter the development token privately, select Load profile, edit the name or training goal, then select Save profile. Open another browser page and load the profile to see the committed change. If another client has edited it, reload before saving again. Never include the token in screenshots, Git or the report. This page currently uses one synthetic development identity.

## Android app
After the debug APK is installed on a compatible phone (Android 8 or newer), Home introduces the app, Classes links to the official timetable, and Settings lets you save a display name and training goal. Save preferences stores those settings locally; it is not an Oracle save. Reset preferences asks for confirmation and clears the local preferences. The debug Development profile sync section has separate Load from service and Save to service controls. For the local Oracle API, a developer forwards port 8788 over USB and supplies the service address http://127.0.0.1:8788 and a development token. Hosted sign-in and real app bookings are unfinished. These instructions come from the implemented screens; device execution remains to be checked.

## Troubleshooting
| Problem | What to do |
|---|---|
| Member login failed | Check the selected role and account details. A demo account created in another browser is not available here. |
| Invalid email or required field | Correct the highlighted field before submitting again. |
| No classes match | Clear the date and instructor filters and choose All classes. |
| Duplicate booking | Check Your Bookings instead of submitting again. |
| Profile changed elsewhere | Load the current profile, review it, then reapply your changes. |
| Access denied on profile service | Ask the developer to check the development token. Do not post it in chat or screenshots. |
| Service unavailable | Check Oracle is running and the API process is open. A public static website cannot reach a database running only on your computer. |
| Android cannot connect | Confirm USB debugging approval, port forwarding and the service address. The normal Save preferences button does not call the API. |
| Data differs between screens | The main website, local app preferences and Oracle profile demo are not yet fully integrated. |

## Getting help
Record the page or screen name, steps, expected result and actual result. Include a screenshot with passwords and tokens hidden, then log the issue for the team. Use synthetic data when reproducing problems. The team must still finish hosted authentication, the remaining relational data flows, physical-phone testing and the narrated assessment video.
