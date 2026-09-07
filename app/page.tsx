import { Localized } from "@/components/Localized";
import { AboutTimeline } from "@/components/AboutTimeline";
import { ContactMorph } from "@/components/ContactMorph";
import { GreetingCarousel } from "@/components/GreetingCarousel";
import { PortraitToy } from "@/components/PortraitToy";
import { ProjectCard } from "@/components/ProjectCard";
import { SiteHeader } from "@/components/SiteHeader";
import { portfolio } from "@/lib/portfolio";

export default function Home() {
  const { site, projects } = portfolio;

  return (
    <>
      <SiteHeader />
      <main id="top" className="home-page">
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
                  en="I’m an AI product designer with 2 years of experience across intelligent cockpits, consumer apps, and wearables—designing how AI is perceived, understood, and naturally appears."
                  zh="我是一位拥有 2 年经验的 AI 产品设计师，我的工作横跨智能座舱、ToC App 与可穿戴设备，为 AI 设计被感知、被理解与自然出现的方式。"
                />
              </p>
            </div>
          </div>
        </section>

        <section className="work-section" id="work" aria-label="Selected work">
          <div className="project-grid-scroll" role="region" aria-label="Selected projects" tabIndex={0}>
            <div className="project-grid">
              {projects.filter((project) => project.featured).map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <h2 id="about-title" className="sr-only"><Localized en="About Lexi" zh="关于 Lexi" /></h2>
          <AboutTimeline />
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <ContactMorph contacts={site.contacts} />
        </section>
      </main>
      <footer className="site-footer">
        <span>© 2026 Lexi Liang</span>
      </footer>
    </>
  );
}
