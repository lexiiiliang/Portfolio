import Link from "next/link";
import type { PortfolioProject } from "@/lib/portfolio";
import { getProjectTldr } from "@/lib/project-tldr";
import { ProjectCardTldr } from "./ProjectCardTldr";
import { ProjectVisual } from "./ProjectVisual";

export function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const tldr = getProjectTldr(project.slug);
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <article className={`project-card accent-${project.accent} card-${index + 1}`}>
      <div className="project-card-topline">
        <span>{indexLabel}</span>
        <span>{project.year}</span>
      </div>
      <Link
        href={`/projects/${project.slug}`}
        className="project-card-visual-link"
        aria-label={`Open ${project.title}`}
      >
        <ProjectVisual project={project} />
      </Link>
      {tldr ? (
        <ProjectCardTldr
          projectSlug={project.slug}
          projectTitle={project.title}
          projectYear={project.year}
          eyebrowEn={project.eyebrowEn}
          eyebrowZh={project.eyebrowZh}
          copy={tldr}
          isPublished={project.status === "published"}
        />
      ) : null}
    </article>
  );
}
