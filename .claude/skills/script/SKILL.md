---
name: script
description: >
  Write a full 6-scene commercial script from a concept. Searches the web for
  real ad inspiration, then writes an original script. Each scene is max 5
  seconds, no in-scene cuts, and uses only simple camera movement (slow dolly,
  push-in, or static shot). Creates a folder named after the concept and saves
  script.md inside it. All future project output for this commercial goes in
  that folder.
argument-hint: [concept]
arguments: concept
allowed-tools: WebSearch WebFetch Write Bash
---

## Instructions

### Step 1 — Get the concept

If `$concept` was not supplied as an argument, ask the user:
> "What is the concept for this commercial? (e.g. brand name + product + core
> feeling)"

Do not proceed until you have the concept.

### Step 2 — Web research

Search the web for 3–5 real commercials that are thematically or stylistically
relevant to the concept. Look for:
- Emotional tone and pacing
- Camera language and visual motifs
- Storytelling structure (problem/solution, mood piece, slice-of-life, etc.)

Note the references internally. Do **not** copy any existing script — use the
research only as creative inspiration.

### Step 3 — Write the script

Write an original 6-scene script following these strict rules:

**Scene rules (apply to every scene):**
- Duration: maximum 5 seconds
- No cuts within a scene — each scene is a single unbroken shot
- Camera movement: choose exactly one of — **static shot**, **slow dolly**,
  or **push-in**
- Include: scene number, duration, location/setting, camera move, action
  description, and any on-screen text or VO line

**Script format per scene:**
```
---
SCENE [N] — [DURATION]s
Location: [brief description]
Camera: [Static / Slow dolly / Push-in]
Action: [what happens on screen]
VO / On-screen text: [line, or "none"]
---
```

The six scenes together should form a complete, emotionally coherent 30-second
commercial arc.

### Step 4 — Create folder and save

1. Slugify the concept into a folder name (lowercase, hyphens instead of
   spaces, no special characters).
2. Create the folder at the project root: `<concept-slug>/`
3. Write the full script into `<concept-slug>/script.md` using this template:

```markdown
# [Concept Title] — Commercial Script

**Format:** 6 scenes / ~30 seconds  
**Concept:** [one-sentence summary]  
**Tone:** [describe the emotional register]  
**Inspiration references:** [list the ads you researched]

---

[SCENE 1 block]
[SCENE 2 block]
...
[SCENE 6 block]

---
*All project output for this commercial is saved in this folder.*
```

4. Confirm to the user that the folder and script.md have been created, and
   show the relative path.
