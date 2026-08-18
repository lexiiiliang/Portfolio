"use client";

import { useEffect, useState } from "react";
import type { ProjectHeading } from "@/lib/portfolio";

function ProjectTocPanel({ headings, idPrefix, languageClass }: {
  headings: ProjectHeading[];
  idPrefix: string;
  languageClass: "copy-en" | "copy-zh";
}) {
  const numberedSections = headings.filter((heading) =>
    /^(?:\d{2}\s*[·—–-]|Afterword\b)/i.test(heading.label),
  );
  const topLevel = headings.filter((heading) => heading.depth === 1);
  const primary = (numberedSections.length > 1 ? numberedSections : topLevel).slice(0, 12);
  const [active, setActive] = useState(primary[0] ? `${idPrefix}-${primary[0].id}` : "");

  useEffect(() => {
    const elements = primary
      .map((heading) => document.getElementById(`${idPrefix}-${heading.id}`))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.2, 1] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [idPrefix, primary]);

  if (!primary.length) return null;

  return (
    <aside className={`project-toc ${languageClass}`} aria-label="Project sections">
      <ol>
        {primary.map((heading) => (
          <li key={heading.id} className={active === `${idPrefix}-${heading.id}` ? "is-active" : ""}>
            <a href={`#${idPrefix}-${heading.id}`}>{heading.label.replace(/^\d{2}\s*[·—–-]\s*/, "")}</a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export function ProjectToc({ headingsEn, headingsZh }: {
  headingsEn: ProjectHeading[];
  headingsZh: ProjectHeading[];
}) {
  return (
    <div className="project-toc-slot">
      <ProjectTocPanel headings={headingsEn} idPrefix="en" languageClass="copy-en" />
      <ProjectTocPanel headings={headingsZh} idPrefix="zh" languageClass="copy-zh" />
    </div>
  );
}
