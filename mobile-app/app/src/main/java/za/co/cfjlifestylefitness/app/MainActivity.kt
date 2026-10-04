package za.co.cfjlifestylefitness.app

import android.app.Activity
import android.app.AlertDialog
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.res.ColorStateList
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.WindowInsets
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.ScrollView
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast

class MainActivity : Activity() {
    private var screen = "home"
    private val profileSync by lazy { ProfileSyncPanel(this) }

    override fun onDestroy() {
        profileSync.close()
        super.onDestroy()
    }
    private val preferences by lazy { getSharedPreferences("cfj_preview", MODE_PRIVATE) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        // Keep controls clear of status/navigation bars on edge-to-edge Android versions.
        findViewById<View>(R.id.root).setOnApplyWindowInsetsListener { view, insets ->
            if (android.os.Build.VERSION.SDK_INT >= 30) {
                val bars = insets.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.ime())
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            } else {
                @Suppress("DEPRECATION")
                view.setPadding(insets.systemWindowInsetLeft, insets.systemWindowInsetTop,
                    insets.systemWindowInsetRight, insets.systemWindowInsetBottom)
            }
            insets
        }
        findViewById<Button>(R.id.nav_home).setOnClickListener { showScreen("home") }
        findViewById<Button>(R.id.nav_classes).setOnClickListener { showScreen("classes") }
        findViewById<Button>(R.id.nav_settings).setOnClickListener { showScreen("settings") }
        showScreen(savedInstanceState?.getString("screen") ?: "home")
    }

    override fun onSaveInstanceState(outState: Bundle) {
        outState.putString("screen", screen)
        super.onSaveInstanceState(outState)
    }

    private fun showScreen(destination: String) {
        screen = destination
        val container = findViewById<FrameLayout>(R.id.content)
        container.removeAllViews()
        val layout = when (destination) {
            "classes" -> R.layout.screen_classes
            "settings" -> R.layout.screen_settings
            else -> R.layout.screen_home
        }
        layoutInflater.inflate(layout, container, true)
        findViewById<ScrollView>(R.id.scroll).scrollTo(0, 0)
        mapOf(R.id.nav_home to "home", R.id.nav_classes to "classes", R.id.nav_settings to "settings")
            .forEach { (id, name) ->
                findViewById<Button>(id).apply {
                    isSelected = name == destination
                    backgroundTintList = ColorStateList.valueOf(getColor(if (isSelected) R.color.mint else R.color.panel))
                    setTextColor(getColor(if (isSelected) R.color.background else R.color.text))
                }
            }
        when (destination) {
            "classes" -> findViewById<Button>(R.id.timetable).setOnClickListener {
                openSite("https://cfjlifestylefitness.co.za/timetable/")
            }
            "settings" -> setupPreferences()
            else -> {
                val name = preferences.getString("name", "").orEmpty()
                if (name.isNotBlank()) findViewById<TextView>(R.id.welcome).text = getString(R.string.welcome_named, name)
                findViewById<Button>(R.id.explore).setOnClickListener { showScreen("classes") }
                findViewById<Button>(R.id.visit).setOnClickListener { openSite("https://cfjlifestylefitness.co.za/") }
            }
        }
        Log.d("CFJ", "Opened $destination screen") // Never log member values or credentials.
    }

    private fun setupPreferences() {
        val name = findViewById<EditText>(R.id.display_name)
        val goal = findViewById<Spinner>(R.id.goal)
        val goals = resources.getStringArray(R.array.fitness_goals).toList()
        name.setText(preferences.getString("name", ""))
        goal.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, goals)
        goal.setSelection(goals.indexOf(preferences.getString("goal", goals.first())).coerceAtLeast(0))
        profileSync.bind()
        findViewById<Button>(R.id.save).setOnClickListener {
            val value = MemberPreferences(name.text.toString().trim(), goal.selectedItem.toString())
            when (value.validate(goals)) {
                MemberPreferences.Error.NAME -> { name.error = getString(R.string.invalid_name); name.requestFocus() }
                MemberPreferences.Error.GOAL -> findViewById<TextView>(R.id.status).setText(R.string.invalid_goal)
                null -> {
                    name.error = null
                    preferences.edit().putString("name", value.displayName).putString("goal", value.goal).apply()
                    findViewById<TextView>(R.id.status).setText(R.string.saved)
                }
            }
        }
        findViewById<Button>(R.id.reset).setOnClickListener {
            AlertDialog.Builder(this).setTitle(R.string.reset).setMessage(R.string.reset_message)
                .setNegativeButton(R.string.cancel, null)
                .setPositiveButton(R.string.reset) { _, _ -> preferences.edit().clear().apply(); showScreen("settings") }
                .show()
        }
    }

    private fun openSite(url: String) {
        try { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) }
        catch (_: ActivityNotFoundException) { Toast.makeText(this, R.string.browser_unavailable, Toast.LENGTH_LONG).show() }
    }
}
