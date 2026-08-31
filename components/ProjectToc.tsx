import { ArticleToc } from "@/components/ArticleToc";
import type { ProjectHeading } from "@/lib/portfolio";

export function ProjectToc({ headingsEn, headingsZh }: {
  headingsEn: ProjectHeading[];
  headingsZh: ProjectHeading[];
}) {
  return (
    <div className="project-toc-slot">
      <ArticleToc headings={headingsEn} idPrefix="en" className="project-toc copy-en" label="Contents" />
      <ArticleToc headings={headingsZh} idPrefix="zh" className="project-toc copy-zh" label="目录" />
    </div>
  );
}
