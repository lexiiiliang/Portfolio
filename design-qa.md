# Selected Work folder interaction — Design QA

## Evidence

- Reference: `/var/folders/w7/c1j9jf5d0clc548_p_6q53l00000gp/T/codex-clipboard-a790c073-0e41-4db8-bb7f-d56a8a9c9ccf.png`.
- Closed desktop state: `.design-qa/final-closed-1195x1000.png`.
- Hover desktop state: `.design-qa/final-hover-1195x1000.png`.
- Open desktop state: `.design-qa/final-open-clean-1195x1000.png`.
- Closed and open mobile states: `.design-qa/final-mobile-closed-509x734.png` and `.design-qa/final-mobile-open-509x734.png`.
- Side-by-side comparison input: `.design-qa/reference-vs-implementation.png`.
- Desktop CSS viewport: `1195 × 1000`; mobile CSS viewport: `509 × 734`.
- States checked: closed, hover, open, close, one-open-at-a-time, desktop, mobile, and reduced-motion CSS path.

## Reference comparison

The implementation follows the reference's structural idea rather than its placeholder copy: a rounded inner sheet sits behind an asymmetrical folder front; tags, title, project category, index, and year remain on the front cover; the TL;DR sheet extends upward while the cover's bottom edge remains fixed.

The user's portfolio content and existing project artwork were retained. The extracted paper is intentionally shorter than the placeholder reference after annotation feedback, so Problem / Approach / Status and the full-case link form a compact block without a large empty gap.

## Interaction checks

- The exposed upper sheet is the click target; no visible TL;DR button remains on the cover.
- On fine pointers, hovering only the exposed sheet raises it by `12px` (`translateY(82px)` to `translateY(70px)`).
- A real pointer click opened the first card without changing page scroll position.
- Closed height measured `580px`; open height measured `840px`.
- The cover's document-space bottom edge measured `1785.046875px` before and after opening (`0px` delta).
- Closing from the sheet header returned to `580px` while keeping the same bottom edge.
- The cover-level full-case arrow was removed. The project title remains the direct full-case link, and the expanded sheet retains the explicit full-case CTA.
- Only one project can be open at a time; Escape closes the open sheet and returns focus to the upper-sheet trigger.
- The invisible sheet trigger has an accessible label and keyboard focus treatment; the open sheet exposes a visible close control.

## Responsive and visual checks

- At `1195px`, the three folders share one baseline; an open sheet overlaps the section divider as requested while neighboring covers remain stationary.
- At `509px`, direct tap opens the sheet upward; closed height is `570px`, open height is `830px`, and the document-space bottom edge has a `0px` delta.
- Tags render with one outline only after restricting the pill rule to direct children.
- No horizontal page overflow was observed at the mobile viewport.
- The browser console showed no warnings or errors during the interaction checks.

## Verification

- `npm run lint` passed.
- `npm run build` passed.
- No actionable P0, P1, or P2 visual or interaction findings remain.

final result: passed
