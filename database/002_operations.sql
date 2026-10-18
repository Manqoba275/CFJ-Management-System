-- Extends the existing profile schema without replacing member data.
-- Run using scripts/migrate-oracle.mjs; the runner stops on the first error.
-- Roles and plan codes are checked values, not artificial lookup tables.
CREATE TABLE cfj_memberships (
  membership_id VARCHAR2(40) PRIMARY KEY,
  member_id NUMBER(10) NOT NULL REFERENCES cfj_members(member_id),
  plan_code VARCHAR2(20) NOT NULL,
  status VARCHAR2(12) DEFAULT 'active' NOT NULL,
  starts_on DATE NOT NULL,
  expires_on DATE NOT NULL,
  CONSTRAINT cfj_ms_plan CHECK (plan_code IN ('weekly3','weekly4','unlimited','concession10','concession15','concession20','dropin')),
  CONSTRAINT cfj_ms_status CHECK (status IN ('active','expired','cancelled')),
  CONSTRAINT cfj_ms_dates CHECK (expires_on >= starts_on AND starts_on = TRUNC(starts_on) AND expires_on = TRUNC(expires_on)),
  CONSTRAINT cfj_ms_owner UNIQUE (membership_id, member_id)
);
CREATE TABLE cfj_trainers (
  trainer_id VARCHAR2(40) PRIMARY KEY,
  display_name VARCHAR2(60 CHAR) NOT NULL,
  specialty VARCHAR2(60 CHAR) NOT NULL,
  language VARCHAR2(30 CHAR) NOT NULL
);
CREATE TABLE cfj_class_sessions (
  session_id VARCHAR2(40) PRIMARY KEY,
  title VARCHAR2(100 CHAR) NOT NULL,
  trainer_id VARCHAR2(40) NOT NULL REFERENCES cfj_trainers(trainer_id),
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  capacity NUMBER NOT NULL,
  CONSTRAINT cfj_session_capacity CHECK (capacity BETWEEN 0 AND 999999 AND capacity = TRUNC(capacity))
);
CREATE TABLE cfj_bookings (
  booking_id VARCHAR2(40) PRIMARY KEY,
  member_id NUMBER(10) NOT NULL REFERENCES cfj_members(member_id),
  session_id VARCHAR2(40) NOT NULL REFERENCES cfj_class_sessions(session_id),
  membership_id VARCHAR2(40) NOT NULL,
  status VARCHAR2(12) DEFAULT 'active' NOT NULL,
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT cfj_booking_owner FOREIGN KEY (membership_id, member_id) REFERENCES cfj_memberships(membership_id, member_id),
  CONSTRAINT cfj_booking_status CHECK (status IN ('active','cancelled')),
  CONSTRAINT cfj_booking_member_session UNIQUE (member_id, session_id)
);
CREATE TABLE cfj_attendance (
  attendance_id VARCHAR2(40) PRIMARY KEY,
  booking_id VARCHAR2(40) NOT NULL UNIQUE REFERENCES cfj_bookings(booking_id),
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  request_id VARCHAR2(80) NOT NULL UNIQUE
);
CREATE TABLE cfj_payments (
  payment_id VARCHAR2(40) PRIMARY KEY,
  booking_id VARCHAR2(40) NOT NULL REFERENCES cfj_bookings(booking_id),
  amount_cents NUMBER NOT NULL,
  currency CHAR(3) DEFAULT 'ZAR' NOT NULL,
  simulated NUMBER(1) DEFAULT 1 NOT NULL,
  request_id VARCHAR2(80) NOT NULL UNIQUE,
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT cfj_payment_amount CHECK (amount_cents BETWEEN 1 AND 10000000 AND amount_cents = TRUNC(amount_cents)),
  CONSTRAINT cfj_payment_currency CHECK (currency = 'ZAR'),
  CONSTRAINT cfj_payment_simulation CHECK (simulated = 1)
);
CREATE INDEX cfj_ms_member_ix ON cfj_memberships(member_id);
CREATE INDEX cfj_session_trainer_ix ON cfj_class_sessions(trainer_id);
CREATE INDEX cfj_booking_session_ix ON cfj_bookings(session_id);
CREATE INDEX cfj_booking_membership_ix ON cfj_bookings(membership_id, member_id);
CREATE INDEX cfj_payment_booking_ix ON cfj_payments(booking_id);
