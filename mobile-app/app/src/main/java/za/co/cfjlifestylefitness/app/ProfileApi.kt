package za.co.cfjlifestylefitness.app

import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URI

data class RemoteProfile(val displayName: String, val goal: String, val version: Long)

class ProfileApi(private val origin: String, private val token: String, allowLocal: Boolean = false) {
    init {
        validateOrigin(origin, allowLocal)
        require(token.isNotBlank() && token.none { it.isWhitespace() }) { "Enter a valid access token." }
    }

    fun load(): RemoteProfile = request(null)
    fun save(profile: RemoteProfile): RemoteProfile = request(profile)

    private fun request(profile: RemoteProfile?): RemoteProfile {
        val connection = URI("${origin.trimEnd('/')}/api/v1/me").toURL().openConnection() as HttpURLConnection
        try {
            connection.connectTimeout = 10000
            connection.readTimeout = 10000
            connection.instanceFollowRedirects = false
            connection.setRequestProperty("Authorization", "Bearer $token")
            connection.setRequestProperty("Accept", "application/json")
            if (profile != null) {
                connection.requestMethod = "PATCH"
                connection.doOutput = true
                connection.setRequestProperty("Content-Type", "application/json")
                val json = JSONObject().put("displayName", profile.displayName).put("goal", profile.goal).put("version", profile.version)
                connection.outputStream.use { it.write(json.toString().toByteArray(Charsets.UTF_8)) }
            }
            when (connection.responseCode) {
                200 -> Unit
                401 -> throw IllegalStateException("Access denied. Check the token and load again.")
                409 -> throw IllegalStateException("Profile changed elsewhere. Load it again before saving.")
                400 -> throw IllegalStateException("The service rejected these profile details.")
                else -> throw IllegalStateException("Service unavailable. Your local preferences were not changed.")
            }
            val bytes = connection.inputStream.use { input ->
                val output = java.io.ByteArrayOutputStream()
                val buffer = ByteArray(1024)
                while (true) {
                    val count = input.read(buffer)
                    if (count < 0) break
                    require(output.size() + count <= 16384) { "Invalid service response." }
                    output.write(buffer, 0, count)
                }
                output.toByteArray()
            }
            val json = JSONObject(String(bytes, Charsets.UTF_8))
            val result = RemoteProfile(json.getString("displayName"), json.getString("goal"), json.getLong("version"))
            require(MemberPreferences(result.displayName, result.goal).validate(listOf("Build strength", "Weight loss", "Muscle tone", "Endurance")) == null && result.version >= 0) { "Invalid service response." }
            return result
        } finally { connection.disconnect() }
    }

    companion object {
        fun validateOrigin(origin: String, allowLocal: Boolean) {
            val uri = URI(origin)
            val local = allowLocal && uri.scheme == "http" && uri.host in listOf("127.0.0.1", "localhost", "10.0.2.2")
            require((uri.scheme == "https" || local) && !uri.host.isNullOrBlank() && uri.userInfo == null &&
                uri.query == null && uri.fragment == null && (uri.path.isNullOrEmpty() || uri.path == "/")) {
                "Use an HTTPS service address, or the local emulator address in a debug build."
            }
        }
    }
}
