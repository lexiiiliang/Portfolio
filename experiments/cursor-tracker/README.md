# Cursor portrait experiment

Standalone prototype for Lexi's portfolio portrait. It is intentionally not linked from the production site and is isolated on the `experiment/cursor-tracker` branch.

## Run locally

From the repository root:

```sh
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/experiments/cursor-tracker/
```

## Interaction model

- `cursor-sprite.webp` contains 110 sequential frames in an 11×10 sheet, matching the supplied `avatar-sprite.webp` reference structure.
- The pointer is measured relative to the portrait centre and normalized against the available viewport space on both axes.
- Continuous X/Y coordinates are converted to a circular gaze angle with `atan2(y, x)`: right → `0%`, down → `25%`, left → `50%`, up → `75%`.
- A requestAnimationFrame loop follows the shortest path around the circular timeline and combines time-based interpolation with a time-scaled speed cap. Motion therefore stays consistent across display refresh rates, abrupt pointer jumps, and the `0%`/`100%` seam.
- A small centre dead zone returns the portrait to a straight-on frame without angle jitter.
- Sprite movement uses a GPU-composited `translate3d` transform instead of repeatedly seeking the source video.
- `click wink.mp4` plays only after a click; neither video has an autoplay attribute.
- Reduced-motion visitors receive a static portrait.

## How this differs from the Face Looker image grid

The Face Looker example maps two-dimensional pointer coordinates to separately generated WebP images. The supplied cursor video encodes a complete circular gaze orbit instead: right, down, left, up, and back to right. This prototype extracts 110 evenly spaced poses into one compact WebP sheet and maps the pointer angle to the matching frame. It preserves the original source asset while avoiding video seek latency.

## Regenerating the sprite

The checked-in Swift generator extracts the 11×10 PNG sheet from the original video:

```bash
swift experiments/cursor-tracker/scripts/build-cursor-sprite.swift \
  "media/cursor tracker/cursor sprite.mp4" \
  /tmp/lexi-cursor-sprite.png

python3 experiments/cursor-tracker/scripts/encode-sprite-webp.py \
  /tmp/lexi-cursor-sprite.png \
  "media/cursor tracker/cursor-sprite.webp"
```

The WebP encoder uses Pillow and writes `media/cursor tracker/cursor-sprite.webp` at quality 86. Keeping the source video and both generator steps together makes the sprite reproducible when the animation asset changes.

Interaction approach evaluated against [kylan02/face_looker](https://github.com/kylan02/face_looker) (MIT). No generated Face Looker assets, Replicate calls, or model dependencies are used by this prototype.
