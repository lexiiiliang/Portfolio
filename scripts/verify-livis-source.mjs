import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveContentRoot } from "./sync-portfolio-core.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const snapshot = JSON.parse(await readFile(path.join(root, "content/livis.generated.json"), "utf8"));
const sourcePath = path.join(resolveContentRoot(), snapshot.sourceFile);
const source = await readFile(sourcePath, "utf8");
const hash = (value) => createHash("sha256").update(value).digest("hex");
assert.equal(snapshot.sourceMarkdown, source, "Approved Markdown must remain verbatim.");
assert.equal(snapshot.sourceChecksum, hash(source));
let reconstructed = snapshot.markdown;
const references = [...source.matchAll(/!\[([^\]]*)\]\(<([^>]+)>\)|!\[\[([^\]]+)\]\]/g)];
assert.equal(references.length, snapshot.media.length);
for (const [index, media] of snapshot.media.entries()) {
  const original = await readFile(path.resolve(path.dirname(sourcePath), media.original));
  const copied = await readFile(path.join(root, "public", media.src));
  assert.equal(hash(original), media.sha256);
  assert.equal(hash(copied), media.sha256, `${media.original} changed during import.`);
  reconstructed = reconstructed.replace(`![${media.alt}](${media.src})`, references[index][0]);
}
assert.equal(reconstructed, source, "Import may change media URLs only.");
console.log(`Livis source verified: verbatim Markdown and ${snapshot.media.length} byte-identical media files.`);
