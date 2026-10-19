-- Stores only explicit requests and consent. A reciprocal invitation is not acceptance.
CREATE TABLE cfj_trainer_requests (
  request_id VARCHAR2(40) PRIMARY KEY,
  member_id NUMBER(10) NOT NULL REFERENCES cfj_members(member_id),
  trainer_id VARCHAR2(40) NOT NULL REFERENCES cfj_trainers(trainer_id),
  status VARCHAR2(12) DEFAULT 'pending' NOT NULL,
  CONSTRAINT cfj_trainer_req_status CHECK (status IN ('pending','accepted','declined')),
  CONSTRAINT cfj_trainer_req_pair UNIQUE (member_id, trainer_id)
);
CREATE TABLE cfj_friend_connections (
  connection_id VARCHAR2(40) PRIMARY KEY,
  from_member_id NUMBER(10) NOT NULL REFERENCES cfj_members(member_id),
  to_member_id NUMBER(10) NOT NULL REFERENCES cfj_members(member_id),
  status VARCHAR2(12) DEFAULT 'pending' NOT NULL,
  CONSTRAINT cfj_friend_not_self CHECK (from_member_id <> to_member_id),
  CONSTRAINT cfj_friend_status CHECK (status IN ('pending','accepted','declined'))
);
-- One pair can have only one invitation, regardless of its direction.
CREATE UNIQUE INDEX cfj_friend_pair_uq ON cfj_friend_connections
  (LEAST(from_member_id,to_member_id), GREATEST(from_member_id,to_member_id));
CREATE TABLE cfj_events (
  event_id VARCHAR2(40) PRIMARY KEY,
  title VARCHAR2(100 CHAR) NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  capacity NUMBER NOT NULL,
  CONSTRAINT cfj_event_capacity CHECK (capacity BETWEEN 0 AND 999999 AND capacity = TRUNC(capacity))
);
CREATE TABLE cfj_event_registrations (
  registration_id VARCHAR2(40) PRIMARY KEY,
  event_id VARCHAR2(40) NOT NULL REFERENCES cfj_events(event_id),
  display_name VARCHAR2(60 CHAR) NOT NULL,
  email VARCHAR2(254) NOT NULL,
  consent NUMBER(1) NOT NULL,
  request_id VARCHAR2(80) NOT NULL UNIQUE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT cfj_event_consent CHECK (consent = 1),
  CONSTRAINT cfj_event_email_normal CHECK (email = LOWER(TRIM(email))),
  CONSTRAINT cfj_event_email_uq UNIQUE (event_id, email)
);
CREATE TABLE cfj_resources (
  resource_id VARCHAR2(40) PRIMARY KEY,
  title VARCHAR2(100 CHAR) NOT NULL,
  goal VARCHAR2(30) NOT NULL,
  instructions VARCHAR2(1000 CHAR) NOT NULL,
  requires_payment NUMBER(1) DEFAULT 1 NOT NULL,
  CONSTRAINT cfj_resource_goal CHECK (goal IN ('Build strength','Weight loss','Muscle tone','Endurance')),
  CONSTRAINT cfj_resource_paid CHECK (requires_payment IN (0,1))
);
CREATE TABLE cfj_messages (
  message_id VARCHAR2(40) PRIMARY KEY,
  sender_id NUMBER(10) NOT NULL REFERENCES cfj_members(member_id),
  recipient_id NUMBER(10) NOT NULL REFERENCES cfj_members(member_id),
  body VARCHAR2(1000 CHAR) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT cfj_message_not_self CHECK (sender_id <> recipient_id),
  CONSTRAINT cfj_message_dates CHECK (read_at IS NULL OR read_at >= sent_at)
);
CREATE INDEX cfj_trainer_req_trainer_ix ON cfj_trainer_requests(trainer_id);
CREATE INDEX cfj_friend_from_ix ON cfj_friend_connections(from_member_id);
CREATE INDEX cfj_friend_to_ix ON cfj_friend_connections(to_member_id);
CREATE INDEX cfj_message_sender_ix ON cfj_messages(sender_id);
CREATE INDEX cfj_message_recipient_ix ON cfj_messages(recipient_id);
