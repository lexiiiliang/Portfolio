import Link from "next/link";
import type { PortfolioProject } from "@/lib/portfolio";
import { Localized } from "./Localized";
import { ProjectVisual } from "./ProjectVisual";

export function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`project-card accent-${project.accent} card-${index + 1}`}
      aria-label={`Open ${project.title}`}
    >
      <div className="project-card-topline">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span><Localized en={project.eyebrowEn} zh={project.eyebrowZh} /></span>
        <span>{project.year}</span>
      </div>
      <ProjectVisual project={project} />
      <div className="project-card-copy">
        <div>
          <h3>{project.title}</h3>
          <p><Localized en={project.summaryEn} zh={project.summaryZh} /></p>
        </div>
        <div className="project-card-meta">
          <span className="status-chip">
            {project.status === "published" ? <Localized en="Case study" zh="完整案例" /> : <Localized en="In progress" zh="整理中" />}
          </span>
          <span className="open-mark" aria-hidden="true">↗</span>
        </div>
      </div>
    </Link>
  );
}
