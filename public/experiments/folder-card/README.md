# Project Card before / after

- Comparison: http://localhost:3001/experiments/folder-card/index.html
- Original standalone material study: http://localhost:3001/experiments/folder-card/material-study.html
- Homepage integration: http://localhost:3000/#work

Before is a frozen copy of the mainline card, globals and motion CSS at preview dacaf5c (captured before replacement). Only relative dependency imports are adjusted for the isolated bundle. After runs components/ProjectFolderCard.tsx with app/project-folder.css, the same component integrated on the homepage. Both use the exact same frozen card props, translations, and the homepage CustomCursor / SiteControls implementation. Only project navigation uses an anchor adapter to target localhost:3000 instead of the comparison server.

Use project buttons to compare all three projects. “同时展开” opens both versions; “全部收起” closes both. Language/theme controls apply to both. Agentation remains available. No Obsidian sync is run by the comparison build; data is a minimal card snapshot, not case-study bodies.

To rebuild after changing the integrated component:

```sh
node public/experiments/folder-card/build-comparison.mjs
```

The original demo.js/style.css/cover.webp remain available for the standalone material study. No archive branch or tag is created.
