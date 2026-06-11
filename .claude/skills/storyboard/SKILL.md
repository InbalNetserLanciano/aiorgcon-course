---
name: storyboard
description: >
  Run the full storyboard generation process for a commercial. Identifies the
  active commercial folder, ensures the venv and dependencies are ready, runs
  generate_storyboard.py, and reports the output path. Use when the user asks
  to generate, regenerate, or update the storyboard for a commercial.
allowed-tools: Bash Read Edit
---

## Instructions

### Step 1 — Identify the active commercial

Check CLAUDE.md rule: if it is unclear which commercial is being worked on,
ask the user before taking any action.

Scan the project root for commercial folders. A commercial folder contains a
`storyboard/` subdirectory with a `generate_storyboard.py` file.

- If exactly one commercial folder is found, use it and confirm with the user:
  > "Running storyboard for: `<folder-name>`. Proceed?"
- If multiple are found, list them and ask the user to choose.
- If none are found, stop and inform the user that no commercial with a
  storyboard script was detected.

Set `COMMERCIAL_DIR` to the chosen folder (relative to project root).

---

### Step 2 — Review the prompt (optional)

Read `<COMMERCIAL_DIR>/storyboard/storyboard_prompt.txt` and display a short
summary of it to the user. Ask:

> "Do you want to update the prompt before generating, or proceed with the
> current one?"

- If the user wants to update: open the file for editing based on their
  instructions, then continue.
- If the user says proceed (or gives no changes): continue immediately.

---

### Step 3 — Ensure the environment is ready

Check that `venv/bin/python` exists at the project root.
If the venv is missing, create it:
```
python3 -m venv venv
```

Check that the required packages are installed by running:
```
venv/bin/pip show fal-client python-dotenv requests
```

If any package is missing, install all three:
```
venv/bin/pip install fal-client python-dotenv requests --quiet
```

---

### Step 4 — Run the generator

Execute the storyboard script:
```
venv/bin/python <COMMERCIAL_DIR>/storyboard/generate_storyboard.py
```

Stream the output to the user in real time so they can see progress logs from
the fal.ai queue.

---

### Step 5 — Report the result

On success:
- Confirm the output path: `<COMMERCIAL_DIR>/storyboard/storyboard.png`
- State the file size if available
- Remind the user that all commercial output lives in `<COMMERCIAL_DIR>/`

On failure:
- Show the full error message
- If the error is `Host not in allowlist` or any network/403 error: explain
  that the cloud execution environment blocks outbound calls to fal.ai, and
  provide the local run instructions:
  ```
  source venv/bin/activate
  python <COMMERCIAL_DIR>/storyboard/generate_storyboard.py
  ```
- If the error is `FAL_KEY not found`: remind the user to add their key to
  `.env` at the project root:
  ```
  FAL_KEY=your_key_here
  ```
