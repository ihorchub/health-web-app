# Likaro — Calm Clinical Design Specification
**For Paper UI. Content source of truth: `docs/spec/frontend-spec.md`. Do not invent product behaviour.**

Artboard size: **1440×900**. Ukrainian on all default artboards. One English proof: **SCR-02**. Draw **Light and Dark** for every listed artboard. Each of the **9 required SCR screens** is a separate artboard. Do not decide modal vs popup vs drawer vs page.

**Visual production order (do not skip ahead):** Foundation in Paper → Lika mascot system → Likaro logo → SCR-01 → … → SCR-09. This spec is the source of truth. Do not copy Figma v0 screens. Do not crop, trace, or reuse pixels from the mascot reference sheet.

---

## 1. Global Design Direction

| Item | Value |
|---|---|
| Product | Likaro |
| Visual direction | Calm Clinical only |
| Primary language | Ukrainian |
| Secondary language | English (switch visible; EN proof = SCR-02) |
| Font | IBM Plex Sans (Latin + Cyrillic) |
| Logo | Likaro wordmark + compact Lika-head mark (§1.2) |
| Mascot | Lika — one original owl character (§4). Reference sheet = direction only |
| Themes | Light + Dark, both fully designed |
| Starting point | This spec. Existing Figma Foundation hex/type/radius are approved values, not layouts to copy |

### 1.1 Brand / color hierarchy (locked)

| Role | Color | Light | Dark | Not |
|---|---|---|---|---|
| **Brand / base** | Navy | `#163E52` | `#0F2A38` | Not the primary UI accent. Not CTA fill. |
| **Primary UI accent** | Green | `#2EB191` | `#3EC4A3` | — |
| **Secondary UI accent** | Soft pink | `#E8C5C0` | `#C9A39E` | Never page bg. Never primary button. |
| Character only | Amber | beak / feet on Lika | same | Not a UI token. No extra accent palette. |
| Character only | Warm brown | Lika eyes | same | Not a UI token. |

Navy is brand/base. Green is the primary UI accent. Pink is the secondary accent. Do not add another accent family (no teal, royal blue, mint, or Warm Human Care pink-as-brand).

### 1.2 Likaro logo

- **Product name / wordmark:** Likaro (no “Medi”, no “Medicly”).
- **Type:** IBM Plex Sans only. Same family as the UI.
- **Wordmark color:** navy brand/base (`#163E52` Light / `#0F2A38` Dark). On navy brand blocks, use existing on-brand text `#F3F7F8`.
- **Primary accent detail:** green (`#2EB191` / `#3EC4A3`) — small, not a second wordmark color.
- **Optional secondary detail:** soft pink, subtle only. Omit if it competes with green.
- **Compact app mark:** simplified **Lika head** (cream face, navy support, green as a tiny accent). Not a heart+cross. Not a letter L. Must read as the same owl as the mascot at 24–32px.
- **Light / Dark:** two versions of the same construction; do not invent a royal-blue or mint identity for Dark.
- Logo, UI, and Lika belong to one Calm Clinical system.

Do not draw the logo until the mascot system exists (production order above).

---

## 2. Global Design System

Hex values below are unchanged. Names are semantic roles only.

### 2.1 Colors

| Token | Light | Dark |
|---|---|---|
| **brand / navy** | `#163E52` | `#0F2A38` |
| **on-brand text/icons** (on navy blocks) | `#F3F7F8` | `#D7E4EA` |
| **muted supporting** (meta, reserved slot text) | `#5B7380` | `#8FA3AD` |
| **primary UI accent (green)** | `#2EB191` | `#3EC4A3` |
| **secondary UI accent (soft pink)** | `#E8C5C0` | `#C9A39E` |
| **page background** | `#F2F4F6` | `#0B1C24` |
| **surfaces / cards** | `#FFFFFF` | `#143445` |
| **elevated / overlay** | `#FFFFFF` | `#1A4254` |
| **primary text** | `#163E52` | `#F3F7F8` |
| **secondary text** | `#6B7C86` | `#A8B8C0` |
| **borders** | `#D5DDE2` | `#2A5366` |
| **success** (same hex as green accent) | `#2EB191` | `#3EC4A3` |
| **error** | `#C45C5C` | `#E07A7A` |
| **disabled fill** | `#E8EEF0` | `#1E3A48` |
| **disabled text** | `#9AA8B0` | `#6A7F88` |
| **selected** | fill `#2EB191`, text `#FFFFFF` | fill `#3EC4A3`, text `#0B1C24` |
| **focus ring** | `#2EB191` 2px + 2px offset | `#3EC4A3` 2px + 2px offset |
| **free slot** | bg `#FFFFFF`, border `#2EB191`, text `#163E52` | bg `#143445`, border `#3EC4A3`, text `#F3F7F8` |
| **taken slot** | bg `#E8EEF0`, border `#D5DDE2`, text `#9AA8B0`, not clickable | bg `#1E3A48`, border `#2A5366`, text `#6A7F88` |
| **reserved slot** | bg `#E8F1F4`, border `#163E52` 1px dashed, text `#5B7380` | bg `#1A3F50`, border `#8FA3AD` dashed, text `#8FA3AD` |

**Where to use what**
- **Navy:** wordmark, auth left panel, profile CTA bar, calendar footer, compact-mark navy feathers. Not primary buttons.
- **Green:** primary buttons, selected dates, free/selected slots, success, focus, active filters, Upcoming badge outline, Lika medallion.
- **Soft pink:** selective UI only — photo rings (SCR-03), specialty chip inactive wash, meta wells, “today” captions, card hover wash, empty-state wash, unread pip, Reschedule Pending badge, optional tints. Rare blush on Lika only. Never page background, never primary button, never instead of navy blocks.

### 2.2 Typography — IBM Plex Sans

| Role | Size / line-height | Weight |
|---|---|---|
| H1 | 32 / 40 | 700 |
| H2 | 24 / 32 | 600 |
| H3 | 18 / 26 | 600 |
| Body | 16 / 24 | 400 |
| Small / meta | 13 / 18 | 400 |
| Labels | 13 / 18 | 500 |
| Buttons | 16 / 24 | 500 |
| Overline (auth kicker) | 12 / 16 | 500, tracking +0.06em, uppercase |

Letter-spacing: default 0 except overline. No other typeface.

### 2.3 Radius

| Token | px |
|---|---|
| Small | 8 |
| Medium | 12 |
| Cards | 20 |
| Large (auth shell, bottom bars) | 28 |
| Pills | 999 |

### 2.4 Borders

| State | Light | Dark |
|---|---|---|
| Default | 1px `#D5DDE2` | 1px `#2A5366` |
| Active / selected | 1.5px `#2EB191` | 1.5px `#3EC4A3` |
| Focus | 2px `#2EB191` + 2px offset gap | 2px `#3EC4A3` + 2px offset gap |
| Disabled | 1px `#E8EEF0` | 1px `#1E3A48` |
| Error | 1.5px `#C45C5C` | 1.5px `#E07A7A` |

### 2.5 Shadows (separate per theme)

**Light**
- Card: `0 1px 2px rgba(22,62,82,0.06), 0 8px 24px rgba(22,62,82,0.06)`
- Elevated / overlay / dropdown: `0 8px 28px rgba(22,62,82,0.14)`
- Header: none (border-bottom 1px `#D5DDE2`)

**Dark**
- Card: no light-style grey shadow. Elevation = surface `#143445` on page `#0B1C24` + 1px border `#2A5366`
- Elevated / overlay: `0 12px 32px rgba(0,0,0,0.55)` + surface `#1A4254` + 1px `#2A5366`
- Do not copy Light shadow values onto Dark.

### 2.6 Buttons

| Type | Light | Dark |
|---|---|---|
| Primary | bg `#2EB191`, text `#FFFFFF`, radius pill | bg `#3EC4A3`, text `#0B1C24` |
| Secondary | bg transparent, border `#D5DDE2`, text `#163E52` | border `#2A5366`, text `#F3F7F8` |
| Ghost / text | no fill, no border, text `#2EB191` | text `#3EC4A3` |
| Disabled | fill `#E8EEF0`, text `#9AA8B0`, no hover | fill `#1E3A48`, text `#6A7F88` |
| Hover (primary) | bg `#279E80` | bg `#4FD0B0` |
| Active (primary) | bg `#1F8A70` | bg `#2EB191` |
| Hover (secondary) | border `#2EB191`, text `#163E52` | border `#3EC4A3`, text `#F3F7F8` |
| Active (secondary) | same as hover, 1.5px border | same |
| Hover / active (ghost) | text stays green; no fill | same |
| Logout | ghost using **error** text (`#C45C5C` / `#E07A7A`), not green | same |
| Height | 48px default; 40px compact (cards) | same |

### 2.7 Inputs

Height 48px, radius medium (12), label above.

| State | Light | Dark |
|---|---|---|
| Default | bg `#FFFFFF`, border default | bg `#143445`, border default |
| Hover | default + slightly stronger border (same border hex, 1.5px) | same |
| Focus | green focus ring (2px + 2px offset) | same |
| Filled | same as default, value in primary text | same |
| Error | error border + 13px error text under field | same |
| Disabled | disabled fill/text | same |

Placeholder = secondary text.

### 2.8 Cards

Radius 20. Padding generous; one elevation level for list/profile cards.

| State | Light | Dark |
|---|---|---|
| Default | `#FFFFFF` + Light card shadow | `#143445` + 1px `#2A5366`; no Light shadow |
| Hover | 8–12% soft-pink wash over surface; keep navy/green type | same wash on `#143445`; not a pink fill |
| Disabled | disabled fill; no hover | same |

### 2.9 Pills / badges

Radius pill (999). Format badges: Онлайн / Офлайн / Обидва — read-only, muted/neutral (border `#D5DDE2` / `#2A5366`, secondary text). Not toggles.

**Appointment status (existing tokens only)**

| Status | Treatment |
|---|---|
| Upcoming | green outline (`#2EB191` / `#3EC4A3`), transparent fill, primary text |
| Reschedule Pending | soft pink fill/wash + pink-tinted text/border (`#E8C5C0` / `#C9A39E`) |
| Completed | muted/neutral (disabled or secondary text + default border) |
| Cancelled | error outline/text (`#C45C5C` / `#E07A7A`) |
| Rescheduled | muted/neutral (same family as Completed) |

Who cancelled: meta text `пацієнт` / `лікар`. Zone A / Zone B: navy outline vs muted — not a new hue.

### 2.10 Appointment slots

Pill, in a grid. Legend: Вільно / Зайнято / Зарезервовано.

| State | Clickable | Visual |
|---|---|---|
| Default / free | yes | free-slot tokens |
| Hover (free) | yes | stronger green border |
| Selected | yes (only one) | selected token (green fill) |
| Taken | no | taken-slot tokens |
| Reserved | no | reserved-slot tokens (dashed) |
| Disabled / past | no | taken styling |
| Error | n/a | not used on slots; form errors use error border |

---

## 3. Shared Components

**Header (logged-in)**  
Left: Likaro wordmark + compact **Lika-head** mark (24–32px). Not a full-body owl.  
Right, in order: UK | EN switch (active = filled green chip), theme toggle (sun/moon + short label), bell, nav links: Пошук (patient) or Мій день (doctor), Мої записи (patient) / Графік (doctor), Профіль.  
SCR-01: no bell, no role nav — only language + theme.

**Search field**  
Full-width in filter bar. Magnifying glass left. Placeholder: `Спеціальність, лікар або клініка`.

**Filter block**  
One surface card: search | city select | clinic select | date | format segmented **Офлайн | Онлайн**. Active filter = green. Result count under bar: `N лікарів знайдено`.

**Doctor card (SCR-02)**  
No photo (photo is SCR-03 only). Row: name (H3) + `specialty · clinic` + pin + `city · N років досвіду` | **nearest available time required** (`Найближчий час:` + clock + localized datetime) | **two actions**: secondary `Профіль` → SCR-03; primary `Записатися` → SCR-04. No price. No ratings.

**Specialty chip (not a home grid)**  
Four chips only: сімейний лікар, кардіолог, дерматолог, педіатр. Inactive may use a light pink wash; active = green selected token.

**Date selector**  
Horizontal 14-day strip. Selected = green fill. Past / beyond 14 days = disabled. Day off = muted, not selectable. `Сьогодні` caption may use soft pink.

**Notifications (SCR-10 on existing screens, not a 10th required screen)**  
Bell with unread pip (pink allowed). Open list: unread items only; **Прочитати все**. Click item = read and item disappears. Empty list: short copy + Lika Message pose. No read-history.

**Empty states**  
Centered: Lika (80–120px) + H3 + body. Optional soft-pink wash behind mascot. Never a blank page.

**Loading**  
Skeleton cards **or** Lika Loading pose + `Завантаження…`. Primary button spinner when submitting.

**Mascot slots**  
See §4. Never overlap form controls.

---

## 4. Mascot — Lika

**Do not illustrate Lika in Paper yet.** This section is the brief for a later original drawing.

**Reference vs deliverable**  
The attached owl sheet is **direction only** (calm, professional healthcare owl). Paper/agents must **draw a new original Lika**. Do not extract, crop, trace, or paste the reference.

**One character**  
Name **Lika**. Species: owl. The **same** character in every pose — same proportions, face, medallion, colors. Do not design a different owl per screen.

**Style**  
Modern healthcare product. Clean digital/vector. Friendly, intelligent, calm, mature, approachable, polished. Not childish, not chibi, not toy-like, not overly 3D, not a pink blob.

**Color hierarchy on the character**
- **Main light areas (face, chest):** warm cream / off-white — this is the largest readable mass. The owl must **not** read as a blue mascot.
- **Base / supporting feathers:** navy (`#163E52` / `#0F2A38`) — support only, not the whole silhouette.
- **Primary mascot accent:** green (`#2EB191` / `#3EC4A3`) on a **small chest medallion / medical detail**. Same medallion every pose. No scarf. No collar.
- **Eyes:** warm brown. Not amber.
- **Beak and feet:** amber only.
- **Secondary accent:** soft pink (`#E8C5C0` / `#C9A39E`) very sparingly (e.g. faint blush). Not clothing, not the body.

**Assets**  
Transparent background on every pose. Same visual language at all sizes.

**Required poses (document now; draw later). All are Lika.**

| # | Pose | Action / prop | Placement |
|---|---|---|---|
| 1 | Welcome / Registration | wing raised, friendly greeting | SCR-01 brand panel |
| 2 | Searching | magnifying glass | SCR-02 empty search |
| 3 | Availability / Calendar | calendar / available-appointment context | SCR-04 default / availability context (with slots) |
| 4 | Loading | looking at a wristwatch / clock | loading on any screen |
| 5 | Success | wings slightly open + subtle **green** confirmation/check | document only; **no** success SCR; **no** extra screen |
| 6 | Empty Calendar | calendar; calm / sympathetic | SCR-04 empty day, SCR-06 empty list, SCR-08 empty day |
| 7 | Message / Notification | envelope | notification empty |
| 8 | Rest / Take Care | calm resting pose | document only; placement later |

**Sizes**  
Auth panel: 120–160px. Empty/loading/calendar context: 80–120px. Header: compact Lika-head mark 24–32px only. Do not put the full owl on doctor cards.

**Light / Dark**  
Same character colors. Dark: sit on brand navy or elevated surface; optional moon in auth panel only. Do not recolor Lika to a mint-flat icon.

**Do not** invent extra owls, scarves, collars, laptops, costumes, or a second species. Do not place unused poses (Success, Rest) on new product screens.

---

## 5. Screens

Each of the 9 IDs below is a separate Paper artboard set. Do not decide chrome type (modal / popup / drawer / page). Do not add screens for Success or Rest poses.

### SCR-01 — Sign up / Log in
- **Layout:** Centered large card, split ~40/60. Left brand navy. Right form surface.
- **Header:** On form: UK/EN + theme. No bell.
- **Main content — Login artboard:** Tabs Вхід | Реєстрація (Вхід selected). H2 `Раді вас бачити`. Body subtitle. Fields: email, password. Primary `Увійти`. Ghost: `Немає акаунта? Створити`.
- **Sign up — Patient artboard:** Role picker Patient selected. Fields: first name, last name, city, clinic (disabled until city), DOB, email, password, phone. Primary `Зареєструватися`.
- **Sign up — Doctor artboard:** Role Doctor. Fields: first/last, city, clinic, specialty (4 options), years of practice, visit duration 20/30/45 (default 30), email, password, phone, license file upload. Primary `Зареєструватися`.
- **Left panel (all):** Overline `РЕЄСТРАЦІЯ / ВХІД`. H1 honest-booking line. Body supporting line. Lika Welcome 120–160px. Theme control may sit on brand panel.
- **Components:** tabs, inputs, primary button, role picker, file upload (doctor).
- **Actions:** Log in; Sign up; switch tab; language; theme.
- **States:** default; validation errors; server error; loading (button spinner).
- **Mascot:** Welcome pose, brand panel only. Not on the form.
- **Light/Dark:** Full split card both themes; no white flash on dark.

### SCR-02 — Search and results
- **Layout:** Page bg. Header. Title `Пошук лікаря` + subtitle. Filter card. Count. Vertical doctor cards.
- **Header:** Full logged-in patient header.
- **Main:** Filters per §3 (city/clinic default = patient home). Specialty chips optional row. 4–6 doctor rows. Each card: identity + **nearest available time** + `Профіль` + `Записатися`. **No doctor photo.**
- **Components:** header, search, filters, specialty chips, doctor cards.
- **Actions:** `Профіль` / identity → SCR-03. `Записатися` → SCR-04. Nav to SCR-06, SCR-07. Bell.
- **States:** default list; loading skeletons; empty (Lika + no matches); error.
- **Mascot:** Header compact mark; empty = Searching pose. Not on every result row.
- **Light/Dark:** Both. Also **one EN Light** duplicate of default list.

### SCR-03 — Doctor profile
- **Layout:** Header. Back `До результатів пошуку`. Two columns: photo + format badges | identity + stats + bio + CTA bar.
- **Header:** Patient logged-in.
- **Main:** Photo (rounded square; pink ring allowed) — **this is where the doctor photo lives**. Name H1. `specialty · clinic`. Stats: experience, price **600 грн** (unless seed says otherwise), address text + pin (**no map**). Format badges read-only (Both = two badges, not toggles). Bio short. Navy bar: nearest time + primary `Відкрити календар`.
- **Components:** tags, stats card, primary button, back link.
- **Actions:** open SCR-04; back to SCR-02.
- **States:** default; loading; not found.
- **Mascot:** header compact mark only.
- **Light/Dark:** both. Dark CTA bar = brand navy fill, green button.

### SCR-04 — Calendar
- **Layout:** Header. Back to profile. H1 `Оберіть дату та час`. Meta: 14 days; format chosen on next step. Doctor name · specialty. Date strip. Legend. Slot grid. Bottom navy bar.
- **Header:** Patient logged-in.
- **Main:** Duration visible (`Тривалість прийому: 30 хв` sample). Format **label** (supported formats), not a slot control. Grid of times. Mix free / taken / reserved. One selected slot on the “selected” artboard.
- **Components:** date selector, slots, legend, bottom bar.
- **Actions:** select free slot; `Продовжити до підтвердження` enabled only when selected → SCR-05. Disabled CTA when none selected.
- **States:** no selection (CTA disabled); slot selected; empty day; day off message; loading; full day.
- **Mascot:** Availability / Calendar pose on default/availability artboards (does not cover controls). Empty day = Empty Calendar pose. Header = compact mark. Loading = Loading pose if not skeletons.
- **Light/Dark:** both. Bottom bar uses Dark elevation rules when theme is dark.

### SCR-05 — Confirm booking
- **Layout:** Header. Back to calendar. One summary card. Reason field. Actions.
- **Header:** Patient logged-in.
- **Main:** Doctor, clinic + address, date + time (read-only), duration (read-only), format: if Both → Офлайн selected default + Онлайн; if one format → read-only label. Reason optional textarea (empty OK).
- **Components:** summary card, format control, textarea, primary `Підтвердити`, secondary back.
- **Actions:** Confirm; back (slot not held).
- **States:** default; loading; concurrent refusal (“цей час уже зайнятий”) + go pick another; generic error. **No success screen** — success navigation is SCR-06. Success **pose** is not drawn here.
- **Mascot:** header compact mark only.
- **Light/Dark:** both.

### SCR-06 — My appointments
- **Layout:** Header. H1 `Мої записи`. Two groups: **Майбутні** (`Upcoming` + `Reschedule Pending`) and **Минулі** (`Completed` + `Cancelled` + `Rescheduled`). Stacked sections. Status badges per §2.9.
- **Header:** Patient; nav back to search.
- **Main — default:** Upcoming rows with Move + Cancel. One Reschedule Pending row (original time, pending badge, action → pending decision, no independent Move). Past rows: no actions; cancelled shows who cancelled.
- **Row fields:** doctor, place, date, time, status, format, reason if any.
- **Components:** appointment rows, status badges, buttons.
- **Actions:** Move → SCR-04; Cancel; Pending decision (SCR-12 is not one of the 9 required artboards).
- **States:** default; empty all (Empty Calendar pose); empty upcoming only; loading; refusal.
- **Mascot:** empty all = Empty Calendar. Header compact mark otherwise. Do not use Success pose as a fake success screen.
- **Light/Dark:** both.

### SCR-07 — My profile
Draw **two** artboards (same ID): Patient | Doctor.

- **Layout:** Header. Form card + preferences + logout.
- **Header:** Logged-in; logout **on this screen** (button in form footer).
- **Patient content:** editable first, last, phone, email, DOB, home city, home clinic (seed dropdowns). Preferences: language, theme (must match header). Logout.
- **Doctor content:** editable first, last, phone, email, city, clinic, photo add/replace. Shown read-only: specialty, years of practice, license on file. Not here: duration, hours, format, price. Preferences + logout.
- **Components:** inputs, selects, photo upload (doctor), language/theme, primary Save, logout (error-colored ghost).
- **Actions:** Save; Logout.
- **States:** default each role; validation; loading save; success remains on same screen; refusal.
- **Mascot:** header compact mark only. Rest / Take Care is **not** placed here until later.
- **Light/Dark:** both (Light+Dark for each role).

### SCR-08 — Doctor’s day
- **Layout:** Header. H1 day title. Day nav (lands on **today**; 14-day window). Time-ordered visit list.
- **Header:** Doctor: Мій день, Графік (SCR-09), Профіль, bell, language, theme.
- **Visit row:** time, patient name, format, reason if any, status; if cancelled — who. Upcoming: `Завершити`, `Скасувати`, `Запропонувати інший час`. Final statuses: no actions. Reschedule Pending: original time; proposed time also shown as occupied/reserved styling; **no** complete/cancel/second proposal.
- **Propose state (same screen ID):** slot picker for a free time in 2-week window — not a new screen ID; a block on this artboard.
- **Components:** day selector, visit rows, badges, action buttons, optional slot picker.
- **Actions:** as status table in frontend spec. No no-show.
- **States:** default today with mix of visits; empty day; loading; refusal; propose picker open.
- **Mascot:** empty day = Empty Calendar. Header compact mark otherwise.
- **Light/Dark:** both.

### SCR-09 — Doctor’s working hours
- **Layout:** Header. H1. **Zone A** (next 2 weeks) vs **Zone B** (after 2 weeks to 3 months) clearly split.
- **Header:** Doctor chrome.
- **Main:** 3-month schedule. Zone A: hours/duration/price **frozen** (disabled inputs). Bulk cancel: scopes — whole day, rest of day, rest of week, custom range inside 2 weeks — plus **confirm** step. Vacation in A only if day has no bookings. Zone B: editable days, hours, lunch (default template Mon–Fri 09:00–18:00, lunch 13:00–14:00, weekend off), duration 20/30/45, format Offline only / Online only / Both, price default **600 грн** (applies from day 15). One timeline, not two calendars.
- **Components:** zone badges, calendar/week grid, frozen fields, duration select, format select, price input, bulk-cancel confirm.
- **Actions:** save Zone B; confirm bulk cancel; mark vacation when allowed.
- **States:** default (A frozen / B editable); bulk-cancel confirm; loading; refusal.
- **Mascot:** header compact mark only.
- **Light/Dark:** both. Frozen controls must look blocked, not merely grey text on an enabled field.

---

## 6. Light / Dark (all screens)

| Rule | Light | Dark |
|---|---|---|
| Page | `#F2F4F6` | `#0B1C24` |
| Cards | white + Light card shadow | `#143445` + border; Dark shadows only on overlays |
| Brand navy blocks (auth left, profile CTA, calendar footer) | `#163E52` | `#0F2A38` |
| Primary accent buttons | `#2EB191` | `#3EC4A3` |
| Soft pink | selective tints/rings/washes | muted `#C9A39E` tints; never full-page pink |
| Text | navy on grey/white; `#F3F7F8` on navy blocks | off-white on dark surfaces; `#D7E4EA` icons on navy |
| Theme control | visible, persisted | same |
| First paint | — | no white flash (dark surfaces from first frame) |
| Errors / empty / loading | fully themed | fully themed |
| Lika | cream-forward owl; navy support; green medallion | same owl; do not invert to a flat mint glyph |
| Logo | navy wordmark + Lika-head mark | Dark navy wordmark; same mark |
| Contrast | readable green CTAs and slots | accent on navy must stay readable |

Every screen in §5 gets Light + Dark unless noted (SCR-02 extra EN Light).

---

## 7. Out of scope

Do **not** draw:

- Warm Human Care or Smart Care System styles, palettes, or layouts
- Ratings, reviews, hearts-as-favorites, marketplace home
- Payments, checkout, insurance
- Maps / map view (address is text + pin only)
- Medical records, prescriptions, video links
- Native bottom tab bar as primary IA
- Extra product screens beyond the 9 required SCR artboards (including a Success screen)
- Forgot password, social login, password change, family profiles
- No-show action, doctor performance (SCR-11)
- Email/SMS/push
- “Medi” / “Medicly” branding; royal-blue identity; IBM Plex alternatives
- Parallel Online/Offline calendars
- Price on search cards; doctor photo on SCR-02; 900 грн as the default sample (use **600 грн**)
- Pink as the main brand color or as page/primary-button fill
- Navy as primary button fill
- Extra accent palette; amber or brown as UI colors
- Cropping/tracing the mascot reference; scarf/collar; laptop/processing owl; extra owl designs per screen
- Lika / logo / screens in Paper before this spec is approved and before the production order
