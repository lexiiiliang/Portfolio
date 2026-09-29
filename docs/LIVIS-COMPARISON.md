# Livis decision 03 comparison

This local experiment starts from `preview` at `7462170` on
`experiment/livis-source-comparison`. The temporary worktree is
`Portfolio Site - Livis Comparison`, served on port 3001.
The user approved pushing this experiment, integrating it through `preview` into
`main`, and deploying production on 2026-09-29.

The user supplied four replacement diagrams: `问题.png`, `方案1.png`,
`方案2.png`, and `方案3.png` from their Desktop `Livis/方案对比` folder.
Byte-identical copies live in `public/media/livis-comparison/`.
`content/livis-comparison.json` records their dimensions, checksums, labels and
alt text transcribed from the diagrams. These presentation assets replace only
the old three-column comparison in decision 03. Original imported assets are
unchanged. A subsequent user-approved wording correction replaces
「待办 · 任务名称」with「任务 · 任务标题名称」in the selected paragraph; the
canonical Obsidian Markdown was updated first, then the snapshot was regenerated.

Desktop presents a persistent problem on the left and one solution on the right.
The switcher is integrated into the solution panel with a matching image
background and an active underline. It supports clicks, arrow keys, Home and End.
External headings, image borders and image enlargement were removed following
user feedback; desktop column spacing is 8px. At 600px and below the panels stack.
The problem remains mounted during solution changes, and only the selected
solution image is mounted/requested.

For future replacements, update the originals and their manifest metadata, then
run `npm run media:livis`. This now prepares both source-document media and the
additional comparison diagrams; verified unchanged derivatives are reused to
avoid unnecessarily regenerating videos. Run `npm run verify:livis-media` and
`node scripts/verify-livis-source.mjs`, then build with `npm run build:vercel`.

Browser evidence is kept locally in `output/playwright/livis-comparison/`.

Verified at 1440, 884, 600 and 390px: all three tabs by mouse and keyboard,
constant comparison height, persistent problem image, on-demand solution requests,
light/dark presentation, no horizontal
overflow or browser errors, and homepage → Livis navigation. A pre-existing
mobile chapter-menu issue (invisible links occupying space while collapsed) was
fixed with a Livis-scoped selector and checked through expand/collapse.
Production build, TypeScript, targeted ESLint, media/source verification and
`git diff --check` pass.

Feedback revision verified at 1436×774, 884×774 and 390×774: removed headers and
zoom affordances, borderless images, integrated tabs, exact approved copy and
reduced spacing. Click/keyboard switching and stable layout remain verified.
Agentation stays available in the port 3001 development preview.

The next approved narrative revision aligns the message-source subsection with
all three new diagrams. It explains choosing option 3 to establish task identity
before reading, compares card space and trailing-entry discoverability, and
retains the COT entry/IM framework implementation tradeoff. The canonical
Markdown and generated snapshot are synchronized; source verification and the
rendered browser copy both pass.

The latest user revision removes the separate option 1 and option 2 explanatory
paragraphs, keeping the option 3 decision and tradeoff. It also replaces the
hero placeholder with the supplied 1920×1080 cover, preserving the full 16:9
composition. The byte-identical original is `public/media/livis-cover/cover.png`;
`content/livis-cover.json` records its checksum and dimensions. The standard
media generator/verifier now includes this cover. Responsive WebP is eagerly
loaded with high fetch priority. Desktop 1436px and mobile 390px browser checks
passed for the cover, removed paragraphs, retained option 3 and tab interaction;
source/media verification, TypeScript, targeted ESLint and diff checks passed.

Release validation (2026-09-29): production build, TypeScript, targeted ESLint,
source/media verification and diff checks passed. The release uses the checked-in
content snapshot; the clean canonical Obsidian checkout is at
`46b6bd885762b2e3c0e2ca884e87a7ea531976b7`. Local browser verification confirms
homepage navigation, the cover, one-line title and solution switching.
