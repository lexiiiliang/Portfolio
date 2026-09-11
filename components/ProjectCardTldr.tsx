"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useSyncExternalStore, type MouseEvent as ReactMouseEvent } from "react";
import type { ProjectTldrCopy } from "@/lib/project-tldr";
import { Localized } from "./Localized";
import { ArrowIcon } from "./ArrowIcon";

let openProjectSlug: string | null = null;
const openProjectListeners = new Set<() => void>();

function subscribeToOpenProject(listener: () => void) {
  openProjectListeners.add(listener);
  return () => openProjectListeners.delete(listener);
}

function setOpenProject(slug: string | null) {
  if (openProjectSlug === slug) return;
  openProjectSlug = slug;
  openProjectListeners.forEach((listener) => listener());
}

function getOpenProject() {
  return openProjectSlug;
}

function getServerOpenProject() {
  return null;
}

type ProjectCardTldrProps = {
  coverSrc: string;
  projectSlug: string;
  projectTitle: string;
  projectTitleZh?: string;
  projectYear: string;
  eyebrowEn: string;
  indexLabel: string;
  copy: ProjectTldrCopy;
  isPublished: boolean;
};

export function ProjectCardTldr({
  coverSrc,
  projectSlug,
  projectTitle,
  projectTitleZh,
  projectYear,
  eyebrowEn,
  indexLabel,
  copy,
}: ProjectCardTldrProps) {
  const activeProjectSlug = useSyncExternalStore(
    subscribeToOpenProject,
    getOpenProject,
    getServerOpenProject,
  );
  const isOpen = activeProjectSlug === projectSlug;
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const isQueryProject = projectSlug === "from-query-to-quest";
  const englishTags = eyebrowEn.split(" · ").slice(0, 2);
  const footerTag = ({
    "alive-briefing": { en: "HMI Exploration", zh: "座舱 HMI 探索" },
    livis: { en: "Multi-Device Agent", zh: "跨端 Agent" },
    "from-query-to-quest": { en: "Master’s Degree Project", zh: "硕士毕业设计" },
  } as Record<string, { en: string; zh: string }>)[projectSlug]
    ?? { en: englishTags.at(-1) ?? "Project", zh: englishTags.at(-1) ?? "Project" };

  useEffect(() => {
    const body = bodyRef.current;
    const card = triggerRef.current?.closest<HTMLElement>(".project-card");
    if (!body || !card) return;
    const resize = () => {
      const sheetHeight = Math.max(400, body.offsetHeight + 60);
      const style = getComputedStyle(card);
      const front = parseFloat(style.getPropertyValue("--folder-front-height"));
      const closed = parseFloat(style.getPropertyValue("--folder-closed-height"));
      const openHeight = sheetHeight + front;
      card.style.setProperty("--folder-sheet-height", `${sheetHeight}px`);
      card.style.setProperty("--folder-open-height", `${openHeight}px`);
      card.style.setProperty("--folder-pull-distance", `${openHeight - closed}px`);
      const scroller = card.closest<HTMLElement>(".project-grid-scroll");
      if (scroller) {
        const pulls = Array.from(scroller.querySelectorAll<HTMLElement>(".project-card"),
          (item) => parseFloat(getComputedStyle(item).getPropertyValue("--folder-pull-distance")) || 0);
        // Horizontal scrolling clips vertically too; reserve room for the tallest drawer.
        scroller.style.setProperty("--project-grid-open-overflow", `${Math.max(156, ...pulls) + 24}px`);
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(body);
    resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const card = triggerRef.current?.closest<HTMLElement>(".project-card");
      if (card) card.dataset.motionInstant = "true";
      setOpenProject(null);
      triggerRef.current?.focus();
    };
    const closeOutsideCard = (event: PointerEvent) => {
      const card = triggerRef.current?.closest<HTMLElement>(".project-card");
      if (card?.contains(event.target as Node)) return;
      setOpenProject(null);
    };
    const closeOnNavigation = () => setOpenProject(null);

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutsideCard);
    window.addEventListener("portfolio:section-navigation", closeOnNavigation);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutsideCard);
      window.removeEventListener("portfolio:section-navigation", closeOnNavigation);
    };
  }, [isOpen]);

  const setPanelState = (willOpen: boolean, focusPanel = false) => {
    const card = triggerRef.current?.closest<HTMLElement>(".project-card");
    if (card) card.dataset.motionInstant = String(focusPanel);
    if (willOpen && !focusPanel) triggerRef.current?.blur();
    setOpenProject(willOpen ? projectSlug : null);
    if (willOpen && focusPanel) requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
    if (!willOpen) requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };

  const openPanel = (event: ReactMouseEvent<HTMLButtonElement>) => {
    setPanelState(true, event.detail === 0);
    {
      const card = triggerRef.current?.closest<HTMLElement>(".project-card");
      if (!card) return;
      const style = getComputedStyle(card);
      const summaryTop = card.getBoundingClientRect().top
        + parseFloat(style.getPropertyValue("--folder-closed-height"))
        - parseFloat(style.getPropertyValue("--folder-front-height"))
        - parseFloat(style.getPropertyValue("--folder-sheet-height"));
      if (summaryTop < 96) {
        window.scrollBy({
          top: summaryTop - 96,
          behavior: event.detail === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
      }
    }
  };

  return (
    <>
      <div className="project-paper-clip">
        <div className="project-card-paper" data-open={isOpen}>
          <div className="project-card-visual-link" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="project-cover-image" src={coverSrc} alt="" />
          </div>
          <div
            ref={panelRef}
            id={panelId}
            className="project-tldr-content"
            data-project={projectSlug}
            data-cursor="default"
            role="region"
            aria-hidden={!isOpen}
            aria-label={`${projectTitle} quick read`}
            tabIndex={-1}
            inert={!isOpen}
          >
            <div ref={bodyRef} className="project-tldr-body">
              <div className="project-tldr-header">
                <span><Localized en="/ TL;DR" zh={isQueryProject ? "/ 太长不看版" : "/ TL;DR"} /></span>
              </div>
              <div className="project-tldr-intro">
                <h4><Localized en={copy.thesisEn} zh={copy.thesisZh} /></h4>
              </div>
              <dl className="project-tldr-details">
                <div>
                  <dt><Localized en={isQueryProject ? "Challenge" : "Problem"} zh={isQueryProject ? "挑战" : "问题"} /></dt>
                  <dd><Localized en={copy.problemEn} zh={copy.problemZh} /></dd>
                </div>
                <div>
                  <dt><Localized en={isQueryProject ? "What I developed" : "Approach"} zh={isQueryProject ? "我的成果" : "方法"} /></dt>
                  <dd><Localized en={copy.approachEn} zh={copy.approachZh} /></dd>
                </div>
              </dl>
              <Link
                href={`/projects/${projectSlug}`}
                className="project-tldr-case-link"
                data-cursor="default"
                tabIndex={isOpen ? 0 : -1}
              >
                <Localized
                  en="Take a closer look"
                  zh="仔细看看"
                />
                <span aria-hidden="true"><ArrowIcon /></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <button
        ref={triggerRef}
        type="button"
        className="project-folder-pull-target"
        aria-label={`Open ${projectTitle} TL;DR`}
        aria-expanded={isOpen}
        aria-controls={panelId}
        tabIndex={isOpen ? -1 : 0}
        onClick={openPanel}
        data-cursor="preview"
      />

      <Link
        href={`/projects/${projectSlug}`}
        className={`project-folder-cover ${isOpen ? "is-open" : ""}`}
        data-open={isOpen}
        data-cursor="project"
        aria-label={`Read ${projectTitle}`}
      >
        <span className="project-folder-cover-shape" aria-hidden="true" />

        <div className="project-folder-cover-content">
          <div className="project-card-title-link">
            <h3>
              <span>{projectSlug === "livis" ? "Livis Agent" : projectTitle}</span>
              {projectTitleZh ? <span className="copy-zh" lang="zh-CN">{projectTitleZh}</span> : null}
            </h3>
          </div>

          <div className="project-folder-cover-footer">
            <div>
              <span className="project-folder-index">{indexLabel}</span>
              <p># <Localized en={footerTag.en} zh={footerTag.zh} /></p>
            </div>
            <span className="project-folder-year">{projectYear}</span>
          </div>
        </div>
      </Link>
    </>
  );
}
