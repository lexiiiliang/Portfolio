"use client";

import { useEffect, useRef } from "react";

const SPRITE_COLUMNS = 11;
const SPRITE_ROWS = 10;
const FRAME_COUNT = SPRITE_COLUMNS * SPRITE_ROWS;
const CENTER_FRAME = 33;
const CENTER_DEAD_ZONE = 0.075;
const RESPONSE_RATE = 22;
const MAX_PROGRESS_PER_SECOND = 1.25;
const SETTLE_THRESHOLD = 0.0004;
const FULL_TURN = Math.PI * 2;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const wrapProgress = (value: number) => ((value % 1) + 1) % 1;

const shortestProgressDelta = (from: number, to: number) =>
  ((to - from + 1.5) % 1) - 0.5;

export function PortraitToy() {
  const portraitRef = useRef<HTMLButtonElement>(null);
  const spriteRef = useRef<HTMLImageElement>(null);
  const winkRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const portrait = portraitRef.current;
    const sprite = spriteRef.current;
    const wink = winkRef.current;
    if (!portrait || !sprite || !wink) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let spriteReady = false;
    let currentFrame = -1;
    let targetProgress = CENTER_FRAME / FRAME_COUNT;
    let displayedProgress = targetProgress;
    let animationFrameId: number | null = null;
    let previousTimestamp: number | null = null;

    const renderFrame = (frameIndex: number) => {
      const normalizedFrame = ((frameIndex % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
      if (normalizedFrame === currentFrame) return;

      currentFrame = normalizedFrame;
      const column = normalizedFrame % SPRITE_COLUMNS;
      const row = Math.floor(normalizedFrame / SPRITE_COLUMNS);
      const xPercent = column * (100 / SPRITE_COLUMNS);
      const yPercent = row * (100 / SPRITE_ROWS);
      sprite.style.transform = `translate3d(${-xPercent}%, ${-yPercent}%, 0)`;
    };

    const animateTowardsTarget = (timestamp: number) => {
      if (!spriteReady || reduceMotion.matches) {
        animationFrameId = null;
        previousTimestamp = null;
        return;
      }

      if (previousTimestamp === null) previousTimestamp = timestamp;

      const elapsedSeconds = clamp((timestamp - previousTimestamp) / 1000, 0, 0.05);
      const delta = shortestProgressDelta(displayedProgress, targetProgress);
      const interpolation = 1 - Math.exp(-RESPONSE_RATE * elapsedSeconds);
      const progressStep = clamp(
        delta * interpolation,
        -MAX_PROGRESS_PER_SECOND * elapsedSeconds,
        MAX_PROGRESS_PER_SECOND * elapsedSeconds,
      );

      displayedProgress = wrapProgress(displayedProgress + progressStep);
      renderFrame(Math.round(displayedProgress * FRAME_COUNT) % FRAME_COUNT);
      previousTimestamp = timestamp;

      if (Math.abs(shortestProgressDelta(displayedProgress, targetProgress)) > SETTLE_THRESHOLD) {
        animationFrameId = requestAnimationFrame(animateTowardsTarget);
        return;
      }

      displayedProgress = targetProgress;
      renderFrame(Math.round(displayedProgress * FRAME_COUNT) % FRAME_COUNT);
      animationFrameId = null;
      previousTimestamp = null;
    };

    const requestFrameUpdate = () => {
      if (animationFrameId !== null || reduceMotion.matches) return;
      animationFrameId = requestAnimationFrame(animateTowardsTarget);
    };

    const normalizePointerAxis = (
      value: number,
      center: number,
      negativeLimit: number,
      positiveLimit: number,
    ) => {
      const distance = value - center;
      const availableDistance = distance < 0 ? negativeLimit : positiveLimit;
      return clamp(distance / Math.max(availableDistance, 1), -1, 1);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!spriteReady || reduceMotion.matches) return;

      const rect = portrait.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normalizedX = normalizePointerAxis(
        event.clientX,
        centerX,
        centerX,
        window.innerWidth - centerX,
      );
      const normalizedY = normalizePointerAxis(
        event.clientY,
        centerY,
        centerY,
        window.innerHeight - centerY,
      );

      if (Math.hypot(normalizedX, normalizedY) < CENTER_DEAD_ZONE) {
        targetProgress = CENTER_FRAME / FRAME_COUNT;
      } else {
        targetProgress = wrapProgress(Math.atan2(normalizedY, normalizedX) / FULL_TURN);
      }

      requestFrameUpdate();
    };

    const finishWink = () => portrait.classList.remove("is-winking");

    const triggerWink = async () => {
      if (!spriteReady || reduceMotion.matches) return;

      wink.pause();
      wink.currentTime = 0;
      portrait.classList.add("is-winking");

      try {
        await wink.play();
      } catch {
        finishWink();
      }
    };

    const initializeSprite = () => {
      if (spriteReady) return;
      spriteReady = sprite.complete && sprite.naturalWidth > 0;
      if (!spriteReady) return;

      displayedProgress = CENTER_FRAME / FRAME_COUNT;
      targetProgress = displayedProgress;
      renderFrame(CENTER_FRAME);
    };

    const handleMotionPreference = () => {
      if (reduceMotion.matches) {
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        previousTimestamp = null;
        wink.pause();
        finishWink();
        displayedProgress = CENTER_FRAME / FRAME_COUNT;
        targetProgress = displayedProgress;
        renderFrame(CENTER_FRAME);
      }
    };

    sprite.addEventListener("load", initializeSprite, { once: true });
    wink.addEventListener("ended", finishWink);
    wink.addEventListener("error", finishWink);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", triggerWink);
    reduceMotion.addEventListener("change", handleMotionPreference);

    if (sprite.complete) initializeSprite();

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      sprite.removeEventListener("load", initializeSprite);
      wink.removeEventListener("ended", finishWink);
      wink.removeEventListener("error", finishWink);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", triggerWink);
      reduceMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <button
      ref={portraitRef}
      type="button"
      className="portrait-tracker"
      aria-label="Interactive portrait. Move the pointer around the page to change the gaze, then click to wink."
    >
      <span className="portrait-tracker-media" aria-hidden="true">
        {/* The single sprite sheet is intentionally rendered as a movable image layer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={spriteRef}
          className="cursor-sprite"
          src="/media/cursor-tracker/cursor-sprite.webp"
          alt=""
          width="2816"
          height="2560"
          fetchPriority="high"
          draggable={false}
          style={{ transform: "translate3d(0%, -30%, 0)" }}
        />
        <video
          ref={winkRef}
          className="portrait-wink-video"
          muted
          playsInline
          preload="auto"
        >
          <source src="/media/cursor-tracker/click-wink.mp4" type="video/mp4" />
        </video>
      </span>
    </button>
  );
}
