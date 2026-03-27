# System 1 — Competitor Scan

## When to run
- User says "scan competitors", "what's working in my niche", "competitor research"
- HEARTBEAT fires Monday 08:00
- User asks for ideas but last scan is older than 7 days

## Before running
Read USER.md for the COMPETITORS list and CHANNEL_ID values.
Read memory/competitor-scans.md to avoid re-reporting already known outliers.

---

## Step 1 — Fetch recent Shorts per competitor

For each competitor channel, call YouTube Data API v3:

```
GET /youtube/v3/search
?channelId={CHANNEL_ID}
&part=snippet,id
&type=video
&videoDuration=short
&order=date
&publishedAfter={30_DAYS_AGO_ISO8601}
&maxResults=50
&key={YOUTUBE_API_KEY}
```

Quota cost: 100 units per competitor. For 10 competitors = 1,000 units.
Stay within daily budget of 8,000 units.

If channel ID is unknown, resolve first:
```
GET /youtube/v3/channels
?forHandle={handle_without_@}
&part=id,snippet
&key={YOUTUBE_API_KEY}
```

## Step 2 — Get view counts and metadata

Batch the video IDs (up to 50 per call):
```
GET /youtube/v3/videos
?id={ID1,ID2,...}
&part=statistics,contentDetails,snippet
&key={YOUTUBE_API_KEY}
```

Quota cost: 1 unit per call.

Filter to actual Shorts: keep only videos where `contentDetails.duration`
parses to 65 seconds or less (ISO 8601: PT1M5S or less).

## Step 3 — Find outliers

For each competitor:
```
channel_avg = sum(all_view_counts) / count(videos)
outliers = videos where viewCount >= channel_avg * 2
```

## Step 4 — Extract timing intelligence

From each outlier's `snippet.publishedAt` timestamp:
- Extract day of week and hour (UTC)
- Convert to creator's PRIMARY_TIMEZONE from USER.md
- Record in timing data

## Step 5 — Aggregate timing patterns

Group all outliers by day+hour bucket (e.g. "Friday 08:00–10:00").
Rank buckets by count of outliers.
Top 3 buckets → candidate schedule slots.

---

## Output Format

```
## Competitor scan — {date}

### Outlier Shorts found

**{Channel name}**
- "{title}"
- Views: ~{X}K vs channel avg ~{Y}K ({Z}x outlier)
- Published: {Day} {Hour} {timezone}
- Hook type: {question / number / statement / contrast / POV}
- Format: {tutorial / story / reaction / transformation / POV}
- Why it worked: {1 sentence}

[repeat for each outlier]

### Timing pattern this scan
Top windows across all competitors:
- {Day} {Hour range}: {N} outliers dropped here
- {Day} {Hour range}: {N} outliers dropped here

### Angles you haven't covered
{3 ideas adapted from outliers for this niche and creator's voice}
```

## After Output

Append full results to `memory/competitor-scans.md` with date header.
Update `memory/timing-model.md` with new timing data points.
