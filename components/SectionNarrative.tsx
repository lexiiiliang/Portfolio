"use client";

import { useEffect, useRef, useState } from "react";
import { Localized } from "./Localized";

function TypewriterText({ text }: { text: string }) {
  const characters = Array.from(text);
  const previousText = useRef<string | null>(null);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (previousText.current === text) return;
    previousText.current = text;
    let timeoutId: number;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timeoutId = window.setTimeout(() => {
        setVisibleCharacters(characters.length);
        setIsTyping(false);
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    let currentCharacter = 0;
    const characterDelay = characters.length > 24 ? 22 : 42;
    const typeNextCharacter = () => {
      currentCharacter += 1;
      setVisibleCharacters(currentCharacter);
      if (currentCharacter < characters.length) {
        timeoutId = window.setTimeout(typeNextCharacter, characterDelay);
      } else {
        setIsTyping(false);
      }
    };

    timeoutId = window.setTimeout(() => {
      setVisibleCharacters(0);
      setIsTyping(true);
      timeoutId = window.setTimeout(typeNextCharacter, 45);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [text, characters.length]);

  return (
    <span className="section-narrative-typewriter" aria-hidden="true">
      <span className="section-narrative-measure">{text}</span>
      <span className="section-narrative-visible">
        {characters.slice(0, visibleCharacters).join("")}
        <span className="section-narrative-caret" data-visible={isTyping} />
      </span>
    </span>
  );
}

export function SectionNarrative({ en, zh, id }: { en: string; zh: string; id: string }) {
  return (
    <h2 id={id} className="section-narrative" data-scroll-reveal>
      <span className="copy-en"><TypewriterText text={en} /></span>
      <span className="copy-zh"><TypewriterText text={zh} /></span>
      <span className="sr-only"><Localized en={en} zh={zh} /></span>
    </h2>
  );
}
