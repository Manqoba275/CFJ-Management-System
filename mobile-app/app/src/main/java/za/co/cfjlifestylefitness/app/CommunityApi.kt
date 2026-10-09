package za.co.cfjlifestylefitness.app

import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URI

class CommunityApi(private val origin: String, private val token: String) {
    init {
        ProfileApi.validateOrigin(origin, BuildConfig.DEBUG)
        require(token.isNotBlank() && token.none { it.isWhitespace() }) { "Enter a valid access token." }
    }

    fun list(path: String): List<JSONObject> {
        val array = JSONArray(request(path, null))
        return (0 until array.length()).map { array.getJSONObject(it) }
    }

    fun send(path: String, body: JSONObject) { request(path, body) }

    private fun request(path: String, body: JSONObject?): String {
        val connection = URI("${origin.trimEnd('/')}/api/v1$path").toURL().openConnection() as HttpURLConnection
        try {
            connection.connectTimeout = 10000
            connection.readTimeout = 10000
            connection.instanceFollowRedirects = false
            connection.setRequestProperty("Authorization", "Bearer $token")
            connection.setRequestProperty("Accept", "application/json")
            if (body != null) {
                connection.requestMethod = "POST"
                connection.doOutput = true
                connection.setRequestProperty("Content-Type", "application/json")
                connection.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
            }
            when (connection.responseCode) {
                200, 201 -> Unit
                401 -> error("Access denied. Check the member token.")
                403 -> error(if (path == "/exercises") "Sample guides require a simulated member payment." else "This action requires a member account.")
                404 -> error("Record unavailable. Only the recipient can accept a connection.")
                else -> error("Request not confirmed. Reload or retry.")
            }
            return connection.inputStream.use { input ->
                val output = java.io.ByteArrayOutputStream()
                val buffer = ByteArray(1024)
                while (true) {
                    val count = input.read(buffer)
                    if (count < 0) break
                    require(output.size() + count <= 65536) { "Service response is too large." }
                    output.write(buffer, 0, count)
                }
                String(output.toByteArray(), Charsets.UTF_8)
            }
        } finally { connection.disconnect() }
    }
}
