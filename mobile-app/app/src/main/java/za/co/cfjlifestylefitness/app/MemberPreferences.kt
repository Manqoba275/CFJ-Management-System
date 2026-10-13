package za.co.cfjlifestylefitness.app

/** Local preview preferences only; the future API remains the authority for member records. */
data class MemberPreferences(val displayName: String, val goal: String) {
    enum class Error { NAME, GOAL }

    fun validate(allowedGoals: List<String>): Error? = when {
        displayName.trim().length !in 2..60 -> Error.NAME
        goal !in allowedGoals -> Error.GOAL
        else -> null
    }
}
