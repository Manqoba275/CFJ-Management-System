package za.co.cfjlifestylefitness.app

import org.junit.Test
import org.junit.Assert.assertThrows

class ProfileApiTest {
    @Test fun releaseRequiresHttps() {
        ProfileApi.validateOrigin("https://example.com", false)
        assertThrows(IllegalArgumentException::class.java) { ProfileApi.validateOrigin("http://127.0.0.1:8787", false) }
    }
    @Test fun debugOnlyAllowsLocalCleartext() {
        ProfileApi.validateOrigin("http://10.0.2.2:8787", true)
        assertThrows(IllegalArgumentException::class.java) { ProfileApi.validateOrigin("http://example.com", true) }
    }
    @Test fun originsCannotContainCredentialsOrPaths() {
        for (url in listOf("https://user:password@example.com", "https://example.com/path", "https://example.com?token=value", "https://example.com#fragment")) {
            assertThrows(IllegalArgumentException::class.java) { ProfileApi.validateOrigin(url, true) }
        }
    }
}
