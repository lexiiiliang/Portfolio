const GRID_SIZE = 11;
const GRID_CENTER = Math.floor(GRID_SIZE / 2);
const CENTER_TIME_RATIO = 0.3;
const SEEK_EPSILON = 0.001;
const FULL_TURN = Math.PI * 2;

const portrait = document.querySelector("#portrait");
const cursorVideo = document.querySelector("#cursor-video");
const winkVideo = document.querySelector("#wink-video");
const statusLabel = document.querySelector("#tracker-status");
const gridLabel = document.querySelector("#tracker-grid");
const timeLabel = document.querySelector("#tracker-time");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let targetTime = 0;
let queuedTime = null;
let seekInFlight = false;
let cursorReady = false;
let activeCell = `${GRID_CENTER}:${GRID_CENTER}`;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTime(value) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

function renderTelemetry(state = "Tracking in 2D") {
  statusLabel.textContent = state;
  timeLabel.textContent = `${formatTime(cursorVideo.currentTime)} / ${formatTime(cursorVideo.duration)}s`;
}

function renderGrid(column, row) {
  const x = column - GRID_CENTER;
  const y = row - GRID_CENTER;
  gridLabel.textContent = `GRID X ${x} · Y ${y}`;
}

function normalizePointerAxis(value, center, negativeLimit, positiveLimit) {
  const distance = value - center;
  const availableDistance = distance < 0 ? negativeLimit : positiveLimit;
  return clamp(distance / Math.max(availableDistance, 1), -1, 1);
}

function quantizeAxis(value) {
  return Math.round(((value + 1) / 2) * (GRID_SIZE - 1));
}

function timeForGridCell(column, row) {
  const gridX = column - GRID_CENTER;
  const gridY = row - GRID_CENTER;

  if (gridX === 0 && gridY === 0) {
    return cursorVideo.duration * CENTER_TIME_RATIO;
  }

  const angle = Math.atan2(gridY, gridX);
  const clockwiseProgress = ((angle % FULL_TURN) + FULL_TURN) % FULL_TURN;
  return (clockwiseProgress / FULL_TURN) * cursorVideo.duration;
}

function requestSeek() {
  if (!cursorReady || seekInFlight || queuedTime === null) return;

  const nextTime = queuedTime;
  queuedTime = null;

  if (Math.abs(nextTime - cursorVideo.currentTime) <= SEEK_EPSILON) {
    renderTelemetry();
    return;
  }

  seekInFlight = true;
  renderTelemetry("Seeking…");
  cursorVideo.currentTime = nextTime;
}

function queueSeek(nextTime) {
  targetTime = clamp(nextTime, 0, cursorVideo.duration);
  queuedTime = targetTime;
  requestSeek();
}

function handleMouseMove(event) {
  if (!cursorReady || reduceMotion.matches) return;

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
  const column = quantizeAxis(normalizedX);
  const row = quantizeAxis(normalizedY);
  const nextCell = `${column}:${row}`;

  if (nextCell === activeCell) return;

  activeCell = nextCell;
  renderGrid(column, row);
  queueSeek(timeForGridCell(column, row));
}

async function triggerWink() {
  if (!cursorReady || reduceMotion.matches) return;

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

function initializeCursorVideo() {
  if (cursorReady) return;

  cursorReady = Number.isFinite(cursorVideo.duration) && cursorVideo.duration > 0;

  if (!cursorReady) {
    renderTelemetry("Video unavailable");
    return;
  }

  targetTime = cursorVideo.duration * CENTER_TIME_RATIO;
  queuedTime = targetTime;
  renderGrid(GRID_CENTER, GRID_CENTER);
  renderTelemetry(reduceMotion.matches ? "Reduced motion" : "Tracking in 2D");
  requestSeek();
}

cursorVideo.addEventListener("loadeddata", initializeCursorVideo, { once: true });
cursorVideo.addEventListener("seeked", () => {
  seekInFlight = false;
  renderTelemetry();

  if (queuedTime !== null && Math.abs(queuedTime - cursorVideo.currentTime) > SEEK_EPSILON) {
    requestSeek();
  }
});
cursorVideo.addEventListener("error", () => renderTelemetry("Video unavailable"));

winkVideo.addEventListener("ended", finishWink);
winkVideo.addEventListener("error", finishWink);

window.addEventListener("mousemove", handleMouseMove, { passive: true });
window.addEventListener("click", triggerWink);

reduceMotion.addEventListener("change", () => {
  if (reduceMotion.matches) {
    winkVideo.pause();
    finishWink();
    renderTelemetry("Reduced motion");
  } else {
    renderTelemetry();
  }
});

if (cursorVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
  initializeCursorVideo();
}
