# Agent handoff — Product spec

Use this if a **new agent** continues. Product spec is **complete**. Do not start application code from this file.

## What this project is

Web-only doctor **booking** platform. Brief: `docs/briefihormaryna.pdf`. **Spec wins:** `docs/spec/product-spec.md`.

## Done

Shared rules **R-01 … R-13**. Screens **SCR-01 … SCR-10**, **SCR-12**. **SCR-11** / **R-09** out of MVP. Flows **FLO-01 … FLO-06**.

Opens resolved: GDPR **out**; auto-complete at slot **end**, pending does **not** auto-complete; new-doctor photo = **placeholder**, upload on **SCR-07**; default price **600 UAH**.

## Next

Fill **frontend-spec.md** and **backend-spec.md** (same IDs). Skill: `write-layer-spec`. Two branches, one file each.

## Hard rules (do not weaken)

- Two roles; login email+password; one email one role.
- Bookable **14 days**; doctor sees **3 months** with **no bookings** after 14 days.
- One doctor, one timeline (MVP). Double-book impossible.
- Statuses: Upcoming, Reschedule Pending, Completed, Cancelled, Rescheduled. No-show out.
- Completed = doctor mark **or** auto after **slot end**. Pending does not auto-complete.
- In-app bell; stay until read.
- Default price **600 UAH**; frozen 2 weeks; edit from day 15.
- GDPR out of MVP. Do not invent slot DB in the product spec (backend spec **may** choose the mechanism).
