// Uses Android's account chooser; Google tokens are exchanged with Firebase and never logged.
package za.co.cfjlifestylefitness.app

import android.app.Activity
import android.os.CancellationSignal
import androidx.credentials.*
import androidx.credentials.exceptions.GetCredentialException
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.ClearCredentialException
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import java.util.concurrent.Executor

class GoogleAccount(private val activity: Activity) {
    private val manager = CredentialManager.create(activity)
    private val ui = Executor { activity.runOnUiThread(it) }
    private var pending: CancellationSignal? = null
    fun close() { pending?.cancel() }
    fun signIn(done: (String) -> Unit) {
        val request = GetCredentialRequest.Builder().addCredentialOption(
            GetSignInWithGoogleOption.Builder(activity.getString(R.string.default_web_client_id)).build()
        ).build()
        pending = CancellationSignal()
        try {
            manager.getCredentialAsync(activity, request, pending, ui,
                object : CredentialManagerCallback<GetCredentialResponse, GetCredentialException> {
                    override fun onResult(result: GetCredentialResponse) {
                        if(activity.isDestroyed) return
                        try {
                            val credential = result.credential
                            require(credential is CustomCredential && credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL)
                            val google = GoogleIdTokenCredential.createFrom(credential.data)
                            FirebaseAuth.getInstance().signInWithCredential(GoogleAuthProvider.getCredential(google.idToken, null))
                                .addOnCompleteListener(activity) { task ->
                                    done(if(task.isSuccessful) "Signed in with Google." else "Google account could not sign in. Check your connection and Firebase settings.")
                                }
                        } catch (_: Exception) { done("Google returned an unsupported credential. Please retry.") }
                    }
                    override fun onError(e: GetCredentialException) {
                        if(!activity.isDestroyed) done(if(e is GetCredentialCancellationException) "Google sign-in cancelled." else "Google sign-in unavailable. Check Google Play services, your account and the app signing fingerprint.")
                    }
                })
        } catch (_: Exception) { done("Google sign-in could not start. Check Google Play services and retry.") }
    }
    fun clear(done: (Boolean) -> Unit) {
        try { manager.clearCredentialStateAsync(ClearCredentialStateRequest(), null, ui,
            object : CredentialManagerCallback<Void?, ClearCredentialException> {
                override fun onResult(result: Void?) { if(!activity.isDestroyed) done(true) }
                override fun onError(e: ClearCredentialException) { if(!activity.isDestroyed) done(false) }
            }) } catch (_: Exception) { done(false) }
    }
}
