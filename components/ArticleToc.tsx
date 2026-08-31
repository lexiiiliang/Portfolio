"use client";

import { useEffect, useState } from "react";
import type { ProjectHeading } from "@/lib/portfolio";

type TocNode = {
  heading: ProjectHeading;
  children: ProjectHeading[];
};

function groupByDepth(headings: ProjectHeading[]): TocNode[] {
  const nodes: TocNode[] = [];
  for (const heading of headings) {
    if (heading.depth <= 1) {
      nodes.push({ heading, children: [] });
    } else if (nodes.length) {
      nodes[nodes.length - 1].children.push(heading);
    }
  }
  return nodes;
}

export function ArticleToc({ headings, idPrefix, className = "", label }: {
  headings: ProjectHeading[];
  idPrefix: string;
  className?: string;
  label?: string;
}) {
  const numberedSections = headings.filter((heading) =>
    /^(?:\d{2}\s*[·—–-]|Afterword\b)/i.test(heading.label),
  );
  const isNumbered = numberedSections.length > 1;
  const nodes = (isNumbered
    ? numberedSections.map((heading) => ({ heading, children: [] as ProjectHeading[] }))
    : groupByDepth(headings)
  ).slice(0, 12);

  const flatIds = nodes.flatMap((node) => [node.heading, ...node.children]).map((heading) => `${idPrefix}-${heading.id}`);
  const [active, setActive] = useState(flatIds[0] ?? "");

  useEffect(() => {
    const elements = flatIds
      .map((id) => document.getElementById(id))
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
  }, [flatIds]);

  if (!nodes.length) return null;

  const activeIndex = Math.max(0, flatIds.indexOf(active));
  const progress = flatIds.length > 1 ? (activeIndex / (flatIds.length - 1)) * 100 : 100;

  return (
    <aside className={`article-toc ${className}`} aria-label="Table of contents">
      {label ? <p className="toc-label">{label}</p> : null}
      <div className="project-toc-body">
        <div className="project-toc-track" style={{ ["--toc-progress" as string]: `${progress}%` }} />
        <ol>
          {nodes.map((node) => {
            const parentId = `${idPrefix}-${node.heading.id}`;
            const isActiveParent = active === parentId;
            const isOpen = isActiveParent || node.children.some((child) => `${idPrefix}-${child.id}` === active);
            return (
              <li key={node.heading.id} className={[isOpen ? "is-open" : "", isActiveParent ? "is-active" : ""].filter(Boolean).join(" ")}>
                <a href={`#${parentId}`}>{node.heading.label.replace(/^\d{2}\s*[·—–-]\s*/, "")}</a>
                {node.children.length ? (
                  <ol className={isOpen ? "is-expanded" : ""}>
                    {node.children.map((child) => {
                      const childId = `${idPrefix}-${child.id}`;
                      return (
                        <li key={child.id} className={active === childId ? "is-active" : ""}>
                          <a href={`#${childId}`}>{child.label}</a>
                        </li>
                      );
                    })}
                  </ol>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
