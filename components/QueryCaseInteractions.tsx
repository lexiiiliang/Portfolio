"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; heading: string };

export function QueryCaseNavigation({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    let frame = 0;
    const sections = headings.map(({ id }) => document.getElementById(id)).filter((item): item is HTMLElement => Boolean(item));
    const update = () => {
      frame = 0;
      const current = sections.findLast((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.35);
      setActive(current?.id || headings[0]?.id);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [headings]);
  return (
    <nav className="query-navigation" aria-label="项目章节" lang="zh-CN">
      <button type="button" className="query-navigation-toggle" aria-expanded={expanded} aria-controls="query-chapter-links" onClick={() => setExpanded((value) => !value)}>
        <span>项目章节</span><span>{headings.find(({ id }) => id === active)?.heading.split("：")[0]}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <div className="query-navigation-inner" id="query-chapter-links" data-expanded={expanded}>
        {headings.map(({ id, heading }) => (
          <a key={id} href={`#${id}`} aria-current={id === active ? "location" : undefined} title={heading} onClick={(event) => {
            setExpanded(false);
            if (event.detail === 0) {
              event.preventDefault();
              history.pushState(null, "", `#${id}`);
              const section = document.getElementById(id);
              section?.scrollIntoView({ behavior: "instant", block: "start" });
              section?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
            }
          }}>{heading.split("：")[0]}</a>
        ))}
      </div>
    </nav>
  );
}

export function QueryCaseMotion() {
  useEffect(() => {
    const root = document.querySelector(".query-page");
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (reduced.matches) return;
        // Visible by default; no hidden content if scripting or motion is disabled.
        const animation = entry.target.animate([{ opacity: 0.55, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 560, easing: "cubic-bezier(0.19, 1, 0.22, 1)" });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.15 });
    root.querySelectorAll("[data-query-reveal]").forEach((element) => observer.observe(element));
    const cancelMotion = () => { if (reduced.matches) animations.forEach((animation) => animation.cancel()); };
    reduced.addEventListener("change", cancelMotion);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      reduced.removeEventListener("change", cancelMotion);
    };
  }, []);

  return null;
}
