# Project Context — Digital Healthcare Booking Platform

**Client brief:** "Team 04, Ihor and Maryna" | Duration: 6 weeks, Wed 12 Aug 2026 → Wed 23 Sep 2026 | Source: client brief PDF, August 2026

## 1. The problem
The client runs a network of clinics (family doctors, cardiologists, dermatologists, paediatricians) across several cities. Today, booking works by phone: a receptionist with a paper diary answers calls, reads out slots that may already be taken, and writes down a name. This breaks in two predictable ways:
- **Double bookings** — two receptionists write into the same slot at the same time.
- **No visibility** — patients can't see real availability without calling.

## 2. What the client wants
A self-service website where:
- Patients find a doctor, see the doctor's **real** calendar, take a free slot, and get instant confirmation.
- Doctors open their own screen each morning and see who's coming.
- **Core promise:** "make booking a doctor honest" — what the screen shows as free is genuinely free, and a taken slot can never be taken twice.

This is explicitly **not** a full hospital system — it's a booking layer only.

## 3. Reference product
**Helsi** (Ukraine's doctor-booking app) is the visual/UX reference: search a specialist → open their card → pick a time from a row of buttons. Client wants this pattern, smaller in scope, calm/dense UI. Explicitly **do not** copy: medical records, prescriptions, state registries, pharmacy features.

## 4. User capabilities

### As a patient
- Register once, log in (no receptionist involved)
- Search by specialty, doctor name, or clinic
- Filter by city/clinic, format (in-person/online), date
- Open a doctor profile: who they are, where they work, what they charge
- See the doctor's real calendar, book a free slot in two clicks
- Reschedule or cancel without calling anyone (cancelling releases the slot back to the pool)
- See upcoming vs. past appointments

### As a doctor
- Log in and see today/this week, ordered by time
- See who's coming, for what, in what format
- See **only their own** patients and calendar — never a colleague's
- Their working hours generate the bookable slots patients see
- Mark an appointment completed or "patient did not arrive"

> The doctor side is intentionally small — it exists to prove the same appointment looks correct from both ends, not as a second product.

## 5. Core user flow (6 steps)
1. Find a doctor
2. Read their profile
3. See real free times
4. Take one, get it confirmed
5. Move it or cancel it
6. The doctor sees the patient coming

## 6. The 9 required screens
1. **Sign up / log in** — one account type (patient or doctor), mascot lives here
2. **Search & results** — specialty/doctor/clinic search, filters (city/clinic, format, date), result cards showing nearest free time
3. **Doctor profile** — specialty, clinic, experience, services + prices, address
4. **Calendar** — week view, switchable days, free slots bookable, taken slots visibly not; empty day says so explicitly
5. **Confirm booking** — doctor/service/place/date/time on one screen, optional reason for visit, one confirm button → findable confirmation
6. **My appointments** — upcoming vs. past clearly separated; move/cancel from here; cancelled ones stay visible, marked
7. **My profile** — name, phone, email, DOB; editable and persists; language/theme preference stored here
8. **Doctor's day view** — today/this week in time order; patient, service, format, reason; mark completed / no-show
9. **Doctor's working hours** — which days, which hours, visit duration; block days off/lunch; this is what generates the slots patients see

## 7. Non-visible system requirements (the hard part)
These aren't on any screen but are the actual point of the project:

- **Free times are real** — slots are derived from the doctor's actual working hours minus visit length, days off, breaks, and already-taken times. Nothing in the past is ever offerable.
- **A slot can be taken exactly once** — two patients, two browsers, same second, same slot → one succeeds, one gets a clear refusal (not an error page). This must be enforced with a real concurrency-safe mechanism (e.g., DB-level constraint/transaction), **not just a UI/client-side check**.
- **Strict data isolation** — a patient sees only their own appointments; a doctor sees only their own calendar. Must hold even if someone tampers with the URL/address bar (i.e., authorization checked server-side per request/object, not hidden via UI).
- **Appointment lifecycle** — states: booked, moved, cancelled, completed, no-show. Each transition has a defined owner (who's allowed to make it). Moving an appointment must atomically free the old slot and claim the new one. Some transitions are irreversible — team must define and document which.

### Two explicit non-negotiables
1. **One time, one patient** — the double-booking race condition must be *impossible*, not just unlikely.
2. **Everyone sees only their own** — treated as a privacy/security requirement baked into the design, not a bolt-on feature.

## 8. Explicitly out of scope
- Medical records, test results, prescriptions, referrals
- Payments of any kind (prices shown, never charged)
- Family profiles / booking on behalf of someone else
- Reviews and ratings of doctors
- Email/SMS reminders and notifications
- Insurance, referral chains, state health registries
- Clinic-administrator role (only patient + doctor roles exist)
- Rooms, equipment, queues, waiting lists
- Native mobile app (responsive website is sufficient)

## 9. Personal/polish requirements (treated as first-class, not "week 5 polish")
- **Light & dark themes** — both designed properly (not just inverted colors); light is default/first impression, soft and calm; follows OS setting on first visit; visible toggle that persists after refresh; no white flash on load in dark mode; every screen incl. errors/empty states themed.
- **Custom typeface** — one deliberate font, not browser default/Arial; self-hosted (not third-party CDN at page load); must support Latin + Cyrillic; no layout shift while font loads; pick something that reads as trustworthy for health information, and be ready to explain the choice.
- **Two languages (EN/UK)** — switchable in-app; all UI text lives in translation files (nothing hardcoded); dates/times/prices/weekday names localized; error & validation messages translated too; language choice persists across sessions.
- **A mascot** — AI-generated, soft 3D style, from the world of medicine (e.g. a small doctor/stethoscope character); needs a name and short personality (2–3 sentences) documented; must work in light & dark and on mobile; appears on sign-up/log-in (required) and ideally on the empty "no appointments yet" state; must never slow down or visually compete with the form.

## 10. Tech stack
- **Backend:** Fastify (TypeScript)
- **Database:** PostgreSQL + Drizzle (ORM)
- **Repo:** single monorepo, shared by both team members
- **Frontend:** team's own choice
- Client explicitly does not dictate stack choices beyond backend/DB — frames it as "the one slide where I am not your client."

## 11. Team split guidance
- Split by **surface**, not by layer — i.e., not "one owns backend, one owns frontend." Suggested cut: patient side (search/profile/calendar/booking) vs. doctor side (working hours, day view, auth & roles).
- Each surface owned end-to-end (data + routes + screens) by one person.
- Shared middle — schema and booking/concurrency rules — must be designed together *before* either person starts writing code against it.
- Concepts both must understand deeply regardless of split: slot generation, the anti-double-booking guarantee, what needs a DB transaction, per-request/per-object permission enforcement, timezone-safe time storage/display, appointment state machine & ownership of transitions.
- Team sends the client a written division-of-work paragraph by end of Week 1.
- Either team member must be able to answer questions about any part of the system — no siloed knowledge.

## 12. Open questions the team must answer themselves (due Week 3, in writing + walkthrough)
- Doctor schedule → bookable slot generation logic
- Whether a free slot is precomputed/stored or calculated on read, and the tradeoffs
- Exact double-booking prevention mechanism (same slot, two browsers, same instant)
- What happens to existing appointments when a doctor shortens their hours
- How rescheduling atomically frees the old slot and claims the new one
- Appointment state machine: allowed transitions, who can trigger them, what's irreversible
- Authorization check strategy applied consistently across every route
- Time storage format and cross-timezone display behavior
- API surface / what each of the 9 screens actually needs from it
- Retrospective: what they'd do differently with 3 more months

## 13. Acceptance criteria (client will check personally, one by one)
Functional: signup/login/logout persistence, specialty search accuracy, combinable filters, doctor profile completeness, calendar reflects real hours (not decorative), past times never bookable, booked slots disappear instantly for everyone else, concurrent double-booking correctly refused in plain language, rescheduling releases old slot, cancelling keeps appointment visible as "cancelled" and frees the slot, upcoming/past correctly separated and ordered, doctor sees only own day/calendar, patients can't reach others' appointments via URL manipulation, profile edits persist across logout, validated error messages in the user's chosen language, both themes fully designed with no white flash, language switch is complete and persists, auth screen has the mascot and loads fast on mobile.

Engineering quality: frontend runs against the real backend (**no mock data in the demo**), everything lives in a real DB and survives a restart, every request authorized server-side (hiding a button ≠ a permission), the anti-double-booking mechanism must be demonstrable/explainable, times stored/displayed correctly across timezones, DB seeded with realistic data (multiple clinics, 20+ doctors across specialties, real schedules, past & future appointments), screens match the approved design (not "assembled"), works on a phone screen, automated tests at minimum for slot availability, booking, and permissions, a README that lets someone else run the project from zero, one spec from both teammates matching what was actually built, either teammate can explain data model/API/booking rules alone without notes, design+spec+code handed over together in English.

## 14. Demo script (client will run this live, 15 min, both present)
1. Open in a fresh browser → loads in client's OS theme; toggle theme & language (EN↔UK)
2. Sign up as new patient on the auth screen (mascot visible); name the mascot
3. Search cardiologist, filter by city + in-person, open a doctor
4. View profile: clinic, experience, services, prices, address
5. Open next week's calendar: show a day with free times, a full day, a day off
6. Book Tuesday 10:20, add a reason, confirm, land on a retrievable confirmation
7. Open "My appointments" → see it under upcoming with doctor/place/time
8. **Critical test:** from a second browser, as a different patient, try to book the same Tuesday 10:20 → must be refused in plain language; then book 10:40 successfully
9. Move the original appointment to Thursday 11:00; confirm from the other browser that Tuesday 10:20 is free again
10. Log in as the doctor → day view shows patients in time order with service/reason
11. As the doctor, try to open another doctor's calendar via URL manipulation → must be denied
12. As the patient, cancel Thursday → moves to past, marked cancelled, slot returns to calendar
13. Repeat the flow on a phone-sized screen

## 15. Process expectations
- **Daily** written update by end of day, in English, 4 lines max: done today / in progress / blocked. One update from the whole team, not two.
- **Twice weekly**, 15-min screen-shared check-in, both present, both talk, show screens/behavior (not code/terminal). Showing something unfinished/ugly early (Week 3) is preferred over polish late (Week 6).
- One unified voice to the client — disagreements resolved internally before responding, not in front of the client.
- Team plans the 6 weeks themselves and flags early if the shape of the timeline changes.

## 16. Six-week timeline
| Week | Team delivers | Client expects to see |
|---|---|---|
| 1 | Read brief, agree split, send questions, first pass at screens | Written team split + rough clickable flow of main screens |
| 2 | Design iterations after client review, incl. both themes & languages | Client-approved design (nothing gets built before this) |
| 3 | Backend plan on paper: schema, API, booking rules, answers to open questions | One written spec, walked through out loud, both answering |
| 4 | Backend alive on real data: doctors, schedules, slots, booking, roles | Booking rules working, double-booking already blocked, even with a bare frontend |
| 5 | Frontend built against the real backend, both surfaces end-to-end | Client can click through both patient & doctor sides unaided |
| 6 | Finish personal-wish items, tests, seed data, README, optional deploy | Rehearsed demo per section 14 |

**Client's stated priority:** the backend/booking correctness (Weeks 3–4) matters more than frontend polish. "A plain front end over a solid booking system is the better outcome of the two."

## 17. Definition of done
- A stranger can book a doctor with zero human help (no client, no receptionist)
- The double-booking scenario is provably impossible, and the team can explain why
- No patient can reach another patient's appointment via any route
- Moving/cancelling always leaves the calendar in a truthful state
- Doctor's day view matches exactly what patients booked
- All screens are designed (not just assembled) in both themes and both languages, mascot included
- Frontend runs on the real backend with real data
- Failures behave like deliberate decisions, not accidents (clear messaging)
- Slot-availability, booking, and permissions logic have automated tests
- Either teammate can explain the whole architecture alone, without notes
- Design, spec, and code are handed over together
- The 13-step demo runs start to finish without intervention

> Client's closing note: "Two of you, one product. I should not be able to tell where one of you stopped and the other started." Team is encouraged to use AI assistance freely, but must be able to personally explain and defend everything shipped.
