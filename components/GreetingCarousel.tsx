"use client";

import { useEffect, useState } from "react";

const GREETINGS = ["Hi!", "¡Hola!", "Hej!", "嗨!"] as const;

export function GreetingCarousel() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [visibleCharacters, setVisibleCharacters] = useState(GREETINGS[0].length);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const greeting = GREETINGS[greetingIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(preference.matches);

    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    let delay = isDeleting ? 54 : 92;

    if (!isDeleting && visibleCharacters === greeting.length) delay = 1250;
    if (isDeleting && visibleCharacters === 0) delay = 220;

    const timeout = window.setTimeout(() => {
      if (!isDeleting && visibleCharacters === greeting.length) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && visibleCharacters === 0) {
        setGreetingIndex((current) => (current + 1) % GREETINGS.length);
        setIsDeleting(false);
        return;
      }

      setVisibleCharacters((current) => current + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [greeting, isDeleting, reduceMotion, visibleCharacters]);

  const visibleGreeting = reduceMotion
    ? GREETINGS[0]
    : greeting.slice(0, visibleCharacters);

  return (
    <span className="greeting-carousel">
      <span className="greeting-carousel-anchor" aria-hidden="true">
        <span>Hi!</span>
        <span>嗨!</span>
      </span>
      <span className="greeting-carousel-visual" aria-hidden="true">
        <span className="greeting-carousel-word">{visibleGreeting}</span>
      </span>
      <span className="sr-only">Hi, Hola, Hej, 嗨</span>
    </span>
  );
}
