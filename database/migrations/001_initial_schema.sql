-- CFJ Management System Oracle schema. Apply once to a dedicated development schema.
CREATE TABLE app_user (
 user_id VARCHAR2(64) PRIMARY KEY,
 identity_uid VARCHAR2(128) NOT NULL UNIQUE,
 role VARCHAR2(16) NOT NULL CHECK (role IN ('MEMBER','TRAINER','STAFF','ADMIN')),
 created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);
CREATE TABLE member (
 member_id VARCHAR2(64) PRIMARY KEY,
 user_id VARCHAR2(64) NOT NULL UNIQUE REFERENCES app_user(user_id),
 display_name VARCHAR2(120) NOT NULL,
 email VARCHAR2(254) NOT NULL UNIQUE,
 status VARCHAR2(16) DEFAULT 'ACTIVE' NOT NULL CHECK (status IN ('ACTIVE','SUSPENDED','CLOSED')),
 created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);
CREATE TABLE member_preference (
 member_id VARCHAR2(64) PRIMARY KEY REFERENCES member(member_id),
 preferred_contact VARCHAR2(16) DEFAULT 'EMAIL' NOT NULL CHECK (preferred_contact IN ('EMAIL','PHONE','NONE')),
 marketing_opt_in CHAR(1) DEFAULT 'N' NOT NULL CHECK (marketing_opt_in IN ('Y','N'))
);
CREATE TABLE trainer (
 trainer_id VARCHAR2(64) PRIMARY KEY,
 user_id VARCHAR2(64) UNIQUE REFERENCES app_user(user_id),
 display_name VARCHAR2(120) NOT NULL,
 active_flag CHAR(1) DEFAULT 'Y' NOT NULL CHECK (active_flag IN ('Y','N'))
);
CREATE TABLE fitness_class (
 class_id VARCHAR2(64) PRIMARY KEY,
 class_name VARCHAR2(120) NOT NULL,
 trainer_id VARCHAR2(64) NOT NULL REFERENCES trainer(trainer_id),
 starts_at TIMESTAMP NOT NULL,
 capacity NUMBER(4) NOT NULL CHECK (capacity > 0),
 status VARCHAR2(16) DEFAULT 'SCHEDULED' NOT NULL CHECK (status IN ('SCHEDULED','CANCELLED','COMPLETED')),
 created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);
CREATE INDEX ix_fitness_class_start ON fitness_class(starts_at);
CREATE TABLE booking (
 booking_id VARCHAR2(64) PRIMARY KEY,
 class_id VARCHAR2(64) NOT NULL REFERENCES fitness_class(class_id),
 member_id VARCHAR2(64) NOT NULL REFERENCES member(member_id),
 status VARCHAR2(16) DEFAULT 'CONFIRMED' NOT NULL CHECK (status IN ('CONFIRMED','CANCELLED','WAITLISTED')),
 booked_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
 CONSTRAINT uq_booking_member_class UNIQUE (class_id, member_id)
);
CREATE INDEX ix_booking_class_status ON booking(class_id,status);
CREATE TABLE attendance (
 attendance_id VARCHAR2(64) PRIMARY KEY,
 booking_id VARCHAR2(64) NOT NULL UNIQUE REFERENCES booking(booking_id),
 attended_flag CHAR(1) NOT NULL CHECK (attended_flag IN ('Y','N')),
 recorded_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);
CREATE TABLE payment (
 payment_id VARCHAR2(64) PRIMARY KEY,
 member_id VARCHAR2(64) NOT NULL REFERENCES member(member_id),
 amount NUMBER(10,2) NOT NULL CHECK (amount >= 0),
 currency CHAR(3) DEFAULT 'ZAR' NOT NULL,
 status VARCHAR2(16) NOT NULL CHECK (status IN ('SIMULATED','PENDING','PAID','FAILED','REFUNDED')),
 reference_code VARCHAR2(100) UNIQUE,
 created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);
-- Never store card numbers, CVVs, passwords, or payment credentials.
CREATE TABLE exercise (
 exercise_id VARCHAR2(64) PRIMARY KEY,
 exercise_name VARCHAR2(120) NOT NULL UNIQUE,
 description VARCHAR2(1000)
);
CREATE TABLE friend_connection (
 connection_id VARCHAR2(64) PRIMARY KEY,
 member_id VARCHAR2(64) NOT NULL REFERENCES member(member_id),
 friend_member_id VARCHAR2(64) NOT NULL REFERENCES member(member_id),
 status VARCHAR2(16) NOT NULL CHECK (status IN ('PENDING','ACCEPTED','DECLINED','BLOCKED')),
 created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
 CONSTRAINT ck_friend_not_self CHECK (member_id <> friend_member_id),
 CONSTRAINT uq_friend_pair UNIQUE (member_id,friend_member_id)
);
CREATE TABLE trainer_request (
 request_id VARCHAR2(64) PRIMARY KEY,
 member_id VARCHAR2(64) NOT NULL REFERENCES member(member_id),
 trainer_id VARCHAR2(64) NOT NULL REFERENCES trainer(trainer_id),
 message VARCHAR2(1000),
 status VARCHAR2(16) DEFAULT 'PENDING' NOT NULL CHECK (status IN ('PENDING','ACCEPTED','DECLINED','CANCELLED')),
 created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);
CREATE TABLE trainer_review (
 review_id VARCHAR2(64) PRIMARY KEY,
 member_id VARCHAR2(64) NOT NULL REFERENCES member(member_id),
 trainer_id VARCHAR2(64) NOT NULL REFERENCES trainer(trainer_id),
 rating NUMBER(1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
 review_text VARCHAR2(2000),
 created_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
 CONSTRAINT uq_member_trainer_review UNIQUE (member_id,trainer_id)
);
CREATE TABLE marathon_event (
 event_id VARCHAR2(64) PRIMARY KEY,
 event_name VARCHAR2(160) NOT NULL,
 event_date DATE NOT NULL,
 capacity NUMBER(6) NOT NULL CHECK (capacity > 0),
 status VARCHAR2(16) DEFAULT 'OPEN' NOT NULL CHECK (status IN ('OPEN','CLOSED','CANCELLED'))
);
CREATE TABLE marathon_registration (
 registration_id VARCHAR2(64) PRIMARY KEY,
 event_id VARCHAR2(64) NOT NULL REFERENCES marathon_event(event_id),
 full_name VARCHAR2(120) NOT NULL,
 email VARCHAR2(254) NOT NULL,
 registered_at TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
 status VARCHAR2(16) DEFAULT 'REGISTERED' NOT NULL CHECK (status IN ('REGISTERED','CANCELLED')),
 CONSTRAINT uq_marathon_event_email UNIQUE (event_id,email)
);
CREATE OR REPLACE VIEW v_class_availability AS
SELECT c.class_id AS id, c.class_name AS name, t.display_name AS trainer,
       c.capacity - COUNT(CASE WHEN b.status='CONFIRMED' THEN 1 END) AS spaces,
       c.starts_at, c.status
FROM fitness_class c JOIN trainer t ON t.trainer_id=c.trainer_id
LEFT JOIN booking b ON b.class_id=c.class_id
GROUP BY c.class_id,c.class_name,t.display_name,c.capacity,c.starts_at,c.status;
-- Availability is calculated, not stored. Booking writes must lock the class row.
