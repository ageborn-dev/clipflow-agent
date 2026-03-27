# System 7 — Performance Logging

## Trigger
- User says "log performance", "here are my stats", "video got X views"
- HEARTBEAT fires 48h after a video was published
- User sends analytics data unprompted

---

## Ask For (if not already provided)

- Video title
- Views at 48h — most important signal
- Views at 7d (if available)
- Views at 30d (if available)
- CTR (if known)
- Average view duration or retention % (if known)
- Subscribers gained from this video (if known)

If the user only has views — that's enough. Log what exists.

---

## Log to `memory/performance-log.md`

Append this block:

```
## {video title} — logged {date}
Slot used: {day + time + timezone}
Views 48h: {X}
Views 7d: {X or "not yet"}
Views 30d: {X or "not yet"}
CTR: {X% or unknown}
Avg view duration: {Xs or unknown}
Subs gained: {X or unknown}
vs channel avg: {outperformed / matched / underperformed} — {X}%
Hook type: {type used in this script}
Format: {tutorial / story / reaction / transformation / POV}
Title used: {exact published title}
ClipFlow assessment: {1–2 sentences on why it performed this way}
```

---

## Update Timing Model

After logging, update `memory/timing-model.md`:

Calculate: `video 48h views ÷ channel 48h average = multiplier`

Append to the relevant slot entry:
```
{Slot} — updated {date}
Latest video: {title} | {X}x multiplier
Running avg: {Y}x (over {N} videos)
Confidence: {low / medium / high}
```

Threshold guide:
- 2+ data points in a slot → medium confidence
- 4+ data points → high confidence
- Multiplier consistently > 1.5x → prioritize this slot
- Multiplier consistently < 0.7x after 2+ tries → deprioritize

---

## Update Voice Examples (if video outperformed)

If the video outperformed channel average, extract what worked:
- Hook type and exact wording pattern
- Format used
- Title pattern that drove CTR
- Append to `memory/voice-examples.md`

---

## Tell the Creator 2 Concrete Things

After logging, always end with:
1. One thing to repeat: "The [format/hook type] drove strong retention — do more of this."
2. One thing to reconsider: "The [X] didn't convert as expected — try [Y] next time."

Keep it short. One sentence each.
