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

test("redirects the experiment branch root to its standalone page", async () => {
  const response = await renderHome();
  assert.equal(response.status, 307);
  assert.match(
    response.headers.get("location") ?? "",
    /\/experiments\/cursor-tracker\/index\.html$/,
  );

  const html = await readFile(
    new URL("../public/experiments/cursor-tracker/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /Move around\./);
  assert.match(html, /She follows\./);
  assert.match(html, /cursor-sprite\.webp/);
  await access(new URL("../public/experiments/cursor-tracker/styles.css", import.meta.url));
  await access(new URL("../public/experiments/cursor-tracker/cursor-tracker.js", import.meta.url));
  await access(new URL("../public/media/cursor tracker/cursor-sprite.webp", import.meta.url));
  await access(new URL("../public/media/cursor tracker/click wink.mp4", import.meta.url));
});

test("keeps a versioned portfolio content snapshot", async () => {
  const raw = await readFile(new URL("../content/portfolio.generated.json", import.meta.url), "utf8");
  const snapshot = JSON.parse(raw);
  assert.equal(snapshot.schemaVersion, 1);
  assert.equal(snapshot.site.name, "Lexi Liang");
  assert.equal(snapshot.projects.length, 3);
  assert.equal(snapshot.projects[0].slug, "alive-briefing");
  assert.equal(snapshot.projects[0].status, "published");
  assert.ok(snapshot.projects[0].sourceChecksum);
  assert.ok(snapshot.projects[0].body.includes("# 01 — Provocation"));
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
