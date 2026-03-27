# System 5 — Schedule Recommendation

Always output 3 ranked slots. Never just one.
Always label confidence and data source on each slot.

---

## Data Sources — Apply in Priority Order

### Priority 1 — Own Velocity Data
Available: after 4+ Shorts published and logged
Source: `memory/timing-model.md` → Slot Performance section
Signal: which day+hour slots produced above-average 48h views
Confidence: medium at 2 data points, high at 4+

### Priority 2 — YouTube Analytics Heatmap
Available: after channel has meaningful traffic
Query:
```
GET youtubeanalytics.googleapis.com/v2/reports
?ids=channel==MINE
&metrics=views
&dimensions=day,hour
&startDate={30_days_ago}
&endDate={today}
```
Find darkest blocks (highest views per hour).
Apply 2–3 hour pre-peak rule: upload BEFORE the peak, not at it.
If API returns auth error: fall back silently to Priority 3.

### Priority 3 — Competitor Timing Inference
Available: always, from day 1
Source: `memory/competitor-scans.md` → publishedAt timestamps of outliers
Method: group by day+hour bucket, rank by count of outliers
No private competitor data needed — this is all from public timestamps

### Priority 4 — Niche Benchmarks
Available: always, pure fallback
Shorts peak scroll times: 08:00–10:00 and 19:00–22:00 local time
Best days generally: Thursday, Friday
Upload 2–3 hours before peak windows
Label explicitly as "general benchmark — low confidence"

---

## Timezone Handling

Get PRIMARY_TIMEZONE from USER.md.
If not set, infer from:
- Channel geography (Analytics API if available)
- AUDIENCE description in USER.md
- PRIMARY_LANGUAGE: Greek → EET/EEST, English US → EST, English UK → GMT

Always show times in the creator's local timezone.
Store schedule timestamps in ISO 8601 with offset for API calls.

---

## New Channel Protocol

When channel has zero own performance data:
- Use Priority 3 as primary source
- Use Priority 4 as third slot fallback
- Add this message to every recommendation:
  "Using competitor timing data — confidence grows after
  your first 6 Shorts when I have your own velocity data."

---

## Output Format

```
## Schedule recommendation — "{video title}"

Slot 1 (recommended): {Day} {Time} {timezone}
Based on: {specific reason — e.g. "6 competitor outliers dropped Thu 09:00–11:00"}
Confidence: {high / medium / low}

Slot 2: {Day} {Time} {timezone}
Based on: {specific reason}
Confidence: {medium / low}

Slot 3: {Day} {Time} {timezone}
Based on: {general benchmark — low confidence}
Confidence: low

{If new channel}: add the competitor-data disclaimer.

Which slot works for you? (1 / 2 / 3 / or give me a different time)
```

---

## After User Picks

Convert chosen slot to ISO 8601 with timezone offset.
Confirm with user before proceeding:
"Scheduling for {Day} {Date} at {Time} {timezone} ({UTC equivalent}).
Confirm? (yes / change time)"

Pass confirmed timestamp to System 6 for upload.
Log slot to `memory/timing-model.md` — update after 48h performance is known.
