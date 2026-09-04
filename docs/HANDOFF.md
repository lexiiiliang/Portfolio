# Portfolio Repository Handoff

Last updated: 2026-09-04

This document is the operating contract for the Portfolio and Obsidian repositories. It describes the approved worktree layout, branch lifecycle, archive policy, content synchronization model, and release boundary. Read it before changing repository structure, content synchronization, or deployment behavior.

## 1. Core model

The system has two repositories with different responsibilities:

```text
lexiiiliang/obsidian (private)
└── Canonical project writing and source media

lexiiiliang/Portfolio
├── Website code and UI
├── Content mapping and publication settings
├── Generated release content
└── Deployment history
```

The Obsidian repository is the source of truth for project writing and original media. The Portfolio repository may read and transform that source, but must not silently rewrite, move, or delete it.

The approved website workflow uses exactly two long-lived worktrees:

```text
/Users/lianglezhi/Documents/GitHub/Portfolio
└── Mainline workbench

/Users/lianglezhi/Documents/GitHub/Portfolio-lab
└── Isolated experiment workbench
```

Do not create another long-lived Portfolio worktree unless the user explicitly requests one. A temporary worktree is allowed only when a third version genuinely needs to run at the same time, and it must not be removed without the user's approval.

## 2. Current repository state

At the time of this handoff:

| Worktree | Default branch | Purpose | Local preview |
|---|---|---|---|
| `/Users/lianglezhi/Documents/GitHub/Portfolio` | `preview` | Mainline development and integration | `http://localhost:3000/` |
| `/Users/lianglezhi/Documents/GitHub/Portfolio-lab` | `experiment/selected-work-tldr` | Current isolated experiment | `http://localhost:3001/` |

Active branch groups:

```text
main
preview
experiment/selected-work-tldr
archive/cursor-tracker
archive/paper-drawer-v1
```

Existing immutable archive tags:

```text
archive/cursor-tracker-preview
archive/paper-drawer-v1
```

Archive index: `archive/README.md`.

## 3. Worktree responsibilities

### 3.1 Mainline workbench

Path:

```text
/Users/lianglezhi/Documents/GitHub/Portfolio
```

Rules:

- Keep it on `preview` during normal development.
- Use it to inspect the complete integrated site.
- Run it on `http://localhost:3000/`.
- Do not prototype an unapproved idea directly in this worktree.
- Switch it to `main` only for release preparation or production-state inspection.
- Stop the local server before switching between `preview` and `main`.
- Return it to `preview` after release work is complete.

### 3.2 Experiment workbench

Path:

```text
/Users/lianglezhi/Documents/GitHub/Portfolio-lab
```

Rules:

- Keep it on the currently active `experiment/<idea>` branch.
- Run it on `http://localhost:3001/`.
- Start every new idea from the latest approved `preview` commit.
- Use it for speculative UI, motion, layout, data-model, authentication, or large content-presentation changes.
- It may temporarily inspect an `archive/*` snapshot.
- After inspecting an archive, return it to the active experiment branch.
- Never develop new work on an archive ref.

### 3.3 What worktrees do and do not isolate

A worktree isolates checked-out files, uncommitted changes, and the running local site. All worktrees still share the same Git object database, branches, tags, and stashes.

Consequences:

- A branch can be checked out in only one worktree at a time.
- Deleting a worktree does not delete its committed branch history.
- Deleting a branch is separate from deleting a worktree.
- Removing a worktree with uncommitted changes is prohibited without explicit user approval.

## 4. Branch model

### 4.1 `main`

`main` is the final production line.

- Do not commit routine development directly to `main`.
- Do not merge into `main` without explicit user approval.
- Do not deploy or promote `main` to production without explicit user approval.
- A production commit must use a frozen content snapshot and must not depend on live access to the Obsidian repository.

### 4.2 `preview`

`preview` is the current integrated development version.

- It is the default branch of the mainline workbench.
- Mature experiments are integrated here after user approval.
- Normal, confirmed content corrections may appear here before release.
- Local preview runs on port `3000`.
- A Vercel Preview deployment is created only when explicitly requested.

### 4.3 `experiment/<idea>`

An experiment branch represents one clear design or implementation question.

Good names:

```text
experiment/alive-briefing-page
experiment/alive-briefing-story
experiment/case-page-layout
experiment/new-navigation
```

Avoid generic permanent names such as:

```text
active
experiment/test
experiment/misc
```

The branch checked out by the experiment workbench is the active experiment. `Active` is a state, not a permanent branch name.

### 4.4 `archive/<name>`

An archive branch is a curated, runnable process artifact.

- Create it only when the user explicitly identifies a version as important and explicitly requests an archive.
- Preserve the original runnable state, assets, and interaction behavior whenever practical.
- Do not continue feature development on it.
- Record it in `archive/README.md`.
- Pin the exact commit with an annotated tag.
- Never delete an archive branch or tag without explicit user approval.

`archive/<name>` is a Git branch namespace, not a directory containing all archived projects. Each archive branch represents a complete repository state.

## 5. Starting a new experiment

Before starting:

- Confirm the mainline worktree is on `preview` and clean.
- Fetch both repositories.
- Decide whether the experiment changes website code, Obsidian content, or both.
- Resolve the fate of the currently active experiment: integrate, archive by explicit request, or delete only after approval.

Create the Portfolio experiment from the latest `preview` without checking `preview` out in the lab worktree:

```bash
git -C /Users/lianglezhi/Documents/GitHub/Portfolio fetch origin
git -C /Users/lianglezhi/Documents/GitHub/Portfolio-lab switch -c experiment/<idea> origin/preview
git -C /Users/lianglezhi/Documents/GitHub/Portfolio-lab push -u origin experiment/<idea>
```

Start its local preview:

```bash
cd /Users/lianglezhi/Documents/GitHub/Portfolio-lab
npm run dev -- --host 0.0.0.0 --port 3001
```

Every completed website modification must be handed off with the clickable `http://localhost:3001/` URL.

## 6. Integrating an experiment into `preview`

Integration requires explicit user approval.

Before integrating:

- Commit and push the experiment.
- Run checks appropriate to the change.
- Verify the experiment at `http://localhost:3001/`.
- Confirm the mainline worktree is clean.
- Preserve unrelated user changes.

Integration flow:

```text
experiment/<idea>
→ preview
→ localhost:3000 full-site review
```

After integration:

- Push `preview`.
- Restart or refresh the `3000` preview.
- Do not delete the experiment branch or its worktree state without approval.
- If the user explicitly requests an archive, archive the approved intermediate state before cleanup.

## 7. Releasing `preview` to `main`

Release requires a separate explicit decision from experiment integration.

Approved sequence:

```text
1. Finish website and content review on preview.
2. Freeze the exact Obsidian content revision.
3. Run lint, tests, and production build.
4. Record the Portfolio commit and Obsidian source commit.
5. Obtain explicit approval to merge preview into main.
6. Obtain explicit approval before production deployment.
7. Return the mainline worktree to preview afterward.
```

Never treat “merge to preview” as permission to merge to `main` or deploy production.

## 8. Obsidian content source

Repository:

```text
https://github.com/lexiiiliang/obsidian.git
```

Properties verified on 2026-09-04:

```text
Visibility: private
Default branch: main
Portfolio root: 02_Portfolio
```

Relevant content structure:

```text
02_Portfolio/
├── 01 Landing Page
├── 02 Project Gallery
├── Reference
└── Template
```

The repository must remain private unless the user explicitly chooses otherwise. Do not expose GitHub credentials to browser code, commit them to either repository, or send them to Vercel merely to build the production site.

## 9. Approved content workflow

### 9.1 Confirmed, small content changes

Examples include typo fixes, short copy edits, confirmed image replacements, and metadata corrections.

```text
obsidian/main
→ Portfolio preview content watcher
→ localhost:3000
→ user review
→ release freeze when requested
```

These changes do not need a separate Portfolio experiment unless they also change presentation or remain directionally uncertain.

### 9.2 Large or uncertain content changes

Examples include a new case-study narrative, alternative positioning, major section deletion, and an unapproved bilingual rewrite.

Use matching idea names across repositories:

```text
obsidian:  experiment/alive-briefing-story
Portfolio: experiment/alive-briefing-story
```

The experiment workbench at `localhost:3001` reads the Obsidian experiment branch. The mainline workbench at `localhost:3000` continues to read `obsidian/main`.

If both content states must exist simultaneously on disk, create a corresponding temporary Obsidian worktree. This does not require a third long-lived Portfolio worktree.

### 9.3 Combined content and UI experiments

Use the same branch suffix in both repositories:

```text
obsidian/experiment/<idea>
Portfolio/experiment/<idea>
```

When accepted:

```text
1. Merge the Obsidian experiment into obsidian/main.
2. Merge the Portfolio experiment into Portfolio/preview.
3. Let preview resolve the exact new Obsidian commit.
4. Review the entire site at localhost:3000.
5. Freeze content only when the user declares it ready.
```

## 10. Target remote synchronization pipeline

Status: **approved design, not yet implemented**.

The current implementation still reads a filesystem path through `PORTFOLIO_CONTENT_ROOT` and falls back to a hard-coded legacy path in `scripts/sync-portfolio-core.mjs`. `npm run dev` and `npm run build` currently call the existing local-path sync. Do not claim that remote watching or content freezing exists until the implementation is complete and verified.

The target Preview pipeline is:

```text
private obsidian repository
→ poll remote branch commit SHA
→ shallow sparse fetch when SHA changes
→ overwrite one ignored local cache
→ generate temporary preview content
→ trigger local HMR
```

Approved defaults:

| Setting | Mainline workbench | Experiment workbench |
|---|---|---|
| Portfolio branch | `preview` | `experiment/<idea>` |
| Obsidian ref | `main` | matching `experiment/<idea>` when needed |
| Local port | `3000` | `3001` |
| Poll interval | 15–30 seconds | 15–30 seconds |
| Remote scope | `02_Portfolio/**` | `02_Portfolio/**` |
| Cache count | one mutable cache | one mutable cache |

Remote synchronization rules:

- Check the remote SHA before downloading content.
- If the SHA is unchanged, do nothing.
- Fetch with shallow history and sparse checkout.
- Do not download unrelated Obsidian folders or full history.
- Do not create timestamped snapshot directories.
- Regenerate only after a complete fetch; replace the active cache atomically.
- Record the current repository, ref, commit SHA, and checksum.
- If remote access fails, retain the last valid cache.
- If no cache exists, fall back to the committed release snapshot.
- Never auto-pull or mutate the user's working Obsidian checkout.

Suggested ignored cache layout:

```text
.cache/
├── obsidian-preview/
│   ├── repository/
│   ├── generated/
│   └── source.json
└── obsidian-experiment/
    ├── repository/
    ├── generated/
    └── source.json
```

Each workbench keeps only its latest resolved content state. Cache cleanup must target only these known cache directories.

## 11. Authentication and privacy

The Obsidian repository is private and should remain private.

Local watcher authentication may use the operating system Git credential manager, GitHub CLI authentication, or SSH. Rules:

- Never hard-code a token.
- Never put a token in `portfolio.config.json`.
- Never commit a token, including to a private repository.
- Never expose a token through client-side environment variables.
- Prefer repository-scoped, read-only access when a dedicated token is unavoidable.
- Each computer may maintain its own secure GitHub login.

The repository URL and branch name may be committed; credentials may not.

## 12. Preview cache versus release snapshot

Preview content is mutable and disposable:

```text
.cache/...          ignored by Git
latest remote only  overwritten on update
```

Release content is deterministic and versioned:

```text
content/portfolio.generated.json
public/media/projects/
```

The target freeze command is:

```text
npm run content:freeze
```

Status: **not yet implemented**.

When implemented, it must:

1. Resolve an exact Obsidian commit rather than a moving branch name.
2. Generate the official content and referenced media from that commit.
3. Record source repository, source ref, source commit, timestamp, and checksum.
4. Replace the single current tracked release snapshot rather than creating timestamped copies.
5. Leave historical release recovery to Git history.
6. Refuse to freeze incomplete or partially downloaded content.

Production builds must consume only the committed release snapshot. They must not contact the private Obsidian repository.

## 13. Storage policy

- Do not keep multiple timestamped Preview snapshots.
- Maintain at most one mutable content cache per long-lived worktree.
- Reuse unchanged Git objects and media.
- Use shallow fetch and sparse checkout for the remote Obsidian cache.
- Provide a narrowly scoped cache cleanup command when the watcher is implemented.
- Do not run broad deletion commands against repository roots or home directories.
- Large video assets should use stable external URLs or Git LFS when appropriate; avoid repeatedly committing identical binaries.
- Archive branches and tags are Git references, not extra worktree directories. They do not require a permanent local checkout.

## 14. Content mapping rules

`portfolio.config.json` controls website presentation and maps Obsidian source files into projects.

- `folder` selects the project folder under `02_Portfolio`.
- `entryEn` and `entryZh` select public English and Chinese Markdown files.
- `startAt` and `endBefore` may select a public range.
- `previewOnly: true` exposes only prepared project metadata, not draft body content.
- `protected: true` requires the server-validated project password.
- Headings generate project navigation.
- Obsidian wiki embeds are copied into the release media snapshot.
- Editorial TODO callouts are omitted from published content.
- Do not invent or rewrite project claims during website development.

## 15. Archive procedure

Only run this procedure after the user explicitly requests an archive.

```text
1. Confirm the exact experiment commit.
2. Confirm the artifact runs locally.
3. Create archive/<clear-name> from that commit.
4. Create an annotated immutable tag.
5. Push the branch and tag.
6. Add the entry to archive/README.md.
7. Preserve important assets and interaction notes.
8. Ask before removing any associated worktree or old branch alias.
```

Existing archive meanings:

- `archive/cursor-tracker` is the standalone “Move around. She follows.” site with the 110-frame cursor-following portrait and click-to-wink behavior.
- `archive/paper-drawer-v1` is the fixed-height Selected Work card where a paper drawer rises over the project visual to reveal the TL;DR.

## 16. Destructive action boundary

Explicit approval is required before:

- Removing a worktree.
- Deleting a local or remote branch.
- Deleting an archive branch or tag.
- Overwriting uncommitted user changes.
- Promoting `preview` to `main`.
- Deploying to production.
- Rewriting or deleting Obsidian source material.

Before an approved destructive action:

- Resolve the exact target.
- Confirm the worktree status.
- Confirm important commits are pushed or tagged.
- Stop only the local server belonging to that worktree.
- Report what was removed and how its committed history remains recoverable.

## 17. Failure and recovery behavior

### Obsidian remote unavailable

```text
Use last valid Preview cache
→ otherwise use committed release snapshot
→ report that content is stale
```

### Local worktree has uncommitted changes

Do not switch branches, remove the worktree, or overwrite files. Preserve the changes and ask for direction if they block integration.

### Experiment integration conflicts

Resolve only the files in scope. Preserve unrelated mainline changes. Do not use destructive resets.

### Archive needs inspection

Use the experiment workbench and prefer a detached checkout of the immutable archive tag for read-only inspection. Return to the active experiment afterward.

### Production build cannot reach Obsidian

This must not block production. A production build uses the committed release snapshot only.

## 18. Handoff checklist

At the start of work:

- Read this document and `AGENTS.md`.
- Inspect both worktrees and their statuses.
- Confirm the active branches.
- Confirm whether the task belongs to mainline, experiment, or archive work.
- Fetch before branching or integrating.
- Do not infer permission to merge, archive, delete, or deploy.

At the end of website work:

- Run proportionate checks.
- Start or refresh the correct local preview.
- Provide the clickable localhost URL.
- Report branch, commit, and whether changes were pushed.
- Report any remaining uncommitted changes.
- State whether Obsidian content came from a live remote ref, cache, or frozen snapshot.

## 19. Immediate implementation backlog

The following work is designed but not yet implemented:

1. Replace the hard-coded Obsidian fallback path with repository-based configuration.
2. Add authenticated SHA polling for the private `obsidian` repository.
3. Add shallow sparse fetch into one ignored cache per workbench.
4. Make Preview read the mutable cache and refresh through HMR.
5. Add offline fallback to the last cache and then the frozen snapshot.
6. Add `content:freeze` with Obsidian commit metadata and validation.
7. Ensure production builds never contact Obsidian.
8. Add a narrowly scoped cache cleanup command.
9. Add tests for branch selection, cache fallback, atomic refresh, and deterministic freeze.

Until these items are implemented, follow the current local-path behavior documented in `README.md` and do not claim that remote watching is active.
