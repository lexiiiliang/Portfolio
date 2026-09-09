---
name: "From Query to Quest case detail"
description: "Original artifacts on a quiet reading surface; scoped to /projects/from-query-to-quest."
colors:
  query-blue: "#154bc0"
  query-blue-dark: "#a5befb"
  query-ground: "#fafaf8"
  query-ink: "#242723"
  query-body: "#4c504d"
  query-muted: "#697069"
  query-tint: "#eef1f7"
  query-rule: "#dadfdc"
  query-ground-dark: "#161918"
  query-ink-dark: "#f0f2ee"
  query-body-dark: "#c4cbc5"
  query-muted-dark: "#a0aba3"
  query-tint-dark: "#202934"
  query-rule-dark: "#38413b"
  query-selection-ink: "#153251"
  query-selection-ground: "#bdd2fa"
typography:
  display:
    fontFamily: 'var(--font-geist-sans), "PingFang SC", sans-serif'
    fontSize: "clamp(2.75rem, 4.6vw, 3.5rem)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  headline:
    fontFamily: 'var(--font-geist-sans), "PingFang SC", "Hiragino Sans GB", sans-serif'
    fontSize: "clamp(1.75rem, 2.4vw, 2.125rem)"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "-0.02em"
  label:
    fontFamily: 'var(--font-geist-sans), "PingFang SC", "Hiragino Sans GB", sans-serif'
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0"
  title:
    fontFamily: 'var(--font-geist-sans), "PingFang SC", "Hiragino Sans GB", sans-serif'
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "-0.015em"
  body:
    fontFamily: 'var(--font-geist-sans), "PingFang SC", "Hiragino Sans GB", sans-serif'
    fontSize: "18px"
    lineHeight: 1.85
  metadata:
    fontFamily: 'var(--font-geist-sans), "PingFang SC", "Hiragino Sans GB", sans-serif'
    fontSize: "16px"
    lineHeight: 1.65
  supporting-body:
    fontFamily: 'var(--font-geist-sans), "PingFang SC", "Hiragino Sans GB", sans-serif'
    fontSize: "17px"
    lineHeight: 1.85
  caption:
    fontFamily: 'var(--font-geist-sans), "PingFang SC", "Hiragino Sans GB", sans-serif'
    fontSize: "13px"
    lineHeight: 1.7
  navigation:
    fontFamily: 'var(--font-geist-sans), "PingFang SC", "Hiragino Sans GB", sans-serif'
    fontSize: "13px"
    lineHeight: 1.5
rounded:
  artifact: "16px"
  artifact-mobile: "12px"
spacing:
  compact: "12px"
  related: "24px"
  group: "32px"
  figure-before: "40px"
  figure-after: "48px"
components:
  chapter-link:
    textColor: "{colors.query-muted}"
    typography: "{typography.navigation}"
  chapter-link-current:
    textColor: "{colors.query-ink}"
    typography: "{typography.navigation}"
  challenge:
    backgroundColor: "{colors.query-tint}"
    rounded: "{rounded.artifact}"
    padding: "32px"
---

# Design System: From Query to Quest case detail

## Overview

**Creative North Star: "Original artifacts on a quiet reading surface"**

This records only /projects/from-query-to-quest. Its visual authority is app/query-case.css and the current Query case components. Incumbent landing, shared site chrome, and other project pages keep their existing visual rules.

A unified sans-serif hierarchy, common left alignment, and generous paragraph rhythm frame the original blue/lilac artwork. Desktop chapters sit beside a quiet left directory; mobile exposes that directory through a compact disclosure. The page varies density with source-based image and text groupings.

**Key Characteristics:**

- Geist/PingFang headings and prose with a shared content left edge.
- Source headings split into a smaller label and a larger main sentence.
- Original media with rounded presentation and centered gray captions; all case images are static and non-clickable.
- Desktop chapter rail and mobile collapsible chapter navigation.

## Colors

**Primary:** query-blue carries inline links, focus outlines, and the source's design-challenge heading. Current chapter links use theme ink, a medium weight, and a vertical marker.

**Neutral:** query-ground is the page ground; query-ink marks headings and emphasis; query-body carries prose; query-muted carries captions, labels, and metadata. query-tint is used for the challenge. query-rule separates chapters, lists, and navigation, and outlines keyword chips. Principles and afterword no longer have full-section tinted backgrounds.

**The Legible Selection Rule.** Keep the explicit selection foreground/background pair in both themes. Increased-contrast preferences promote body and muted text to theme ink.

## Typography

The case uses the site's Geist/PingFang sans-serif family throughout; Query Serif and Songti are no longer part of this route's implemented typography. The frontmatter records desktop values. The title is split before “ to ” into two lines, capped at 56px with weight 500; through 1100px it uses 48px. Mobile, through 760px, uses a display clamp of 2.5rem–3.5rem at 9.2vw (40px at the reviewed 390px viewport), 28px chapter titles, 13px labels, 22px subheads, 17px body, and 12px image captions. The hero question is 22px desktop/21px mobile; its introduction uses the 17px supporting-body role also used by mode and interaction passages.

**The Source Heading Rule.** Split each original h2 at its Chinese colon: the prefix becomes the small label and the remaining sentence becomes the main title. Keep both inside one semantic h2; keep the colon available to assistive technology while hiding it visually. This is the user's explicit request for source-derived labels, not permission to invent extra editorial labels.

**The Shared Body Rule.** Every afterword principle is an ordinary source paragraph at the 720px reading measure, using the same 18px desktop/17px mobile body scale as surrounding paragraphs. Its source strong opening remains inline. The three-column, compact-body, and enlarged opening/closing treatments are removed.

## Layout

**The Shared Width Rule.** One article width controls all five chapters. Chapter headings, prose, standalone images, and group wrappers fill that column and share both left and right edges. Descendants have no independent 720px, 760px, or 800px caps. Figure captions center their text within their own full-width figure; grouped text/image units keep their existing internal columns.

Hero and video retain their maximum 1120px container. The case layout owns a maximum 720px article plus a 144px chapter rail and 48px gap, giving a maximum 912px outer width. Through 1100px, the rail becomes 112px and the gap 32px, giving a maximum 864px outer width. These layouts also respect 48px and 32px minimum side gutters respectively. Through 760px, the rail becomes the existing collapsible navigation and the article fills the viewport between 20px side gutters.

The desktop Hero places the cover on the left and the two-line title/question and introduction on the right, using equal columns with a 56px gap. The artwork spans both text rows and centers vertically. A full-width metadata row sits below both columns. Row gaps are 28px, with 12px additional space before metadata. Through 1100px the column gap is 40px. Through 760px, the single-column order is title/question → cover → introduction → metadata with a 32px gap and no extra metadata margin. Hero top/bottom padding is 72px/80px on desktop and 40px/48px on mobile.

Hero metadata spans the full composition below the cover and text in three columns: 时间—2025, 项目类型—硕士毕业设计, and 关键词—#AI #交互范式 #能动性. The duration field is omitted at the user’s request. A 1px theme-rule line separates this row from the main composition, with 28px padding above its content. Labels are muted 13px/500 with 8px below; values are 16px. Only non-clickable keyword spans use 13px text, 1px theme-rule borders, pill corners and 3px/10px padding. Desktop columns are equal with 32px gaps; mobile keeps three columns in 0.6fr:1.2fr:1.5fr proportions, 16px gaps and 24px top padding. Whole keyword chips wrap without reducing type. The user-approved field list is a webpage presentation override; Obsidian remains unchanged.

Desktop chapters have 96px spacing at section boundaries, reducing to 64px on mobile. Paragraphs separate by 24px. Figures have 40px/48px top/bottom margins, reducing to 32px/40px. Subheadings receive more space before than after.

The insight chapter inherits the same article width as the other four chapters; its former special width cap is removed. Its research pair has equal columns and a 24px gap: at the full measure, each frame is 348px × 435px (4:5). Each desktop frame is white with 12px internal padding and contains the complete original image. Through 760px the pair stacks; its frames return to automatic aspect ratio and zero padding, so images use their original proportions.

Storyboard images form three columns and stack through 760px. The two mode groups place text beside its corresponding diagram, and interaction steps pair text with its image; both stack through 1100px. The afterword has no principle-row grouping. All presentation groupings preserve source order.

## Elevation & Depth

**The Flat Reading Rule.** Fine borders and the challenge tint create structure without case shadows or blurred navigation. Mobile navigation has an opaque theme ground.

## Shapes

In-page images, the challenge, and the video use the artifact radius, reducing to the mobile artifact radius through 760px. Desktop research frames retain the artifact radius around a white contain surface; their contained image itself has no corner clipping. Mobile returns the original image to the inherited outer radius. CSS presentation never changes image bytes.

## Components

**Chapter navigation.** The five-link desktop rail sticks 112px from the viewport top. Links have a 44px minimum row height; the current chapter uses theme ink, weight 500, and a 2px vertical marker. Through 760px, an opaque navigation bar sticks below the shared 68px header. Its 52px disclosure button shows the current chapter and exposes aria-expanded/aria-controls. Selecting a link collapses the menu. Keyboard activation updates the hash, scrolls directly, and focuses the chapter heading; pointer activation follows native anchors.

**Figures.** All 17 case images, including the Hero cover, are static. No image links, click handlers, expansion affordances, or lightbox are present. Preserve original proportions, alt text and captions. Research frames retain their existing contain treatment and responsive sizing.

**Video.** The user-provided Vimeo 1218556665 follows the hero and introduction in a rounded 16:9 frame. It keeps Vimeo's playback controls, inline playback, fullscreen support, lazy loading, and an external fallback link. The embed requests hidden title/byline/portrait/badge/logo chrome. The build thread observed that the Vimeo logo remains visible; a logo-free player is not an implemented guarantee or a hard requirement. Video captions use a title/link row rather than the image-caption centering rule.

**Challenge and grouped passages.** The challenge fills the article and combines the existing heading, statement, and associated image in one tinted aside. Its h3, quote, and figure share the same padded inner edges: 32px horizontal padding on desktop and 20px on mobile. The figure has no independent width cap or auto-centering. The research pair, mode pairs, storyboard, and interaction steps group source material without rewriting it. Afterword principles use the ordinary paragraph renderer with inline source emphasis.

**The Visible Before Motion Rule.** Chapter headings remain visible before JavaScript. Their one-time entry moves 14px to rest and changes opacity from 0.55 to 1 over 560ms with cubic-bezier(0.19, 1, 0.22, 1). Reduced motion skips or cancels this entry and disables case transitions. Focus uses a 2px blue outline with 6px offset.

## Do's and Don'ts

### Do:

- **Do** align all five chapters' headings, prose, standalone images, and group wrappers to the same article edges.
- **Do** keep source-derived heading labels faithful to the current Markdown and Hero metadata faithful to the user-approved field list.
- **Do** preserve original image bytes, proportions, alt text, and captions.
- **Do** keep images non-clickable while preserving chapter keyboard navigation and reduced-motion support.
- **Do** retain the external Vimeo playback link.

### Don't:

- **Don't** apply this case-specific system to landing or other project routes automatically.
- **Don't** restore the removed serif hierarchy, centered prose, afterword columns, or enlarged afterword opening/closing treatment.
- **Don't** publish the editorial workspace, invent case copy, or modify the source Markdown.
- **Don't** embed provenance into the rasters; keep it in the generated JSON snapshot.
- **Don't** promise that embed parameters remove Vimeo's logo when the player still shows it.

User-approved reading addition: “基于这些洞察，我将设计回应组织为三项原则，并进一步发展为概念框架。” appears once at the end of the insight chapter, before design principles, using the shared body style. This explicit webpage addition leaves the source Markdown unchanged.
