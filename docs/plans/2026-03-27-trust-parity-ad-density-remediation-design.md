# Trust Parity And Ad Density Remediation Design

## Why this batch exists

The content rewrite program is effectively complete, but AdSense review risk has shifted to site-level trust and monetization signals. Two root problems now matter more than copy quality:

- live trust routes are not guaranteed to match the repo
- ad loading is too easy to leave enabled across high-visibility surfaces during review

This batch should reduce approval risk without weakening the site's long-term ability to monetize later.

## Design goals

- Make ads opt-in, not opt-out
- Make review-safe ad posture the default
- Add live verification for trust routes and monetization exposure
- Document the deployment and verification workflow clearly

## Recommended approach

1. Add explicit ad-enable flags in site config instead of enabling ads whenever a client id exists.
2. Gate AdSense and Funding Choices loading behind that explicit enable state.
3. Stop emitting misleading fallback ad publisher data when no real publisher id is configured.
4. Add a post-deploy verification script that checks trust routes and ad exposure on representative pages.
5. Update README and environment examples so the safer workflow is the documented default.

## Key decisions

### Ads should be disabled by default

The current behavior lets ads appear whenever env vars are present. For a review-sensitive site, that default is backwards. The safer default is:

- no ad script unless `PUBLIC_ENABLE_ADS=true`
- no slot rendering unless the placement is explicitly enabled

### Trust parity should be checked live, not assumed from local build

The live `editorial-policy` 404 already proved that local presence is not enough. The workflow needs an automated live check that can fail loudly after deploy.

### Keep monetization recoverable

The design should not rip out ad support. It should keep all placements recoverable through env flags once approval and trust parity are secure.

## Success standard

This batch is successful when:

- ads are review-safe by default
- trust pages can be live-verified with one script
- the repo documentation tells operators exactly how to keep live parity and low-density monetization during review
