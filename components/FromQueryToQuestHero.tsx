import { Localized } from "@/components/Localized";
import type { PortfolioProject } from "@/lib/portfolio";

export function FromQueryToQuestHero({ project }: { project: PortfolioProject }) {
  return (
    <section className="project-hero fq-hero" aria-labelledby="fq-hero-title">
      <div className="fq-hero-meta">
        <span><Localized en="Master’s thesis" zh="硕士毕业设计" /></span>
        <span><Localized en="Interaction design" zh="交互设计" /></span>
        <span>{project.year}</span>
      </div>

      <div className="fq-hero-copy">
        <p className="fq-hero-kicker"><Localized en="From output to inquiry" zh="从结果导向到持续求索" /></p>
        <h1 id="fq-hero-title">{project.title}</h1>
        <p className="project-hero-thesis"><Localized en={project.heroEn} zh={project.heroZh} /></p>
      </div>

      <div className="fq-hero-placeholder" role="img" aria-label="Placeholder for the future hero visual direction">
        <span className="fq-hero-placeholder-label">
          <Localized en="Hero visual · pending design" zh="Hero 视觉 · 待设计" />
        </span>
        <div className="fq-hero-path" aria-hidden="true">
          <span>QUERY</span>
          <i><b /><b /><b /></i>
          <span>QUEST</span>
        </div>
        <p><Localized en="A visual language for the journey is the next design decision." zh="下一步将为这段思考旅程建立视觉语言。" /></p>
      </div>

      <div className="fq-hero-foot">
        <p><Localized en={project.summaryEn} zh={project.summaryZh} /></p>
        <p className="fq-hero-status"><Localized en="Framework preview · v1" zh="项目框架预览 · v1" /></p>
      </div>
    </section>
  );
}
