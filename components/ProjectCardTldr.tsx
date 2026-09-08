"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useSyncExternalStore, type MouseEvent as ReactMouseEvent } from "react";
import type { ProjectTldrCopy } from "@/lib/project-tldr";
import { Localized } from "./Localized";

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
  projectSlug,
  projectTitle,
  projectTitleZh,
  projectYear,
  eyebrowEn,
  indexLabel,
  copy,
  isPublished,
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
  const englishTags = eyebrowEn.split(" · ").slice(0, 2);
  const footerTag = englishTags.at(-1) ?? englishTags[0] ?? "Project";

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenProject(null);
      triggerRef.current?.focus();
    };
    const closeOutsideCard = (event: PointerEvent) => {
      const card = triggerRef.current?.closest<HTMLElement>(".project-card");
      if (card?.contains(event.target as Node)) return;
      setOpenProject(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutsideCard);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutsideCard);
    };
  }, [isOpen]);

  const setPanelState = (willOpen: boolean, focusPanel = false) => {
    const card = triggerRef.current?.closest<HTMLElement>(".project-card");
    const cardStyle = card ? window.getComputedStyle(card) : null;
    const pullDistance = Number.parseFloat(cardStyle?.getPropertyValue("--folder-pull-distance") ?? "") || 340;
    const restingOffset = Number.parseFloat(cardStyle?.getPropertyValue("--folder-sheet-rest") ?? "") || 82;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (willOpen && !focusPanel) triggerRef.current?.blur();
    setOpenProject(willOpen ? projectSlug : null);

    if (willOpen && focusPanel) {
      window.requestAnimationFrame(() => panelRef.current?.focus());
    }

    if (!card || reduceMotion) return;

    window.requestAnimationFrame(() => {
      const from = willOpen
        ? `translateY(${pullDistance + restingOffset}px)`
        : `translateY(${-pullDistance}px)`;
      const to = willOpen ? "translateY(0)" : `translateY(${restingOffset}px)`;

      card
        .querySelectorAll<HTMLElement>(".project-card-content-sheet, .project-tldr-content")
        .forEach((layer) => {
          layer.animate([{ transform: from }, { transform: to }], {
            duration: 280,
            easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          });
        });
    });

    if (!willOpen) window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const openPanel = (event: ReactMouseEvent<HTMLButtonElement>) => {
    setPanelState(true, event.detail === 0);
  };
  const closePanel = () => setPanelState(false);
  const closeFromBlankArea = (event: ReactMouseEvent<HTMLElement>) => {
    if (!isOpen || !(event.target instanceof Element)) return;
    if (event.target.closest("a, button")) return;
    closePanel();
  };

  return (
    <>
      <div
        ref={panelRef}
        id={panelId}
        className="project-tldr-content"
        role="region"
        aria-hidden={!isOpen}
        aria-label={`${projectTitle} quick read`}
        tabIndex={-1}
        onClick={closeFromBlankArea}
      >
        <div className="project-tldr-header">
          <span>/ TL; DR</span>
        </div>

        <div className="project-tldr-intro">
          <h4><Localized en={copy.thesisEn} zh={copy.thesisZh} /></h4>
        </div>

        <dl className="project-tldr-details">
          <div>
            <dt><Localized en="Problem" zh="问题" /></dt>
            <dd><Localized en={copy.problemEn} zh={copy.problemZh} /></dd>
          </div>
          <div>
            <dt><Localized en="Approach" zh="方法" /></dt>
            <dd><Localized en={copy.approachEn} zh={copy.approachZh} /></dd>
          </div>
        </dl>

        <Link
          href={`/projects/${projectSlug}`}
          className="project-tldr-case-link"
          tabIndex={isOpen ? 0 : -1}
        >
          <Localized
            en={isPublished ? "Read the full case" : "Open the project preview"}
            zh={isPublished ? "阅读完整案例" : "查看项目预览"}
          />
          <span aria-hidden="true">↗</span>
        </Link>
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
      />

      <section
        className={`project-folder-cover ${isOpen ? "is-open" : ""}`}
        data-open={isOpen}
        onClick={closeFromBlankArea}
      >
        <span className="project-folder-cover-shape" aria-hidden="true" />

        <div className="project-folder-cover-content">
          <Link href={`/projects/${projectSlug}`} className="project-card-title-link">
            <h3>
              <span>{projectTitle}</span>
              {projectTitleZh ? <span lang="zh-CN">{projectTitleZh}</span> : null}
            </h3>
          </Link>

          <div className="project-folder-cover-footer">
            <div>
              <span className="project-folder-index">{indexLabel}</span>
              <p># {footerTag}</p>
            </div>
            <span className="project-folder-year">{projectYear}</span>
          </div>
        </div>
      </section>
    </>
  );
}
