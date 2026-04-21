# AWS Calculator Hub Repair Design

**Problem**

The live SEO audit on 2026-04-21 reports two remaining issues, both on `/calculators/aws/`:

- a bad internal link to `/guides/aws/`, which is intentionally `noindex,follow`
- an orphan-page signal because the indexed calculator entry surfaces do not link to `/calculators/aws/`

**Decision**

Keep `/calculators/aws/` as an indexed provider hub. It already acts as a useful routing page for AWS-specific calculator intent and should remain a real entry page rather than being downgraded to another helper route.

**Approach**

1. Replace the `/guides/aws/` link on the AWS calculators hub with links to real indexed guides that help users choose the next step by bill shape.
2. Add an explicit AWS provider-hub entry on `/calculators/` so the page receives a normal internal path from an indexed calculator overview.
3. Add regression tests to prevent the hub from linking back to the noindex AWS guide router and to ensure the calculators index continues to expose the AWS provider hub.

**Why this is the smallest correct fix**

- It resolves the actual audit root cause instead of papering over it.
- It avoids template churn across many pages.
- It preserves a useful AWS calculator hub for search and internal navigation.
- It keeps the noindex AWS guide router in its intended support role.
