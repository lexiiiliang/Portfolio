"use client";

import { useLayoutEffect, useRef } from "react";

const REVEAL_SELECTOR = "[data-scroll-reveal]";
const STAGGER_MS = 60;
const MAX_STAGGER_STEPS = 5;

export function HomeScrollytelling({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      root.dataset.scrollytelling = "fallback";
      return;
    }

    const revealItems = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    root.dataset.scrollytelling = "ready";

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        entering.forEach((entry, index) => {
          const item = entry.target as HTMLElement;
          const staggerStep = Math.min(index, MAX_STAGGER_STEPS);
          item.style.setProperty("--scroll-reveal-delay", `${staggerStep * STAGGER_MS}ms`);
          item.dataset.visible = "true";
          observer.unobserve(item);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <main ref={ref} id="top" className="home-page">
      {children}
    </main>
  );
}
