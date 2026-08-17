# Backend specification

**Status:** Frame  
**Source of truth:** [product-spec.md](./product-spec.md)  
**Pair file:** [frontend-spec.md](./frontend-spec.md) — **Contract** blocks must match.

This file describes **server behaviour**: who is allowed, appointment lifecycle, slot honesty, seed, and what each screen needs from the API. Pixel layout belongs in the frontend spec.

How to fill: shared model first (accounts, statuses, slots), then one `SCR-*` at a time. Approve before the next. Use skill `write-layer-spec`.

---

## Shared (fill before screens)

### Accounts and auth

TBD — product **R-01**, **SCR-01**

### Appointment state machine

TBD — product **R-02**, **R-06**, **R-07**

### Slots and double booking

TBD — product **R-03**, **R-13**. Here you **may** choose the mechanism (the product spec did not).

### Seed

TBD — product **R-12**

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

TBD

---

## SCR-02 Search and results

TBD

---

## SCR-03 Doctor profile

TBD

---

## SCR-04 Calendar

TBD

---

## SCR-05 Confirm booking

TBD

---

## SCR-06 My appointments

TBD

---

## SCR-07 My profile

TBD

---

## SCR-08 Doctor’s day

TBD

---

## SCR-09 Doctor’s working hours

TBD

---

## SCR-10 In-app notifications

TBD — product **R-10**

---

## SCR-11 Doctor performance

**Out of MVP.** Do not fill.

---

## SCR-12 Reschedule pending

TBD

---

## FLO-01 … FLO-06

TBD — server walkthroughs (who writes what, which invariants). Product flows stay in product-spec.md.
