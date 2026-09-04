# Portfolio Site project instructions

## Worktree workflow

- Maintain two long-lived worktrees:
  - `/Users/lianglezhi/Documents/GitHub/Portfolio` is the mainline workbench. Keep it on `preview` by default and switch to `main` only for final release checks.
  - `/Users/lianglezhi/Documents/GitHub/Portfolio-lab` is the isolated experiment workbench. Keep it on the current `experiment/<idea>` branch and use it temporarily to inspect `archive/*` snapshots.
- Run the mainline workbench on `http://localhost:3000/` and the experiment workbench on `http://localhost:3001/` so both can be reviewed at the same time.
- Start new ideas from the current `preview` state and develop them only in the experiment worktree.
- Integrate an experiment into `preview` only after the user says the experiment is ready or explicitly requests integration.
- Merge `preview` into `main` only after the user explicitly approves the release-ready version.
- Do not create additional long-lived worktrees unless the user explicitly requests one. Temporary worktrees may be used only when necessary and must not be removed without the user's approval.

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
