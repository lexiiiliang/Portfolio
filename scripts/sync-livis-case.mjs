import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveContentRoot } from "./sync-portfolio-core.mjs";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFile = "02 Project Gallery/Project02 Livis 理想AI眼镜/Livis Agent 任务大师_精修版.md";
const hash = (value) => createHash("sha256").update(value).digest("hex");

function imageDimensions(bytes, extension) {
  if (extension === ".png") return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  if ([".jpg", ".jpeg"].includes(extension) && bytes.readUInt16BE(0) === 0xffd8) {
    let offset = 2;
    while (offset + 4 < bytes.length) {
      if (bytes[offset++] !== 0xff) break;
      while (bytes[offset] === 0xff) offset++;
      const marker = bytes[offset++];
      if (marker === 0xda || marker === 0xd9) break;
      const length = bytes.readUInt16BE(offset);
      if (length < 2 || offset + length > bytes.length) break;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker) && length >= 8) {
        return { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
      }
      offset += length;
    }
  }
  throw new Error(`Unsupported or invalid Livis image: ${extension}`);
}

/** The approved document is the only source. Media are copied byte for byte. */
export async function syncLivisCase() {
  const sourcePath = path.join(resolveContentRoot(), sourceFile);
  const destination = path.join(siteRoot, "content/livis.generated.json");
  let sourceMarkdown;
  try {
    sourceMarkdown = await readFile(sourcePath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await readFile(destination);
    console.warn("Livis source unavailable; using the checked-in approved snapshot.");
    return;
  }
  const mediaDir = path.join(siteRoot, "public/media/livis-final");
  await mkdir(mediaDir, { recursive: true });
  const previous = await readFile(destination, "utf8").then(JSON.parse).catch((error) => {
    if (error.code !== "ENOENT") throw error;
    return { media: [] };
  });
  let nextMediaId = Math.max(0, ...previous.media.map((item) => Number.parseInt(path.basename(item.src), 10) || 0)) + 1;
  const media = [];
  let markdown = sourceMarkdown;
  const references = /!\[([^\]]*)\]\(<([^>]+)>\)|!\[\[([^\]]+)\]\]/g;
  for (const match of sourceMarkdown.matchAll(references)) {
    const relative = match[2] || match[3];
    const original = path.resolve(path.dirname(sourcePath), relative);
    const extension = path.extname(original).toLowerCase();
    const existing = previous.media.find((item) => item.original === relative);
    const filename = existing ? path.basename(existing.src) : `${String(nextMediaId++).padStart(2, "0")}${extension}`;
    const src = `/media/livis-final/${filename}`;
    const bytes = await readFile(original);
    const kind = extension === ".mp4" ? "video" : "image";
    const dimensions = kind === "image" ? imageDimensions(bytes, extension) : {};
    const alt = match[1] ?? path.basename(original, extension);
    await copyFile(original, path.join(mediaDir, filename));
    media.push({ kind, src, alt, original: relative, sha256: hash(bytes), ...dimensions });
    markdown = markdown.replace(match[0], `![${alt}](${src})`);
  }
  const snapshot = { sourceFile, sourceChecksum: hash(sourceMarkdown), sourceMarkdown, markdown, media };
  await writeFile(destination, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Synced Livis: complete approved document, ${media.length} unchanged media files.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await syncLivisCase();
