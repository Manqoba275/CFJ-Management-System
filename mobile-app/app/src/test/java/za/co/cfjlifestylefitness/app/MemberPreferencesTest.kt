package za.co.cfjlifestylefitness.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class MemberPreferencesTest {
    private val goals = listOf("Build strength", "Endurance")

    @Test fun rejectsBlankNameBeforeSaving() {
        assertEquals(MemberPreferences.Error.NAME, MemberPreferences("   ", "Endurance").validate(goals))
    }
    @Test fun rejectsNameOutsideStorageLimit() {
        assertEquals(MemberPreferences.Error.NAME, MemberPreferences("a".repeat(61), "Endurance").validate(goals))
    }
    @Test fun rejectsUnknownGoalInsteadOfSavingInvalidSelection() {
        assertEquals(MemberPreferences.Error.GOAL, MemberPreferences("Manqoba", "unknown").validate(goals))
    }
    @Test fun acceptsUnicodeNameAndSupportedGoal() {
        assertNull(MemberPreferences("Léa Ndlovu", "Build strength").validate(goals))
    }
}
