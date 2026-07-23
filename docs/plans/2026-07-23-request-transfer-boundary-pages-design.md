# Request And Transfer Boundary Pages Design

**Goal:** Reduce broad-guide overlap by making the request and transfer boundary pages own distinct jobs in the site hierarchy.

**Architecture:** Keep all four pages and preserve the current `noindex,follow` posture where it already exists. The request hub remains a lightweight router, request-based pricing remains the generic billing-math explainer, network transfer remains the path-classification parent, and egress remains the AWS outbound-transfer diagnosis page after the path is likely known.

**Tech Stack:** Astro guide pages, generated guide metadata, Node test runner, existing guide layout.

---

### Scope

- `src/pages/guides/requests-costs.astro`: request routing hub.
- `src/pages/guides/request-based-pricing.astro`: generic request pricing explainer.
- `src/pages/guides/network-transfer-costs.astro`: transfer path boundary parent.
- `src/pages/guides/egress-costs.astro`: AWS egress diagnosis and billing workflow.

### Roles

- `requests-costs`: route users to the right request guide or calculator; do not teach the whole workflow.
- `request-based-pricing`: explain generic billable-request math; do not own service-specific measurement or parent workload modeling.
- `network-transfer-costs`: classify transfer paths before pricing; do not act like an AWS egress guide.
- `egress-costs`: diagnose AWS outbound transfer charges after the path likely belongs to egress; do not replace the network transfer parent.

### Quality Risks

- Broad pages can look duplicated even when each contains useful content.
- A noindex routing hub can still hurt quality if it reads like a thin copy of the main guide.
- The network transfer parent and AWS egress guide can blur if both open with the same "transfer costs explained" promise.
- Repeated paragraphs inside the request explainer can make the page feel assembled rather than edited.

### Design Decision

Use a small copy-and-test batch. We will not delete pages, change routes, or change calculator behavior. We will add explicit role statements, remove obvious duplicate copy where it weakens originality, and strengthen handoffs between broad parent pages and narrower workflow pages.

### Success Criteria

- Each page contains a clear role phrase and a clear exclusion phrase.
- `requests-costs` remains `noindex,follow`.
- `network-transfer-costs` and `egress-costs` both state when to hand off to the other page.
- The request explainer no longer repeats the same role paragraph twice.
- Focused and full verification passes before commit.
