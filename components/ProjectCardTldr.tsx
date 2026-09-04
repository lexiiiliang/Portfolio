"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useSyncExternalStore } from "react";
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
  projectYear: string;
  eyebrowEn: string;
  eyebrowZh: string;
  copy: ProjectTldrCopy;
  isPublished: boolean;
};

export function ProjectCardTldr({
  projectSlug,
  projectTitle,
  projectYear,
  eyebrowEn,
  eyebrowZh,
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

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenProject(null);
      triggerRef.current?.focus();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const togglePanel = () => {
    setOpenProject(isOpen ? null : projectSlug);
  };

  return (
    <section className={`project-card-drawer ${isOpen ? "is-open" : ""}`} data-open={isOpen}>
      <span className="project-card-drawer-surface" aria-hidden="true" />
      <span className="project-card-drawer-shoulder" aria-hidden="true" />

      <button
        ref={triggerRef}
        type="button"
        className="project-card-drawer-handle"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={togglePanel}
      >
        <span>{isOpen ? <Localized en="Close" zh="收起" /> : "TL;DR"}</span>
        <span className="project-card-drawer-chevron" aria-hidden="true">↓</span>
      </button>

      <div className="project-card-default" aria-hidden={isOpen}>
        <div>
          <Link
            href={`/projects/${projectSlug}`}
            className="project-card-title-link"
            tabIndex={isOpen ? -1 : 0}
          >
            <h3>{projectTitle}</h3>
          </Link>
          <p className="project-card-tags">
            <Localized en={eyebrowEn} zh={eyebrowZh} />
          </p>
        </div>

        <div className="project-card-default-footer">
          <span className="project-card-status">
            {isPublished ? (
              <Localized en="Published" zh="已发布" />
            ) : (
              <Localized en="In progress" zh="进行中" />
            )}
          </span>
          <Link
            href={`/projects/${projectSlug}`}
            className="project-card-case-link"
            tabIndex={isOpen ? -1 : 0}
          >
            <span>
              {isPublished ? (
                <Localized en="Full case" zh="完整案例" />
              ) : (
                <Localized en="Preview" zh="项目预览" />
              )}
            </span>
            <span className="open-mark" aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <div
        id={panelId}
        className="project-tldr-content"
        aria-hidden={!isOpen}
        aria-label={`${projectTitle} quick read`}
      >
        <div className="project-tldr-header">
          <span>{projectTitle}</span>
          <span>{projectYear} / 30 SEC</span>
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
          <div>
            <dt><Localized en="Status" zh="进展" /></dt>
            <dd><Localized en={copy.statusEn} zh={copy.statusZh} /></dd>
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
    </section>
  );
}
