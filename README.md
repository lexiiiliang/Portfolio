# Lexi Liang — Portfolio

A content-driven interaction design portfolio. The public site is versioned separately from Lexi’s Obsidian vault while treating `02_Portfolio` as the canonical content and asset source.

## Content model

- Canonical source: `Lexi's Second Brain/02_Portfolio`
- Site configuration: `02_Portfolio/site.config.json`
- Versioned publishing snapshot: `content/portfolio.generated.json`
- Synced media: `public/media/projects`
- Project details are protected by a server-validated shared password.

The sync step scans configured project folders, selects each project’s public Markdown range, derives the sidebar navigation from headings, copies referenced Obsidian images, and records a stable source checksum. If the vault is unavailable in a remote environment, the checked-in snapshot remains buildable.

## Local workflow

1. Copy `.env.example` to `.env.local` and provide `PORTFOLIO_PASSWORD`.
2. Run `npm install`.
3. Run `npm run dev` for the live preview.
4. Run `npm test` before publishing.

`npm run dev` and `npm run build` synchronize the current Obsidian source automatically. Use `npm run content:sync` when only the content snapshot needs refreshing.

## Version policy

- Small, reversible content and style improvements may be committed directly to `main`.
- Experimental layouts, data-model migrations, authentication changes, and large refactors use an `agent/*` branch and review before merge.
- Each deployment is created from a tested commit, so the published site and its source content can be traced to the same revision.
