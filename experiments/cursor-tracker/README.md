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

- `cursor sprite.mp4` stays paused and is preloaded.
- The pointer is measured relative to the portrait centre and normalized against the available viewport space on both axes.
- Normalized X/Y coordinates are quantized to an 11×11 gaze grid.
- Each non-centre grid cell is mapped to the circular sprite timeline with `atan2(y, x)`: right → `0%`, down → `25%`, left → `50%`, up → `75%`.
- The centre cell uses the video's straight-on frame at approximately `30%` of the timeline.
- Every target is clamped between `0` and `video.duration`.
- Only one seek runs at a time. New targets are queued and applied from the `seeked` event, preventing seek flooding.
- `click wink.mp4` plays only after a click; neither video has an autoplay attribute.
- Reduced-motion visitors receive a static portrait.

## How this differs from the Face Looker image grid

The Face Looker example maps two-dimensional pointer coordinates to 121 separately generated WebP images. The supplied cursor video encodes a complete circular gaze orbit instead: right, down, left, up, and back to right. This prototype creates the same 11×11 coordinate grid in code and maps each cell's angle to the matching video frame. It preserves the original source asset while still responding to both X and Y coordinates.

Interaction approach evaluated against [kylan02/face_looker](https://github.com/kylan02/face_looker) (MIT). No generated Face Looker assets, Replicate calls, or model dependencies are used by this prototype.
