package za.co.cfjlifestylefitness.app

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.CountDownTimer
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

// Training stays available offline; completing a set never creates a class booking.
class FitnessPanel(private val activity: Activity, private val openClub: () -> Unit) {
    private val history = activity.getSharedPreferences("cfj_training", Activity.MODE_PRIVATE)
    private var timer: CountDownTimer? = null
    private var container: LinearLayout? = null
    private var current = 0
    private var sets = 0
    private var resting = false
    private val blue = Color.rgb(73, 153, 255)
    private val white = Color.rgb(241, 245, 251)

    private data class Exercise(val name: String, val area: String, val steps: String, val cue: String)
    private val exercises = listOf(
        Exercise("Sit to stand", "LEGS â€¢ STABLE CHAIR", "1. Sit near the front of a stable chair, feet flat.\n2. Lean forward slightly and stand under control.\n3. Slowly sit back down. That is one rep.", "Keep the chair against a wall; avoid dropping into the seat."),
        Exercise("Wall press-up", "UPPER BODY â€¢ WALL", "1. Face a wall with palms at chest height.\n2. Bend your elbows to bring your chest towards it.\n3. Press away smoothly. That is one rep.", "Keep your body aligned and breathe throughout."),
        Exercise("Calf raise", "LOWER LEGS â€¢ CHAIR SUPPORT", "1. Stand tall holding a stable chair.\n2. Lift your heels while keeping your toes grounded.\n3. Lower slowly. That is one rep.", "Use the support for balance and avoid bouncing.")
    )

    fun close() { timer?.cancel(); timer = null; resting = false }

    private fun dp(value: Int) = (value * activity.resources.displayMetrics.density).toInt()
    private fun text(parent: LinearLayout, value: String, size: Float = 16f, bold: Boolean = false) {
        parent.addView(TextView(activity).apply {
            text = value; textSize = size; setTextColor(white)
            if (bold) setTypeface(null, Typeface.BOLD)
            setPadding(0, dp(6), 0, dp(10))
        })
    }
    private fun button(parent: LinearLayout, label: String, action: () -> Unit) {
        parent.addView(Button(activity).apply {
            text = label; isAllCaps = false; minHeight = dp(52)
            setTextColor(Color.rgb(7, 24, 47))
            backgroundTintList = android.content.res.ColorStateList.valueOf(blue)
            setOnClickListener { action() }
        }, LinearLayout.LayoutParams(-1, -2))
    }
    private fun card(parent: LinearLayout, title: String, subtitle: String, action: String, click: () -> Unit) {
        val box = LinearLayout(activity).apply {
            orientation = LinearLayout.VERTICAL; setPadding(dp(18), dp(14), dp(18), dp(14))
            background = GradientDrawable(GradientDrawable.Orientation.TL_BR,
                intArrayOf(Color.rgb(25, 64, 113), Color.rgb(19, 37, 64))).apply { cornerRadius = dp(20).toFloat() }
        }
        parent.addView(box, LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(16) })
        text(box, title, 23f, true); text(box, subtitle); button(box, action, click)
    }

    fun show(root: LinearLayout) {
        close(); container = root; root.removeAllViews()
        text(root, "TRAIN WITH PURPOSE", 12f, true)
        text(root, "Your next rep\nstarts here.", 34f, true)
        text(root, "Home movement. Club connection. Your pace.")
        text(root, "${history.getInt("sessions", 0)} sessions completed on this phone", 14f)
        card(root, "Everyday foundations", "3 movements  â€¢  2 sets each\nA gentle starting routine with form instructions and a rest timer.", "Start guided session") {
            current = 0; sets = 0; session()
        }
        card(root, "The gym manual", "Learn the movement before adding the effort. Understand reps, sets and recovery.", "Explore exercise guides") { manual() }
        card(root, "Your CFJ club", "Explore classes, manage your account and connect with your training community.", "Explore CFJ classes", openClub)
        button(root, "My account") { activity.startActivity(Intent(activity, AccountActivity::class.java)) }
    }

    private fun manual() {
        close(); val root = container ?: return; root.removeAllViews()
        text(root, "MOVEMENT LIBRARY", 12f, true); text(root, "Know your form.", 32f, true)
        text(root, "A rep is one complete movement. A set is a group of reps. For example, 2 Ã— 5 means five reps, a rest, then five more. Rest longer whenever you need it.")
        text(root, "Start comfortably and build gradually. Warm up first. Stop if you feel pain, dizziness or unusual breathlessness. Ask a qualified trainer for help with unfamiliar equipment.")
        exercises.forEachIndexed { index, exercise ->
            card(root, exercise.name, exercise.area, "View technique") { detail(index) }
        }
        button(root, "Watch NHS movement demonstrations") {
            try { activity.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://www.nhs.uk/live-well/exercise/strength-and-flex-exercise-plan-how-to-videos/"))) }
            catch (_: android.content.ActivityNotFoundException) { text(root, "Open nhs.uk in a browser to view the demonstrations.") }
        }
        button(root, "Back to training") { show(root) }
    }

    private fun detail(index: Int) {
        val root = container ?: return; root.removeAllViews(); val exercise = exercises[index]
        text(root, exercise.area, 12f, true); text(root, exercise.name, 32f, true)
        text(root, exercise.steps, 19f); text(root, "FORM CHECK", 12f, true); text(root, exercise.cue)
        text(root, "Practice a few comfortable repetitions first. The guided routine offers 2 sets of 5 reps with an optional 60-second rest; adjust to your ability.")
        button(root, "Start full guided routine") { current = 0; sets = 0; session() }
        button(root, "Back to manual") { manual() }
    }

    private fun session() {
        val root = container ?: return; root.removeAllViews(); val exercise = exercises[current]
        text(root, "GUIDED TRAINING â€¢ ${current + 1} / ${exercises.size}", 12f, true)
        text(root, exercise.name, 32f, true)
        text(root, "SET ${sets + 1} OF 2  /  5 REPS", 23f, true)
        text(root, exercise.steps); text(root, exercise.cue)
        val status = TextView(activity).apply { textSize = 22f; setTextColor(blue) }; root.addView(status)
        button(root, "Set complete") {
            // Ignore repeat taps during rest, so a single set cannot be counted twice.
            if (!resting) {
                sets++
                if (sets == 2) {
                    current++; sets = 0
                    if (current == exercises.size) finish() else session()
                } else {
                    resting = true
                    timer = object : CountDownTimer(60_000, 1000) {
                        override fun onTick(left: Long) { status.text = "Rest â€¢ ${left / 1000 + 1}s" }
                        override fun onFinish() { resting = false; session() }
                    }.start()
                }
            }
        }
        button(root, "Ready for next set / skip rest") { if (resting) { close(); session() } }
        button(root, "Leave session") { show(root) }
    }

    private fun finish() {
        val root = container ?: return; close(); root.removeAllViews()
        history.edit().putInt("sessions", history.getInt("sessions", 0) + 1).apply()
        text(root, "SESSION COMPLETE", 12f, true); text(root, "You showed up.", 34f, true)
        text(root, "Your completed session is saved on this phone. Take time to recover. This training history is separate from CFJ class attendance.")
        button(root, "Back to training") { show(root) }
    }
}
