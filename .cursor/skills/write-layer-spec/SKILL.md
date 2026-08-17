---
name: write-layer-spec
description: Writes frontend-spec.md or backend-spec.md from the approved product spec using the same SCR/FLO/R IDs. Use when creating or filling the frontend spec, backend spec, layer spec, UI spec, or API spec, or when splitting spec work between teammates.
---

# Write a layer spec (frontend or backend)

## Source of truth

1. Read `docs/spec/product-spec.md` first. It wins over `docs/project-context.md` and over this skill.
2. Reuse the same IDs: `R-*`, `SCR-*`, `FLO-*`. Do not invent new screens.
3. Do not contradict the product spec. If something is **Open** there, keep it **Open** here — do not invent.
4. Do not start application code in this workflow.
5. Fill **one** `SCR-*` (or shared `R-*` / `FLO-*`) at a time. Ask blocking questions. Wait for the user to approve before the next.

## Files

| File | Owner idea | Contains |
|---|---|---|
| `docs/spec/frontend-spec.md` | One teammate | Layout, states, copy/i18n, client validation, what the UI **shows** and **sends** |
| `docs/spec/backend-spec.md` | The other teammate | Authz, state machine, slot honesty, seed, what the API **accepts** and **returns** |

Git: prefer **two branches**, each touching **only its file**, from the same base. Do not both edit `product-spec.md` on those branches.

Client still wants **code** split by **surface** (patient vs doctor), not by layer. These two spec files are how you describe UI vs server. Implementation ownership can still be patient-side vs doctor-side later.

## Shared contract (must match)

Every `SCR-*` in **both** files must include the same **Contract** block (field names, not stack):

```text
### Contract
In: …
Out: …
Errors: …   (stable codes + meaning; EN/UK copy lives in frontend)
Auth: who may call this (patient / doctor / self only)
```

If frontend and backend contracts disagree, stop and align. Product spec wins.

## Frontend section template

```text
## SCR-XX Name
Product pointer: link to the same ID in product-spec.md
Contract (must match backend)
Layout / regions
States: default, loading, empty, error, success
Fields, actions, labels (EN + UK — or i18n keys)
Client-side checks (format only; server is source of truth)
Theme / mascot / bell notes if this screen is special
Out of scope
Open questions
```

Frontend must **not** decide: database schema, transactions, slot storage, JWT vs cookies.

## Backend section template

```text
## SCR-XX Name
Product pointer: link to the same ID in product-spec.md
Contract (must match frontend)
Who is allowed (per request, per object — hiding a button is not auth)
Commands / queries this screen needs
Invariants: R-02 statuses, R-03 one slot one patient, R-13 2-week bookable window
Errors (same codes as frontend Contract)
Out of scope
Open questions
```

Also fill, once, in the backend spec (not per screen): account model, appointment state machine, seed (R-12), booking concurrency (product rule only — you **may** now choose the mechanism).

Backend must **not** decide: pixel layout, font, mascot art, CSS.

## Hard product rules (copy into both specs, do not weaken)

- Two account types; login email+password; one email one role.
- Bookable window: 14 days; doctor calendar 3 months with **no** bookings after 14 days.
- One doctor, one timeline (MVP).
- Double booking impossible; calendars refresh by themselves (frontend: refresh behaviour; backend: the guarantee).
- Statuses: Upcoming, Reschedule Pending, Completed, Cancelled, Rescheduled. No-show out.
- In-app bell; unread until read then gone.
- SCR-11 / doctor score: out of MVP.
- GDPR / legal: out of MVP. Default price: **600 UAH**. New doctor photo: placeholder until **SCR-07**.

## Order

Same as product spec: SCR-01 → … → SCR-09, then SCR-12, then FLO-* as walkthroughs. Skip SCR-11. SCR-10 = R-10 bell, not a new app.
