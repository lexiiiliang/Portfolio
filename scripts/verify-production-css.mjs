import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticRoot = path.join(root, ".next/static");
const entries = await readdir(staticRoot, { recursive: true, withFileTypes: true });
const files = entries.filter(entry => entry.isFile() && entry.name.endsWith(".css"));
assert.ok(files.length, "No production CSS found; run the Vercel build first.");
const css = (await Promise.all(files.map(file => readFile(path.join(file.parentPath, file.name), "utf8")))).join("\n");

// Check the shipped asset, not source CSS: a minifier can silently retain only
// -webkit-backdrop-filter, which Chromium and Firefox ignore.
for (const [selector, saturation] of [
  [".fpc-frost", "1.12"],
  ["html[data-theme=dark] .fpc-frost", ".85"],
]) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rule = css.match(new RegExp(`(?:^|})\\s*${escapedSelector}\\s*\\{([^{}]*)\\}`));
  assert.ok(rule, `Missing production rule: ${selector}`);
  const declaration = rule[1].match(/(?:^|;)\s*backdrop-filter\s*:\s*([^;]+)/);
  assert.ok(declaration, `Standard backdrop-filter was dropped from ${selector}`);
  const value = declaration[1].replace(/\s+/g, "").replace(/saturate\(0\./, "saturate(.");
  assert.equal(value, `blur(30px)saturate(${saturation})`, `Unexpected production frost: ${selector}`);
}
console.log("Production CSS verified: standard backdrop blur survives for light and dark folder cards.");
