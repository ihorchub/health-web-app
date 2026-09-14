# Backend specification

**Status:** Implementation-ready — SCR-01…SCR-12 + FLO walkthroughs; API contracts aligned to **Paper design priority** (14 Sep 2026); stack locked 14 Sep 2026  
**Source of truth (behaviour):** [product-spec.md](./product-spec.md) (IA overlay folded 31 Aug 2026) · **API shape / fields on screens:** Paper file (design wins on UI conflicts; this file is updated to match)  
**Pair file:** [frontend-spec.md](./frontend-spec.md) — **Contract** blocks must match.  
**Implementation:** [tech-stack.md](./tech-stack.md) — monorepo, OpenAPI, defaults.

Server behaviour: authz, appointment lifecycle, slot honesty, seed, API contracts per screen. Layout belongs in the frontend spec.

**Stack:** Node.js · **Fastify** · TypeScript · **PostgreSQL** · **Drizzle** · **TypeBox** · **OpenAPI** (from routes) · server-side **sessions** (HTTP-only cookie). Monorepo: **pnpm** — `apps/api`, `apps/web`.

**ID convention:** every resource `id` in requests/responses is a **`string`** (not a separate UUID type in the API layer).

How to fill: shared model first (below), then one `SCR-*` at a time. Approve before the next. Skill `write-layer-spec`.

---

## Shared (fill before screens)

### Accounts and auth

**Product pointer:** [R-01](./product-spec.md#r-01-accounts-and-roles), [R-16](./product-spec.md#r-16-app-shell-and-public-entry), [SCR-01](./product-spec.md#scr-01-sign-up--log-in)

#### Model

| Entity | Notes |
|---|---|
| `users` | `id` (`string`), `email` (unique), `password_hash`, `role` (`patient` \| `doctor`), `email_verified_at`, `created_at` |
| `registrations` | Pending multi-step sign-up: `id` (`string` = `registrationId`), `role`, step-1 fields, `email_verify_token`, `email_verified`, `profile_completed`, expires |
| `patient_profiles` | `user_id`, names, `dob`, `gender` (`female` \| `male`), `phone`, `photo_url`, `home_city_id`, `home_clinic_id`, `language`, `theme` |
| `doctor_profiles` | `user_id`, names, `dob`, `phone`, `city_id`, `clinic_id`, `specialty`, `years_practice`, `visit_duration_minutes`, `photo_url`, `license_file_url` (optional), `bio`, `languages` (text[]), `language`, `theme` |
| `doctor_education` | `id` (`string`), `doctor_user_id`, `kind` (`university` \| `certificate` \| `training`), `title`, `subtitle` (optional), `year_from`, `year_to` (optional) |
| `sessions` | Server-side session row: random `session_id` (`string`) in an **HTTP-only cookie** (see below) |

**Session — how login persists (plain language)**

After login the server gives the browser a small cookie. On each request the browser sends that cookie automatically; the server looks up who you are.

- **HTTP-only cookie:** the cookie is not readable by page JavaScript — slightly safer if XSS ever appears.
- **Server-side session (chosen for MVP):** the cookie holds only a random id; user data lives in the database. **Logout** deletes that row immediately. Simple for “am I still logged in?”
- **JWT in cookie (not chosen):** the cookie would carry a signed token with user info; server does not store a session row. Revoking logout or “kick all sessions” is harder. Fine for later; not needed for MVP.

**Decision (31 Aug 2026):** HTTP-only cookie + **server-side session** (e.g. Fastify secure session). Not JWT for MVP.

One email → one `users` row → one role forever. No dual role.

#### Authz pattern (every request)

1. Resolve session → `user_id` + `role`.
2. For object routes (`appointment`, `doctor schedule`, `profile`): load resource; deny if `user_id` / role does not match.
3. **Public read** (no session): doctor search, doctor profile, legal pages, seed city/clinic lists for SCR-01 dropdowns.
4. Never rely on UI hiding alone.

#### Registration validation (MVP — see [tech-stack.md](./tech-stack.md))

| Field | Rule |
|---|---|
| Email | Valid format; unique across users + open registrations |
| Password | Min **8** characters (**Confirmed** 31 Aug 2026). Password confirm is **client-only**; hash with **argon2** (or bcrypt) |
| Phone | Collected on profile / later edit (Paper step 3 patient has no phone); when present: non-empty, max 32 chars; no SMS verification — format **Open** |
| DOB | Must be in the past (patient + doctor on step 3) |
| Gender (patient) | `female` \| `male` — **required** (Paper) |
| Years of practice (doctor) | Integer ≥ 0 |
| Visit duration | One of 20, 30, 45 |
| License file | **Optional** (Paper); image or PDF if present; not verified |
| Sign-up consent | `acceptedPrivacy` + `acceptedTerms` both true on step 1 (**R-16**) |

#### Commands / endpoints (conceptual)

Prefix: `/api/v1`. All ids are `string`.

| Operation | Auth | Notes |
|---|---|---|
| `POST /auth/register/step-1` | public | Role + name + email + password + consent → `registrationId`; sends verify email |
| `POST /auth/register/verify-email` | public | `{ registrationId, token }` → unlocks profile step |
| `POST /auth/register/resend-email` | public | Resend verify link for open registration |
| `POST /auth/register/step-3` | public (registration) | Role-specific profile fields; patient includes `gender`; doctor `licenseFile` optional |
| `POST /auth/register/complete` | public (registration) | Creates user + session; redirect `SCR-06` / `SCR-08` |
| `POST /auth/login` | public | Returns session + role + redirect hint |
| `POST /auth/logout` | logged-in | Clears session |
| `GET /auth/me` | optional / logged-in | Current user summary for chrome; `null` if guest |
| `GET /reference/cities` | public | Seed cities |
| `GET /reference/clinics?cityId=` | public | Clinics in city (`cityId`: `string`) |
| `GET /reference/specialties` | public | Four specialties |

#### Post-login / post-complete redirect hints (R-16)

| Role | Default route |
|---|---|
| Patient | `SCR-06` |
| Doctor | `SCR-08` |

#### Errors (stable codes)

| Code | Meaning |
|---|---|
| `AUTH_INVALID_CREDENTIALS` | Wrong email/password |
| `AUTH_EMAIL_TAKEN` | Email already registered |
| `AUTH_VALIDATION_FAILED` | Field validation |
| `AUTH_CONSENT_REQUIRED` | Privacy/Terms not accepted |
| `AUTH_UNAUTHORIZED` | No/invalid session |
| `AUTH_FORBIDDEN` | Session valid but not allowed for this resource |
| `AUTH_INVALID_TOKEN` | Bad email-verify token |
| `AUTH_TOKEN_EXPIRED` | Verify token expired |
| `AUTH_REGISTRATION_NOT_FOUND` | Unknown or expired `registrationId` |
| `AUTH_EMAIL_NOT_VERIFIED` | Step 3 before verify |
| `AUTH_PROFILE_INCOMPLETE` | Complete before profile done |
| `AUTH_ALREADY_VERIFIED` | Resend after verify |
| `AUTH_RESEND_TOO_SOON` | Resend rate limit |
| `AUTH_FORBIDDEN_STEP` | Wrong step order |

#### Out of scope

Forgot password, social login, license **verification**, dual role, clinic admin, **SMS/phone OTP**.

#### Implementation notes

- Routes validated with **TypeBox**; documented in **OpenAPI** for Orval (`tech-stack.md`).
- Sessions: Postgres `sessions` table, **14-day** TTL, cookie name e.g. `medicly_sid`.
- Phone format — **Open**. Verify-token TTL / resend cooldown — suggest 24h / 60s.

---

### Appointment state machine

**Product pointer:** [R-02](./product-spec.md#r-02-appointment-statuses), [R-06](./product-spec.md#r-06-cancellation), [R-07](./product-spec.md#r-07-rescheduling)

#### Stored status enum

`Upcoming` · `Reschedule Pending` · `Completed` · `Cancelled` · `Rescheduled`

`Past` is **not** stored — query grouping only.

#### Core fields (appointments table)

| Field | Notes |
|---|---|
| `id` | `string` |
| `doctor_id` | `string` |
| `patient_id` | `string` |
| `start_at` | UTC `timestamptz` |
| `duration_minutes` | Snapshot at book time |
| `format` | `offline` \| `online` |
| `reason` | Optional text |
| `status` | Enum above |
| `cancelled_by` | `patient` \| `doctor` \| null |
| `proposed_start_at` | Set when `Reschedule Pending` |
| `replaces_appointment_id` | Links new `Upcoming` to old `Rescheduled` row |
| `completed_at` | Set on manual or auto complete |

#### Slot occupancy (calendar truth)

| Status | Occupies `start_at` | Occupies `proposed_start_at` |
|---|---|---|
| `Upcoming` | taken | — |
| `Reschedule Pending` | taken (original) | reserved |
| `Completed` | past (not bookable) | — |
| `Cancelled` | free | free |
| `Rescheduled` | free | free |

#### Allowed transitions

Same diagram as product **R-02**. Final statuses have no further transitions.

#### Commands (named operations)

| Command | Actor | From → To |
|---|---|---|
| `book` | patient | → `Upcoming` |
| `patientReschedule` | patient | `Upcoming` → `Rescheduled` + new `Upcoming` |
| `doctorPropose` | doctor | `Upcoming` → `Reschedule Pending` |
| `patientAcceptProposal` | patient | `Reschedule Pending` → `Rescheduled` + new `Upcoming` at proposed time |
| `patientPickAnotherFromPending` | patient | `Reschedule Pending` → `Rescheduled` + new `Upcoming` at chosen time |
| `cancel` | patient/doctor | `Upcoming` or `Reschedule Pending` → `Cancelled` |
| `markCompleted` | doctor | `Upcoming` → `Completed` |
| `autoComplete` | system job | `Upcoming` → `Completed` when `start_at + duration` passed |

Patient reschedule while `Reschedule Pending` is **forbidden** — use pending decision commands only.

#### Auto-complete job

- Runs periodically (e.g. every minute).
- `Upcoming` where `start_at + duration_minutes <= now()` → `Completed`.
- Never auto-completes `Reschedule Pending`.

#### Invariants

- Two-record reschedule: old row `Rescheduled` (final), new row `Upcoming`; link via `replaces_appointment_id`.
- On any successful move: old slot freed, new slot taken/reserved per status rules.
- `cancelled_by` set on every `Cancelled`.

#### Errors

| Code | Meaning |
|---|---|
| `APPOINTMENT_NOT_FOUND` | |
| `APPOINTMENT_FORBIDDEN` | Wrong patient/doctor |
| `APPOINTMENT_INVALID_TRANSITION` | Status does not allow action |
| `APPOINTMENT_PENDING_EXISTS` | Second proposal or move while pending |

---

### Slots and double booking

**Product pointer:** [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-13](./product-spec.md#r-13-booking-horizon), [FLO-06](./product-spec.md#flo-06-concurrent-booking-of-the-same-slot)

#### Horizon helpers (single source of truth)

All date math uses clinic timezone — **Confirmed:** `Europe/Kyiv` for MVP.

| Helper | Definition |
|---|---|
| `zoneAStart` | Start of today (local) |
| `zoneAEnd` | Same calendar day one month later minus one day (inclusive end of bookable window) |
| `zoneBEnd` | Today + 3 months |
| `bookable(start)` | `zoneAStart <= start <= zoneAEnd` and start not in past |

Example: today 10 Aug → bookable through 9 Sep inclusive.

#### Slots and concurrency — plain language

**Problem:** Two patients click “Confirm” for Tuesday 10:20 at the same second. Only one may succeed.

**Compute on read (how “free times” are produced)**

The database does **not** keep a permanent row for every empty 10:20 slot. When someone opens the calendar, the server:

1. Reads the doctor’s working hours for that day.
2. Steps through possible start times (using visit duration).
3. Removes times already taken or reserved by appointments.

So “free” always reflects the **current** appointments table. If the doctor changes Zone B hours, you do not need to delete thousands of stale slot rows.

**DB uniqueness + transaction (how double booking is impossible)**

When someone confirms a booking, the server runs a **database transaction**:

1. Check again that the time is still free.
2. Insert the appointment.
3. Commit.

If two requests race, the database **refuses the second insert** for the same doctor + time (unique constraint on occupied slots). The loser gets error `SLOT_TAKEN` → UI shows “this time is no longer free” (**FLO-06**). This is stronger than only checking in code before insert.

**Decision (31 Aug 2026):** compute on read for availability APIs + transactional book + DB-level uniqueness on occupied `(doctor_id, start_at)` ranges.

#### Slot generation — implementation

Slots are **not** pre-stored as rows for every free minute.

1. Load doctor schedule template + exceptions for the day (working hours, lunch, vacation).
2. Generate candidate starts stepping by `visit_duration_minutes` for that day/zone.
3. Subtract occupancy from appointments where status occupies that time (`Upcoming`, `Reschedule Pending` original + proposed).
4. Return only candidates passing `bookable()` and format rules.

**Why:** Zone B edits do not require mass slot row updates; occupancy always reflects live appointments.

#### Double booking prevention — implementation

Within `book` / reschedule confirm / accept proposal:

1. `BEGIN`
2. Re-run availability check for `(doctor_id, start_at)` with row-level lock on overlapping appointments.
3. `INSERT` new appointment OR update statuses.
4. `COMMIT`

**Unique partial index** (conceptual): no two rows for same `doctor_id` + `start_at` where status in (`Upcoming`, `Reschedule Pending` occupying that start). Implementation may use exclusion constraint on time range `[start_at, start_at + duration)`.

Concurrent second writer gets `SLOT_TAKEN` — plain-language refusal to client (**FLO-06**).

#### Slot status for SCR-04 API

| API status | Meaning |
|---|---|
| `free` | Bookable |
| `taken` | `Upcoming` or original of pending |
| `reserved` | Proposed time of pending |
| `past` | Before now or outside Zone A |
| `day_off` | No working hours |

One doctor, one timeline — format does not create parallel slots (**R-04**).

#### Calendar refresh

Server truth on every read; no slot held during SCR-05 confirm. Frontend: React Query **refetch every 30s** while SCR-04 wizard is open + refetch on window focus (`tech-stack.md`).

#### Errors

| Code | Meaning |
|---|---|
| `SLOT_TAKEN` | Concurrent or stale confirm (**FLO-06**) |
| `SLOT_OUTSIDE_WINDOW` | Outside Zone A or past |
| `SLOT_NOT_FREE` | Taken/reserved/off |

---

### Seed

**Product pointer:** [R-12](./product-spec.md#r-12-seed-data), [R-14](./product-spec.md#r-14-reviews-and-ratings)

#### Scale

- ~5 cities, 2–5 clinics per city, 5–10 doctors per clinic (≥20 doctors total).
- **25** seed patients with mixed past/upcoming appointments.
- Four specialties only.
- Ukrainian-style fictional names.

#### Default doctor template (until Zone B edited)

Mon–Fri 09:00–18:00, lunch 13:00–14:00, weekend off, duration mix 20/30/45, format mostly Offline only, variable base prices, some with **promo** for SCR-02 demo.

#### Seed content requirements

- Past + upcoming appointments (upcoming only inside Zone A).
- Days with free slots, full days, days off (demo script).
- Doctor photos for seed doctors; placeholder path for “new doctor” pattern.
- Sample **reviews** + rating aggregates (**R-14**).
- Patient home city/clinic for ranking demo.
- Enough patients for two-browser concurrent booking demo.

#### Delivery

- Idempotent `pnpm seed` (or equivalent) repopulates demo DB.
- No clinic-admin UI.

#### Open questions

Exact fictional name list → seed file, not spec.

---

## Contract template (copy into every SCR)

```text
### Contract
In: …
Out: …
Errors: …
Auth: …
```

---

## SCR-01 Sign up / Log in

**Product pointer:** [SCR-01](./product-spec.md#scr-01-sign-up--log-in), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-05](./product-spec.md#r-05-appointment-duration), [R-11](./product-spec.md#r-11-language-and-theme), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

**Design note:** Paper onboarding is **4 steps** — one primary endpoint per step (+ resend on email step). Design wins over older “single POST register / email UI-only” lines.

### Contract

**Register — step 1 (Дані)**

- In: `role`, `firstName`, `lastName`, `email`, `password`, `acceptedPrivacy`, `acceptedTerms` (both `true`); optional `language`, `theme`
- Out: `{ registrationId: string, email, role, nextStep: "email" }`; send verify email; no app session yet
- Errors: `AUTH_EMAIL_TAKEN`, `AUTH_VALIDATION_FAILED`, `AUTH_CONSENT_REQUIRED`
- Auth: public

**Register — step 2 (Email verify)**

- In: `registrationId: string`, `token: string`
- Out: `{ registrationId, emailVerified: true, role, nextStep: "profile" }`
- Errors: `AUTH_INVALID_TOKEN`, `AUTH_TOKEN_EXPIRED`, `AUTH_REGISTRATION_NOT_FOUND`
- Auth: public

**Register — resend email (same step UI)**

- In: `registrationId: string`
- Out: `{ ok: true, sentTo: string }`
- Errors: `AUTH_RESEND_TOO_SOON`, `AUTH_REGISTRATION_NOT_FOUND`, `AUTH_ALREADY_VERIFIED`
- Auth: public

**Register — step 3 (Профіль)**

- In: `registrationId: string` + role-specific fields (see table). Patient: `gender` required. Doctor: `licenseFile` optional multipart
- Out: `{ registrationId, profileCompleted: true, nextStep: "done" }`
- Errors: `AUTH_EMAIL_NOT_VERIFIED`, `AUTH_VALIDATION_FAILED`, `AUTH_REGISTRATION_NOT_FOUND`, `AUTH_FORBIDDEN_STEP`
- Auth: public (bound to registration)

**Register — step 4 (Готово / complete)**

- In: `registrationId: string`
- Out: session cookie; `{ userId: string, role, redirectTo }` — patient → `SCR-06`, doctor → `SCR-08`
- Errors: `AUTH_PROFILE_INCOMPLETE`, `AUTH_EMAIL_NOT_VERIFIED`, `AUTH_REGISTRATION_NOT_FOUND`
- Auth: public (bound to registration)

**Log in**

- In: `email`, `password`
- Out: session cookie; `{ userId: string, role, redirectTo }`
- Errors: `AUTH_INVALID_CREDENTIALS`, `AUTH_VALIDATION_FAILED`
- Auth: public

**Log out**

- In: session cookie
- Out: `{ ok: true }`
- Errors: `AUTH_UNAUTHORIZED` (optional — idempotent logout OK)
- Auth: logged-in (optional strict)

### Who is allowed

- Anyone may start register / login (one email, one role).
- Authenticated user hitting SCR-01 → skip UI; `GET /auth/me` returns role + redirect hint.

### Commands / queries

| Method | Path | Auth | Payload / response notes |
|---|---|---|---|
| `POST` | `/api/v1/auth/register/step-1` | public | Body: `{ role, firstName, lastName, email, password, acceptedPrivacy, acceptedTerms, language?, theme? }` → `{ registrationId: string, email, role, nextStep: "email" }` |
| `POST` | `/api/v1/auth/register/verify-email` | public | Body: `{ registrationId: string, token: string }` → `{ registrationId, emailVerified: true, role, nextStep: "profile" }` |
| `POST` | `/api/v1/auth/register/resend-email` | public | Body: `{ registrationId: string }` → `{ ok: true, sentTo: string }` |
| `POST` | `/api/v1/auth/register/step-3` | public | See payloads below → `{ registrationId, profileCompleted: true, nextStep: "done" }` |
| `POST` | `/api/v1/auth/register/complete` | public | Body: `{ registrationId: string }` → `{ userId: string, role, redirectTo }` + session cookie |
| `POST` | `/api/v1/auth/login` | public | `{ email, password }` → `{ userId: string, role, redirectTo }` + session |
| `POST` | `/api/v1/auth/logout` | session | → `{ ok: true }` |
| `GET` | `/api/v1/auth/me` | optional | `null` or `{ id: string, role, email, firstName, redirectTo, language, theme }` |
| `GET` | `/api/v1/reference/cities` | public | `{ items: Array<{ id: string, name: string }> }` |
| `GET` | `/api/v1/reference/clinics?cityId=` | public | `{ items: Array<{ id: string, cityId: string, name: string }> }` |
| `GET` | `/api/v1/reference/specialties` | public | `{ items: Specialty[] }` — four values |
| `GET` | `/api/v1/legal/privacy?lang=` | public | `{ lang, title, body }` (**Open:** copy) |
| `GET` | `/api/v1/legal/terms?lang=` | public | `{ lang, title, body }` |

**Step-3 patient body**

```ts
{
  registrationId: string;
  dob: string; // YYYY-MM-DD
  gender: "female" | "male";
  cityId: string;
  clinicId: string; // home clinic
}
```

**Step-3 doctor body** (`multipart/form-data`)

```ts
{
  registrationId: string;
  dob: string;
  cityId: string;
  clinicId: string;
  specialty: "family_doctor" | "cardiologist" | "dermatologist" | "paediatrician";
  yearsPractice: number;
  visitDurationMinutes: 20 | 30 | 45;
  licenseFile?: File; // optional — Paper
}
```

**Doctor complete side effects:** default schedule (Mon–Fri 09–18, lunch 13–14, weekend off, chosen duration, Offline only, default base price e.g. 600 UAH), placeholder photo, visible in search.

**File upload:** `licenseFile` — jpeg/png/webp/pdf when present (optional — Paper); max **10 MB**; store under `uploads/`; path in `doctor_profiles.license_file_url` (`tech-stack.md`).

### Invariants

- Email unique across users and active registrations.
- Consent required on step 1.
- Password ≥ 8 chars; password confirm is client-only.
- Steps must run in order: 1 → verify → 3 → complete.
- Session is created only on **complete** (or login) — not on step 1–3.
- `cityId` / `clinicId` / `specialty` must exist in seed reference data.
- Session cookie: `HttpOnly`, `Secure` in production, `SameSite=Lax`.
- Optional `reg_session` cookie may mirror `registrationId` between steps.

### Errors

Shared auth codes (see Accounts section). Field-level validation returns `AUTH_VALIDATION_FAILED` with `fields: { key: code }`.

### Out of scope

Forgot password, social login, license verification, **SMS/phone OTP**.

### Open questions

Phone on which step after design (profile vs later SCR-07) — Paper step 3 patient has no phone; collect on SCR-07 if missing. Legal page HTML/copy source only (`GET /legal/*`).

---

## SCR-02 Search and results

**Product pointer:** [SCR-02](./product-spec.md#scr-02-search-and-results), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-13](./product-spec.md#r-13-booking-horizon), [R-14](./product-spec.md#r-14-reviews-and-ratings), [R-15](./product-spec.md#r-15-favourites), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: `q` (optional search); `cityId`, `clinicId`, `specialty`, `format` (`offline`|`online`), `date`, `minRating`, `priceMin`, `priceMax` (all optional filters); `sort` (`rating` \| `nearest_slot`, default `nearest_slot`); `cursor` + `limit` for pagination
- Out: `{ total, nextCursor, items[] }` — each item: doctor card fields below; `prefill` block when logged-in patient (home city/clinic ids)
- Errors: `SEARCH_FAILED` (unexpected server error only); empty list is **not** an error
- Auth: **public**. Optional session enriches `isFavourite` + ranking prefill

### Who is allowed

- Guest and anyone: read search results and doctor public card fields.
- No write on this screen (favourites on SCR-02/03 endpoints).

### Commands / queries

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/v1/doctors/search` | public (+ optional session) | Query params as Contract In |

**Doctor card object (`items[]`):**

| Field | Source |
|---|---|
| `id`, `firstName`, `lastName`, `specialty` | `doctor_profiles` (`id: string`) |
| `clinicName`, `cityName`, `clinicId`, `cityId` | join |
| `photoUrl` | placeholder or SCR-07 upload |
| `supportedFormats` | `offline` \| `online` \| `both` |
| `nearestFreeAt` | computed slot in Zone A matching filters (**R-03**) |
| `basePrice`, `promoPrice` | effective display for bookable window |
| `ratingAverage`, `reviewCount` | aggregate from reviews |
| `isFavourite` | `false` for guest; patient lookup |

**Ranking / sort (Confirmed):**

1. If logged-in patient and multiple clinics in result set: **home clinic doctors first** (**R-01**).
2. `sort=rating`: higher `ratingAverage` first (tie-breaker: nearest slot).
3. `sort=nearest_slot`: earliest `nearestFreeAt` first (nulls last).
4. Specialty filter: exact match only.
5. Format filter: doctor supports format; `nearestFreeAt` must be bookable in that format.
6. Date filter: has free slot on that calendar day inside Zone A.

**Search `q`:** matches specialty name, doctor name, clinic name (case-insensitive, both languages in i18n data if stored).

### Invariants

- `nearestFreeAt` never outside Zone A; null if no free slot in window under filters.
- Prices shown, never charged.
- Guest: `isFavourite` always false.

### Errors

| Code | Meaning |
|---|---|
| `SEARCH_FAILED` | Generic failure |

### Out of scope

Booking, favourites write, review write, payments.

### Open questions

Full specialty list beyond four — **Open** (product).

---

## SCR-03 Doctor profile

**Product pointer:** [SCR-03](./product-spec.md#scr-03-doctor-profile), [R-04](./product-spec.md#r-04-appointment-format), [R-14](./product-spec.md#r-14-reviews-and-ratings), [R-15](./product-spec.md#r-15-favourites), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: `doctorId`; favourite toggle via separate endpoints
- Out: full public profile + `reviews[]` (paginated list), aggregates, `isFavourite`
- Errors: `DOCTOR_NOT_FOUND`
- Auth: **public** read; favourite + recently-viewed: **patient** only

### Who is allowed

- Any caller: read public doctor profile (not another patient’s private data).
- Patient only: favourite toggle, record recently viewed.

### Commands / queries

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/v1/doctors/:doctorId` | public | `doctorId: string`. Profile + reviews; optional session → `isFavourite` |
| `POST` | `/api/v1/patients/me/favourites/:doctorId` | patient | Add favourite → `{ ok: true, isFavourite: true }` |
| `DELETE` | `/api/v1/patients/me/favourites/:doctorId` | patient | Remove → `{ ok: true, isFavourite: false }` |
| `POST` | `/api/v1/patients/me/recently-viewed/:doctorId` | patient | Upsert; keep last **10** unique (**R-16** / SCR-06) |

**Profile `Out` fields:** `id: string`, names, `photoUrl`, `specialty`, `clinic`, `city`, `address`, `yearsPractice`, `bio`, `languages[]`, `supportedFormats`, `visitDurationMinutes`, `basePrice`, `promoPrice`, `ratingAverage`, `reviewCount`, `consultationCount` (computed completed visits), `reviews[]` (`id: string`, `rating`, `text`, `patientDisplayName`, `createdAt` — no private patient id), `isFavourite`.

Opening profile (patient) should call `recently-viewed` once per navigation.

### Invariants

- Reviews on profile are **read-only** list; write only via SCR-06 Past appointment (**R-14**).
- Invalid `doctorId` → `DOCTOR_NOT_FOUND`, not another doctor’s data.

### Errors

| Code | Meaning |
|---|---|
| `DOCTOR_NOT_FOUND` | |
| `AUTH_FORBIDDEN` | Favourite/recently-viewed as non-patient |

### Out of scope

Write review; edit doctor profile (doctor uses SCR-07/09).

### Open questions

Review list pagination size on profile — suggest 10 with “load more”.

---

## SCR-04 Calendar

**Product pointer:** [SCR-04](./product-spec.md#scr-04-calendar), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-05](./product-spec.md#r-05-appointment-duration), [R-13](./product-spec.md#r-13-booking-horizon), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: `doctorId: string`, `date` (ISO date, optional — default first bookable day or today); optional `contextAppointmentId: string` when rescheduling (validates same doctor)
- Out: `{ zoneAStart, zoneAEnd, visitDurationMinutes, supportedFormats[], days[]?, slots[] }` — for requested `date`, `slots[]`: `{ startAt, status }` where status = `free` \| `taken` \| `reserved` \| `past` \| `day_off`; optional per-day summary for two-month UI
- Errors: `DOCTOR_NOT_FOUND`, `CALENDAR_FAILED`, `APPOINTMENT_FORBIDDEN`
- Auth: **patient** for booking flows

**Decision:** `GET calendar` requires **patient session** (booking wizard step 2). Guest must log in before wizard opens.

**Design note (Paper):** format Offline/Online toggle is shown on **calendar step**; client holds `format` and sends it on confirm (`POST /appointments`). Response still exposes `supportedFormats` for the toggle.

### Who is allowed

- Logged-in patient viewing any doctor’s public calendar for booking/reschedule.
- Not another patient’s appointments.

### Commands / queries

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/v1/doctors/:doctorId/calendar` | patient | Query: `date?`, `month?`, `from?`, `to?`, `contextAppointmentId?: string` |

**Slot computation:** shared Slots section (compute on read, Zone A, occupancy rules).

**Two-month UI:** optional `GET` with `from` + `to` dates returning per-day flags: `hasFree`, `full`, `dayOff`, `outsideWindow` for calendar disable/legend.

### Invariants

- Only `free` slots may proceed to SCR-05 confirm.
- `taken` / `reserved` / `past` / `day_off` never returned as bookable.
- Reschedule context: `contextAppointmentId` must be patient’s `Upcoming` with same `doctorId`.

### Errors

| Code | Meaning |
|---|---|
| `DOCTOR_NOT_FOUND` | |
| `CALENDAR_FAILED` | |
| `APPOINTMENT_FORBIDDEN` | Wrong reschedule context |

### Out of scope

Holding slot without booking; booking outside Zone A.

### Open questions

Polling interval — frontend architecture.

---

## SCR-05 Confirm booking

**Product pointer:** [SCR-05](./product-spec.md#scr-05-confirm-booking), [R-02](./product-spec.md#r-02-appointment-statuses), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-07](./product-spec.md#r-07-rescheduling), [R-10](./product-spec.md#r-10-notifications), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

**New book (FLO-01)**

- In: `doctorId: string`, `startAt`, `format` (`offline`|`online` — from wizard step 2 per Paper), `reason` (optional string, may be empty)
- Out: `{ appointment }` status `Upcoming` (`appointment.id: string`); frontend shows toast → SCR-06
- Errors: `SLOT_TAKEN`, `SLOT_OUTSIDE_WINDOW`, `SLOT_NOT_FREE`, `AUTH_VALIDATION_FAILED`
- Auth: patient

**Patient reschedule (FLO-02)**

- In: path `id: string`; body `newStartAt`, `format`, optional `reason`
- Out: `{ oldAppointment, newAppointment }` — old `Rescheduled`, new `Upcoming`
- Errors: same slot errors + `APPOINTMENT_INVALID_TRANSITION`, `APPOINTMENT_FORBIDDEN`
- Auth: patient, owner only

### Who is allowed

- Patient books for self only.
- Reschedule: own `Upcoming` only; not while another `Reschedule Pending` on same row (use SCR-12 flow).

### Commands / queries

| Method | Path | Auth | Notes |
|---|---|---|---|
| `POST` | `/api/v1/appointments` | patient | New book — uses `book` command |
| `POST` | `/api/v1/appointments/:id/reschedule` | patient | Patient move — `patientReschedule` |

**Confirm summary (read-only preview):** optional `GET /api/v1/appointments/preview?doctorId&startAt` returning doctor, place, duration, effective price, format options — or client assembles from SCR-03 + calendar.

**On success:**

1. Transaction commits appointment.
2. Create notification for **doctor** (**R-10**). Patient not notified (they acted).
3. Return appointment DTO.

**On `SLOT_TAKEN`:** no appointment created; client stays in wizard step 2.

### Invariants

- Re-validate slot at confirm (not only at calendar read) — **R-03**, FLO-06.
- Format must be supported by doctor; default `offline` if both.
- Slot not held while confirm screen open.
- Duration = doctor’s `visit_duration_minutes` at `startAt` (from schedule at book time).

### Errors

Slot + appointment codes from shared sections.

### Out of scope

Payment; family booking; slot hold.

### Open questions

EN/UK copy for `SLOT_TAKEN` — frontend i18n.

---

## SCR-06 My appointments (patient cabinet)

**Product pointer:** [SCR-06](./product-spec.md#scr-06-my-appointments), [R-02](./product-spec.md#r-02-appointment-statuses), [R-06](./product-spec.md#r-06-cancellation), [R-07](./product-spec.md#r-07-rescheduling), [R-14](./product-spec.md#r-14-reviews-and-ratings), [R-15](./product-spec.md#r-15-favourites), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: session; actions on appointments; `POST` review from Past row; clear recently viewed
- Out: cabinet aggregate — `upcoming[]`, `past[]`, `pendingBanner`, `nextAppointment`, `miniCalendar[]`, `favourites[]`, `recentlyViewed[]`, `myReviews: { leftCount, pendingCount }`, `metrics` (widget hints), per-row `canReview`, `existingReview` (all entity ids are `string`)
- Errors: `APPOINTMENT_FORBIDDEN`, `APPOINTMENT_INVALID_TRANSITION`, `REVIEW_ALREADY_EXISTS`, `REVIEW_FORBIDDEN`, validation errors
- Auth: patient, self only

### Who is allowed

- Patient sees only own appointments and own favourites/reviews.

### Commands / queries

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/v1/patients/me/cabinet` | patient | Aggregated dashboard (**preferred**) — includes `myReviews` counts for Paper widget |
| `GET` | `/api/v1/patients/me/reviews` | patient | Optional detail for «Переглянути»: `{ left[], pending[] }` |
| `DELETE` | `/api/v1/patients/me/recently-viewed` | patient | Clear all — Paper «Очистити» |
| `GET` | `/api/v1/patients/me/appointments` | patient | Alternative: list only |
| `POST` | `/api/v1/appointments/:id/cancel` | patient | `id: string`; `Upcoming` or pending via SCR-12 |
| `GET` | `/api/v1/patients/me/favourites` | patient | Carousel data (if not using cabinet) |
| `GET` | `/api/v1/patients/me/recently-viewed` | patient | Last 10 doctors |
| `POST` | `/api/v1/reviews` | patient | `{ appointmentId: string, rating (1-5), text? }` |

**Appointment row `Out`:** `id: string`, doctor, place, `startAt`, duration, `format`, `status`, `reason`, `cancelledBy`, `proposedStartAt` (if pending), `canMove`, `canCancel`, `pendingDecisionUrl` (SCR-12).

**Grouping:** Upcoming = `Upcoming` + `Reschedule Pending`; Past = `Completed` + `Cancelled` + `Rescheduled`.

**Review rules (**R-14**):** one review per Past appointment; `canReview` true when Past status and no review yet. `myReviews.pendingCount` = Past rows with `canReview`.

**Cancel:** `cancel` command; notify doctor; slot freed per **R-02**.

**Move:** no dedicated endpoint — client opens wizard → SCR-04/05 reschedule endpoint.

### Invariants

- `Reschedule Pending` rows: `canMove` false; decision via SCR-12.
- Cancelling pending releases proposed slot.

### Notifications triggered

Patient cancel → doctor notified. Patient reschedule success → doctor notified (on SCR-05).

### Out of scope

Doctor calendar; payment; family profiles.

### Open questions

Whether proposed time shown on list row vs SCR-12 only — **Open** (frontend).

---

## SCR-07 My profile

**Product pointer:** [SCR-07](./product-spec.md#scr-07-my-profile), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-11](./product-spec.md#r-11-language-and-theme), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: PATCH allowed fields only (edit mode)
- Out: role-specific profile view + `language`, `theme`
- Errors: `AUTH_VALIDATION_FAILED`, `AUTH_EMAIL_TAKEN`, `AUTH_FORBIDDEN`
- Auth: self only (`patient` or `doctor`)

### Who is allowed

- User reads/updates own profile only.

### Commands / queries

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/v1/patients/me/profile` | patient | View |
| `PATCH` | `/api/v1/patients/me/profile` | patient | Editable fields + optional `photo` multipart (Paper) |
| `GET` | `/api/v1/doctors/me/profile` | doctor | View |
| `PATCH` | `/api/v1/doctors/me/profile` | doctor | Editable + `photo` multipart |

**Patient PATCH:** `firstName`, `lastName`, `phone`, `email`, `dob`, `gender` (`female`\|`male`), `homeCityId: string`, `homeClinicId: string`, `photo?`, `language`, `theme`.

**Doctor PATCH:** `firstName`, `lastName`, `phone`, `email`, `cityId: string`, `clinicId: string`, `bio`, `languages[]`, `education[]` (replace list: `{ id?: string, kind, title, subtitle?, yearFrom, yearTo? }`), `photo` (optional file), `language`, `theme`. Not specialty, years, license, hours, price.

**Doctor GET `Out`:** above fields + read-only `specialty`, `yearsPractice`, `licenseFileUrl` (`string | null`), `dob`, `consultationCount` (computed). All ids `string`.

### Invariants

- Email uniqueness on change.
- City/clinic ids must exist in seed.
- Role not editable.

### Out of scope

Password change; SCR-09 schedule fields.

### Open questions

None — photo same upload rules as license (images only, 10 MB).

---

## SCR-08 Doctor’s day (doctor cabinet)

**Product pointer:** [SCR-08](./product-spec.md#scr-08-doctors-day), [R-02](./product-spec.md#r-02-appointment-statuses), [R-06](./product-spec.md#r-06-cancellation), [R-07](./product-spec.md#r-07-rescheduling), [R-10](./product-spec.md#r-10-notifications), [R-13](./product-spec.md#r-13-booking-horizon), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: `date` (optional, default today); actions on visits
- Out: `{ metrics, visits[], nextVisit, pendingPatients[], freeWindowsToday[] }` for Zone A day
- Errors: `APPOINTMENT_FORBIDDEN`, `APPOINTMENT_INVALID_TRANSITION`, `SLOT_NOT_FREE`, `SLOT_OUTSIDE_WINDOW`
- Auth: doctor, self only

### Who is allowed

- Doctor sees only own visits and metrics.

### Commands / queries

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/v1/doctors/me/dashboard` | doctor | `?date=`; includes metrics |
| `POST` | `/api/v1/appointments/:id/complete` | doctor | `id: string`; `Upcoming` → `Completed` |
| `POST` | `/api/v1/appointments/:id/cancel` | doctor | One visit; `cancelledBy=doctor` |
| `POST` | `/api/v1/appointments/:id/propose` | doctor | Body: `{ proposedStartAt, format? }` → `Reschedule Pending` |

**Metrics:** `visitsToday`, `pendingCount`, `freeSlotsToday`, `cancellationsLast7Days`.

**Propose:** `doctorPropose` command; patient notified; proposed slot reserved.  
**Design note (Paper):** modal shows Offline/Online toggle — API accepts optional `format`; default = existing visit format if omitted.

**Visit row:** `id: string`, patient display name (first + last), time, format, reason, status, `proposedStartAt` when pending.

### Invariants

- Visits only inside Zone A on this screen.
- No second proposal while pending.
- No single-cancel of `Reschedule Pending` here (patient SCR-12 or SCR-09 bulk).

### Notifications

Cancel visit → patient. Propose → patient. Complete → none.

### Out of scope

Bulk cancel (SCR-09); other doctors’ data.

### Open questions

Day nav UI only — no API change.

---

## SCR-09 Doctor’s working hours

**Product pointer:** [SCR-09](./product-spec.md#scr-09-doctors-working-hours), [R-04](./product-spec.md#r-04-appointment-format), [R-05](./product-spec.md#r-05-appointment-duration), [R-08](./product-spec.md#r-08-doctor-schedule-changes), [R-13](./product-spec.md#r-13-booking-horizon)

### Contract

- In: GET schedule; PATCH zone-appropriate fields; POST bulk-cancel confirm payload
- Out: 3-month schedule with Zone A/B metadata, frozen flags, `basePrice`, `promoPrice`, `visitDurationMinutes`, `supportedFormats`, working hours template, vacation days
- Errors: `SCHEDULE_FORBIDDEN`, `SCHEDULE_ZONE_FROZEN`, `SCHEDULE_VALIDATION_FAILED`, `BULK_CANCEL_INVALID_SCOPE`
- Auth: doctor, self only

### Who is allowed

- Doctor edits own schedule only.

### Commands / queries

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/v1/doctors/me/schedule` | doctor | Full 3-month view + zone boundaries |
| `PATCH` | `/api/v1/doctors/me/schedule` | doctor | Zone B: hours, lunch, duration, vacation, format, `basePriceEffectiveFrom`, `promoPrice`, `promoValidUntil` (optional date) |
| `POST` | `/api/v1/doctors/me/schedule/bulk-cancel` | doctor | `{ scope, from?, to?, confirm: true }` |

**Bulk-cancel scopes:** `whole_day`, `rest_of_day`, `rest_of_week`, `custom_range` — all dates within Zone A only.

**Zone A:** reject PATCH that changes hours, duration, or base price. Allow bulk-cancel + vacation mark when day empty.

**Price:** base frozen in Zone A; new base applies from `first day after Zone A`. **Promo:** optional `promo_price` + `promo_valid_until` (inclusive, Kyiv date); effective display = promo when active else base (`tech-stack.md`).

### Invariants

- Bulk cancel: each affected visit → `Cancelled`, `cancelledBy=doctor`, notify each patient (**R-08**, **FLO-05**).
- Pending in range: cancelled + reserved slot released.
- No silent auto-cancel via hours edit.

### Out of scope

Rooms; changing booked appointment format/duration in place.

### Open questions

None for storage model (see `tech-stack.md` §7).

---

## SCR-10 In-app notifications

**Product pointer:** [SCR-10](./product-spec.md#scr-10-in-app-notifications), [R-10](./product-spec.md#r-10-notifications)

### Contract

- In: `open` (list), `readOne` (`notificationId`), `readAll`
- Out: `{ unreadCount, items[] }` — unread only until read; after read, item removed from list (no history)
- Errors: `NOTIFICATION_FORBIDDEN`, `NOTIFICATION_NOT_FOUND`
- Auth: logged-in user (patient or doctor), self only

### Who is allowed

- User sees only own notifications.

### Commands / queries

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/v1/notifications` | session | Unread + list for bell; item `id: string` |
| `POST` | `/api/v1/notifications/:id/read` | session | Mark one read → remove from active list |
| `POST` | `/api/v1/notifications/read-all` | session | Mark all read |

**Notification `Out`:** `id: string`, `type`, `createdAt`, `read`, payload (`appointmentId: string`, doctor/patient name, event summary). Types align with **R-10** event table.

**Events that create notifications:** patient books; patient cancels; doctor cancels (incl. bulk); patient reschedules; doctor proposes; patient accepts/picks another/cancels pending.

Actor who performed action does **not** receive notification for that action.

### Invariants

- No email/SMS/push in MVP.
- Read notifications are not kept as history.

### Out of scope

Reminder dashboard widgets (soft UI, not R-10).

### Open questions

Exact notification copy per type — frontend i18n templates.

---

## SCR-11 Doctor performance

**Out of MVP.** Do not fill.

---

## SCR-12 Reschedule pending

**Product pointer:** [SCR-12](./product-spec.md#scr-12-reschedule-pending-patient-decision), [R-02](./product-spec.md#r-02-appointment-statuses), [R-07](./product-spec.md#r-07-rescheduling), [R-10](./product-spec.md#r-10-notifications)

### Contract

- In: `appointmentId: string` (pending visit); action: `accept` | `pick_another` (via SCR-04/05) | `cancel`
- Out: `accept` → old `Rescheduled`, new `Upcoming` at proposed time; `cancel` → `Cancelled`; pick another → same as reschedule confirm with pending context
- Errors: `APPOINTMENT_FORBIDDEN`, `APPOINTMENT_INVALID_TRANSITION`, `SLOT_TAKEN` (on accept if proposed slot lost)
- Auth: patient, owner only

### Who is allowed

- Patient who owns the pending appointment.

### Commands / queries

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/api/v1/appointments/:id/pending-decision` | patient | `id: string` — original vs proposed summary for SCR-12 UI |
| `POST` | `/api/v1/appointments/:id/accept-proposal` | patient | `patientAcceptProposal` |
| `POST` | `/api/v1/appointments/:id/cancel` | patient | Pending cancel — releases both slots |
| `POST` | `/api/v1/appointments/:id/reschedule` | patient | Pick another (FLO-03 path) — supersedes proposal |

**Accept:** if proposed slot no longer free → `SLOT_TAKEN` / `SLOT_NOT_FREE`; patient may pick another or cancel.

### Invariants

- No fourth action; no independent FLO-02 while pending.
- On accept/pick another: doctor notified; patient not.
- On cancel: doctor notified.

### Out of scope

Pending expiry; changing doctor.

### Open questions

Panel vs full page — frontend only.

---

## FLO-01 Patient books an appointment

**Product pointer:** [FLO-01](./product-spec.md#flo-01-patient-books-an-appointment)

| Step | Server |
|---|---|
| SCR-02 browse | `GET /doctors/search` (guest OK) |
| Login if guest Book | `POST /auth/login` or register steps 1→verify→3→complete |
| Wizard SCR-03 | `GET /doctors/:id`, `POST recently-viewed` |
| Wizard SCR-04 | `GET /doctors/:id/calendar`; client picks `format` (Paper) |
| Wizard SCR-05 confirm | `POST /appointments` — transaction + `SLOT_TAKEN` guard |
| Success | Notification → doctor; return `Upcoming` |
| SCR-06 | `GET /patients/me/cabinet` |

**Invariants at confirm:** Zone A, not taken/reserved, format valid, **R-03** one timeline.

---

## FLO-02 Patient reschedules

| Step | Server |
|---|---|
| SCR-06 Move | Verify `Upcoming`, same patient |
| SCR-04 | Calendar with `contextAppointmentId` |
| SCR-05 | `POST /appointments/:id/reschedule` — old `Rescheduled`, new `Upcoming`, atomic slot swap |
| Notify doctor on success |

Blocked while `Reschedule Pending` on same appointment.

---

## FLO-03 Doctor proposes a new time

| Step | Server |
|---|---|
| SCR-08 propose | `POST /appointments/:id/propose` with `proposedStartAt` in Zone A |
| State | `Reschedule Pending`; original taken, proposed reserved |
| SCR-10 | Notification → patient |
| SCR-12 accept | `POST accept-proposal` |
| SCR-12 pick another | `POST reschedule` (pending context) |
| SCR-12 cancel | `POST cancel` |

---

## FLO-04 Patient or doctor cancels

| Actor | Endpoint | Notes |
|---|---|---|
| Patient `Upcoming` | `POST /appointments/:id/cancel` | SCR-06 |
| Patient pending | `POST cancel` on SCR-12 | Both slots freed |
| Doctor one visit | `POST cancel` | SCR-08, `Upcoming` only |

Final statuses not cancellable. `cancelledBy` set. Other party notified.

---

## FLO-05 Doctor changes hours and bulk-cancels

| Zone | Server |
|---|---|
| Zone A | `POST bulk-cancel` with confirm; then optional vacation PATCH when day empty |
| Zone B | `PATCH schedule` for hours, duration, format, base/promo price from first day after Zone A |

No silent cancel via hours shrink in Zone B (no appointments there).

---

## FLO-06 Concurrent booking of the same slot

1. Two `POST /appointments` with same `doctorId` + `startAt`.
2. First transaction commits → `Upcoming`.
3. Second hits unique constraint / availability check → `409` or `400` with `SLOT_TAKEN`.
4. Frontend shows plain-language refusal; user picks another slot.

No notification to refused patient. Doctor notified only for winner.

---

## Cross-cutting (appendix)

Full tooling detail: **[tech-stack.md](./tech-stack.md)**.

| Topic | Decision |
|---|---|
| Monorepo | pnpm workspaces — `apps/api`, `apps/web` |
| API prefix | `/api/v1` |
| Resource ids | Always **`string`** in JSON (path params, body, response) |
| Contract | OpenAPI 3 from Fastify + TypeBox; Orval → React Query on web |
| Time storage | `timestamptz` UTC in DB; Zone A / display in `Europe/Kyiv` |
| Error envelope | `{ error: { code, message?, fields? } }` — UI copy from i18n by `code` |
| Pagination | Cursor-based for search; cabinet lists may be full for MVP |
| File storage | Local `uploads/`; 10 MB; jpeg/png/webp/pdf (pdf license only) |
| Sessions | Postgres; HTTP-only cookie; 14-day TTL |
| Passwords | argon2 (or bcrypt); min 8 chars |
| Tests | Vitest + Postgres (Compose) — slots, book race, authz |
| Auto-complete job | Cron/worker: `Upcoming` → `Completed` after slot end |
| Design vs older product lines | Paper wins for onboarding steps, gender, optional license, patient photo, clear recently-viewed, reviews widget counts, format on calendar step, optional format on propose |
