"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useSyncExternalStore, type MouseEvent as ReactMouseEvent } from "react";
import type { ProjectTldrCopy } from "@/lib/project-tldr";
import { Localized } from "./Localized";
import { ArrowIcon } from "./ArrowIcon";

const FLAP_PATH = "M24 1H197Q209 1 217 11L233 30Q239 37 251 37H368Q391 37 391 60V225Q391 249 367 249H25Q1 249 1 225V25Q1 1 24 1Z";

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

export function ProjectFolderCard({
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
  const rimId = useId().replace(/:/g, "");
  const imageRef = useRef<HTMLImageElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const isComingSoon = projectSlug === "alive-briefing";
  const isQueryProject = projectSlug === "from-query-to-quest";
  const usesOutcomeLabels = isQueryProject || projectSlug === "livis" || projectSlug === "alive-briefing";
  const hasChineseOutcomeLabels = usesOutcomeLabels;
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
    const image = imageRef.current;
    let frame = 0;
    const resize = () => {
      const width = card.clientWidth - 30;
      const ratio = image?.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 16 / 9;
      const sheetHeight = Math.max(370, body.offsetHeight + 48);
      card.style.setProperty("--fpc-cover-height", `${width / ratio}px`);
      card.style.setProperty("--fpc-sheet-height", `${sheetHeight}px`);
      const scroller = card.closest<HTMLElement>(".project-grid-scroll");
      if (scroller) {
        const pulls = Array.from(scroller.querySelectorAll<HTMLElement>(".project-card"),
          item => parseFloat(getComputedStyle(item).getPropertyValue("--fpc-sheet-height")) - 100 || 0);
        scroller.style.setProperty("--project-grid-open-overflow", `${Math.max(156, ...pulls) + 48}px`);
      }
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(resize); };
    const observer = new ResizeObserver(schedule);
    observer.observe(body);
    observer.observe(card);
    image?.addEventListener("load", schedule);
    schedule();
    return () => { observer.disconnect(); image?.removeEventListener("load", schedule); cancelAnimationFrame(frame); };
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
      // Measure synchronously too: a viewport/language change may still have a queued ResizeObserver frame.
      const sheetHeight = Math.max(370, (bodyRef.current?.offsetHeight ?? 322) + 48);
      card.style.setProperty("--fpc-sheet-height", `${sheetHeight}px`);
      const summaryTop = card.getBoundingClientRect().top + 100 - sheetHeight;
      if (summaryTop < 96) {
        window.scrollBy({
          top: summaryTop - 96,
          behavior: event.detail === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        });
      }
    }
  };

  return (
    <div className="fpc" data-open={isOpen}>
      <div className="fpc-back" aria-hidden="true" />
      <div className="fpc-clip">
        <div className="fpc-sheet"><div className="fpc-flip">
          <div className="fpc-visual" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imageRef} className="fpc-image" src={coverSrc} alt="" />
          </div>
          <div
            ref={panelRef}
            id={panelId}
            className="fpc-summary"
            data-project={projectSlug}
            data-cursor="default"
            role="region"
            aria-hidden={!isOpen}
            aria-label={`${projectTitle} quick read`}
            tabIndex={-1}
            inert={!isOpen}
          >
            <div ref={bodyRef} className="fpc-body">
              <div className="fpc-header">
                <span><Localized en="/ TL;DR" zh={hasChineseOutcomeLabels ? "/ 太长不看版" : "/ TL;DR"} /></span>
                <button type="button" className="fpc-close" aria-label="Close TL;DR" onClick={(event) => setPanelState(false, event.detail === 0)} data-cursor="default">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true" focusable="false">
                    <path d="m7 7 10 10M17 7 7 17" />
                  </svg>
                </button>
              </div>
              <div className="fpc-intro">
                <h4><Localized en={copy.thesisEn} zh={copy.thesisZh} /></h4>
              </div>
              <dl className="fpc-details">
                <div>
                  <dt><Localized en={usesOutcomeLabels ? "Challenge" : "Problem"} zh={hasChineseOutcomeLabels ? "挑战" : "问题"} /></dt>
                  <dd><Localized en={copy.problemEn} zh={copy.problemZh} /></dd>
                </div>
                <div>
                  <dt><Localized en={usesOutcomeLabels ? "What I developed" : "Approach"} zh={hasChineseOutcomeLabels ? "我的成果" : "方法"} /></dt>
                  <dd><Localized en={copy.approachEn} zh={copy.approachZh} /></dd>
                </div>
              </dl>
              {isComingSoon ? (
                <div className="fpc-case-link fpc-case-link-disabled" data-cursor="default" aria-disabled="true">
                  <Localized en="COMING SOON" zh="施工中" />
                </div>
              ) : (
                <Link
                  href={`/projects/${projectSlug}`}
                  className="fpc-case-link"
                  data-cursor="default"
                  tabIndex={isOpen ? 0 : -1}
                >
                  <Localized
                    en="Take a closer look"
                    zh="仔细看看"
                  />
                  <span aria-hidden="true"><ArrowIcon /></span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div></div>
      <button
        ref={triggerRef}
        type="button"
        className="fpc-trigger"
        aria-label={`Open ${projectTitle} TL;DR`}
        aria-expanded={isOpen}
        aria-controls={panelId}
        tabIndex={isOpen ? -1 : 0}
        onClick={openPanel}
        onPointerEnter={() => { const card = triggerRef.current?.closest<HTMLElement>(".project-card"); if (card) card.dataset.motionInstant = "false"; }}
        data-cursor="preview"
      />

      {isComingSoon ? (
        <div
          className="fpc-front fpc-front-disabled"
          data-open={isOpen}
          data-cursor="project-status"
          aria-label={`${projectTitle} coming soon`}
          aria-disabled="true"
        >
          <span className="fpc-frost" aria-hidden="true" />
          <svg className="fpc-rim" viewBox="0 0 392 250" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={`${rimId}-light`} x1="0" y1="0" x2=".8" y2="1">
                <stop stopColor="var(--fpc-rim-bright)" />
                <stop offset=".32" stopColor="var(--fpc-rim-soft)" />
                <stop offset=".7" stopColor="var(--fpc-rim-shade)" />
                <stop offset="1" stopColor="var(--fpc-rim-bright)" stopOpacity=".65" />
              </linearGradient>
              <filter id={`${rimId}-inset`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="soft" />
                <feComposite in="SourceAlpha" in2="soft" operator="out" result="inner-edge" />
                <feFlood floodColor="var(--fpc-rim-bright)" floodOpacity=".42" />
                <feComposite in2="inner-edge" operator="in" />
              </filter>
            </defs>
            <path d={FLAP_PATH} fill="white" filter={`url(#${rimId}-inset)`} />
            <path d={FLAP_PATH} fill="none" stroke={`url(#${rimId}-light)`} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>

          <div className="fpc-front-content">
            <div className="fpc-title">
              <h3>
                <span>{projectTitle}</span>
                {projectTitleZh ? <span className="copy-zh" lang="zh-CN">{projectTitleZh}</span> : null}
              </h3>
            </div>

            <div className="fpc-footer">
              <div>
                <span className="fpc-index">{indexLabel}</span>
                <p># <Localized en={footerTag.en} zh={footerTag.zh} /></p>
              </div>
              <span className="fpc-year">{projectYear}</span>
            </div>
          </div>
        </div>
      ) : (
        <Link
          href={`/projects/${projectSlug}`}
          className="fpc-front"
          data-open={isOpen}
          data-cursor="project"
          aria-label={`Read ${projectTitle}`}
        >
        <span className="fpc-frost" aria-hidden="true" />
        <svg className="fpc-rim" viewBox="0 0 392 250" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={`${rimId}-light`} x1="0" y1="0" x2=".8" y2="1">
              <stop stopColor="var(--fpc-rim-bright)" />
              <stop offset=".32" stopColor="var(--fpc-rim-soft)" />
              <stop offset=".7" stopColor="var(--fpc-rim-shade)" />
              <stop offset="1" stopColor="var(--fpc-rim-bright)" stopOpacity=".65" />
            </linearGradient>
            <filter id={`${rimId}-inset`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="soft" />
              <feComposite in="SourceAlpha" in2="soft" operator="out" result="inner-edge" />
              <feFlood floodColor="var(--fpc-rim-bright)" floodOpacity=".42" />
              <feComposite in2="inner-edge" operator="in" />
            </filter>
          </defs>
          <path d={FLAP_PATH} fill="white" filter={`url(#${rimId}-inset)`} />
          <path d={FLAP_PATH} fill="none" stroke={`url(#${rimId}-light)`} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="fpc-front-content">
          <div className="fpc-title">
            <h3>
              <span>{projectSlug === "livis" ? "Livis Agent" : projectTitle}</span>
              {projectTitleZh ? <span className="copy-zh" lang="zh-CN">{projectTitleZh}</span> : null}
            </h3>
          </div>

          <div className="fpc-footer">
            <div>
              <span className="fpc-index">{indexLabel}</span>
              <p># <Localized en={footerTag.en} zh={footerTag.zh} /></p>
            </div>
            <span className="fpc-year">{projectYear}</span>
          </div>
        </div>
        </Link>
      )}
    </div>
  );
}
