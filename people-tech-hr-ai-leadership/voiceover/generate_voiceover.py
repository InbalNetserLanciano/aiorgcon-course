#!/usr/bin/env python3
"""
Generate per-panel voiceover MP3 files via ElevenLabs eleven_v3.
Reads lines and voice config from voiceover_lines.json, saves one
MP3 per panel into this directory, and prints a duration summary.
"""
import io
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from mutagen.mp3 import MP3

SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent.parent

load_dotenv(dotenv_path=PROJECT_ROOT / ".env")

LINES_FILE = SCRIPT_DIR / "voiceover_lines.json"


def duration_of(audio_bytes: bytes) -> float:
    return MP3(io.BytesIO(audio_bytes)).info.length


def main():
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        sys.exit("Error: ELEVENLABS_API_KEY not found — add it to .env in the project root.")

    config = json.loads(LINES_FILE.read_text(encoding="utf-8"))
    client = ElevenLabs(api_key=api_key)

    voice_id = config["voice_id"]
    voice_name = config["voice_name"]
    model_id = config["model_id"]
    output_format = config["output_format"]
    panels = config["panels"]

    print(f"Voice: {voice_name} ({voice_id})")
    print(f"Model: {model_id}  |  Format: {output_format}")
    print(f"Generating {len(panels)} voiceover files...\n")
    print("-" * 60)

    total_duration = 0.0

    for panel in panels:
        panel_id = panel["id"]
        scene = panel["scene"]
        text = panel["text"]
        output_path = SCRIPT_DIR / f"{panel_id}.mp3"

        print(f"{panel_id}  —  {scene}")

        audio_bytes = b"".join(
            client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id=model_id,
                output_format=output_format,
            )
        )

        output_path.write_bytes(audio_bytes)
        dur = duration_of(audio_bytes)
        total_duration += dur

        size_kb = len(audio_bytes) / 1024
        print(f"  Saved   : {output_path.name}")
        print(f"  Size    : {size_kb:.1f} KB")
        print(f"  Duration: {dur:.2f}s")
        print()

    print("-" * 60)
    print(f"Total voiceover duration : {total_duration:.2f}s  ({total_duration/60:.1f} min)")
    print(f"Files saved in           : {SCRIPT_DIR}")


if __name__ == "__main__":
    main()
