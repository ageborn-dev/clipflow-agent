# YouTube API Quick Reference

## Quota Budget: 10,000 units/day free. Target: stay under 8,000.

| Call | Cost | Use for |
|---|---|---|
| `search.list` | 100 units | Finding Shorts for a competitor channel |
| `videos.list` | 1 unit | Getting view counts for known video IDs |
| `channels.list` | 1 unit | Resolving @handle to channel ID |
| Analytics `reports.query` | 1 unit | Audience heatmap, view velocity |

---

## Get competitor's recent Shorts
```
GET /youtube/v3/search
?channelId={ID}&part=snippet,id&type=video
&videoDuration=short&order=date
&publishedAfter={ISO8601_30_DAYS_AGO}&maxResults=50
&key={YOUTUBE_API_KEY}
```

## Get view counts (batch up to 50 IDs)
```
GET /youtube/v3/videos
?id={ID1,ID2,...}&part=statistics,contentDetails,snippet
&key={YOUTUBE_API_KEY}
```
Filter Shorts: keep only `contentDetails.duration` ≤ PT1M5S (65 seconds).

## Resolve @handle to channel ID
```
GET /youtube/v3/channels
?forHandle={handle_no_@}&part=id,snippet
&key={YOUTUBE_API_KEY}
```

## Audience activity heatmap (own channel)
```
GET youtubeanalytics.googleapis.com/v2/reports
?ids=channel==MINE&metrics=views&dimensions=day,hour
&startDate={30_days_ago}&endDate={today}
```
Requires OAuth `yt-analytics.readonly` scope — not just API key.
If auth fails: fall back to competitor timing data silently.

## 48h video performance (own channel)
```
GET youtubeanalytics.googleapis.com/v2/reports
?ids=channel==MINE&metrics=views,averageViewDuration,subscribersGained
&dimensions=day&filters=video=={VIDEO_ID}
&startDate={publish_date}&endDate={publish_date_plus_2}
```

## Error handling
- 403 quotaExceeded → stop, notify user, retry tomorrow
- 403 forbidden → check YOUTUBE_API_KEY in USER.md
- 404 channelNotFound → re-resolve handle
- 400 invalidPublishTime → ask user for a future time
- 503 → wait 5 min, retry once
