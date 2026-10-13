package za.co.cfjlifestylefitness.app.booking

/** Preview eligibility only. READY is not a booking confirmation from the API. */
object BookingEligibility {
    enum class Result { INVALID_CAPACITY, OFFLINE, SIGN_IN_REQUIRED, ALREADY_BOOKED, FULL, READY }

    fun evaluate(online: Boolean, signedIn: Boolean, alreadyBooked: Boolean, spaces: Int): Result = when {
        spaces < 0 -> Result.INVALID_CAPACITY
        !online -> Result.OFFLINE
        !signedIn -> Result.SIGN_IN_REQUIRED
        alreadyBooked -> Result.ALREADY_BOOKED
        spaces == 0 -> Result.FULL
        else -> Result.READY
    }
}
