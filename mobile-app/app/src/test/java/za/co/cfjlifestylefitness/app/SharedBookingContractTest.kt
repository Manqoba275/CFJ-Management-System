package za.co.cfjlifestylefitness.app

import org.junit.Assert.assertEquals
import org.junit.Test
import za.co.cfjlifestylefitness.app.booking.BookingEligibility

class SharedBookingContractTest {
    @Test fun sharedWebsiteAndAndroidDecisionsMatch() {
        val fixture = requireNotNull(javaClass.getResourceAsStream("/booking-eligibility.tsv"))
        val rows = fixture.bufferedReader().use { it.readLines() }.drop(1).filter { it.isNotBlank() }
        assertEquals(24, rows.size)
        rows.forEach { row ->
            val fields = row.split('\t')
            assertEquals(row, 5, fields.size)
            val actual = BookingEligibility.evaluate(
                fields[0].toBooleanStrict(), fields[1].toBooleanStrict(),
                fields[2].toBooleanStrict(), fields[3].toInt()
            )
            assertEquals(row, fields[4], actual.name)
        }
    }
}
