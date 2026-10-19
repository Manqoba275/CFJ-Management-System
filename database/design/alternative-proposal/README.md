# Alternative database proposal

This folder preserves Tshifhiwa's original unprefixed-table contribution for design review. It is not the schema consumed by the current API and must not be run as part of the active migration chain. Its seed, reporting and test files apply only to this alternative schema.

The active schema lives in database/001_profiles.sql through 004_api_retries.sql and includes membership entitlements. See database/OPERATIONS.md. Existing data is not migrated or deleted by this reconciliation.

The alternative migration now prevents fractional capacities/ratings and reversed duplicate friendships. No live Oracle execution of these changes is claimed. Adopting additional concepts such as trainer reviews or application roles requires a reviewed additive cfj_* migration and API tests; copying these tables alongside cfj_* does not integrate them.
