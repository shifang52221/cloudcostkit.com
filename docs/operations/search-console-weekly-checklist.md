# Search Console Weekly Checklist

Use this checklist once per week for CloudCostKit growth work.

## 1. Export the latest data

- Export Search Console page data for the last 3 months.
- Export Search Console query data for the last 3 months.
- Keep the search type consistent: `Web`.
- Save the export with the date in the folder name.

## 2. Refresh the core lists

Update these five buckets from the latest export:

- click-earning pages
- top-20 opportunity pages
- high-impression low-CTR pages
- support pages worth strengthening
- low-signal pages that can wait

## 3. Refresh the demand clusters

Review whether these clusters still deserve priority:

- CDN
- AWS egress
- EC2
- current commercial-intent guide topics

If a new cluster appears repeatedly in page and query data, add it to the priority list only after confirming the signal is real.

## 4. Choose this week's batch

Default batch size:

- 2 guide pages
- 2 calculator pages
- 1 site-level UX or internal-linking improvement

Choose pages in this order:

1. protect pages already earning clicks
2. improve pages already ranking in positions 8-30
3. improve high-impression low-CTR pages
4. expand only if the first three buckets are weak

## 5. Decide the kind of work

Pick the smallest useful intervention:

- query-intent alignment
- title and description tightening
- first-scroll clarity
- FAQ expansion
- stronger next-step links
- cluster-path or hub-page improvement

Do not default to creating new pages when an existing page already has signal.

## 6. Execute the batch

For each selected page:

- update title/description only if the wording is weak
- improve the first visible promise
- strengthen the best next-step links
- preserve page clarity for current click-earning intent

## 7. Verify before calling the batch done

Run:

- `npm run check`
- `npm run build`

Record whether either command produced:

- errors
- warnings
- non-blocking hints

## 8. Log what shipped

After the batch:

- list the edited pages
- note the query cluster each page supports
- note what kind of change was made
- record commit ids

## 9. Set up next week

Write down:

- pages that improved enough for now
- pages that still need another pass
- any newly emerging cluster
- one likely batch candidate for next week

## 10. Monthly checkpoint

Once per month:

- re-check homepage, `/calculators/`, and `/guides/`
- retire assumptions that no longer match live query wording
- refresh operating notes if priority clusters change
