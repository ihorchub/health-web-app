# SCR-01 — API handoff for frontend (Maryna)

**Status:** Backend registration + login ready for UI integration (14 Sep 2026).  
**Spec:** Full contracts in `backend-spec.md` SCR-01; this file is the practical cheat sheet.

## Basics

- **Base URL (dev):** `http://localhost:3000` (or Vite proxy `/api` → same host)
- **Prefix:** `/api/v1`
- **Auth after login/complete:** HTTP-only cookie `medicly_sid` — use `credentials: 'include'` on all fetches
- **Errors:** `{ error: { code, message?, fields? } }` — map `code` to i18n

## Reference data (dropdowns)

| Method | Path |
|--------|------|
| GET | `/reference/cities` |
| GET | `/reference/clinics?cityId={id}` |
| GET | `/reference/specialties` |

## Legal (consent links)

| Method | Path |
|--------|------|
| GET | `/legal/privacy?lang=en\|uk` |
| GET | `/legal/terms?lang=en\|uk` |

## Sign-up wizard (4 steps)

Store `registrationId` from step 1 in component state (or sessionStorage).

### Step 1 — Дані

`POST /auth/register/step-1` JSON:

```json
{
  "role": "patient" | "doctor",
  "firstName": "…",
  "lastName": "…",
  "email": "…",
  "password": "…",
  "acceptedPrivacy": true,
  "acceptedTerms": true,
  "language": "en",
  "theme": "light"
}
```

**Response:** `{ registrationId, email, role, nextStep: "email" }`  
**Dev only:** also `devVerifyToken` — use for step 2 without reading server logs.

### Step 2 — Email

UI: “check your inbox” (Paper). **API:** still call verify (no real email in MVP).

`POST /auth/register/verify-email` JSON:

```json
{ "registrationId": "…", "token": "…" }
```

Token: `devVerifyToken` from step 1 in development, or from API logs.

`POST /auth/register/resend-email` — `{ registrationId }` (rate limit 60s).

**Resume wizard:** `GET /auth/register/:registrationId/status` → `{ emailVerified, profileCompleted, nextStep }`.

### Step 3 — Профіль

**Patient** — `POST /auth/register/step-3/patient` JSON:

```json
{
  "registrationId": "…",
  "dob": "YYYY-MM-DD",
  "gender": "female" | "male",
  "cityId": "city_kyiv",
  "clinicId": "clinic_kyiv_center"
}
```

**Doctor** — `POST /auth/register/step-3/doctor` **`multipart/form-data`**:

| Field | Type |
|-------|------|
| registrationId | string |
| dob | string |
| cityId | string |
| clinicId | string |
| specialty | family_doctor \| cardiologist \| dermatologist \| paediatrician |
| yearsPractice | number (as string in form) |
| visitDurationMinutes | 20 \| 30 \| 45 |
| licenseFile | file (optional jpeg/png/webp/pdf, max 10MB) |

**Response:** `{ registrationId, profileCompleted: true, nextStep: "done" }`

### Step 4 — Готово

`POST /auth/register/complete` JSON: `{ "registrationId": "…" }`  
**Response:** `{ userId, role, redirectTo }` + **session cookie**

| role | redirectTo (route path) |
|------|-------------------------|
| patient | `/appointments` |
| doctor | `/doctor/day` |

## Log in

`POST /auth/login` JSON: `{ email, password }` → same shape as complete + cookie.

`POST /auth/logout` — clears cookie.

`GET /auth/me` — `null` (guest) or `{ id, role, email, firstName, redirectTo, language, theme }`.

If `GET /auth/me` returns a user, **skip SCR-01** and redirect using `redirectTo`.

## Phone field

Not collected on step 3 in current API (Paper / backend). Collect on SCR-07 profile later if needed.

## Not in this handoff

OpenAPI/Orval generated client (coming later). Until then, use the paths above manually.
