import type { PortfolioProject } from "@/lib/portfolio";
import { Localized } from "./Localized";

export function ProjectVisual({ project }: { project: PortfolioProject }) {
  if (project.slug === "alive-briefing") {
    return (
      <div className="card-visual alive-visual" aria-hidden="true">
        <div className="signal-row"><span>18%</span><i /></div>
        <div className="briefing-card">
          <span className="briefing-kicker">ALIVE / 03</span>
          <strong><Localized en="Rain ahead" zh="前方大雨" /></strong>
          <p><Localized en="Wet road + energy mode" zh="湿滑路面 + 节能" /></p>
          <span className="briefing-action"><Localized en="Apply" zh="应用" /> ↗</span>
        </div>
        <span className="alive-pulse" />
      </div>
    );
  }

  if (project.slug === "livis") {
    return (
      <div className="card-visual livis-visual" aria-hidden="true">
        <span className="glasses lens-left" />
        <span className="glasses lens-right" />
        <span className="glasses bridge" />
        <span className="livis-focus">Focus / Peripheral</span>
        <span className="livis-dot" />
      </div>
    );
  }

  return (
    <div className="card-visual quest-visual" aria-hidden="true">
      <span className="quest-word">QUERY</span>
      <span className="quest-line"><i /><i /><i /><i /></span>
      <span className="quest-word quest-end">QUEST</span>
      <span className="quest-note">agency · attention · continuity</span>
    </div>
  );
}
