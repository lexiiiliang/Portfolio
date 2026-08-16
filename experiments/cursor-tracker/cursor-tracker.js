const SENSITIVITY = 0.8;
const SEEK_EPSILON = 0.001;

const portrait = document.querySelector("#portrait");
const cursorVideo = document.querySelector("#cursor-video");
const winkVideo = document.querySelector("#wink-video");
const statusLabel = document.querySelector("#tracker-status");
const timeLabel = document.querySelector("#tracker-time");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let prevX = null;
let targetTime = 0;
let queuedTime = null;
let seekInFlight = false;
let cursorReady = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTime(value) {
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
}

function renderTelemetry(state = "Tracking cursor") {
  statusLabel.textContent = state;
  timeLabel.textContent = `${formatTime(cursorVideo.currentTime)} / ${formatTime(cursorVideo.duration)}s`;
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

  if (prevX === null) {
    prevX = event.clientX;
    return;
  }

  const delta = event.clientX - prevX;
  prevX = event.clientX;

  const timeOffset = (delta / window.innerWidth) * SENSITIVITY * cursorVideo.duration;
  queueSeek(targetTime + timeOffset);
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

  targetTime = cursorVideo.duration / 2;
  queuedTime = targetTime;
  renderTelemetry(reduceMotion.matches ? "Reduced motion" : "Tracking cursor");
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
window.addEventListener("blur", () => {
  prevX = null;
});

reduceMotion.addEventListener("change", () => {
  prevX = null;
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
