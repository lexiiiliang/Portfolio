import { queryCase, type QueryBlock } from "@/lib/query-case";
import { QueryCaseMarkdown } from "./QueryCaseMarkdown";
import { QueryCaseFigure } from "./QueryCaseFigure";
import { QueryCaseNavigation, QueryCaseMotion } from "./QueryCaseInteractions";

function TextBlock({ markdown }: { markdown: string }) {
  return <div className={`query-copy ${markdown.startsWith("### ") ? "query-subheading" : ""}`}><QueryCaseMarkdown>{markdown}</QueryCaseMarkdown></div>;
}

/** Group presentation units without editing paragraphs, captions or images. */
function SectionBlocks({ blocks, section }: { blocks: QueryBlock[]; section: number }) {
  const rendered = [];
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    if (block.kind === "figure") {
      if (block.number === 4 && blocks[index + 1]?.kind === "figure") {
        const nextFigure = blocks[index + 1];
        rendered.push(<div className="query-research-pair" key={index}><QueryCaseFigure figure={block} />{nextFigure.kind === "figure" ? <QueryCaseFigure figure={nextFigure} /> : null}</div>);
        index++;
        continue;
      }
      if (block.number === 10) {
        const figures = blocks.slice(index, index + 3);
        if (figures.every((item) => item.kind === "figure")) {
          rendered.push(<div className="query-storyboard" key={index}>{figures.map((item) => item.kind === "figure" ? <QueryCaseFigure key={item.src} figure={item} /> : null)}</div>);
          index += 2;
          continue;
        }
      }
      rendered.push(<QueryCaseFigure key={index} figure={block} />);
      continue;
    }
    const next = blocks[index + 1];
    if (section === 3 && next?.kind === "figure" && [7, 8].includes(next.number)) {
      rendered.push(<div className="query-mode-pair" key={index}><div className="query-mode-copy">{block.markdown.split("\n").map((line, lineIndex) => <TextBlock key={lineIndex} markdown={line} />)}</div><QueryCaseFigure figure={next} /></div>);
      index++;
    } else if (section === 4 && next?.kind === "figure" && next.number >= 14) {
      rendered.push(<div className="query-interaction-step" key={index}><TextBlock markdown={block.markdown} /><QueryCaseFigure figure={next} /></div>);
      index++;
    } else if (block.markdown === "### 设计挑战" && next?.kind === "text" && blocks[index + 2]?.kind === "figure") {
      const figure = blocks[index + 2];
      rendered.push(<aside className="query-challenge" key={index}><QueryCaseMarkdown>{`${block.markdown}\n\n${next.markdown}`}</QueryCaseMarkdown>{figure.kind === "figure" ? <QueryCaseFigure figure={figure} /> : null}</aside>);
      index += 2;
    } else {
      rendered.push(<TextBlock key={index} markdown={block.markdown} />);
    }
  }
  return rendered;
}

export function FromQueryToQuestCase() {
  const headings = queryCase.sections.map(({ id, heading }) => ({ id, heading }));
  return (
    <div className="query-layout">
      <QueryCaseNavigation headings={headings} />
      <article className="query-article" lang="zh-CN">
        {queryCase.sections.map((section, index) => (
          <section id={section.id} key={section.id} className={`query-section query-section-${index + 1}`} aria-labelledby={`${section.id}-title`}>
            <div className="query-width">
              <h2 className="query-section-title" id={`${section.id}-title`} tabIndex={-1} data-query-reveal>
                <span className="query-section-label">{section.heading.slice(0, section.heading.indexOf("："))}<span className="query-heading-separator">：</span></span>
                <span>{section.heading.slice(section.heading.indexOf("：") + 1)}</span>
              </h2>
              <div className="query-section-body">
                <SectionBlocks blocks={section.blocks} section={index + 1} />
                {section.id === "query-section-2" ? <TextBlock markdown="基于这些洞察，我将设计回应组织为三项原则，并进一步发展为概念框架。" /> : null}
              </div>
            </div>
          </section>
        ))}
      </article>
      <QueryCaseMotion />
    </div>
  );
}

