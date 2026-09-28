# Website setup check — 28 September 2026

Local preview: `npm start`, then http://127.0.0.1:8765/ . No dependencies need installing; Node.js 22 or later is required. The server is bound to this PC's loopback interface and serves only website files. It does not expose the Git repository or Desktop files.

Verified in the browser using the existing fictional demo account:

- Home and account navigation loaded.
- Member login opened the correct member dashboard.
- Booking Strength Anatomy reduced displayed spaces from four to three.
- Repeating that booking was rejected with a duplicate-request message.
- Cancellation removed the booking and restored four spaces.
- Paid member library displayed unlocked guides and opened a guide modal.
- Logout returned to the sign-up page.
- Admin login displayed the reports, payments, invoices and staff-management interface.
- The new demo notice correctly explains local-only data and simulated transactions.

Automated checks: all 11 HTML pages' local file references and app.js syntax passed; the preview-server test passed for normal files, missing/private/traversal paths, unsupported write methods, and HEAD requests.

Limits: these are local prototype checks, not proof of secure authentication, a shared database, complete role authorization, concurrent booking safety or production readiness. Cross-device integration and physical-phone testing remain pending. Browser sample state was used; no real payments or messages were sent.
