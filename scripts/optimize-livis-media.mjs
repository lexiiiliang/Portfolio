import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Run explicitly after content:sync. The approved snapshot and originals are
// read-only inputs; builds use checked-in derivatives, including without Obsidian.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const snapshot = JSON.parse(await readFile(path.join(root, "content/livis.generated.json"), "utf8"));
const outputDir = path.join(root, "public/media/livis-optimized");
const temporaryDir = await mkdtemp(path.join(os.tmpdir(), "livis-media-"));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
await mkdir(outputDir, { recursive: true });

async function save(bytes, label, extension) {
  const name = `${label}-${digest(bytes).slice(0, 16)}.${extension}`;
  await writeFile(path.join(outputDir, name), bytes);
  return { src: `/media/livis-optimized/${name}`, bytes: bytes.length };
}

try {
  const media = [];
  let videoTool;
  for (const original of snapshot.media) {
    const source = path.join(root, "public", original.src);
    const bytes = await readFile(source);
    if (digest(bytes) !== original.sha256) throw new Error(`Source checksum mismatch: ${original.src}`);
    const label = path.basename(source, path.extname(source));
    const common = { original: original.src, sourceSha256: original.sha256, originalBytes: bytes.length };
    if (original.kind === "image") {
      const maxWidth = Math.min(original.width, 1760);
      const widths = [...new Set([480, 800, 1200, maxWidth].filter(width => width <= maxWidth))].sort((a, b) => a - b);
      const variants = [];
      for (const width of widths) {
        const { data, info } = await sharp(bytes).resize({ width, withoutEnlargement: true }).webp({ quality: 90, effort: 6 }).toBuffer({ resolveWithObject: true });
        variants.push({ ...await save(data, `${label}-${width}`, "webp"), width: info.width, height: info.height });
      }
      media.push({ ...common, kind: "image", variants });
    } else {
      if (!videoTool) {
        if (process.platform !== "darwin") throw new Error("Video preparation needs macOS AVFoundation; deploy the checked-in assets on other platforms.");
        videoTool = path.join(temporaryDir, "prepare-video");
        execFileSync("swiftc", ["-O", path.join(root, "scripts/prepare-livis-video.swift"), "-o", videoTool], { stdio: ["ignore", "ignore", "inherit"] });
      }
      const videoPath = path.join(temporaryDir, `${label}.mp4`);
      const posterPath = path.join(temporaryDir, `${label}.png`);
      const metadata = JSON.parse(execFileSync(videoTool, [source, videoPath, posterPath], { encoding: "utf8" }));
      const poster = await sharp(posterPath).webp({ quality: 90, effort: 6 }).toBuffer();
      media.push({ ...common, kind: "video", ...metadata, ...await save(await readFile(videoPath), label, "mp4"), poster: await save(poster, `${label}-poster`, "webp") });
    }
  }
  await writeFile(path.join(root, "content/livis-media.generated.json"), `${JSON.stringify({ media }, null, 2)}\n`);
  console.table(media.map(item => ({ source: item.original, original: item.originalBytes, display: item.kind === "image" ? item.variants.at(-1).bytes : item.bytes })));
} finally {
  await rm(temporaryDir, { recursive: true, force: true });
}
