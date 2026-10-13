# Fitness class response contract

The website and Kotlin model share four fields: `id` (nonblank string), `name` (nonblank string), `trainer` (nonblank display name), and `spaces` (non-negative whole number). IDs are stable identifiers, not array positions. Text fields must be trimmed before persistence; clients must render names as text rather than markup.

Example using fictional data:

```json
{"id":"C-DEMO","name":"Strength Foundations","trainer":"Demo Coach","spaces":4}
```

`spaces` is a snapshot calculated from class capacity minus confirmed bookings. Do not let the client update that value directly. A booking request identifies a class; the server validates the member and capacity in one transaction. The UI showing READY does not reserve a seat.

This DTO is a display projection, not an Oracle table definition. The database should keep trainers and bookings in normalized tables and join them for this response. Persistent entities, foreign keys, SQL migrations and a real API endpoint remain to be implemented.
