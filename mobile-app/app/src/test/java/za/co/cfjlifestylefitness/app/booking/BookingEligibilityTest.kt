package za.co.cfjlifestylefitness.app.booking

import org.junit.Assert.assertEquals
import org.junit.Test

class BookingEligibilityTest {
    @Test fun allBusinessExamplesAgreeWithThePreviewPolicy() {
        val examples = listOf(
            Example(true, true, false, 1, "READY"),
            Example(true, true, false, 0, "FULL"),
            Example(false, true, false, 1, "OFFLINE"),
            Example(true, false, false, 1, "SIGN_IN_REQUIRED"),
            Example(true, true, true, 1, "ALREADY_BOOKED"),
            Example(true, true, false, -1, "INVALID_CAPACITY")
        )
        examples.forEach { example ->
            assertEquals(example.expected,
                BookingEligibility.evaluate(example.online, example.signedIn, example.alreadyBooked, example.spaces).name)
        }
    }

    private data class Example(val online: Boolean, val signedIn: Boolean, val alreadyBooked: Boolean,
                               val spaces: Int, val expected: String)
}
