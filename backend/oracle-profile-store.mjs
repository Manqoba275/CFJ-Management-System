// Reads and saves profiles in Oracle. Each request borrows a connection and returns it when finished.
import oracledb from 'oracledb';

// One synthetic development identity; hosted identity mapping is a separate step.
export function oracleProfileStore(pool, memberId = 1) {
  return {
    async load() {
      const connection = await pool.getConnection();
      try {
        const result = await connection.execute(
          'SELECT display_name, goal, version FROM cfj_profiles WHERE member_id = :id',
          { id: memberId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        if (!result.rows.length) throw new Error('Profile not provisioned');
        const row = result.rows[0];
        return { displayName: row.DISPLAY_NAME, goal: row.GOAL, version: row.VERSION };
      } finally { await connection.close(); }
    },
    // Match the saved version in SQL so a later edit cannot silently overwrite another client’s change.
    async update(value) {
      const connection = await pool.getConnection();
      try {
        const result = await connection.execute(
          'UPDATE cfj_profiles SET display_name = :name, goal = :goal, version = version + 1 WHERE member_id = :id AND version = :version',
          { name: value.displayName.trim(), goal: value.goal, id: memberId, version: value.version },
          { autoCommit: true });
        // No matching row means the caller needs to reload before trying again.
        return result.rowsAffected === 1
          ? { displayName: value.displayName.trim(), goal: value.goal, version: value.version + 1 } : null;
      } finally { await connection.close(); }
    }
  };
}
