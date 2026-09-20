import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(await readFile(path.join(root, "content/livis.generated.json"), "utf8"));
const display = JSON.parse(await readFile(path.join(root, "content/livis-media.generated.json"), "utf8"));
const hash = bytes => createHash("sha256").update(bytes).digest("hex");

async function asset(item) {
  assert.ok(item.src.startsWith("/media/livis-optimized/"));
  const bytes = await readFile(path.join(root, "public", item.src));
  assert.equal(bytes.length, item.bytes);
  assert.ok(path.basename(item.src).includes(hash(bytes).slice(0, 16)), `Invalid immutable filename: ${item.src}`);
  return bytes;
}

assert.equal(display.media.length, source.media.length);
for (const original of source.media) {
  const media = display.media.find(item => item.original === original.src);
  assert.ok(media, `Missing derivative: ${original.src}`);
  assert.equal(media.sourceSha256, original.sha256, `Run media:livis after changing ${original.src}`);
  assert.equal(hash(await readFile(path.join(root, "public", original.src))), original.sha256);
  if (original.kind === "image") {
    assert.equal(media.kind, "image");
    assert.ok(media.variants.length >= 2);
    let previousWidth = 0;
    for (const variant of media.variants) {
      const image = sharp(await asset(variant));
      const metadata = await image.metadata();
      await image.raw().toBuffer(); // Decode the entire image, not just its header.
      assert.equal(metadata.format, "webp");
      assert.equal(metadata.width, variant.width);
      assert.equal(metadata.height, variant.height);
      assert.ok(variant.width > previousWidth && variant.width <= original.width);
      assert.ok(Math.abs(variant.height - original.height * variant.width / original.width) <= 1);
      previousWidth = variant.width;
    }
  } else {
    const bytes = await asset(media);
    const atoms = [];
    let offset = 0;
    while (offset + 8 <= bytes.length) {
      const shortSize = bytes.readUInt32BE(offset);
      const size = shortSize === 1 ? Number(bytes.readBigUInt64BE(offset + 8))
        : shortSize === 0 ? bytes.length - offset : shortSize;
      assert.ok(size >= (shortSize === 1 ? 16 : 8) && offset + size <= bytes.length, "Invalid MP4 atom");
      atoms.push(bytes.toString("ascii", offset + 4, offset + 8));
      offset += size;
    }
    assert.equal(offset, bytes.length);
    assert.ok(atoms.includes("moov") && atoms.includes("mdat"));
    assert.ok(atoms.indexOf("moov") < atoms.indexOf("mdat"), "Video index must precede media data");
    const poster = sharp(await asset(media.poster));
    const metadata = await poster.metadata();
    await poster.raw().toBuffer();
    assert.equal(metadata.width, media.width);
    assert.equal(metadata.height, media.height);
    assert.ok(media.duration > 0);
  }
}
console.log("Livis derivatives verified: original checksums, image decoding and proportions, immutable URLs, posters, and fast-start MP4s.");
