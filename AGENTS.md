# AGENTS.md

## 1. Project overview

Digital Healthcare Booking Platform — a self-service website where patients find a doctor, see real free times, book a slot, and get instant confirmation. Doctors see their own schedule and manage appointments. This is a booking layer only, not a full hospital system.

**User roles:** Patient, Doctor. No admin/receptionist role exists.

## 2. Project structure

| What | Where |
|---|---|
| Product requirements (source of truth) | `docs/spec/product-spec.md` |
| Frontend specification (UI/client) | `docs/spec/frontend-spec.md` |
| Backend specification (server/API) | `docs/spec/backend-spec.md` |
| Project context (client brief summary) | `docs/project-context.md` |
| Cursor rules | `.cursor/rules/` |
| Cursor skills | `.cursor/skills/` |

## 3. Source of truth

- `product-spec.md` defines **what** the product does.
- `frontend-spec.md` defines UI layout, states, i18n, and what screens show/submit.
- `backend-spec.md` defines server behaviour: auth, state machine, slot honesty, API contracts.
- Frontend and backend specs **must not contradict** `product-spec.md`.

## 4. Specification system

- `R-*` — shared product rules (e.g. R-01 Accounts, R-03 Honest slots).
- `SCR-*` — screens/areas (SCR-01 through SCR-12).
- `FLO-*` — user flows (FLO-01 through FLO-06).
- Frontend and backend specs **reuse the same IDs** — do not invent new screens or flows.
- Every `SCR-*` in both specs must include a matching **Contract** block (`In`, `Out`, `Errors`, `Auth`).

## 5. AI working rules

1. **Read the relevant spec section** before implementing anything.
2. `product-spec.md` wins over lower-level documents if there is a conflict.
3. Never invent requirements that are marked **Open** or are not specified.
4. Ask the user before making a product decision when the spec does not define it.
5. Keep frontend/backend Contract blocks aligned.
6. Respect existing Cursor rules (`.cursor/rules/`) and skills (`.cursor/skills/`).
7. Do not modify specification files unless explicitly asked.

## 6. Important product constraints

- **Two account types:** patient and doctor. One email = one role. Login via email + password.
- **14-day booking horizon:** patients can book up to 14 days ahead. Doctor calendar shows 3 months but slots beyond 14 days are view-only.
- **One doctor = one timeline** (MVP). No multi-room or parallel scheduling.
- **Double booking must be impossible:** enforced at the database level (constraint/transaction), not just UI. Two patients booking the same slot at the same instant — one succeeds, one gets a clear refusal.
- **Appointment statuses:** Upcoming, Reschedule Pending, Completed, Cancelled, Rescheduled. No-show is out of MVP. Final statuses (Completed, Cancelled, Rescheduled) have no further transitions.
- **Data isolation:** a patient sees only their own appointments; a doctor sees only their own calendar. Enforced server-side per request, not by hiding UI.
- **EN/UK localisation:** switchable in-app, persists across sessions. All UI text in translation files.
- **Light/dark themes:** both fully designed, follows OS setting on first visit, toggle persists. No white flash.
- **In-app notifications (bell):** unread until opened, then removed. No email/SMS.
- **Doctor performance (SCR-11):** out of MVP.
- **GDPR/legal:** out of MVP.
- **Out of scope:** medical records, payments/charging, family profiles, reviews/ratings, email/SMS reminders, insurance, admin role, native mobile app.
