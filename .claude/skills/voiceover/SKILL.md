---
name: voiceover
description: >
  Generate per-panel voiceover MP3 files for a commercial using ElevenLabs
  eleven_v3. Reads the existing script, consults ElevenLabs API docs for
  current voice options, writes expressive VO lines with V3 audio tags in a
  voice that fits the commercial's mood, updates voiceover_lines.json, and
  runs generate_voiceover.py. Saves one MP3 per panel in the voiceover/
  subfolder. Use when the user asks to generate, regenerate, or update
  voiceover for a commercial.
allowed-tools: WebSearch WebFetch Read Edit Write Bash
---

## Instructions

### Step 1 — Identify the active commercial

Apply the CLAUDE.md rule: if it is unclear which commercial is being worked
on, ask the user before taking any action.

Scan the project root for commercial folders. A valid commercial folder
contains both a `script.md` and a `voiceover/` subdirectory.

- One match → confirm with the user: "Running voiceover for: `<folder>`. Proceed?"
- Multiple matches → list them and ask the user to choose.
- No match → stop and report.

Set `COMMERCIAL_DIR` to the confirmed folder.

---

### Step 2 — Read the script

Read `<COMMERCIAL_DIR>/script.md` in full.

Extract every panel/scene that has a visual description and an on-screen
moment. Note:
- Scene number and title
- Visual action and mood
- Any VO lines already written in the script (use as a guide, not verbatim)
- The overall emotional arc and brand tone

---

### Step 3 — Consult ElevenLabs documentation

Search the web for up-to-date information on:
1. Available ElevenLabs pre-made voices accessible on the free/starter API
   plan — including voice IDs and character descriptions.
2. The complete list of supported Eleven v3 audio tags (emotions, delivery,
   reactions, pauses, sound cues).
3. The correct `model_id` string for Eleven v3.

Use this research to choose the best voice for the commercial's mood and to
inform the audio tags you write.

---

### Step 4 — Write voiceover lines

For each panel identified in the script, write a single tight voiceover line
following these rules:

**Line rules:**
- Maximum ~15 words per panel (fits within a ~5-second shot)
- Must stand alone as a complete thought — no sentence should depend on the
  previous panel to make sense
- Use V3 audio tags inline to shape delivery: emotions, pauses, emphasis,
  and human reactions — e.g. `[thoughtful]`, `[pause]`, `[resolute]`,
  `[building intensity]`, `[emphatic]`
- No more than 2–3 tags per line to avoid over-direction
- Tags must enhance the line, not replace it

**Voice selection:**
- Pick one voice for the entire commercial (consistency)
- Choose based on: brand tone, target audience, and the emotional register
  of the script
- Justify your choice in a brief note

---

### Step 5 — Update voiceover_lines.json

Read the existing `<COMMERCIAL_DIR>/voiceover/voiceover_lines.json`.

Update the `panels` array with the new lines, preserving the JSON structure:

```json
{
  "voice_id": "<chosen_voice_id>",
  "voice_name": "<voice_name>",
  "model_id": "eleven_v3",
  "output_format": "mp3_44100_128",
  "panels": [
    {
      "id": "panel_01",
      "scene": "<scene title>",
      "text": "<VO line with [audio tags]>"
    }
  ]
}
```

If `voiceover_lines.json` does not exist yet, create it from scratch using
this structure.

Show the user the complete updated JSON before writing, and ask for
confirmation or any changes.

---

### Step 6 — Ensure the environment is ready

Check that `venv/bin/python` exists at the project root. If missing, create:
```
python3 -m venv venv
```

Check that required packages are installed:
```
venv/bin/pip show elevenlabs mutagen python-dotenv
```

Install any missing packages:
```
venv/bin/pip install elevenlabs mutagen python-dotenv --quiet
```

---

### Step 7 — Run the generator

Execute:
```
venv/bin/python <COMMERCIAL_DIR>/voiceover/generate_voiceover.py
```

Stream output to the user in real time.

---

### Step 8 — Report results

On success:
- List each generated file with its duration and size
- Show total voiceover duration
- Confirm output folder: `<COMMERCIAL_DIR>/voiceover/`

On failure:
- Show the full error
- **`Host not in allowlist` / 403 network error:** The cloud execution
  environment blocks outbound API calls. Provide local run instructions:
  ```
  source venv/bin/activate
  python <COMMERCIAL_DIR>/voiceover/generate_voiceover.py
  ```
- **`ELEVENLABS_API_KEY not found`:** Remind the user to add the key to
  `.env` at the project root:
  ```
  ELEVENLABS_API_KEY=your_key_here
  ```
- **Voice ID 403 / not available on plan:** Suggest switching to a
  confirmed free-tier voice ID and update `voiceover_lines.json` accordingly.
