# Active Oracle installation and operations

Use the cfj_* schema with the current API. Do not install the alternative-proposal schema into the application account.

1. Create the restricted CFJ_APP account and tablespace quota as described in README.md.
2. On a fresh account only, run database/001_profiles.sql once using SQL Developer or SQLcl.
3. Run node --env-file=.env.oracle scripts/migrate-oracle.mjs for additive files 002_operations.sql, 003_community.sql and 004_api_retries.sql.
4. Run node --env-file=.env.oracle scripts/seed-oracle.mjs to insert reserved synthetic records without resetting existing rows.
5. Run scripts/verify-oracle-schema.mjs, verify-oracle-profile.mjs and verify-oracle-operations.mjs with the same environment file. Save actual results.
6. For Firebase identity mapping and the dedicated server, follow docs/FIREBASE_ORACLE_CONNECTION.md.

The scripts in design/alternative-proposal preserve Tshifhiwa's earlier independent design for review. They are not migrations for the CFJ API. That proposal's capacity/rating checks now reject fractions before Oracle can round them, and its friend-pair index rejects reversed duplicates. These changes have not been executed against Oracle in this session.

The current listener is unavailable. Previous schema evidence does not prove that today's adapters, migrations or recovery checks passed.

Back up before database changes. scripts/verify-oracle-recovery.mjs verifies a logical data backup by restoring into isolated scratch tables and comparing hashes; it is not a full schema/grants/indexes recovery procedure. Keep backup data and credentials outside Git.
