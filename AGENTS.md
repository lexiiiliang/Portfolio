# Portfolio Site project instructions

## Preview workflow

- After every completed website modification, start or refresh a local preview and include the clickable `http://localhost:<port>/` URL in the handoff.
- For small or routine changes, use localhost only. Do not create a Vercel Preview deployment automatically.
- Deploy to Vercel Preview only when the user explicitly requests Vercel deployment.
- Never promote or deploy a preview to production without the user's explicit instruction.

## Process archive

- Treat `archive/*` as a curated process archive, not as disposable branches.
- Create a new archive entry only when the user explicitly identifies a draft as important and asks for it to be archived.
- Preserve the original runnable state of an archived experiment whenever possible, including its assets and interaction behavior.
- Record every archived entry in `archive/README.md` with its branch, immutable tag, source commit, and a short description.
- Never delete an archive branch, tag, or archive worktree without the user's explicit approval.
