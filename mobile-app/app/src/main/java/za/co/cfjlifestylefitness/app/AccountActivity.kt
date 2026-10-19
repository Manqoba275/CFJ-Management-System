// Firebase owns credentials; this screen never stores or logs passwords.
package za.co.cfjlifestylefitness.app

import android.app.Activity
import android.os.Bundle
import android.content.Intent
import com.google.firebase.auth.FirebaseAuthException
import android.text.InputType
import android.widget.*
import com.google.firebase.auth.FirebaseAuth

class AccountActivity : Activity() {
    private val google by lazy { GoogleAccount(this) }
    override fun onDestroy() { google.close(); super.onDestroy() }
    override fun onResume() {
        super.onResume()
        // Refresh the email flag after returning from the verification link.
        FirebaseAuth.getInstance().currentUser?.reload()?.addOnSuccessListener {
            FirebaseAuth.getInstance().currentUser?.getIdToken(true)
        }
    }
    private fun failure(error: Exception?): String = when ((error as? FirebaseAuthException)?.errorCode) {
        "ERROR_INVALID_CREDENTIAL", "ERROR_WRONG_PASSWORD", "ERROR_USER_NOT_FOUND" -> "Email or password did not match. If you joined with Google, use Google sign-in. Otherwise use Reset password."
        "ERROR_EMAIL_ALREADY_IN_USE" -> "An account already uses this email. Sign in or reset its password."
        "ERROR_WEAK_PASSWORD" -> "Use a password with at least six characters."
        "ERROR_TOO_MANY_REQUESTS" -> "Too many attempts. Wait a few minutes before trying again."
        "ERROR_USER_DISABLED" -> "This account is disabled. Contact the project administrator."
        else -> "Account request failed. Check your internet connection and try again."
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val auth = FirebaseAuth.getInstance()
        val column = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            val spacing = (24 * resources.displayMetrics.density).toInt()
            setPadding(spacing, spacing * 2, spacing, spacing)
            setBackgroundColor(getColor(R.color.background))
        }
        setContentView(ScrollView(this).apply { addView(column) })
        column.addView(Button(this).apply {
            text = "Home"; isAllCaps = false
            layoutParams = LinearLayout.LayoutParams(-2, -2).apply { gravity = android.view.Gravity.END }
            setOnClickListener { startActivity(Intent(this@AccountActivity, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)); finish() }
        })
        column.addView(TextView(this).apply { text = "CFJ account"; textSize = 28f })
        val email = EditText(this).apply { hint = "Email address"; inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS }
        val password = EditText(this).apply { hint = "Password"; inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD; isSaveEnabled = false }
        val status = TextView(this).apply { accessibilityLiveRegion = android.view.View.ACCESSIBILITY_LIVE_REGION_POLITE }
        column.addView(email); column.addView(password); column.addView(status)
        val controls = mutableListOf<Button>()
        fun refresh() { status.text = auth.currentUser?.let { if(it.isEmailVerified) "Email verified. Signed in." else "Signed in. Verify your email before accessing member services." } ?: "Signed out." }
        fun busy(value: Boolean) { controls.forEach { it.isEnabled = !value }; email.isEnabled = !value; password.isEnabled = !value }
        fun action(label: String, work: () -> Unit) { column.addView(Button(this).apply { text = label; setOnClickListener { work() }; controls.add(this) }) }
        fun credentials(register: Boolean) {
            val address = email.text.toString().trim()
            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(address).matches() || password.text.isEmpty()) { status.text = "Enter your email and password."; return }
            busy(true)
            val task = if(register) auth.createUserWithEmailAndPassword(address,password.text.toString()) else auth.signInWithEmailAndPassword(address,password.text.toString())
            task.addOnCompleteListener(this) { result ->
                password.text.clear(); busy(false)
                if(result.isSuccessful) { refresh(); if(register) auth.currentUser?.sendEmailVerification()?.addOnCompleteListener(this) { status.text = if(it.isSuccessful) "Account created. Check your inbox for verification." else "Account created. Use Send verification email to retry." } }
                else status.text = failure(result.exception)
            }
        }
        action("Sign in") { credentials(false) }
        action("Create account") { credentials(true) }
        val hasGoogleServices = try { packageManager.getPackageInfo("com.google.android.gms", 0); true } catch (_: android.content.pm.PackageManager.NameNotFoundException) { false }
        if (hasGoogleServices) action("Continue with Google") { busy(true); google.signIn { result -> busy(false); password.text.clear(); status.text = result } }
        else column.addView(TextView(this).apply { text = "This phone has no Google Play services. Use email/password here. Google sign-in is available on the CFJ website." })
        action("Send verification email") {
            val user = auth.currentUser
            if(user == null) status.text = "Sign in first."
            else { busy(true); user.sendEmailVerification().addOnCompleteListener(this) { busy(false); status.text = if(it.isSuccessful) "Verification email sent." else "Email could not be sent. Wait and retry." } }
        }
        action("Check verification") {
            val user = auth.currentUser
            if(user == null) refresh() else { busy(true); user.reload().addOnCompleteListener(this) { busy(false); if(it.isSuccessful) { user.getIdToken(true); refresh() } else status.text = "Could not refresh verification." } }
        }
        action("Reset password") {
            val address = email.text.toString().trim()
            if(!android.util.Patterns.EMAIL_ADDRESS.matcher(address).matches()) status.text = "Enter your email address."
            else { busy(true); auth.sendPasswordResetEmail(address).addOnCompleteListener(this) { busy(false); status.text = "If this account is eligible, a reset email will arrive. Check your inbox." } }
        }
        action("Sign out") { auth.signOut(); password.text.clear(); busy(true); google.clear { cleared -> busy(false); refresh(); if(!cleared) status.text = "Signed out of CFJ. Google account chooser state could not be cleared." } }
        refresh()
    }
}
