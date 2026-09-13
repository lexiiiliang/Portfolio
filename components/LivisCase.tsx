/* eslint-disable @next/next/no-img-element -- Preserve original source media and their dimensions. */
import { livisCase, type LivisBlock } from "@/lib/livis-case";
import { QueryCaseMarkdown } from "./QueryCaseMarkdown";
import { QueryCaseNavigation } from "./QueryCaseInteractions";

function Caption({ children }: { children?: string }) {
  return children ? <figcaption><QueryCaseMarkdown>{children}</QueryCaseMarkdown></figcaption> : null;
}

function SourceMedia({ markdown }: { markdown: string }) {
  const match = markdown.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  const media = livisCase.media.find((item) => item.src === match?.[2]);
  if (!media || !match) throw new Error("Livis media missing from the approved snapshot.");
  return media.kind === "video" ? (
    <video className="livis-video" controls playsInline preload="metadata" aria-label={match[1]}>
      <source src={media.src} type="video/mp4" />
      <a href={media.src}>{match[1]}</a>
    </video>
  ) : (
    <img src={media.src} alt={match[1]} width={media.width} height={media.height} loading="lazy" decoding="async" />
  );
}

/** Change presentation only: every label and category comes from this block. */
function TaskModel({ markdown }: { markdown: string }) {
  const stages = markdown.split("\n").map((line) => {
    const match = line.trim().match(/^> \*\*(.*?)\*\*：(.*?)【(.*?)】$/);
    if (!match) throw new Error("The approved task model structure has changed.");
    return { predicate: match[1], label: match[2], categories: match[3].split(" / ") };
  });
  return <figure className="livis-task-model" aria-label="如果……就……任务结构">
    {stages.map((stage, index) => <div className="livis-task-stage" data-kind={index === 0 ? "conditions" : "actions"} key={stage.predicate}>
      {index > 0 ? <svg className="livis-task-connector" viewBox="0 0 48 24" fill="none" aria-hidden="true"><path d="M1 12h44m-7-6 7 6-7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
      <div className="livis-task-heading">
        <strong>{stage.predicate.replace(/……$/, "")}<span className="livis-task-ellipsis">……</span></strong><span className="query-heading-separator">：</span><span>{stage.label}</span>
      </div>
      <span className="query-heading-separator">【</span>
      <ul className="livis-task-categories">
        {stage.categories.map((category, categoryIndex) => <li key={category}>{category}{categoryIndex < stage.categories.length - 1 ? <span className="query-heading-separator"> / </span> : null}</li>)}
      </ul>
      <span className="query-heading-separator">】</span>
    </div>)}
  </figure>;
}

/** User-requested presentation labels; original commands stay untouched. */
function commandClassification(command: string): [string, string] | undefined {
  if (command.includes("后排无人")) return ["座舱状态", "设备控制"];
  if (command.includes("距离目的地")) return ["时间 × 地点", "播报"];
  if (command.includes("提醒我关火")) return ["时间", "提醒"];
  if (command.includes("每周")) return ["周期时间", "内容生成"];
  if (command.includes("充电到 80%")) return ["车辆状态 ✖️ 环境感知", "眼镜通知"];
}

function CommandQuote({ command, lead, standalone = false }: { command: string; lead?: string; standalone?: boolean }) {
  const classification = commandClassification(command);
  const alreadyQuoted = command.startsWith("“") && command.endsWith("”");
  return <blockquote className={`livis-command-quote${standalone ? " livis-command-standalone" : ""}`}>
    {lead ? <span className="query-heading-separator">{lead}</span> : null}
    {classification ? <p className="livis-command-context" data-livis-presentation>
      <span>{classification[0]}</span><span className="livis-command-divider">—</span><span>{classification[1]}</span>
    </p> : null}
    <p className="livis-command-text">
      {!alreadyQuoted ? <span data-livis-presentation aria-hidden="true">“</span> : null}
      {command}
      {!alreadyQuoted ? <span data-livis-presentation aria-hidden="true">”</span> : null}
    </p>
  </blockquote>;
}

/** Pull source examples out of prose without reordering wording. */
function CommandExamples({ parts }: { parts: string[] }) {
  const [introduction, firstLead, firstCommand, secondLead, secondCommand, conclusion] = parts;
  return <div className="livis-command-passage">
    {introduction ? <div className="livis-copy"><QueryCaseMarkdown>{introduction}</QueryCaseMarkdown></div> : null}
    <div className="livis-command-pair">
      {[[firstLead, firstCommand], [secondLead, secondCommand]].map(([lead, command]) => <CommandQuote command={command} lead={lead} key={command} />)}
    </div>
    {conclusion ? <div className="livis-copy"><QueryCaseMarkdown>{conclusion}</QueryCaseMarkdown></div> : null}
  </div>;
}

function Block({ block, sectionId }: { block: LivisBlock; sectionId: string }) {
  const { markdown, caption } = block;
  if (block.heading) return <div className="livis-copy livis-subheading" id={block.id}>
    <h3 id={`${block.id}-title`} tabIndex={-1}>{block.heading}</h3>
  </div>;
  if (sectionId === "livis-section-1") {
    const examples = markdown.match(/^((?:.*?执行项。)?)(例如，)(后排无人时关闭后排空调和娱乐屏)(，或)(在距离目的地还有 5 分钟时提醒乘客收拾物品。)(.*)$/)
      ?? markdown.match(/^(.*?：)(用户可能临时说一句)(“5 分钟后提醒我关火”)(，也可能要求)(每周生成一份 AI 硬件周报。)(.*)$/);
    if (examples) return <CommandExamples parts={examples.slice(1)} />;
    if (markdown.startsWith("> 如何在能力")) {
      return <div className="livis-core-question"><QueryCaseMarkdown>{markdown}</QueryCaseMarkdown></div>;
    }
  }
  if (markdown.startsWith("> **如果……**")) return <TaskModel markdown={markdown} />;
  if (markdown.startsWith("> ") && commandClassification(markdown.slice(2))) return <CommandQuote command={markdown.slice(2)} standalone />;
  if (markdown.startsWith("![")) {
    const media = livisCase.media.find((item) => markdown.includes(item.src));
    const portrait = media?.width && media?.height && media.height > media.width;
    return <figure className={`livis-figure ${portrait ? "livis-portrait" : ""}`}><div className="livis-media-surface"><SourceMedia markdown={markdown} /></div><Caption>{caption}</Caption></figure>;
  }
  if (markdown.startsWith("|") && markdown.includes("![")) {
    const rows = markdown.split("\n").map((row) => row.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
    return <figure className="livis-comparison"><div className={`livis-comparison-grid livis-comparison-${rows[0].length}`}>
      {rows[0].map((heading, index) => <div className="livis-comparison-column" key={heading}>
        <div className="livis-comparison-heading"><QueryCaseMarkdown>{heading}</QueryCaseMarkdown></div>
        <SourceMedia markdown={rows[2][index]} />
      </div>)}
    </div><Caption>{caption}</Caption></figure>;
  }
  if (markdown.startsWith("|")) {
    const label = markdown.split("\n")[0].replace(/^\||\|$/g, "").trim();
    return <div className="livis-table" role="region" aria-label={label} tabIndex={0}><QueryCaseMarkdown>{markdown}</QueryCaseMarkdown></div>;
  }
  return <div className={`livis-copy ${markdown.startsWith("### ") ? "livis-subheading" : ""} ${markdown.startsWith(">") ? "livis-quote" : ""}`}><QueryCaseMarkdown>{markdown}</QueryCaseMarkdown></div>;
}

function SectionBlocks({ blocks, sectionId }: { blocks: LivisBlock[]; sectionId: string }) {
  const rendered = [];
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    const next = blocks[index + 1];
    if (block.heading === "核心目标" && next?.markdown.startsWith("> ") && blocks[index + 2]?.markdown === "【MVP体验目标】" && blocks[index + 3]?.markdown.startsWith("- **")) {
      rendered.push(<section className="livis-goal-block" aria-labelledby={`${block.id}-title`} key={index}>
        <Block block={block} sectionId={sectionId} />
        <SectionBlocks blocks={blocks.slice(index + 1, index + 4)} sectionId={sectionId} />
      </section>);
      index += 3;
    } else if (block.markdown === "【MVP体验目标】" && next?.markdown.startsWith("- **")) {
      const principles = next.markdown.split("\n").map((line) => line.match(/^- \*\*(.*?)\*\*：(.*)$/));
      rendered.push(<div className="livis-objectives" key={index}>
        <p className="livis-objectives-label"><span className="query-heading-separator">【</span>MVP体验目标<span className="query-heading-separator">】</span></p>
        {principles.every(Boolean) ? <ul>{principles.map((principle, goalIndex) => <li key={goalIndex}>
          <strong>{principle![1]}<span className="query-heading-separator">：</span></strong>
          <p>{principle![2]}</p>
        </li>)}</ul> : <QueryCaseMarkdown>{next.markdown}</QueryCaseMarkdown>}
      </div>);
      index++;
    } else rendered.push(<Block block={block} sectionId={sectionId} key={index} />);
  }
  return rendered;
}

export function LivisHero() {
  const [subtitle, ...opening] = livisCase.opening;
  const metadataIndex = opening.findIndex((block) => block.markdown.startsWith("**角色："));
  if (metadataIndex < 0) throw new Error("Livis source metadata is missing.");
  const introduction = opening.slice(0, metadataIndex);
  const metadata = opening[metadataIndex];
  const scope = opening.slice(metadataIndex + 1);
  const facts = metadata.markdown.replace(/^\*\*|\*\*$/g, "").split("｜").map((field) => {
    const separator = field.indexOf("：");
    return { label: field.slice(0, separator), value: field.slice(separator + 1) };
  });
  return <section className="query-hero livis-hero" aria-labelledby="livis-title" lang="zh-CN">
    <div className="query-hero-composition query-width">
      <header className="query-hero-heading">
        <h1 id="livis-title">{livisCase.title}</h1>
        <div className="query-hero-question"><QueryCaseMarkdown>{subtitle.markdown}</QueryCaseMarkdown></div>
      </header>
      <div className="query-hero-artifact livis-cover-placeholder" role="img" aria-label="封面占位">
        <span>封面占位</span>
      </div>
      <div className="query-hero-introduction">
        {introduction.map((block, index) => <QueryCaseMarkdown key={index}>{block.markdown}</QueryCaseMarkdown>)}
      </div>
      <div className="query-hero-metadata livis-hero-metadata">
        <dl className="query-hero-facts livis-hero-facts">
          {facts.map((fact, index) => <div key={fact.label}>
            <dt>{fact.label}<span className="query-heading-separator">：</span></dt>
            <dd>{fact.value}{index < facts.length - 1 ? <span className="query-heading-separator">｜</span> : null}</dd>
          </div>)}
        </dl>
        {scope.length > 0 ? <details className="livis-role-scope">
          <summary>
            <span data-livis-presentation>职责范围</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </summary>
          <div>{scope.map((block, index) => <QueryCaseMarkdown key={index}>{block.markdown}</QueryCaseMarkdown>)}</div>
        </details> : null}
      </div>
    </div>
  </section>;
}

export function LivisCase() {
  const headings = livisCase.sections.map(({ id, heading }) => {
    const numbered = heading.match(/^设计决策 (\d+)｜(.*?)(?:，|$)/);
    return { id, heading, label: numbered ? `${numbered[1]}｜${numbered[2]}` : heading.split("：")[0],
      ...(numbered ? { group: "设计决策", depth: 2 as const } : {}) };
  });
  return <div className="query-layout livis-layout">
    <QueryCaseNavigation headings={headings} />
    <article className="query-article livis-article" lang="zh-CN">
      {livisCase.sections.map((section) => {
        const separator = section.heading.match(/：|｜/);
        const position = separator?.index;
        return <section className="query-section livis-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
          <h2 className="query-section-title" id={`${section.id}-title`} tabIndex={-1}>
            {position !== undefined ? <><span className="query-section-label">{section.heading.slice(0, position)}<span className="query-heading-separator">{separator?.[0]}</span></span><span>{section.heading.slice(position + 1)}</span></> : section.heading}
          </h2>
          <div className={`livis-section-body${section.id === "livis-section-6" ? " livis-demo-grid" : ""}`}><SectionBlocks blocks={section.blocks} sectionId={section.id} /></div>
        </section>;
      })}
    </article>
  </div>;
}
