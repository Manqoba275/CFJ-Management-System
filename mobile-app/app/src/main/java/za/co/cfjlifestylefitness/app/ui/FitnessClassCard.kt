package za.co.cfjlifestylefitness.app.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import za.co.cfjlifestylefitness.app.R
import za.co.cfjlifestylefitness.app.booking.BookingEligibility

/** Reusable UI. The caller supplies state and handles the eventual server request. */
object FitnessClassCard {
    fun create(parent: ViewGroup, classId: String, className: String, trainer: String, spacesAvailable: Int,
               result: BookingEligibility.Result, onRequest: (String) -> Unit): View {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.view_fitness_class, parent, false)
        view.findViewById<TextView>(R.id.class_name).text = className
        val spaces = parent.context.resources.getQuantityString(R.plurals.class_spaces_available, spacesAvailable, spacesAvailable)
        view.findViewById<TextView>(R.id.class_details).text = parent.context.getString(R.string.class_details_format, trainer, spaces)
        val status = when (result) {
            BookingEligibility.Result.READY -> R.string.class_preview_ready
            BookingEligibility.Result.OFFLINE -> R.string.class_preview_offline
            BookingEligibility.Result.SIGN_IN_REQUIRED -> R.string.class_preview_guest
            BookingEligibility.Result.ALREADY_BOOKED -> R.string.class_preview_duplicate
            BookingEligibility.Result.FULL -> R.string.class_preview_full
            BookingEligibility.Result.INVALID_CAPACITY -> R.string.class_preview_invalid
        }
        view.findViewById<TextView>(R.id.class_booking_status).setText(status)
        view.findViewById<Button>(R.id.class_request).apply {
            isEnabled = result == BookingEligibility.Result.READY
            contentDescription = context.getString(R.string.class_request_label, className)
            setOnClickListener { onRequest(classId) }
        }
        return view
    }
}
