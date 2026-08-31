import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Callout } from "@/components/Callout";
import { Carousel } from "@/components/Carousel";
import { ScrollSection } from "@/components/ScrollSection";
import { remarkCallout } from "@/lib/markdown/remarkCallout";
import { directiveMarkdownPlugins } from "@/lib/markdown/remarkDirectives";
import { toAnchor } from "@/lib/portfolio";

function nodeText(value: React.ReactNode): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(nodeText).join("");
  if (value && typeof value === "object" && "props" in value) {
    return nodeText((value as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return "";
}

// Not typed as `Components` on the object literal itself: that type only
// allows keys from `JSX.IntrinsicElements`, so an inline literal with the
// custom `callout`/`carousel`/`scroll-section` tag names would fail
// TypeScript's excess-property check. Each entry is typed individually
// instead, and the whole object is cast once where it's passed to
// ReactMarkdown below.
function buildComponents(idPrefix: string) {
  return {
    callout: ({ type, title, children }: { type?: string; title?: string; children?: React.ReactNode }) => (
      <Callout type={type} title={title}>{children}</Callout>
    ),
    carousel: ({ children }: { children?: React.ReactNode }) => <Carousel>{children}</Carousel>,
    "scroll-section": ({ effect, children }: { effect?: string; children?: React.ReactNode }) => (
      <ScrollSection effect={effect}>{children}</ScrollSection>
    ),
    h1: ({ children }: { children?: React.ReactNode }) => {
      const text = nodeText(children);
      return <h2 id={`${idPrefix}-${toAnchor(text)}`} className="case-section-title">{children}</h2>;
    },
    h2: ({ children }: { children?: React.ReactNode }) => {
      const text = nodeText(children);
      return <h3 id={`${idPrefix}-${toAnchor(text)}`}>{children}</h3>;
    },
    h3: ({ children }: { children?: React.ReactNode }) => <h4>{children}</h4>,
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
      <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {children}<span aria-hidden="true"> ↗</span>
      </a>
    ),
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      // Keep the image as phrasing content so ReactMarkdown's surrounding
      // paragraph remains valid HTML and hydrates consistently.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="case-artifact-image"
        src={typeof src === "string" ? src : ""}
        alt={alt || ""}
      />
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote>{children}</blockquote>,
    table: ({ children }: { children?: React.ReactNode }) => <div className="table-scroll"><table>{children}</table></div>,
    code: ({ className, children }: { className?: string; children?: React.ReactNode }) => className === "language-mermaid" ? (
      <div className="system-flow" aria-label="System flow diagram">
        {String(children).trim().split("\n").filter((line) => /-->/.test(line)).slice(0, 8).map((line, index) => (
          <span key={`${line}-${index}`}>{line.replace(/<br\s*\/?>/gi, " · ").replace(/\[|\]|\{|\}/g, "")}</span>
        ))}
      </div>
    ) : <code className={className}>{children}</code>,
  };
}

function MarkdownBody({ markdown, idPrefix }: { markdown: string; idPrefix: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkCallout, ...directiveMarkdownPlugins]}
      components={buildComponents(idPrefix) as unknown as Components}
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
