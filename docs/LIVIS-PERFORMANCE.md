# Livis loading optimization — September 20, 2026

## Version and integration

Remote refs were fetched before editing. The standalone `codex/livis-agent-page`
branch ends at `cc75e46`; the newer integration and navigation fixes are
`da39160` and `74b8957`, already present on both `main` and `preview`.
This change uses `preview` at `c66ad5d`, retaining the latest homepage loading and
return-navigation improvements. Livis remains linked from the homepage at
`/projects/livis`.

The original approved Markdown and all 11 imported source files are unchanged.
The source snapshot checksum is
`95a5ad5881181ef3db92043395bff53f9c74868a5abc879336e137806d02942a`.
The build consumes checked-in snapshots and assets, without accessing Obsidian.

## Findings on the existing production page

- `/projects/livis` explicitly forced dynamic rendering despite using a fixed
  public content snapshot. The live response was `x-vercel-cache: MISS`, with
  `private, no-cache, no-store, max-age=0, must-revalidate`. Its response path was
  `sin1::iad1`. One browser sample measured 2.56 s to first byte and 10.33 s to
  the load event; an independent curl sample measured 3.89 s to first byte.
  These are individual network samples, not a general latency guarantee.
- Nine images used their original 1179–3200 px files, totaling 3,928,679 bytes.
  A single 3200 px PNG was 1,655,895 bytes.
- Both videos used `preload="metadata"` and started requests before the reader
  reached them. Their MP4 indexes were at the end, causing additional range
  requests. Six video requests appeared on each controlled initial visit.
- The footer recommended Alive Briefing even though its homepage entry is
  already marked Coming Soon.

## Changes

- Removed the unconditional dynamic-rendering override. Next.js prerenders the
  public project snapshots. Local production responses confirm
  `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`, and `s-maxage=31536000`.
  The existing conditional `cookies()` password check remains; no `force-static`
  override bypasses it. See the [Next.js caching reference](https://nextjs.org/docs/app/guides/caching-without-cache-components).
- Generated WebP derivatives at several widths, capped at the source width or
  1760 px. Native `srcset` and layout-specific `sizes` select an appropriate file;
  lazy loading, async decoding, original aspect ratios and alt text remain.
  Derivatives use quality 90 and are not pixel-identical to the originals.
- Videos keep native controls and use `preload="none"`, explicit dimensions,
  and first-frame posters totaling 5,820 bytes. AVFoundation passthrough moves
  the index before the media data without re-encoding the audio or video.
  Encoded sample counts and SHA-256 hashes match per track for both clips.
- Derivative URLs contain hashes of the actual output bytes, so only this asset
  directory receives `public, max-age=31536000, immutable`. Original filenames
  retain their previous cache policy. A source-hash mismatch cannot silently
  display an obsolete derivative.
- Footer recommendations skip Alive Briefing. Livis leads to From Query to
  Quest, which leads back to Livis. This hides the stale recommendation; it does
  not delete the archived content or disable direct access to the old URL.

## Controlled comparison

Native Next.js production builds, served from the same localhost port. Chrome,
fresh context and cache disabled per run, 4 Mbps download, 120 ms emulated
latency, 4× CPU slowdown, 2× display density. Three runs per viewport; timing
values below are medians. Desktop is 1440 × 1000; mobile is 390 × 844.

| Metric | Before | After |
| --- | ---: | ---: |
| Desktop load event | 1.703 s | 1.026 s |
| Mobile load event | 1.725 s | 0.947 s |
| Desktop FCP / LCP | 0.520 s | 0.544 s |
| Mobile FCP / LCP | 0.520 s | 0.548 s |
| Desktop images across the full article | 3,928,679 B | 673,148 B |
| Mobile images across the full article | 3,928,679 B | 548,944 B |
| Video requests before interaction | 6 | 0 |
| Initial layout shift score | 0 | 0 |

The load event improves about 40% on desktop and 45% on mobile. Image transfer
across a complete read falls 83% and 86%, respectively. Text paint is effectively
unchanged; these results do not establish an LCP improvement. Local results do
not measure the benefit of eliminating the live cross-region dynamic render.
That must be rechecked after an authorized production deployment.

Raw data and browser checks are in `output/playwright/livis/`.

## Maintenance and verification

After explicitly syncing a new approved Livis source, regenerate the display
assets with `npm run media:livis`. Image preparation uses the pinned `sharp`
dependency; video preparation uses macOS AVFoundation via
`scripts/prepare-livis-video.swift`. Deployment does not execute this generator.

`npm run verify:livis-media` verifies original and derivative checksums, decodes
every image, checks proportions and dimensions, and validates MP4 index placement
and posters. `npm run build:vercel` runs this check before building, so stale or
missing derivatives cannot be released accidentally.

`node scripts/verify-livis-source.mjs` separately compares the snapshot and
original media with the local approved Obsidian document. It passed for this
change, as did TypeScript, targeted ESLint, production build, production blur
verification, and `git diff --check`.

Browser checks passed at 1440, 884 and 390 px, including dark mode, every image
decoding, no page overflow, chapter navigation, both videos started by keyboard
and seeking to their ends, the correct next-project destination, returning home
without a document reload, and reopening Livis from the homepage. No application
JavaScript errors occurred in these completed checks. The six sections and media
also remain readable with JavaScript disabled. Native Next.js preview is running
at [localhost:3000/projects/livis](http://localhost:3000/projects/livis).

No external image-hosting service is needed for these changes. Measure the
released page on the intended visitor networks before adding hosting, domain
configuration and another cache layer. Original assets remain available locally.

## Production release

Deployed with explicit user approval on September 20, 2026 at 22:29 China time.

- Production: [www.lianglezhi.site/projects/livis](https://www.lianglezhi.site/projects/livis).
- Deployment: `dpl_BMExLkfXEwLpg3cMXRn2Pms22wk7`, status `READY`.
- Deployment URL: `https://lexi-liang-portfolio-dch6od06x-lexiiiliang.vercel.app`.
- Cloud build: Next.js 16.2.6, completed in 21 seconds; media verification,
  TypeScript, static project generation and production blur checks passed.
- Source: the verified `preview` working tree based on
  `c66ad5da17d7de7b08a3905e564059545a94cc32`, including uncommitted Livis changes.
  The base commit alone does not contain this release. Deployment preceded the
  Git commit; no `main` merge was performed. The content snapshot and originals
  are unchanged.
- Immediate rollback target: `dpl_FQS3PmtG3rwmoZxZTwEzqY3ti9Y6`.
  To restore it, use `vercel rollback dpl_FQS3PmtG3rwmoZxZTwEzqY3ti9Y6` from
  the linked project, with scope `team_Vpn0yIJMQMVjySD863uzh0vV`.

The canonical production alias was independently resolved to the new deployment.
Live desktop and mobile checks both returned HTTP 200, `x-vercel-cache: HIT`,
and `x-nextjs-prerender: 1`. Optimized assets return
`public, max-age=31536000, immutable`. All nine images decode, both videos play,
and neither video is requested before interaction. No old Alive Briefing link
remains in the footer. The next-project link, return home without document reload,
and reopening Livis all pass. No application JavaScript errors or failed
same-origin requests were observed; the initial deployment-scoped runtime
error/fatal log scan returned no entries.

Individual live samples measured desktop TTFB 1.96 s / load 5.52 s and mobile
TTFB 1.82 s / load 4.75 s. These use the actual network, not the controlled local
test conditions, and are not a guarantee or a directly comparable benchmark.

Release source hashes and rollback provenance are recorded in
`output/releases/livis-production-2026-09-20.json`. Live browser results and
screenshots are in `output/playwright/livis/production-verification.json` and
`production-desktop.png` / `production-mobile.png`. Local preview remains
available at [localhost:3000/projects/livis](http://localhost:3000/projects/livis).

The subsequent `perf: optimize Livis loading and hide outdated project link`
commit records the deployed implementation, optimized assets and maintenance
scripts on `preview`. All 43 implementation file hashes were checked against the
production release receipt before committing. Browser logs, screenshots and
machine-local release evidence remain outside the commit.
