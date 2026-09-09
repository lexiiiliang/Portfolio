# From Query to Quest finish review

Disposition: **fix**

## 1. Direction fidelity

The replacement direction is present in the render. The serif project title, left question/right facts composition, original blue/lilac cover, narrow prose, wide artifacts, and pale blue chapter surfaces form a coherent project-detail reading experience. This is consistent with the pinned reference disciplines; it does not imitate the reference sites' landing pages or import their imagery.

`desktop.png` places the cover at approximately 405px, close to the contract's 400px. `mobile.png` shows the two-line title, stacked facts, and complete original cover in the first viewport. `desktop-principles.png`, `desktop-interaction.png`, and `desktop-afterword.png` demonstrate meaningful changes of density and image/text width across the long case. The direction does not need a rebuild.

This is code-led work with no approved image comp; an image-comp reproduction checkpoint is not applicable.

## 2. Craft-floor checks

All nine supplied final-round images were opened: desktop, mobile, mobile body, mobile image viewer, desktop principles, desktop interaction, desktop afterword, desktop dark, and desktop dark afterword. They are loaded, legible captures of the named regions or states. The last capture includes the preceding chapter and the dark afterword opening; it does not establish the entire dark afterword body by itself.

The hierarchy and whitespace pass: 17px mobile/18px desktop body, generous leading, constrained Chinese copy, and distinct serif chapter openings. Original images retain their aspect ratios. Source-supplied chapter numbers and “Design Challenge” are content, not added decoration. There is no card-grid scaffold, gradient lettering, invented illustration, or decorative metric system. The detector reports `[]`.

Body contrast is healthy in both themes. Two authored secondary states need correction: selected text in dark mode and small muted text on tinted light sections (F2). Keyboard focus is visibly clear in `desktop-interaction.png`. The sticky navigation and image expansion affordance remain subordinate to the work.

## 3. Content and behavior

`content-verification.json` records all 73 public text blocks present, 17 image links, and no editorial workspace or old placeholder in the rendered page. The renderer consumes the generated source snapshot; it does not introduce replacement case copy. The snapshot carries original filenames, dimensions, and SHA-256 provenance, and `QueryCaseFigure` uses unoptimized original media. The build thread independently verified all 17 files byte for byte against their sources.

The supplied checks cover TypeScript, scoped lint, production build, mobile document overflow, keyboard chapter navigation, reduced motion, dialog Escape/focus return, and the zoom button. The implementation keeps content visible before JavaScript and uses native image links as a fallback. These checks were supplied by the build thread; this review did not run a browser or rerun tests.

The remaining behavior gap is the viewer's promised fit-to-screen state (F1).

## 4. Material findings

| ID | Before / evidence | After | Why |
| --- | --- | --- | --- |
| F1 | `mobile-image-viewer.png` shows the 370px dialog flush against the top-left of a 390px viewport. `app/query-case.css:189` does not restore dialog margins after Tailwind's margin reset. At lines 203–205 the unzoomed image is always 100% wide and its container scrolls vertically: the original 690 × 865 research image therefore cannot fit as a whole at desktop dialog widths. | Center the dialog with explicit margins. In the unzoomed state, contain the entire image within the available viewport area while keeping the controls/caption usable; remove that height constraint only for scrollable zoom. Retain Escape and focus return. | The current state does not deliver the direction contract's fit-to-screen/zoom distinction, especially for the original portrait research artifact. This is a viewer-only correction, with no image-file changes. |
| F2 | `app/query-case.css:38` uses dark-theme foreground `#f0f2ee` on the fixed selection background `#b9cdf2`: approximately **1.43:1**. Light muted text `#6c706e` on the tinted chapter surface `#eef1f7` is approximately **4.44:1**, below the 4.5:1 small-text floor. | Give selection an explicit legible foreground/background pair in each theme, and slightly darken or blue-tint the muted text used on light tinted sections. Verify the resulting pairs meet 4.5:1. | Selecting text is part of reading/copying a case; it must remain legible. Captions and supporting text also need to meet the same floor on their actual section surface. |

No copy, image, hero composition, or section-pacing changes are requested.

## 5. Verdict

**fix** — apply F1 and F2 in one scoped batch. Return the same viewport captures with an updated mobile viewer, plus a desktop fit-state capture of original image 04 and one dark selected-text capture. The verdict pass should score these two findings only. The source-fidelity and visual-direction assessments above stand.

## Verdict pass — correction batch 1

Disposition: **ship** at the scope of F1 and F2. Both listed findings are **resolved**.

| Finding | Score | Evidence |
| --- | --- | --- |
| F1 — centered viewer and complete fit state | Resolved | Opened `desktop-image-viewer-fixed.png` and `mobile-image-viewer-fixed.png`. Both show the entire original portrait research image, a centered dialog, and reachable controls/caption. `app/query-case.css:193` adds `margin: auto`; lines 204–206 constrain the unzoomed image height with `object-fit: contain` and remove the constraint in zoom mode. Supplied browser measurements confirm desktop image/viewer/scroll height are all 574px, mobile fit succeeds, zoom remains scrollable, and Escape restores focus. |
| F2 — secondary text and selection contrast | Resolved | `app/query-case.css:17` now uses `#636b66` against `#eef1f7`, independently recalculated at **4.85:1**. Line 38 uses `#153251` on `#bdd2fa`, independently recalculated at **8.56:1**; the fixed selection colors do not inherit the dark theme's light ink. The build thread also verified the computed selection colors in dark mode. This verdict uses code, contrast calculations, and supplied browser measurements; no selected-text screenshot was supplied. |

This pass reviewed only the two listed corrections. No new defect hunt or whole-surface reassessment was performed. The build can proceed to documentation.
