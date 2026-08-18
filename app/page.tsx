import { Localized } from "@/components/Localized";
import { PortraitToy } from "@/components/PortraitToy";
import { ProjectCard } from "@/components/ProjectCard";
import { SiteHeader } from "@/components/SiteHeader";
import { portfolio } from "@/lib/portfolio";

function ContactIcon({ label }: { label: string }) {
  const iconProps = {
    className: "contact-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  } as const;

  switch (label.toLowerCase()) {
    case "email":
      return (
        <svg {...iconProps} fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "github":
      return (
        <svg {...iconProps} fill="currentColor">
          <path d="M12 2.5a9.7 9.7 0 0 0-3.07 18.9c.48.09.66-.2.66-.46v-1.7c-2.68.58-3.25-1.14-3.25-1.14-.44-1.11-1.07-1.4-1.07-1.4-.88-.6.06-.59.06-.59.97.07 1.48 1 1.48 1 .86 1.47 2.26 1.05 2.81.8.09-.62.34-1.05.61-1.29-2.14-.24-4.39-1.07-4.39-4.77 0-1.05.38-1.91 1-2.59-.1-.24-.43-1.22.09-2.55 0 0 .81-.26 2.67.99A9.3 9.3 0 0 1 12 7.37a9.3 9.3 0 0 1 2.43.33c1.85-1.25 2.67-.99 2.67-.99.52 1.33.19 2.31.09 2.55.62.68 1 1.54 1 2.59 0 3.71-2.26 4.52-4.4 4.76.35.3.65.88.65 1.79v2.54c0 .26.18.55.66.46A9.7 9.7 0 0 0 12 2.5Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...iconProps} fill="currentColor">
          <path d="M5.35 7.4A1.85 1.85 0 1 0 5.34 3.7a1.85 1.85 0 0 0 .01 3.7ZM3.75 20.3h3.2V9.4h-3.2v10.9ZM9.2 9.4h3.07v1.49h.04c.43-.81 1.47-1.67 3.03-1.67 3.24 0 3.84 2.13 3.84 4.9v6.18h-3.2v-5.48c0-1.31-.03-2.99-1.82-2.99-1.82 0-2.1 1.42-2.1 2.89v5.58H9.2V9.4Z" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps} fill="none">
          <path d="M6 3.5h8l4 4v13H6v-17Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M14 3.5v4h4M9 12h6M9 15.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

function ArrowUpRightIcon() {
  return (
    <svg className="contact-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const { site, projects } = portfolio;

  return (
    <>
      <SiteHeader />
      <main id="top" className="home-page">
        <section className="hero" aria-labelledby="hero-title">
          <PortraitToy />
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <Localized
                en={site.roleEn}
                zh={site.roleZh}
              />
            </p>
            <h1 id="hero-title">
              <Localized
                en={site.introEn}
                zh={site.introZh}
              />
            </h1>
            <div className="hero-details">
              <p>
                <Localized
                  en={(
                    <>
                      Currently @ <strong>{site.current}</strong> <span aria-hidden="true">|</span> Prev @ <strong>{site.previous[0]}</strong> &amp; <strong>{site.previous[1]}</strong>
                    </>
                  )}
                  zh={(
                    <>
                      现就职于 <strong>{site.currentZh}</strong><span aria-hidden="true">｜</span>前 <strong>{site.previousZh[0]}</strong> &amp; <strong>{site.previousZh[1]}</strong>
                    </>
                  )}
                />
              </p>
              <p>
                <Localized
                  en={<>📍 {site.locationEn}</>}
                  zh={<>📍 {site.locationZh}</>}
                />
              </p>
            </div>
          </div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-intro">
            <div>
              <p className="micro-label">01 / SELECTED WORK</p>
              <h2 id="work-title"><Localized en="Ideas, systems and interfaces for emerging intelligence." zh="关于新智能的观点、系统与界面。" /></h2>
            </div>
            <p><Localized en="Three cases across AI interfaces, spatial computing and human agency." zh="三个项目，跨越 AI 界面、空间计算与人的能动性。" /></p>
          </div>
          <div className="project-grid">
            {projects.filter((project) => project.featured).map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <p className="micro-label">02 / ABOUT LEXI</p>
          <div className="about-grid">
            <h2 id="about-title">
              <Localized
                en="Useful intelligence should expand human judgment—not quietly replace it."
                zh="有用的智能应该扩展人的判断，而不是悄悄取代它。"
              />
            </h2>
            <div className="about-notes">
              <p><Localized en="I work between interaction design, system thinking and product strategy, turning emerging technical capability into legible human choices." zh="我的工作横跨交互设计、系统思考与产品策略，把新兴技术能力转译成清晰、可判断的人类选择。" /></p>
              <dl>
                <div><dt><Localized en="Based in" zh="所在地" /></dt><dd>Beijing, China</dd></div>
                <div><dt><Localized en="Interested in" zh="关注方向" /></dt><dd>AI · Smart hardware · Future interaction</dd></div>
                <div><dt><Localized en="Moving toward" zh="期待地点" /></dt><dd>Shenzhen, China</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <p className="micro-label">03 / SAY HELLO</p>
          <div className="contact-grid">
            <h2 id="contact-title"><Localized en="Working on something interesting? Say hello." zh="在做有意思的事？欢迎联络。" /></h2>
            <ul className="contact-links" aria-label="Contact links">
              {site.contacts.map((contact) => (
                <li key={contact.label}>
                  {contact.href ? (
                    <a
                      className="contact-link"
                      href={contact.href}
                      target={contact.href.startsWith("http") ? "_blank" : undefined}
                      rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      <span className="contact-icon-frame"><ContactIcon label={contact.label} /></span>
                      <strong className="contact-link-label">{contact.label}</strong>
                      <ArrowUpRightIcon />
                    </a>
                  ) : (
                    <div className="contact-link is-disabled" aria-disabled="true">
                      <span className="contact-icon-frame"><ContactIcon label={contact.label} /></span>
                      <strong className="contact-link-label">{contact.label}</strong>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>© 2026 Lexi Liang</span>
        <a href="#top"><Localized en="Back to top ↑" zh="回到顶部 ↑" /></a>
      </footer>
    </>
  );
}
