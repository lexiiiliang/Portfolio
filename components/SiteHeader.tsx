import Link from "next/link";
import { Localized } from "./Localized";
import { SiteControls } from "./SiteControls";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`site-header ${compact ? "is-compact" : ""}`}>
      <div className="header-inner">
        <Link href="/" className="wordmark" aria-label="Lexi Liang — home">
          LEXI<span aria-hidden="true">↗</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/#work"><Localized en="Work" zh="项目" /></Link>
          <Link href="/#about"><Localized en="About" zh="关于" /></Link>
          <Link href="/#contact"><Localized en="Contact" zh="联系" /></Link>
        </nav>
        <SiteControls />
      </div>
    </header>
  );
}
