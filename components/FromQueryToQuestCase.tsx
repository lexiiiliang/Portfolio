import Image from "next/image";
import { Localized } from "@/components/Localized";
import { ProjectToc } from "@/components/ProjectToc";
import type { ProjectHeading } from "@/lib/portfolio";

const SOURCE_URL = "https://www.umu.se/en/umea-institute-of-design/uid25/uid25-project-gallery/show-page/from-query-to-quest_2085906/";
const MEDIA_ROOT = "/media/from-query-to-quest-uid25";

const headingsEn: ProjectHeading[] = [
  { depth: 1, label: "01 · Project framing", id: "project-framing" },
  { depth: 1, label: "02 · Research approach", id: "research-approach" },
  { depth: 1, label: "03 · Design principles", id: "design-principles" },
  { depth: 1, label: "04 · Conceptual framework", id: "conceptual-framework" },
  { depth: 1, label: "05 · Scenario prototype", id: "scenario-prototype" },
  { depth: 1, label: "06 · Contribution & limits", id: "contribution-limits" },
];

const headingsZh: ProjectHeading[] = [
  { depth: 1, label: "01 · 项目命题", id: "project-framing" },
  { depth: 1, label: "02 · 研究方法", id: "research-approach" },
  { depth: 1, label: "03 · 设计原则", id: "design-principles" },
  { depth: 1, label: "04 · 概念框架", id: "conceptual-framework" },
  { depth: 1, label: "05 · 情境原型", id: "scenario-prototype" },
  { depth: 1, label: "06 · 贡献与边界", id: "contribution-limits" },
];

const scenarioFrames = [
  {
    file: "07.webp",
    en: "Meet Jerry: a senior software engineer navigating a new management role.",
    zh: "认识 Jerry：一位刚晋升管理岗位的资深软件工程师。",
  },
  {
    file: "08.webp",
    en: "The promotion exposes Jerry to office politics and growing self-doubt.",
    zh: "晋升让 Jerry 卷入办公室政治，也开始怀疑自己是否适合新角色。",
  },
  {
    file: "09.webp",
    en: "Without a safe person to confide in, Jerry turns to a conversational AI.",
    zh: "缺少安全的倾诉对象时，Jerry 转向了对话式 AI。",
  },
  {
    file: "10.webp",
    en: "A heated meeting makes an immediate resignation feel like the only path.",
    zh: "一次激烈会议后，立即辞职看起来成了唯一出路。",
  },
  {
    file: "11.webp",
    en: "A request to polish a résumé reveals another attention point beneath the task.",
    zh: "润色简历的表层请求之下，出现了另一个值得关注的线索。",
  },
  {
    file: "12.webp",
    en: "Distillation connects recurring work-communication signals across conversations.",
    zh: "蒸馏模式把多次对话中反复出现的职场沟通信号连接起来。",
  },
  {
    file: "13.webp",
    en: "Jerry marks the passage that matters to him and directs further exploration.",
    zh: "Jerry 标记真正触动自己的片段，并决定下一步探索方向。",
  },
  {
    file: "14.webp",
    en: "Reviewing earlier marks helps Jerry reframe the question around mental well-being.",
    zh: "回看过去的标记后，Jerry 开始从心理健康角度重新理解问题。",
  },
];

function SectionAnchor({ id }: { id: string }) {
  return (
    <>
      <span id={`en-${id}`} className="fq-section-anchor" aria-hidden="true" />
      <span id={`zh-${id}`} className="fq-section-anchor" aria-hidden="true" />
    </>
  );
}

function Artifact({
  number,
  altEn,
  altZh,
  captionEn,
  captionZh,
}: {
  number: string;
  altEn: string;
  altZh: string;
  captionEn?: string;
  captionZh?: string;
}) {
  return (
    <figure className="fq-artifact">
      <Image
        src={`${MEDIA_ROOT}/${number}.webp`}
        alt=""
        aria-describedby={`fq-artifact-${number}-caption`}
        width={1106}
        height={622}
        sizes="(max-width: 900px) calc(100vw - 36px), 880px"
        unoptimized
      />
      <figcaption id={`fq-artifact-${number}-caption`}>
        <span className="sr-only"><Localized en={altEn} zh={altZh} /></span>
        {captionEn && captionZh ? <Localized en={captionEn} zh={captionZh} /> : null}
      </figcaption>
    </figure>
  );
}

export function FromQueryToQuestCase() {
  return (
    <div className="case-layout fq-case-layout">
      <ProjectToc headingsEn={headingsEn} headingsZh={headingsZh} />

      <article className="fq-case-content">
        <section className="fq-section fq-section-intro">
          <SectionAnchor id="project-framing" />
          <p className="fq-section-number">01 / <Localized en="PROJECT FRAMING" zh="项目命题" /></p>
          <h2>
            <Localized
              en="Reframing prompting from a transaction into a reflective journey."
              zh="把一次交易式提问，重新定义为一段反思性的旅程。"
            />
          </h2>
          <p className="fq-section-lede">
            <Localized
              en="Generative AI can now reason and act with increasing autonomy, yet most conversational interfaces still prioritize immediate output. This project asks how interaction design might preserve meaningful human engagement when the user is uncertain, blocked, or unable to name the real question."
              zh="生成式 AI 的推理与自主行动能力不断增强，但多数对话界面仍以即时结果为中心。本项目追问：当用户处于不确定、卡住，甚至无法说清真正问题的时刻，交互设计如何保护人的主动参与？"
            />
          </p>

          <div className="fq-fact-grid" aria-label="Project scope">
            <div>
              <span><Localized en="Interaction" zh="交互对象" /></span>
              <strong><Localized en="Text-based LLM chatbots" zh="文字型 LLM 聊天机器人" /></strong>
            </div>
            <div>
              <span><Localized en="Context" zh="使用情境" /></span>
              <strong><Localized en="Everyday exploratory use" zh="日常探索性使用" /></strong>
            </div>
            <div>
              <span><Localized en="Starting state" zh="起始状态" /></span>
              <strong><Localized en="Ambiguous intent & uncertainty" zh="模糊意图与不确定性" /></strong>
            </div>
          </div>

          <Artifact
            number="01"
            altEn="The project question asks how prompting can become an inceptive and reflective journey that reinforces deep thinking."
            altZh="项目问题：如何把提示塑造成一段启发性、反思性的旅程，从而保护并强化深度思考。"
            captionEn="The inquiry that organizes the project"
            captionZh="贯穿项目的核心命题"
          />
          <Artifact
            number="02"
            altEn="Diagram of the current linear interaction model: initiate, transact through dialogue, conclude with an outcome."
            altZh="当前线性交互模型：发起、通过交易式对话迭代、以结果收束。"
            captionEn="The conventional request → refinement → result model"
            captionZh="传统的“请求 → 修正 → 结果”模型"
          />
        </section>

        <section className="fq-section">
          <SectionAnchor id="research-approach" />
          <p className="fq-section-number">02 / <Localized en="RESEARCH APPROACH" zh="研究方法" /></p>
          <h2><Localized en="Critical inquiry, grounded in participation." zh="用批判性追问打开可能，再让真实参与把它落地。" /></h2>
          <p className="fq-section-lede">
            <Localized
              en="Critical Design was used to question the dominant transactional model. Participatory Design brought subjective experience, emotion, and lived context into that inquiry, keeping the emerging concepts empathetic and discussable."
              zh="批判性设计用于质疑主流的交易式对话模型；参与式设计把主观体验、情绪与真实情境带回研究，使逐步形成的概念保持同理心，也能够被共同讨论。"
            />
          </p>

          <div className="fq-method-grid">
            <div>
              <span>01</span>
              <h3>Critical Design</h3>
              <p><Localized en="Questioned what conversational AI optimizes for—and what that optimization leaves out." zh="追问对话式 AI 正在优化什么，以及这种优化遗漏了什么。" /></p>
            </div>
            <div>
              <span>02</span>
              <h3>Participatory Design</h3>
              <p><Localized en="Used people’s situated experiences to test whether alternative interaction ideas felt supportive." zh="用参与者的具体经验判断替代性交互是否真正具有支持性。" /></p>
            </div>
          </div>

          <div className="fq-evidence-band">
            <strong>20+</strong>
            <p>
              <Localized
                en="in-depth interviews, alongside critical case studies, generative research kits, sacrificial prototypes, and role-playing exercises."
                zh="次深度访谈，并结合批判性案例研究、生成式研究工具包、牺牲性原型与角色扮演练习。"
              />
            </p>
          </div>
          <p className="fq-boundary-note">
            <Localized
              en="These activities shaped an evolving understanding of the problem space; they were not validation of a finished product."
              zh="这些活动用于持续理解问题空间，而不是验证一个已经完成的产品。"
            />
          </p>
        </section>

        <section className="fq-section">
          <SectionAnchor id="design-principles" />
          <p className="fq-section-number">03 / <Localized en="DESIGN PRINCIPLES" zh="设计原则" /></p>
          <h2><Localized en="Three qualities for a more agentic human–AI relationship." zh="用三种交互质量，建立更有能动性的人机关系。" /></h2>

          <div className="fq-principle-grid">
            <div>
              <span>01</span>
              <h3>Agency Priority</h3>
              <p><Localized en="Keep the user as the primary driver through a balanced, negotiable dynamic." zh="通过平衡且可协商的互动关系，让用户始终主导自己的思考。" /></p>
            </div>
            <div>
              <span>02</span>
              <h3>Attention Synergy</h3>
              <p><Localized en="Make mutual attention visible and manipulable across alignment, dispersion, and disconnection." zh="让双方的注意方向可见、可调整，并允许在聚焦、发散和断开之间移动。" /></p>
            </div>
            <div>
              <span>03</span>
              <h3>Slow Continuity</h3>
              <p><Localized en="Support thought that extends beyond a single session and matures through revisiting." zh="支持跨越单次会话的思考，让理解在回访与重组中逐渐成熟。" /></p>
            </div>
          </div>

          <Artifact
            number="03"
            altEn="Diagram organizing Agency Priority as an ethical value beneath Attention Synergy and Slow Continuity as interaction qualities."
            altZh="原则关系图：能动性优先是伦理价值，注意力协同与慢连续性构成交互质量。"
            captionEn="Ethical value beneath interaction quality"
            captionZh="交互质量之下的伦理价值"
          />
          <div className="fq-artifact-pair">
            <Artifact
              number="05"
              altEn="Attention pattern with alignment, dispersion, and disconnection modes."
              altZh="注意力模式：聚焦、发散与断开。"
              captionEn="Attention pattern"
              captionZh="注意力模式"
            />
            <Artifact
              number="06"
              altEn="Continuity pattern with incubation, distillation, and pollination modes."
              altZh="连续性模式：孵化、蒸馏与授粉。"
              captionEn="Continuity pattern"
              captionZh="连续性模式"
            />
          </div>
        </section>

        <section className="fq-section">
          <SectionAnchor id="conceptual-framework" />
          <p className="fq-section-number">04 / <Localized en="CONCEPTUAL FRAMEWORK" zh="概念框架" /></p>
          <h2><Localized en="Thought and action form a loop—not an endpoint." zh="思考与行动彼此回流，而不是停在一个答案。" /></h2>
          <p className="fq-section-lede">
            <Localized
              en="The proposal extends prompting across digital dialogue and physical-world action. The three phases describe a cyclical journey that can complement direct task execution when the user needs exploration rather than an instant conclusion."
              zh="这个提案把提示延伸到数字对话与现实行动之间。三个阶段构成一段循环旅程：当用户需要探索而不是立即下结论时，它可以补充直接执行任务的模式。"
            />
          </p>

          <ol className="fq-framework-steps">
            <li>
              <span>01</span>
              <h3><Localized en="Initiation" zh="发起" /></h3>
              <p><Localized en="Enter with ambiguous thoughts, emotions, or fragments; treat prompting as inceptive." zh="允许模糊想法、情绪与片段进入，把提示视为思考的发端。" /></p>
            </li>
            <li>
              <span>02</span>
              <h3><Localized en="Exploratory Development" zh="探索发展" /></h3>
              <p><Localized en="Sustain thinking through patterns beyond simple question and answer." zh="用超越简单问答的模式维持思考，并展开关系与分支。" /></p>
            </li>
            <li>
              <span>03</span>
              <h3><Localized en="Dialogue–Action Loop" zh="对话—行动循环" /></h3>
              <p><Localized en="Carry provisional understanding into action, then return feedback to the dialogue." zh="把暂定理解带入行动，再让现实反馈回到对话。" /></p>
            </li>
          </ol>

          <Artifact
            number="04"
            altEn="The proposed journey moves through initiation, exploratory development, and a dialogue-action loop across digital and physical contexts."
            altZh="提案旅程跨越数字与现实情境，经过发起、探索发展和对话—行动循环。"
            captionEn="A cyclical journey across dialogue and real-world action"
            captionZh="跨越对话与现实行动的循环旅程"
          />
        </section>

        <section className="fq-section fq-scenario-section">
          <SectionAnchor id="scenario-prototype" />
          <p className="fq-section-number">05 / <Localized en="SCENARIO PROTOTYPE" zh="情境原型" /></p>
          <h2><Localized en="Jerry’s query becomes a quest." zh="Jerry 的一次提问，如何转变为一段求索。" /></h2>
          <p className="fq-section-lede">
            <Localized
              en="The sacrificial prototype makes the abstract framework discussable. A surface request—polishing a résumé—remains available, while recurring signals and user-selected passages open a deeper line of inquiry."
              zh="牺牲性原型让抽象框架变得可讨论。系统仍保留“润色简历”这个表层任务，同时通过反复出现的信号与用户主动标记的片段，打开更深的探索路径。"
            />
          </p>

          <div className="fq-story-grid">
            {scenarioFrames.map((frame, index) => (
              <figure key={frame.file} className="fq-story-frame">
                <Image
                  src={`${MEDIA_ROOT}/${frame.file}`}
                  alt=""
                  aria-describedby={`fq-story-${index + 1}`}
                  width={1106}
                  height={622}
                  sizes="(max-width: 900px) calc(100vw - 36px), 440px"
                  unoptimized
                />
                <figcaption id={`fq-story-${index + 1}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Localized en={frame.en} zh={frame.zh} />
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="fq-section fq-contribution-section">
          <SectionAnchor id="contribution-limits" />
          <h2><Localized en="Transferable knowledge, not a finished product claim." zh="这是一组可迁移的知识，而不是一个已完成的产品承诺。" /></h2>
          <p className="fq-section-lede">
            <Localized
              en="The outcome is a set of design principles and a conceptual framework. It proposes another way to think about human–AI interaction as the technology evolves, while remaining explicit that the work did not culminate in a functional product or long-term impact study."
              zh="项目产出是一组设计原则与一个概念框架。它为持续变化的人机交互提出另一种思考方式，同时明确：这项工作没有形成可运行产品，也没有长期影响数据。"
            />
          </p>

          <div className="fq-contribution-grid">
            <div>
              <span><Localized en="What it contributes" zh="项目贡献" /></span>
              <ul>
                <li><Localized en="A critique of linear, output-first prompting" zh="对线性、结果优先提示模式的批判" /></li>
                <li><Localized en="Three interaction principles" zh="三项交互设计原则" /></li>
                <li><Localized en="A three-phase cyclical framework" zh="一个三阶段循环框架" /></li>
                <li><Localized en="Scenario prototypes for discussion" zh="用于讨论的情境原型" /></li>
              </ul>
            </div>
            <div>
              <span><Localized en="What it does not claim" zh="不作出的主张" /></span>
              <ul>
                <li><Localized en="A launched or validated product" zh="已经上线或经过验证的产品" /></li>
                <li><Localized en="Measured long-term behavior change" zh="经过衡量的长期行为改变" /></li>
                <li><Localized en="A replacement for direct task execution" zh="取代直接执行任务的交互模式" /></li>
              </ul>
            </div>
          </div>

          <a className="fq-source-link" href={SOURCE_URL} target="_blank" rel="noreferrer">
            <span><Localized en="Primary source" zh="主要资料来源" /></span>
            <strong><Localized en="UID25 Project Gallery" zh="UID25 项目展页" /> ↗</strong>
          </a>
        </section>
      </article>
    </div>
  );
}
