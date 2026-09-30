# Frontend specification

**Status:** Aligned with product-spec (updated — doctor propose / `Reschedule Pending` / SCR-12 / FLO-03 out of MVP); implementation stack locked 14 Sep 2026  
**Source of truth:** [product-spec.md](./product-spec.md) (IA overlay folded)  
**IA / chrome:** [ia-chrome-decision.md](./ia-chrome-decision.md) — dialogue record; product-spec wins after fold.  
**Pair file:** [backend-spec.md](./backend-spec.md) — **Contract** blocks must match.  
**Implementation:** [tech-stack.md](./tech-stack.md)

This file describes **UI**: layout, states, i18n, what the screen shows and submits. It does not decide database, transactions, or route implementation.

How to fill: one `SCR-*` at a time. Use skill `write-layer-spec`.

---

## Implementation stack (Medicly)

| Area | Choice |
|---|---|
| App | **React** + **TypeScript**, **Vite** |
| UI | **MUI** (Medicly theme / Manrope) |
| Routing | **React Router** |
| Server state | **TanStack React Query** |
| API | **Orval**-generated client + hooks from **OpenAPI** |
| Auth to API | `credentials: 'include'` (HTTP-only session cookie) |
| Dev proxy | Vite proxies `/api` → Fastify (`tech-stack.md`) |

**Defaults (implementation — not product):**

| Topic | Decision |
|---|---|
| Phone field | Optional `+380` mask in UI; server: non-empty string |
| Password confirm | Client-only on sign-up step 1 |
| DOB | Date in the past (same as backend) |
| Doctor photo | jpeg/png/webp, max 10 MB |
| SCR-04 calendar refresh | React Query refetch **30s** while wizard open + on focus; invalidate after book |
| API errors | Map `error.code` to i18n strings |

Layout/chrome **Open** items (exact notification dropdown) are design polish — do not block API integration. SCR-12 / FLO-03 are **Out of MVP**.

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

### Contract

**Sign up**

- In: `role` (patient | doctor) + role-specific fields + `accepted_privacy` + `accepted_terms` (both required, R-16)
- Out: authenticated session; redirect to **SCR-06** (patient) or **SCR-08** (doctor)
- Errors: `AUTH_EMAIL_TAKEN`, `AUTH_VALIDATION_FAILED`, `AUTH_CONSENT_REQUIRED` (+ field-level validation)
- Auth: public

**Log in**

- In: `email`, `password`
- Out: authenticated session + user role; redirect to **SCR-06** (patient) or **SCR-08** (doctor)
- Errors: `AUTH_INVALID_CREDENTIALS`, `AUTH_VALIDATION_FAILED`
- Auth: public

### Layout / regions

1. **Global bar** — language switch (EN/UK), theme toggle. Present on every screen (R-11).
2. **Mascot area** — decorative; must not block or slow the form.
3. **Mode tabs** — Log in | Sign up. User picks one.
4. **Form area** — fields change based on mode and, for sign up, on role.

If the user is already authenticated, this screen is skipped entirely.

### States

| State | What the user sees |
|---|---|
| Default | Form ready, no errors |
| Loading | Submit button disabled / spinner while request is in flight |
| Error — validation | Inline messages next to invalid fields, in the current language |
| Error — server | Server error (e.g. email already registered, wrong credentials) shown as a form-level message, in the current language |
| Success | Redirect (no visible success screen on SCR-01 itself) |

Both themes; no white flash on load.

### Fields, actions, labels

**Log in**

| Field | Type | Required | i18n key (example) |
|---|---|---|---|
| Email | text input | yes | `auth.email` |
| Password | password input | yes | `auth.password` |

Action: **Log in** button (`auth.loginButton`).

No role picker on log in — role comes from the existing account.

**Sign up — role picker**

Patient or Doctor — the user picks first (`auth.rolePatient`, `auth.roleDoctor`).

**Sign up — Patient fields (all required)**

| Field | Type | Notes | i18n key (example) |
|---|---|---|---|
| First name | text | — | `auth.firstName` |
| Last name | text | — | `auth.lastName` |
| City | dropdown | Values from seed cities | `auth.city` |
| Clinic | dropdown | Disabled until city is selected; shows only clinics in the chosen city | `auth.clinic` |
| Date of birth | date picker | — | `auth.dob` |
| Email | text | — | `auth.email` |
| Password | password | — | `auth.password` |
| Phone | text | — | `auth.phone` |

**Sign up — Doctor fields (all required)**

| Field | Type | Notes | i18n key (example) |
|---|---|---|---|
| First name | text | — | `auth.firstName` |
| Last name | text | — | `auth.lastName` |
| Date of birth | date picker | Step 3 (Профіль) | `auth.dob` |
| City | dropdown | Values from seed cities | `auth.city` |
| Clinic | dropdown | Disabled until city is selected; shows only clinics in the chosen city | `auth.clinic` |
| Specialty | dropdown | 4 options: family doctor, cardiologist, dermatologist, paediatrician | `auth.specialty` |
| Years of practice | number | — | `auth.experience` |
| Visit duration | select | 20 / 30 / 45 minutes; default 30 | `auth.visitDuration` |
| Email | text | — | `auth.email` |
| Password | password | — | `auth.password` |
| Phone | text | — | `auth.phone` |
| License / certificate | file upload | Picture or PDF; required; not verified | `auth.license` |

**Sign up — consent (R-16)**

| Field | Type | Required | Notes |
|---|---|---|---|
| Privacy Policy | checkbox + link | yes | Register disabled until checked |
| Terms of Use | checkbox + link | yes | Register disabled until checked |

Action: **Sign up** button (`auth.signupButton`) — disabled until both consent boxes checked.

**Sign-up wizard (Paper, 4 steps — 7 Sep 2026)**

| Step | Screen | Notes |
|---|---|---|
| 1 | Дані | Role, name, email, password, **password confirm** (must match; client-only), consent checkboxes |
| 2 | Email | “Check your inbox” UI — **no verification API in MVP**; user continues to step 3 |
| 3 | Профіль | Role-specific fields below; **doctor includes DOB** |
| 4 | Готово | Success → redirect |

Single `POST /register/*` after step 3. **No SMS** steps.

### Client-side checks

| Check | Rule |
|---|---|
| All fields | Required / non-empty |
| Email | Valid format (client hint) |
| Password | Min 8 characters |
| Password confirm | Must match password (sign-up step 1) |
| Date of birth | Must be in the past |
| License file | Present; picture or PDF (R-01) |
| Years of practice | Integer ≥ 0 |
| Visit duration | Must be one of 20, 30, 45 (R-05, SCR-01) |

Server is the source of truth for all validation. Client checks are for UX only.

Phone: optional `+380` mask; email: basic format hint (`tech-stack.md`).

### Theme / mascot notes

- Mascot is present on this screen (required). Name and personality are deferred to visual design.
- Light and dark themes both fully designed. First visit follows OS preference.
- No white flash on load in dark mode.

### Out of scope

- Forgot password / password recovery
- Social login
- License verification
- Dual-role accounts
- Creating cities or clinics (seed only)
- Photo upload at sign-up (placeholder until SCR-07)

### Open questions

- Phone number format / mask.
- SCR-01 multi-step onboarding artboards in Paper — **4 steps** (no SMS); same payload to API after step 3.

---

## SCR-02 Search and results

**Product pointer:** [SCR-02](./product-spec.md#scr-02-search-and-results), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-13](./product-spec.md#r-13-booking-horizon), [R-14](./product-spec.md#r-14-reviews-and-ratings), [R-15](./product-spec.md#r-15-favourites), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: `search` (optional); `filters` (optional: `city`, `clinic`, `specialty`, `format`, `date`, `min_rating`, `price_min`, `price_max`); `sort` (`rating` | `nearest_slot`); pagination cursor for show-more
- Out: list of doctor cards — each: `id`, name, specialty, clinic, city, photo, format badges, nearest free time (Zone A), `base_price`, `promo_price` (optional), `rating_average`, `review_count`, `is_favourite` (false for guest)
- Errors: `SEARCH_FAILED` (generic); empty = valid response, not error
- Auth: **public** (guest browse). Logged-in patient: same API + home city/clinic prefill + favourite state + active Book

### Layout / regions

1. **Guest header** — logo, Log in, Sign up, theme, language UK | EN (no bell, no avatar).
2. **Patient header** — «Знайти лікаря» (+ mobile «Знайти»), bell, theme, avatar (language in menu).
3. **Promo banner** — 3 steps; hero asset per design-spec / Paper FINAL.
4. **Search row** + popular query chips.
5. **Desktop filter sidebar** (right): city, clinic, specialty, format, availability, min rating, price range; reset all. **Mobile:** filter drawer.
6. **Specialty category cards** — default four + «Усі спеціальності» expand.
7. **Results** — count + sort + cards + show more.

Footer: Privacy Policy · Terms of Use · © Medicly (R-16).

### States

| State | What the user sees |
|---|---|
| Default | Results / filters per role |
| Loading | Themed skeletons (guest matrix; patient default per Paper) |
| Empty | Explicit no-matches message |
| Error | Themed error |

**Guest:** Book disabled + hint → SCR-01. Heart disabled or → login.

**Patient:** city/clinic prefill on first load; may clear/change.

### Result card fields

| Field | Notes |
|---|---|
| Photo | On card (Paper FINAL) |
| Doctor name, specialty, clinic, city | |
| Format badges | Offline / Online / Both |
| Nearest free time | Earliest in rolling bookable window (Zone A), respecting filters |
| Price | Base + promo (struck base when promo active) |
| Rating | ★ average + review count (read-only) |
| Favourite heart | Patient only |
| Book | Guest disabled; patient → wizard step 1 |

Card click → wizard step 1 (SCR-03).

### Client-side checks

None beyond disabled Book for guest. Filters sent as-is.

### Theme / bell notes

- Bell on **patient** header only.
- SCR-02 Paper FINAL — do not redesign layout without explicit reopen.

### Out of scope

Map view; write review from cards; payments/checkout; family booking.

### Open questions

Full specialty list beyond four defaults — **Open**.

---

## SCR-03 Doctor profile

**Product pointer:** [SCR-03](./product-spec.md#scr-03-doctor-profile), [R-04](./product-spec.md#r-04-appointment-format), [R-05](./product-spec.md#r-05-appointment-duration), [R-13](./product-spec.md#r-13-booking-horizon), [R-14](./product-spec.md#r-14-reviews-and-ratings), [R-15](./product-spec.md#r-15-favourites), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: `doctorId`; optional `toggle_favourite` (logged-in patient)
- Out: profile fields + `base_price`, `promo_price`, `rating_average`, `review_count`, `consultation_count` (computed), `bio`, `languages[]`, `reviews[]` (list), `is_favourite`, supported `format`
- Errors: `DOCTOR_NOT_FOUND`, `DOCTOR_FORBIDDEN` (rare)
- Auth: **public** read. Favourite toggle: patient only

### Layout / regions

**Wizard step 1** (booking modal) or standalone from SCR-02 card.

1. Photo, name, specialty, **heart** (favourite)
2. Clinic, city, address, experience
3. **About** (bio), **Languages** (consultation languages list)
4. **Price** — base + promo (struck base when active)
5. Format badges (read-only)
6. **★ rating** + **reviews list / section** (read-only averages; not write entry)
7. CTA **Choose time** → wizard step 2 (SCR-04)

**FLO-02 Move:** skip this step; read-only doctor header only.

### States

| State | What the user sees |
|---|---|
| Default | Full profile |
| Loading | Themed loading |
| Error | Doctor not found — refusal, not another user’s data |

### Behaviour

- Stars/reviews read-only here. Write review from SCR-06 Past row only (R-14).
- Primary action: step 2 calendar.

### Client-side checks

None (read-only except favourite).

### Out of scope

Payment; write review; editing doctor profile.

### Open questions

None.

---

## SCR-04 Calendar

**Product pointer:** [SCR-04](./product-spec.md#scr-04-calendar), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-05](./product-spec.md#r-05-appointment-duration), [R-13](./product-spec.md#r-13-booking-horizon), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: `doctorId`, `date` (optional — default today or first bookable day); optional `appointmentId` when rescheduling (FLO-02)
- Out: slots for selected day (`startAt`, `status`: free | taken | past | day_off); `visitDurationMinutes`; supported `formats[]`; `zoneAStart`, `zoneAEnd` for calendar disable logic
- Errors: `DOCTOR_NOT_FOUND`, `CALENDAR_FAILED`, `APPOINTMENT_FORBIDDEN`
- Auth: patient (logged in to book; guest may preview only if product allows — **booking requires login**)

### Layout / regions

**Wizard step 2** (modal). Not full-page chrome when inside wizard.

1. **Two month grids** side by side (mobile: stacked/swipe). Days outside rolling bookable window / past: **disabled**.
2. **Time slot chips below** months (not beside one month). Day legend: bookable · full · day off · selected.
3. Doctor identity (name, specialty).
4. Format **label** (supported formats); chosen on SCR-05.
5. Visit duration visible as chip length.

### Slot states

| State | Meaning | Clickable? |
|---|---|---|
| Free | Inside working hours, correct duration, not lunch/day off, not taken, not in the past, inside Zone A (R-03) | Yes → SCR-05 |
| Taken | Held by an `Upcoming` appointment (R-02, R-03) | No |

There is no reserved/proposed slot status in MVP (doctor proposal out).

- **Full day** — all slots taken: explicit "full" message.
- **Day off** — doctor is not working: explicit message.
- **No free times** — explicit empty state, not a broken grid.
- **Past times today** — not offered.

### States

| State | What the user sees |
|---|---|
| Default | Day picker + slots for the selected day |
| Loading | Themed loading indicator |
| Empty | No free times for the selected day (within the rolling bookable window (Zone A)) — explicit message in both themes and languages |
| Error | Themed error state |

### Behaviour

- Slots are derived from working hours minus duration, lunch, vacation, taken (R-03, R-05, R-08).
- One doctor, one timeline. Format does not create extra slots or a second calendar (R-03, R-04).
- Clicking a free slot → wizard step 3 (**SCR-05**), carrying doctor + start time.
- Clicking a taken slot does nothing.
- Calendar must **auto-refresh** so other patients see taken slots disappear (R-03). **React Query** refetch interval **30s** while wizard step 2 is open + refetch on focus (`tech-stack.md`).

### Entry context

- **New booking (FLO-01):** from SCR-03 profile. Patient picks any free slot.
- **Reschedule (FLO-02):** from SCR-06. Same doctor, pick a new free slot. Move is only available when ≥ 1 hour remains before the current visit start (R-07).

### Client-side checks

None — slot availability is determined by the server. The UI disables non-free slots.

### Theme / bell notes

- Bell (R-10) present in header. No notifications triggered from this screen.
- Both themes fully designed.

### Out of scope

- Payment
- Booking outside rolling bookable window (Zone A)
- Parallel online/offline calendars (one timeline in MVP)
- Video consultation
- Reserved / proposed slots; doctor proposal picker

### Open questions

None that block this section. Auto-refresh interval is implementation (`tech-stack.md`).

---

## SCR-05 Confirm booking

**Product pointer:** [SCR-05](./product-spec.md#scr-05-confirm-booking), [R-02](./product-spec.md#r-02-appointment-statuses), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-05](./product-spec.md#r-05-appointment-duration), [R-07](./product-spec.md#r-07-rescheduling), [R-10](./product-spec.md#r-10-notifications), [R-13](./product-spec.md#r-13-booking-horizon), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: `doctorId`, `startAt`, `format` (offline | online), `reason` (optional); or `appointmentId` + new `startAt` / `format` / optional `reason` for patient reschedule (FLO-02)
- Out: on success — `appointment` as `Upcoming` (new book) or `{ oldAppointment: Rescheduled, newAppointment: Upcoming }` (reschedule); UI shows **success toast/alert** then navigates to **SCR-06**
- Errors: `SLOT_TAKEN` (concurrent refusal), `SLOT_OUTSIDE_WINDOW`, `SLOT_NOT_FREE`, `APPOINTMENT_INVALID_TRANSITION`, `APPOINTMENT_TOO_LATE_TO_RESCHEDULE` (< 1 hour before current start), validation errors
- Auth: patient

### Layout / regions

1. **Global header** — language switch (EN/UK), theme toggle, bell (R-10).
2. **One-screen summary (Confirmed, brief)**:
   - Doctor (name; specialty if useful to recognize them)
   - Place (clinic + address, same as SCR-03)
   - Date + time (slot start picked on SCR-04; read-only)
   - Duration (read-only; slot length from R-05)
   - Format (type): Offline or Online (R-04)
3. **Reason for visit**:
   - Optional free text (empty allowed)
4. **Actions**:
   - Primary button: **Confirm**
   - Secondary back action to calendar (without booking)

### States

| State | What the user sees |
|---|---|
| Default | Summary + (optional) reason + Confirm enabled |
| Loading | Confirm disabled / loading indicator while request is in progress |
| Refused (concurrent / already taken) | Plain-language refusal (`SLOT_TAKEN`); stay in wizard; return to step 2 to pick another time |
| Refused (too late to reschedule) | Plain-language refusal (`APPOINTMENT_TOO_LATE_TO_RESCHEDULE`); cancel may still be available on SCR-06 |
| Success | **Toast/alert** (R-16); then navigate to **SCR-06** cabinet |
| Error (non-concurrent) | Themed error state; user can go back to SCR-04 |

### Fields, actions, labels (EN/UK)

**Format control (R-04 / SCR-04)**

- If the doctor supports **Both**: patient chooses Offline vs Online on SCR-05.
  - Default is **Offline**.
- If the doctor supports **only one** format: show it as a **read-only label** (no selectable alternative).
- Only formats the doctor supports are used/offered.
- Video/link is out of MVP.

**Reason for visit**

- Optional text input.
- Client-side: do **not** enforce any length/category rules (product spec does not define them). Empty reason is allowed.

**Actions**

- **Confirm**: submits `doctor`, `start time`, `format`, `reason` (may be empty). For reschedule: same fields plus existing `appointmentId`.
- **Back**: returns to **SCR-04 Calendar**. The slot is not held while this screen is open; it stays free until confirm succeeds.

### Client-side checks (UX only)

- Reason can be empty; no additional length/category validation rules.
- Format must match what the doctor supports:
  - if both supported → ensure a format is selected (default Offline)
  - if only one supported → no selection required (read-only label)
- Reschedule: UI may hide/disable Move earlier on SCR-06 when < 1 hour remains; server still enforces the deadline on confirm.

### Theme / bell notes

- Bell exists in the header on this screen (R-10). The exact wording of the doctor’s bell message is determined by the triggering action (book / reschedule).
- After a successful patient booking/reschedule on SCR-05, the patient is **not** notified; the doctor receives the notification.

### Behaviour / rules (reschedule)

- Same doctor only. New time must be free and inside Zone A.
- Patient **may** change Offline ↔ Online here if the doctor supports the new format.
- On success: old appointment → `Rescheduled`; **new** appointment → `Upcoming` **in one atomic action**. Old slot free; new slot taken. History/link kept (**R-07**).
- Reschedule allowed only if **≥ 1 hour** remains before the current visit start (**R-07**).
- This screen is only for new book or patient own-reschedule (**FLO-02**). Doctor proposal / pending decision is **Out of MVP**.

### Out of scope

- Payment
- Holding the slot while the form is open
- Family / on-behalf booking
- Service catalog
- Video/link for “Online”
- Picking duration (duration is read-only from SCR-04 / R-05)
- outside the rolling bookable window
- Parallel Online/Offline calendars
- Doctor proposal / `Reschedule Pending` / SCR-12

### Open questions

- Exact EN/UK sentences for:
  - the concurrent refusal / already-taken message on SCR-05
  - the too-late-to-reschedule message
  - the doctor’s bell message after a successful patient confirm

## SCR-06 My appointments (patient cabinet)

**Product pointer:** [SCR-06](./product-spec.md#scr-06-my-appointments), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-02](./product-spec.md#r-02-appointment-statuses), [R-06](./product-spec.md#r-06-cancellation), [R-07](./product-spec.md#r-07-rescheduling), [R-10](./product-spec.md#r-10-notifications), [R-11](./product-spec.md#r-11-language-and-theme), [R-14](./product-spec.md#r-14-reviews-and-ratings), [R-15](./product-spec.md#r-15-favourites), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: patient session; actions: `cancel`, `start_move`, `submit_review` (from Past row), `list_favourites`, `list_recently_viewed`
- Out: cabinet widgets + appointments grouped **Upcoming** / **Past**; favourite doctors carousel; last 10 recently viewed doctors; review eligibility per Past row; per-row `canMove` / `canCancel`
- Errors: `APPOINTMENT_FORBIDDEN`, `APPOINTMENT_INVALID_TRANSITION`, `APPOINTMENT_TOO_LATE_TO_RESCHEDULE`, `REVIEW_ALREADY_EXISTS`, `REVIEW_FORBIDDEN`, validation errors
- Auth: patient, self only

### Layout / regions

**Patient home after login (R-16).** Avatar menu «Мій кабінет». No search bar on dashboard.

**Desktop:** greeting row → **left main** + **right widgets**.

**Left main:**

1. Greeting + primary CTA → SCR-02  
2. Next appointment (actions by status)  
3. Mini-calendar for **rolling bookable window** (dots = patient’s visits)  
4. Upcoming list  
5. **Favourites** carousel (R-15)  
6. **Recently viewed** — last 10 unique doctor opens (hide if empty)  
7. Specialty cards → SCR-02  
8. **Past** rows — CTA **Залишити відгук** if no review yet → modal (★ + optional text); after submit show **Ваш відгук** on row

No pending-proposal banner. Doctor proposal / SCR-12 is **Out of MVP**.

**Right column:**

1. Reminder widget — Upcoming today/tomorrow only (not R-10 history)  
2. New doctor promo card + Book → wizard  
3. Instruction → SCR-02  

**Mobile:** right column under greeting, then left content.

**Appointment groups:**

- **Upcoming** = `Upcoming` only  
- **Past** = `Completed` + `Cancelled` + `Rescheduled`

### Fields shown

Each appointment row shows:

- Doctor
- Place
- Date
- Time
- Status
- Format (Offline / Online)
- Reason, if the patient entered one
- If `Cancelled`: who cancelled (`patient` or `doctor`)

### Actions by status

| Status | Move | Cancel | Other |
|---|---|---|---|
| `Upcoming` | Yes — same doctor only, and only if ≥ 1 hour before `startAt` (R-07) | Yes — no time limit (R-06) | — |
| `Completed` / `Cancelled` / `Rescheduled` | No | No | Past row may offer write review (R-14) |

### States

| State | What the user sees |
|---|---|
| Default | Two clearly separated groups with appointment rows |
| Empty — all appointments | Explicit empty state in both languages and both themes; mascot is ideal, not required |
| Empty — one group only | That group shows an explicit empty state; the other group still shows its appointments |
| Loading | Themed loading state |
| Error / refusal | Another patient’s appointments via URL: refusal, not their data |

### Behaviour

- This screen shows **only this patient’s** appointments.
- After a successful confirm on **SCR-05**, the new `Upcoming` appointment appears in the **Upcoming** group.
- Cancelling from here changes the appointment to `Cancelled`, moves it to **Past**, keeps the row visible, and shows who cancelled. No time-limit window on cancel.
- Move is available only for `Upcoming` when ≥ 1 hour remains before start, uses the **same doctor** only, and continues through **SCR-04** → **SCR-05** as one atomic action (old → `Rescheduled`, new → `Upcoming`).
- `Completed` appears here when the doctor marks it or after slot end; this screen does not mark completed.

### Data shown / submitted

- **Shown:** this patient’s appointments, grouped into **Upcoming** and **Past**
- **Submitted:** cancel; start move (wizard); **submit review** (`appointmentId`, `rating`, optional `text`); favourite toggles elsewhere on SCR-02/03 too

### Notifications triggered

| Action on this screen | Patient | Doctor |
|---|---|---|
| Patient cancels | — (they did it) | Yes |
| Patient starts/completes own reschedule | — (they did it; complete happens on `SCR-05`) | Yes on success |
| Viewing the list | Nobody | Nobody |

Doctor-initiated cancel:

- Patient is notified in the bell.
- This list shows the appointment as `Cancelled`, with `who cancelled = doctor`.

### Client-side checks

None beyond action availability by status:

- `Move` only for `Upcoming` when ≥ 1 hour before start (`canMove`)
- `Cancel` for `Upcoming` (`canCancel`)
- Final statuses (`Completed`, `Cancelled`, `Rescheduled`) have no actions

### Theme / bell notes

- Bell is present on this screen.
- Empty, loading, and refusal states are themed and localized.

### Out of scope

- Family / on-behalf booking
- No-show
- Payment
- Doctor’s calendar
- Separate confirmation page after booking
- Inventing a separate appointment detail screen beyond this list
- Changing doctor during move
- Doctor-proposal pending banner / SCR-12 / `Reschedule Pending`

### Open questions

- Exact list layout (tabs vs stacked sections) — product spec leaves this to frontend later.

---

## SCR-07 My profile

**Product pointer:** [SCR-07](./product-spec.md#scr-07-my-profile), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-10](./product-spec.md#r-10-notifications), [R-11](./product-spec.md#r-11-language-and-theme), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: current user; submitted edits to allowed profile fields only (edit mode)
- Out: profile in **view** or **edit** mode; saved language/theme preferences
- Errors: `AUTH_VALIDATION_FAILED`, `AUTH_EMAIL_TAKEN`, `AUTH_FORBIDDEN`
- Auth: self only (`patient` or `doctor`)

### Layout / regions

**Default = view** (photo/avatar hero, name, role badge, read-only sections). **Edit** button on same page → inputs + Save / Cancel back to view (R-16).

Language + theme in **avatar menu** when logged in; also stored on profile.

Logout: avatar menu and optionally on this page.

Exit to role home: **SCR-06** (patient) / **SCR-08** (doctor).

### Patient fields

**Shown and editable**

- First name
- Last name
- Phone
- Email
- Date of birth
- Home city
- Home clinic

Patient city/clinic:

- Chosen from seed lists
- Editing them does not create cities or clinics
- Changing home clinic affects search ranking, not booking permissions

### Doctor fields

**Shown**

- First name
- Last name
- **Date of birth** (doctor)
- Phone
- Email
- City
- Clinic
- Specialty
- Years of medical practice
- License/certificate is on file
- **About** (bio)
- **Languages**
- **Education & certificates** (list)
- **Consultation count** (read-only; from server)

**Editable**

- First name
- Last name
- Phone
- Email
- City
- Clinic
- Photo (add or replace the public doctor-card photo)
- **About** (bio)
- **Languages**
- **Education & certificates** (add / edit / remove rows)

**Not edited here**

- Date of birth (set at sign-up; show only)
- Specialty
- Years of medical practice
- License file / re-upload
- Visit duration
- Working hours
- Supported format (Offline / Online / Both)
- Profile price

### States

| State | What the user sees |
|---|---|
| Default | Role-specific profile fields + language/theme preferences |
| Loading | Themed loading/save state |
| Validation error | Errors shown in the current language |
| Refusal | Another person’s profile via URL: refusal, not their data |
| Success | Saved profile remains visible; data persists after logout/login |

### Behaviour

- One account, one role. Role is not editable here.
- Email uniqueness still applies if the user changes email.
- Language and theme preferences are stored with the profile and match the switches available on every screen.
- Doctor photo set here is the public-card photo used for patients; sign-up uses a placeholder until the doctor adds/replaces it here.
- No password change on this screen in MVP.

### Data shown / submitted

- **Shown:** role-specific fields above; language/theme state
- **Submitted:** edits to allowed fields only; not password, not role, not doctor schedule settings

### Notifications triggered

None — profile editing is not an appointment event. Bell is still present.

### Client-side checks

- Allowed fields depend on role.
- Patient and doctor city/clinic values come from seed lists.
- Email uniqueness is enforced by the product; exact client-side validation rules are not defined here.

DOB: must be in the past. Doctor photo: jpeg/png/webp, max 10 MB (`tech-stack.md`).

### Theme / bell notes

- Language and theme switches are present on this screen and the remembered preference is also stored with the profile.
- Validation, loading, and refusal states are localized and themed.

### Out of scope

- Medical records
- Family members / family profiles
- Forgot password
- Password change while logged in
- Social login
- Clinic admin
- Doctor hours / duration / format / price (`SCR-09`)
- License re-check / re-verification
- GDPR / legal copy or consent screens
- Reviews write from SCR-06 Past row (**R-14**); not on SCR-07

### Open questions

- One shared template vs two role-specific layouts under the same screen ID.
- Exact logout placement (header vs profile page).
- Date of birth validation rules.
- Doctor photo file constraints (type, size, dimensions).

---

## SCR-08 Doctor’s day (doctor cabinet)

**Product pointer:** [SCR-08](./product-spec.md#scr-08-doctors-day), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-02](./product-spec.md#r-02-appointment-statuses), [R-06](./product-spec.md#r-06-cancellation), [R-07](./product-spec.md#r-07-rescheduling), [R-08](./product-spec.md#r-08-doctor-schedule-changes), [R-10](./product-spec.md#r-10-notifications), [R-13](./product-spec.md#r-13-booking-horizon), [R-16](./product-spec.md#r-16-app-shell-and-public-entry)

### Contract

- In: doctor session; `date`; actions: `mark_completed`, `cancel_visit`
- Out: dashboard widgets + visits for selected day inside **Zone A**; metrics (visits today, free slots today, cancellations last 7 days)
- Errors: `APPOINTMENT_FORBIDDEN`, `APPOINTMENT_INVALID_TRANSITION`
- Auth: doctor, self only

### Layout / regions

**Doctor home after login (R-16).** Avatar «Мій кабінет».

**Top:** greeting + date · **three metrics** (full width): visits today · free slots today · cancellations last 7 days. No “pending proposal” metric.

**Desktop:** left main + right widgets (reminder, free windows today + SCR-09 link, quick links). No pending-patients widget.

**Left main:** day navigation (week strip or mini-calendar — **Open**) · next visit hero · time-ordered list · actions (complete / cancel) · overflow.

Visits only inside **Zone A**; after Zone A → plan on SCR-09.

**Open:** exact day-picker/day-navigation UI.

### Visit row fields

Each visit shows:

- Time
- Patient name
- Format (Offline / Online)
- Reason, if the patient entered one
- Status (`Upcoming`, `Completed`, `Cancelled`, `Rescheduled`)
- If `Cancelled`: who cancelled

### Actions by status

| Status | Mark completed | Cancel this visit |
|---|---|---|
| `Upcoming` | Yes | Yes |
| `Completed` / `Cancelled` / `Rescheduled` | No | No |

Notes:

- **Propose a new time / book patient: Out.** Do not show those actions.
- No-show is out of MVP and must not appear as an action.

### States

| State | What the user sees |
|---|---|
| Default | Visits for the selected day, in time order |
| Empty | Explicit empty state for a day with no visits, in both themes and languages |
| Loading | Themed loading state |
| Refusal | Another doctor’s day via URL: refusal, not empty/wrong data |

### Behaviour

- This screen shows **only this doctor’s** appointments.
- It lands on **today**.
- The doctor can open other days inside the rolling bookable window (Zone A); days after that belong to `SCR-09`, not this list.
- Mark completed changes `Upcoming` to `Completed`; this screen is the manual path.
- Cancel one visit changes `Upcoming` to `Cancelled`, keeps it visible, frees the slot, records `who cancelled = doctor`, and notifies the patient.
- One timeline: Offline and Online visits share the same day list.
- Doctor cannot move, propose, or book a patient.

### Data shown / submitted

- **Shown:** this doctor’s visits for the selected day, inside the rolling bookable window (Zone A)
- **Submitted:** mark completed; cancel one upcoming visit

Format stays the booked format. Doctor does not change format on an existing booked visit in MVP.

### Notifications triggered

| Action | Patient | Doctor |
|---|---|---|
| Mark completed | — | — |
| Cancel this visit | Yes | — (they did it) |

Patient book/cancel/reschedule notifications may still appear in the bell on this screen, but they do not originate here.

### Client-side checks

None beyond action availability by status:

- `Mark completed` and `Cancel this visit` are available only for `Upcoming`
- Final statuses have no actions

### Theme / bell notes

- Bell is present on this screen.
- Empty, loading, and refusal states are localized and themed.

### Out of scope

- Other doctors’ calendars
- No-show
- Propose new time / book patient
- Bulk cancel / vacation / hours / duration / price (`SCR-09`)
- Video
- Changing format of a booked visit
- Doctor score (`SCR-11`)
- Patient search

### Open questions

- Exact day-picker/day-navigation UI

---

## SCR-09 Doctor’s working hours

**Product pointer:** [SCR-09](./product-spec.md#scr-09-doctors-working-hours), [R-04](./product-spec.md#r-04-appointment-format), [R-05](./product-spec.md#r-05-appointment-duration), [R-08](./product-spec.md#r-08-doctor-schedule-changes), [R-12](./product-spec.md#r-12-seed-data), [R-13](./product-spec.md#r-13-booking-horizon)

### Contract

- In: current logged-in doctor; submitted edits to hours, lunch/breaks, duration, vacation, supported format, price, and bulk-cancel confirmation within the zone rules
- Out: this doctor’s 3-month schedule with zone split, working-hours settings, duration, format capability, price, lunch/breaks, days off/vacation
- Errors: **Open** — exact error codes not defined in product spec; expected cases: refusal when accessing another doctor’s schedule, blocked/frozen edits inside Zone A, invalid bulk-cancel scope under the product rules
- Auth: doctor, self only

### Layout / regions

1. **Global header** — language switch, theme toggle, bell (R-10), navigation.
2. **3-month schedule view** — split into two clearly visible zones:
   - **Zone A** — rolling bookable window
   - **Zone B** — after Zone A up to 3 months
3. **Schedule controls** — working days/hours, lunch/breaks, duration, days off/vacation, supported format, price.
4. **Bulk cancel flow** — explicit confirm step before applying cancellation.

**Open:** exact calendar/schedule UI chrome.
**Open:** exact bulk-cancel confirm UI.

### Zone rules

| Zone | Range | Bookings exist? | What the doctor may do |
|---|---|---|---|
| Zone A | Rolling bookable window | Yes | Cancel visits with confirm; mark vacation only after a day has no bookings |
| Zone B | After Zone A, up to 3 months | No | Edit hours, duration, vacation, supported format, and price |

In Zone A:

- Hours are frozen
- Duration is frozen
- Price is frozen
- Frozen controls must not look like they saved changes the doctor is not allowed to make

In Zone B:

- There are no bookings
- The doctor plans the future empty schedule

### Default template

Until the doctor edits Zone B, the default template is:

- Monday–Friday `09:00–18:00`
- Lunch `13:00–14:00`
- Weekend off
- Duration from sign-up: `20 / 30 / 45` (default `30`)
- Format: `Offline only`

Seed doctors may differ for demo data.

### What the doctor configures

- Which days they work
- What hours they work on those days
- Lunch / breaks
- Visit duration (`20 / 30 / 45` only)
- Days off / vacation
- Supported format: `Offline only` / `Online only` / `Both`
- One consultation price

### Price

- One consultation price only
- Default **base** price: e.g. `600 UAH` for seed/new doctors until edited
- Zone A **base price frozen**; earliest new base = **first day after Zone A**
- **Promo price** display on SCR-02/03 when active (setup UX on SCR-09 — **Open**)
- Public doctor profile (`SCR-03`) shows the price that applies to bookable slots

**Open:** exact price input UI and validation rules

### Bulk cancel inside Zone A

- Not a silent hours edit
- Doctor must confirm before cancellation
- Allowed scopes:
  - all visits in one day
  - rest of day
  - rest of week
  - custom date range inside the rolling bookable window (Zone A)
- Each affected `Upcoming` visit is cancelled
- Each affected patient gets an in-app notification
- After a day has no bookings left, the doctor may mark that day as vacation

One-visit cancel stays on `SCR-08`.

### States

| State | What the user sees |
|---|---|
| Default | 3-month schedule with clear Zone A / Zone B separation |
| Loading | Themed loading state |
| Confirm step | Explicit confirm step before bulk cancel |
| Refusal | Another doctor’s hours via URL: refusal |
| Frozen controls | Zone A controls clearly shown as blocked/frozen, without implying a saved change |

### Behaviour

- This screen shows only this doctor’s schedule.
- Slots patients see are derived from working hours minus duration, lunch/breaks, vacation/day off, and taken times.
- Duration can change only in Zone B; already-booked visits keep the duration they were booked with.
- Hours can change only in Zone B.
- Supported format can change later, but only for times that are not booked; already-booked visits keep their format.
- Format is not a second calendar.
- Vacation in Zone A is allowed only after the day has no bookings; in Zone B it can be marked freely.
- No silent auto-cancel.

### Data shown / submitted

- **Shown:** this doctor’s 3-month schedule, duration, format capability, price, lunch/breaks, days off/vacation
- **Submitted:** hours/duration/vacation/format edits within zone rules; bulk-cancel confirmation; price change for first day after Zone A onward

### Notifications triggered

| Action | Patient | Doctor |
|---|---|---|
| Bulk cancel (each affected visit) | Yes — each affected patient | — (they did it) |
| Hours / duration / vacation / format / price with no cancel | Nobody | Nobody |

### Client-side checks

- Duration choices are only `20`, `30`, `45`
- Zone A edits must respect frozen rules
- Zone B edits must stay within the 3-month schedule horizon
- Bulk-cancel scope must stay inside the rolling bookable window (Zone A)

**Open:** exact client-side validation rules for price input

### Theme / bell notes

- Bell is present on this screen.
- Loading, confirm, refusal, and frozen-control states are localized and themed.

### Out of scope

- Rooms / equipment
- Silent cancel
- Per-slot Offline/Online
- Parallel calendars
- Payments
- Video
- Doctor performance (`SCR-11`)
- Editing a booked visit’s format or duration in place

### Open questions

- Exact calendar/schedule UI chrome
- Exact bulk-cancel confirm UI
- Exact frozen-control styling/interaction in Zone A
- Exact price input UI and validation rules

---

## SCR-10 In-app notifications (bell)

**Product pointer:** [SCR-10](./product-spec.md#scr-10-in-app-notifications), [R-10](./product-spec.md#r-10-notifications), [R-11](./product-spec.md#r-11-language-and-theme)

### Contract

- In: current logged-in user; bell interactions are `open list`, `read one`, `read all`
- Out: notification list with read/unread state for this user
- Errors: **Open** — exact error cases/codes not defined in product spec
- Auth: logged-in user (`patient` or `doctor`), self only

### Surface

- `SCR-10` is the **bell + notification list** on existing screens.
- It is **not** a separate standalone notification application.
- The bell/list may be a full screen or an area on existing screens; exact chrome is not fixed here.

**Open:** exact notification chrome/layout.

### Supported channel

- **In-app** notifications only in MVP
- Email is optional and not primary
- SMS is out
- Mobile push is out

### Read / unread behavior

- Unread items sit in the list behind the bell until the user marks them read.
- Clicking the bell opens the notification list.
- Clicking **one** notification item marks that item as read.
- **Read all** marks every item as read.
- Notifications stay until read.
- After they are read, they do **not** stay as history.

### Notification events

| Event | Patient | Doctor |
|---|---|---|
| Patient books a visit | — | Yes |
| Patient cancels | — (they did it) | Yes |
| Doctor cancels (one, a day, a range) | Yes — each affected patient | — (they did it) |
| Patient reschedules | — (they did it) | Yes |

`They did it` means the actor who performed the action does not get a notification for that same action. Doctor propose / accept / pick-another pending events are **Out of MVP**.

### States

| State | What the user sees |
|---|---|
| Default | Bell present on existing screens |
| Unread | Bell has unread notifications available in the list |
| Open list | Notification list is visible |
| Empty | No unread notifications remain after all are read |

### Data shown / submitted

- **Shown:** this user’s notifications in the bell/list, with read/unread state
- **Submitted:** open list, read one, read all

### Notifications triggered

This surface does not invent its own triggers; it shows the appointment-event notifications defined in `R-10` and triggered from the related screens/flows.

### Client-side checks

None beyond read actions:

- `read one` marks one item as read
- `read all` marks all items as read

### Theme / bell notes

- Bell appears on existing screens, alongside language/theme controls.
- Notification list behavior is localized and themed.

### Out of scope

- Separate notification product/app section
- SMS
- Mobile push
- Visit reminders
- History of already-read notifications
- Doctor rate alerts (`R-09`)

### Open questions

- Exact notification chrome/layout
- Exact notification item contents/copy beyond the event meaning defined in `R-10`

---

## SCR-11 Doctor performance

**Out of MVP.** Do not fill.

---

## SCR-12 Reschedule pending

**Status:** Out of MVP.  
**Product pointer:** [SCR-12](./product-spec.md#scr-12-reschedule-pending-patient-decision), [R-07](./product-spec.md#r-07-rescheduling)

Doctor cannot propose a new time. Patient reschedule is **FLO-02** only (`SCR-06` → `SCR-04` → `SCR-05`). Do not specify or build this screen in the current delivery.

---

## FLO-01 Patient books an appointment

**Product pointer:** [FLO-01](./product-spec.md#flo-01-patient-books-an-appointment), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-05](./product-spec.md#r-05-appointment-duration), [R-10](./product-spec.md#r-10-notifications), [R-13](./product-spec.md#r-13-booking-horizon)

### Purpose

A logged-in patient books one real free time with one doctor and can then find that visit in `SCR-06`. If the slot is gone by confirm time, the UI shows a plain-language refusal instead of crashing.

### Who

Patient only. Already signed in via `SCR-01`. Booking is for themselves only.

### Start / end

- **Start:** `SCR-02` Search (guest browse; login required to book) or patient header CTA
- **End:** Success toast → **SCR-06** cabinet. Wizard SCR-03 → SCR-04 → SCR-05

No extra confirmation page exists beyond `SCR-05`.

### UI walkthrough

1. **`SCR-02` Search and results**
   - Patient searches by specialty / doctor name / clinic and may use combinable filters.
   - First load uses home city + home clinic pre-set.
   - Result cards show nearest free time inside the rolling bookable window (Zone A).
   - Patient opens a doctor card.

2. **`SCR-03` Doctor profile**
   - Patient reviews doctor details: photo, specialty, clinic, address, experience, one price, supported format.
   - Duration is not shown here.
   - Primary action: open the calendar.

3. **`SCR-04` Calendar**
   - Patient picks a day.
   - Days outside the rolling bookable window are disabled.
   - Past times are not offered.
   - Patient sees free / taken / day off / full / empty states.
   - Format is visible here, but not chosen on the slot.
   - Patient clicks a free slot.

4. **`SCR-05` Confirm booking**
   - One screen shows doctor, place, date, time, optional reason, and one Confirm action.
   - If the doctor supports `Both`, patient chooses `Offline` / `Online` here; default is `Offline`.
   - If the doctor supports only one format, that format is used.
   - The slot is not held while this screen is open.

5. **Success path**
   - Confirm succeeds.
   - Appointment becomes `Upcoming`.
   - Frontend lands on `SCR-06`.
   - Doctor gets an in-app notification.
   - Patient who booked does not get a notification for their own action.
   - Other patients’ calendars refresh by themselves.

6. **Concurrent refusal path**
   - If the slot was taken at the same moment, confirm is refused in plain language.
   - Patient returns to `SCR-04` and may pick another free slot.
   - Concurrent detail belongs to `FLO-06`.

### What must be true at confirm

At confirm time, the slot is still:

- inside working hours
- using that doctor’s duration
- not lunch / day off
- not taken
- not in the past
- inside the rolling bookable window (Zone A)

One doctor has one timeline. `Offline` and `Online` cannot double-book the same time.

### Notifications

- Doctor: yes, on successful booking
- Patient: no, because they performed the action

### Out of scope

- Payment
- Family booking
- Video
- Holding the slot on the confirm screen
- outside the rolling bookable window
- Guest booking
- Doctor booking patients

### Open questions

None that block this flow. Concurrent detail stays in `FLO-06`.

---

## FLO-02 Patient reschedules

**Product pointer:** [FLO-02](./product-spec.md#flo-02-patient-reschedules), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-07](./product-spec.md#r-07-rescheduling), [R-10](./product-spec.md#r-10-notifications)

### Purpose

A patient moves their own `Upcoming` visit to another real free time with the same doctor. In **one action** the old time becomes free and the new time becomes taken.

### Who

Patient only, on their own `Upcoming` appointment. Doctor cannot reschedule for them.

### Start / end

- **Start:** `SCR-06` — `Move` on an `Upcoming` appointment (only if ≥ 1 hour before start)
- **End:** `SCR-06` — new visit under `Upcoming`; old record in `Past` as `Rescheduled`

### UI walkthrough

1. **`SCR-06` My appointments**
   - Patient chooses `Move` on an `Upcoming` row.
   - Not available on `Completed`, `Cancelled`, or `Rescheduled`.
   - If fewer than 1 hour remain before start, Move is unavailable / refused (**R-07**). Cancel may still be available.

2. **`SCR-04` Calendar**
   - The calendar is for the same doctor only.
   - Patient cannot change doctor.
   - Patient picks a free slot inside the rolling bookable window (Zone A).
   - Original slot stays taken until confirm succeeds.

3. **`SCR-05` Confirm booking**
   - Patient confirms the new slot.
   - Reason is optional.
   - Patient may switch `Offline` ↔ `Online` only if that doctor currently supports the new format.
   - The same `Both` / default `Offline` / single-format rules as new booking apply.
   - The slot is not held while this screen is open.

4. **Success path**
   - Confirm succeeds **atomically**.
   - Old appointment becomes `Rescheduled` (final).
   - New appointment becomes `Upcoming`.
   - History/link is kept.
   - Old slot becomes free.
   - New slot becomes taken.
   - Other calendars refresh.
   - Frontend lands on `SCR-06`.
   - Doctor is notified.
   - Patient is not notified for their own action.

5. **Refusal path**
   - New slot taken concurrently → plain-language refusal; original stays `Upcoming`; pick another or back out (**FLO-06**).
   - Too close to current start (< 1 hour) → plain-language refusal (`APPOINTMENT_TOO_LATE_TO_RESCHEDULE`); original stays `Upcoming` unless already past the deadline for other reasons.

### What must be true at confirm

- New slot is still free
- Same doctor
- New slot is inside the rolling bookable window (Zone A)
- At least **1 hour** still remains before the **current** visit start
- New slot uses that doctor’s duration at that time
- Already-booked duration of the old visit is not rewritten in place

### Notifications

- Doctor: yes, on successful reschedule
- Patient: no, because they performed the action

### Out of scope

- Changing doctor
- Doctor propose / silent move / book patient
- Payment
- Video
- outside the rolling bookable window
- Reschedule within 1 hour of start

### Open questions

None that block this flow.

---

## FLO-03 Doctor proposes a new time

**Status:** Out of MVP.  
**Product pointer:** [FLO-03](./product-spec.md#flo-03-doctor-proposes-a-new-time), [R-07](./product-spec.md#r-07-rescheduling)

Doctor cannot propose a new time and cannot book patients. Patient moves via **FLO-02** only. Do not specify or build this flow in the current delivery.

---

## FLO-04 Patient or doctor cancels

**Product pointer:** [FLO-04](./product-spec.md#flo-04-patient-or-doctor-cancels), [R-06](./product-spec.md#r-06-cancellation), [R-02](./product-spec.md#r-02-appointment-statuses), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-10](./product-spec.md#r-10-notifications)

### Purpose

A visit is called off. It is not deleted. The slot is free again. Cancellation cannot be undone.

### Who

Patient or doctor. Each only on visits they are allowed to cancel. This flow is one visit. Bulk / range cancel is `FLO-05`.

### Start / end

| Actor | Start | What they may cancel here |
|---|---|---|
| Patient | `SCR-06` | `Upcoming` |
| Doctor | `SCR-08` | `Upcoming` only (one visit) |

End: same lists — row stays, status `Cancelled`, who cancelled shown.

### Steps (Confirmed)

**Patient, `Upcoming` (`SCR-06`)**

1. Cancel on that row.
2. Status → `Cancelled` (final). Slot free. Calendars refresh.
3. Doctor notified. Patient is not (they did it). Who cancelled = patient.

**Doctor, one `Upcoming` (`SCR-08`)**

1. Cancel this visit (not no-show).
2. Status → `Cancelled` (final). Slot free. Calendars refresh.
3. That patient notified. Doctor is not (they did it). Who cancelled = doctor.

### What cannot be cancelled

`Completed`, already `Cancelled`, `Rescheduled` (cancel the new `Upcoming` if needed). No time-limit window. No undo. No fees.

### Notifications (R-10)

| Who cancelled | Patient | Doctor |
|---|---|---|
| Patient | — | Yes |
| Doctor (this one visit) | Yes | — |

### Out of scope for this flow

Bulk/day/range (`FLO-05`); no-show; undo; payment; doctor score; silent cancel by shortening hours; SCR-12 pending cancel.

### Open questions (FLO-04)

None that block this section.

---

## FLO-05 Doctor changes hours and bulk-cancels

**Product pointer:** [FLO-05](./product-spec.md#flo-05-doctor-changes-hours-and-bulk-cancels), [R-08](./product-spec.md#r-08-doctor-schedule-changes), [R-05](./product-spec.md#r-05-appointment-duration), [R-13](./product-spec.md#r-13-booking-horizon), [R-10](./product-spec.md#r-10-notifications)

### Purpose

The doctor plans their calendar honestly. Inside Zone A they do not silently drop visits by editing hours. They confirm a bulk cancel first. After Zone A the calendar is empty and they can change hours, duration, vacation, and price (from first day after Zone A).

### Who

Doctor only. Own schedule only.

### Start / end

- **Start / end:** `SCR-09`
- One-visit cancel stays in `FLO-04` / `SCR-08`

### Two zones (Confirmed)

**Zone A — rolling bookable window (Zone A)** (bookings exist)

- Hours, duration, and the current price are frozen.
- Doctor may bulk-cancel (with confirm):
  - all visits in one day
  - rest of day
  - rest of week
  - custom range inside Zone A
- Each affected `Upcoming` visit is cancelled; each affected patient is notified.
- `who cancelled = doctor`
- Doctor is not notified for their own action.
- Slots become free.
- Calendars refresh.
- After a day has no bookings left, doctor may mark vacation for that day.
- Nothing is cancelled silently.

**Zone B — after Zone A, up to 3 months** (no bookings)

- Change working hours
- Change lunch
- Change duration (`20 / 30 / 45`)
- Change vacation
- Price: new value applies from first day after Zone A at the earliest
- No bulk-cancel of appointments here — there are none
- No “shorten hours here and cancel visits”

### Default until they edit Zone B

- Mon–Fri `09:00–18:00`
- Lunch `13:00–14:00`
- Weekend off
- Duration from sign-up
- Format `Offline only` until edited

### Out of scope for this flow

- silent auto-cancel
- rooms / equipment
- changing booked duration or format in place
- appointments beyond Zone A
- doctor score
- one-visit cancel (`FLO-04`)

### Open questions (FLO-05)

None that block this section.

---

## FLO-06 Concurrent booking of the same slot

**Product pointer:** [FLO-06](./product-spec.md#flo-06-concurrent-booking-of-the-same-slot), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-02](./product-spec.md#r-02-appointment-statuses), [R-04](./product-spec.md#r-04-appointment-format)

### Purpose

One time, one patient. Two people must not both get the same slot. The loser sees a product refusal, not a crash.

### Who

Two patients, two browsers, same doctor, same start time.

The same rule also applies if one path is a new booking and the other is a reschedule confirm onto that slot.

### Start / end

- **Start:** both users are on `SCR-04` / `SCR-05` looking at a slot that still looks free
- Confirm does not hold the slot
- **End:** one patient has `Upcoming` on `SCR-06`; the other stays on confirm (or returns to `SCR-04`) with a refusal and can choose another free time

### What happens (Confirmed)

1. Patient A and Patient B both see Tuesday `10:20` as free.
2. Both confirm that slot.
3. One confirm succeeds:
   - appointment becomes `Upcoming`
   - that time disappears immediately for everyone else
   - other calendars refresh by themselves
4. The other confirm is refused in plain language, in the current language:
   - not a crash
   - not a blank page
   - not a technical dump
   - meaning: this time is no longer free; pick another
5. The refused patient books `10:40` successfully.

### Also true

- One timeline: `Offline` and `Online` cannot both take the same time.
- After cancel or a successful patient reschedule, the old time is free again and the same race can happen on that slot.
- There is no reserved/proposed hold in MVP.

### Notifications

- Only the successful book (or successful reschedule onto that slot) notifies the doctor.
- The refused patient is not notified; they see the refusal on screen.

### Out of scope for this flow

- waiting lists
- overbooking on purpose
- holding the slot without a booking
- specifying the DB constraint / transaction

### Open questions (FLO-06)

None that block this section. Exact EN/UK refusal sentence → frontend later.
