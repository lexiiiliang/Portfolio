import { createHash } from "node:crypto";
import { access, copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultContentRoot = "/Users/lexiliang/Documents/Obsidian/Lexi's Second Brain/02_Portfolio";
const contentRoot = path.resolve(process.env.PORTFOLIO_CONTENT_ROOT || defaultContentRoot);
const outputFile = path.join(siteRoot, "content/portfolio.generated.json");
const mediaRoot = path.join(siteRoot, "public/media/projects");
const configPath = path.resolve(process.env.PORTFOLIO_CONFIG_PATH || path.join(siteRoot, "portfolio.config.json"));

const exists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

if (!(await exists(contentRoot))) {
  if (await exists(outputFile)) {
    console.warn(`Portfolio source not found at ${contentRoot}; keeping the checked-in content snapshot.`);
    process.exit(0);
  }
  throw new Error(`Portfolio source not found at ${contentRoot}`);
}

const config = JSON.parse(await readFile(configPath, "utf8"));
const vaultRoot = path.resolve(contentRoot, "..");

const cleanText = (value = "") => value
  .replace(/<br\s*\/?>/gi, " ")
  .replace(/[`*_~]/g, "")
  .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
  .replace(/\s+/g, " ")
  .trim();

const toAnchor = (value) => cleanText(value)
  .normalize("NFKC")
  .toLowerCase()
  .replace(/[—–]/g, "-")
  .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
  .replace(/^-+|-+$/g, "") || "section";

const slugify = (value) => toAnchor(value).replace(/^\d+-?/, "") || "project";

const stripFrontmatter = (markdown) => markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");

const selectPublicRange = (markdown, project) => {
  let selected = stripFrontmatter(markdown);
  if (project.startAt) {
    const start = selected.indexOf(project.startAt);
    if (start >= 0) selected = selected.slice(start);
  }
  if (project.endBefore) {
    const end = selected.indexOf(project.endBefore);
    if (end >= 0) selected = selected.slice(0, end);
  }

  const lines = selected.split(/\r?\n/);
  const kept = [];
  let skippingTodo = false;
  for (const line of lines) {
    if (/^>\s*\[!todo\]/i.test(line)) {
      skippingTodo = true;
      continue;
    }
    if (skippingTodo && /^>/.test(line)) continue;
    if (skippingTodo && !/^>/.test(line)) skippingTodo = false;
    kept.push(line);
  }
  return kept.join("\n").trim();
};

const copiedNames = new Map();
const copyMedia = async (sourcePath, projectSlug) => {
  if (!(await exists(sourcePath))) return null;
  const extension = path.extname(sourcePath).toLowerCase();
  const base = path.basename(sourcePath, extension)
    .normalize("NFKC")
    .replace(/[^\p{Letter}\p{Number}-]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "artifact";
  const identity = path.resolve(sourcePath);
  const shortHash = createHash("sha256").update(identity).digest("hex").slice(0, 7);
  const filename = `${base}-${shortHash}${extension}`;
  const key = `${projectSlug}/${filename}`;
  if (!copiedNames.has(key)) {
    const destinationDir = path.join(mediaRoot, projectSlug);
    await mkdir(destinationDir, { recursive: true });
    await copyFile(sourcePath, path.join(destinationDir, filename));
    copiedNames.set(key, true);
  }
  return `/media/projects/${projectSlug}/${filename}`;
};

const rewriteMedia = async (markdown, sourceDir, projectSlug) => {
  const wikiPattern = /!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const standardPattern = /!\[([^\]]*)\]\(([^\s\)]+)(?:\s+"[^"]*")?\)/g;
  let result = markdown;

  for (const match of [...result.matchAll(wikiPattern)]) {
    const rawTarget = match[1].trim();
    const candidates = [
      path.resolve(vaultRoot, rawTarget),
      path.resolve(sourceDir, rawTarget),
    ];
    const sourcePath = candidates.find((candidate) => candidate.startsWith(vaultRoot)) || candidates[0];
    const publicPath = await copyMedia(sourcePath, projectSlug);
    result = result.replace(match[0], publicPath ? `![Project artifact](${publicPath})` : "");
  }

  for (const match of [...result.matchAll(standardPattern)]) {
    const rawTarget = match[2];
    if (/^(https?:|data:|\/)/.test(rawTarget)) continue;
    const publicPath = await copyMedia(path.resolve(sourceDir, decodeURIComponent(rawTarget)), projectSlug);
    if (publicPath) result = result.replace(match[0], `![${match[1] || "Project artifact"}](${publicPath})`);
  }

  return result;
};

const directories = (await readdir(contentRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
  .map((entry) => entry.name);

const configuredFolders = new Set(config.projects.map((project) => project.folder));
const automaticProjects = directories
  .filter((folder) => !configuredFolders.has(folder))
  .map((folder, index) => ({
    folder,
    slug: slugify(folder),
    order: config.projects.length + index + 1,
    featured: false,
    protected: true,
    previewOnly: false,
    title: folder.replace(/^\d+\s*/, ""),
    eyebrowEn: "Selected work",
    eyebrowZh: "项目作品",
    year: "",
    accent: "paper",
    summaryEn: "Project details are being prepared.",
    summaryZh: "项目内容正在整理中。",
    heroEn: "A new case is taking shape.",
    heroZh: "一个新的项目正在成形。",
  }));

await rm(mediaRoot, { recursive: true, force: true });

const projects = [];
for (const project of [...config.projects, ...automaticProjects]) {
  const folderPath = path.join(contentRoot, project.folder);
  const folderEntries = (await exists(folderPath))
    ? await readdir(folderPath, { withFileTypes: true })
    : [];
  const availableMarkdown = folderEntries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
  const entry = project.entry || availableMarkdown[0] || null;
  const sourcePath = entry ? path.join(folderPath, entry) : null;
  const raw = sourcePath && await exists(sourcePath) ? await readFile(sourcePath, "utf8") : "";
  const selected = selectPublicRange(raw, project);
  const body = project.previewOnly ? "" : await rewriteMedia(selected, path.dirname(sourcePath || folderPath), project.slug);
  const headings = body.split(/\r?\n/)
    .map((line) => line.match(/^(#{1,2})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => ({
      depth: match[1].length,
      label: cleanText(match[2]).replace(/^\d+\s*[—–-]\s*/, ""),
      id: toAnchor(match[2]),
    }));

  projects.push({
    ...project,
    hasSource: Boolean(raw),
    sourceFile: sourcePath ? path.relative(contentRoot, sourcePath) : null,
    sourceChecksum: raw ? createHash("sha256").update(raw).digest("hex").slice(0, 12) : null,
    status: project.previewOnly || !raw ? "in-progress" : "published",
    body,
    headings,
  });
}

const snapshot = {
  schemaVersion: config.schemaVersion,
  site: config.site,
  projects: projects.sort((a, b) => a.order - b.order),
};

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Synced ${projects.length} projects from ${contentRoot}`);
