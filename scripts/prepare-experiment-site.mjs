import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const experimentSource = path.join(repositoryRoot, "experiments", "cursor-tracker");
const experimentTarget = path.join(repositoryRoot, "public", "experiments", "cursor-tracker");
const mediaSource = path.join(repositoryRoot, "media", "cursor tracker");
const mediaTarget = path.join(repositoryRoot, "public", "media", "cursor tracker");

await rm(experimentTarget, { recursive: true, force: true });
await rm(mediaTarget, { recursive: true, force: true });
await mkdir(experimentTarget, { recursive: true });
await mkdir(mediaTarget, { recursive: true });

await Promise.all([
  "index.html",
  "styles.css",
  "cursor-tracker.js",
].map((file) => copyFile(path.join(experimentSource, file), path.join(experimentTarget, file))));

await Promise.all([
  "cursor-sprite.webp",
  "click wink.mp4",
].map((file) => copyFile(path.join(mediaSource, file), path.join(mediaTarget, file))));

console.log("Prepared the standalone cursor-tracker site in public/.");
