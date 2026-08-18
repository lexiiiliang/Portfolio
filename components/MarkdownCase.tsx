import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toAnchor } from "@/lib/portfolio";

function nodeText(value: React.ReactNode): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(nodeText).join("");
  if (value && typeof value === "object" && "props" in value) {
    return nodeText((value as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return "";
}

function MarkdownBody({ markdown, idPrefix }: { markdown: string; idPrefix: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => {
          const text = nodeText(children);
          return <h2 id={`${idPrefix}-${toAnchor(text)}`} className="case-section-title">{children}</h2>;
        },
        h2: ({ children }) => {
          const text = nodeText(children);
          return <h3 id={`${idPrefix}-${toAnchor(text)}`}>{children}</h3>;
        },
        h3: ({ children }) => <h4>{children}</h4>,
        a: ({ href, children }) => (
          <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            {children}<span aria-hidden="true"> ↗</span>
          </a>
        ),
        img: ({ src, alt }) => (
          // Keep the image as phrasing content so ReactMarkdown's surrounding
          // paragraph remains valid HTML and hydrates consistently.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="case-artifact-image"
            src={typeof src === "string" ? src : ""}
            alt={alt || ""}
          />
        ),
        blockquote: ({ children }) => <blockquote>{children}</blockquote>,
        table: ({ children }) => <div className="table-scroll"><table>{children}</table></div>,
        code: ({ className, children }) => className === "language-mermaid" ? (
          <div className="system-flow" aria-label="System flow diagram">
            {String(children).trim().split("\n").filter((line) => /-->/.test(line)).slice(0, 8).map((line, index) => (
              <span key={`${line}-${index}`}>{line.replace(/<br\s*\/?>/gi, " · ").replace(/\[|\]|\{|\}/g, "")}</span>
            ))}
          </div>
        ) : <code className={className}>{children}</code>,
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

export function MarkdownCase({ markdownEn, markdownZh }: { markdownEn: string; markdownZh: string }) {
  return (
    <div className="case-content">
      <div className="case-markdown copy-en"><MarkdownBody markdown={markdownEn} idPrefix="en" /></div>
      <div className="case-markdown copy-zh"><MarkdownBody markdown={markdownZh} idPrefix="zh" /></div>
    </div>
  );
}
