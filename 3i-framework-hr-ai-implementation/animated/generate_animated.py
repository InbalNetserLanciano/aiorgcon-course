#!/usr/bin/env python3
"""
Step 1 — Split storyboard.png into 6 panels (2-col × 3-row grid),
          crop each to 16:9, save as panel_0N.png in this directory.
Step 2 — Upload each panel to fal CDN, then call
          xai/grok-imagine-video/image-to-video with the matching
          prompt from video_prompts.txt. Download and save clip_0N.mp4.
"""
import os
import sys
import requests
import fal_client
from pathlib import Path
from PIL import Image
from dotenv import load_dotenv

SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent.parent

load_dotenv(dotenv_path=PROJECT_ROOT / ".env")

STORYBOARD_PATH = SCRIPT_DIR.parent / "storyboard" / "storyboard.png"
PROMPTS_FILE    = SCRIPT_DIR / "video_prompts.txt"
MODEL           = "xai/grok-imagine-video/image-to-video"
COLS, ROWS      = 2, 3


# ── Image splitting ──────────────────────────────────────────────────────────

def crop_to_16x9(img: Image.Image) -> Image.Image:
    """Crop a panel to 16:9 by trimming equal amounts from top and bottom."""
    w, h = img.size
    target_h = round(w * 9 / 16)
    if target_h >= h:
        return img
    top = (h - target_h) // 2
    return img.crop((0, top, w, top + target_h))


def split_storyboard(path: Path) -> list:
    img = Image.open(path).convert("RGB")
    w, h = img.size
    pw, ph = w // COLS, h // ROWS
    panels = []
    for row in range(ROWS):
        for col in range(COLS):
            left  = col * pw
            upper = row * ph
            panel = img.crop((left, upper, left + pw, upper + ph))
            panels.append(crop_to_16x9(panel))
    return panels


# ── Prompt parsing ───────────────────────────────────────────────────────────

def parse_prompts(path: Path) -> dict:
    """
    Returns {panel_number (int): prompt_text (str)}.
    Format expected:
        ---
        PANEL 01 | Scene Title
        Prompt text...

        ---
        PANEL 02 | ...
    """
    text = path.read_text(encoding="utf-8")
    blocks = [b.strip() for b in text.split("---") if b.strip() and not b.strip().startswith("#")]
    prompts = {}
    for block in blocks:
        lines = [ln for ln in block.splitlines() if ln.strip()]
        if not lines:
            continue
        header = lines[0]
        body   = "\n".join(lines[1:]).strip()
        try:
            panel_num = int(header.split()[1])
            prompts[panel_num] = body
        except (IndexError, ValueError):
            print(f"  Warning: could not parse panel number from header: {header!r}")
    return prompts


# ── fal queue callback ────────────────────────────────────────────────────────

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"    {log['message']}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if not os.getenv("FAL_KEY"):
        sys.exit("Error: FAL_KEY not found — add it to .env in the project root.")

    # ── Step 1: split storyboard ─────────────────────────────────────────────
    if STORYBOARD_PATH.exists():
        print(f"Storyboard found: {STORYBOARD_PATH}")
        print(f"Splitting into {COLS}×{ROWS} panels and cropping to 16:9...\n")
        panels = split_storyboard(STORYBOARD_PATH)
        for idx, panel_img in enumerate(panels, start=1):
            out = SCRIPT_DIR / f"panel_{idx:02d}.png"
            panel_img.save(out)
            print(f"  Saved panel: {out.name}  ({panel_img.size[0]}×{panel_img.size[1]})")
        print()
    else:
        # Fall back to any panel images already present
        existing = sorted(SCRIPT_DIR.glob("panel_*.png"))
        if existing:
            print(f"No storyboard found at {STORYBOARD_PATH}")
            print(f"Using {len(existing)} existing panel image(s) found in {SCRIPT_DIR}\n")
        else:
            sys.exit(
                f"Error: storyboard not found at {STORYBOARD_PATH} "
                f"and no panel images exist in {SCRIPT_DIR}.\n"
                f"Run the storyboard generator first, then re-run this script."
            )

    # ── Step 2: generate video clips ─────────────────────────────────────────
    prompts = parse_prompts(PROMPTS_FILE)
    print(f"Loaded {len(prompts)} prompts from {PROMPTS_FILE.name}")
    print(f"Model: {MODEL}\n")
    print("=" * 60)

    panel_files = sorted(SCRIPT_DIR.glob("panel_*.png"))

    for panel_path in panel_files:
        # Extract panel number from filename (panel_01.png → 1)
        try:
            panel_num = int(panel_path.stem.split("_")[1])
        except (IndexError, ValueError):
            continue

        prompt = prompts.get(panel_num)
        if not prompt:
            print(f"[panel_{panel_num:02d}] No matching prompt — skipping.")
            continue

        clip_path = SCRIPT_DIR / f"clip_{panel_num:02d}.mp4"
        print(f"\n[panel_{panel_num:02d}] Uploading image to fal CDN...")
        image_url = fal_client.upload_file(str(panel_path))
        print(f"[panel_{panel_num:02d}] CDN URL  : {image_url}")
        print(f"[panel_{panel_num:02d}] Prompt   : {prompt[:80]}...")
        print(f"[panel_{panel_num:02d}] Submitting to {MODEL}...")

        result = fal_client.subscribe(
            MODEL,
            arguments={
                "image_url": image_url,
                "prompt":    prompt,
            },
            with_logs=True,
            on_queue_update=on_queue_update,
        )

        video_url = result["video"]["url"]
        print(f"[panel_{panel_num:02d}] Video URL: {video_url}")
        print(f"[panel_{panel_num:02d}] Downloading...")

        resp = requests.get(video_url, timeout=180)
        resp.raise_for_status()
        clip_path.write_bytes(resp.content)

        size_mb = clip_path.stat().st_size / 1_048_576
        print(f"[panel_{panel_num:02d}] Saved → {clip_path.name}  ({size_mb:.1f} MB)")

    print("\n" + "=" * 60)
    print(f"All clips saved in: {SCRIPT_DIR}")


if __name__ == "__main__":
    main()
