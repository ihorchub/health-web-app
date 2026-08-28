# IA, chrome, and booking — product decisions

**Status:** Agreed (26 Aug 2026) — dialogue pass same day; **price / ratings / reviews** updated **27 Aug 2026**

### Precedence (how to read specs)

| Layer | Role |
|---|---|
| [product-spec.md](./product-spec.md) | Base product rules (statuses, honesty, isolation, most R/SCR/FLO text from 17 Aug) |
| **This file** | **Wins** on the topics listed below when they conflict with product-spec or design-spec |
| [design-spec.md](./design-spec.md) | Visual tokens — Likaro/IBM Plex chrome **outdated** where this file says otherwise |

**Do not require a full rewrite of product-spec** before drawing or implementing. Use this file as the overlay; fold into product-spec later when convenient.

**Unchanged unless this file says so:** R-01 roles/isolation · R-02 statuses · R-03 slot honesty / double-booking · R-04 format · R-06 cancel meaning · R-10 bell events (dashboard “reminder” widgets are UI, not a new R-10 channel).

### Overrides map (this file → product-spec IDs)

| Topic in this file | Product-spec IDs it supersedes on conflict |
|---|---|
| Medicly + Manrope | R-11 typeface; design-spec brand/font |
| Guest `/` = search; post-login → SCR-06 / SCR-08 | SCR-01 exit; SCR-02 who/entry; FLO-01 start |
| Header / avatar menu / footer / Privacy+Terms | Chrome notes on SCR-*; scope “legal out” for these two pages only |
| Rolling bookable month + Zone A/B | **R-13**; Zone A language in **R-05, R-07, R-08, SCR-04, SCR-09, FLO-*** |
| SCR-02 layout (banner, search+city, popular chips, specialties expand, **right filter sidebar** desktop, heart, ratings/price) | SCR-02 UI |
| Wizard modal + success **alert** (not full step) | SCR-03…05 chrome; FLO-01/02 end |
| SCR-04 two months + slots below | SCR-04 UI |
| SCR-06 cabinet (columns, favourites, recently viewed, right widgets) | SCR-06 |
| SCR-07 view → edit same page | SCR-07 UI |
| SCR-08 dashboard (metrics, columns, right widgets) | SCR-08 UI |
| Favourites | new behaviour (cards + SCR-06) |
| Variable + promo prices; rating ★★★★★; reviews; sort by rating | R-13 “one price / default 600”; SCR-02/03 “no reviews”; product-spec / AGENTS “reviews out”; design-spec “no ratings” |

**Still open** (do not invent): specialty list; header CTA labels; Privacy/Terms SCR vs routes; SCR-08 day nav strip vs calendar; banner final art; legal copy; **review edit/delete / moderation**; **how doctor sets promo price (SCR-09 UI)**.

**Handoff for drawing:** this file first, then product-spec for anything not overridden. Layer specs (`frontend-spec` / `backend-spec` / full `design-spec` refresh) after boards.

---

## Design system for drawing (MUI + responsive)

**Confirmed (26 Aug 2026)**

- UI is built with **MUI (Material UI)** components. When drawing in Paper/Figma, **base layouts and controls on MUI** — do not invent one-off chrome that cannot map to MUI.
- Use MUI patterns wherever they fit: **Button, TextField, Select, Checkbox, Chip, Card, Avatar, Menu, Popover/Menu for filters, Dialog/Modal for the booking wizard, Alert/Snackbar for success toast, AppBar/Toolbar for header, Drawer if needed on mobile**, etc.
- **Calendar / day picking:** prefer **MUI Date / DateCalendar / DatePicker** (or MUI X Date Pickers) look and behaviour — two months + slots-below composition can wrap those calendars; do not draw a custom calendar language that fights the library.
- Theme tokens (Medicly colours, Manrope) sit **on top of** MUI theme — customize palette/typography, keep component structure recognizable as MUI.
- **Icons: [Tabler Icons](https://tabler.io/icons)** — stroke icons, consistent 24px viewBox; pick clear medical/UI metaphors (search, filter, heart, specialty glyphs). Do not invent ad-hoc icon shapes when a Tabler icon fits.
- **Responsive from the start:** every screen is drawn for **desktop and mobile** (at least). Prefer also a mid breakpoint if the layout breaks (e.g. dashboard two columns → stack). Do not design desktop-only and “fix later”.

Mobile reminders already agreed elsewhere (guest header, dashboard right column under greeting, calendar months stacked/swipe) — keep those when drawing.

---

## Brand

- Product name: **Medicly** (final).
- Header mark: SVG icon + wordmark “Medicly” (logo only in the bar — **no text page links**).
- **Typeface: Manrope** (final). Supersedes design-spec IBM Plex Sans / Likaro lock.
- Font trials (Paper): https://app.paper.design/file/01M0YN3VAY6VEYTZ5EYWSD528Y

---

## Booking horizon (replaces 14 days / 2 weeks)

**Rolling bookable window:** from **today** through the calendar day **one month later minus one day**.

Example: today **10 Aug** → active **10 Aug … 9 Sep** inclusive. From **10 Sep** onward is outside the patient bookable window.

- **Patient** may only book / move / accept proposal slots inside this window.
- **Doctor Zone A** (frozen hours, duration, price; bookings exist) = **the same rolling window**.
- **Zone B:** after Zone A ends, up to **3 months** from today — **no bookings**; doctor may plan hours / duration / vacation / price (unchanged idea).
- **Price (base):** frozen in Zone A; earliest day a new **base** price applies = **first day after Zone A** (replaces old “day 15”).  
- **No fixed platform price of 600 UAH** as the product truth — doctors have **different** consultation prices; **600 UAH may remain only a seed/default for new doctors** until they edit (not a market-wide fixed fee).  
- **Promo / акційні prices** are **in MVP** (display strike-through base + promo amount where active). Charging/checkout still **out** — prices are shown, never charged in-app.

SCR-06 mini-calendar and SCR-04 day grids respect this window.

---

## App shell

### Header (guest) — public search home

`/` = **SCR-02 Search** (browsable without login).

Left → right:

1. **Logo** → SCR-02  
2. **Log in** (secondary)  
3. **Sign up** (primary)  
4. **Theme** toggle  
5. **Language** UK | EN (in header — no avatar menu)

No bell, no avatar, no booking CTA.  
**Book / Записатися** on cards and in wizard: **disabled** (+ short hint) → SCR-01. After login, return to the same doctor / wizard step when practical.

### Header (logged-in)

**No role nav labels** in the bar.

1. **Logo** → role home (**SCR-06** patient / **SCR-08** doctor)  
2. **Primary CTA** (before utilities)  
   - Patient → **SCR-02** (same as “Find a doctor”)  
   - Doctor: label / whether shown — **Open**  
3. **Bell** (SCR-10)  
4. **Theme**  
5. **Avatar** → menu  

Language is **not** a standalone header control when logged in; it lives in the avatar menu.

#### Avatar menu

| Item | Patient | Doctor |
|---|---|---|
| My cabinet / Мій кабінет | → **SCR-06** | → **SCR-08** |
| My profile / Мій профіль | → **SCR-07** | → **SCR-07** |
| My schedule / Мій графік | — | → **SCR-09** |
| Language / Мова | UK \| EN | same |
| Log out | Ends session | same |

### Header (SCR-01)

Auth: language + theme (no bell, no avatar, no booking CTA). **SCR-01 layout left as-is for this pass** (checkboxes for Privacy/Terms remain decided — apply when auth is revisited).

### Post-login

- **Patient** → **SCR-06** cabinet (not SCR-02).  
- **Doctor** → **SCR-08**.

### Footer (auth, guest, logged-in)

**One horizontal row**, centered (no tinted footer surface — page bg shows through). Optional hairline top border only.

Text: **uppercase**, slightly heavier weight + larger than body meta — e.g. `PRIVACY POLICY · TERMS OF USE · © {year} MEDICLY` (same line; middots between items).

Full legal pages are **in MVP** (public, no session; EN + UK). Copy written later.  
**Open:** new `SCR-*` IDs vs static public routes.

Sign-up: **two required checkboxes** with links to those pages; register disabled until both checked (when SCR-01 is updated).

---

## Patient — SCR-02 Search (public home)

### Paper lock — **FINAL** (27 Aug 2026)

**SCR-02 visual design is locked.** Do not redesign layout, chrome, cards, or states unless the user explicitly reopens this screen.

| Role | Matrix drawn |
|---|---|
| **Guest** | Desktop + Mobile · Default · Light/Dark · UK; Guest Desktop Loading/Empty/Error Light+Dark UK; Guest EN Default + states (desktop) + mobile Default/Filters; Mobile Filters open Light/Dark UK (+ EN) |
| **Patient (logged-in)** | Desktop + Mobile · Default · Light/Dark · UK only (no EN, no Loading/Empty/Error for Patient this pass) |

**SoT artboards (names end with `FINAL`):** Guest Desktop/Mobile Default Light+Dark UK · Guest Mobile Filters open Light UK · Patient Desktop/Mobile Default Light+Dark UK.

**Paper file / page:** https://app.paper.design/file/01M0D5RXPB3F6XJZ814DFZDMEZ — page **04 · SCR-02 - Search and results**.

**Locked deltas vs Guest:** patient header = **«Знайти лікаря»** + bell + theme + avatar (no UK\|EN in bar; language in avatar menu); active Book + favourite hearts; city/clinic filter prefill (e.g. Київ / Добробут). Mobile patient CTA may shorten to **«Знайти»** for width. Light cards use design-spec card shadow; Dark uses surface + border (no Light shadow).

**Hero asset:** `docs/brand/hero/scr02-hero-doctor-lika.png` · doctor avatars: `docs/brand/doctor-avatars/`.

Structure top → bottom:

1. **Promo banner** — brand teal + **composite hero PNG** (doctor + Lika owl + decorative calendar/bell) + **3 steps** (find → time → book). No separate floating free-slots UI card. Not a data dashboard.  
2. **Search row:** input (placeholder: name / clinic / specialty) + search control as drawn in Paper SoT. City lives in the **filter sidebar**. Under search: **popular query chips**.  
   **Desktop filters:** **right sidebar** (always visible) — city, clinic, specialty, format, availability, min rating, price range (**0–5000 грн+**); **Скинути все**. Filter icon/drawer for **mobile**.  
3. **Specialty category cards** — visual filter into the same search. Default shows a short set (e.g. four) plus **«Усі спеціальності»** that **expands** the rest inline. Exact specialty list **Open**.  
4. **Doctor results** (left column under specialties) — **found count** + **sort** (by rating / nearest slot) · cards · **Показати ще**.

Logged-in patient: home city + home clinic prefill as before. Guest: no home prefill.  
Optional clinics row — not required this pass.

---

## Price, rating, reviews (in MVP — 27 Aug 2026)

Supersedes product-spec / design-spec / AGENTS lines that said reviews & ratings are out, and the “single default 600 UAH forever” framing.

| Topic | Decision |
|---|---|
| **Base price** | Per doctor, **variable** (not one platform fee). Shown on cards / SCR-03 / confirm. Never charged in-app. |
| **Promo price** | Allowed. UI shows **promo** as primary amount + **struck base** when promo is active. |
| **Seed / new doctor** | May still start from a default (e.g. 600 UAH) until edited on **SCR-09** — that is onboarding only, not a fixed market price. |
| **Rating** | **5-star** scale, shown on compact + full doctor surfaces (average). |
| **Reviews** | **In MVP** — list on doctor profile (**SCR-03**); summary (stars + count) on SCR-02 cards. |
| **Write a review** | Patient only. **After any Past visit** (`Completed` + `Cancelled` + `Rescheduled`). **One review per Past visit** (not one per doctor). Entry: **SCR-06 Past row** CTA → **modal** (★ required + optional text). Not from SCR-02/03 stars (those are read-only averages). Guest: no write. |
| **Sort** | Prefer **by rating** (and/or nearest slot). Do not invent opaque “popularity” without a defined metric. |
| **Filter** | Price range + min rating are draw/implementable; payments still out. |

**Open (do not invent until decided):** edit/delete after submit; moderation; whether promo is a date-ranged override on SCR-09.

---

## Doctor card

### Compact (SCR-02, carousels on SCR-06)

Photo · name · specialty · clinic · format · nearest free (rolling window) · **price** (variable; show promo + struck base when active) · **★ rating + review count** · **favourite heart** · primary Book.  
Guest: Book disabled. Heart → login or disabled + hint.  
Card click / Book → wizard **step 1** (SCR-03).

### Full — SCR-03 (wizard step 1)

Photo · name · specialty · heart · clinic/city/address · years · format · **price** (variable + promo if any) · **★ rating** · **reviews list / section** · CTA **Choose time** → step 2.  
Duration not here. Not editable by patient. Distinct from doctor’s own **SCR-07**.

**FLO-02 Move:** skip step 1; read-only doctor header only; start at calendar.

---

## Booking wizard (one modal)

| Step | Content | SCR |
|---|---|---|
| 1 | Doctor profile | SCR-03 |
| 2 | Calendar | SCR-04 |
| 3 | Confirm | SCR-05 |

**Success:** small **alert / toast popup** (not a full wizard step, not a separate page) → then **SCR-06**.  
Concurrent refusal: error on step 3; stay in modal; return to step 2 for another slot. Slot not held while confirm open (R-03).

### SCR-04 Calendar UI

- **Two month grids** side by side (mobile: stacked or swipe).  
- **Time slots below** the months (not beside a single month).  
- Days outside rolling window / past: disabled.  
- Day legend: bookable with free slots · full/no free · day off · selected.  
- Only **free** slots as chips; duration = slot length.

Doctor **propose new time** may reuse the same picker pattern + same horizon; SCR-08/09 remain different screens.

---

## Patient cabinet — SCR-06 (dashboard)

After login home. No search bar on the dashboard.

**Desktop:** metrics/greeting full width → **left main** + **right widgets**.

**Left (main):**

1. Greeting + primary CTA → SCR-02  
2. Pending banner if any `Reschedule Pending` → SCR-12  
3. Next appointment (actions by status)  
4. Mini-calendar for the **rolling bookable window** (dots = this patient’s visits)  
5. Upcoming list (overflow: show all on page)  
6. **Favourites** — horizontal carousel (heart-saved doctors)  
7. **Recently viewed** — last **10** unique doctor profile opens (carousel; hide if empty)  
8. Specialty cards → SCR-02  
9. Past appointments (compact) — each row without a review yet: CTA **Залишити відгук** → review modal (see Price, rating, reviews). After submit: show **Ваш відгук** (read) on that row; edit/delete still Open.

**Do not** add a third “doctors from past visits” carousel (too similar).

**Right column:**

1. **Reminder** widget — only if Upcoming **today or tomorrow**; CTA view that visit; hide otherwise. (Dashboard soft-reminder; not R-10 bell history.) Pending stays the separate banner.  
2. **New doctor** promo — **one** newest/random new doctor + Book → wizard step 1; hide if none.  
3. **Instruction** → SCR-02  

Mobile: right column under greeting (reminder → promo → instruction), then left content.

Empty overall: CTA + specialties + empty copy; hide favourites/recent until data exists.

Out: medical card, chat, prescriptions, invite-friends. (Read ratings/reviews on doctor cards / SCR-03; **write** from SCR-06 Past row → modal. Optional right-column **Мої відгуки** may only summarize counts / pending and jump to Past — it is not a second write form.)

---

## Doctor cabinet — SCR-08 (dashboard)

After login home. Propose-new-time **inline** (not a new SCR).

**Top:** greeting + date · **four metrics** (full width): visits today · pending · free slots today · cancellations last **7 days**.

**Left (main):** day navigation (week strip **or** mini-calendar — **Open**) · **next visit** hero · time-ordered visit list · actions (complete / cancel one / propose) · overflow “show all”.

**Right column:**

1. Reminder — next / soon visit (same pattern as patient)  
2. Free windows today (short honest list) + link SCR-09  
3. Pending patients awaiting reply (1–3 rows)  
4. Quick links: My schedule · My profile  

No finance/checkout, chat, video start. (Own rating summary on SCR-08 optional later — not required this pass.)  
Paper experiment (reference): https://app.paper.design/file/01M0WSHTTHBHN1910GVTJ72BB5

---

## Favourites

- Heart on doctor cards / SCR-03.  
- Stored on the patient account.  
- Section on SCR-06.  
- Guest cannot favourite without login.

---

## SCR-07 My profile (patient + doctor)

**Default = view** (not a perpetual form). **Edit** on the **same page** → Save / Cancel back to view.

**View:** photo/avatar hero · name · role badge · read-only sections.  
**Edit:** only allowed fields as inputs. Password change still Out.

Patient editable: name, phone, email, DOB, home city/clinic.  
Doctor editable: name, phone, email, city/clinic, photo.  
Doctor read-only here: specialty, years, license on file. Hours/price/format → SCR-09.

Logout available (also in avatar menu).

---

## Unchanged product rules

R-01 roles and isolation · R-02 statuses · R-03 honest slots / double-booking · R-04 format · R-05 duration (freeze window = rolling month) · R-06/R-07 cancel & reschedule · R-08 hours (zones = rolling month + 3 months) · R-10 bell · R-11 i18n/theme (placement updated above) · FLO-03/04/05/06 meaning.

SCR-10 = bell on existing pages.  
SCR-12 = pending decision — still required (UI pass later).  
**SCR-01** deep redesign — deferred this pass.

---

## Still open

- Exact header CTA label (**doctor** button yes/no) — **patient** CTA locked as **«Знайти лікаря»** / mobile **«Знайти»** on SCR-02  
- Full specialty list (more than four)  
- Privacy/Terms SCR IDs vs static routes  
- Legal page copy  
- SCR-08 day nav: week strip vs mini-calendar  
- Why Manrope (short rationale for stakeholders)  
- Review authorship rules + moderation  
- Promo price setup UX on SCR-09  

~~Banner final art/copy on SCR-02~~ — locked with Paper SoT + `docs/brand/hero/scr02-hero-doctor-lika.png` (27 Aug 2026).

---

## Spec follow-up

1. ~~`ia-chrome-decision.md`~~ (this file)  
2. `product-spec.md` — apply horizon, homes, dashboards, wizard, chrome, favourites, profile view/edit  
3. `frontend-spec.md` / `design-spec.md` / `backend-spec.md` — layer pass (Medicly, Manrope, contracts)  
4. **Next visual screen after SCR-02 lock:** cabinets **SCR-06 / SCR-08** (then wizard SCR-03…05)

**Paper (Medicly):** https://app.paper.design/file/01M0D5RXPB3F6XJZ814DFZDMEZ — **SCR-02 page locked FINAL** (27 Aug 2026). Older Likaro artboards on other pages remain superseded for chrome/brand.
