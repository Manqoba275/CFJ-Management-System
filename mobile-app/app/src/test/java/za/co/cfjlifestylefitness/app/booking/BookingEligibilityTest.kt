package za.co.cfjlifestylefitness.app.booking

import org.junit.Assert.assertEquals
import org.junit.Assert.fail
import org.junit.Test
import za.co.cfjlifestylefitness.app.model.FitnessClassSummary
import za.co.cfjlifestylefitness.app.specification.BookingExamples

class BookingEligibilityTest {
    @Test fun allBusinessExamplesAgreeWithThePreviewPolicy() {
        BookingExamples.all.forEach { example ->
            assertEquals(example.id, example.expected,
                BookingEligibility.evaluate(example.online, example.signedIn, example.alreadyBooked, example.spaces).name)
        }
    }

    @Test fun classModelRejectsInvalidAvailabilityAndBlankIdentifiers() {
        listOf<() -> Unit>(
            { FitnessClassSummary("C-DEMO", "Strength", "Demo", -1) },
            { FitnessClassSummary(" ", "Strength", "Demo", 4) },
            { FitnessClassSummary("C-DEMO", "Strength", " ", 4) }
        ).forEach { invalid ->
            try { invalid(); fail("Invalid class data was accepted") }
            catch (_: IllegalArgumentException) { /* Expected validation failure. */ }
        }
    }

    @Test fun validClassPreservesItsIdentity() {
        val summary = FitnessClassSummary("C-DEMO", "Strength", "Demo", 1)
        assertEquals("C-DEMO", summary.id)
        assertEquals(1, summary.spaces)
    }
}
