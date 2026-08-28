# Specs

Product and technical specifications for the digital healthcare booking platform.

| File | Purpose | Priority |
| --- | --- | --- |
| [product-spec.md](./product-spec.md) | Base product rules (R / SCR / FLO) | Default source of truth |
| [ia-chrome-decision.md](./ia-chrome-decision.md) | Agreed IA / chrome / dashboards / wizard / horizon (26 Aug 2026) | **Wins on its override map** — use this for drawing those areas |
| [frontend-spec.md](./frontend-spec.md) | UI per screen ID | After product + IA overlay |
| [backend-spec.md](./backend-spec.md) | Server / API per screen ID | After product + IA overlay |
| [design-spec.md](./design-spec.md) | Visual system | Older Likaro chrome superseded where IA decision says so |

**Drawing:** open `ia-chrome-decision.md` first (incl. **MUI + responsive** rules); use `product-spec.md` for honesty rules and anything not overridden.

**Paper visual locks:** **SCR-02 Search and results** — FINAL (27 Aug 2026). File: https://app.paper.design/file/01M0D5RXPB3F6XJZ814DFZDMEZ (page 04). Next draw: SCR-06 / SCR-08.

Frontend/backend must reuse the same IDs and matching **Contract** blocks. Skill: `write-layer-spec`.
