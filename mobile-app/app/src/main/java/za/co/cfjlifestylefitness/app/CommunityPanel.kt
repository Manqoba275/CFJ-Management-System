package za.co.cfjlifestylefitness.app

import android.app.Activity
import android.content.res.ColorStateList
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import org.json.JSONObject
import java.util.concurrent.Executors

class CommunityPanel(private val activity: Activity) {
    private val executor = Executors.newSingleThreadExecutor()
    fun close() { executor.shutdownNow() }

    fun bind() {
        if (!BuildConfig.DEBUG) return
        val container = activity.findViewById<LinearLayout>(R.id.community_panel)
        val origin = activity.findViewById<EditText>(R.id.api_origin)
        val token = activity.findViewById<EditText>(R.id.api_token)
        val records = activity.findViewById<LinearLayout>(R.id.community_records)
        val status = activity.findViewById<TextView>(R.id.community_status)
        var revision = 0
        var busy = false
        fun message(value: String) { records.addView(TextView(activity).apply { text = value; setPadding(0, 16, 0, 16); setTextColor(activity.getColor(R.color.text)) }) }
        fun run(action: (CommunityApi) -> (() -> Unit)) {
            if (busy) return
            val current = revision
            val url = origin.text.toString().trim()
            val secret = token.text.toString().trim()
            busy = true
            status.setText(R.string.community_loading)
            executor.execute {
                val result = runCatching { action(CommunityApi(url, secret)) }
                activity.runOnUiThread {
                    busy = false
                    if (!activity.isDestroyed && container.isAttachedToWindow && current == revision) {
                        result.onSuccess { it(); status.setText(R.string.community_updated) }
                            .onFailure { status.text = communityFailureMessage(it) }
                    }
                }
            }
        }
        fun button(label: String, action: () -> Unit) {
            records.addView(Button(activity).apply {
                text = label
                backgroundTintList = ColorStateList.valueOf(activity.getColor(R.color.mint))
                setTextColor(activity.getColor(R.color.background))
                setOnClickListener { action() }
            })
        }
        fun send(path: String, body: JSONObject) = run { api ->
            api.send(path, body)
            val render: () -> Unit = { records.removeAllViews(); message(activity.getString(R.string.community_saved)) }
            render
        }
        val watcher = object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) { revision++; records.removeAllViews(); status.text = "" }
            override fun afterTextChanged(s: Editable?) {}
        }
        origin.addTextChangedListener(watcher)
        token.addTextChangedListener(watcher)
        activity.findViewById<Button>(R.id.community_load).setOnClickListener {
            run { api ->
                val trainers = api.list("/trainers")
                val members = api.list("/members")
                val requests = api.list("/me/trainer-requests")
                val connections = api.list("/me/friend-connections")
                val render: () -> Unit = {
                    records.removeAllViews()
                    trainers.forEach { t ->
                        message("${t.getString("displayName")} · ${t.getString("specialty")}")
                        button(activity.getString(R.string.community_request_trainer)) { send("/trainer-requests", JSONObject().put("trainerId", t.getString("id"))) }
                    }
                    members.forEach { m ->
                        message("${m.getString("displayName")} · ${m.getString("goal")}")
                        button(activity.getString(R.string.community_connect)) { send("/friend-connections", JSONObject().put("memberId", m.getString("id"))) }
                    }
                    if (members.isEmpty()) message(activity.getString(R.string.community_empty))
                    requests.forEach { r -> message("${r.getString("trainerId")}: ${r.getString("status")}") }
                    connections.forEach { c ->
                        message("${c.getString("fromId")} → ${c.getString("toId")}: ${c.getString("status")}")
                        if (c.getString("status") == "pending") button(activity.getString(R.string.community_accept)) { send("/friend-connections/${c.getString("id")}/accept", JSONObject()) }
                    }
                }
                render
            }
        }
        activity.findViewById<Button>(R.id.community_guides).setOnClickListener {
            records.removeAllViews()
            run { api ->
                val guides = api.list("/exercises")
                val render: () -> Unit = {
                    records.removeAllViews()
                    guides.forEach { g -> message("${g.getString("title")} · ${g.getString("goal")}\n${g.getString("instructions")}") }
                }
                render
            }
        }
    }
}
