# API Request Calculator Content Depth Cleanup Design

## Why this exists

The API request cost calculator is a high-leverage page because many guides link to it as the generic request-math
destination. Right now, the page has real utility, but it still feels too fragmented and too generic:

- calculator metadata is serviceable, but the page framing is thin for such a central support route
- the prose body is split into many small sections that restate related ideas with different labels
- the page behaves like a utility matrix entry instead of a strong request-based billing workflow page

That is risky for site quality because this route is referenced across many pricing guides. If the generic support page
looks lightweight or templated, it weakens the credibility of the larger cluster around it.

## Options considered

### Option 1: Light-touch cleanup

Pros:

- low effort
- low rewrite risk

Cons:

- does not materially improve the page's perceived authority
- leaves too much of the "generic utility page" feeling

### Option 2: Demote the page further

Pros:

- reduces the risk of over-promoting a generic calculator

Cons:

- weakens the support path used by many provider-specific guides
- creates more pressure on dozens of other pages to explain request math themselves

### Option 3: Rebuild it as the site's generic request-billing workbench

Pros:

- keeps the page useful and defensible
- improves the role clarity for many linked guides
- reduces template feel by organizing the page around a real estimation workflow

Cons:

- requires deliberate editorial restructuring

## Recommended approach

Choose Option 3.

Keep the calculator itself, but rewrite the page so it clearly owns the generic request-pricing workflow:

- billable versus non-billable requests
- request classes and endpoint mix
- business-event-to-request conversion
- retries, preflight, polling, callbacks, and cache-hit separation
- validation against provider billing and handoff to transfer or egress tools

## Final design

### Scope

Modify only:

- `src/pages/calculators/api-request-cost-calculator.astro`

Add supporting docs under `docs/plans/`.

### Structural changes

Merge or remove overlapping page sections such as:

- billable requests
- API-specific request accounting
- worked request estimate
- API request taxonomy
- API data sources
- result interpretation
- common mistakes
- advanced inputs
- traffic scenarios
- validate after changes
- next steps

### Content direction

The revised page should read like a durable request-based billing workbench that helps users estimate and validate
generic request costs before moving into service-specific calculators or adjacent transfer tools.

### Success standard

This cleanup is successful when:

- the page has fewer but stronger sections
- the generic request-pricing role is clearer and more defensible
- request amplification and billable-request validation are easier to follow
- the page feels like a well-edited support destination rather than a template utility page
