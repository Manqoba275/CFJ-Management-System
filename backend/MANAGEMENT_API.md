# Management reports and public event registration

Implemented 10 October 2026. This is the local development service, not a live event or a production membership system.

Set a unique `CFJ_DEV_ADMIN_TOKEN` of at least 32 characters alongside the existing member/staff tokens, then run `npm run start:api`. Open `http://127.0.0.1:8787/service.html`, enter the admin token and select **Load management report**. Members and staff receive 403; unauthenticated requests receive 401. Reports contain aggregate booking, attendance, simulated payment, trainer, connection and event counts. They exclude registrant contact details.

Public registration is available at `http://127.0.0.1:8787/registration.html` without an account. Use synthetic details only. The form requests a name, email and explicit demo storage consent. It returns a reference after a durable save. No email is sent and no money is charged.

| Method | Route | Access |
| --- | --- | --- |
| GET | `/api/v1/admin/reports` | Admin token |
| GET | `/api/v1/public/events` | Public; event names and remaining places only |
| POST | `/api/v1/public/registrations` | Public; JSON below |

Registration body: `eventId`, `displayName` (2–60 characters), `email`, `consent: true`, and a unique `requestId` (20–80 letters, digits or hyphens). The seeded event ID is `MARATHON-DEMO`, capacity 100. Request IDs make retries safe; retry the same details after an uncertain response. Changing details for an existing request ID is rejected. Email uniqueness is case-insensitive per event. The browser retains an unconfirmed request only until the page is closed or reloaded; keep the confirmation reference. There is no public registration lookup or contact-data listing.

Registrations share the existing serialized, atomic JSON store and survive restart. Older stores gain an empty registration collection without losing bookings. Do not run multiple service processes against one store. Production work still requires Oracle transactions, hosted identity, a real event catalogue, verified email, abuse controls, consent/retention procedures and organiser workflows.
