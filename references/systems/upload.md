# System 6 — Auto Upload

Never upload without showing the pre-upload checklist and getting explicit "yes".

---

## Pre-Upload Checklist — Always Show This First

```
Ready to upload "{video title}"

Title: {selected title from SEO package}
Description: {first 2 lines}
Tags: {first 5 tags}
Hashtags: {hashtags}
Visibility: Scheduled — {chosen slot in local time}
Thumbnail: {attached / not provided}
Made for kids: No

Upload with these settings? (yes / change something)
```

Wait for explicit confirmation before proceeding.
If user says "change [X]" — update that field and show checklist again.

---

## Upload via Postiz (preferred path)

Check Postiz is connected:
```bash
postiz integrations:list
```
Look for YouTube with status `connected`.
If not connected → tell user to connect at postiz.com first.

Upload command:
```bash
postiz upload {VIDEO_FILE} \
  --platform youtube \
  --title "{SEO_TITLE}" \
  --description "{DESCRIPTION}" \
  --tags "{TAG1,TAG2,TAG3}" \
  --schedule "{ISO8601_DATETIME_WITH_OFFSET}" \
  --visibility private \
  --thumbnail "{THUMBNAIL_FILE}"
```

`--visibility private` keeps it hidden until scheduled time.
`--schedule` must be in ISO 8601 with timezone offset — e.g. `2026-04-03T10:00:00+03:00`.

---

## Upload via YouTube Data API (fallback if Postiz unavailable)

Tell user: "Postiz isn't available — trying direct YouTube upload."

Step 1 — Initiate resumable upload:
```
POST https://www.googleapis.com/upload/youtube/v3/videos
?uploadType=resumable&part=snippet,status
Authorization: Bearer {OAUTH_TOKEN}

Body:
{
  "snippet": {
    "title": "{title}",
    "description": "{description}",
    "tags": ["{tag1}", "{tag2}"],
    "categoryId": "22"
  },
  "status": {
    "privacyStatus": "private",
    "publishAt": "{ISO8601_DATETIME}",
    "selfDeclaredMadeForKids": false
  }
}
```

Step 2 — Upload video binary to the returned Location URL.
Step 3 — Upload thumbnail via `/thumbnails/set?videoId={ID}`.

---

## After Successful Upload

```
Done. Your Short is scheduled.

Video: {YouTube URL} (private until {publish time local})
Publishes: {Day}, {Date}, {Time} {timezone}

I'll remind you 30 minutes before it goes live.
After 48 hours I'll ask for performance stats.
```

Log to `memory/performance-log.md`:
```
## {video title} — uploaded {date}
YouTube URL: {url}
Scheduled slot: {day + time + timezone}
Upload date: {date}
Status: scheduled
48h stats: pending
```

---

## Error Handling

| Error | Action |
|---|---|
| Postiz auth expired | Tell user to re-auth at postiz.com |
| Upload failed | Retry once, then switch to direct YouTube API |
| Schedule time in the past | Ask user for a new time |
| File not found | Ask user to re-send the video file |
| YouTube quota exceeded | Wait 24h, notify user |
