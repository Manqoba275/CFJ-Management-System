package za.co.cfjlifestylefitness.app

import android.app.Activity
import android.content.Context
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
import android.widget.TextView
import java.util.concurrent.Executors

/** Debug-only connection panel; credentials remain in memory and are never logged or saved. */
class ProfileSyncPanel(private val activity: Activity) {
    private val executor = Executors.newSingleThreadExecutor()
    fun close() { executor.shutdownNow() }

    fun bind() {
        val panel = activity.findViewById<View>(R.id.profile_sync)
        panel.visibility = if (BuildConfig.DEBUG) View.VISIBLE else View.GONE
        if (!BuildConfig.DEBUG) return
        val origin = activity.findViewById<EditText>(R.id.api_origin)
        val token = activity.findViewById<EditText>(R.id.api_token)
        val name = activity.findViewById<EditText>(R.id.display_name)
        val goal = activity.findViewById<Spinner>(R.id.goal)
        val status = activity.findViewById<TextView>(R.id.sync_status)
        val load = activity.findViewById<Button>(R.id.load_profile)
        val save = activity.findViewById<Button>(R.id.sync_profile)
        val controls = listOf<View>(origin, token, name, goal, load, save,
            activity.findViewById<Button>(R.id.save), activity.findViewById<Button>(R.id.reset))
        val goals = activity.resources.getStringArray(R.array.fitness_goals).toList()
        var loaded: RemoteProfile? = null
        var loadedOrigin = ""
        var loadedToken = ""
        fun perform(writing: Boolean) {
            val address = origin.text.toString().trim()
            val secret = token.text.toString().trim()
            val value = MemberPreferences(name.text.toString().trim(), goal.selectedItem.toString())
            if (writing && (loaded == null || address != loadedOrigin || secret != loadedToken)) {
                status.setText(R.string.sync_load_first); return
            }
            if (writing && value.validate(goals) != null) {
                status.setText(R.string.sync_invalid); return
            }
            val api = try { ProfileApi(address, secret, BuildConfig.DEBUG) }
            catch (_: Exception) { status.setText(R.string.sync_config_invalid); return }
            val request = if (writing) RemoteProfile(value.displayName, value.goal, loaded!!.version) else null
            controls.forEach { it.isEnabled = false }
            status.setText(R.string.sync_loading)
            executor.execute {
                val result = runCatching { if (request == null) api.load() else api.save(request) }
                activity.runOnUiThread {
                    if (activity.isDestroyed || !panel.isAttachedToWindow) return@runOnUiThread
                    controls.forEach { it.isEnabled = true }
                    result.fold(onSuccess = { remote ->
                        loaded = remote; loadedOrigin = address; loadedToken = secret
                        name.setText(remote.displayName)
                        goal.setSelection(goals.indexOf(remote.goal))
                        activity.getSharedPreferences("cfj_preview", Context.MODE_PRIVATE).edit()
                            .putString("name", remote.displayName).putString("goal", remote.goal).apply()
                        status.setText(if (writing) R.string.sync_saved else R.string.sync_loaded)
                    }, onFailure = { error ->
                        // Require a fresh read after a failed or ambiguous write.
                        loaded = null
                        status.text = if (error is IllegalStateException) error.message else activity.getString(R.string.sync_failed)
                    })
                }
            }
        }
        load.setOnClickListener { perform(false) }
        save.setOnClickListener { perform(true) }
    }
}
