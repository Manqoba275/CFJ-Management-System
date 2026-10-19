-- Creates the first two related tables. The sample members are fictional and do not represent real CFJ accounts.
-- Run once as CFJ_APP in FREEPDB1. Synthetic development records only.
CREATE TABLE cfj_members (
  member_id NUMBER(10) PRIMARY KEY,
  identity_uid VARCHAR2(128) NOT NULL UNIQUE,
  email VARCHAR2(254) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
-- A profile belongs to one member; the foreign key prevents orphaned profile records.
CREATE TABLE cfj_profiles (
  member_id NUMBER(10) PRIMARY KEY REFERENCES cfj_members(member_id),
  display_name VARCHAR2(60 CHAR) NOT NULL,
  goal VARCHAR2(30) NOT NULL,
  version NUMBER(10) DEFAULT 0 NOT NULL,
  CONSTRAINT cfj_profile_goal CHECK (goal IN ('Build strength','Weight loss','Muscle tone','Endurance')),
  CONSTRAINT cfj_profile_version CHECK (version >= 0 AND version = TRUNC(version))
);
-- These ten fictional rows make local testing repeatable without using anyone’s personal details.
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO cfj_members(member_id, identity_uid, email)
      VALUES(i, 'synthetic-' || i, 'member' || i || '@example.invalid');
    INSERT INTO cfj_profiles(member_id, display_name, goal, version)
      VALUES(i, 'Synthetic Member ' || i, 'Build strength', 0);
  END LOOP;
  COMMIT;
END;
/
