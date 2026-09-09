import { queryCase } from "@/lib/query-case";
import { QueryCaseMarkdown } from "./QueryCaseMarkdown";
import { QueryCaseFigure } from "./QueryCaseFigure";

export function FromQueryToQuestHero() {
  const [metadata, question, introduction] = queryCase.opening;
  const cover = queryCase.opening.find((block) => block.kind === "figure");
  const metadataLines = metadata?.kind === "text" ? metadata.markdown.split("\n").filter((line) => line.trim()) : [];
  const facts = metadataLines[0]?.replace(/^\*\*|\*\*\s*$/g, "").split(" · ") || [];
  const [year, projectType] = facts;
  const titleBreak = queryCase.title.indexOf(" to ");
  return (
    <section className="query-hero" aria-labelledby="query-title" lang="zh-CN">
      <div className="query-hero-composition query-width">
        <header className="query-hero-heading">
          <h1 id="query-title" lang="en">{titleBreak > -1 ? <>{queryCase.title.slice(0, titleBreak)}<br />{queryCase.title.slice(titleBreak)}</> : queryCase.title}</h1>
          <div className="query-hero-question">{question?.kind === "text" ? <QueryCaseMarkdown>{question.markdown}</QueryCaseMarkdown> : null}</div>
        </header>
        <div className="query-hero-artifact">
          {cover?.kind === "figure" ? <QueryCaseFigure figure={cover} cover /> : null}
        </div>
        <div className="query-hero-introduction">{introduction?.kind === "text" ? <QueryCaseMarkdown>{introduction.markdown}</QueryCaseMarkdown> : null}</div>
        <div className="query-hero-metadata">
          <dl className="query-hero-facts">
            <div><dt>时间</dt><dd>{year}</dd></div>
            <div><dt>项目类型</dt><dd>{projectType}</dd></div>
            <div><dt>关键词</dt><dd className="query-hero-keywords">{["#AI", "#交互范式", "#能动性"].map((keyword) => <span key={keyword}>{keyword}</span>)}</dd></div>
          </dl>
          {metadataLines.slice(1).map((line) => <QueryCaseMarkdown key={line}>{line}</QueryCaseMarkdown>)}
        </div>
      </div>
    </section>
  );
}
