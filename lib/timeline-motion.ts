/** Measure stationary rows; only their content moves, keeping the spine anchored. */
export function mountTimelineMotion(root: HTMLElement) {
  const timeline = root.querySelector<HTMLElement>(".about-timeline");
  if (!timeline) return () => {};
  const rows = Array.from(timeline.querySelectorAll<HTMLElement>(".about-timeline-item"));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 600px)");
  const finished = new Set<HTMLElement>();
  let frame = 0;

  const finishLabel = (label: HTMLElement) => {
    label.dataset.timelineLabel = "done";
    label.style.removeProperty("--timeline-title-x");
    label.style.removeProperty("--timeline-title-opacity");
    label.style.removeProperty("--timeline-title-blur");
  };

  const finish = (row: HTMLElement) => {
    finished.add(row);
    row.dataset.timelineMotion = "done";
    row.style.removeProperty("--timeline-x");
    row.style.removeProperty("--timeline-opacity");
    row.style.removeProperty("--timeline-blur");
    row.style.removeProperty("--timeline-line");
    const label = row.querySelector<HTMLElement>(".about-timeline-kind-label");
    if (label) finishLabel(label);
  };
  const render = () => {
    frame = 0;
    // Read untransformed row geometry together before any style writes.
    const measurements = rows.filter((row) => !finished.has(row)).map((row) => {
      const rect = row.getBoundingClientRect();
      const card = row.querySelector<HTMLElement>(".about-timeline-card")!;
      const left = rect.left + card.offsetLeft;
      const fromLeft = !mobile.matches && row.dataset.kind === "education";
      const distance = fromLeft ? -(left + card.offsetWidth + 24) : innerWidth - left + 24;
      // Row spacing supplies the top-to-bottom stagger; each entrance spans 58vh.
      const progress = Math.max(0, Math.min(1, (innerHeight * .98 - rect.top) / (innerHeight * .58)));
      const label = row.querySelector<HTMLElement>(".about-timeline-kind-label");
      const labelProgress = label
        ? Math.max(0, Math.min(1, (innerHeight * .9 - rect.top - label.offsetTop) / (innerHeight * .28)))
        : 1;
      return { row, distance, progress, label, labelProgress };
    });
    measurements.forEach(({ row, distance, progress, label, labelProgress }) => {
      if (reduced.matches || progress === 1) { finish(row); return; }
      if (label && label.dataset.timelineLabel !== "done") {
        if (labelProgress === 1) finishLabel(label);
        else {
          const easedLabel = 1 - (1 - labelProgress) ** 3;
          label.dataset.timelineLabel = "entering";
          label.style.setProperty("--timeline-title-x", `${(Math.sign(distance) * 160 * (1 - easedLabel)).toFixed(2)}px`);
          label.style.setProperty("--timeline-title-opacity", easedLabel.toFixed(4));
          label.style.setProperty("--timeline-title-blur", `${(5 * (1 - easedLabel)).toFixed(2)}px`);
        }
      }
      const eased = progress * progress * (3 - 2 * progress);
      const lineProgress = Math.max(0, Math.min(1, (progress - .16) / .74));
      row.dataset.timelineMotion = progress > 0 ? "entering" : "waiting";
      row.style.setProperty("--timeline-x", `${(distance * (1 - eased)).toFixed(2)}px`);
      row.style.setProperty("--timeline-opacity", eased.toFixed(4));
      row.style.setProperty("--timeline-blur", `${(8 * (1 - eased)).toFixed(2)}px`);
      row.style.setProperty("--timeline-line", (lineProgress * lineProgress * (3 - 2 * lineProgress)).toFixed(4));
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
  const onPreference = () => {
    if (reduced.matches) rows.forEach(finish);
    else schedule();
  };
  const onFocus = (event: FocusEvent) => {
    const row = (event.target as Element).closest<HTMLElement>(".about-timeline-item");
    if (row && timeline.contains(row)) finish(row);
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(timeline);
  render();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  reduced.addEventListener("change", onPreference);
  timeline.addEventListener("focusin", onFocus);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    reduced.removeEventListener("change", onPreference);
    timeline.removeEventListener("focusin", onFocus);
    rows.forEach((row) => {
      finish(row);
      delete row.dataset.timelineMotion;
      const label = row.querySelector<HTMLElement>(".about-timeline-kind-label");
      if (label) delete label.dataset.timelineLabel;
    });
  };
}
