# Member discovery development service

Friday 9 October 2026 integration. Run `npm run start:api` with `CFJ_DEV_TOKEN` (member), optional `CFJ_DEV_PEER_TOKEN` (second member), and `CFJ_DEV_STAFF_TOKEN` (staff). Use different random tokens of at least 32 characters. Never commit tokens. Existing booking records are preserved when the store gains community collections.

All endpoints require a member Bearer token. Staff cannot browse the member directory. The directory exposes only configured, discoverable synthetic members and only their ID, display name and goal; it excludes the caller. Profile editing currently authenticates the primary member only.

| Method | Endpoint | Body / result |
| --- | --- | --- |
| GET | `/api/v1/trainers` | Synthetic trainer directory |
| GET | `/api/v1/members` | Discoverable member directory |
| POST | `/api/v1/trainer-requests` | `{ "trainerId": "T-DEMO-1" }` |
| GET | `/api/v1/me/trainer-requests` | Own pending requests |
| POST | `/api/v1/friend-connections` | `{ "memberId": "demo-peer" }` |
| GET | `/api/v1/me/friend-connections` | Connections involving the caller |
| POST | `/api/v1/friend-connections/{id}/accept` | `{}`; recipient only |
| GET | `/api/v1/exercises` | Two sample guides after an own positive simulated payment |

Repeated requests return the existing record. Reciprocal friend requests remain pending until the recipient explicitly accepts. Requests and acceptance persist across server restarts. Trainer requests remain pending; they do not reserve a trainer appointment.

The API is a single-process local development service with JSON persistence. Production Oracle persistence, verified identities, real consent management, trainer approval and active membership expiry rules remain outstanding. Any positive simulated payment unlocks the sample guides in this demo; no money is charged. Guides are placeholders for trainer-approved content.

Use the blue service desk at `http://127.0.0.1:8787/service.html` and Android debug Settings with `http://10.0.2.2:8787` to access the same records. The original browser prototype still uses its separate local storage.
