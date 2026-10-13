package za.co.cfjlifestylefitness.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class RemoteProfileTest {
    @Test fun acceptsValidUnicodeNamesAndIntegerVersions() {
        assertEquals(RemoteProfile("Zoë 🌍", "Endurance", 2), RemoteProfile.fromFields("Zoë 🌍", "Endurance", 2))
        assertEquals(3L, RemoteProfile.fromFields("Demo Member", "Endurance", 3L).version)
    }
    @Test fun rejectsCoercedAndUnsafeVersions() {
        for (version in listOf(null, "2", 2.5, -1, 9007199254740992L)) {
            assertThrows(IllegalArgumentException::class.java) { RemoteProfile.fromFields("Demo Member", "Endurance", version) }
        }
    }
    @Test fun rejectsMalformedProfileFields() {
        for (name in listOf(null, 123, "A")) {
            assertThrows(IllegalArgumentException::class.java) { RemoteProfile.fromFields(name, "Endurance", 1) }
        }
        assertThrows(IllegalArgumentException::class.java) { RemoteProfile.fromFields("Demo Member", "unknown", 1) }
    }
}
