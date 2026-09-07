"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
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
              <span />
              <span />
              <span />
              <span />
            </span>
          </button>
          <nav
            id="site-toc-links"
            className="site-toc-links"
            aria-label="Table of contents"
            aria-hidden={!isMenuOpen}
          >
            <Link href="/#top" tabIndex={isMenuOpen ? 0 : -1} onClick={() => setIsMenuOpen(false)}>
              <Localized en="Home" zh="首页" />
            </Link>
            <Link href="/#about" tabIndex={isMenuOpen ? 0 : -1} onClick={() => setIsMenuOpen(false)}>
              <Localized en="About" zh="关于" />
            </Link>
            <Link href="/#work" tabIndex={isMenuOpen ? 0 : -1} onClick={() => setIsMenuOpen(false)}>
              <Localized en="Work" zh="项目" />
            </Link>
            <Link href="/#contact" tabIndex={isMenuOpen ? 0 : -1} onClick={() => setIsMenuOpen(false)}>
              <Localized en="Contact" zh="联系" />
            </Link>
          </nav>
        </div>
        <SiteControls />
      </div>
    </header>
  );
}
