"use client";

import { useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { Localized } from "./Localized";

export function PortraitToy() {
  const [clicks, setClicks] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handlePointer = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const style = {
    "--pointer-x": `${position.x}%`,
    "--pointer-y": `${position.y}%`,
    "--turn": `${clicks * 23}deg`,
  } as CSSProperties;

  return (
    <button
      type="button"
      className={`portrait-toy ${clicks >= 4 ? "is-discovered" : ""}`}
      style={style}
      onPointerMove={handlePointer}
      onPointerLeave={() => setPosition({ x: 50, y: 50 })}
      onClick={() => setClicks((value) => (value + 1) % 8)}
      aria-label="Interactive portrait. Move your pointer and click to discover a message."
    >
      <span className="portrait-grid" aria-hidden="true" />
      <span className="portrait-orbit orbit-one" aria-hidden="true" />
      <span className="portrait-orbit orbit-two" aria-hidden="true" />
      <span className="portrait-pupil" aria-hidden="true">L</span>
      <span className="portrait-spark spark-one" aria-hidden="true">✦</span>
      <span className="portrait-spark spark-two" aria-hidden="true">·</span>
      <span className="portrait-caption">
        {clicks >= 4 ? (
          <Localized en="Curiosity is a design tool." zh="好奇心也是一种设计工具。" />
        ) : (
          <Localized en="A portrait in motion — try me" zh="一张会动的肖像 — 试试看" />
        )}
      </span>
    </button>
  );
}
