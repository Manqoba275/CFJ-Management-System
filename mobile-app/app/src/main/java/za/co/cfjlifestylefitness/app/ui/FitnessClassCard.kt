package za.co.cfjlifestylefitness.app.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import za.co.cfjlifestylefitness.app.R
import za.co.cfjlifestylefitness.app.booking.BookingEligibility
import za.co.cfjlifestylefitness.app.model.FitnessClassSummary

/** Reusable UI. The caller supplies state and handles the eventual server request. */
object FitnessClassCard {
    fun create(parent: ViewGroup, summary: FitnessClassSummary, result: BookingEligibility.Result,
               onRequest: (String) -> Unit): View {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.view_fitness_class, parent, false)
        view.findViewById<TextView>(R.id.class_name).text = summary.name
        val spaces = parent.context.resources.getQuantityString(R.plurals.class_spaces_available, summary.spaces, summary.spaces)
        view.findViewById<TextView>(R.id.class_details).text = parent.context.getString(R.string.class_details_format, summary.trainer, spaces)
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
            contentDescription = context.getString(R.string.class_request_label, summary.name)
            setOnClickListener { onRequest(summary.id) }
        }
        return view
    }
}
