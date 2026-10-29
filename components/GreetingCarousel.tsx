"use client";

import { useEffect, useState } from "react";
import { TextRotation } from "./CharacterRotation";

const GREETINGS = ["Hi!", "¡Hola!", "Hej!", "嗨!"] as const;
const CYCLE_MS = 2900;

export function GreetingCarousel() {
  const [greetingIndex, setGreetingIndex] = useState(0);
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
    const interval = window.setInterval(() => {
      setGreetingIndex((current) => (current + 1) % GREETINGS.length);
    }, CYCLE_MS);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  return (
    <span className="greeting-carousel">
      <span className="greeting-carousel-anchor" aria-hidden="true">
        {GREETINGS.map((word) => <span key={word}>{word}</span>)}
      </span>
      <span className="greeting-carousel-visual" aria-hidden="true">
        <span className="greeting-carousel-word">
          <TextRotation text={greeting} />
        </span>
      </span>
      <span className="greeting-carousel-reduced" aria-hidden="true">Hi!</span>
      <span className="sr-only">Hi, Hola, Hej, 嗨</span>
    </span>
  );
}
