import { Localized } from "@/components/Localized";
import { AboutTimeline } from "@/components/AboutTimeline";
import { ContactMorph } from "@/components/ContactMorph";
import { GreetingCarousel } from "@/components/GreetingCarousel";
import { HomeScrollytelling } from "@/components/HomeScrollytelling";
import { PortraitToy } from "@/components/PortraitToy";
import { ProjectCard } from "@/components/ProjectCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionNarrative } from "@/components/SectionNarrative";
import { portfolio } from "@/lib/portfolio";

export default function Home() {
  const { site, projects } = portfolio;

  return (
    <>
      <SiteHeader />
      <HomeScrollytelling>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-stage">
            <PortraitToy />
            <div className="hero-intro">
              <h1 id="hero-title" className="hero-title">
                <GreetingCarousel />
                <span className="hero-title-fixed">
                  <Localized en="This is" zh="这里是" />
                </span>
                <span className="hero-signature">Lexi</span>
              </h1>
              <p className="hero-bio">
                <Localized
                  en="I’m an AI product designer with 2 years of experience across smart cockpits, consumer apps, and wearables. I design how AI is expressed, perceived, and understood."
                  zh="我是一名拥有 2 年经验的 AI 产品设计师，工作横跨智能座舱、To C App 与可穿戴设备。我设计 AI 如何呈现、被用户感知与理解。"
                />
              </p>
            </div>
          </div>
        </section>

        <section className="work-section" aria-labelledby="work">
          <SectionNarrative
            id="work"
            en="A few highlights from my work."
            zh="有些项目，值得多看两眼。"
          />
          <div className="project-grid-scroll" role="region" aria-label="Selected projects" tabIndex={0}>
            <div className="project-grid">
              {projects.filter((project) => project.featured).map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="about-section" aria-labelledby="about">
          <SectionNarrative id="about" en="My journey, in brief." zh="我的经历，长话短说。" />
          <AboutTimeline />
        </section>

        <section className="contact-section" aria-labelledby="contact">
          <ContactMorph contacts={site.contacts} />
        </section>
      </HomeScrollytelling>
      <footer className="site-footer">
        <span>© 2026 Lexi Liang</span>
      </footer>
    </>
  );
}
