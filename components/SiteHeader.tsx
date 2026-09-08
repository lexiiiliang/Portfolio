"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Localized } from "./Localized";
import { SiteControls } from "./SiteControls";

const SECTIONS = [
  { id: "top", en: "Home", zh: "首页" },
  { id: "work", en: "Work", zh: "项目" },
  { id: "about", en: "About", zh: "关于" },
  { id: "contact", en: "Contact", zh: "联系" },
];

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  // Unfolding is CSS's job: :hover for pointers, :focus-within for keyboards.
  // This state is only the tap path, for touch devices that have neither.
  const [isTapOpen, setIsTapOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTapOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsTapOpen(false);
    };
    const closeOutside = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsTapOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("touchstart", closeOutside, { passive: true });
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("touchstart", closeOutside);
    };
  }, [isTapOpen]);

  const navigateToSection = (sectionId: string) => {
    const hash = `#${sectionId}`;

    if (window.location.pathname !== "/") {
      window.location.assign(`/${hash}`);
      return;
    }

    const target = document.getElementById(sectionId);
    if (!target) return;

    const root = document.documentElement;
    root.classList.add("is-section-jumping");
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    target.scrollIntoView({ behavior: "auto", block: "start" });
    window.requestAnimationFrame(() => root.classList.remove("is-section-jumping"));
  };

  const handleSectionNavigation = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    event.preventDefault();
    navigateToSection(sectionId);
    setIsTapOpen(false);
    // Drop focus so :focus-within does not hold the row open over the section
    // the user just jumped to.
    event.currentTarget.blur();
  };

  return (
    <header className={`site-header ${compact ? "is-compact" : ""}`}>
      <div className="header-inner">
        <div ref={menuRef} className={`site-toc ${isTapOpen ? "is-open" : ""}`}>
          <button
            type="button"
            className="site-toc-toggle"
            aria-label={isTapOpen ? "Close table of contents" : "Open table of contents"}
            aria-expanded={isTapOpen}
            aria-controls="site-toc-links"
            onClick={() => setIsTapOpen((current) => !current)}
          />
          {/* The links stay in the tab order and in the accessibility tree at all
              times — folding them is a purely visual affordance, and tabbing to
              one unfolds the row via :focus-within. Each link draws its own
              stroke of the folded mark, so a stroke unfolds into its own word. */}
          <nav id="site-toc-links" className="site-toc-links" aria-label="Table of contents">
            {SECTIONS.map((section) => (
              <Link
                key={section.id}
                href={`/#${section.id}`}
                onClick={(event) => handleSectionNavigation(event, section.id)}
              >
                <span className="site-toc-label">
                  <Localized en={section.en} zh={section.zh} />
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <SiteControls />
      </div>
    </header>
  );
}
