# Disposition

**ship** — for the requested shared-width correction in the case body. This is a fresh review against the user's rejected screenshot, the eight required current captures, the current CSS/components, and saved DOM measurements. It does not approve a release or the whole portfolio.

# Brief and direction fidelity

| Requirement | Assessment | Evidence |
| --- | --- | --- |
| Eliminate the short prose column beside a wider standalone image | Match | At 1456px, the original problem was real: prose was 720px while the image was 1088px. Current title, prose, figure, and callout all use the same 720px article column. The screenshot no longer contains the user's marked internal blank region. |
| Align challenge title, question, and image | Match | Current callout children share both edges and the same inner width: 656px desktop, 597px at 884px, 310px mobile. The figure has no independent cap or automatic centering. |
| Preserve existing Read composition and groupings | Match | The chapter rail remains separate. Research, mode, storyboard, and interaction grids keep their internal composition inside the shared article edges. Desktop mode text and diagram intentionally remain separate columns. |
| TYPE | Match | Current Geist/PingFang hierarchy, source-derived h2 label plus title, and paragraph styling remain. The user's explicit label request takes precedence over the generic craft-floor label ban. |
| MATERIAL | Match | Existing source images remain raster artifacts with intrinsic proportions. No replacement imagery or simulated material was introduced. |
| Content and interaction boundary | Match | Components retain the approved section-2 transition and static figures. Saved content verification reports 77/77 expected blocks, 17 images, zero interactive image ancestors, and no editorial workspace. |

There is no approved comp to reproduce. This is a narrow correction within the incumbent sans-serif world; the old DESIGN.md description of wider artifacts cannot override the latest request. Its documentation refresh belongs after this correction.

# Evidence coverage

All eight named captures were inspected and are valid for the regions they claim: `desktop-1456-problem.png`, `desktop-1456-challenge.png`, `desktop-1456-principles.png`, `desktop-1456-mode-pair.png`, `user-884-challenge.png`, `user-884-principles.png`, `mobile-390-challenge.png`, and `mobile-390-principles.png`. Each named artifact is visible and loaded. These are viewport crops; partially visible neighboring headings at the sticky header do not invalidate their subject. The blue dot is the existing shared cursor.

`after-geometry.json` gives one identical left/right pair for every measured direct unit in all five chapters: 456.5–1176.5 at 1456px, 176–837 at 884px, and 20–370 at 390px. The desktop scrollbar explains the 15px difference between requested viewport width and document width. No horizontal overflow is evidenced.

The 884px baseline already had matching edges, so those captures alone would not prove the fix. The wide before/after geometry and current 1456px problem capture establish that the original cause was corrected.

# Material findings

None remain within the specified width/alignment scope. The current CSS assigns width ownership to `.query-layout` and removes the competing direct-content caps; this resolves the source of the mismatch across the checked breakpoints. The supplied layout detector result is empty, used only as supporting evidence.

# Craft floor and limitations

The reviewed regions preserve clear type hierarchy, consistent paragraph rhythm, original image proportions, and coherent outer and callout inner gutters. No new visual device or craft-floor violation was introduced by this width change. The user-requested labels must remain.

This is a file-and-capture review without a browser session. It does not independently retest navigation, focus, motion, dark mode, or the full console; the parent reports existing Agentation health-check failures, so no console-clean claim is supported. Dense text embedded in the original mobile images remains small; source-image redesign, cropping, and new image interactions are outside this request. Preserve the shared edges, approved source content, existing groupings, and static-image behavior.
