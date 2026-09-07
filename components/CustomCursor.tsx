"use client";

import { useEffect, useRef } from "react";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const portraitCursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const portraitCursor = portraitCursorRef.current;
    if (!cursor || !portraitCursor) return;

    const root = document.documentElement;
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    let animationFrameId: number | null = null;
    let waveRestartFrameId: number | null = null;
    let pointerX = -100;
    let pointerY = -100;

    const syncVariantAtPointer = () => {
      const pointerTarget = document.elementFromPoint(pointerX, pointerY);
      const isOverPortrait = pointerTarget instanceof Element
        && Boolean(pointerTarget.closest(".portrait-tracker"));
      cursor.dataset.variant = isOverPortrait ? "portrait" : "default";
      if (!isOverPortrait) cursor.classList.remove("is-waving");
    };

    const renderPosition = () => {
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      syncVariantAtPointer();
      animationFrameId = null;
    };

    const queuePosition = () => {
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(renderPosition);
      }
    };

    const syncPointerMode = () => {
      if (finePointer.matches) {
        root.dataset.customCursor = "true";
      } else {
        delete root.dataset.customCursor;
        cursor.dataset.visible = "false";
        cursor.dataset.variant = "default";
      }
    };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;

      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.dataset.visible = "true";
      queuePosition();
    };

    const handleScroll = () => {
      if (finePointer.matches && cursor.dataset.visible === "true") queuePosition();
    };

    const handlePointerOut = (event: globalThis.PointerEvent) => {
      if (event.relatedTarget === null) cursor.dataset.visible = "false";
    };

    const handlePointerDown = (event: globalThis.PointerEvent) => {
      if (
        !finePointer.matches
        || event.pointerType === "touch"
        || !event.isPrimary
        || event.button !== 0
        || !(event.target instanceof Element)
        || !event.target.closest(".portrait-tracker")
      ) return;

      cursor.classList.remove("is-waving");
      if (waveRestartFrameId !== null) {
        window.cancelAnimationFrame(waveRestartFrameId);
      }
      waveRestartFrameId = window.requestAnimationFrame(() => {
        cursor.classList.add("is-waving");
        waveRestartFrameId = null;
      });
    };

    const finishWave = () => cursor.classList.remove("is-waving");

    const handleVisibilityChange = () => {
      if (document.hidden) cursor.dataset.visible = "false";
    };

    syncPointerMode();
    finePointer.addEventListener("change", syncPointerMode);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerout", handlePointerOut);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    portraitCursor.addEventListener("animationend", finishWave);

    return () => {
      delete root.dataset.customCursor;
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
      if (waveRestartFrameId !== null) window.cancelAnimationFrame(waveRestartFrameId);
      finePointer.removeEventListener("change", syncPointerMode);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      portraitCursor.removeEventListener("animationend", finishWave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      data-variant="default"
      data-visible="false"
      aria-hidden="true"
    >
      <span className="custom-cursor-dot" />
      <span ref={portraitCursorRef} className="custom-cursor-portrait">👋</span>
    </div>
  );
}
