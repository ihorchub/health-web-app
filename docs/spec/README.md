# Specs

Product and (later) technical specifications for the digital healthcare booking platform.

| File                                   | Purpose                                           | When                     |
| -------------------------------------- | ------------------------------------------------- | ------------------------ |
| [product-spec.md](./product-spec.md)   | One product specification. What the product does. | Source of truth — filled |
| [frontend-spec.md](./frontend-spec.md) | UI per screen ID                                  | After product spec       |
| [backend-spec.md](./backend-spec.md)   | Server / API per screen ID                        | After product spec       |

Frontend and backend specs **must** reuse the same IDs (`SCR-01`, `FLO-01`, …) and matching **Contract** blocks. Skill: `write-layer-spec`.

Suggested git split: two branches from the same commit; one edits only `frontend-spec.md`, the other only `backend-spec.md`.
