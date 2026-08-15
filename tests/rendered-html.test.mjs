import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

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
  assert.match(html, /I design how people/);
  assert.match(html, /Alive Briefing/);
  assert.match(html, /From Query to Quest/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
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
