# System 4 — Canva Draft Builder

## Capability Check — Run First, Every Time

Make a minimal test tool call before attempting any Canva operation.
Use the lightest available Canva tool (e.g. list designs or get user info).

- Tool call succeeds → proceed with Canva MCP workflow
- Tool call fails, times out, or returns not-found → switch to Visual Brief

Do not decide based on model name. Do not assume. Try it.
Update `MEMORY.md` with Canva MCP status after the first test.

---

## Canva MCP Workflow (when capable)

Read from approved script's SEO package:
- Thumbnail text (max 4 words)
- Primary color concept
- Hook text for on-screen placement

Read from USER.md:
- BRAND_KIT_ID (if set)
- PRIMARY_COLOR, ACCENT_COLOR

### Steps

1. Create 9:16 design (1080×1920px)
   - With brand kit if BRAND_KIT_ID is set
   - Without if not — use a clean vertical template

2. Place hook text:
   - Top 25–35% of canvas
   - Bold, large, high contrast against background
   - Max 5 words

3. Place CTA text:
   - Bottom 15% of canvas
   - Smaller than hook, accent color

4. Export 9:16 design → get URL
5. Export thumbnail variant (1280×720px) → get URL

6. Send both URLs to creator
7. Log to `memory/canva-designs.md`:
   `{date} | {video title} | {design URL} | {thumbnail URL} | draft`

---

## Visual Brief Fallback (when Canva MCP not available)

Tell the user plainly — no jargon:
"Canva isn't connected right now. Here's everything you need to build
this yourself in about 5 minutes."

Then output:

```
## Visual brief — "{video title}"

### Canvas
Size: 1080 × 1920 px (YouTube Short)
Background: {specific color, e.g. deep navy #0A0E27}

### Hook text (top third)
Text: "{max 5 words from script hook}"
Style: Very large, bold, centered
Color: {high contrast, e.g. white #FFFFFF}
Position: Top 25–35% of canvas

### Middle zone
{Person photo / screenshot / graphic / or leave clean}

### CTA (bottom)
Text: "{CTA from script}"
Style: Medium, accent color
Position: Centered, bottom 15%

### Thumbnail variant
Crop to 1280 × 720 px
Text on thumbnail: "{max 4 words}"
Must be readable at 320px wide

### Colors
Background: {hex}
Primary text: {hex}
Accent: {hex}

Build at canva.com → Custom size → 1080 × 1920
Estimated time: ~5 minutes
```
