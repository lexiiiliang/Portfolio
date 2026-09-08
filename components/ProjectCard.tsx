import type { PortfolioProject } from "@/lib/portfolio";
import { getProjectTldr } from "@/lib/project-tldr";
import { ProjectCardTldr } from "./ProjectCardTldr";
import { ProjectVisual } from "./ProjectVisual";

export function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const tldr = getProjectTldr(project.slug);
  const indexLabel = String(index + 1).padStart(2, "0");
  const projectTitleZh = project.slug === "alive-briefing" ? "活字简报" : undefined;

  return (
    <article
      className={`project-card accent-${project.accent} card-${index + 1}`}
    >
      <div className="project-card-content-sheet" aria-hidden="true">
        <div className="project-card-visual-link">
          <ProjectVisual project={project} />
        </div>
      </div>
      {tldr ? (
        <ProjectCardTldr
          projectSlug={project.slug}
          projectTitle={project.title}
          projectTitleZh={projectTitleZh}
          projectYear={project.year}
          eyebrowEn={project.eyebrowEn}
          indexLabel={indexLabel}
          copy={tldr}
          isPublished={project.status === "published"}
        />
      ) : null}
    </article>
  );
}
