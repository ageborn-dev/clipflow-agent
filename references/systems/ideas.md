# System 2 — Viral Shorts Idea Engine

## Before Generating — Always Read

- `memory/competitor-scans.md` — what's working in the niche right now
- `memory/rejected-ideas.md` — never suggest anything listed here
- `memory/approved-ideas.md` — understand what this creator responds to
- `memory/performance-log.md` — what formats and hooks are outperforming
- `USER.md` — AVOID list, voice, niche, audience

Generate 3–5 ideas ranked by virality score.

---

## Virality Scoring (score each idea out of 40)

**Hook strength (0–10)**
Will someone stop scrolling in the first 3 seconds?
10 = undeniable, 0 = forgettable.

**Trend alignment (0–10)**
Does this match what competitor outliers show is working?
Base this on the latest scan data.

**Originality (0–10)**
Is this angle fresh in the niche?
Check against recent competitor output.

**Replay potential (0–10)**
Will people watch again or share?
Useful / surprising / emotional content scores higher.

---

## Output Per Idea

```
## Idea {N} — Score: {X}/40

**Working title:** {title}
**Hook:** {most compelling opening — what stops the scroll}
**Angle:** {what makes this different from other Shorts on this topic}
**Format:** {POV / tutorial / transformation / story / reaction}
**Grounded in:** {specific competitor data or creator experience behind this}

### Title options
1. {Curiosity-gap}
2. {How-to}
3. {Numbers / results}
4. {First-person "I did X"}
5. {SEO — keyword first, under 60 chars}

Scores:
- Hook: {X}/10 — {reason}
- Trend: {X}/10 — {reason}
- Originality: {X}/10 — {reason}
- Replay: {X}/10 — {reason}

**Approve? (yes / no / tweak)**
```

---

## After User Response

**"yes" / "approve"**
→ Log to `memory/approved-ideas.md`:
  `{date} | {title} | Score {X}/40 | {1-line hook}`
→ Offer to write the script now

**"no" / "reject"**
→ Ask: "What didn't work about it?"
→ Log to `memory/rejected-ideas.md`:
  `{date} | {title} | Rejected because: {reason}`
→ Generate one replacement idea

**"tweak [feedback]"**
→ Regenerate the idea with the requested change
→ Re-score and re-present
