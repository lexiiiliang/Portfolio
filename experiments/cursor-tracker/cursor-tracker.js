const SPRITE_COLUMNS = 11;
const SPRITE_ROWS = 10;
const FRAME_COUNT = SPRITE_COLUMNS * SPRITE_ROWS;
const CENTER_FRAME = 33;
const CENTER_DEAD_ZONE = 0.075;
const RESPONSE_RATE = 22;
const MAX_PROGRESS_PER_SECOND = 1.25;
const SETTLE_THRESHOLD = 0.0004;
const FULL_TURN = Math.PI * 2;

const portrait = document.querySelector("#portrait");
const cursorSprite = document.querySelector("#cursor-sprite");
const winkVideo = document.querySelector("#wink-video");
const statusLabel = document.querySelector("#tracker-status");
const vectorLabel = document.querySelector("#tracker-grid");
const frameLabel = document.querySelector("#tracker-time");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let spriteReady = false;
let currentFrame = -1;
let targetProgress = CENTER_FRAME / FRAME_COUNT;
let displayedProgress = targetProgress;
let animationFrameId = null;
let previousTimestamp = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrapProgress(value) {
  return ((value % 1) + 1) % 1;
}

function shortestProgressDelta(from, to) {
  return ((to - from + 1.5) % 1) - 0.5;
}

function formatCoordinate(value) {
  const rounded = Math.abs(value) < 0.005 ? 0 : value;
  return `${rounded >= 0 ? "+" : ""}${rounded.toFixed(2)}`;
}

function renderTelemetry(state = "Tracking smoothly") {
  statusLabel.textContent = state;
  frameLabel.textContent = `FRAME ${String(Math.max(currentFrame + 1, 1)).padStart(3, "0")} / ${FRAME_COUNT}`;
}

function renderVector(x, y) {
  vectorLabel.textContent = `X ${formatCoordinate(x)} · Y ${formatCoordinate(y)}`;
}

function renderFrame(frameIndex) {
  const normalizedFrame = ((frameIndex % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
  if (normalizedFrame === currentFrame) return;

  currentFrame = normalizedFrame;
  const column = normalizedFrame % SPRITE_COLUMNS;
  const row = Math.floor(normalizedFrame / SPRITE_COLUMNS);
  const xPercent = column * (100 / SPRITE_COLUMNS);
  const yPercent = row * (100 / SPRITE_ROWS);

  cursorSprite.style.transform = `translate3d(${-xPercent}%, ${-yPercent}%, 0)`;
  renderTelemetry();
}

function animateTowardsTarget(timestamp) {
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
}

function requestFrameUpdate() {
  if (animationFrameId !== null || reduceMotion.matches) return;
  animationFrameId = requestAnimationFrame(animateTowardsTarget);
}

function normalizePointerAxis(value, center, negativeLimit, positiveLimit) {
  const distance = value - center;
  const availableDistance = distance < 0 ? negativeLimit : positiveLimit;
  return clamp(distance / Math.max(availableDistance, 1), -1, 1);
}

function handleMouseMove(event) {
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
  const radius = Math.hypot(normalizedX, normalizedY);

  renderVector(normalizedX, normalizedY);

  if (radius < CENTER_DEAD_ZONE) {
    targetProgress = CENTER_FRAME / FRAME_COUNT;
  } else {
    const angle = Math.atan2(normalizedY, normalizedX);
    targetProgress = wrapProgress(angle / FULL_TURN);
  }

  requestFrameUpdate();
}

async function triggerWink() {
  if (!spriteReady || reduceMotion.matches) return;

  winkVideo.pause();
  winkVideo.currentTime = 0;
  portrait.classList.add("is-winking");
  renderTelemetry("Winking");

  try {
    await winkVideo.play();
  } catch {
    portrait.classList.remove("is-winking");
    renderTelemetry("Wink unavailable");
  }
}

function finishWink() {
  portrait.classList.remove("is-winking");
  renderTelemetry();
}

function initializeSprite() {
  if (spriteReady) return;

  spriteReady = cursorSprite.complete && cursorSprite.naturalWidth > 0;
  if (!spriteReady) {
    renderTelemetry("Sprite unavailable");
    return;
  }

  displayedProgress = CENTER_FRAME / FRAME_COUNT;
  targetProgress = displayedProgress;
  renderFrame(CENTER_FRAME);
  renderVector(0, 0);
  renderTelemetry(reduceMotion.matches ? "Reduced motion" : "Tracking smoothly");
}

cursorSprite.addEventListener("load", initializeSprite, { once: true });
cursorSprite.addEventListener("error", () => renderTelemetry("Sprite unavailable"));

winkVideo.addEventListener("ended", finishWink);
winkVideo.addEventListener("error", finishWink);

window.addEventListener("mousemove", handleMouseMove, { passive: true });
window.addEventListener("click", triggerWink);

reduceMotion.addEventListener("change", () => {
  if (reduceMotion.matches) {
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    previousTimestamp = null;
    winkVideo.pause();
    finishWink();
    displayedProgress = CENTER_FRAME / FRAME_COUNT;
    targetProgress = displayedProgress;
    renderFrame(CENTER_FRAME);
    renderVector(0, 0);
    renderTelemetry("Reduced motion");
  } else {
    renderTelemetry();
  }
});

if (cursorSprite.complete) {
  initializeSprite();
}
