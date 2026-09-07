import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function renderHome() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders Lexi's portfolio landing page", async () => {
  const response = await renderHome();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Lexi Liang — Interaction Designer<\/title>/i);
  assert.match(html, /This is/);
  assert.match(html, /I’m an AI product designer with 2 years of experience/);
  assert.match(html, /我是一位拥有 2 年经验的 AI 产品设计师/);
  assert.match(html, /很高兴在这里遇见你/);
  assert.match(html, /contact-morph/);
  assert.match(html, /CV link coming soon/);
  assert.match(html, /\/media\/cursor-tracker\/cursor-sprite\.webp/);
  assert.match(html, /\/media\/cursor-tracker\/click-wink\.mp4/);
  assert.match(html, /Alive Briefing/);
  assert.match(html, /From Query to Quest/);
  assert.match(html, /Education and work timeline/);
  assert.match(html, /Huazhong University of Science and Technology/);
  assert.match(html, /Umeå Institute of Design/);
  assert.match(html, /Delft University of Technology/);
  assert.match(html, /SenseTime/);
  assert.match(html, /Microsoft/);
  assert.match(html, /Li Auto/);
  assert.match(html, /\/media\/about-timeline\/sensetime\.png/);
  assert.doesNotMatch(html, /Useful intelligence should expand human judgment/);
  assert.doesNotMatch(html, /Back to top|回到顶部/);
  assert.match(html, /theme-switch-icon/);
  assert.doesNotMatch(html, /01 \/ SELECTED WORK/i);
  assert.doesNotMatch(html, /收起|>Close</i);
  assert.doesNotMatch(html, /Selected work · 2026/i);
  assert.doesNotMatch(html, /Versioned from Obsidian/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps a versioned portfolio content snapshot", async () => {
  const raw = await readFile(new URL("../content/portfolio.generated.json", import.meta.url), "utf8");
  const snapshot = JSON.parse(raw);
  assert.equal(snapshot.schemaVersion, 1);
  assert.equal(snapshot.site.name, "Lexi Liang");
  assert.ok(snapshot.projects.length >= 3);
  assert.equal(snapshot.projects[0].slug, "alive-briefing");
  assert.equal(snapshot.projects[0].status, "published");
  assert.ok(snapshot.projects[0].sourceChecksum);
  assert.ok(snapshot.projects[0].body.includes("# Provocation"));
  const degreeProject = snapshot.projects.find((project) => project.slug === "from-query-to-quest");
  assert.equal(degreeProject.status, "published");
  assert.ok(degreeProject.body.includes("# Provocation"));
  assert.doesNotMatch(degreeProject.body, /```text[\s\S]*?Dialogue[–-]Action Loop/);
  assert.doesNotMatch(degreeProject.body, /Reference ·|Archived Reference/);
  assert.doesNotMatch(degreeProject.body, /<br\s*\/?\s*>/i);
  assert.equal(degreeProject.video.pageUrl, "https://vimeo.com/1218556665");
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
