import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Localized } from "@/components/Localized";
import { MarkdownCase } from "@/components/MarkdownCase";
import { ProjectToc } from "@/components/ProjectToc";
import { ProjectVisual } from "@/components/ProjectVisual";
import { SiteHeader } from "@/components/SiteHeader";
import { ACCESS_COOKIE, hasPortfolioAccess } from "@/lib/access";
import { getProject, portfolio } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return portfolio.projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return project ? {
    title: `${project.title} — Lexi Liang`,
    description: project.summaryEn,
  } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  if (project.protected) {
    const cookieStore = await cookies();
    const allowed = await hasPortfolioAccess(cookieStore.get(ACCESS_COOKIE)?.value);
    if (!allowed) redirect(`/unlock?next=${encodeURIComponent(`/projects/${project.slug}`)}`);
  }

  const index = portfolio.projects.findIndex((item) => item.slug === project.slug);
  const nextProject = portfolio.projects[(index + 1) % portfolio.projects.length];

  return (
    <>
      <SiteHeader compact />
      <main id="top" className={`project-page accent-${project.accent}`}>
        <section className="project-hero">
          <div className="project-hero-meta">
            <span>{project.eyebrowEn}</span>
            <span>{project.year}</span>
            <span>{project.status === "published" ? "CASE STUDY" : "PREVIEW"}</span>
          </div>
          <h1>{project.title}</h1>
          <p className="project-hero-thesis"><Localized en={project.heroEn} zh={project.heroZh} /></p>
          <div className="project-hero-summary">
            <p><Localized en={project.summaryEn} zh={project.summaryZh} /></p>
            <div className="snapshot-stamp">
              <span><Localized en="Content snapshot" zh="内容快照" /></span>
              <code>{project.sourceChecksum || "awaiting-source"}</code>
            </div>
          </div>
          <ProjectVisual project={project} />
        </section>

        {project.video ? (
          <section className="project-video" aria-labelledby="project-video-title">
            <div className="project-video-heading">
              <div>
                <p className="micro-label"><Localized en="THREE-MINUTE PITCH" zh="三分钟项目介绍" /></p>
                <h2 id="project-video-title">{project.video.title}</h2>
              </div>
              <a href={project.video.pageUrl} target="_blank" rel="noreferrer">
                <Localized en="Watch on Vimeo ↗" zh="在 Vimeo 观看 ↗" />
              </a>
            </div>
            <div className="project-video-frame" style={{ aspectRatio: project.video.aspectRatio }}>
              <iframe
                src={project.video.embedUrl}
                title={project.video.title}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>
        ) : null}

        {project.previewOnly ? (
          <section className="preview-note">
            <p className="micro-label"><Localized en="WORK IN PROGRESS" zh="案例整理中" /></p>
            <h2><Localized en="The question is ready. The evidence is still being shaped." zh="命题已经成立，证据正在被整理成可公开的叙事。" /></h2>
            <p>
              <Localized
                en="This preview protects the unfinished draft from being mistaken for a finished case. The project will expand here as its public narrative and artifacts are prepared."
                zh="当前只展示经过整理的项目命题，避免把草稿误认为完整案例。随着公开叙事与素材补齐，这个页面会自动扩展。"
              />
            </p>
          </section>
        ) : (
          <div className="case-layout">
            <ProjectToc headings={project.headings} />
            <MarkdownCase markdown={project.body} />
          </div>
        )}

        <section className="next-project">
          <p className="micro-label"><Localized en="NEXT CASE" zh="下一个项目" /></p>
          <Link href={`/projects/${nextProject.slug}`}>
            <span>{nextProject.title}</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </>
  );
}
