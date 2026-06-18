# AWS WAF Pricing Refresh Design

**Context**

`aws-waf-pricing` is already a genuine bill-boundary page, but its first screen still reads like a compact checklist rather than a sharp AWS pricing destination. In the 2026-06-18 Search Console review, WAF remained one of the pages with meaningful impressions and little click conversion, which makes the title, intro, and first-screen pricing cues worth tightening.

The page should remain the AWS WAF bill-boundary page. It should not drift into:

- the `aws-waf-estimate-requests` measurement workflow page
- the `aws-waf-cost-optimization` production intervention page
- the broad `security-costs` parent page

**Goal**

Make the page answer AWS WAF pricing intent earlier by surfacing the actual billing structure before the existing model, evidence, and validation sections.

**User Intent Priority**

Approved direction: `price-structure first`

That means the first screen should make it obvious:

- what AWS WAF bills on
- how Web ACLs, rule groups, evaluated requests, and optional managed add-ons shape the bill
- which downstream logging and SIEM costs should stay beside the WAF bill

**Approach Options**

### Option 1: Price-structure first

Put a compact `Quick pricing read` near the top that explains Web ACL baselines, rule/rule-group exposure, evaluated requests, blocked traffic, and optional add-ons like Bot Control or CAPTCHA/Challenge, then separate WAF-native cost from downstream logging and analysis.

**Pros**

- Strongest match for the search query `aws waf pricing`
- Improves trust and clarity without changing the page role
- Keeps the page aligned with the rest of the current pricing-first batch

**Cons**

- Requires careful phrasing to avoid overlapping with attack-spike or optimization pages

### Option 2: Attack-peak first

Lead with the fact that attack windows multiply evaluated requests and logging costs.

**Pros**

- Strong for security operations
- Feels immediately practical

**Cons**

- Too close to the attack-spike specialist page
- Slightly weaker for raw pricing-intent searches

### Option 3: Estimation workflow first

Lead with the baseline + spike estimate flow and calculator handoff.

**Pros**

- Good for a user already inside modeling mode

**Cons**

- Weakest canonical pricing-page signal
- Risks sounding like a helper page rather than a pricing destination

**Decision**

Use **Option 1: price-structure first**.

This best matches the current user intent and keeps the page authoritative while preserving the existing specialist page cluster.

**Content Design**

The revised page should:

- update the title and description to mention the real WAF billing surfaces more directly
- add a `Quick pricing read` section near the top
- explain that AWS WAF pricing centers on Web ACLs, rules or rule groups, evaluated requests, and any optional security add-ons
- make clear that logging, storage, analytics, and SIEM belong beside the WAF bill, not inside it
- keep the baseline + spike estimate, evidence path, pitfalls, validation, and related-page routing

**Editorial Boundaries**

The page should continue to own:

- AWS WAF bill boundaries
- evaluated-request pricing
- baseline vs attack-window shaping
- downstream logging separation

The page should not absorb:

- the request-measurement workflow, which belongs to `aws-waf-estimate-requests`
- production mitigation, which belongs to `aws-waf-cost-optimization`
- broad security budget framing, which belongs to `security-costs`

**Testing Strategy**

Add or expand tests so the page is locked to the new first-screen pricing cues:

- `Quick pricing read`
- Web ACL / rule group / evaluated request language
- optional add-on or managed rule coverage language
- downstream logging / SIEM separation
- updated title and SERP promise

**Expected Outcome**

After the refresh, the page should feel more like a canonical AWS pricing page and less like a compact checklist, while still preserving the bill-boundary role that the WAF cluster depends on.
