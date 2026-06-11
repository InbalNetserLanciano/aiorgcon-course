---
name: animate
description: >
  Turn a commercial storyboard into animated video clips using Grok Imagine
  via the fal.ai API. Splits storyboard.png into 6 panels (2×3 grid), crops
  each to 16:9, writes a cinematic video prompt per panel based on the script,
  updates video_prompts.txt, and runs generate_animated.py. Saves panel images
  and clip_0N.mp4 files in the animated/ subfolder. Use when the user asks to
  animate, generate clips, or run the animation pipeline for a commercial.
allowed-tools: WebSearch Read Edit Write Bash
---

## Instructions

### Step 1 — Identify the active commercial

Apply the CLAUDE.md rule: if it is unclear which commercial is being worked
on, ask the user before taking any action.

Scan the project root for commercial folders. A valid commercial folder
contains a `storyboard/storyboard.png` file and an `animated/` subdirectory
with a `generate_animated.py` script.

- One match → confirm: "Animating: `<folder-name>`. Proceed?"
- Multiple matches → list them and ask the user to choose.
- No match → stop and report.

Set `COMMERCIAL_DIR` to the confirmed folder.

---

### Step 2 — Read the script

Read `<COMMERCIAL_DIR>/script.md` in full.

For each of the 6 storyboard panels, identify:
- The scene number and title
- The visual action in the opening frame
- The camera movement specified (static, slow dolly, push-in)
- The mood and lighting
- Any motion already described

The panels in the storyboard follow the 2×3 reading order:
top-left → top-right → middle-left → middle-right → bottom-left → bottom-right.
Map them to script scenes in that order.

---

### Step 3 — Research Grok Imagine prompting (if needed)

If you do not already have current information about Grok Imagine video
prompting best practices, search the web for:

- Official Grok Imagine video prompt structure and camera movement language
- Which camera terms the model responds to best (e.g. "slow push-in",
  "slow dolly forward", "static camera", "tracking shot")
- Any updated parameters for `xai/grok-imagine-video/image-to-video` on fal.ai

---

### Step 4 — Write video prompts

For each of the 6 panels, write one cinematic video prompt following this
structure:

**Prompt structure (per panel):**
```
[Subject + what moves]. [Camera move]. [Style and lighting]. [Audio cue].
No text, no captions, no graphic overlays.
```

**Rules:**
- Keep each prompt to 2–4 sentences — focused on motion, not static description
- Specify the camera movement explicitly and match the script's camera note
  for that scene (slow dolly, push-in, or static)
- For image-to-video: the model already has the visual — describe MOTION,
  not appearance
- The no-text clause must appear verbatim at the end of every prompt:
  `No text, no captions, no graphic overlays.`
- Suggested camera language: "slow dolly forward", "slow push-in",
  "static camera", "camera drifts gently left", "slow pan right"

---

### Step 5 — Update video_prompts.txt

Read the existing `<COMMERCIAL_DIR>/animated/video_prompts.txt`.

Update the prompt body for each panel, preserving the file format exactly:

```
---

PANEL 01 | Scene Title
[prompt text]

---

PANEL 02 | Scene Title
[prompt text]

---
```

Show the user the updated prompts and ask for confirmation or edits before
writing.

---

### Step 6 — Ensure the environment is ready

Check that `venv/bin/python` exists at the project root. If missing:
```
python3 -m venv venv
```

Check that required packages are installed:
```
venv/bin/pip show fal-client Pillow python-dotenv requests
```

Install any missing packages:
```
venv/bin/pip install fal-client Pillow python-dotenv requests --quiet
```

---

### Step 7 — Run the generator

Execute:
```
venv/bin/python <COMMERCIAL_DIR>/animated/generate_animated.py
```

Stream output to the user in real time.

---

### Step 8 — Report results

On success:
- List each panel image saved with its dimensions
- List each clip saved with its file size
- Confirm output folder: `<COMMERCIAL_DIR>/animated/`

On failure:
- Show the full error message
- **`Host not in allowlist` / 403 network error:** The cloud execution
  environment blocks outbound calls to fal.ai. Provide local run instructions:
  ```
  source venv/bin/activate
  # First generate the storyboard if storyboard.png is missing:
  python <COMMERCIAL_DIR>/storyboard/generate_storyboard.py
  # Then run the animation:
  python <COMMERCIAL_DIR>/animated/generate_animated.py
  ```
- **`storyboard not found`:** Remind the user to run `/storyboard` first
  to generate `storyboard.png`, then invoke `/animate` again.
- **`FAL_KEY not found`:** Remind the user to add the key to `.env`:
  ```
  FAL_KEY=your_key_here
  ```
