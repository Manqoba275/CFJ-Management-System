package za.co.cfjlifestylefitness.app

import android.app.Instrumentation
import android.content.Intent
import android.view.View
import android.view.ViewGroup
import android.webkit.WebView
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

/** Executes real WebView navigation and demo login on a clean test emulator. */
class WebsiteSmoke(private val instrumentation: Instrumentation) {
    fun run() {
        val activity = instrumentation.startActivitySync(Intent(instrumentation.targetContext, WebsiteActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        fun findWeb(view: View): WebView? {
            if (view is WebView) return view
            if (view is ViewGroup) for (i in 0 until view.childCount) findWeb(view.getChildAt(i))?.let { return it }
            return null
        }
        val web = findWeb(activity.window.decorView) ?: error("Website view missing")
        fun js(script: String): String {
            val ready = CountDownLatch(1)
            var value = ""
            instrumentation.runOnMainSync { web.evaluateJavascript(script) { value = it; ready.countDown() } }
            check(ready.await(10, TimeUnit.SECONDS)) { "JavaScript timed out" }
            return value
        }
        fun awaitPage(file: String) {
            val deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(30)
            while (System.nanoTime() < deadline) {
                if (js("location.pathname.endsWith('/$file') && document.readyState === 'complete' && document.body.innerText.length > 30") == "true") return
                Thread.sleep(200)
            }
            error("Page did not render: $file")
        }
        fun screenshot(name: String) {
            val bitmap = instrumentation.uiAutomation.takeScreenshot() ?: error("Screenshot unavailable")
            val file = java.io.File(activity.getExternalFilesDir(null), name)
            file.outputStream().use { bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, it) }
            bitmap.recycle()
        }
        try {
            awaitPage("index.html")
            check(js("document.querySelectorAll('img').length > 0 && Array.from(document.images).some(i => i.naturalWidth > 0)") == "true")
            screenshot("task3-website-home.png")
            js("localStorage.clear(); location.href='member-login.html'")
            awaitPage("member-login.html")
            js("document.getElementById('memberLoginForm').requestSubmit()")
            awaitPage("members.html")
            check(js("document.getElementById('profileName').textContent !== 'Please log in'") == "true")
            screenshot("task3-website-member.png")
            js("location.reload()")
            awaitPage("members.html")
            check(js("document.getElementById('profileName').textContent !== 'Please log in'") == "true")
            js("location.href='help.html'")
            awaitPage("help.html")
        } finally { instrumentation.runOnMainSync { activity.finish() } }
    }
}
