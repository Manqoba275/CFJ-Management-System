package za.co.cfjlifestylefitness.app.model

/** Same field names as the website response contract; availability is a server snapshot. */
data class FitnessClassSummary(val id: String, val name: String, val trainer: String, val spaces: Int) {
    init {
        require(id.isNotBlank()) { "Class ID is required" }
        require(name.isNotBlank()) { "Class name is required" }
        require(trainer.isNotBlank()) { "Trainer name is required" }
        require(spaces >= 0) { "Spaces cannot be negative" }
    }
}
