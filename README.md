# Lexi Liang — Portfolio

A content-driven interaction design portfolio. All website code, configuration, documentation, generated content snapshots, and publishing history live in this repository. The Obsidian vault remains a read-only source for original project writing and assets.

## Content model

- Canonical project source: `/Users/lexiliang/Documents/Obsidian/Lexi's Second Brain/02_Portfolio`
- Site configuration: `portfolio.config.json`
- Site maintenance guide: `docs/网站内容管理.md`
- Versioned publishing snapshot: `content/portfolio.generated.json`
- Synced media: `public/media/projects`
- Project details are protected by a server-validated shared password.

The sync step scans configured project folders, selects each project’s public Markdown range, derives the sidebar navigation from headings, copies referenced Obsidian images, and records a stable source checksum. If the vault is unavailable in a remote environment, the checked-in snapshot remains buildable.

## Local workflow

1. Copy `.env.example` to `.env.local`, provide `PORTFOLIO_PASSWORD`, and adjust `PORTFOLIO_CONTENT_ROOT` if the Obsidian vault moves.
2. Run `npm install`.
3. Run `npm run dev` for the live preview.
4. Run `npm test` before publishing.

`npm run dev` and `npm run build` synchronize the current Obsidian source automatically. Use `npm run content:sync` when only the content snapshot needs refreshing.

## Version policy

- Small, reversible content and style improvements may be committed directly to `main`.
- Experimental layouts, data-model migrations, authentication changes, and large refactors use an `agent/*` branch and review before merge.
- Each deployment is created from a tested commit, so the published site and its source content can be traced to the same revision.
