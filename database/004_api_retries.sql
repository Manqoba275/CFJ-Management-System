-- Retain the actor and original retry key so retries remain safe after a restart.
ALTER TABLE cfj_attendance ADD (recorded_by VARCHAR2(40), original_request VARCHAR2(80));
ALTER TABLE cfj_payments ADD (recorded_by VARCHAR2(40), original_request VARCHAR2(80));
