"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Localized } from "./Localized";
import { SiteControls } from "./SiteControls";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    const closeOutside = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("touchstart", closeOutside, { passive: true });
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("touchstart", closeOutside);
    };
  }, [isMenuOpen]);

  const openFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") setIsMenuOpen(true);
  };

  const closeFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") setIsMenuOpen(false);
  };

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
    setIsMenuOpen(false);
  };

  return (
    <header className={`site-header ${compact ? "is-compact" : ""}`}>
      <div className="header-inner">
        <div
          ref={menuRef}
          className={`site-toc ${isMenuOpen ? "is-open" : ""}`}
          onPointerEnter={openFromPointer}
          onPointerLeave={closeFromPointer}
        >
          <button
            type="button"
            className="site-toc-toggle"
            aria-label={isMenuOpen ? "Close table of contents" : "Open table of contents"}
            aria-expanded={isMenuOpen}
            aria-controls="site-toc-links"
            onClick={(event) => {
              const mouseCanHover = window.matchMedia("(hover: hover)").matches;

              if (event.detail > 0 && mouseCanHover) {
                setIsMenuOpen(true);
                return;
              }

              setIsMenuOpen((current) => !current);
            }}
          >
            <span className="site-toc-icon" aria-hidden="true">
              <Image src="/media/nav-fold.svg" alt="" width={18} height={38} priority />
            </span>
          </button>
          <nav
            id="site-toc-links"
            className="site-toc-links"
            aria-label="Table of contents"
            aria-hidden={!isMenuOpen}
          >
            <Link
              href="/#top"
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={(event) => handleSectionNavigation(event, "top")}
            >
              <Localized en="Home" zh="首页" />
            </Link>
            <Link
              href="/#work"
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={(event) => handleSectionNavigation(event, "work")}
            >
              <Localized en="Work" zh="项目" />
            </Link>
            <Link
              href="/#about"
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={(event) => handleSectionNavigation(event, "about")}
            >
              <Localized en="About" zh="关于" />
            </Link>
            <Link
              href="/#contact"
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={(event) => handleSectionNavigation(event, "contact")}
            >
              <Localized en="Contact" zh="联系" />
            </Link>
          </nav>
        </div>
        <SiteControls />
      </div>
    </header>
  );
}
