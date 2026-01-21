# Content standards (indexable pages)

Goal: avoid thin pages and improve Google indexability by shipping pages that are **actionable**, **unique**, and **internally connected**.

## Minimum standard for new guides
- Clear intent: answer one specific query (pricing / estimate / optimize / compare).
- Structure: at least 5–7 meaningful sections (not filler).
- Actionability: include formulas, step-by-step workflow, decision table, or checklist.
- Evidence path: include “how to validate” (billing exports / metrics / logs).
- Pitfalls: include a dedicated pitfalls section (5+ concrete pitfalls when possible).
- FAQ: 3–6 real questions that cover long-tail variants.
- Internal links: link to 3–8 relevant calculators/guides and be linked back from the cluster hub.

## Minimum standard for calculator pages
CalculatorLayout already provides example / included / not included / how / FAQ sections. To avoid thin pages, add **page-specific prose** under the calculator widget:
- “How to get your inputs” (where the numbers come from)
- “Common mistakes” (what makes estimates wrong)
- “Validate” (what to check in billing/metrics after you implement changes)
- “Next steps” (links to a hub + 2–4 deep guides)

## Release workflow (per batch)
- Add a hub page that links the cluster (pricing / estimate / optimize / compare).
- Add 2–3 deep pages with unique workflows or checklists.
- Update related calculators to link the hub and the deep pages.
- Run `npm run check` + `npm run build` before pushing.

