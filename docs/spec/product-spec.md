# Product Specification — Digital Healthcare Booking Platform

**Status:** Product spec complete (opens resolved 17 Aug 2026)  
**Audience:** Team 04 (Ihor, Maryna) and the client  
**Sources:** client brief (`docs/briefihormaryna.pdf`); client confirmations after discussion  

This is the **base product spec**. It describes *what* the product does. It does not decide stack details, database schema, slot storage, or API shape.

**Overlay (26–27 Aug 2026):** [ia-chrome-decision.md](./ia-chrome-decision.md) is **higher priority** for the topics in its **Overrides map** (Medicly/Manrope, chrome, cabinets, search layout, wizard, rolling bookable month, favourites, profile view/edit, Privacy/Terms pages, **variable/promo prices, 5★ ratings & reviews**). On those points, follow the decision file if it conflicts with text below (including older “reviews out” / “default 600 UAH as the only price story”). A full rewrite of this document is **not** required before drawing.

How to fill it: go section by section. Mark each item as one of:

| Tag | Meaning |
|---|---|
| **Confirmed** | Client brief or later client confirmation |
| **Decision** | Team product decision where the client said “up to you” |
| **Open** | Still unclear — do not invent |
| **Out** | Explicitly out of scope |

---

## 0. Document map

### 0.1 Shared rules (not a screen)

- [R-01](#r-01-accounts-and-roles)
- [R-02](#r-02-appointment-statuses)
- [R-03](#r-03-honest-slots-and-double-booking)
- [R-04](#r-04-appointment-format)
- [R-05](#r-05-appointment-duration)
- [R-06](#r-06-cancellation)
- [R-07](#r-07-rescheduling)
- [R-08](#r-08-doctor-schedule-changes)
- [R-09](#r-09-doctor-performance)
- [R-10](#r-10-notifications)
- [R-11](#r-11-language-and-theme)
- [R-12](#r-12-seed-data)
- [R-13](#r-13-booking-horizon)

### 0.2 Screens (client: nine required + later additions)

Original brief (nine screens):

| ID | Screen | Who |
|---|---|---|
| SCR-01 | Sign up / Log in | Patient, doctor |
| SCR-02 | Search and results | Patient |
| SCR-03 | Doctor profile | Patient |
| SCR-04 | Calendar | Patient |
| SCR-05 | Confirm booking | Patient |
| SCR-06 | My appointments | Patient |
| SCR-07 | My profile | Patient, doctor |
| SCR-08 | Doctor’s day | Doctor |
| SCR-09 | Doctor’s working hours | Doctor |

Added after client discussion (not in the original nine):

| ID | Screen / area | Who | Why |
|---|---|---|---|
| SCR-10 | In-app notifications (bell + list) | Both | Confirmed: bell on existing screens |
| SCR-11 | Doctor performance | Doctor | **Out of MVP** — revisit after MVP |
| SCR-12 | Reschedule pending (patient decision) | Patient | Decision: doctor proposal waits for patient |

SCR-10–12 may be full screens or areas on existing screens. Decide while filling. Do not invent extra screens beyond these without a reason.

### 0.3 Core flows

| ID | Flow | Screens involved |
|---|---|---|
| FLO-01 | Patient books an appointment | SCR-02 → SCR-03 → SCR-04 → SCR-05 → SCR-06 |
| FLO-02 | Patient reschedules | SCR-06 → SCR-04 → SCR-05 |
| FLO-03 | Doctor proposes a new time | SCR-08 → SCR-10 → SCR-12 |
| FLO-04 | Patient or doctor cancels | SCR-06 or SCR-08 |
| FLO-05 | Doctor changes hours and bulk-cancels | SCR-09 |
| FLO-06 | Concurrent booking of the same slot | SCR-04 / SCR-05 |

### 0.4 Screen section template

Use this template for every `SCR-*`. Fill UI and behavior in the **same** section.

```text
## SCR-XX Name
Purpose
Who
Entry / exit
UI
  - fields, actions, labels
  - empty / error / loading / success
Behavior / rules
Data shown / data submitted
Notifications triggered
Out of scope on this screen
Open questions
```

---

## 1. Product in one line

**Confirmed.** People book a doctor the way they book a table: pick the specialist, see real free times, take one, and know it is theirs.

Six steps the product is measured by:

1. Find a doctor  
2. Read their profile  
3. See real free times  
4. Take one, get it confirmed  
5. Move it or cancel it  
6. The doctor sees the patient coming  

---

## 2. Scope

### In scope

**Confirmed (brief):** self-service web booking for a clinic network; patient search/book/manage; doctor day view and working hours; honest calendars; bilingual EN/UK; light and dark themes; mascot on auth.

**Confirmed / Decision (after discussion):** in-app notifications; reschedule pending; bulk cancellation with confirmation; doctor and patient registration; Offline/Online as appointment type only.

### Out of scope

**Out (brief):** medical records, test results, prescriptions, referrals; payments (prices shown, never charged); family profiles / booking on behalf of someone else; reviews; insurance / state registries; clinic-administrator role; rooms, equipment, queues; native mobile app.

**Out (after discussion):** real clinic registration/management; real license verification; real video consultations; SMS; mobile push; no-show; complex service catalog; production-ready hospital system; **doctor completion-rate / performance scoring** (revisit after MVP); **GDPR / privacy / legal compliance** (out of this MVP/demo). Forgot password — not in MVP; may be added later.

---

## R-01 Accounts and roles

**Status:** Approved  
**Source:** Brief (roles, no admin, isolation, auth persistence) + client confirmation (separate account types, no dual role, no approval workflow, registration fields, seed clinics) + team answers 17 Aug 2026

### Purpose

The product has people, not a hospital org chart. A person is either a patient or a doctor. That choice is made at sign-up and does not change.

### Roles

| Role | Exists | What they are for |
|---|---|---|
| Patient | **Confirmed** | Search, book, manage own appointments |
| Doctor | **Confirmed** | Own calendar, working hours, own patients’ visits |
| Clinic administrator | **Out** | Does not exist |
| Receptionist | **Out** | Exists only in today’s paper process, not in the product |
| Family / dependent | **Out** | No booking on behalf of someone else |

**Confirmed**

- Patient and doctor are two **separate account types**.
- One account **cannot** have both roles.
- The brief’s “one account, both patient and doctor” on the auth screen means **one shared sign-up/log-in screen**, not one person holding two roles.
- There is no clinic-management or doctor-approval workflow in the MVP.
- Clinics and doctors in the network are represented as data in the product (seed/mock). There is no clinic registration flow.

### Isolation (who may see what)

**Confirmed**

- A patient sees only their own appointments.
- A doctor sees only their own patients and calendar — never a colleague’s.
- This must hold even if someone changes the URL. Hiding a button is not enough. How that is implemented is **not** specified here.

### Becoming a user

**Confirmed**

- A person registers once and logs in without a receptionist.
- Sign-up and log-in live on **SCR-01**. Field layout belongs there; the rules below belong here.
- After sign-up, the person is that role for the life of the account. There is no “switch to doctor” or “switch to patient”.
- Log out and log back in: the same person, same role, data still there.

**Patient registration — required fields (Confirmed)**

- First name
- Last name
- City
- Clinic
- Date of birth
- Email
- Password
- Phone number

City and clinic are chosen from existing seed data. Sign-up does not create a city or a clinic.

**Home city and home clinic (Confirmed / Decision)**

- Every patient is related to **one city** and **one clinic** chosen at sign-up.
- Search shows doctors from the patient’s home clinic **first**.
- The patient **may book a doctor from another clinic**. Home clinic is a ranking rule, not a booking lock.
- Search filters from the brief (city, clinic, specialty, format, date) still exist; they are specified on **SCR-02**.

**Doctor registration — required to feel more substantial than patient (Confirmed intent)**

- First name
- Last name
- City
- Clinic
- Specialty
- Email
- Password
- Phone number
- Years of medical practice
- License/certificate upload
- Visit duration (selected at sign-up; default 30 minutes — **R-05**)

**Confirmed**

- License upload is **required** to finish doctor sign-up.
- Accepted upload: a file — picture or PDF.
- The product does **not** check whether it is a real license. Any such file is enough.
- City, clinic, and specialty are chosen from existing seed data. Sign-up does not create a clinic or a specialty.

**New doctor is immediately usable (Confirmed)**

- After sign-up, the new doctor is added to the same list as seed doctors.
- They receive **default working hours** (exact template belongs on **SCR-09**).
- At sign-up they **select visit duration** from options; default is 30 minutes (**R-05**).
- They can change those hours after sign-up, with the limits in **R-05** / **R-13**.
- They are **visible in search**.

### One person, one account

**Confirmed**

- One account = one role = either patient or doctor.
- One email belongs to one account. The same email cannot be used to register again as the other role.

### After sign-up

Profile editing lives on **SCR-07**. Which identity fields are editable is **deferred** to that screen. Not decided here.

### Out of scope for accounts

**Out**

- Clinic administrator role
- Clinic registration / approval
- Real doctor licensing verification
- Family profiles
- Dual-role accounts
- Social login (not in the brief — not added)
- Forgot password / password recovery (not in MVP; may be added later)

### Open questions (R-01)

None that block this section.

Deferred: identity-field edits → **SCR-07**. Default working-hours template → **SCR-09**. Search ranking UI → **SCR-02**.


---

## R-02 Appointment statuses

**Status:** Approved  
**Source:** Brief (lifecycle, upcoming vs past UI, cancelled stay visible) + client discussion (new status names, no-show out, reschedule pending) + team answers 17 Aug 2026

### Purpose

Every appointment has one status. The calendar stays honest because status changes either hold a slot, free a slot, or replace a slot. Who may change a status is part of this rule. How the database stores it is **not**.

### Statuses

| Status | Meaning | Final? |
|---|---|---|
| `Upcoming` | Scheduled visit that has not been completed, cancelled, or replaced | No |
| `Reschedule Pending` | Doctor proposed a new time; waiting for the patient | No |
| `Completed` | The visit happened | Yes |
| `Cancelled` | The visit will not happen; slot is free | Yes |
| `Rescheduled` | This record was replaced by a new appointment | Yes |

**Decision**

- These names replace the brief’s `booked` / `moved` / `did not arrive`.
- `Past` is **not** a status. It is a UI grouping on **SCR-06** (and the doctor day list when useful).
- `No-show` / “did not arrive” is **Out**. This overrides the brief for MVP.

**Past (UI only)**

- Upcoming vs past must still be clearly separated, as the brief requires.
- Past group = `Completed` + `Cancelled` + `Rescheduled`.
- Upcoming group = `Upcoming` + `Reschedule Pending`.

### What each status does to the slot

| Status | Slot |
|---|---|
| `Upcoming` | That appointment’s time is **taken** |
| `Reschedule Pending` | **Original** time stays **taken**. **Proposed** time is **reserved** — nobody else can book it |
| `Completed` | That time is in the past; never bookable |
| `Cancelled` | That time is **free** |
| `Rescheduled` | Original time is **free**. The new `Upcoming` appointment holds the new time |

During `Reschedule Pending`, one visit holds **two** times on that doctor’s calendar (old + proposed). Other patients must not see either as free. Visual treatment is **SCR-04**; the product rule is: not bookable.

### Allowed transitions

```text
(create by booking) → Upcoming

Upcoming → Completed
Upcoming → Cancelled
Upcoming → Rescheduled          (patient reschedules now; new Upcoming is created)
Upcoming → Reschedule Pending   (doctor proposes a new time)

Reschedule Pending → Rescheduled   (patient accepts or picks another slot; new Upcoming is created)
Reschedule Pending → Cancelled     (patient cancels)

Completed        → (none)
Cancelled        → (none)
Rescheduled      → (none)
```

**Confirmed / Decision**

- `Completed`, `Cancelled`, and `Rescheduled` cannot be undone.
- Patient reschedule creates a **new** `Upcoming` appointment and marks the old one `Rescheduled`. History between them is kept. Details: **R-07**.
- Doctor cannot silently move the time. They propose; the original stays `Reschedule Pending` until the patient acts. Details: **R-07**.
- Patient and doctor can both cancel. Details: **R-06**.
- Brief required moving to free the old slot and claim the new one “in the same breath.” The two-record model above is how we meet that **as product behaviour**. Implementation is later.

### Who may set each status

| From | To | Who |
|---|---|---|
| — | `Upcoming` | Patient, by booking (FLO-01) |
| `Upcoming` | `Cancelled` | Patient or doctor |
| `Upcoming` | `Rescheduled` | Patient (own reschedule) |
| `Upcoming` | `Reschedule Pending` | Doctor (proposal) |
| `Upcoming` | `Completed` | Doctor on SCR-08, **or** the system after the visit end time |
| `Reschedule Pending` | `Rescheduled` | Patient (accept or pick another slot) |
| `Reschedule Pending` | `Cancelled` | Patient |
| any | anything else | Nobody |

Doctor bulk-cancel of affected visits is still `Upcoming` → `Cancelled`. Details: **R-08**.

### How an appointment becomes `Completed`

**Confirmed**

- **Both** paths exist.
- **Manual:** the doctor marks the visit completed on **SCR-08**.
- **Automatic:** if the visit **end time** has passed and the appointment is still `Upcoming` (not cancelled, not rescheduled), the product treats the visit as having happened and sets `Completed`. No-show is out; “time passed and nobody acted” means the patient came.

**Confirmed**

- Automatic completion uses the **end** of the slot (start + duration), not the start.
- Automatic completion applies only to `Upcoming`.
- `Reschedule Pending` does **not** auto-complete when the original time passes. The patient must still accept, pick another slot, or cancel (no pending expiry remains in force).

### Out of scope for statuses

**Out**

- No-show
- Waiting list
- `Past` as a stored status
- Re-opening a cancelled or completed appointment

### Open questions (R-02)

None.

Deferred to **R-07**: patient reschedule while a doctor proposal is already pending.

---

## R-03 Honest slots and double booking

**Status:** Approved  
**Source:** Brief (real free times, one time one patient, concurrent refusal) + R-02 slot-holding rules + team answers 17 Aug 2026

### Purpose

What the screen shows as free is genuinely free. A taken time can never be taken twice. This is a **non-negotiable** product rule. The database trick that enforces it is **not** specified here.

### What a free time is

**Confirmed**

A slot is offered to a patient only if **all** of these are true:

- It lies inside that doctor’s working hours.
- It is a block of that doctor’s visit duration (see **R-05**).
- It is not on a day off or in a blocked break (lunch, etc.).
- It is not already **taken** or **reserved** (see below).
- Its **start** is not in the past. Past times are never offered, including earlier today.
- For a **patient**, it is also inside the **2-week** booking window (**R-13**).

### What “taken” and “reserved” mean

**Confirmed / Decision (from R-02)**

| Calendar time | Bookable by someone else? |
|---|---|
| No appointment, inside working hours, in the future | Yes — free |
| `Upcoming` on that time | No — taken |
| Original time of `Reschedule Pending` | No — taken |
| Proposed time of `Reschedule Pending` | No — reserved |
| `Cancelled` or `Rescheduled` original time (and nothing else holds it) | Yes — free again |
| `Completed` / any time already ended | No — past |

**Decision — MVP**

- One doctor has **one** timeline. Offline vs Online is a property of the booking (**R-04**), not a second calendar. The same doctor cannot be booked by two patients at the same time even if one visit is online and one is offline.
- During `Reschedule Pending`, **two** times are unavailable for that doctor (old + proposed).

**Later (not MVP)**

- The client/team may later split the calendar so some slots are Offline, some Online, some both. That is **out of this MVP**. Do not design slot-level format in this spec.

### One time, one patient

**Confirmed**

- A slot can be taken (or reserved) by exactly one patient.
- Two patients, two browsers, same second, same slot → **one succeeds**, the other gets a **clear refusal in plain language**, not a crash or blank error page.
- After a successful book, that time **disappears immediately** for everyone else.
- After cancel, the time is free again for everyone else.
- After a patient reschedule, the old time is free again and the new time is taken.
- This must be true even when both requests arrive at the same instant. A UI-only check is not enough. How the server/database does it is postponed.

### Instant honesty for other patients

**Confirmed**

- When a slot is taken, **other patients’ calendars refresh by themselves**. They should not keep seeing a free button for a time that is already gone.
- How that refresh is implemented (polling, live updates, etc.) is **postponed** — architecture, not this spec.

### What the other patient sees

**Confirmed**

- Taken times are visibly not bookable on **SCR-04**.
- A full day and a day off are shown as such; an empty day says so explicitly.
- The refused patient can pick another free time (client demo: 10:20 refused, 10:40 succeeds).

Exact wording of the refusal belongs on **SCR-05**. The rule here: it is a product refusal, not a technical failure.

### Out of scope for this rule

**Out**

- Waiting lists
- Overbooking on purpose
- Holding a slot without a booking (except the **reserved** proposed time in `Reschedule Pending`)
- Rooms / equipment as extra constraints

### Open questions (R-03)

None that block this section.

Refresh mechanism → architecture later. Per-slot Offline/Online/Both → after MVP.

---

## R-04 Appointment format

**Status:** Approved  
**Source:** Brief (in-person / online filter) + client confirmation (Offline / Online, doctor capabilities, video out) + R-03 (one timeline in MVP) + team answers 17 Aug 2026

### Purpose

A visit is either in the clinic or remote as a **type**. The type must be honest: the patient can only pick a format that doctor actually offers. Video calls, links, and telehealth tools are not part of the product.

### Formats

| Format | Meaning in MVP |
|---|---|
| Offline | In-person at the doctor’s clinic / address |
| Online | Remote visit **as a label only** — no video infrastructure |

**Confirmed**

- Offline is the **default**.
- A doctor supports one of: **Offline only**, **Online only**, or **Both**.
- The patient selects format while booking (**SCR-05** / calendar flow). Only formats that doctor supports are offered.
- If the doctor supports both, the booking default is Offline unless the patient changes it.
- If the doctor supports only one format, the patient does not get a real choice — that format is used.
- Search can filter by format (**SCR-02**).
- Doctor day view shows the format of each visit (**SCR-08**).
- Patient may switch Offline ↔ Online when **rescheduling**, but only if that doctor supports the new format (**R-07**).
- **Out:** real video consultation.

### Relationship to the calendar (MVP)

**Confirmed (R-03)**

- One doctor, one timeline. Format does not create extra slots.
- Two patients cannot take the same time with different formats.
- **Later / not MVP:** some slots Offline, some Online, some both. Do not specify that here.

### Where this is configured

**Confirmed**

- The doctor sets **Offline only / Online only / Both** on **SCR-09 Doctor’s working hours**, through an **edit** action on their calendar / hours.
- A newly registered doctor starts as **Offline only** until they edit this.
- The doctor **may change** supported formats later.

**Confirmed — booked time is frozen**

- Format changes apply to **times that are not booked**.
- If there is already a booking (example: 15:00 Offline), the doctor **cannot** switch that visit to Online in this MVP.
- Already-booked appointments keep the format they were booked with until they are completed, cancelled, or rescheduled (patient may change format on reschedule if the doctor supports the new format — **R-07**).
- A flow to change format on an existing booking is **later, not MVP**.

### Out of scope for format

**Out**

- Video, meeting links, waiting rooms
- Per-slot format in this MVP
- Separate parallel calendars for Offline and Online in this MVP

- Changing the format of an already-booked appointment (MVP)

### Open questions (R-04)

None that block this section.

Exact SCR-09 “edit” UI → that screen. Per-slot Offline/Online/Both → after MVP.

---

## R-05 Appointment duration

**Status:** Approved  
**Source:** Brief (visit duration on working hours generates slots) + team product decision (per doctor, default 30 min, no Service entity) + team answers 17 Aug 2026

### Purpose

Every bookable slot has a length. Patients do not pick a duration. The doctor’s duration is what splits the working day into free times (**R-03**).

### Rules

**Decision (client said “up to us”)**

- Duration is configurable **per doctor**.
- There is **no** Service catalog / extra Service entity for this.
- Product default is **30 minutes**.
- Example lengths used in the product (options, not automatic by specialty): 20 / 30 / 45 minutes (e.g. paediatrician 20, surgeon 30, proctologist 45 as illustrations).

**Confirmed (brief)**

- Visit duration belongs with working hours (**SCR-09**). That duration is what generates the slots patients see.

**Confirmed (sign-up)**

- A new doctor **sees duration options at sign-up** and selects one.
- If they do not change it, **30 minutes** is selected.
- Specialty does **not** auto-set duration (a paediatrician is not forced to 20).

### What duration affects

**Confirmed**

- Slot length on **SCR-04**.
- Automatic `Completed` uses visit **end** = start + duration (**R-02**).
- A taken/reserved slot occupies the full duration on the one timeline (**R-03**).

### Changing duration

**Confirmed**

- The doctor **may change duration later** on **SCR-09**.
- Already-booked visits keep the length they were booked with.
- Duration may be changed only for **days that are not booked**.
- The doctor **cannot change duration inside the patient booking window** (next **2 weeks** from today). See **R-13**.
- After that 2-week window, the doctor may change duration (and, on that farther calendar: working hours, vacation, price — details **R-08** / **SCR-09**).

### Out of scope for duration

**Out**

- Per-service durations (no Service entity)
- Patient-chosen visit length
- Different duration for Offline vs Online in this MVP
- Changing duration on a day that already has a booking
- Changing duration inside the next 2 weeks

### Open questions (R-05)

None that block this section.

Exact duration option list on SCR-01 (only 20/30/45, or more) → that screen. Doctor calendar length beyond 2 weeks → **R-13**.

---

## R-13 Booking horizon

**Status:** Approved  
**Source:** Team answers 17 Aug 2026

### Purpose

Patients only book the near future. Doctors plan further ahead. The next 2 weeks stay stable for duration, hours, and the profile price. Vacation is the exception for empty days.

### Patient

**Confirmed**

- A patient can see at most **2 weeks** of active slots, counted from **today**.
- They cannot book beyond that window. **No appointments exist after those 2 weeks.**
- This sits on top of **R-03** (no past times, taken/reserved not offered).

### Doctor

**Confirmed**

- The doctor sees **3 months** of their schedule.
- **Inside the next 2 weeks** the doctor cannot change **duration**, **working hours**, or **price**.
- **Vacation** inside those 2 weeks **is allowed**, but **only on days with no bookings**.
- **After** the 2-week window (up to 3 months) there are **no bookings**. The doctor may change duration, working hours, vacation, and price on that empty calendar (**R-08**).

### Price

**Confirmed**

- There is **one price** on the doctor profile. Not a different price per week.
- Prices are shown, never charged (brief).

**Confirmed (17 Aug 2026, SCR-09)**

- There is **one** consultation price (not per week). Shown, never charged.
- The next **2 weeks** are **frozen**.
- Doctor **may** edit price; the new price applies from **day 15** at the earliest.
- New doctors have a **default** price of **600 UAH**. They change it later on **SCR-09**.

### Open questions (R-13)

None that block this section.

Profile-price: frozen 2 weeks; edit from day 15; default **600 UAH** → **SCR-09**.

---

## R-06 Cancellation

**Status:** Approved  
**Source:** Brief (cancel frees slot, stays visible marked cancelled) + client confirmation (patient and doctor, no time limit, irreversible) + team answers 17 Aug 2026

### Purpose

A booked visit can be called off. The calendar becomes free again. The appointment is not deleted. Cancellation cannot be undone.

### Who and when

**Confirmed**

- **Patient** and **doctor** can both cancel.
- There is **no time restriction** (they may cancel inside the 2-week window). Changing hours/duration is not the same as cancelling a visit (**R-13**).
- `Cancelled` is **final**. It cannot be reopened.
- The cancelled appointment **stays visible**, marked cancelled (patient **SCR-06**; doctor **SCR-08**).
- The UI **shows who cancelled** (patient or doctor).
- Cancelling **frees** that slot for others (**R-03**).
- Other patients’ calendars refresh by themselves (**R-03**).
- Patient may also cancel from `Reschedule Pending` (**R-02**).
- Each cancelled patient gets an **in-app message** that the visit was cancelled (**R-10**). For bulk cancel, **each** patient gets that message. That is the MVP requirement — not a performance score.

### Effect on the doctor (MVP)

**Confirmed**

- Patient cancel does **not** lower a doctor “rate” in this MVP.
- Doctor cancel does **not** lower a doctor “rate” in this MVP.
- Doctor completion-rate / performance scoring is **out of MVP**. Think about it after MVP. Do not build **SCR-11** / **R-09** as a scored product for this delivery.

### What cannot be cancelled

**Confirmed (R-02)**

- `Completed` — no.
- `Cancelled` — already cancelled.
- `Rescheduled` — the old record is already replaced; cancel the **new** `Upcoming` if needed.

### Out of scope for cancellation

**Out**

- Time-limited cancel window
- Fees / penalties (no payments)
- Undo cancel
- No-show instead of cancel
- Completion-rate impact of cancel (after MVP)

### Open questions (R-06)

None that block this section.

---

## R-07 Rescheduling

**Status:** Approved  
**Source:** Brief (move without calling; free old slot, claim new) + client discussion (patient move, doctor proposal, pending, history) + R-02 / R-03 / R-04 / R-13 + team answers 17 Aug 2026

### Purpose

A visit can be moved to another real free time with the **same** doctor. The calendar stays honest: old time is not left taken, new time is not double-booked. Doctor does not silently move a patient; the patient must confirm a doctor proposal.

### Patient reschedules

**Confirmed**

- Patient can move to another **available** slot with the **same** doctor.
- Patient **cannot** change doctor.
- Patient **may** switch Offline ↔ Online if that doctor currently supports the new format (**R-04**).
- New time must be a real free slot (**R-03**) inside the patient’s **2-week** window (**R-13**).
- Original appointment becomes `Rescheduled` (final for that record).
- A **new** appointment is created with status `Upcoming`.
- History / link between old and new is kept.
- The old slot becomes free; the new slot is taken. Other patients’ calendars refresh (**R-03**).
- The new visit keeps the duration it is booked with (doctor’s duration at that slot). Already-booked length rules: **R-05**.

### Doctor proposes a new time

**Confirmed**

- Doctor proposes a different **available** slot. They cannot change the doctor.
- Original appointment becomes `Reschedule Pending` until the patient:
  - **Accepts** the proposed time, or
  - **Chooses another** available slot with the same doctor, or
  - **Cancels** the appointment.
- No expiry on pending in MVP.
- While pending: **original** slot stays taken; **proposed** slot is reserved; nobody else can book either (**R-02**, **R-03**).
- Patient gets an in-app notification (**R-10**, **SCR-12**).
- If the patient **accepts**: original → `Rescheduled`, new → `Upcoming`. Old slot free, new slot taken (no longer only reserved).
- If the patient **picks another slot**: the proposal is replaced by that slot; when accepted, new appointment is `Upcoming`.
- If the patient **cancels**: original → `Cancelled`; proposed slot is released; old slot is free; patient is notified as in **R-06**.

### Slots and format

**Confirmed**

- One timeline per doctor (**R-03**).
- Doctor cannot change the format of an already-booked visit in MVP (**R-04**). Patient may change format only via **their** reschedule, and only to a format the doctor supports.
- Proposed time must itself be free/reservable (not taken, not another reservation, not past, not a day off).
- The proposed time **must** be inside the patient’s **2-week** window. The doctor **cannot** propose a time after those 2 weeks, even though they can see 3 months.

### While a doctor proposal is pending

**Confirmed**

- The patient **cannot** start a separate “reschedule on my own” flow.
- The patient can only:
  - **Accept** the proposed time,
  - **Pick another** available slot with the same doctor **from that proposal flow** (still inside 2 weeks), or
  - **Cancel**.

### Out of scope for rescheduling

**Out**

- Changing doctor
- Pending expiry / timeout
- Doctor silently moving the time without patient confirmation
- Video/link for “Online”
- Doctor proposing a time outside the patient’s 2-week window
- Patient starting an independent reschedule while `Reschedule Pending`

### Open questions (R-07)

None that block this section.

---

## R-08 Doctor schedule changes

**Status:** Approved  
**Source:** Brief (working hours generate slots) + client confirmation (explicit cancel, no silent cancel) + R-13 (2-week bookable window) + team answers 17 Aug 2026

### Purpose

The doctor’s working hours, duration, days off, and vacation are what patients book against. Patients can only hold bookings in the next **2 weeks**. After that, the doctor’s farther calendar has **no bookings**, so it can be planned freely.

### Two zones

**Confirmed**

| Zone | Bookings? | What the doctor may do |
|---|---|---|
| Next **2 weeks** (patient bookable window) | Yes — this is the only place appointments exist | Hours, duration, and price are **frozen**. Doctor may **cancel** visits (one visit, **all visits in a day at once**, rest of day, rest of week, or a **custom date range**). After a day has **no** bookings left, they may mark **vacation**. |
| After 2 weeks, up to **3 months** | **None.** Max booking horizon is 2 weeks. | Doctor may change **price**, mark **vacation**, and change **working hours** / duration. No bulk-cancel-of-appointments is needed here because there are no appointments. |

There is no “shorten hours after 2 weeks and cancel pending visits” path. `Reschedule Pending` only exists inside the 2-week window (**R-07**).

### Cancelling visits inside the 2 weeks (not a silent hours edit)

**Confirmed**

- Doctor may cancel **one** visit (**R-06**).
- Doctor may cancel **all times in one day in one action** (not only one-by-one).
- Doctor may cancel a **period**: rest of day, rest of week, or a **custom range** (e.g. 1–15 Sep) **within the 2-week window**.
- The doctor **confirms** before those visits become `Cancelled`. Nothing is cancelled silently.
- Each cancelled patient gets an in-app message; UI shows the doctor as who cancelled (**R-06**).
- Those slots become free (**R-03**).
- `Reschedule Pending` visits in that period are cancelled too; the reserved proposed slot is released (they only exist inside 2 weeks).
- After the day has no remaining bookings, the doctor **may mark vacation** for that day.

Hours/duration stay frozen for the remaining 2-week days that still have (or could have) bookings. Clearing a day via cancel is how they free it for vacation.

### After 2 weeks (plan the empty calendar)

**Confirmed**

- Doctor can change working hours, duration, vacation, and the **one profile price**.
- No existing patient bookings to protect in this zone.

### Out of scope for schedule changes

**Out**

- Silent auto-cancel
- Rooms / equipment
- Changing booked duration or format in place
- Appointments beyond 2 weeks
- Doctor performance score (**R-09** out of MVP)

### Open questions (R-08)

None that block this section.

Default hours template and exact SCR-09 edit UI → **SCR-09**. Price: frozen 2 weeks, edit from day 15 → **SCR-09**.

---

## R-09 Doctor performance

**Status:** Out of MVP  
**Source:** Earlier team idea; overridden 17 Aug 2026 — “think about doctor’s rate after MVP; out of scope for this delivery”

Do not specify or build a completion-rate product in this spec. Counts of completed / cancelled / rescheduled may still exist as appointment data. A scored “doctor rate” and **SCR-11** are **after MVP**.

---

## R-10 Notifications

**Status:** Approved  
**Source:** Brief listed email/SMS as out; in-app notifications in MVP + team answers 17 Aug 2026

### Purpose

When something important happens to a booking, the user sees it in the app. Unread items sit in a list behind a bell until the user marks them read.

### Channel

**Confirmed**

- **In-app** is the MVP channel.
- Email: optional, only if time permits, not primary.
- SMS: **Out**.
- Mobile push: **Out**.

### Who gets what

**Confirmed**

| Event | Patient | Doctor |
|---|---|---|
| Patient books a visit | — | Yes |
| Patient cancels | — (they did it) | Yes |
| Doctor cancels (one, a day, a range) | Yes — each affected patient | — (they did it) |
| Patient reschedules | — (they did it) | Yes |
| Doctor proposes a new time | Yes | — |
| Patient accepts the proposal | — | Yes |
| Patient picks another slot in the proposal flow | — | Yes |

“They did it” = no notification to the actor who just took the action.

### UI

**Confirmed**

- A **bell / inbox** on existing screens (not a separate app section as the only entry).
- Click the bell → **notification list**.
- Top right: **Read all** — marks every item read.
- Click **one list item** → that item is marked read.
- **Read / unread** exists in MVP.
- Notifications **stay until read**. After they are read (one or Read all), they do not stay as history.

SCR-10 in the map = this bell + list, not a required extra full-page product area. Exact layout → screens.

### Out of scope for notifications

**Out**

- SMS, push
- Visit reminders
- Keeping a history of already-read notifications
- Doctor rate alerts (**R-09** out)

### Open questions (R-10)

None that block this section.

Copy/wording of each message → the screens that trigger them.

---

## R-11 Language and theme

**Status:** Approved  
**Source:** Brief (EN/UK, themes, font, mascot, persist) + client confirmation (initial language from locale) + team answers 17 Aug 2026

### Purpose

The product should feel calm and local. Every screen, including errors and empty states, works in both languages and both themes. Nothing important is hardcoded in one language.

### Language

**Confirmed**

- Two languages: **English** and **Ukrainian**.
- Switchable in the app.
- All UI text lives in translation files (nothing hardcoded).
- Dates, times, prices, and weekday names follow the chosen language.
- Error and validation messages are translated too.
- **First visit:** language from the user’s **locale**.
- If the locale is **neither** English nor Ukrainian, first language is **Ukrainian**.
- Choice is **remembered** (local storage and/or server — how is later). Survives refresh and a new login.
- Language and theme switches are on **every screen** (e.g. header, next to the bell).
- Brief: language preference is also stored with **My profile** (**SCR-07**).

### Theme

**Confirmed**

- **Light** and **dark**, both designed (not a simple invert).
- Light is the default “first impression” (soft, calm) in the brief; **first visit still follows the OS** setting.
- Visible toggle; choice persists after refresh.
- No white flash on load in dark mode.
- Every screen, including errors and empty states, is themed.

### Typeface

**Confirmed**

- One deliberate custom font, not browser default / Arial.
- Self-hosted with the product (not a third-party CDN at page load).
- Must support **Latin and Cyrillic**.
- No layout shift while the font loads.
- Which font: team choice later; must be explainable as trustworthy for health. Not specified here.

### Mascot

**Confirmed**

- Required on **SCR-01** sign-up / log-in.
- Ideally also on empty “no appointments yet”.
- Must not slow the form or compete with it.
- Must work in light and dark and on a phone.
- Name and 2–3 sentence personality: documented when we design SCR-01. Not invented here.

### Out of scope for this rule

**Out**

- More languages than EN and UK
- Loading the font from a public CDN
- Theme as “invert colors only”

### Open questions (R-11)

None that block this section.

Mascot name / personality → **SCR-01**. Exact font → design, not this spec.

---

## R-12 Seed data

**Status:** Approved  
**Source:** Brief (realistic seed) + client confirmation (fictional scale) + team answers 17 Aug 2026

### Purpose

The demo runs on a real database with enough fake-but-believable data. There is no clinic admin product. A stranger can search, book, and hit the concurrent-booking demo without us typing doctors in by hand.

### What we seed

**Confirmed**

- **Fictional Ukrainian-style** names for cities, clinics, doctors, and patients (not English dummy names).
- About **5 cities**.
- About **2–5 clinics** per city.
- About **5–10 doctors** per clinic.
- **Specialties only:** family doctor, cardiologist, dermatologist, paediatrician. No extra specialties in seed.
- **Decision (you said “up to you”):** **25 seed patients**, with a mix of past and upcoming appointments, plus the live demo user who signs up. Enough for two-browser booking conflict.
- **Default working hours** (seed doctors and new doctor sign-up, until they edit beyond the 2-week rules): **Monday–Friday 09:00–18:00**, **lunch 13:00–14:00**. Weekend off unless a seed doctor is given a different pattern for demo variety (full day / day off in the client script).
- That is more than the brief’s “20+ doctors” minimum — good.
- **No clinic registration** flow.
- Doctors who **sign up later** are added to the same list as seed doctors (**R-01**).
- Seed doctors have photos on **SCR-03**. New self-registered doctors use a **placeholder** until they add a photo on **SCR-07**.
- Seed / new-doctor default consultation price: **600 UAH** until edited on **SCR-09**.

**Confirmed (brief acceptance / demo)**

- Several specialties — **only the four listed above**.
- Doctors have **real working hours** (not a decorative grid): days, hours, duration, lunch, days off.
- Mix of **Offline only / Online only / Both** (most can default Offline only per **R-04**).
- **Past and future** appointments so Upcoming vs Past lists are not empty.
- Upcoming appointments only inside the **2-week** window (**R-13**).
- Some days: free times, a full day, a day off (client demo).
- At least some patients besides the person who signs up live in the demo, so double-booking can be shown with two browsers.

**Confirmed (R-01)**

- Patient home city + home clinic exist on seed patients too.
- Search ranks the patient’s home clinic first.

### What seed is not

**Out**

- Real people, real clinics, real licenses
- Production medical data
- Clinic-admin screens to type this in

### Open questions (R-12)

None that block this section.

Exact city/clinic/doctor name list → implementation/seed file, not this spec. Duration mix among the four specialties can vary (20/30/45) even without extra specialty names.

---

## SCR-01 Sign up / Log in

**Status:** Approved  
**Source:** Brief (shared auth screen, mascot, persist session) + R-01 + R-05 + R-11 + team answers 17 Aug 2026

### Purpose

A person creates one account and comes back. The mascot lives here. After login, a patient and a doctor land in different places.

### Who

Patient or doctor. One screen. Role is chosen at **sign-up**, not mixed on one account (**R-01**).

### Entry / exit

**Entry.** Logged-out user opens the site, or hits a protected page.

**Exit after log in / sign up**

- **Patient** → **SCR-02** Search (home of the patient side).
- **Doctor** → **SCR-08** Doctor’s day.

If already logged in, this screen is skipped.

### UI

**On this screen (and every screen — R-11):** language switch (EN/UK) and theme toggle.

**Mascot.** Present. Must not block or slow the form. Name and personality: **skipped for now** (visual design later).

**Modes:** Log in | Sign up. User picks one.

**Log in fields**

- Email
- Password
- Primary action: Log in
- **No** Patient/Doctor picker on log in. Role comes from the account.

Forgot password: **Out** of MVP (**R-01**). No link, or a disabled “not in this version” is unnecessary — just omit it.

**Sign up — role first:** Patient or Doctor.

**Sign up — Patient (all required)**

- First name, last name
- City (from seed cities)
- Clinic (from clinics in the chosen city)
- Date of birth
- Email, password, phone

**Sign up — Doctor (all required)**

- First name, last name
- City (from seed)
- Clinic (from clinics in the chosen city)
- Specialty: family doctor, cardiologist, dermatologist, paediatrician only
- Years of medical practice
- Visit duration: **20 / 30 / 45 minutes** only; **default 30 minutes** (**R-05**)
- Email, password, phone
- License/certificate **file** — picture or PDF, required, **not** verified

**Empty / error / success**

- Validation errors in the **current language**.
- Wrong email/password: clear refusal, not a crash.
- Email already used: cannot register again as the other role (**R-01**).
- Both themes; no white flash.

### Behavior / rules

**Confirmed**

- Register once; session persists after logout/login (appointments still there).
- One email = one account = one role.
- City/clinic/specialty lists come from seed; sign-up does not create them.
- New doctor is immediately visible in search, with default hours **Mon–Fri 09:00–18:00, lunch 13:00–14:00**, duration as chosen, format **Offline only** until they edit **SCR-09**, default price **600 UAH**, and a **placeholder photo** (they upload a real photo later on **SCR-07**).
- New patient has home city + home clinic; search ranks that clinic first.

### Data shown / submitted

Submitted: the fields above. Shown: mascot, switches, validation copy. No medical record.

### Notifications triggered

None on this screen (no booking event yet).

### Out of scope on this screen

**Out:** forgot password; social login; license verification; dual-role; creating clinics; photo upload at sign-up (placeholder until **SCR-07**).

### Open questions (SCR-01)

None that block this section.

Mascot name / personality → later visual design. Doctor photo at sign-up = placeholder; upload on **SCR-07**.

---

## SCR-02 Search and results

**Status:** Approved  
**Source:** Brief (search specialty/doctor/clinic, filters, nearest free time, combinable filters) + R-01 (home clinic first) + R-03 + R-04 + R-13 + team answers 17 Aug 2026

### Purpose

The patient finds a doctor without calling anyone. Results are real people with a real next free time, not a decorative list.

### Who

**Patient.** Doctors do not use this screen (they land on **SCR-08**).

### Entry / exit

**Entry.** After patient login/sign-up; or from the patient header/home.

**Exit.** Open a result → **SCR-03** Doctor profile. (Calendar may also be reachable from the profile — **SCR-04**.)

Header on this screen: language, theme, bell (**R-10**, **R-11**), way to **My appointments** / **My profile** (exact chrome on later screens).

### UI

**Confirmed (brief)**

- Search by **specialty**, **doctor name**, or **clinic**.
- Filters, combinable: **city / clinic**, **format** (Offline / Online), **date**.
- **First load:** city and clinic filters are **pre-set to the patient’s home city and home clinic**. The patient may clear or change filters to browse others.
- **Browse allowed:** an empty search box with filters only is valid (no required query).
- Result **cards** show the **nearest free time**.
- Searching a specialty returns **only** that specialty, not the whole list.
- Two filters together **narrow** the list; they must not “break” into an empty list when matches exist.

**Empty / error**

- No matches: explicit empty state in both themes and both languages (not a blank page).
- Loading: themed.

### Behavior / rules

**Confirmed**

- Home-clinic doctors appear **first** when several clinics are in the results. The patient may still book a doctor from another clinic (**R-01**).
- **Nearest free time** = the **earliest start** in the next **2 weeks** that is still free, after applying the active filters (including format and date if set).
- Format filter: only doctors who **support** that format, and nearest time is a slot the patient could book in that format (**R-04**).
- Date filter: doctors who have a free slot on that date (inside 2 weeks).
- Clicking a card goes to the doctor, not straight to payment (no payments).

### Data shown / submitted

**On each card (brief + needed to choose)**

- Doctor name, specialty, clinic (and city if useful)
- Nearest free time
- Not required here: full price list (that is **SCR-03**)

Search string + filters are the query.

### Notifications triggered

None from search itself. Bell still present.

### Out of scope on this screen

**Out:** reviews, ratings, map, “book for a family member.”

### Open questions (SCR-02)

None that block this section.

---

## SCR-03 Doctor profile

**Status:** Approved  
**Source:** Brief (specialty, clinic, experience, services + prices, address) + no Service entity (R-05) + one profile price (R-13) + team answers 17 Aug 2026

### Purpose

The patient reads who the doctor is, where they work, and what it costs — then goes to real times. Prices are shown, never charged.

### Who

**Patient.**

### Entry / exit

**Entry.** From a **SCR-02** result card.

**Exit.** Continue to **SCR-04** Calendar (see times / book). Back to search.

### UI

**Confirmed (brief), mapped to our rules**

- Name
- **Photo** of the doctor — **required** on this card in MVP. **Seed** doctors have a real-looking photo. A **newly registered** doctor uses a **placeholder** until they add a photo on **SCR-07**.
- Specialty (one of the four)
- Clinic, city, **address** (clinic address)
- Experience (years of practice)
- **Price:** one price on this profile (**R-13**). Brief said “services + prices”; we do **not** have a Service catalog (**R-05**). Show a single consultation price (label in EN/UK), never a checkout.
- **Format** the doctor supports: Offline only / Online only / Both (**R-04**) — so the patient knows before the calendar.
- **Visit duration is not on this screen** — only on **SCR-04**.

**Empty / error**

- If a doctor URL is not theirs to see / does not exist: refusal, not another doctor’s data (**R-01** isolation — patients may view public doctor profiles; they must not view other patients’ appointments via this page).

### Behavior / rules

**Confirmed**

- Public **doctor** profile for logged-in patients. Not another patient’s private data.
- No payment.
- No reviews.
- Primary action: **open this doctor’s calendar (SCR-04)**.

### Data shown / submitted

Shown: fields above + nearest free time optional (already on the card). Submitted: none except navigation.

### Notifications triggered

None.

### Out of scope on this screen

**Out:** pay, reviews, medical records, video, service menu, editing the doctor (that is doctor **SCR-09** / profile).

### Open questions (SCR-03)

None that block this section.

Photo: seed = photo; new doctor = placeholder until **SCR-07**.

---

## SCR-04 Calendar

**Status:** Approved  
**Source:** Brief (week view, free vs taken, empty day, day off, full day) + R-03 + R-04 + R-05 + R-13 + team answers 17 Aug 2026

### Purpose

Show this doctor’s **real** free times for the next **2 weeks**. What looks free is free. Taken and reserved times cannot be clicked. Duration is visible here as slot length.

### Who

**Patient**, looking at one doctor.

### Entry / exit

**Entry.** Primary button on **SCR-03**. Also from reschedule flows (**SCR-06** / **SCR-12**) to pick another slot with the **same** doctor.

**Exit.** Click a **free** slot → **SCR-05** Confirm booking. Back → profile or appointments.

### UI

**Confirmed**

- **Calendar with a day picker** (not a 14-day strip, not two separate “week pages” as the only model). The patient picks a **day**. Days **after 14 days from today** are **disabled**. Days in the past are not bookable. Today: past clock times on that day are not offered.
- **Offline / Online is visible on the calendar** (which formats this doctor supports; which slots can be used for which format in MVP is still one timeline).
- The patient **picks Offline or Online on SCR-05 confirm**, not by tapping the slot. Default Offline if the doctor supports both (**R-04**).
- **Visit duration** is visible here (20/30/45 as that doctor’s slot length). Not on the profile.
- Free slots are bookable. Taken slots are visibly not. **Reserved** proposed times are not bookable (**R-02**).
- A **full** day, a **day off**, and a day with **no free times** are all explicit — empty day says so (brief + demo).
- Past times today are not offered.
- Other patients’ calendars **refresh by themselves** when a slot is taken (**R-03**). How is later.
- Language, theme, bell on this screen.

**Empty / error**

- No free times in the window: explicit empty, not a broken grid.

### Behavior / rules

**Confirmed**

- Slots from working hours minus duration, lunch, vacation, taken, reserved (**R-03**, **R-05**, **R-08**).
- One timeline; format is not a second calendar (**R-03**). Offline/Online is **shown** here; the patient **selects** it on **SCR-05**.
- If the doctor supports only one format, SCR-05 has no real choice — that format is used.
- If the doctor supports **Both**, SCR-05 is where the patient selects Offline or Online (default Offline).
- Clicking a taken slot does nothing useful (not a book).
- Clicking a free slot starts **FLO-01** confirm (**SCR-05**), carrying doctor + date/time.

### Data shown / submitted

Shown: doctor identity, day picker, slots for the selected day, duration, taken vs free vs off, supported formats (visible).  
Submitted when picking a free slot: doctor, start time. Format is chosen on **SCR-05**.

### Notifications triggered

None until confirm succeeds.

### Out of scope on this screen

**Out:** paying, booking past 2 weeks, parallel online/offline calendars, video.

### Open questions (SCR-04)

None that block this section.

---

## SCR-05 Confirm booking

**Status:** Approved  
**Source:** Brief (one-screen summary, optional reason, one confirm, findable result) + R-03 + R-04 + R-05 + R-07 + R-10 + R-13 + SCR-04 + team answers 17 Aug 2026 (land on **SCR-06** only)

### Purpose

The patient sees what they are about to take — doctor, place, date, time — adds an optional reason, and confirms once. If the time is still free, it is theirs. If someone else took it first, they are told so in plain language and can pick another time.

### Who

**Patient.** Booking is for themselves only (no family / on-behalf — **Out**).

### Entry / exit

**Entry**

- **FLO-01 (new book):** from **SCR-04**, after clicking a **free** slot. Carries that doctor and that start time. Format is **not** chosen on the calendar; it is chosen here (**SCR-04**, **R-04**).
- **FLO-02 (patient reschedules):** from **SCR-04** after picking a new free slot with the **same** doctor (**R-07**). Same confirm screen; the patient is confirming the **new** slot.

**Exit without confirming.** Back to **SCR-04**. The slot is **not** held while this screen is open (**R-03**: no holding a slot without a booking). It stays free for others until confirm **succeeds**.

**Exit after a successful confirm.** **Decision.** Go to **SCR-06 My appointments** only. There is **no** separate confirmation view on this screen. The list is the retrievable result (new book under Upcoming; after a reschedule, the new `Upcoming` visit is there and the old one is `Rescheduled` / past grouping — details **SCR-06** / **R-02**). This overrides the demo’s extra “land on a confirmation, then open My appointments” step.

**Exit after a refused confirm.** Stay able to pick another free time: back to **SCR-04** (client demo: 10:20 refused, then 10:40 succeeds). **R-03**.

### UI

**On this screen (and every screen — R-11):** language switch (EN/UK), theme toggle, bell (**R-10**).

**One screen, one summary (Confirmed, brief)**

Shown together, not split across extra steps:

- **Doctor** — who they are booking (name; specialty if useful to recognise them)
- **Place** — clinic and address (the same place as **SCR-03**)
- **Date** and **time** — the slot start picked on **SCR-04**. Length is that doctor’s visit duration (**R-05**); read-only, not chosen here
- **Format (type)** — this is the brief’s “service/type”. There is **no** Service catalog (**R-05**). Format is **Offline** or **Online** (**R-04**)

**Format control (Confirmed, R-04 / SCR-04)**

- Doctor supports **Both:** the patient **chooses** Offline or Online **here**. Default **Offline** unless they change it.
- Doctor supports **only one** format: that format is used and shown; **no real choice**.
- Only formats that doctor **currently** supports are offered. Video / meeting link is **Out**.

**Reason for visit**

- **Optional.** Free text. Empty reason is allowed. One confirm still works.
- Exact length limit / medical categories: **not** specified (do not invent).

**Actions**

- **One** primary button: Confirm.
- A way back to the calendar without booking.

**Empty / error / loading / success**

- **Loading** while confirm is in progress (themed, both languages).
- **Concurrent / already taken:** **plain-language refusal** in the **current language** — a product “this time is no longer free”, not a crash, blank page, or technical dump (**R-03**). Exact EN/UK sentence → frontend later; the meaning is fixed here.
- After refusal, the patient can take **another** free slot (demo: 10:40).
- **Success:** the visit exists as `Upcoming` (**R-02**). This screen does not show a confirmation page; the patient is taken to **SCR-06**.
- No payment UI. Price may exist on **SCR-03**; this screen is not a checkout.

### Behavior / rules

**Confirmed**

- Confirm creates an `Upcoming` appointment for **this** patient, **this** doctor, **this** start time, **this** format, optional reason (**R-02**). Duration is the doctor’s duration for that slot (**R-05**).
- The time must still be a real free slot at the moment of confirm: inside working hours, that duration, not lunch/day off, not taken, not reserved, start not in the past, inside the patient’s **2 weeks** (**R-03**, **R-13**). Stale calendar is not enough.
- **Two patients, same slot, same moment:** one confirm **succeeds**; the other is **refused** as above. A UI-only check is not enough. How the server enforces it is **postponed**.
- After success, that time is **taken** and **disappears immediately** for everyone else. Other patients’ calendars **refresh by themselves** (**R-03**). How = later.
- **No payment.**
- Patient does **not** get an in-app notification for a booking they just made (**R-10**: actor who did it is not notified).

**Patient reschedule on this screen (FLO-02, R-07)**

- Same doctor only. New time must be free and inside 2 weeks.
- Patient **may** change Offline ↔ Online here if the doctor supports the new format.
- On success: old appointment → `Rescheduled`; **new** appointment → `Upcoming`. Old slot free; new slot taken. History/link kept (**R-07**). Doctor is notified (patient reschedule — **R-10**).
- This screen is **not** the doctor-proposal decision (**SCR-12**). While `Reschedule Pending`, the patient cannot start a separate own-reschedule into this screen (**R-07**).

### Data shown / submitted

**Shown:** doctor, place (clinic + address), date, start time, duration (read-only), format, optional reason field.

**Submitted on Confirm:** doctor, start time, format, reason (may be empty). Patient is the logged-in account. No payment fields.

### Notifications triggered

**Confirmed (R-10)**

| Event | Who |
|---|---|
| Confirm **succeeds** (new book) | **Doctor** — in-app, unread until they read it |
| Confirm **succeeds** (patient reschedule) | **Doctor** |
| Confirm refused / patient backs out | Nobody |

Exact notification wording → later (R-10 left copy to the triggering screens). Meaning: this patient booked (or moved to) this time.

### Out of scope on this screen

**Out:** payment; holding the slot while the form is open; family booking; Service catalog; video/link; picking duration; booking past 2 weeks; parallel Online/Offline calendars.

### Open questions (SCR-05)

None that block this section.

Exact EN/UK strings for the concurrent refusal and the doctor’s bell message → frontend later.

---

## SCR-06 My appointments

**Status:** Approved  
**Source:** Brief (upcoming vs past, move/cancel, cancelled stay visible) + R-01 + R-02 + R-06 + R-07 + R-10 + R-11 + SCR-05 (land here after confirm)

### Purpose

The patient finds their visits without calling. Upcoming and past are clearly separated. They can move or cancel from here. Cancelled visits stay on the list, marked cancelled.

### Who

**Patient.** Only their own appointments (**R-01**). Doctors use **SCR-08**, not this screen.

### Entry / exit

**Entry**

- After a **successful** confirm on **SCR-05** (new book or patient reschedule) — this is the landing, not a separate confirmation view.
- From the patient header (search / profile chrome — **SCR-02**).
- From the bell, when a notification is about one of their visits (list still lives here; **SCR-10** is the bell, not a second appointments app).

**Exit**

- **Move** (own reschedule, `Upcoming` only) → that doctor’s **SCR-04** → **SCR-05** (**FLO-02**). Same doctor only (**R-07**).
- **Reschedule Pending** decision → **SCR-12** (accept / pick another slot / cancel). Not an independent Move (**R-07**).
- **Cancel** stays on this screen (status becomes `Cancelled`; the row does not disappear).
- Back to search (**SCR-02**) / profile (**SCR-07**).

### UI

**On this screen (and every screen — R-11):** language switch, theme toggle, bell (**R-10**).

**Two groups, clearly separated (Confirmed, brief + R-02)**

`Past` is **not** a stored status. It is grouping only.

| Group | Statuses in it |
|---|---|
| **Upcoming** | `Upcoming` + `Reschedule Pending` |
| **Past** | `Completed` + `Cancelled` + `Rescheduled` |

Do not invent tabs vs stacked sections — either is fine as long as the two groups are obvious.

**Each visit shows (Confirmed — demo + needed to recognise it)**

- Doctor, place, date, time
- Status (so cancelled / rescheduled / pending / completed are marked)
- Format (Offline / Online) — same visit the doctor sees on **SCR-08**
- Reason if the patient entered one
- If `Cancelled`: **who cancelled** (patient or doctor) (**R-06**)

**`Reschedule Pending` on this list (Confirmed from R-02 / R-07 — this was the stub’s open)**

- Lives in the **Upcoming** group, marked `Reschedule Pending` — not hidden, not in Past.
- Shows the **original** time (still taken). The doctor’s **proposed** time is decided on **SCR-12**; this list must not treat pending as a normal `Upcoming` that can be Moved independently.
- Actions on that row: the **SCR-12** decision (accept / pick another / cancel), **not** FLO-02 Move.

**Actions by status**

| Status | Move (FLO-02) | Cancel | Other |
|---|---|---|---|
| `Upcoming` | Yes — same doctor | Yes | — |
| `Reschedule Pending` | **No** | Yes (via the pending decision) | **SCR-12** |
| `Completed` / `Cancelled` / `Rescheduled` | No | No (already final) | — |

**Empty / error / loading**

- No appointments at all: explicit empty in both languages and both themes, not a blank page. Mascot here is **ideally** (**R-11**), required only on **SCR-01**.
- Upcoming empty but past exists (or the reverse): that group says it is empty; the other group still shows.
- Loading: themed.
- Another patient’s appointments via URL: refusal, not their data (**R-01**).

### Behavior / rules

**Confirmed**

- Isolation: this patient only. Hiding a row is not enough if the URL is changed.
- After confirm from **SCR-05**, the new `Upcoming` visit is in the Upcoming group (demo: doctor / place / time).
- **Cancel** (`Upcoming` or from pending): `Cancelled`, **final**, slot(s) free, row **stays** in Past, marked cancelled, who cancelled = this patient. Doctor is notified (**R-06**, **R-10**). No undo. No time-limit window.
- **Move:** only `Upcoming`, same doctor, new slot inside 2 weeks (**R-07**). Completes on **SCR-05**. Old record becomes `Rescheduled` (Past); new `Upcoming` appears here.
- While `Reschedule Pending`, the patient **cannot** start a separate own-reschedule from this list (**R-07**).
- `Completed` appears here when the doctor marks it or after slot **end** (**R-02**) — this screen does not mark completed.
- No-show is **Out**. No family booking.

### Data shown / submitted

**Shown:** this patient’s appointments, grouped as above.  
**Submitted:** cancel; start move (navigation); start pending decision. No payment.

### Notifications triggered

**Confirmed (R-10)**

| Action on this screen | Patient | Doctor |
|---|---|---|
| Patient cancels | — (they did it) | Yes |
| Patient starts/completes own reschedule | — (they did it; complete is **SCR-05**) | Yes on success |
| Viewing the list | Nobody | Nobody |

Doctor-initiated cancel: patient is notified in the **bell**; this list shows the visit as `Cancelled`, who = doctor.

### Out of scope on this screen

**Out:** family / on-behalf; no-show; payment; doctor’s calendar; a separate confirmation page after book; inventing a detail screen beyond this list; changing doctor on move.

### Open questions (SCR-06)

None that block this section.

Exact list layout (tabs vs stacked) and whether the proposed time is also printed on the pending row (vs only on **SCR-12**) → frontend later. The grouping and actions are fixed here.

---

## SCR-07 My profile

**Status:** Approved  
**Source:** Brief (name, phone, email, DOB; editable and persistent; language/theme stored here) + R-01 + R-11 + team answers 17 Aug 2026 (doctor also has My profile; city/clinic editable; password change out)

### Purpose

The signed-in person sees who they are in the product, can correct that, and finds it still there after log out. Language and theme choice are remembered here (switches also exist on every screen — **R-11**).

### Who

**Patient and doctor.** Each opens **their own** profile only (**R-01**). Another person’s profile via URL: refusal, not their data. Role cannot be switched here.

Fields depend on role. Same screen ID; whether that is one template or two is frontend, not a new screen.

Doctor **hours / duration / supported format / price** are **not** edited here — they stay on **SCR-09**. The public doctor card patients see stays **SCR-03**.

### Entry / exit

**Entry**

- **Patient:** from header (search / appointments — **SCR-02**, **SCR-06**).
- **Doctor:** from header (day view / hours — **SCR-08**, **SCR-09**). After doctor login they land on **SCR-08**, not here.

**Exit.** Back to that role’s home (**SCR-02** or **SCR-08**). Log out → **SCR-01**. Data still there on log in.

### UI

**On this screen (and every screen — R-11):** language switch, theme toggle, bell (**R-10**).

**Patient — shown and editable (Confirmed)**

- First name, last name
- Phone, email
- Date of birth
- Home **city** and home **clinic** — **editable**, still chosen from **seed** lists (sign-up does not create a city or clinic). Changing home clinic changes search ranking (**R-01**), not a booking lock.

**Doctor — shown**

- First name, last name
- Phone, email
- City, clinic (workplace; from seed)
- Specialty, years of medical practice
- License/certificate is on file (required at sign-up, not verified)

**Doctor — editable (Confirmed / Decision)**

- First name, last name, phone, email
- City and clinic — **editable** from seed lists (same rule as the patient: city/clinic after sign-up are not frozen)
- **Photo** — they **add or replace** the public-card photo here. Sign-up uses a **placeholder**; this is where a real photo is set.

**Doctor — not edited here**

- Specialty, years of practice, license file — shown, not an edit flow in this MVP (do not invent re-upload or specialty change).
- Visit duration, working hours, Offline/Online/Both, profile price → **SCR-09**.

**Both roles**

- **Password change while logged in: Out of MVP** (do later). Forgot password remains Out.
- **Role** is not editable.

**Language and theme (Confirmed)**

- Preference is stored with this profile (brief + **R-11**).
- Switches also live on every screen. Same remembered choice. Storage how = later.

**Log out**

Must exist (**R-01**). This screen may offer it; header vs this page is layout. After log out → **SCR-01**.

**Empty / error / loading**

- Validation in the **current language**, both themes.
- Email already used by another account: cannot take it (**R-01**).
- Loading / save: themed.

### Behavior / rules

**Confirmed**

- One account, one role. No “become the other role”.
- Email uniqueness still holds if email is changed.
- Patient home city/clinic edits do not create clinics; lists are seed.
- No medical records, family members, or payment details.
- GDPR / privacy / legal: **out of this MVP**. Do not add legal/consent screens for this delivery.

### Data shown / submitted

**Shown:** role-specific fields above; language/theme state.  
**Submitted:** edits to the allowed fields. Not password.

### Notifications triggered

None (profile edit is not an appointment event — **R-10**). Bell still present.

### Out of scope on this screen

**Out:** medical records; family; forgot password; **password change (later, not MVP)**; social login; clinic admin; doctor hours / duration / format / price (**SCR-09**); license re-check; GDPR/legal copy; reviews.

### Open questions (SCR-07)

None that block this section.

Specialty / years / license edits not in this MVP.

---

## SCR-08 Doctor’s day

**Status:** Approved  
**Source:** Brief (today / this week, time order, patient, service, format, reason) + R-01 + R-02 + R-06 + R-07 + R-08 + R-10 + R-13 + FLO-03 map + team answers 17 Aug 2026

### Purpose

The doctor opens the day and sees who is coming — the same visits patients booked, in time order. They can complete, cancel one visit, or propose a new time. They never see a colleague’s calendar.

### Who

**Doctor.** Only their own patients and times (**R-01**). Tampering with the URL to another doctor: **denied** (demo), not an empty or wrong list.

### Entry / exit

**Entry.** After doctor log in / sign-up (**SCR-01**). From doctor header. From the bell when a notification is about a visit (the day list still lives here).

**Exit**

- **SCR-09** Working hours (schedule, duration, format, price, bulk cancel).
- **SCR-07** My profile.
- Propose a new time: stays in this flow until the proposal is sent; patient is notified (**SCR-10**) and decides on **SCR-12** (**FLO-03**).
- Log out → **SCR-01**.

### UI

**On this screen (and every screen — R-11):** language switch, theme toggle, bell (**R-10**). Way to hours and profile.

**Day, in time order (Confirmed, brief)**

- Lands on **today**.
- Visits for the shown day are listed **in time order**.
- Brief said “today and this week”. Appointments only exist inside the next **2 weeks** (**R-13**). **Decision:** the doctor can open other days **inside that 2-week window** so next week’s patients are not invisible. Days **after** 2 weeks have **no bookings** — that empty calendar is **SCR-09**, not this list.
- A **full** day, a **day off**, and a day with **no visits** are explicit (not a blank crash).

**Each visit shows (Confirmed, brief — “service” = format, no Service catalog)**

- Time
- Patient (name)
- Format (Offline / Online)
- Reason if the patient entered one
- Status (`Upcoming`, `Reschedule Pending`, `Completed`, `Cancelled`, `Rescheduled`)
- If `Cancelled`: **who cancelled** (**R-06**)
- If `Reschedule Pending`: original time is this visit; the **proposed** time is held too (**R-02**) — both must not look free. Exact chrome later; the product fact is both times are occupied.

**Actions (Confirmed from rules — this closes the stub’s “mark completed / other actions?”)**

| Status | Mark completed | Cancel this visit | Propose a new time |
|---|---|---|---|
| `Upcoming` | Yes (**R-02**) | Yes (**R-06**, **R-08** one visit) | Yes (**R-07**, **FLO-03**) — not a silent move |
| `Reschedule Pending` | No (does not auto-complete; patient must still act — **R-02**) | Not as a single action here (**R-02**: pending → cancelled is **patient**). Bulk/range cancel of pending is **SCR-09** (**R-08**). | No second proposal while one is pending |
| `Completed` / `Cancelled` / `Rescheduled` | No (final) | No | No |

**No-show / “did not arrive”: Out.** Do not show that action.

**Propose a new time (Confirmed, R-07)**

- Same doctor (themselves). Patient does not change.
- New time must be a real **free** slot inside the patient’s **2-week** window. Doctor **cannot** propose after those 2 weeks.
- On send: original → `Reschedule Pending`; proposed slot **reserved**; patient notified (**R-10**). Doctor is not notified (they did it).
- How the free-slot picker looks is later — not a new screen ID, not **SCR-04** (that is the patient calendar).

**Empty / error / loading**

- No visits that day: explicit empty, both languages, both themes.
- Loading: themed.
- Other doctor’s day via URL: refusal.

### Behavior / rules

**Confirmed**

- Isolation: own calendar only.
- Mark completed: `Upcoming` → `Completed`, final. Auto-complete after slot **end** also exists (**R-02**); this screen is the manual path. Pending does not auto-complete.
- Cancel one `Upcoming` visit: `Cancelled`, final, slot free, patient notified, who cancelled = doctor. Doctor is not notified. Confirm-before-cancel for **bulk** is **SCR-09**; this is one visit (**R-08**).
- Propose: never silently changes the time; patient accepts, picks another, or cancels (**SCR-12**).
- Cancelled visits **stay visible**, marked (**R-06**).
- One timeline: Offline and Online visits share the same day list (**R-03**).
- **Out:** doctor performance score (**R-09**). Counts of visits may exist as data; no scored rate here.

### Data shown / submitted

**Shown:** this doctor’s visits for the selected day (inside 2 weeks).  
**Submitted:** mark completed; cancel one upcoming visit; propose a new start time (and format stays the booked format — doctor cannot change format on an existing visit in MVP — **R-04**).

### Notifications triggered

**Confirmed (R-10)**

| Action | Patient | Doctor |
|---|---|---|
| Mark completed | — | — |
| Cancel this visit | Yes | — (they did it) |
| Propose a new time | Yes | — (they did it) |

Patient book / cancel / reschedule / accept still appear in the **bell** on this screen; they do not originate here.

### Out of scope on this screen

**Out:** other doctors’ calendars; no-show; bulk cancel / vacation / hours / duration / price (**SCR-09**); video; changing format of a booked visit; doctor score (**SCR-11**); patient search.

### Open questions (SCR-08)

None that block this section.

Exact day-picker chrome and proposal slot-picker chrome → frontend later.

---

## SCR-09 Doctor’s working hours

**Status:** Approved  
**Source:** Brief (days, hours, duration, lunch, days off generate slots) + R-04 + R-05 + R-08 + R-12 + R-13 + FLO-05 + team answers 17 Aug 2026 (price: frozen 2 weeks, edit from day 15; default price, change later)

### Purpose

This is what patients book against. The doctor sets days, hours, lunch, duration, days off / vacation, supported format, and the one profile price. Inside the next **2 weeks** the calendar stays stable except cancel + vacation on emptied days. After that, up to **3 months**, the calendar is empty and can be planned.

### Who

**Doctor.** Only their own schedule (**R-01**). Another doctor’s hours via URL: refusal.

### Entry / exit

**Entry.** From doctor header / **SCR-08**. Not the landing after login (that is **SCR-08**).

**Exit.** Back to **SCR-08**. **SCR-07** My profile. Log out → **SCR-01**. Bulk cancel stays on this screen until they confirm or back out.

### UI

**On this screen (and every screen — R-11):** language switch, theme toggle, bell (**R-10**).

**Horizon (Confirmed, R-13)**

- Doctor sees **3 months** of schedule.
- **Zone A — next 2 weeks:** bookings can exist. Hours, duration, and price are **frozen**. Doctor may **cancel** visits (with confirm) and mark **vacation** only on days that then have **no** bookings.
- **Zone B — after 2 weeks, up to 3 months:** **no** bookings. Doctor may change hours, duration, vacation, and price. **Earliest price-edit day is day 15** (see Price below).

Exact calendar chrome (month grid vs list) is later. The two zones must be obvious.

**Default template (Confirmed, R-12 / SCR-01) — until they edit Zone B**

- Monday–Friday **09:00–18:00**
- Lunch **13:00–14:00** (blocked, not bookable)
- Weekend off
- Duration: what they chose at sign-up (**20 / 30 / 45**; default 30) (**R-05**, **SCR-01**)
- Format: **Offline only** until they edit (**R-04**)

Seed doctors may differ for demo (full day / day off in the client script) (**R-12**).

**What they configure (Confirmed, brief + rules)**

- Which **days** they work and **hours** on those days
- **Lunch** / breaks (blocked)
- **Visit duration** — **20 / 30 / 45** only (same list as sign-up)
- **Days off / vacation**
- **Supported format:** Offline only / Online only / Both (**R-04**) — an **edit** on this hours/calendar screen
- **Price** — see below. Shown on **SCR-03**, never charged. Edited here (doctor schedule/price), not at sign-up. **SCR-07** stays identity; hours/duration/format/price stay this screen.

**Price (Confirmed / Decision, 17 Aug 2026)**

- **One** consultation price (not a different price per week).
- The next **2 weeks** are **frozen**. The doctor **cannot** change the price that applies inside that window.
- They **may** edit price; the **earliest** day the new price applies is **day 15** from today (first day after the 2-week window).
- **Default:** a new doctor (and seed until edited) starts at **600 UAH**. They can change it later under the rule above.
- Public card (**SCR-03**) shows the price that applies to **bookable** slots (the frozen current 2-week price). No checkout.

Do not invent rooms, equipment, per-slot format, or a Service catalog.

**Bulk cancel inside 2 weeks (Confirmed, R-08, FLO-05)**

Not a silent hours edit. Doctor **confirms** first. Nothing is cancelled silently.

- All visits in **one day** in one action
- **Rest of day**, **rest of week**, or a **custom date range** (e.g. 1–15 Sep) **within the 2-week window**
- `Reschedule Pending` in that period is cancelled too; reserved proposed slot released
- Each affected patient gets an in-app message; who cancelled = doctor (**R-06**, **R-10**)
- After a day has **no** bookings left, doctor **may mark vacation** for that day

One-visit cancel stays on **SCR-08**.

**Empty / error / loading**

- Confirm step before bulk cancel (themed, both languages).
- Frozen controls in Zone A must not look like they saved an hours change they are not allowed to make.
- Loading: themed.

### Behavior / rules

**Confirmed**

- Slots patients see = working hours minus duration, lunch, vacation/day off, taken, reserved (**R-03**, **R-05**).
- **Duration** change: only Zone B; not on days that already have bookings; already-booked visits keep the length they were booked with (**R-05**).
- **Hours** change: only Zone B. No “shorten hours in Zone B and cancel visits” — there are no visits there.
- **Format** capability may be changed later (**R-04**). Applies to **times that are not booked**. Already-booked visits keep their format. Not a second calendar. Video is **Out**.
- **Vacation** in Zone A: only after that day has no bookings (cancel first if needed). Zone B: mark freely.
- **Price:** frozen for the next 2 weeks; new value applies from **day 15** at the earliest. Default **600 UAH**.
- Isolation: own schedule only.
- No silent auto-cancel. No doctor score on this screen (**R-09** out).

### Data shown / submitted

**Shown:** this doctor’s 3-month schedule, duration, format capability, price, lunch/days off.  
**Submitted:** hours/duration/vacation/format (within zone rules); bulk-cancel confirmation; price for **day 15 onward** (not inside the frozen 2 weeks).

### Notifications triggered

**Confirmed (R-10)**

| Action | Patient | Doctor |
|---|---|---|
| Bulk cancel (each affected visit) | Yes — each patient | — (they did it) |
| Hours / duration / vacation / format / price with no cancel | Nobody | Nobody |

### Out of scope on this screen

**Out:** rooms, equipment; silent cancel; per-slot Offline/Online; parallel calendars; payments; video; doctor performance (**SCR-11**); editing a booked visit’s format or duration in place.

### Open questions (SCR-09)

None that block this section.

Default price is **600 UAH**.

---

## SCR-10 In-app notifications

**Status:** Approved (same as **R-10** — not a separate app)  
**Source:** R-10

Bell on existing screens → list. Read all; click one item = read; unread stay until read then they are gone. Events and who is notified: **R-10**. Exact chrome later. Do not add a second notification product.

---

## SCR-11 Doctor performance

**Status:** Out of MVP  
**Source:** R-09

Do not specify or build this screen in the current delivery.

---

## SCR-12 Reschedule pending (patient decision)

**Status:** Approved  
**Source:** R-07 + R-02 + R-03 + R-06 + R-10 + SCR-06 + FLO-03 + team answers 17 Aug 2026

### Purpose

The doctor proposed a new time. The patient must choose: take that time, pick another free slot with the **same** doctor, or cancel. The doctor does not silently move them.

### Who

**Patient.** Only their own pending visit (**R-01**).

### Entry / exit

**Entry**

- From **SCR-06**: the `Reschedule Pending` row (not independent Move).
- From the **bell** (**R-10** / **SCR-10**): the “doctor proposed a new time” item.

**Chrome.** May be a full screen or a panel/modal on **SCR-06** / the bell. One ID. Exact chrome later — do not invent a new screen beyond **SCR-12**.

**Exit**

- **Accept** → **SCR-06**. New visit is `Upcoming`; old is `Rescheduled` (Past).
- **Pick another** → that doctor’s **SCR-04** (same doctor, inside 2 weeks), then confirm the new slot on **SCR-05** (same confirm as a move). Still the proposal flow, not a separate FLO-02 from a normal `Upcoming`.
- **Cancel** → **SCR-06**; the visit is `Cancelled` (stays visible, marked).
- Back without choosing: pending stays pending (no expiry in MVP).

### UI

**On this surface (R-11):** language, theme, bell.

**Shown (Confirmed — enough to decide)**

- Doctor, place
- **Original** date/time (still taken)
- **Proposed** date/time (reserved)
- Format of the visit (doctor cannot change format on a booked visit in MVP — **R-04**). On **pick another**, the patient **may** switch Offline ↔ Online if the doctor supports it (**R-07**), chosen on **SCR-05** as usual.

**Three actions (Confirmed, R-07)**

1. **Accept** the proposed time
2. **Pick another** available slot with the same doctor (2-week window)
3. **Cancel** the appointment

No fourth action. No “move independently” while pending. No change of doctor.

**Empty / error / loading**

- If the pending visit is not theirs / gone: refusal, not someone else’s decision (**R-01**).
- Concurrent: proposed slot must still be reservable at accept (**R-03**). If it is not, **plain-language refusal**, then pick another or cancel — not a crash.
- Loading: themed. Both languages.

### Behavior / rules

**Confirmed**

- No expiry on pending in MVP.
- While pending: original slot **taken**, proposed slot **reserved**; nobody else books either (**R-02**, **R-03**).
- **Accept:** original → `Rescheduled`; **new** appointment → `Upcoming` at the proposed time. Old slot free; new slot taken (no longer only reserved). History/link kept (**R-07**). Doctor notified (**R-10**). Patient is not (they did it).
- **Pick another:** replaces the proposal with the slot they confirm; that new appointment is `Upcoming`; original → `Rescheduled`. Old slot free; new taken; previous reserved proposal released if they picked a different time. Doctor notified (**R-10**: patient picks another slot in the proposal flow). Same doctor only. Inside 2 weeks. Format may change only if the doctor supports it.
- **Cancel:** original → `Cancelled`; proposed slot released; old slot free; stays visible, who cancelled = patient. Doctor notified (**R-10**). Final. No undo.
- Patient **cannot** start FLO-02 from **SCR-06** while this is pending (**R-07**).
- Proposed time was already required to be inside 2 weeks when the doctor proposed (**R-07**).

### Data shown / submitted

**Shown:** original vs proposed summary above.  
**Submitted:** accept / start pick-another / cancel.

### Notifications triggered

**Confirmed (R-10)**

| Action | Patient | Doctor |
|---|---|---|
| Accept | — (they did it) | Yes |
| Pick another (on success) | — (they did it) | Yes |
| Cancel | — (they did it) | Yes |

The inbound “doctor proposed a new time” item is how they often arrive; opening/acting marks that bell item per **R-10** (click item = read).

### Out of scope on this screen

**Out:** changing doctor; pending expiry; doctor silently moving; video/link; independent own-reschedule while pending; payment.

### Open questions (SCR-12)

None that block this section.

Full page vs modal → frontend later.

---

## FLO-01 Patient books an appointment

**Status:** Approved  
**Source:** Brief (find → profile → real times → take one) + SCR-02 … SCR-06 + R-03 + R-04 + R-05 + R-10 + R-13

### Purpose

A logged-in patient takes one real free time with one doctor and can find that visit again. What looked free is free, or they are told it is gone in plain language.

### Who

**Patient** (already signed in — **SCR-01**). Booking is for themselves only.

### Start / end

**Start:** **SCR-02** Search (patient home after login).  
**End:** **SCR-06** My appointments, new visit under Upcoming. No extra confirmation page (**SCR-05**).

### Steps (Confirmed)

1. **SCR-02** — Find a doctor (specialty / name / clinic; combinable filters). First load: home city + home clinic pre-set; they may change filters and book another clinic. Result cards show **nearest free time** in the next **2 weeks**. Open a card.
2. **SCR-03** — Read the doctor: photo, specialty, clinic, address, experience, **one price** (shown, never charged), supported format. Duration is **not** here. Primary action: open calendar.
3. **SCR-04** — Pick a **day** (days after 14 days from today **disabled**; past times not offered). See real free vs taken vs reserved vs day off / full / empty. Duration visible as slot length. Format is **visible**, not chosen on the slot. Click a **free** slot.
4. **SCR-05** — One screen: doctor, place, date, time, optional reason, **one Confirm**. If the doctor supports **Both**, choose Offline/Online here (default **Offline**). If only one format, that format is used. The slot is **not** held while this screen is open.
5. Confirm **succeeds** → appointment is `Upcoming`. Land on **SCR-06**. Doctor gets an in-app notification (**R-10**). Patient who booked does not. Other patients’ calendars **refresh by themselves** (**R-03**). How = later.
6. Confirm **refused** (taken in the same moment) → plain-language refusal, not a crash. Pick another free time on **SCR-04** (demo: 10:20 then 10:40). Details: **FLO-06**.

### What must be true at confirm (R-03, R-05, R-13)

The slot is still free: inside working hours, that doctor’s duration, not lunch/day off, not taken, not reserved, start not in the past, inside **2 weeks**. One doctor, **one timeline** — Offline and Online cannot double-book the same time (**R-04**).

### Notifications

Doctor: yes, on success. Patient: no (they did it).

### Out of scope for this flow

**Out:** payment; family booking; video; holding the slot on the confirm screen; booking past 2 weeks; guest booking.

### Open questions (FLO-01)

None that block this section. Concurrent detail is **FLO-06**.

---

## FLO-02 Patient reschedules

**Status:** Approved  
**Source:** Brief (move without calling) + R-07 + R-03 + R-04 + R-10 + SCR-06 + SCR-04 + SCR-05 + demo (old slot free again)

### Purpose

The patient moves an `Upcoming` visit to another real free time with the **same** doctor, without calling. The old time becomes free; the new time is taken.

### Who

**Patient.** Their own `Upcoming` appointment only.

This is **not** the doctor-proposal path (**FLO-03** / **SCR-12**). While `Reschedule Pending`, they cannot start this flow (**R-07**).

### Start / end

**Start:** **SCR-06** — Move on an `Upcoming` visit.  
**End:** **SCR-06** — new visit under Upcoming (`Upcoming`); old record in Past as `Rescheduled`.

### Steps (Confirmed)

1. **SCR-06** — Patient chooses **Move** on an `Upcoming` row (not on pending, completed, cancelled, or rescheduled).
2. **SCR-04** — That **same** doctor’s calendar only. Patient cannot change doctor. Pick a **free** slot inside **2 weeks** (same calendar rules as FLO-01). Original slot is still taken until confirm succeeds.
3. **SCR-05** — Confirm the **new** slot. Optional reason. Format: patient **may** switch Offline ↔ Online if that doctor **currently** supports the new format (**R-04**, **R-07**). Same Both / default Offline / single-format rules as a new book. Slot is **not** held while this screen is open.
4. Confirm **succeeds** → old appointment `Rescheduled` (final); **new** appointment `Upcoming`. History/link kept. Old slot **free**; new slot **taken**. Other calendars refresh (**R-03**). Land on **SCR-06**. Doctor notified (**R-10**). Patient is not (they did it).
5. Confirm **refused** (new slot taken in the same moment) → plain-language refusal. Original visit stays `Upcoming`. Pick another free time or back out. Details: **FLO-06**.

### What must be true at confirm

New slot still free (**R-03**, **R-13**). Same doctor. Duration of the **new** slot is that doctor’s duration at that time (**R-05**). Already-booked length of the old visit is not rewritten in place.

### Notifications

Doctor: yes, on success. Patient: no (they did it).

### Out of scope for this flow

**Out:** changing doctor; starting this flow while `Reschedule Pending` (use **SCR-12**); silent doctor move; payment; video; booking past 2 weeks.

### Open questions (FLO-02)

None that block this section. Doctor proposal is **FLO-03**.

---

## FLO-03 Doctor proposes a new time

**Status:** Approved  
**Source:** R-07 + R-02 + R-03 + R-04 + R-10 + R-13 + SCR-08 + SCR-12 + FLO-03 map (SCR-08 → SCR-10 → SCR-12)

### Purpose

The doctor offers a different real free time. The visit does **not** move until the patient accepts, picks another slot, or cancels. No silent move.

### Who

**Doctor** proposes. **Patient** decides. Same doctor throughout; the patient cannot be sent to another doctor.

### Start / end

**Start:** **SCR-08** — Propose a new time on an `Upcoming` visit.  
**End (patient):** **SCR-12** then **SCR-06**, in one of three outcomes below.

### Steps (Confirmed)

1. **SCR-08** — Doctor chooses **Propose a new time** on `Upcoming` only. Not while already `Reschedule Pending`. Not on completed / cancelled / rescheduled. Format of the booked visit **does not change** here (**R-04**).
2. Doctor picks another **free** slot of **their own**, inside the patient’s **2-week** window. They **cannot** propose after those 2 weeks. Picker chrome later — not **SCR-04** (patient calendar), not a new screen ID.
3. On send: original → `Reschedule Pending`; **original** slot stays **taken**; **proposed** slot is **reserved**. Nobody else can book either. Other calendars refresh (**R-03**). **No expiry** in MVP.
4. **SCR-10** — Patient gets an in-app bell item (“doctor proposed a new time”). Doctor is not notified (they did it).
5. **SCR-12** — Patient only:
   - **Accept** → original `Rescheduled`; new `Upcoming` at the proposed time. Old slot free; new taken (no longer only reserved). Doctor notified.
   - **Pick another** → same doctor, **SCR-04** → **SCR-05**, still this flow (not FLO-02). New `Upcoming`; original `Rescheduled`; previous reserved proposal released if they picked a different time. Doctor notified.
   - **Cancel** → `Cancelled`; both slots free; stays visible. Doctor notified.
   - Back without choosing: stays pending.

While pending, the patient **cannot** start FLO-02 from **SCR-06**.

### Notifications (R-10)

| Step | Patient | Doctor |
|---|---|---|
| Doctor sends proposal | Yes | — |
| Patient accepts / picks another / cancels | — | Yes |

### Out of scope for this flow

**Out:** silent move; changing doctor; proposing outside 2 weeks; pending expiry; doctor changing format of the booked visit; second proposal while one is pending; video.

### Open questions (FLO-03)

None that block this section. Slot-picker chrome → frontend later.

---

## FLO-04 Patient or doctor cancels

**Status:** Approved  
**Source:** Brief (cancel frees slot, stays visible marked cancelled) + R-06 + R-02 + R-03 + R-10 + SCR-06 + SCR-08 + SCR-12

### Purpose

A visit is called off. It is not deleted. The slot is free again. Cancellation cannot be undone.

### Who

**Patient** or **doctor**. Each only on visits they are allowed to cancel (**R-02**). This flow is **one visit**. Bulk / range cancel is **FLO-05** (**SCR-09**).

### Start / end

| Actor | Start | What they may cancel here |
|---|---|---|
| Patient | **SCR-06** | `Upcoming` |
| Patient | **SCR-12** (pending decision) | `Reschedule Pending` |
| Doctor | **SCR-08** | `Upcoming` only (one visit) |

**End:** same lists — row stays, status `Cancelled`, **who cancelled** shown. Patient: Past group on **SCR-06**. Doctor: that day on **SCR-08**.

### Steps (Confirmed)

**Patient, `Upcoming` (SCR-06)**

1. Cancel on that row.
2. Status → `Cancelled` (final). Slot **free**. Calendars refresh (**R-03**).
3. Doctor notified (**R-10**). Patient is not (they did it). Who cancelled = patient.

**Patient, `Reschedule Pending` (SCR-12)**

1. Cancel on the pending decision (not independent Move).
2. Original → `Cancelled`. Proposed slot **released**; original slot **free**.
3. Doctor notified. Who cancelled = patient.

**Doctor, one `Upcoming` (SCR-08)**

1. Cancel this visit (not no-show).
2. Status → `Cancelled` (final). Slot **free**. Calendars refresh.
3. **That patient** notified. Doctor is not (they did it). Who cancelled = doctor.

Doctor does **not** single-cancel `Reschedule Pending` here (**R-02**). Pending in a range is **FLO-05**.

### What cannot be cancelled

`Completed`, already `Cancelled`, `Rescheduled` (cancel the new `Upcoming` if needed). No time-limit window. No undo. No fees.

### Notifications (R-10)

| Who cancelled | Patient | Doctor |
|---|---|---|
| Patient | — | Yes |
| Doctor (this one visit) | Yes | — |

### Out of scope for this flow

**Out:** bulk/day/range (**FLO-05**); no-show; undo; payment; doctor score; silent cancel by shortening hours.

### Open questions (FLO-04)

None that block this section.

---

## FLO-05 Doctor changes hours and bulk-cancels

**Status:** Approved  
**Source:** R-08 + R-05 + R-13 + R-10 + SCR-09 + FLO-05 map

### Purpose

The doctor plans their calendar honestly. Inside 2 weeks they do not silently drop visits by editing hours. They **confirm** a bulk cancel first. After 2 weeks the calendar is empty and they can change hours, duration, vacation, and price (from day 15).

### Who

**Doctor.** Own schedule only.

### Start / end

**Start / end:** **SCR-09**. One-visit cancel stays **FLO-04** / **SCR-08**.

### Two zones (Confirmed)

**Zone A — next 2 weeks** (bookings exist)

- Hours, duration, and the **current** price are **frozen**.
- Doctor may **bulk-cancel** (with confirm): all visits in **one day**; **rest of day**; **rest of week**; or a **custom range** **inside those 2 weeks**.
- `Reschedule Pending` in that period is cancelled too; reserved proposed slot released.
- Each affected **patient** is notified. Who cancelled = doctor. Doctor is not notified (they did it).
- Slots become **free**. Calendars refresh (**R-03**).
- After a day has **no** bookings left, doctor **may mark vacation** for that day.
- Nothing is cancelled silently (not by shortening hours).

**Zone B — after 2 weeks, up to 3 months** (no bookings)

- Change working hours, lunch, duration (**20 / 30 / 45**), vacation.
- Price: new value applies from **day 15** at the earliest (**SCR-09**).
- No bulk-cancel of appointments here — there are none. No “shorten hours here and cancel pending visits.”

### Default until they edit Zone B

Mon–Fri 09:00–18:00, lunch 13:00–14:00, weekend off; duration from sign-up; format Offline only until edited (**SCR-09**).

### Out of scope for this flow

**Out:** silent auto-cancel; rooms/equipment; changing booked duration or format in place; appointments beyond 2 weeks; doctor score; one-visit cancel (FLO-04).

### Open questions (FLO-05)

None that block this section.

---

## FLO-06 Concurrent booking of the same slot

**Status:** Approved  
**Source:** Brief + client demo (10:20 refused, 10:40 succeeds) + R-03 + SCR-04 + SCR-05 + FLO-01 / FLO-02

### Purpose

One time, one patient. Two people must not both get the same slot. The loser sees a product refusal, not a crash.

### Who

Two **patients**, two browsers, same doctor, same start time. (Same rule if one path is a **new book** and the other is a **reschedule confirm** onto that slot.)

### Start / end

**Start:** both on **SCR-04** / **SCR-05** looking at a slot that still looks free. Confirm does **not** hold the slot (**SCR-05**).  
**End:** one has `Upcoming` on **SCR-06**; the other is still on confirm (or back on **SCR-04**) with a refusal, and can take another free time.

### What happens (Confirmed — client demo)

1. Patient A and Patient B both see Tuesday **10:20** as free.
2. Both confirm that slot (same moment is allowed).
3. **One** confirm **succeeds** → `Upcoming`. That time **disappears immediately** for everyone else. Other calendars **refresh by themselves** (**R-03**). How = later.
4. The **other** confirm is **refused in plain language** in the current language — not a crash, blank page, or technical dump. Meaning: this time is no longer free; pick another.
5. The refused patient books **10:40** successfully (demo).

A UI-only check is **not** enough. How the server/database enforces it is **postponed** (not this spec).

### Also true

- One timeline: Offline and Online cannot both take the same time (**R-04**).
- A **reserved** proposed time (`Reschedule Pending`) is not free for a third patient (**R-02**).
- After cancel or a successful patient reschedule, the old time is free again and this race can happen on that slot like any other free time.

### Notifications

Only the **successful** book (or successful reschedule onto that slot) notifies the **doctor**. The refused patient is not notified (they see the refusal on screen).

### Out of scope for this flow

**Out:** waiting lists; overbooking on purpose; holding the slot without a booking; specifying the DB constraint / transaction (architecture later).

### Open questions (FLO-06)

None that block this section. Exact EN/UK refusal sentence → frontend later.

---

## Open questions (product)

Copy here any **Open** item that is still unresolved when a section is filled. Do not resolve them by inventing requirements.

Resolved in R-01: email uniqueness; new doctor immediately visible with default hours; license upload required (image/PDF, no check); forgot password out; patient has home city+clinic, search ranks home clinic first, booking other clinics allowed.

Resolved in R-02: Completed = doctor mark **or** auto after visit end; past-due Upcoming with no action → Completed; Reschedule Pending holds old slot and reserves proposed slot; past UI grouping as written.

Resolved in R-03: other patients’ calendars refresh by themselves (how is later); one timeline for Offline+Online in MVP; per-slot format is a later idea, not this MVP.

Resolved in R-04: formats edited on SCR-09; new doctor Offline only; doctor may change formats later but **not** on already-booked times.

Resolved in R-05: doctor may change duration later; booked days frozen; no duration change inside 2 weeks; new doctor picks duration at sign-up (default 30).

Resolved in R-13: patient 2 weeks; doctor 3 months; inside 2 weeks freeze duration, hours, price; vacation OK on unbooked days inside 2 weeks; one profile price.

Resolved in R-06: who cancelled is shown; each cancelled patient gets an in-app message; doctor rate is **out of MVP** (patient or doctor cancel does not score the doctor now).

Resolved in R-07: while pending, patient only Accept / pick from proposal / Cancel; proposed time must be inside 2 weeks; doctor cannot propose beyond 2 weeks.

Resolved in R-08: bookings exist only inside 2 weeks; after 2 weeks the doctor plans an empty calendar (hours, vacation, price); inside 2 weeks doctor may cancel one visit, a whole day at once, rest of day/week, or a custom range, then mark vacation when the day is empty.

Resolved in R-10: doctor is notified on patient book/cancel/reschedule/accept; bell → list; Read all; click item = read; unread stay until read then they are gone.

Resolved in R-11: fallback language Ukrainian; language and theme switch on every screen.

Resolved in R-12: Ukrainian-style fictional names; only four specialties; **25** seed patients; default hours Mon–Fri 09:00–18:00, lunch 13:00–14:00.

Resolved in SCR-01: login is email+password only; duration options 20/30/45; mascot name skipped for now.

Resolved in SCR-02: first load pre-filters home city and home clinic; empty search + filters = browse; nearest free time = earliest free start in next 2 weeks matching filters.

Resolved in SCR-03: photo required; primary action opens calendar; duration only on the calendar.

Resolved in SCR-04: calendar + day picker; days after 14 days disabled; Offline/Online **visible** on calendar, **chosen on SCR-05** (default Offline if Both).

Resolved in SCR-05: one-screen confirm; format chosen here; concurrent plain-language refusal; doctor notified; land on **SCR-06** only (no extra confirmation view).

Resolved in SCR-06: Upcoming vs Past grouping; pending in Upcoming with no independent Move (**SCR-12**); cancelled stay visible with who cancelled; land here after **SCR-05**.

Resolved in SCR-07: both roles have My profile; patient name/phone/email/DOB **and** home city/clinic editable (seed lists); doctor name/phone/email and city/clinic editable; password change **out** of MVP; hours/duration/format/price stay **SCR-09**.

Resolved in SCR-08 (actions): mark completed on `Upcoming`; cancel one `Upcoming` visit; propose a new time (**FLO-03**). No-show out. Pending: no second proposal, no doctor single-cancel (patient / **SCR-09** bulk). Day list covers the **2-week** window (not only this calendar week).

Resolved in SCR-09: 3-month schedule; 2-week freeze on hours/duration; bulk cancel with confirm; vacation on emptied days; format edited here; price **frozen 2 weeks**, new price from **day 15**; default **600 UAH**.

Resolved in SCR-12: Accept / Pick another (same doctor, **SCR-04** → **SCR-05**) / Cancel. No independent Move while pending. No expiry. Doctor notified on each of those three.

Resolved in FLO-01: Search → profile → calendar → confirm → **SCR-06**. Format on confirm. No hold. Success `Upcoming` + doctor notified.

Resolved in FLO-02: Move from `Upcoming` only; same doctor; **SCR-06** → **SCR-04** → **SCR-05**; old `Rescheduled`, new `Upcoming`; not while pending.

Resolved in FLO-03: Doctor proposes from **SCR-08**; pending holds old + reserved new; patient decides **SCR-12**; no silent move; no expiry.

Resolved in FLO-04: One-visit cancel from **SCR-06** / **SCR-12** (patient) or **SCR-08** (doctor, `Upcoming` only). Stays visible; who cancelled; slot free; other person notified.

Resolved in FLO-05: **SCR-09** two zones; bulk cancel with confirm inside 2 weeks; no silent hours-cancel; Zone B empty plan; price from day 15.

Resolved in FLO-06: two patients, same slot → one `Upcoming`, the other **plain-language refusal**; demo 10:20 then 10:40; no hold on confirm; how the server enforces it is later.

**Leftover opens (resolved 17 Aug 2026)**

- GDPR / privacy / legal — **Out** of this MVP/demo.
- Auto-complete uses slot **end**; `Reschedule Pending` does **not** auto-complete — **confirmed**.
- New-doctor photo at sign-up — **placeholder**; they add a photo later on **SCR-07**. Seed doctors have photos.
- Default price — **600 UAH**.

Nothing remaining as Open at product level.

---

## Postponed (not this document)

Do not fill these here. They belong in architecture / `frontend-spec.md` / `backend-spec.md` later:

- Slot generation/storage strategy
- Database mechanism preventing double booking
- Date/time/timezone storage model
- Authorization implementation
- API structure
- Database schema
- Frontend/backend architecture
- File storage for license uploads
