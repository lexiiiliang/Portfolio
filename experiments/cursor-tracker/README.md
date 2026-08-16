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
- Horizontal mouse movement changes the target video time using:

  ```text
  (delta / window.innerWidth) * 0.8 * video.duration
  ```

- The target is clamped between `0` and `video.duration`.
- Only one seek runs at a time. New targets are queued and applied from the `seeked` event, preventing seek flooding.
- `click wink.mp4` plays only after a click; neither video has an autoplay attribute.
- Reduced-motion visitors receive a static portrait.

## Why video seeking instead of the Face Looker image grid

The Face Looker example maps two-dimensional pointer coordinates to 121 separately generated WebP images. The supplied cursor asset is already a continuous, one-dimensional horizontal motion sequence. Splitting it into a 2D image grid would add files without adding vertical gaze information, so this prototype keeps the source video intact and scrubs its timeline directly.

Interaction approach evaluated against [kylan02/face_looker](https://github.com/kylan02/face_looker) (MIT). No generated Face Looker assets, Replicate calls, or model dependencies are used by this prototype.
