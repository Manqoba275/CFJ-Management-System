package za.co.cfjlifestylefitness.app.specification

/** Business acceptance examples; compare IDs/expected outcomes with the website JSON. */
data class BookingExample(
    val id: String,
    val online: Boolean,
    val signedIn: Boolean,
    val alreadyBooked: Boolean,
    val spaces: Int,
    val expected: String
)

object BookingExamples {
    val all = listOf(
        BookingExample("BOOK-01", true, true, false, 1, "READY"),
        BookingExample("BOOK-02", false, true, false, 4, "OFFLINE"),
        BookingExample("BOOK-03", true, false, false, 4, "SIGN_IN_REQUIRED"),
        BookingExample("BOOK-04", true, true, true, 4, "ALREADY_BOOKED"),
        BookingExample("BOOK-05", true, true, false, 0, "FULL"),
        BookingExample("BOOK-06", true, true, false, -1, "INVALID_CAPACITY"),
        BookingExample("BOOK-07", true, true, true, 0, "ALREADY_BOOKED")
    )
}
