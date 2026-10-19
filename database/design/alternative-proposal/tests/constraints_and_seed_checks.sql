-- Run only after applying the migration and seed scripts in a disposable Oracle schema.
SELECT 'APP_USER' table_name, COUNT(*) row_count FROM app_user UNION ALL
SELECT 'MEMBER', COUNT(*) FROM member UNION ALL
SELECT 'MEMBER_PREFERENCE', COUNT(*) FROM member_preference UNION ALL
SELECT 'TRAINER', COUNT(*) FROM trainer UNION ALL
SELECT 'FITNESS_CLASS', COUNT(*) FROM fitness_class UNION ALL
SELECT 'BOOKING', COUNT(*) FROM booking UNION ALL
SELECT 'ATTENDANCE', COUNT(*) FROM attendance UNION ALL
SELECT 'PAYMENT', COUNT(*) FROM payment UNION ALL
SELECT 'EXERCISE', COUNT(*) FROM exercise UNION ALL
SELECT 'FRIEND_CONNECTION', COUNT(*) FROM friend_connection UNION ALL
SELECT 'TRAINER_REQUEST', COUNT(*) FROM trainer_request UNION ALL
SELECT 'TRAINER_REVIEW', COUNT(*) FROM trainer_review UNION ALL
SELECT 'MARATHON_EVENT', COUNT(*) FROM marathon_event UNION ALL
SELECT 'MARATHON_REGISTRATION', COUNT(*) FROM marathon_registration;

-- This query should return zero rows in a valid dataset.
SELECT id,name,spaces FROM v_class_availability WHERE spaces < 0;

-- Negative tests: run individually; each must fail with a constraint violation.
-- INSERT INTO fitness_class(class_id,class_name,trainer_id,starts_at,capacity)
-- VALUES ('BAD0','Bad capacity','T001',SYSTIMESTAMP,0);
-- INSERT INTO trainer_review(review_id,member_id,trainer_id,rating)
-- VALUES ('BADRV','M001','T001',6);
-- INSERT INTO booking(booking_id,class_id,member_id,status)
-- VALUES ('BADB','C001','M001','CONFIRMED'); -- duplicate class/member
-- Record actual output; do not treat comments as executed tests.

-- Executable negative checks for the corrected alternative design; run after its synthetic seed.
-- Each block must reject the insert. No test row is committed.
BEGIN
  BEGIN
    INSERT INTO fitness_class(class_id,class_name,trainer_id,starts_at,capacity)
    VALUES ('BAD-FRACTION','Fraction test','T001',SYSTIMESTAMP,1.5);
    RAISE_APPLICATION_ERROR(-20001,'Fractional capacity was accepted');
  EXCEPTION WHEN OTHERS THEN IF SQLCODE != -2290 THEN RAISE; END IF; END;
  BEGIN
    INSERT INTO trainer_review(review_id,member_id,trainer_id,rating)
    VALUES ('BAD-FRACTION','M001','T002',2.5);
    RAISE_APPLICATION_ERROR(-20002,'Fractional rating was accepted');
  EXCEPTION WHEN OTHERS THEN IF SQLCODE != -2290 THEN RAISE; END IF; END;
  BEGIN
    INSERT INTO friend_connection(connection_id,member_id,friend_member_id,status)
    VALUES ('BAD-REVERSE','M002','M001','PENDING');
    RAISE_APPLICATION_ERROR(-20003,'Reversed friendship was accepted');
  EXCEPTION WHEN OTHERS THEN IF SQLCODE != -1 THEN RAISE; END IF; END;
  ROLLBACK;
  DBMS_OUTPUT.PUT_LINE('PASS: fractional values and reversed friendship rejected');
EXCEPTION WHEN OTHERS THEN ROLLBACK; RAISE;
END;
/
