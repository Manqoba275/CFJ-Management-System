package za.co.cfjlifestylefitness.app

class CommunityServiceFailure(message: String) : Exception(message)

fun communityFailureMessage(error: Throwable): String =
    if (error is CommunityServiceFailure) error.message ?: "Request not confirmed. Reload or retry."
    else "Unable to contact the service or read its response. Check your connection and retry."
