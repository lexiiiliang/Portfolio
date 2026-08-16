import { Localized } from "@/components/Localized";
import { PortraitToy } from "@/components/PortraitToy";
import { ProjectCard } from "@/components/ProjectCard";
import { SiteHeader } from "@/components/SiteHeader";
import { portfolio } from "@/lib/portfolio";

export default function Home() {
  const { site, projects } = portfolio;
  const visibleContacts = site.contacts.filter((contact) => contact.href);

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
            <h2 id="contact-title"><Localized en={<>Working on an interaction that does not exist yet?<br />Let’s talk.</>} zh={<>正在设计一种还不存在的交互？<br />聊聊吧。</>} /></h2>
            <div className="contact-links">
              {visibleContacts.length ? visibleContacts.map((contact) => (
                <a key={contact.label} href={contact.href}>{contact.label}<span aria-hidden="true">↗</span></a>
              )) : (
                <div className="contact-placeholder">
                  <span>Email · GitHub · LinkedIn · CV</span>
                  <small><Localized en="Links are being added to the content configuration." zh="联系方式会在内容配置中补充。" /></small>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>© 2026 Lexi Liang</span>
        <span><Localized en="Designed in Beijing · Versioned from Obsidian" zh="设计于北京 · 内容版本来自 Obsidian" /></span>
        <a href="#top"><Localized en="Back to top ↑" zh="回到顶部 ↑" /></a>
      </footer>
    </>
  );
}
