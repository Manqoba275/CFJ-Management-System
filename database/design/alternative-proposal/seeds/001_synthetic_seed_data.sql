-- Synthetic development data only; run after 001_initial_schema.sql.
-- This creates 10 fictional rows in every table. Do not run repeatedly without cleanup.
BEGIN
 FOR i IN 1..10 LOOP
  INSERT INTO app_user(user_id,identity_uid,role)
  VALUES ('U'||LPAD(i,3,'0'),'SYNTHETIC_UID_'||LPAD(i,3,'0'),
    CASE WHEN i <= 8 THEN 'MEMBER' WHEN i=9 THEN 'TRAINER' ELSE 'ADMIN' END);
  INSERT INTO member(member_id,user_id,display_name,email,status)
  VALUES ('M'||LPAD(i,3,'0'),'U'||LPAD(i,3,'0'),'Demo Member '||i,
    'member'||i||'@example.invalid','ACTIVE');
  INSERT INTO member_preference(member_id,preferred_contact,marketing_opt_in)
  VALUES ('M'||LPAD(i,3,'0'),CASE MOD(i,3) WHEN 0 THEN 'NONE' WHEN 1 THEN 'EMAIL' ELSE 'PHONE' END,
    CASE WHEN MOD(i,2)=0 THEN 'Y' ELSE 'N' END);
  INSERT INTO trainer(trainer_id,user_id,display_name,active_flag)
  VALUES ('T'||LPAD(i,3,'0'),CASE WHEN i=9 THEN 'U009' ELSE NULL END,'Demo Coach '||i,'Y');
  INSERT INTO fitness_class(class_id,class_name,trainer_id,starts_at,capacity,status)
  VALUES ('C'||LPAD(i,3,'0'),'Demo Fitness Class '||i,'T'||LPAD(i,3,'0'),
    SYSTIMESTAMP+NUMTODSINTERVAL(i,'DAY'),12,'SCHEDULED');
  INSERT INTO booking(booking_id,class_id,member_id,status)
  VALUES ('B'||LPAD(i,3,'0'),'C'||LPAD(i,3,'0'),'M'||LPAD(i,3,'0'),'CONFIRMED');
  INSERT INTO attendance(attendance_id,booking_id,attended_flag)
  VALUES ('A'||LPAD(i,3,'0'),'B'||LPAD(i,3,'0'),CASE WHEN MOD(i,2)=0 THEN 'Y' ELSE 'N' END);
  INSERT INTO payment(payment_id,member_id,amount,currency,status,reference_code)
  VALUES ('P'||LPAD(i,3,'0'),'M'||LPAD(i,3,'0'),100*i,'ZAR','SIMULATED','DEMO-PAY-'||i);
  INSERT INTO exercise(exercise_id,exercise_name,description)
  VALUES ('E'||LPAD(i,3,'0'),'Demo Exercise '||i,'Fictional seed description '||i);
  INSERT INTO friend_connection(connection_id,member_id,friend_member_id,status)
  VALUES ('F'||LPAD(i,3,'0'),'M'||LPAD(i,3,'0'),'M'||LPAD(MOD(i,10)+1,3,'0'),'PENDING');
  INSERT INTO trainer_request(request_id,member_id,trainer_id,message,status)
  VALUES ('TR'||LPAD(i,3,'0'),'M'||LPAD(i,3,'0'),'T'||LPAD(i,3,'0'),'Synthetic request '||i,'PENDING');
  INSERT INTO trainer_review(review_id,member_id,trainer_id,rating,review_text)
  VALUES ('RV'||LPAD(i,3,'0'),'M'||LPAD(i,3,'0'),'T'||LPAD(i,3,'0'),MOD(i-1,5)+1,'Synthetic review '||i);
  INSERT INTO marathon_event(event_id,event_name,event_date,capacity,status)
  VALUES ('ME'||LPAD(i,3,'0'),'Demo Marathon Event '||i,TRUNC(SYSDATE)+i+30,100,'OPEN');
  INSERT INTO marathon_registration(registration_id,event_id,full_name,email,status)
  VALUES ('MR'||LPAD(i,3,'0'),'ME'||LPAD(i,3,'0'),'Demo Runner '||i,
    'runner'||i||'@example.invalid','REGISTERED');
 END LOOP;
 COMMIT;
EXCEPTION WHEN OTHERS THEN
 ROLLBACK;
 RAISE;
END;
/
-- Run database/design/alternative-proposal/tests/constraints_and_seed_checks.sql and verify 10 rows per table.
