# Phone screenshot evidence - 19 October 2026

## File
- `phone-verified-sign-in.png` - 421 x 904 px, 84,567 bytes.
- SHA256: 39B90412E84A70DD483E92E3C6A55CB41DF294E5AE50CF121BF50836B0A5553F
- Copy supplied from `C:\Users\mtung\OneDrive\Desktop\CFJ Submission\03-Evidence\phone-verified-sign-in.png`.

## What it shows
A genuine Android phone screenshot (status bar visible: 19:32, 7:11, Wi-Fi and battery indicators) of the CFJ app's account screen:

- heading "CFJ account", with Email address and Password fields;
- status line "Email verified. Signed in.";
- buttons: Sign in, Create account, Send verification email, Check verification, Reset password, Sign out;
- notice: "This phone has no Google Play services. Use email/password here. Google sign-in is available on the CFJ website."

So a Firebase email/password account on that phone completed email verification and reached a signed-in state in the Android account screen, and the app correctly hid Google sign-in because Play services are absent.

## Provenance and limits
- This screenshot is **user-supplied**. It was provided by the team member from their own phone. It arrived with no ADB output, device serial, installation record, build metadata or timestamp binding.
- It therefore does **not** prove that the canonical APK (`90A810FF...`, commit 78a36ff) was the build installed, and it cannot be tied to any specific APK.
- It is not evidence of Google sign-in on Android (the screen states Play services are absent), of Oracle/database access, or of API booking.
- Installation of the app on the Huawei CTR-LX2 is **NOT independently evidenced**. Follow-up ADB checks recorded elsewhere reported the phone offline / no connected devices: see `../integration-2026-10-19/README.md` and `../firebase-oracle-2026-10-19/README.md`.
- What it does establish: the CFJ account UI ran on an Android phone at least once, and the email/password verification flow reached "Email verified. Signed in." on a real device.

Do not present this screenshot as an independently verified installation or build test. The project still lacks an ADB-documented installation and runtime record for the canonical APK.
