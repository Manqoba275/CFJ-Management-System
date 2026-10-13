package za.co.cfjlifestylefitness.app

import org.junit.Assert.assertEquals
import org.junit.Test
import za.co.cfjlifestylefitness.app.booking.BookingEligibility
import za.co.cfjlifestylefitness.app.booking.BookingEligibility.Result

class BookingRulesTest {
    @Test fun availableClassRequiresOnlineSignedInMember() {
        assertEquals(Result.READY, BookingEligibility.evaluate(true, true, false, 1))
        assertEquals(Result.OFFLINE, BookingEligibility.evaluate(false, true, false, 1))
        assertEquals(Result.SIGN_IN_REQUIRED, BookingEligibility.evaluate(true, false, false, 1))
    }

    @Test fun fullAndInvalidClassesRejectRequests() {
        assertEquals(Result.FULL, BookingEligibility.evaluate(true, true, false, 0))
        assertEquals(Result.INVALID_CAPACITY, BookingEligibility.evaluate(true, true, false, -1))
    }

    @Test fun rejectionPrecedenceIsConsistent() {
        assertEquals(Result.ALREADY_BOOKED, BookingEligibility.evaluate(true, true, true, 0))
        assertEquals(Result.OFFLINE, BookingEligibility.evaluate(false, false, true, 0))
        assertEquals(Result.INVALID_CAPACITY, BookingEligibility.evaluate(false, false, true, -1))
    }
}
