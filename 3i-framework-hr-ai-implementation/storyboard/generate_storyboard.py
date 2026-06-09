#!/usr/bin/env python3
"""
Generate a 6-panel 4K storyboard image via fal-ai/nano-banana-2.
Reads the prompt from storyboard_prompt.txt and saves the result
to storyboard.png in this same directory.
"""
import os
import sys
import requests
import fal_client
from pathlib import Path
from dotenv import load_dotenv

SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent.parent

load_dotenv(dotenv_path=PROJECT_ROOT / ".env")

PROMPT_FILE = SCRIPT_DIR / "storyboard_prompt.txt"
OUTPUT_FILE = SCRIPT_DIR / "storyboard.png"


def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(log["message"])


def main():
    fal_key = os.getenv("FAL_KEY")
    if not fal_key:
        sys.exit("Error: FAL_KEY not found. Add it to .env in the project root.")

    prompt = PROMPT_FILE.read_text(encoding="utf-8").strip()
    print(f"Prompt loaded ({len(prompt)} chars).")
    print("Submitting to fal-ai/nano-banana-2 (4K, 1:1) …\n")

    result = fal_client.subscribe(
        "fal-ai/nano-banana-2",
        arguments={
            "prompt": prompt,
            "resolution": "4K",
            "aspect_ratio": "1:1",
            "num_images": 1,
            "output_format": "png",
        },
        with_logs=True,
        on_queue_update=on_queue_update,
    )

    image_url = result["images"][0]["url"]
    print(f"\nImage URL: {image_url}")
    print("Downloading …")

    response = requests.get(image_url, timeout=120)
    response.raise_for_status()
    OUTPUT_FILE.write_bytes(response.content)

    size_mb = OUTPUT_FILE.stat().st_size / 1_048_576
    print(f"Saved → {OUTPUT_FILE}  ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
