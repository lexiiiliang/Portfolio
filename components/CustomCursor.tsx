"use client";

import { useEffect, useRef } from "react";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const root = document.documentElement;
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    let animationFrameId: number | null = null;
    let pointerX = -100;
    let pointerY = -100;

    const renderPosition = () => {
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
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
      cursor.dataset.variant = event.target instanceof Element
        && event.target.closest(".portrait-tracker")
        ? "portrait"
        : "default";
      queuePosition();
    };

    const handlePointerOut = (event: globalThis.PointerEvent) => {
      if (event.relatedTarget === null) cursor.dataset.visible = "false";
    };

    const handleVisibilityChange = () => {
      if (document.hidden) cursor.dataset.visible = "false";
    };

    syncPointerMode();
    finePointer.addEventListener("change", syncPointerMode);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      delete root.dataset.customCursor;
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
      finePointer.removeEventListener("change", syncPointerMode);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
      <span className="custom-cursor-portrait">
        <span className="custom-cursor-wave">👋</span>
        <span>打个招呼!</span>
      </span>
    </div>
  );
}
