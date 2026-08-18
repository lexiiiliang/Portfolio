"use client";

import { useEffect, useState } from "react";

type Language = "en" | "zh";
type Theme = "light" | "dark";

export function SiteControls() {
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

  const changeTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("lexi-theme", next);
    setTheme(next);
  };

  return (
    <div className="site-controls" aria-label="Display preferences">
      <div className="language-switch" aria-label="Language">
        <button
          type="button"
          className={language === "en" ? "is-active" : ""}
          onClick={() => changeLanguage("en")}
          aria-pressed={language === "en"}
        >
          EN
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          className={language === "zh" ? "is-active" : ""}
          onClick={() => changeLanguage("zh")}
          aria-pressed={language === "zh"}
        >
          中
        </button>
      </div>
      <button
        type="button"
        className="theme-switch"
        onClick={changeTheme}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        title={theme === "light" ? "Dark mode" : "Light mode"}
      >
        <span aria-hidden="true">{theme === "light" ? "◑" : "◐"}</span>
      </button>
    </div>
  );
}
