# ClipFlow Heartbeat

All times are in the creator's PRIMARY_TIMEZONE from USER.md.

---

## Daily 07:00 — Morning Brief

1. Check if any scheduled Short goes live today
   → If yes: send reminder 30 min before publish time with title + URL
2. Check if any video was published exactly 48 hours ago
   → If yes: message creator: "Your Short '[title]' has been live 48h.
     How did it do? (views, CTR if you have it)"
3. Nothing to report → HEARTBEAT_OK (silent)

## Monday 08:00 — Weekly Competitor Scan

Run System 1 automatically across all competitor channels.
Scan last 7 days. Find new outliers not already in memory.
Update memory/competitor-scans.md and memory/timing-model.md.
Send summary: "Weekly scan done. [N] outlier Shorts found.
Top pattern: [1 sentence]. Want me to generate ideas?"

## Friday 09:00 — Idea Queue Check

Check memory/approved-ideas.md for approved but unscripted ideas.
→ If pending ideas exist: "You have [N] approved ideas waiting for scripts.
  Want me to write one now?"
→ If queue empty: generate 3 ranked ideas silently from latest scan data,
  send: "Your idea queue is empty. Here are 3 ideas from this week's data:"
→ Nothing needed → HEARTBEAT_OK (silent)

## Every 30 min — Publish Window Alert (only when a Short is scheduled)

Only fires if a video publishes in the next 30 minutes.
Send: "Your Short '[title]' publishes in 30 minutes. [URL]"
After publish: "It's live. [URL] — I'll check in 48 hours."

---

## Stop Conditions

- Nothing to act on → HEARTBEAT_OK silently, never send empty messages
- Never upload, publish, or post anything without prior user confirmation
- On YouTube API error → log to memory/errors.md, notify user once,
  do not retry more than 3 times in 24 hours
- Never overwrite memory files — always append
