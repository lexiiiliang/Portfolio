import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveContentRoot } from "./sync-portfolio-core.mjs";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function dimensions(bytes) {
  if (bytes.toString("ascii", 1, 4) === "PNG") return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  for (let offset = 2; offset < bytes.length;) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
    offset += 2 + length;
  }
  throw new Error("Cannot read source image dimensions.");
}

/** Read-only import. Copies images byte for byte and never touches the source. */
export async function syncQueryCase() {
  const config = JSON.parse(await readFile(path.join(siteRoot, "portfolio.config.json"), "utf8"));
  const project = config.projects.find((item) => item.slug === "from-query-to-quest");
  if (!project?.caseSource) return;
  const sourceFile = path.join(project.folder, project.caseSource.entry);
  const sourcePath = path.join(resolveContentRoot(), sourceFile);
  let source;
  try {
    source = await readFile(sourcePath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    // Builds away from this computer consume the checked-in public snapshot.
    await readFile(path.join(siteRoot, "content/from-query-to-quest.generated.json"));
    console.warn("Query to Quest source unavailable; using the checked-in case snapshot.");
    return;
  }
  const boundary = source.indexOf(project.caseSource.endBefore);
  if (boundary < 0) throw new Error("Query to Quest public-content boundary is missing.");
  const publicMarkdown = source.slice(0, boundary).trimEnd();
  const media = [];
  let markdown = publicMarkdown;
  const mediaDir = path.join(siteRoot, "public/media/from-query-to-quest-final");
  await mkdir(mediaDir, { recursive: true });
  for (const match of publicMarkdown.matchAll(/!\[([^\]]*)\]\(<([^>]+)>\)/g)) {
    const original = path.resolve(path.dirname(sourcePath), match[2]);
    const filename = `${String(media.length + 1).padStart(2, "0")}${path.extname(original).toLowerCase()}`;
    const src = `/media/from-query-to-quest-final/${filename}`;
    const bytes = await readFile(original);
    await copyFile(original, path.join(mediaDir, filename));
    media.push({ src, alt: match[1], original: path.basename(original), ...dimensions(bytes), sha256: createHash("sha256").update(bytes).digest("hex") });
    markdown = markdown.replace(match[0], `![${match[1]}](${src})`);
  }
  const snapshot = {
    sourceFile,
    endBefore: project.caseSource.endBefore,
    sourceChecksum: createHash("sha256").update(source).digest("hex"),
    publicChecksum: createHash("sha256").update(publicMarkdown).digest("hex"),
    markdown,
    media,
  };
  await writeFile(path.join(siteRoot, "content/from-query-to-quest.generated.json"), `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Synced Query to Quest: public body only, ${media.length} unchanged images.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await syncQueryCase();
}

