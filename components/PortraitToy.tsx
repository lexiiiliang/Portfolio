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
    const finePointer = window.matchMedia("(any-pointer: fine)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const conserveData = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "");
    let disposed = false;
    const isVisible = () => {
      const rect = portrait.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };
    let visible = isVisible();
    let spriteRequested = false;
    let idleId: number | undefined;
    let idleTimer: number | undefined;
    let spriteReady = false;
    let winkPlayRequest = 0;
    let winkDownload: Promise<void> | null = null;
    let winkObjectUrl: string | null = null;
    const winkAbort = new AbortController();
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
      if (!spriteReady || reduceMotion.matches || !visible || document.hidden) {
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
      if (animationFrameId !== null || !spriteReady || reduceMotion.matches || !visible || document.hidden) return;
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
      if (reduceMotion.matches || !visible || document.hidden) return;
      loadSprite();

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
      if (reduceMotion.matches) return;

      const request = ++winkPlayRequest;
      await warmWink();
      if (disposed || request !== winkPlayRequest || !winkObjectUrl) return;
      wink.pause();
      wink.currentTime = 0;

      try {
        await wink.play();
      } catch {
        if (request === winkPlayRequest) finishWink();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      void triggerWink();
    };

    const handleKeyboardClick = (event: MouseEvent) => {
      if (event.detail === 0) void triggerWink();
    };

    const initializeSprite = async () => {
      if (spriteReady) return;
      if (!sprite.complete || sprite.naturalWidth === 0) return;
      try { await sprite.decode(); } catch { return; }
      if (disposed) return;
      spriteReady = true;

      displayedProgress = CENTER_FRAME / FRAME_COUNT;
      renderFrame(CENTER_FRAME);
      portrait.classList.add("has-sprite");
      requestFrameUpdate();
    };

    const loadSprite = () => {
      if (spriteRequested || reduceMotion.matches || !finePointer.matches || !visible || document.hidden) return;
      // Give the short wink time to buffer before the much larger gaze atlas
      // joins the network queue. Pointer coordinates are retained meanwhile.
      if (winkDownload) return;
      spriteRequested = true;
      // Keep the 110-frame atlas out of the initial document's preload queue.
      sprite.srcset = "/media/cursor-tracker/cursor-sprite.webp 1x, /media/cursor-tracker/cursor-sprite@2x.webp 2x";
      sprite.src = "/media/cursor-tracker/cursor-sprite.webp";
    };

    const warmWink = () => {
      if (reduceMotion.matches || winkObjectUrl) return Promise.resolve();
      if (winkDownload) return winkDownload;
      // Fetch the complete 223 KB clip before playback. Native media buffering
      // can report "enough data" early and then stall while the atlas downloads.
      winkDownload = fetch("/media/cursor-tracker/click-wink-web.mp4", { signal: winkAbort.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error("Wink unavailable");
          const clip = await response.blob();
          if (disposed) return;
          winkObjectUrl = URL.createObjectURL(clip);
          wink.src = winkObjectUrl;
          wink.preload = "auto";
          wink.load();
        })
        .catch(() => {
          if (!disposed) finishWink();
        })
        .finally(() => {
          winkDownload = null;
          if (!disposed) loadSprite();
        });
      return winkDownload;
    };
    const showWink = () => portrait.classList.add("is-winking");
    const handleWinkError = () => {
      finishWink();
      if (winkObjectUrl) URL.revokeObjectURL(winkObjectUrl);
      winkObjectUrl = null;
      loadSprite();
    };
    const scheduleMedia = () => {
      if (conserveData || reduceMotion.matches || !visible || document.hidden
        || idleId !== undefined || idleTimer !== undefined) return;
      const start = () => {
        idleId = undefined;
        idleTimer = undefined;
        visible = isVisible();
        if (disposed || reduceMotion.matches || !visible || document.hidden) return;
        // Prepare the short interaction only after the first screen has loaded.
        // Starting here also warms touch/keyboard visits before their first click.
        warmWink();
        loadSprite();
      };
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(start, { timeout: 2000 });
      } else {
        idleTimer = window.setTimeout(start, 200);
      }
    };

    const handleMotionPreference = () => {
      if (reduceMotion.matches) {
        winkPlayRequest++;
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        previousTimestamp = null;
        wink.pause();
        finishWink();
        displayedProgress = CENTER_FRAME / FRAME_COUNT;
        targetProgress = displayedProgress;
        renderFrame(CENTER_FRAME);
      } else {
        scheduleMedia();
      }
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && document.readyState === "complete") scheduleMedia();
    });
    visibilityObserver.observe(portrait);
    sprite.addEventListener("load", initializeSprite, { once: true });
    wink.addEventListener("playing", showWink);
    wink.addEventListener("ended", finishWink);
    // Source-element errors do not bubble, so also catch them during capture.
    wink.addEventListener("error", handleWinkError, true);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    portrait.addEventListener("pointerdown", handlePointerDown);
    portrait.addEventListener("click", handleKeyboardClick);
    portrait.addEventListener("pointerenter", warmWink);
    portrait.addEventListener("focus", warmWink);
    reduceMotion.addEventListener("change", handleMotionPreference);

    if (document.readyState === "complete") scheduleMedia();
    else window.addEventListener("load", scheduleMedia, { once: true });

    return () => {
      disposed = true;
      winkPlayRequest++;
      winkAbort.abort();
      wink.pause();
      wink.removeAttribute("src");
      wink.load();
      if (winkObjectUrl) URL.revokeObjectURL(winkObjectUrl);
      visibilityObserver.disconnect();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (idleTimer !== undefined) window.clearTimeout(idleTimer);
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("load", scheduleMedia);
      sprite.removeEventListener("load", initializeSprite);
      wink.removeEventListener("playing", showWink);
      wink.removeEventListener("ended", finishWink);
      wink.removeEventListener("error", handleWinkError, true);
      window.removeEventListener("mousemove", handleMouseMove);
      portrait.removeEventListener("pointerdown", handlePointerDown);
      portrait.removeEventListener("click", handleKeyboardClick);
      portrait.removeEventListener("pointerenter", warmWink);
      portrait.removeEventListener("focus", warmWink);
      reduceMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <div className="portrait-tracker-wrap">
      <button
        ref={portraitRef}
        type="button"
        className="portrait-tracker"
        aria-label="Interactive portrait. Move the pointer around the page to change the gaze, then click to wink."
      >
        <span className="portrait-tracker-media" aria-hidden="true">
          {/* Lossless crops of the original center frame keep the first paint identical. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="portrait-poster"
            src="/media/cursor-tracker/portrait-poster.webp"
            srcSet="/media/cursor-tracker/portrait-poster.webp 1x, /media/cursor-tracker/portrait-poster@2x.webp 2x"
            alt=""
            width="256"
            height="256"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={spriteRef}
            className="cursor-sprite"
            alt=""
            width="2816"
            height="2560"
            fetchPriority="low"
            decoding="async"
            draggable={false}
            style={{ transform: "translate3d(0%, -30%, 0)" }}
          />
          <video
            ref={winkRef}
            className="portrait-wink-video"
            muted
            playsInline
            preload="none"
          />
        </span>
      </button>
    </div>
  );
}
