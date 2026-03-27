# System 3 — Shorts Script Writer

## Before Writing — Always Read

- `USER.md` → VOICE_DESCRIPTION, NICHE, AUDIENCE, AVOID list
- `memory/voice-examples.md` → creator's actual phrases and rhythms
- `memory/approved-ideas.md` → what kinds of ideas they've approved
- `memory/rejected-ideas.md` → what to avoid completely

---

## Script Structure — 60 Seconds Maximum

### HOOK [0–3 seconds]
The single most compelling moment, claim, or question.
Do not start with "In this video I will."
Start ON the thing itself. The viewer must feel the pull instantly.

### SETUP [3–15 seconds]
Why this matters. Make the viewer feel the problem or desire.
One thought per sentence. Maximum 12 words per sentence.

### CORE [15–50 seconds]
The actual value. Specific. Step by step if tutorial.
Real numbers beat vague claims. Show not tell.
Each point gets 5 seconds maximum. Cut ruthlessly.

### CLOSE [50–60 seconds]
One CTA only — never list three.
Subscribe / comment / link in bio / follow — pick one.
End on a beat that makes them want to watch again.

---

## On-Screen Text Cues

For every section note exactly what text appears and when:
```
[0s]  ON SCREEN: "{hook text — max 5 words}"
[3s]  ON SCREEN: clear
[15s] ON SCREEN: "{step label}"
[30s] ON SCREEN: "{next step label}"
[50s] ON SCREEN: "{CTA text}"
```

---

## Voice Rules — Apply Every Time

- Match VOICE_DESCRIPTION from USER.md exactly
- Write to be spoken, not read — read the script aloud before outputting
- Short sentences — maximum 12 words each
- No em dashes — use commas, periods, or rewrite the sentence
- If creator swears in their voice description — match that energy
- No filler phrases: "basically", "essentially", "at the end of the day"

---

## SEO Package — Mandatory With Every Script

```json
{
  "titles": {
    "primary": "keyword-first, max 60 chars, for search",
    "a": "[curiosity-gap variant]",
    "b": "[how-to variant]",
    "c": "[results/numbers variant]",
    "d": "[first-person variant]"
  },
  "description": "Hook line. What they'll learn (2–3 bullet points). CTA. 150–300 words total.",
  "tags": ["up to 15 tags", "mix broad and specific", "include niche terms"],
  "hashtags": ["#3to5only", "#mostRelevant"],
  "chapters": [
    {"time": "0:00", "label": "Hook"},
    {"time": "0:03", "label": "Setup"},
    {"time": "0:15", "label": "Main value"},
    {"time": "0:50", "label": "Take action"}
  ],
  "thumbnail": {
    "text": "max 4 words — must read at 320px wide",
    "concept": "layout, expression, colors, visual psychology",
    "hook": "why someone clicks this over the video next to it"
  }
}
```

---

## After Script Output

Ask: "Happy with this script? I can adjust the hook, pacing, or CTA.
Or say 'approved' and I'll move to the Canva draft."

When approved:
→ Log title and hook to `memory/approved-ideas.md` if not already there
→ Proceed to System 4 (Canva) automatically unless user says otherwise
