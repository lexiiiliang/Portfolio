/** Separate each button's entrance from its hover-driven FLIP morph. */
export function mountContactEntrance(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>(".contact-morph-list");
  if (!list) return () => {};
  const items = Array.from(list.querySelectorAll<HTMLElement>(".contact-morph-item"));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const animations = new Map<HTMLElement, Animation>();
  const finish = (item: HTMLElement) => {
    animations.get(item)?.cancel();
    animations.delete(item);
    item.dataset.contactReveal = "done";
  };
  const start: IntersectionObserverCallback = ([entry]) => {
    if (!entry.isIntersecting || entry.intersectionRatio < .8) return;
    observer.unobserve(list);
    items.forEach((item, index) => {
      if (item.dataset.contactReveal !== "waiting") return;
      if (reduced.matches) { finish(item); return; }
      item.dataset.contactReveal = "running";
      const animation = item.animate([
        { translate: "0 24px", opacity: 0 },
        { translate: "0 -2px", opacity: 1, offset: .8 },
        { translate: "0 0px", opacity: 1 },
      ], { duration: 640, delay: index * 110, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" });
      animations.set(item, animation);
      animation.finished.then(() => {
        if (animations.get(item) === animation) {
          animations.delete(item);
          item.dataset.contactReveal = "done";
        }
      }).catch(() => { /* Interaction, reduced motion, or unmount can finish early. */ });
    });
  };
  const createObserver = () => new IntersectionObserver(start, {
    rootMargin: `0px 0px -${Math.round(innerHeight * .38)}px 0px`, threshold: .8,
  });
  let observer = createObserver();
  const onResize = () => {
    observer.disconnect();
    observer = createObserver();
    if (items.some((item) => item.dataset.contactReveal === "waiting")) observer.observe(list);
  };
  const onPreference = () => { if (reduced.matches) items.forEach(finish); };
  const onInteraction = (event: Event) => {
    const item = (event.target as Element).closest<HTMLElement>(".contact-morph-item");
    if (item && list.contains(item)) finish(item);
  };
  items.forEach((item) => { item.dataset.contactReveal = "waiting"; });
  if (reduced.matches) items.forEach(finish);
  else observer.observe(list);
  window.addEventListener("resize", onResize);
  list.addEventListener("focusin", onInteraction);
  list.addEventListener("pointerdown", onInteraction);
  reduced.addEventListener("change", onPreference);
  return () => {
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
    items.forEach((item) => { delete item.dataset.contactReveal; });
    window.removeEventListener("resize", onResize);
    list.removeEventListener("focusin", onInteraction);
    list.removeEventListener("pointerdown", onInteraction);
    reduced.removeEventListener("change", onPreference);
  };
}
