package za.co.cfjlifestylefitness.app

import android.app.Activity
import android.app.Instrumentation
import android.os.Bundle

/** Explicit local-service smoke test; run only against synthetic development data. */
class ProfileConnectionInstrumentation : Instrumentation() {
    private var token = ""
    override fun onCreate(arguments: Bundle?) {
        super.onCreate(arguments)
        token = arguments?.getString("devToken").orEmpty()
        start()
    }
    override fun onStart() {
        val results = Bundle()
        try {
            check(token.length >= 32) { "Supply devToken for the synthetic local service" }
            val api = ProfileApi("http://10.0.2.2:8787", token, true)
            val initial = api.load()
            val saved = api.save(RemoteProfile("Emulator Review", "Endurance", initial.version))
            try {
                check(saved.displayName == "Emulator Review" && saved.goal == "Endurance")
                check(saved.version == initial.version + 1)
                check(api.load() == saved)
                val stale = runCatching { api.save(initial) }.exceptionOrNull()
                check(stale is IllegalStateException && stale.message?.contains("changed elsewhere") == true)
                check(runCatching { ProfileApi("http://10.0.2.2:8787", "incorrect", true).load() }.isFailure)
            } finally {
                api.save(RemoteProfile(initial.displayName, initial.goal, api.load().version))
            }
            results.putString("stream", "PROFILE_SYNC_OK: load, save, reload, stale-write rejection and invalid-token rejection passed\n")
            finish(Activity.RESULT_OK, results)
        } catch (_: Exception) {
            results.putString("stream", "PROFILE_SYNC_FAILED: check the local server and rerun; no credentials are logged\n")
            finish(Activity.RESULT_CANCELED, results)
        }
    }
}
