package za.co.cfjlifestylefitness.app

import android.annotation.SuppressLint
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import android.net.Uri
import android.content.Intent
import android.content.ActivityNotFoundException
import android.os.Bundle
import android.view.WindowInsets
import android.webkit.*
import android.widget.*
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature

/** Uses Android's HTTPS asset loader; no file access or authentication bridge.
 * Website demo records remain on this phone. Firebase sign-in stays native.
 */
class WebsiteActivity : ComponentActivity() {
    private lateinit var web: WebView
    private lateinit var status: TextView
    private val home = "https://appassets.androidplatform.net/assets/site/index.html"
    private var fileCallback: ValueCallback<Array<Uri>>? = null
    private var pendingReport: String? = null
    private val chooseFile = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        fileCallback?.onReceiveValue(uri?.let { arrayOf(it) }); fileCallback = null
    }
    private val saveReport = registerForActivityResult(ActivityResultContracts.CreateDocument("application/json")) { uri ->
        val report = pendingReport; pendingReport = null
        if (uri != null && report != null) {
            Thread {
                val saved = runCatching { contentResolver.openOutputStream(uri)?.use { it.write(report.toByteArray(Charsets.UTF_8)) } ?: error("No output stream") }
                runOnUiThread { if (!isDestroyed) status.text = if (saved.isSuccess) "Report saved." else "Could not save the report. Try exporting again." }
            }.start()
        }
    }

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
        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(view: WebView, callback: ValueCallback<Array<Uri>>, params: FileChooserParams): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                try { chooseFile.launch("image/*") }
                catch (_: ActivityNotFoundException) { fileCallback?.onReceiveValue(null); fileCallback = null; status.text = "No image picker is available." }
                return true
            }
        }
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            // Only the packaged reports page may request a bounded, user-selected JSON export.
            WebViewCompat.addWebMessageListener(web, "cfjExport", setOf("https://appassets.androidplatform.net")) { view, message, origin, mainFrame, _ ->
                val data = message.data
                if (mainFrame && origin.toString() == "https://appassets.androidplatform.net" &&
                    Uri.parse(view.url).path == "/assets/site/reports.html" && data != null && data.length <= 1_000_000 && pendingReport == null) {
                    val valid = runCatching { org.json.JSONObject(data) }.isSuccess
                    if (valid) {
                        pendingReport = data
                        try { saveReport.launch("cfj-admin-report.json") }
                        catch (_: ActivityNotFoundException) { pendingReport = null; status.text = "No document picker is available." }
                    }
                }
            }
        }
        web.setDownloadListener { _, _, _, _, _ -> status.text = "This WebView cannot download this file. Update Android System WebView or export from the website in your browser." }
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
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() { navigateBack() }
        })
    }
    private fun navigateBack() { if (web.canGoBack()) web.goBack() else finish() }
    override fun onSaveInstanceState(outState: Bundle) { web.saveState(outState); super.onSaveInstanceState(outState) }
    override fun onPause() { web.onPause(); super.onPause() }
    override fun onResume() { super.onResume(); web.onResume() }
    override fun onDestroy() { fileCallback?.onReceiveValue(null); fileCallback = null; web.stopLoading(); web.destroy(); super.onDestroy() }
}
