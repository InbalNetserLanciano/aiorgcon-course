---
name: commercial
description: >
  Full commercial production pipeline — concept to finished video.
  Runs /script → /storyboard → /voiceover → /animate → Remotion assembly in
  sequence, pausing after each step for explicit user approval before moving on.
  Use this skill when the user wants to produce a complete commercial from scratch.
argument-hint: [concept]
arguments: concept
---

# Commercial Production Pipeline

You are producing a complete commercial video.

The concept is: **$concept**

If no concept was provided, ask the user for it before doing anything else:
> "What commercial concept should we produce? Please describe the brand, message, and target audience."

---

## Ground rules

Follow the steps below **strictly in order**. After completing each step, **stop completely** and ask the user:

> "✅ Step N complete. Please review the result above.
> Type **ok** or **continue** to move to the next step, or describe any changes you'd like."

Do **not** proceed to the next step until the user explicitly says "ok" or "continue".
Do **not** skip, merge, or compress steps.

---

## Step 1 — Script

Invoke `/script` with the concept as input.

The skill will:
- Research inspiration and market context
- Write a multi-scene script (max 5s per scene, no in-scene cuts, simple camera movement only)
- Save the script to `script.md` inside a new folder named after the concept

After the script is saved, show the user a summary: scene count, total estimated duration, and the key message of each scene.

**Stop. Wait for approval before continuing.**

---

## Step 2 — Storyboard

Invoke `/storyboard`.

The skill will:
- Read the script
- Generate a 2×3 storyboard image (no text in any panel)
- Save it as `storyboard/storyboard.png`

After the image is generated, report the file path and note which scenes each panel covers.

**Stop. Wait for approval before continuing.**

---

## Step 3 — Voiceover

Invoke `/voiceover`.

The skill will:
- Read the script and choose the right voice and V3 audio tags
- Generate one MP3 per panel into `voiceover/panel_NN.mp3`
- Report the duration of each file

After all files are generated, list the files and durations in a table.

**Stop. Wait for approval before continuing.**

---

## Step 4 — Animated Clips

Invoke `/animate`.

The skill will:
- Split the storyboard into 6 individual panels (2×3 grid), cropped to 16:9
- Generate one video clip per panel into `animated/clip_NN.mp4` using Grok Imagine
- Clips contain no text or graphic overlays

After all clips are generated, list the file names.

**Stop. Wait for approval before continuing.**

---

## Step 5 — Remotion Assembly & Preview

Build a complete Remotion v4 project inside a `remotion/` folder within the commercial folder.

### Assembly rules

- Read `script.md` — focus on `<editing>` tags for overlay instructions, transitions, and on-screen text
- Open the storyboard images to understand what visual content is already present — do **not** duplicate elements that exist in the footage
- Any text or overlay you add must be clearly visible and readable on top of the video
- Trim each clip so it ends 1.5 seconds after its matching voiceover file ends, never exceeding the original clip duration (use `mediabunny` + `calculateMetadata`)
- Use fade transitions (`@remotion/transitions/fade`) between all scenes
- Use brand colors: Purple `#500B75`, Turquoise `#0BFCCE`, Navy `#050A1E`, White `#FFFFFF`
- Set `Config.setPublicDir('../')` in `remotion.config.ts` so `staticFile()` resolves to the commercial folder

### Launch Studio

Once all files are written:

```bash
cd remotion && npm install && npx remotion studio --port 3100
```

Give the user the URL to open in their browser: `http://localhost:3100`

**Stop. Wait for explicit approval of the preview before continuing.**

---

## Step 6 — Export to MP4 (only after explicit approval)

Only run this step after the user has reviewed the Studio preview and explicitly approved it.

Create the output folder and render:

```bash
mkdir -p output
npx remotion render src/index.ts <CompositionId> output/video.mp4 --codec h264
```

Replace `<CompositionId>` with the actual composition ID used in `src/Root.tsx`.

Report the full path to the finished MP4 file.
