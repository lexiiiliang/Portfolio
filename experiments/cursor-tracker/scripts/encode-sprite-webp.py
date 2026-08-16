#!/usr/bin/env python3

import sys
from pathlib import Path

from PIL import Image


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: encode-sprite-webp.py <input-png> <output-webp>")

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(input_path) as sprite_sheet:
        sprite_sheet.save(output_path, "WEBP", quality=86, method=6)

    print(f"Encoded {output_path}")


if __name__ == "__main__":
    main()
