"use client";

import { useEffect, useRef, useState } from "react";

type Heading = { id: string; heading: string; label?: string; depth?: 2; group?: string };

export function QueryCaseNavigation({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);
  const [expanded, setExpanded] = useState(false);
  const [groupOverride, setGroupOverride] = useState<{ activeId: string; group: string; open: boolean } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const positionRef = useRef<{ x: number; y: number } | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const currentHeading = headings.find(({ id }) => id === active);

  // Arc-shaped marker motion inspired by Rare UI's Bounce Sidebar.
  // Native keyframes keep the existing dependency footprint unchanged.
  useEffect(() => {
    const list = listRef.current;
    const dot = dotRef.current;
    if (!list || !dot) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const place = (animate = false) => {
      let link = list.querySelector<HTMLElement>('a[aria-current="location"]');
      if (!link?.getClientRects().length) link = list.querySelector<HTMLElement>('[data-active-group="true"]');
      if (!link || !list.getClientRects().length) return;
      const bounds = link.getBoundingClientRect();
      const y = bounds.top - list.getBoundingClientRect().top + list.scrollTop + bounds.height / 2 - 3;
      const x = link.dataset.depth === "2" ? 13 : 0;
      const previous = positionRef.current;
      // Sample the in-flight position so rapid changes remain continuous.
      const matrix = new DOMMatrixReadOnly(getComputedStyle(dot).transform);
      const from = animationRef.current?.playState === "running"
        ? { x: matrix.m41, y: matrix.m42 } : previous;
      animationRef.current?.cancel();
      dot.style.transform = `translate(${x}px, ${y}px)`;
      dot.style.opacity = "1";
      positionRef.current = { x, y };
      if (!animate || !from || reduced.matches || (Math.abs(y - from.y) < 1 && Math.abs(x - from.x) < 1)) return;
      const delta = y - from.y;
      const arc = Math.min(14, Math.abs(delta) * 0.4);
      const frames = Array.from({ length: 25 }, (_, index) => {
        const t = index / 24;
        return { transform: `translate(${from.x + (x - from.x) * t - Math.sin(Math.PI * t) * arc}px, ${from.y + delta * t}px)` };
      });
      animationRef.current = dot.animate(frames, { duration: 280, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" });
    };
    place(true);
    let width = list.offsetWidth;
    let height = list.offsetHeight;
    const resize = new ResizeObserver(() => {
      if (list.offsetWidth === width && list.offsetHeight === height) return;
      width = list.offsetWidth;
      height = list.offsetHeight;
      place();
    });
    resize.observe(list);
    const onReducedMotion = () => { if (reduced.matches) place(); };
    reduced.addEventListener("change", onReducedMotion);
    return () => {
      resize.disconnect();
      reduced.removeEventListener("change", onReducedMotion);
    };
  }, [active, expanded, groupOverride]);
  useEffect(() => () => animationRef.current?.cancel(), []);
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
  const renderLink = ({ id, heading, label, depth }: Heading) => (
    <a key={id} href={`#${id}`} data-depth={depth} aria-label={label ? heading : undefined} aria-current={id === active ? "location" : undefined} title={heading} onClick={(event) => {
      setExpanded(false);
      if (event.detail === 0) {
        event.preventDefault();
        history.pushState(null, "", `#${id}`);
        const section = document.getElementById(id);
        section?.scrollIntoView({ behavior: "instant", block: "start" });
        section?.querySelector<HTMLElement>("h2, h3")?.focus({ preventScroll: true });
      }
    }}>{label ?? heading.split("：")[0]}</a>
  );
  return (
    <nav className="query-navigation" aria-label="项目章节" lang="zh-CN">
      <button type="button" className="query-navigation-toggle" aria-expanded={expanded} aria-controls="query-chapter-links" onClick={() => setExpanded((value) => !value)}>
        <span>项目章节</span><span>{currentHeading?.label ?? currentHeading?.heading.split("：")[0]}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <p className="query-navigation-label" aria-hidden="true">项目章节</p>
      <div ref={listRef} className="query-navigation-inner" id="query-chapter-links" data-expanded={expanded}>
        <span ref={dotRef} className="query-navigation-dot" aria-hidden="true" />
        {headings.map((item, index) => {
          if (!item.group) return renderLink(item);
          if (headings[index - 1]?.group === item.group) return null;
          const group = item.group;
          const children = headings.filter((heading) => heading.group === group);
          const open = groupOverride?.activeId === active && groupOverride.group === group
            ? groupOverride.open : currentHeading?.group === group;
          const groupId = `query-group-${item.id}`;
          return <div className="query-navigation-group" role="group" aria-labelledby={`${groupId}-label`} key={groupId}>
            <button id={`${groupId}-label`} type="button" className="query-navigation-group-label"
              aria-expanded={open} aria-controls={groupId} data-active-group={currentHeading?.group === group || undefined}
              onClick={() => setGroupOverride({ activeId: active, group, open: !open })}>
              <span>{group}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div id={groupId} className="query-navigation-group-items" hidden={!open}>{children.map(renderLink)}</div>
          </div>;
        })}
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
