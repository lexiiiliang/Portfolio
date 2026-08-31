import type { Plugin } from "vite";
import { resolveContentRoot, syncPortfolio } from "../scripts/sync-portfolio-core.mjs";

const DEBOUNCE_MS = 400;

// Keeps `content/portfolio.generated.json` in sync with the Obsidian vault
// while the dev server is running, so editing markdown there updates the
// rendered case-study page without restarting `npm run dev`. Excluded from
// `vinext build` via `apply: "serve"` — production builds still rely solely
// on the one-shot `content:sync` step in `prebuild`.
export function portfolioContentWatcher(): Plugin {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let syncing: Promise<void> | null = null;
  let rerunAfter = false;

  return {
    name: "portfolio-content-watcher",
    apply: "serve",
    configureServer(server) {
      const contentRoot = resolveContentRoot();
      server.watcher.add(contentRoot);

      const runSync = () => {
        if (syncing) {
          rerunAfter = true;
          return;
        }
        syncing = syncPortfolio()
          .then(() => {
            server.config.logger.info("[portfolio-content] synced", { timestamp: true });
            server.ws.send({ type: "full-reload" });
          })
          .catch((error) => {
            server.config.logger.error(
              `[portfolio-content] sync failed: ${(error as Error).message}`,
              { timestamp: true },
            );
          })
          .finally(() => {
            syncing = null;
            if (rerunAfter) {
              rerunAfter = false;
              runSync();
            }
          });
      };

      const onChange = (changedPath: string) => {
        if (!changedPath.startsWith(contentRoot)) return;
        if (timer) clearTimeout(timer);
        timer = setTimeout(runSync, DEBOUNCE_MS);
      };

      server.watcher.on("add", onChange);
      server.watcher.on("change", onChange);
      server.watcher.on("unlink", onChange);
    },
  };
}
