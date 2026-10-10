package za.co.cfjlifestylefitness.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Test
import java.io.IOException

class CommunityFailureTest {
    @Test fun networkAndUnexpectedFailuresDoNotExposeRawDetails() {
        for (error in listOf(IOException("private-host/token"), IllegalStateException("private response"))) {
            val message = communityFailureMessage(error)
            assertFalse(message.contains("private"))
            assertEquals("Unable to contact the service or read its response. Check your connection and retry.", message)
        }
    }
    @Test fun actionableServiceMessageIsPreserved() {
        assertEquals("Access denied. Check the member token.", communityFailureMessage(CommunityServiceFailure("Access denied. Check the member token.")))
    }
}
