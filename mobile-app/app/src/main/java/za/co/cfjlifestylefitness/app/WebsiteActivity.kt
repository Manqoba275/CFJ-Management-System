package za.co.cfjlifestylefitness.app

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.content.ActivityNotFoundException
import android.os.Bundle
import android.view.WindowInsets
import android.webkit.*
import android.widget.*
import androidx.webkit.WebViewAssetLoader

/** Uses Android's HTTPS asset loader; no file access or native JavaScript bridge.
 * Website demo records remain on this phone. Firebase sign-in stays native.
 */
class WebsiteActivity : Activity() {
    private lateinit var web: WebView
    private lateinit var status: TextView
    private val home = "https://appassets.androidplatform.net/assets/site/index.html"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        root.setOnApplyWindowInsetsListener { view, insets ->
            if (android.os.Build.VERSION.SDK_INT >= 30) {
                val bars = insets.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.ime())
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            } else {
                @Suppress("DEPRECATION")
                view.setPadding(insets.systemWindowInsetLeft, insets.systemWindowInsetTop, insets.systemWindowInsetRight, insets.systemWindowInsetBottom)
            }
            insets
        }
        val actions = LinearLayout(this)
        fun action(label: String, run: () -> Unit) {
            actions.addView(Button(this).apply { text = label; setOnClickListener { run() } }, LinearLayout.LayoutParams(0, -2, 1f))
        }
        action("Back") { navigateBack() }
        action("Home") { web.loadUrl(home) }
        action("Reload") { web.reload() }
        root.addView(actions)
        status = TextView(this).apply {
            text = "Website preview · demo records stay on this phone"
            setPadding(16, 8, 16, 8)
            accessibilityLiveRegion = android.view.View.ACCESSIBILITY_LIVE_REGION_POLITE
        }
        root.addView(status)
        web = WebView(this)
        root.addView(web, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(root)
        val assets = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this)).build()
        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            setSupportMultipleWindows(false)
            javaScriptCanOpenWindowsAutomatically = false
        }
        CookieManager.getInstance().setAcceptThirdPartyCookies(web, false)
        web.webChromeClient = WebChromeClient()
        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? = assets.shouldInterceptRequest(request.url)
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                if (url.scheme == "https" && url.host == "appassets.androidplatform.net") {
                    if (url.lastPathSegment == "account.html") {
                        startActivity(Intent(this@WebsiteActivity, AccountActivity::class.java))
                        return true
                    }
                    return false
                }
                if (url.scheme in listOf("https", "mailto", "tel")) {
                    try { startActivity(Intent(Intent.ACTION_VIEW, url)) }
                    catch (_: ActivityNotFoundException) { status.text = "No app is available to open this link." }
                } else status.text = "This link is not supported."
                return true
            }
            override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                if (request.isForMainFrame) status.text = "Page unavailable. Use Home or Reload to try again."
            }
        }
        if (savedInstanceState == null || web.restoreState(savedInstanceState) == null) web.loadUrl(home)
        if (android.os.Build.VERSION.SDK_INT >= 33) {
            onBackInvokedDispatcher.registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT) { navigateBack() }
        }
    }
    private fun navigateBack() { if (web.canGoBack()) web.goBack() else finish() }
    @Deprecated("Legacy Android back navigation")
    override fun onBackPressed() { navigateBack() }
    override fun onSaveInstanceState(outState: Bundle) { web.saveState(outState); super.onSaveInstanceState(outState) }
    override fun onPause() { web.onPause(); super.onPause() }
    override fun onResume() { super.onResume(); web.onResume() }
    override fun onDestroy() { web.stopLoading(); web.destroy(); super.onDestroy() }
}
