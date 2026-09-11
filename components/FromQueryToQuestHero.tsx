import { queryCase } from "@/lib/query-case";
import { QueryCaseMarkdown } from "./QueryCaseMarkdown";
import { QueryCaseFigure } from "./QueryCaseFigure";

export function FromQueryToQuestHero() {
  const textBlocks = queryCase.opening.filter((block) => block.kind === "text");
  const metadata = textBlocks.find((block) => /^\*\*\d{4} · /.test(block.markdown));
  const [question, introduction] = textBlocks.filter((block) =>
    block !== metadata && !/^(时间|项目类型|关键词)\s*[:：]/.test(block.markdown),
  );
  const cover = queryCase.opening.find((block) => block.kind === "figure");
  const metadataLines = metadata?.kind === "text" ? metadata.markdown.split("\n").filter((line) => line.trim()) : [];
  const facts = metadataLines[0]?.replace(/^\*\*|\*\*\s*$/g, "").split(" · ") || [];
  const year = textBlocks.find((block) => /^时间\s*[:：]/.test(block.markdown))?.markdown.replace(/^时间\s*[:：]\s*/, "") || facts[0];
  const projectType = textBlocks.find((block) => /^项目类型\s*[:：]/.test(block.markdown))?.markdown.replace(/^项目类型\s*[:：]\s*/, "") || facts[1];
  const title = queryCase.title.replace(/\s*从「询」到「寻」\s*$/, "");
  const titleBreak = title.indexOf(" to ");
  return (
    <section className="query-hero" aria-labelledby="query-title" lang="zh-CN">
      <div className="query-hero-composition query-width">
        <header className="query-hero-heading">
          <h1 id="query-title" lang="en">{titleBreak > -1 ? <>{title.slice(0, titleBreak)}<br />{title.slice(titleBreak)}</> : title}</h1>
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
