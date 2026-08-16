"use client";

import { useEffect, useState } from "react";
import type { ProjectHeading } from "@/lib/portfolio";
import { Localized } from "./Localized";

export function ProjectToc({ headings }: { headings: ProjectHeading[] }) {
  const numberedSections = headings.filter((heading) =>
    /^(?:\d{2}\s*[·—–-]|Afterword\b)/i.test(heading.label),
  );
  const topLevel = headings.filter((heading) => heading.depth === 1);
  const primary = (numberedSections.length > 1 ? numberedSections : topLevel).slice(0, 12);
  const [active, setActive] = useState(primary[0]?.id || "");

  useEffect(() => {
    const elements = primary
      .map((heading) => document.getElementById(heading.id))
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
  }, [primary]);

  if (!primary.length) return null;

  return (
    <aside className="project-toc" aria-label="Project sections">
      <p className="toc-label"><Localized en="Inside this case" zh="案例导航" /></p>
      <ol>
        {primary.map((heading, index) => (
          <li key={heading.id} className={active === heading.id ? "is-active" : ""}>
            <a href={`#${heading.id}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {heading.label.replace(/^\d{2}\s*[·—–-]\s*/, "")}
            </a>
          </li>
        ))}
      </ol>
      <a className="toc-back" href="#top"><Localized en="Back to top ↑" zh="回到顶部 ↑" /></a>
    </aside>
  );
}
