# Livis case

`/projects/livis` presents the complete approved Chinese narrative using the existing From Query to Quest reading style. Its sole content source is `02 Project Gallery/Project02 Livis 理想AI眼镜/Livis Agent 任务大师_精修版.md` under the content root resolved by `scripts/sync-portfolio-core.mjs`, together with its nine images and two videos. The cover has not been supplied and is explicitly marked “封面占位”. Chinese content stays untranslated in either site language.

`scripts/sync-livis-case.mjs` reads the source without modifying Obsidian. It stores the original Markdown, source checksum, render Markdown, and media provenance in `content/livis.generated.json`. Only media URLs change in the render Markdown. Files copied to `public/media/livis-final` preserve the original bytes; images keep their aspect ratios and videos use native playback controls. `lib/livis-case.ts` parses this snapshot for `components/LivisCase.tsx`; `app/livis-case.css` supplies surface-specific styling.

Run from the repository root:

```sh
# Refresh all content, including Livis (also runs before npm run dev).
npm run content:sync

# Or refresh only this case.
node scripts/sync-livis-case.mjs

# Verify verbatim source, reversible URL remapping, and media SHA-256 equality.
node scripts/verify-livis-source.mjs

# Static checks for this implementation.
npx tsc --noEmit -p tsconfig.vercel.json --incremental false
npx eslint components/LivisCase.tsx lib/livis-case.ts scripts/sync-livis-case.mjs scripts/verify-livis-source.mjs
git diff --check

# Local experiment preview.
npm run dev -- --port 3002
```

Review at [localhost:3002/projects/livis](http://localhost:3002/projects/livis). Synchronization is a snapshot step, not an automatic live Livis watcher; rerun it after source edits. When the Markdown source is unavailable, the importer warns and retains the checked-in snapshot. Source verification requires access to the original Markdown and media.

The build/review handoff records a reversible full Markdown import, eleven byte-identical media files, and an exact rendered text match after whitespace removal. It also records passing TypeScript/targeted lint, no page overflow across tested 320–1440px viewports, and passing keyboard/mobile TOC and video checks. Text evidence is in `.impeccable/review/livis-text-verification.json`; the saved checker `.impeccable/review/livis-text-check.mjs` requires the Playwright session named `livis-feedback` to be open on this route. These are build/review results, not checks repeated by this documentation pass.

The surface brief is `.impeccable/surfaces/route-projects-livis.md`. The existing Query-scoped `DESIGN.md` and its sidecar remain unchanged. No deployment is implied by the review's ship disposition.

The feedback revision presents the If/Then block as two connected category containers, formats Hero facts using the shared three-column label/value pattern, and groups the three numbered decision links beneath a “设计决策” parent label; other chapter links remain primary. Full article headings remain unchanged. The TOC overrides are optional and affect Livis only.

Command quotation tags and double quotes were explicitly requested in feedback. All six commands share this treatment. Elements marked `data-livis-presentation` hold added classifications/quote marks and are excluded from original-text parity verification; source command wording and media remain unchanged.

Hero role reads “UI/UX” directly from the Markdown metadata, merged back into the source at the user’s explicit request. The source no longer includes the detailed scope paragraph, so the Hero now omits the “职责范围” disclosure. The two One more thing videos share equal columns above 760px and stack on smaller screens.

The latest source revision removes the Hero background paragraph and updates the first two challenge paragraphs. Hero rendering locates metadata by its source field rather than fixed paragraph positions. The user-supplied “车机任务大师mockup.jpeg” is copied unchanged into the source media folder and referenced after the first challenge paragraph. JPEG dimensions are read during synchronization, and existing media URLs remain stable when new images are inserted.

The current TOC presents 挑战, a 设计决策 group containing the three numbered child links, 成果与复盘, and One more thing. Core goal and message subsection headings remain in the article with anchors, but are omitted from the TOC. Core goal heading, question, and MVP principles share one tinted container, with the main question prominent and a fine rule separating supporting goals. Goals form three columns when their container is at least 720px wide, otherwise aligned label/body rows. The 192px chapter rail retains the shared active marker and mobile disclosure. Verified at 1237px, 884px, and 390px, including keyboard navigation and unchanged source text.

The decision TOC group automatically opens while a numbered decision is active and closes outside that region. Its parent button also supports manual expansion/collapse; crossing a chapter boundary restores scroll-driven behavior. Child guide lines are removed. The active marker centers at 24px from the list edge for child links, versus 11px for primary links; it falls back to the parent when the active group is manually closed. Reduced motion, direct hash navigation, mobile disclosure, and keyboard navigation are supported.
