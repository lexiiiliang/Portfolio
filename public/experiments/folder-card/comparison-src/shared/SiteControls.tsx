"use client";

import { useEffect, useRef, useState } from "react";

type Language = "en" | "zh";
type Theme = "light" | "dark";

function MoonIcon() {
  return (
    <svg className="theme-switch-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.4 14.4A8.6 8.6 0 0 1 9.6 3.6a8.6 8.6 0 1 0 10.8 10.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="theme-switch-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 2.5v2.1M12 19.4v2.1M21.5 12h-2.1M4.6 12H2.5M18.7 5.3l-1.5 1.5M6.8 17.2l-1.5 1.5M18.7 18.7l-1.5-1.5M6.8 6.8 5.3 5.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteControls() {
  const themeTimer = useRef(0);
  const themeTarget = useRef<Theme | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const root = document.documentElement;
      setLanguage((root.dataset.lang as Language) || "en");
      setTheme((root.dataset.theme as Theme) || "light");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const changeLanguage = (next: Language) => {
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem("lexi-language", next);
    setLanguage(next);
  };

  useEffect(() => () => {
    clearTimeout(themeTimer.current);
    document.documentElement.classList.remove("theme-changing");
  }, []);

  const changeTheme = () => {
    const root = document.documentElement;
    const current = themeTarget.current || root.dataset.theme;
    const next = current === "light" ? "dark" : "light";
    themeTarget.current = next;
    const apply = () => {
      root.dataset.theme = next;
      try { window.localStorage.setItem("lexi-theme", next); } catch { /* The theme still works without storage. */ }
      setTheme(next);
    };
    const scoped = Boolean(document.querySelector(".home-page, .query-page"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    clearTimeout(themeTimer.current);
    root.classList.toggle("theme-changing", scoped && !reduced);
    apply();
    // Registered palette colors interpolate together and can reverse immediately.
    themeTimer.current = window.setTimeout(() => root.classList.remove("theme-changing"), 480);

  };

  return (
    <div className="site-controls" aria-label="Display preferences">
      <div className="language-switch" aria-label="Language">
        <button
          type="button"
          className={language === "zh" ? "is-active" : ""}
          onClick={() => changeLanguage("zh")}
          aria-pressed={language === "zh"}
        >
          中
        </button>
        <span aria-hidden="true">｜</span>
        <button
          type="button"
          className={language === "en" ? "is-active" : ""}
          onClick={() => changeLanguage("en")}
          aria-pressed={language === "en"}
        >
          EN
        </button>
      </div>
      <button
        type="button"
        className="theme-switch"
        onClick={changeTheme}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        title={theme === "light" ? "Dark mode" : "Light mode"}
      >
        <span className="theme-icon-stack" aria-hidden="true">
          <span className="theme-icon-layer theme-icon-moon"><MoonIcon /></span>
          <span className="theme-icon-layer theme-icon-sun"><SunIcon /></span>
        </span>
      </button>
    </div>
  );
}
