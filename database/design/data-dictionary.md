# Oracle data dictionary

Generated from the actual local schema after migrations 002/003. See the migration SQL for defaults and exact FK/check definitions. No passwords or service credentials are included.

## CFJ_ATTENDANCE

| Column | Oracle type | Nullable |
|---|---|---|
| ATTENDANCE_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| BOOKING_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| CHECKED_IN_AT | TIMESTAMP(6) WITH TIME ZONE | N |
| REQUEST_ID | VARCHAR2 (80 max bytes; CHAR semantics where declared in SQL) | N |

Constraints: SYS_C008700 (C), SYS_C008699 (C), SYS_C008698 (C), SYS_C008701 (P), SYS_C008704 (R), SYS_C008703 (U), SYS_C008702 (U)

## CFJ_BOOKINGS

| Column | Oracle type | Nullable |
|---|---|---|
| BOOKING_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| MEMBER_ID | NUMBER (10,0) | N |
| SESSION_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| MEMBERSHIP_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| STATUS | VARCHAR2 (12 max bytes; CHAR semantics where declared in SQL) | N |
| BOOKED_AT | TIMESTAMP(6) WITH TIME ZONE | N |

Constraints: SYS_C008689 (C), CFJ_BOOKING_STATUS (C), SYS_C008691 (C), SYS_C008690 (C), SYS_C008688 (C), SYS_C008687 (C), SYS_C008693 (P), CFJ_BOOKING_OWNER (R), SYS_C008696 (R), SYS_C008695 (R), CFJ_BOOKING_MEMBER_SESSION (U)

## CFJ_CLASS_SESSIONS

| Column | Oracle type | Nullable |
|---|---|---|
| SESSION_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| TITLE | VARCHAR2 (400 max bytes; CHAR semantics where declared in SQL) | N |
| TRAINER_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| STARTS_AT | TIMESTAMP(6) WITH TIME ZONE | N |
| CAPACITY | NUMBER | N |

Constraints: SYS_C008682 (C), CFJ_SESSION_CAPACITY (C), SYS_C008680 (C), SYS_C008681 (C), SYS_C008683 (C), SYS_C008685 (P), SYS_C008686 (R)

## CFJ_EVENTS

| Column | Oracle type | Nullable |
|---|---|---|
| EVENT_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| TITLE | VARCHAR2 (400 max bytes; CHAR semantics where declared in SQL) | N |
| STARTS_AT | TIMESTAMP(6) WITH TIME ZONE | N |
| CAPACITY | NUMBER | N |

Constraints: SYS_C008733 (C), CFJ_EVENT_CAPACITY (C), SYS_C008734 (C), SYS_C008735 (C), SYS_C008737 (P)

## CFJ_EVENT_REGISTRATIONS

| Column | Oracle type | Nullable |
|---|---|---|
| REGISTRATION_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| EVENT_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| DISPLAY_NAME | VARCHAR2 (240 max bytes; CHAR semantics where declared in SQL) | N |
| EMAIL | VARCHAR2 (254 max bytes; CHAR semantics where declared in SQL) | N |
| CONSENT | NUMBER (1,0) | N |
| REQUEST_ID | VARCHAR2 (80 max bytes; CHAR semantics where declared in SQL) | N |
| REGISTERED_AT | TIMESTAMP(6) WITH TIME ZONE | N |

Constraints: SYS_C008740 (C), SYS_C008739 (C), SYS_C008738 (C), SYS_C008741 (C), CFJ_EVENT_EMAIL_NORMAL (C), CFJ_EVENT_CONSENT (C), SYS_C008743 (C), SYS_C008742 (C), SYS_C008746 (P), SYS_C008749 (R), SYS_C008747 (U), CFJ_EVENT_EMAIL_UQ (U)

## CFJ_FRIEND_CONNECTIONS

| Column | Oracle type | Nullable |
|---|---|---|
| CONNECTION_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| FROM_MEMBER_ID | NUMBER (10,0) | N |
| TO_MEMBER_ID | NUMBER (10,0) | N |
| STATUS | VARCHAR2 (12 max bytes; CHAR semantics where declared in SQL) | N |

Constraints: SYS_C008726 (C), CFJ_FRIEND_STATUS (C), CFJ_FRIEND_NOT_SELF (C), SYS_C008725 (C), SYS_C008727 (C), SYS_C008730 (P), SYS_C008732 (R), SYS_C008731 (R)

## CFJ_MEMBERS

| Column | Oracle type | Nullable |
|---|---|---|
| MEMBER_ID | NUMBER (10,0) | N |
| IDENTITY_UID | VARCHAR2 (128 max bytes; CHAR semantics where declared in SQL) | N |
| EMAIL | VARCHAR2 (254 max bytes; CHAR semantics where declared in SQL) | N |
| CREATED_AT | TIMESTAMP(6) | N |

Constraints: SYS_C008652 (C), SYS_C008653 (C), SYS_C008654 (C), SYS_C008655 (P), SYS_C008656 (U), SYS_C008657 (U)

## CFJ_MEMBERSHIPS

| Column | Oracle type | Nullable |
|---|---|---|
| MEMBERSHIP_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| MEMBER_ID | NUMBER (10,0) | N |
| PLAN_CODE | VARCHAR2 (20 max bytes; CHAR semantics where declared in SQL) | N |
| STATUS | VARCHAR2 (12 max bytes; CHAR semantics where declared in SQL) | N |
| STARTS_ON | DATE | N |
| EXPIRES_ON | DATE | N |

Constraints: SYS_C008665 (C), SYS_C008666 (C), CFJ_MS_DATES (C), SYS_C008667 (C), SYS_C008668 (C), SYS_C008669 (C), CFJ_MS_PLAN (C), CFJ_MS_STATUS (C), SYS_C008673 (P), SYS_C008675 (R), CFJ_MS_OWNER (U)

## CFJ_MESSAGES

| Column | Oracle type | Nullable |
|---|---|---|
| MESSAGE_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| SENDER_ID | NUMBER (10,0) | N |
| RECIPIENT_ID | NUMBER (10,0) | N |
| BODY | VARCHAR2 (4000 max bytes; CHAR semantics where declared in SQL) | N |
| SENT_AT | TIMESTAMP(6) WITH TIME ZONE | N |
| READ_AT | TIMESTAMP(6) WITH TIME ZONE | Y |

Constraints: SYS_C008760 (C), CFJ_MESSAGE_NOT_SELF (C), CFJ_MESSAGE_DATES (C), SYS_C008758 (C), SYS_C008759 (C), SYS_C008757 (C), SYS_C008763 (P), SYS_C008764 (R), SYS_C008765 (R)

## CFJ_PAYMENTS

| Column | Oracle type | Nullable |
|---|---|---|
| PAYMENT_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| BOOKING_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| AMOUNT_CENTS | NUMBER | N |
| CURRENCY | CHAR (3 max bytes; CHAR semantics where declared in SQL) | N |
| SIMULATED | NUMBER (1,0) | N |
| REQUEST_ID | VARCHAR2 (80 max bytes; CHAR semantics where declared in SQL) | N |
| PAID_AT | TIMESTAMP(6) WITH TIME ZONE | N |

Constraints: CFJ_PAYMENT_SIMULATION (C), CFJ_PAYMENT_CURRENCY (C), CFJ_PAYMENT_AMOUNT (C), SYS_C008710 (C), SYS_C008707 (C), SYS_C008708 (C), SYS_C008705 (C), SYS_C008706 (C), SYS_C008709 (C), SYS_C008714 (P), SYS_C008716 (R), SYS_C008715 (U)

## CFJ_PROFILES

| Column | Oracle type | Nullable |
|---|---|---|
| MEMBER_ID | NUMBER (10,0) | N |
| DISPLAY_NAME | VARCHAR2 (240 max bytes; CHAR semantics where declared in SQL) | N |
| GOAL | VARCHAR2 (30 max bytes; CHAR semantics where declared in SQL) | N |
| VERSION | NUMBER (10,0) | N |

Constraints: CFJ_PROFILE_GOAL (C), SYS_C008660 (C), SYS_C008659 (C), SYS_C008658 (C), CFJ_PROFILE_VERSION (C), SYS_C008663 (P), SYS_C008664 (R)

## CFJ_RESOURCES

| Column | Oracle type | Nullable |
|---|---|---|
| RESOURCE_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| TITLE | VARCHAR2 (400 max bytes; CHAR semantics where declared in SQL) | N |
| GOAL | VARCHAR2 (30 max bytes; CHAR semantics where declared in SQL) | N |
| INSTRUCTIONS | VARCHAR2 (4000 max bytes; CHAR semantics where declared in SQL) | N |
| REQUIRES_PAYMENT | NUMBER (1,0) | N |

Constraints: CFJ_RESOURCE_PAID (C), CFJ_RESOURCE_GOAL (C), SYS_C008753 (C), SYS_C008752 (C), SYS_C008751 (C), SYS_C008750 (C), SYS_C008756 (P)

## CFJ_TRAINERS

| Column | Oracle type | Nullable |
|---|---|---|
| TRAINER_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| DISPLAY_NAME | VARCHAR2 (240 max bytes; CHAR semantics where declared in SQL) | N |
| SPECIALTY | VARCHAR2 (240 max bytes; CHAR semantics where declared in SQL) | N |
| LANGUAGE | VARCHAR2 (120 max bytes; CHAR semantics where declared in SQL) | N |

Constraints: SYS_C008677 (C), SYS_C008676 (C), SYS_C008678 (C), SYS_C008679 (P)

## CFJ_TRAINER_REQUESTS

| Column | Oracle type | Nullable |
|---|---|---|
| REQUEST_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| MEMBER_ID | NUMBER (10,0) | N |
| TRAINER_ID | VARCHAR2 (40 max bytes; CHAR semantics where declared in SQL) | N |
| STATUS | VARCHAR2 (12 max bytes; CHAR semantics where declared in SQL) | N |

Constraints: SYS_C008718 (C), SYS_C008717 (C), CFJ_TRAINER_REQ_STATUS (C), SYS_C008719 (C), SYS_C008721 (P), SYS_C008723 (R), SYS_C008724 (R), CFJ_TRAINER_REQ_PAIR (U)

P = primary key; R = foreign key; U = unique; C = check/not-null. The bidirectional friend-pair rule is implemented by the separate CFJ_FRIEND_PAIR_UQ unique index.