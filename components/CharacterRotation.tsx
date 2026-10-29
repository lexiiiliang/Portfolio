"use client";

import { Fragment, useEffect, useRef, useState } from "react";

export const ROTATION_EXIT_MS = 220;
export const ROTATION_ENTER_MS = 500;
// Keep every character distinct, including the end of longer contact prompts.
export const characterDelay = (index: number) => index * 60;
export type RotationPhase = "idle" | "exit" | "gap" | "enter";

export function CharacterRotation({ text, phase }: { text: string; phase: RotationPhase }) {
  const words = text.split(/(\s+|[\u3400-\u9fff])/).filter(Boolean);
  return (
    <span className="character-rotation" data-phase={phase}>
      {words.map((word, wordIndex) => {
        if (/^\s+$/.test(word)) {
          return <Fragment key={wordIndex}>{word}</Fragment>;
        }
        return (
          <span className="character-rotation-word" key={wordIndex}>
            {Array.from(word).map((character, index) => {
              const characterIndex = Array.from(words.slice(0, wordIndex).join("")).length + index;
              return <span className="character-rotation-letter" key={characterIndex}
                style={{ animationDelay: `${Math.min(characterIndex * 12, 120)}ms`, transitionDelay: `${phase === "exit" ? Math.min(characterIndex * 12, 120) : characterDelay(characterIndex)}ms` }}>{character}</span>;
            })}
          </span>
        );
      })}
    </span>
  );
}


export function TextRotation({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState(text);
  const [outgoing, setOutgoing] = useState<string | null>(null);
  const [phase, setPhase] = useState<RotationPhase>("idle");
  const displayedRef = useRef(text);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let start = 0;
    let enter = 0;
    let finish = 0;
    const update = () => {
      clearTimeout(start);
      clearTimeout(enter);
      clearTimeout(finish);
      start = window.setTimeout(() => {
        if (reduced.matches) {
          displayedRef.current = text;
          setDisplayed(text);
          setOutgoing(null);
          setPhase("idle");
          return;
        }
        if (displayedRef.current === text) {
          setPhase("enter");
          setOutgoing(null);
          return;
        }
        setOutgoing(displayedRef.current);
        displayedRef.current = text;
        setDisplayed(text);
        setPhase("gap");
        // Start the next phrase while the outgoing phrase is still fading.
        enter = window.setTimeout(() => setPhase("enter"), 100);
        finish = window.setTimeout(() => setOutgoing(null), 300);
      }, 0);
    };
    update();
    reduced.addEventListener("change", update);
    return () => {
      clearTimeout(start);
      clearTimeout(enter);
      clearTimeout(finish);
      reduced.removeEventListener("change", update);
    };
  }, [text]);

  return (
    <span className="text-rotation-stack">
      {outgoing && <span className="text-rotation-outgoing" aria-hidden="true">
        <CharacterRotation text={outgoing} phase="exit" />
      </span>}
      <span className="text-rotation-current" key={displayed}>
        <CharacterRotation text={displayed} phase={phase} />
      </span>
    </span>
  );
}
