// Resolve tokens only on the background request thread; the SDK refreshes expired tokens.
package za.co.cfjlifestylefitness.app
import com.google.firebase.auth.FirebaseAuth
import com.google.android.gms.tasks.Tasks
import java.util.concurrent.TimeUnit
object FirebaseAccess {
    fun resolve(value: String): String {
        if (!value.startsWith("firebase:")) return value
        val user = FirebaseAuth.getInstance().currentUser ?: error("Sign in to your CFJ account first.")
        require(value == "firebase:${user.uid}") { "Account changed. Reload Settings before continuing." }
        require(user.isEmailVerified) { "Verify your email and refresh verification first." }
        return Tasks.await(user.getIdToken(false), 15, TimeUnit.SECONDS).token ?: error("Could not obtain an account token.")
    }
}
