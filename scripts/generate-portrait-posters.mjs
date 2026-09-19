import sharp from "sharp";

// Crop frame 33 without resizing or recompressing its decoded pixels.
// Run explicitly after changing the original sprite sheets; builds use the
// checked-in posters and do not rewrite source assets.
for (const [suffix, size] of [["", 256], ["@2x", 512]]) {
  await sharp(`public/media/cursor-tracker/cursor-sprite${suffix}.webp`)
    .extract({ left: 0, top: size * 3, width: size, height: size })
    .webp({ lossless: true })
    .toFile(`public/media/cursor-tracker/portrait-poster${suffix}.webp`);
}
