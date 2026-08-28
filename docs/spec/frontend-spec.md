# Frontend specification

**Status:** Frame (chrome/layout partially outdated vs 26 Aug IA)  
**Source of truth (product behaviour):** [product-spec.md](./product-spec.md)  
**IA / chrome overlay:** [ia-chrome-decision.md](./ia-chrome-decision.md) — **wins** on its Overrides map (header/footer, guest search, cabinets SCR-06/08, wizard, calendar UI, rolling month, favourites, SCR-07 view/edit, success alert). Where this file conflicts with that decision, **follow the decision** until a layer pass rewrites the SCR sections below.  
**Pair file:** [backend-spec.md](./backend-spec.md) — **Contract** blocks must match (horizon/window wording may still say “2 weeks” here — treat as rolling bookable month per decision / R-13 overlay).

This file describes **UI**: layout, states, i18n, what the screen shows and submits. It does not decide database, transactions, or route implementation.

How to fill: one `SCR-*` at a time. Approve before the next. Use skill `write-layer-spec`.

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

**Product pointer:** [SCR-01](./product-spec.md#scr-01-sign-up--log-in), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-05](./product-spec.md#r-05-appointment-duration), [R-11](./product-spec.md#r-11-language-and-theme)

### Contract

**Sign up**

- In: `role` (patient | doctor) + role-specific fields (see below)
- Out: authenticated session; redirect to SCR-02 (patient) or SCR-08 (doctor)
- Errors: **Open** — exact error codes to be agreed with backend spec; expected cases: email already registered, field validation failures
- Auth: public (no session required)

**Log in**

- In: `email`, `password`
- Out: authenticated session + user role; redirect to SCR-02 (patient) or SCR-08 (doctor)
- Errors: **Open** — exact error codes to be agreed with backend spec; expected cases: wrong email or password, field validation failures
- Auth: public (no session required)

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
| City | dropdown | Values from seed cities | `auth.city` |
| Clinic | dropdown | Disabled until city is selected; shows only clinics in the chosen city | `auth.clinic` |
| Specialty | dropdown | 4 options: family doctor, cardiologist, dermatologist, paediatrician | `auth.specialty` |
| Years of practice | number | — | `auth.experience` |
| Visit duration | select | 20 / 30 / 45 minutes; default 30 | `auth.visitDuration` |
| Email | text | — | `auth.email` |
| Password | password | — | `auth.password` |
| Phone | text | — | `auth.phone` |
| License / certificate | file upload | Picture or PDF; required; not verified | `auth.license` |

Action: **Sign up** button (`auth.signupButton`).

### Client-side checks

| Check | Rule |
|---|---|
| All fields | Required / non-empty |
| Email | **Open** — format validation not defined in product spec |
| Date of birth | **Open** — range constraint not defined in product spec |
| License file | File must be present; accept picture or PDF (R-01) |
| Years of practice | **Open** — range/format not defined in product spec |
| Visit duration | Must be one of 20, 30, 45 (R-05, SCR-01) |

Server is the source of truth for all validation. Client checks are for UX only.

**Open:** password minimum length / complexity rules; phone number format.

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

- Password validation rules (minimum length, complexity) — not defined in product spec.
- Phone number format / mask — not defined in product spec.
- Email format validation — not defined in product spec.
- Date of birth range constraint (e.g. must be in the past) — not defined in product spec.
- Years of practice range / format — not defined in product spec.
- Error codes for sign-up and log-in — to be agreed with backend spec.

---

## SCR-02 Search and results

**Product pointer:** [SCR-02](./product-spec.md#scr-02-search-and-results), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-13](./product-spec.md#r-13-booking-horizon)

### Contract

- In: `search` (optional string — specialty, doctor name, or clinic), `filters` (all optional: `city`, `clinic`, `format` (Offline | Online), `date`)
- Out: list of doctor cards — each: doctor name, specialty, clinic, city, nearest free time
- Errors: **Open** — not defined in product spec
- Auth: patient

### Layout / regions

1. **Global header** — language switch (EN/UK), theme toggle, bell (R-10), navigation to My appointments (SCR-06) and My profile (SCR-07).
2. **Search input** — accepts specialty, doctor name, or clinic. An empty search with filters only is valid.
3. **Filters** — city, clinic, format (Offline / Online), date. All combinable; two filters together narrow the results.
4. **Results area** — doctor cards.

### States

| State | What the user sees |
|---|---|
| Default | Results list with cards |
| Loading | Themed loading indicator |
| Empty | Explicit "no matches" message in both themes and both languages (not a blank page) |
| Error | Themed error state |

### First load

- City and clinic filters are **pre-set** to the patient's home city and home clinic (R-01).
- The patient may clear or change filters to browse other cities/clinics.

### Result card fields

| Field | Notes |
|---|---|
| Doctor name | — |
| Specialty | One of four |
| Clinic | — |
| City | If useful alongside clinic |
| Nearest free time | Earliest free start within next 2 weeks, respecting active filters (R-13) |

Photo is not listed for this card in the product spec (photo is on SCR-03).
Price is not on this card (price is on SCR-03).

### Behaviour

- Home-clinic doctors appear **first** when several clinics are in results (R-01).
- Specialty search returns **only** that specialty.
- Format filter: only doctors who support that format; nearest time is a slot bookable in that format (R-04).
- Date filter: doctors who have a free slot on that date, inside 2 weeks.
- Clicking a card → **SCR-03** Doctor profile. Not payment.

### Client-side checks

None — search and filters are sent as-is. Server returns results.

### Theme / bell notes

- Bell (R-10) is present in the header. Search itself does not trigger notifications.
- Both themes fully designed.

### Out of scope

- Reviews, ratings
- Map view
- "Book for a family member"

### Open questions

- Pagination or infinite scroll for results — not defined in product spec.
- Whether clinic filter depends on city filter or they are independent — not defined in product spec.

---

## SCR-03 Doctor profile

**Product pointer:** [SCR-03](./product-spec.md#scr-03-doctor-profile), [R-04](./product-spec.md#r-04-appointment-format), [R-05](./product-spec.md#r-05-appointment-duration), [R-13](./product-spec.md#r-13-booking-horizon)

### Contract

- In: doctor ID
- Out: doctor profile (name, photo or placeholder, specialty, clinic, city, address, experience, price, supported format)
- Errors: **Open** — not defined in product spec; expected case: doctor not found / invalid ID
- Auth: patient

### Layout / regions

1. **Global header** — language switch, theme toggle, bell (R-10), navigation.
2. **Doctor profile card** — all fields below.
3. **Primary action** — button to open this doctor's calendar (SCR-04).
4. **Back** — return to SCR-02 search results.

### Fields shown

| Field | Notes |
|---|---|
| Photo | Required in MVP. Seed doctors: real-looking photo. New doctors: placeholder until they upload on SCR-07 |
| Name | — |
| Specialty | One of four (family doctor, cardiologist, dermatologist, paediatrician) |
| Clinic | — |
| City | — |
| Address | Clinic address |
| Experience | Years of practice |
| Price | One consultation price (R-13); label in EN/UK; shown, never charged. Default 600 UAH for new doctors |
| Format | Offline only / Online only / Both (R-04) — so the patient knows before the calendar |

Visit duration is **not** on this screen — only on SCR-04.

Nearest free time — optional here (already shown on the SCR-02 card).

### States

| State | What the user sees |
|---|---|
| Default | Profile with all fields |
| Loading | Themed loading indicator |
| Error | Doctor not found or invalid URL — refusal message, not another doctor's/patient's data (R-01 isolation) |

### Behaviour

- Public doctor profile for logged-in patients. Not another patient's private data.
- No payment, no reviews.
- Primary action: open this doctor's calendar (SCR-04).

### Client-side checks

None — this is a read-only screen.

### Theme / bell notes

- Bell (R-10) present in header. No notifications triggered from this screen.
- Both themes fully designed.

### Out of scope

- Payment / checkout
- Reviews / ratings
- Medical records
- Video consultation
- Service menu / catalog (R-05 — no Service entity)
- Editing the doctor profile (that is SCR-07 / SCR-09 for the doctor)

### Open questions

None — product spec defines all fields for this screen.

---

## SCR-04 Calendar

**Product pointer:** [SCR-04](./product-spec.md#scr-04-calendar), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-05](./product-spec.md#r-05-appointment-duration), [R-13](./product-spec.md#r-13-booking-horizon)

### Contract

- In: doctor ID, date
- Out: list of slots for that day (each: start time, status — free / taken / reserved), doctor's visit duration (20/30/45), supported format(s) (Offline / Online / Both)
- Errors: **Open** — not defined in product spec
- Auth: patient

### Layout / regions

1. **Global header** — language switch, theme toggle, bell (R-10), navigation.
2. **Doctor identity** — name (and specialty if useful), so the patient knows whose calendar this is.
3. **Day picker** — the patient picks a day.
   - Days **after 14 days from today** are **disabled** (R-13).
   - Days in the past are not selectable.
4. **Slots for the selected day** — free, taken, reserved, or empty.
5. **Format label** — which formats this doctor supports (Offline / Online / Both). Visible here; **chosen on SCR-05**, not by tapping a slot (R-04).
6. **Visit duration** — visible as slot length (20/30/45 min). Not on SCR-03.

### Slot states

| State | Meaning | Clickable? |
|---|---|---|
| Free | Inside working hours, correct duration, not lunch/day off, not taken/reserved, not in the past, inside 2 weeks (R-03) | Yes → SCR-05 |
| Taken | Held by an Upcoming appointment or original time of Reschedule Pending (R-02, R-03) | No |
| Reserved | Proposed time of a Reschedule Pending (R-02, R-03) | No |

- **Full day** — all slots taken/reserved: explicit "full" message.
- **Day off** — doctor is not working: explicit message.
- **No free times** — explicit empty state, not a broken grid.
- **Past times today** — not offered.

### States

| State | What the user sees |
|---|---|
| Default | Day picker + slots for the selected day |
| Loading | Themed loading indicator |
| Empty | No free times for the selected day (within the 2-week booking window) — explicit message in both themes and languages |
| Error | Themed error state |

### Behaviour

- Slots are derived from working hours minus duration, lunch, vacation, taken, reserved (R-03, R-05, R-08).
- One doctor, one timeline. Format does not create extra slots or a second calendar (R-03, R-04).
- Clicking a free slot → SCR-05 Confirm booking, carrying doctor ID + start time.
- Clicking a taken/reserved slot does nothing.
- Calendar must **auto-refresh** so other patients see taken slots disappear (R-03). **Open:** refresh mechanism (polling, live updates, etc.) — postponed to architecture.

### Entry context

- **New booking (FLO-01):** from SCR-03 profile. Patient picks any free slot.
- **Reschedule (FLO-02):** from SCR-06. Same doctor, pick a new free slot.
- **Reschedule from pending (SCR-12):** same doctor, pick a new slot.

### Client-side checks

None — slot availability is determined by the server. The UI disables non-free slots.

### Theme / bell notes

- Bell (R-10) present in header. No notifications triggered from this screen.
- Both themes fully designed.

### Out of scope

- Payment
- Booking past 2 weeks
- Parallel online/offline calendars (one timeline in MVP)
- Video consultation

### Open questions

- Visual distinction between taken and reserved slots — not defined in product spec.
- Auto-refresh mechanism (polling, WebSocket, etc.) — postponed to architecture (R-03).

---

## SCR-05 Confirm booking

**Product pointer:** [SCR-05](./product-spec.md#scr-05-confirm-booking), [R-02](./product-spec.md#r-02-appointment-statuses), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-05](./product-spec.md#r-05-appointment-duration), [R-07](./product-spec.md#r-07-rescheduling), [R-10](./product-spec.md#r-10-notifications), [R-13](./product-spec.md#r-13-booking-horizon)

### Contract

- In: `doctor`, `start time`, `format` (Offline | Online), `reason` (optional; may be empty)
- Out: (on success) the booking exists as `Upcoming` (new book or patient reschedule); frontend navigates to **SCR-06**
- Errors: **Open** — concurrent/already-taken refusal + any field validation errors (exact error codes and UI copy agreed with backend later)
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
| Refused (concurrent / already taken) | Plain-language refusal in the current language (“this time is no longer free”), meaning the user can pick another time |
| Success | Frontend navigates to **SCR-06 My appointments** only (no separate confirmation view on SCR-05) |
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

- **Confirm**: submits `doctor`, `start time`, `format`, `reason` (may be empty).
- **Back**: returns to **SCR-04 Calendar**. The slot is not held while this screen is open; it stays free until confirm succeeds.

### Client-side checks (UX only)

- Reason can be empty; no additional length/category validation rules.
- Format must match what the doctor supports:
  - if both supported → ensure a format is selected (default Offline)
  - if only one supported → no selection required (read-only label)

### Theme / bell notes

- Bell exists in the header on this screen (R-10). The exact wording of the doctor’s bell message is determined by the triggering action (book / reschedule).
- After a successful patient booking/reschedule on SCR-05, the patient is **not** notified; the doctor receives the notification.

### Out of scope

- Payment
- Holding the slot while the form is open
- Family / on-behalf booking
- Service catalog
- Video/link for “Online”
- Picking duration (duration is read-only from SCR-04 / R-05)
- Booking past 2 weeks
- Parallel Online/Offline calendars

### Open questions

- Exact EN/UK sentences for:
  - the concurrent refusal / already-taken message on SCR-05
  - the doctor’s bell message after a successful patient confirm

## SCR-06 My appointments

**Product pointer:** [SCR-06](./product-spec.md#scr-06-my-appointments), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-02](./product-spec.md#r-02-appointment-statuses), [R-06](./product-spec.md#r-06-cancellation), [R-07](./product-spec.md#r-07-rescheduling), [R-10](./product-spec.md#r-10-notifications), [R-11](./product-spec.md#r-11-language-and-theme)

### Contract

- In: current logged-in patient; patient actions from this screen are `cancel`, `start move`, `start pending decision`
- Out: this patient’s appointments grouped into **Upcoming** and **Past**
- Errors: **Open** — exact error codes not defined in product spec; expected case: refusal when trying to access another patient’s appointments
- Auth: patient, self only

### Layout / regions

1. **Global header** — language switch, theme toggle, bell (R-10), navigation back to search/profile.
2. **Appointments list** — two clearly separated groups:
   - **Upcoming** = `Upcoming` + `Reschedule Pending`
   - **Past** = `Completed` + `Cancelled` + `Rescheduled`
3. **Appointment rows** — each row shows the fields below and actions based on status.

**Open:** exact list layout (tabs vs stacked sections) is not defined in product spec.

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

### `Reschedule Pending` on this screen

- Lives in the **Upcoming** group.
- Marked `Reschedule Pending`.
- Shows the **original** time (still taken).
- Must **not** be treated as a normal `Upcoming` appointment that can be moved independently.
- Actions on that row go to **SCR-12** (accept / pick another / cancel), not FLO-02 move.

**Open:** whether the proposed time is also shown on the row, or only on **SCR-12**.

### Actions by status

| Status | Move | Cancel | Other |
|---|---|---|---|
| `Upcoming` | Yes — same doctor only | Yes | — |
| `Reschedule Pending` | No | Yes (via pending decision) | `SCR-12` decision flow |
| `Completed` / `Cancelled` / `Rescheduled` | No | No | — |

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
- Cancelling from here changes the appointment to `Cancelled`, moves it to **Past**, keeps the row visible, and shows who cancelled.
- Move is available only for `Upcoming`, uses the **same doctor** only, and continues through **SCR-04** → **SCR-05**.
- While `Reschedule Pending`, the patient cannot start a separate own-reschedule from this list.
- `Completed` appears here when the doctor marks it or after slot end; this screen does not mark completed.

### Data shown / submitted

- **Shown:** this patient’s appointments, grouped into **Upcoming** and **Past**
- **Submitted:** cancel; start move (navigation); start pending decision

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

- `Move` only for `Upcoming`
- `Reschedule Pending` routes to `SCR-12`, not independent move
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

### Open questions

- Exact list layout (tabs vs stacked sections) — product spec leaves this to frontend later.
- Whether the proposed time is also shown on the `Reschedule Pending` row, or only on `SCR-12`.

---

## SCR-07 My profile

**Product pointer:** [SCR-07](./product-spec.md#scr-07-my-profile), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-10](./product-spec.md#r-10-notifications), [R-11](./product-spec.md#r-11-language-and-theme)

### Contract

- In: current logged-in user; submitted edits to allowed profile fields only
- Out: current user profile with role-specific editable/shown fields; saved language/theme preferences
- Errors: **Open** — exact error codes not defined in product spec; expected cases: validation errors in current language, email already used by another account, refusal when accessing another person’s profile
- Auth: self only (`patient` or `doctor`)

### Layout / regions

1. **Global header** — language switch, theme toggle, bell (R-10), navigation.
2. **Profile form** — role-specific fields for patient or doctor.
3. **Preferences** — language and theme are shown/saved here as remembered profile preferences.
4. **Logout action** — must exist.

**Open:** one shared template vs two role-specific layouts under the same screen ID.
**Open:** exact logout placement (header vs this page).

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
- Phone
- Email
- City
- Clinic
- Specialty
- Years of medical practice
- License/certificate is on file

**Editable**

- First name
- Last name
- Phone
- Email
- City
- Clinic
- Photo (add or replace the public doctor-card photo)

**Not edited here**

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

**Open:** date of birth validation rules.
**Open:** doctor photo file constraints (type, size, dimensions).

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
- Reviews

### Open questions

- One shared template vs two role-specific layouts under the same screen ID.
- Exact logout placement (header vs profile page).
- Date of birth validation rules.
- Doctor photo file constraints (type, size, dimensions).

---

## SCR-08 Doctor’s day

**Product pointer:** [SCR-08](./product-spec.md#scr-08-doctors-day), [R-01](./product-spec.md#r-01-accounts-and-roles), [R-02](./product-spec.md#r-02-appointment-statuses), [R-06](./product-spec.md#r-06-cancellation), [R-07](./product-spec.md#r-07-rescheduling), [R-08](./product-spec.md#r-08-doctor-schedule-changes), [R-10](./product-spec.md#r-10-notifications), [R-13](./product-spec.md#r-13-booking-horizon)

### Contract

- In: current logged-in doctor; selected day inside the next 2 weeks; doctor actions from this screen are `mark completed`, `cancel one visit`, `propose new time`
- Out: this doctor’s visits for the selected day, in time order
- Errors: **Open** — exact error codes not defined in product spec; expected case: refusal when trying to access another doctor’s day
- Auth: doctor, self only

### Layout / regions

1. **Global header** — language switch, theme toggle, bell (R-10), navigation to hours and profile.
2. **Day navigation** — lands on **today**; doctor can open other days inside the next 2-week window.
3. **Visit list** — visits for the selected day, in time order.
4. **Visit actions** — available actions depend on the visit status.

**Open:** exact day-picker/day-navigation UI.

### Visit row fields

Each visit shows:

- Time
- Patient name
- Format (Offline / Online)
- Reason, if the patient entered one
- Status (`Upcoming`, `Reschedule Pending`, `Completed`, `Cancelled`, `Rescheduled`)
- If `Cancelled`: who cancelled

### `Reschedule Pending` on this screen

- The original appointment time appears on this list.
- The proposed time is also occupied/reserved.
- Both times must **not** look free.
- This row must not behave like a normal `Upcoming` visit.

**Open:** exact visual treatment for showing that the proposed time is also occupied.

### Actions by status

| Status | Mark completed | Cancel this visit | Propose a new time |
|---|---|---|---|
| `Upcoming` | Yes | Yes | Yes |
| `Reschedule Pending` | No | No as a single action here | No second proposal |
| `Completed` / `Cancelled` / `Rescheduled` | No | No | No |

Notes:

- `Reschedule Pending` cannot be cancelled as a single action from this screen; bulk/range cancel belongs to `SCR-09`.
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
- The doctor can open other days inside the next 2 weeks; days after that belong to `SCR-09`, not this list.
- Mark completed changes `Upcoming` to `Completed`; this screen is the manual path.
- Cancel one visit changes `Upcoming` to `Cancelled`, keeps it visible, frees the slot, and records `who cancelled = doctor`.
- Propose new time never silently moves the appointment; patient must later accept, pick another slot, or cancel on `SCR-12`.
- One timeline: Offline and Online visits share the same day list.

### Propose new time

- Same doctor only; patient does not change.
- New time must be a real free slot inside the patient’s 2-week window.
- Doctor cannot propose after those 2 weeks.
- On send: original becomes `Reschedule Pending`; proposed slot becomes reserved; patient is notified.

**Open:** exact proposal slot-picker UI. It is not `SCR-04` and not a new screen ID.

### Data shown / submitted

- **Shown:** this doctor’s visits for the selected day, inside the next 2 weeks
- **Submitted:** mark completed; cancel one upcoming visit; propose a new start time

Format stays the booked format. Doctor does not change format on an existing booked visit in MVP.

### Notifications triggered

| Action | Patient | Doctor |
|---|---|---|
| Mark completed | — | — |
| Cancel this visit | Yes | — (they did it) |
| Propose a new time | Yes | — (they did it) |

Patient book/cancel/reschedule/accept notifications may still appear in the bell on this screen, but they do not originate here.

### Client-side checks

None beyond action availability by status:

- `Mark completed`, `Cancel this visit`, and `Propose a new time` are available only for `Upcoming`
- `Reschedule Pending` has no second proposal and no single-visit cancel action here
- Final statuses have no actions

### Theme / bell notes

- Bell is present on this screen.
- Empty, loading, and refusal states are localized and themed.

### Out of scope

- Other doctors’ calendars
- No-show
- Bulk cancel / vacation / hours / duration / price (`SCR-09`)
- Video
- Changing format of a booked visit
- Doctor score (`SCR-11`)
- Patient search

### Open questions

- Exact day-picker/day-navigation UI
- Exact proposal slot-picker UI
- Exact visual treatment for showing the proposed reserved time during `Reschedule Pending`

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
   - **Zone A** — next 2 weeks
   - **Zone B** — after 2 weeks up to 3 months
3. **Schedule controls** — working days/hours, lunch/breaks, duration, days off/vacation, supported format, price.
4. **Bulk cancel flow** — explicit confirm step before applying cancellation.

**Open:** exact calendar/schedule UI chrome.
**Open:** exact bulk-cancel confirm UI.

### Zone rules

| Zone | Range | Bookings exist? | What the doctor may do |
|---|---|---|---|
| Zone A | Next 2 weeks | Yes | Cancel visits with confirm; mark vacation only after a day has no bookings |
| Zone B | After 2 weeks up to 3 months | No | Edit hours, duration, vacation, supported format, and price |

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
- Default price: `600 UAH`
- The next 2 weeks are frozen
- The earliest day a changed price may apply is **day 15** from today
- Public doctor profile (`SCR-03`) shows the price that applies to bookable slots

**Open:** exact price input UI and validation rules

### Bulk cancel inside Zone A

- Not a silent hours edit
- Doctor must confirm before cancellation
- Allowed scopes:
  - all visits in one day
  - rest of day
  - rest of week
  - custom date range inside the 2-week window
- `Reschedule Pending` visits inside that period are cancelled too, and the reserved proposed slot is released
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
- Slots patients see are derived from working hours minus duration, lunch/breaks, vacation/day off, taken, and reserved times.
- Duration can change only in Zone B; already-booked visits keep the duration they were booked with.
- Hours can change only in Zone B.
- Supported format can change later, but only for times that are not booked; already-booked visits keep their format.
- Format is not a second calendar.
- Vacation in Zone A is allowed only after the day has no bookings; in Zone B it can be marked freely.
- No silent auto-cancel.

### Data shown / submitted

- **Shown:** this doctor’s 3-month schedule, duration, format capability, price, lunch/breaks, days off/vacation
- **Submitted:** hours/duration/vacation/format edits within zone rules; bulk-cancel confirmation; price change for day 15 onward

### Notifications triggered

| Action | Patient | Doctor |
|---|---|---|
| Bulk cancel (each affected visit) | Yes — each affected patient | — (they did it) |
| Hours / duration / vacation / format / price with no cancel | Nobody | Nobody |

### Client-side checks

- Duration choices are only `20`, `30`, `45`
- Zone A edits must respect frozen rules
- Zone B edits must stay within the 3-month schedule horizon
- Bulk-cancel scope must stay inside the 2-week window

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
| Doctor proposes a new time | Yes | — |
| Patient accepts the proposal | — | Yes |
| Patient picks another slot in the proposal flow | — | Yes |

`They did it` means the actor who performed the action does not get a notification for that same action.

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

**Product pointer:** [SCR-12](./product-spec.md#scr-12-reschedule-pending-patient-decision), [R-02](./product-spec.md#r-02-appointment-statuses), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-06](./product-spec.md#r-06-cancellation), [R-07](./product-spec.md#r-07-rescheduling), [R-10](./product-spec.md#r-10-notifications), [FLO-03](./product-spec.md#flo-03-doctor-proposes-a-new-time)

### Contract

- In: current logged-in patient; one pending visit they are allowed to decide on; submitted action is `accept`, `pick another`, or `cancel`
- Out: pending-visit decision result
  - `accept` → new `Upcoming`, old `Rescheduled`, then return to `SCR-06`
  - `pick another` → continue to `SCR-04` then `SCR-05` within the same proposal flow
  - `cancel` → visit `Cancelled`, then return to `SCR-06`
- Errors: **Open** — exact error codes not defined in product spec; expected cases: refusal if the pending visit is not theirs/gone, plain-language refusal if the proposed slot is no longer reservable at accept time
- Auth: patient, self only

### Surface

- `SCR-12` is one decision surface for a pending doctor proposal.
- It may be a full screen or a panel/modal on `SCR-06` / the bell.
- It is not a new independent product area beyond this one screen ID.

**Open:** exact chrome/layout of the decision surface.

### Fields shown

The surface shows enough information for the patient to decide:

- Doctor
- Place
- Original date/time (still taken)
- Proposed date/time (reserved)
- Format of the visit

Notes:

- The doctor does not change format on an already-booked visit in MVP.
- If the patient chooses `pick another`, they may switch Offline ↔ Online only if the doctor supports it, and that choice happens on `SCR-05` as usual.

**Open:** exact arrangement of the summary fields.

### Actions

Exactly three actions:

1. **Accept** the proposed time
2. **Pick another** available slot with the same doctor
3. **Cancel** the appointment

Rules:

- No fourth action
- No independent own-reschedule while pending
- No change of doctor

### States

| State | What the user sees |
|---|---|
| Default | Pending-decision surface with original/proposed summary and three actions |
| Loading | Themed loading state |
| Refusal — ownership/missing | If the pending visit is not theirs or is gone: refusal, not someone else’s decision |
| Refusal — proposed slot no longer reservable | Plain-language refusal; patient can then pick another or cancel |

### Behaviour

- No expiry on pending in MVP.
- While pending:
  - original slot stays **taken**
  - proposed slot stays **reserved**
  - nobody else can book either
- `Accept`:
  - original → `Rescheduled`
  - new appointment → `Upcoming` at the proposed time
  - old slot becomes free
  - new slot becomes taken
  - doctor is notified; patient is not
- `Pick another`:
  - continues to `SCR-04` with the same doctor, inside 2 weeks
  - final confirm happens on `SCR-05`
  - on success, original → `Rescheduled`, new appointment → `Upcoming`
  - old slot becomes free
  - new slot becomes taken
  - previous reserved proposal is released if a different time is confirmed
  - doctor is notified on success
- `Cancel`:
  - original → `Cancelled`
  - proposed slot is released
  - old slot becomes free
  - visit stays visible
  - `who cancelled = patient`
  - doctor is notified
  - no undo

### Data shown / submitted

- **Shown:** original vs proposed summary above
- **Submitted:** `accept`, `start pick another`, `cancel`

### Notifications triggered

| Action | Patient | Doctor |
|---|---|---|
| Accept | — (they did it) | Yes |
| Pick another (on success) | — (they did it) | Yes |
| Cancel | — (they did it) | Yes |

The inbound “doctor proposed a new time” bell item is a common entry path. Opening/acting on that item marks it read per `R-10`.

### Client-side checks

None beyond action availability:

- only the three allowed actions are available
- `pick another` stays in the same-doctor proposal flow
- proposed slot may still be refused at accept time if it is no longer reservable

### Theme / bell notes

- Language, theme, and bell are present on this surface.
- Loading and refusal states are localized and themed.

### Out of scope

- Changing doctor
- Pending expiry
- Doctor silently moving the appointment
- Video/link
- Independent own-reschedule while pending
- Payment

### Open questions

- Exact chrome/layout of the decision surface
- Exact arrangement of original/proposed summary fields

---

## FLO-01 Patient books an appointment

**Product pointer:** [FLO-01](./product-spec.md#flo-01-patient-books-an-appointment), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-05](./product-spec.md#r-05-appointment-duration), [R-10](./product-spec.md#r-10-notifications), [R-13](./product-spec.md#r-13-booking-horizon)

### Purpose

A logged-in patient books one real free time with one doctor and can then find that visit in `SCR-06`. If the slot is gone by confirm time, the UI shows a plain-language refusal instead of crashing.

### Who

Patient only. Already signed in via `SCR-01`. Booking is for themselves only.

### Start / end

- **Start:** `SCR-02` Search
- **End:** `SCR-06` My appointments, with the new visit under `Upcoming`

No extra confirmation page exists beyond `SCR-05`.

### UI walkthrough

1. **`SCR-02` Search and results**
   - Patient searches by specialty / doctor name / clinic and may use combinable filters.
   - First load uses home city + home clinic pre-set.
   - Result cards show nearest free time inside the next 2 weeks.
   - Patient opens a doctor card.

2. **`SCR-03` Doctor profile**
   - Patient reviews doctor details: photo, specialty, clinic, address, experience, one price, supported format.
   - Duration is not shown here.
   - Primary action: open the calendar.

3. **`SCR-04` Calendar**
   - Patient picks a day.
   - Days after 14 days from today are disabled.
   - Past times are not offered.
   - Patient sees free / taken / reserved / day off / full / empty states.
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
- not reserved
- not in the past
- inside the 2-week booking window

One doctor has one timeline. `Offline` and `Online` cannot double-book the same time.

### Notifications

- Doctor: yes, on successful booking
- Patient: no, because they performed the action

### Out of scope

- Payment
- Family booking
- Video
- Holding the slot on the confirm screen
- Booking past 2 weeks
- Guest booking

### Open questions

None that block this flow. Concurrent detail stays in `FLO-06`.

---

## FLO-02 Patient reschedules

**Product pointer:** [FLO-02](./product-spec.md#flo-02-patient-reschedules), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-07](./product-spec.md#r-07-rescheduling), [R-10](./product-spec.md#r-10-notifications)

### Purpose

A patient moves their own `Upcoming` visit to another real free time with the same doctor. The old time becomes free and the new time becomes taken.

### Who

Patient only, on their own `Upcoming` appointment.

This is not the doctor-proposal path. While an appointment is `Reschedule Pending`, this flow cannot be started.

### Start / end

- **Start:** `SCR-06` — `Move` on an `Upcoming` appointment
- **End:** `SCR-06` — new visit under `Upcoming`; old record in `Past` as `Rescheduled`

### UI walkthrough

1. **`SCR-06` My appointments**
   - Patient chooses `Move` on an `Upcoming` row.
   - This action is not available on `Reschedule Pending`, `Completed`, `Cancelled`, or `Rescheduled`.

2. **`SCR-04` Calendar**
   - The calendar is for the same doctor only.
   - Patient cannot change doctor.
   - Patient picks a free slot inside the 2-week window.
   - Original slot stays taken until confirm succeeds.

3. **`SCR-05` Confirm booking**
   - Patient confirms the new slot.
   - Reason is optional.
   - Patient may switch `Offline` ↔ `Online` only if that doctor currently supports the new format.
   - The same `Both` / default `Offline` / single-format rules as new booking apply.
   - The slot is not held while this screen is open.

4. **Success path**
   - Confirm succeeds.
   - Old appointment becomes `Rescheduled` (final).
   - New appointment becomes `Upcoming`.
   - History/link is kept.
   - Old slot becomes free.
   - New slot becomes taken.
   - Other calendars refresh.
   - Frontend lands on `SCR-06`.
   - Doctor is notified.
   - Patient is not notified for their own action.

5. **Concurrent refusal path**
   - If the new slot was taken at the same moment, confirm is refused in plain language.
   - Original visit stays `Upcoming`.
   - Patient may pick another free time or back out.
   - Concurrent detail belongs to `FLO-06`.

### What must be true at confirm

- New slot is still free
- Same doctor
- New slot is inside the 2-week window
- New slot uses that doctor’s duration at that time
- Already-booked duration of the old visit is not rewritten in place

### Notifications

- Doctor: yes, on successful reschedule
- Patient: no, because they performed the action

### Out of scope

- Changing doctor
- Starting this flow while `Reschedule Pending`
- Silent doctor move
- Payment
- Video
- Booking past 2 weeks

### Open questions

None that block this flow. Doctor proposal stays in `FLO-03`.

---

## FLO-03 Doctor proposes a new time

**Product pointer:** [FLO-03](./product-spec.md#flo-03-doctor-proposes-a-new-time), [R-07](./product-spec.md#r-07-rescheduling), [R-02](./product-spec.md#r-02-appointment-statuses), [R-03](./product-spec.md#r-03-honest-slots-and-double-booking), [R-04](./product-spec.md#r-04-appointment-format), [R-10](./product-spec.md#r-10-notifications), [R-13](./product-spec.md#r-13-booking-horizon)

### Purpose

The doctor offers a different real free time. The visit does **not** move until the patient accepts, picks another slot, or cancels. No silent move.

### Who

Doctor proposes. Patient decides. Same doctor throughout; the patient cannot be sent to another doctor.

### Start / end

- **Start:** `SCR-08` — Propose a new time on an `Upcoming` visit.
- **End (patient):** `SCR-12` then `SCR-06`, in one of three outcomes.

### Steps (Confirmed)

1. **`SCR-08`** — Doctor chooses `Propose a new time` on `Upcoming` only.
   - Not while already `Reschedule Pending`
   - Not on completed / cancelled / rescheduled
   - Format of the booked visit does not change here

2. Doctor picks another free slot of their own, inside the patient’s 2-week window.
   - They cannot propose after those 2 weeks
   - Picker chrome is later (not `SCR-04`, not a new screen ID)

3. On send:
   - original → `Reschedule Pending`
   - original slot stays **taken**
   - proposed slot is **reserved**
   - nobody else can book either slot
   - other calendars refresh by themselves
   - no expiry in MVP

4. **`SCR-10`** — Patient gets an in-app bell item (“doctor proposed a new time”).
   - Doctor is not notified (they did it).

5. **`SCR-12`** — Patient decides:
   - **Accept** → original `Rescheduled`; new `Upcoming` at the proposed time. Old slot free; new taken. Doctor notified.
   - **Pick another** → same doctor, `SCR-04` → `SCR-05`, still this flow (not `FLO-02`). New `Upcoming`; original `Rescheduled`; previous reserved proposal released if they picked a different time. Doctor notified.
   - **Cancel** → `Cancelled`; both slots free; stays visible. Doctor notified.
   - Back without choosing: stays pending.

While pending, the patient cannot start `FLO-02` from `SCR-06`.

### Notifications

At each decision outcome:

| Step | Patient | Doctor |
|---|---|---|
| Doctor sends proposal | Yes | — |
| Patient accepts / picks another / cancels | — | Yes |

### Out of scope for this flow

Out:
- silent move
- changing doctor
- proposing outside 2 weeks
- pending expiry
- doctor changing format of the booked visit
- second proposal while one is pending
- video

### Open questions (FLO-03)

None that block this section. Slot-picker chrome → frontend later.

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
| Patient | `SCR-12` (pending decision) | `Reschedule Pending` |
| Doctor | `SCR-08` | `Upcoming` only (one visit) |

End: same lists — row stays, status `Cancelled`, who cancelled shown.

### Steps (Confirmed)

**Patient, `Upcoming` (`SCR-06`)**

1. Cancel on that row.
2. Status → `Cancelled` (final). Slot free. Calendars refresh.
3. Doctor notified. Patient is not (they did it). Who cancelled = patient.

**Patient, `Reschedule Pending` (`SCR-12`)**

1. Cancel on the pending decision (not independent Move).
2. Original → `Cancelled`. Proposed slot released; original slot free.
3. Doctor notified. Who cancelled = patient.

**Doctor, one `Upcoming` (`SCR-08`)**

1. Cancel this visit (not no-show).
2. Status → `Cancelled` (final). Slot free. Calendars refresh.
3. That patient notified. Doctor is not (they did it). Who cancelled = doctor.

Doctor does not single-cancel `Reschedule Pending` here. Pending in a range is `FLO-05`.

### What cannot be cancelled

`Completed`, already `Cancelled`, `Rescheduled` (cancel the new `Upcoming` if needed). No time-limit window. No undo. No fees.

### Notifications (R-10)

| Who cancelled | Patient | Doctor |
|---|---|---|
| Patient | — | Yes |
| Doctor (this one visit) | Yes | — |

### Out of scope for this flow

Bulk/day/range (`FLO-05`); no-show; undo; payment; doctor score; silent cancel by shortening hours.

### Open questions (FLO-04)

None that block this section.

---

## FLO-05 Doctor changes hours and bulk-cancels

**Product pointer:** [FLO-05](./product-spec.md#flo-05-doctor-changes-hours-and-bulk-cancels), [R-08](./product-spec.md#r-08-doctor-schedule-changes), [R-05](./product-spec.md#r-05-appointment-duration), [R-13](./product-spec.md#r-13-booking-horizon), [R-10](./product-spec.md#r-10-notifications)

### Purpose

The doctor plans their calendar honestly. Inside 2 weeks they do not silently drop visits by editing hours. They confirm a bulk cancel first. After 2 weeks the calendar is empty and they can change hours, duration, vacation, and price (from day 15).

### Who

Doctor only. Own schedule only.

### Start / end

- **Start / end:** `SCR-09`
- One-visit cancel stays in `FLO-04` / `SCR-08`

### Two zones (Confirmed)

**Zone A — next 2 weeks** (bookings exist)

- Hours, duration, and the current price are frozen.
- Doctor may bulk-cancel (with confirm):
  - all visits in one day
  - rest of day
  - rest of week
  - custom range inside those 2 weeks
- `Reschedule Pending` in that period is cancelled too; reserved proposed slot released.
- Each affected patient is notified.
- `who cancelled = doctor`
- Doctor is not notified for their own action.
- Slots become free.
- Calendars refresh.
- After a day has no bookings left, doctor may mark vacation for that day.
- Nothing is cancelled silently.

**Zone B — after 2 weeks, up to 3 months** (no bookings)

- Change working hours
- Change lunch
- Change duration (`20 / 30 / 45`)
- Change vacation
- Price: new value applies from day 15 at the earliest
- No bulk-cancel of appointments here — there are none
- No “shorten hours here and cancel pending visits”

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
- appointments beyond 2 weeks
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
- A reserved proposed time (`Reschedule Pending`) is not free for a third patient.
- After cancel or a successful patient reschedule, the old time is free again and the same race can happen on that slot.

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
