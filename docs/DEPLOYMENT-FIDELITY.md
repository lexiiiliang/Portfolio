# Local and production visual parity

The 2026-09-14 reference is the localhost rendering of Portfolio commit `38d66f3`, including its existing explicit frost image layer. Keep the cover geometry, blur strength, flap tint, and hover/open choreography unchanged.

## Production-only backdrop regression

The local development runtime is vinext/Vite; Vercel builds with Next.js/Turbopack. The CSS optimizer deduplicates `backdrop-filter` and `-webkit-backdrop-filter`. When the prefixed declaration came last, production emitted only that declaration and Chromium computed the backdrop as `none` even though `CSS.supports("backdrop-filter", "blur(30px)")` was true.

Keep the standard declaration last in both light and dark folder rules. `scripts/verify-production-css.mjs` inspects the actual `.next/static` CSS after every Vercel build and fails if either standard blur declaration disappears. The explicit frost image is retained to match the requested local reference.

## Font reference

The reference localhost font cache pointed Geist and Geist Mono at a previous filesystem location. Both font requests failed, so both slots actually rendered the `sans-serif` fallback. These stacks are now explicit in global CSS and no longer depend on broken font requests. The handwritten Covered By Your Grace face remains unchanged. Loading Geist later is a visual design change, not a deployment fix.

## Image density

The vinext `Image` shim generated a `50w` descriptor for the unoptimized 50px timeline logos, while Next.js omitted `srcset`. Although the PNG bytes were identical, the browser used different density metadata and resampling. Timeline logos now use the same explicit native image markup in both runtimes, preserving the localhost reference.

## Reproducible release content

`npm run build:vercel` consumes the versioned `content/*.generated.json` and `public/` assets directly. It does not import fresh Obsidian content. Review content changes locally with the existing sync workflow before committing the release snapshot.

## Verification

- Build: `npm run build:vercel` (includes production CSS verification and TypeScript).
- Recheck an existing build: `npm run verify:production-css`.
- Compare actual browser renders at identical viewport, language, theme, scroll, and interaction state. Current comparison covers 1440 × 1000 desktop and 390 × 844 mobile, English/Chinese, light/dark, homepage sections and folder rest/hover/open states.
- Exclude only development tooling and pointer overlays from static comparisons. Check ordinary animation and navigation separately.
- The existing rendered-HTML tests have stale assertions for the Chinese bio and the first project (`alive-briefing` instead of the approved `livis` order). These content assertions already disagree with the reference commit and are not evidence of this CSS regression.
