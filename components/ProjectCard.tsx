import type { PortfolioProject } from "@/lib/portfolio";
import { getProjectTldr } from "@/lib/project-tldr";
import { ProjectCardTldr } from "./ProjectCardTldr";
import { ProjectVisual } from "./ProjectVisual";

export function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const tldr = getProjectTldr(project.slug);
  const indexLabel = String(index + 1).padStart(2, "0");

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
          projectYear={project.year}
          eyebrowEn={project.eyebrowEn}
          eyebrowZh={project.eyebrowZh}
          indexLabel={indexLabel}
          copy={tldr}
          isPublished={project.status === "published"}
        />
      ) : null}
    </article>
  );
}
