/** Scroll owns the entrance distance. Read nearby geometry before writing styles. */
export function mountScrollStory(root: HTMLElement, selector: string) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
  const nearby = new Set<HTMLElement>();
  const finished = new Set<HTMLElement>();
  const offsets = new Map<HTMLElement, number>();
  const isHome = root.classList.contains("home-page");
  let frame = 0;

  const finish = (item: HTMLElement) => {
    item.style.removeProperty("--story-y");
    item.style.removeProperty("--story-opacity");
    item.dataset.storyDone = "true";
    finished.add(item);
    nearby.delete(item);
    observer.unobserve(item);
  };
  const render = () => {
    frame = 0;
    if (reduced.matches) return;
    const height = innerHeight;
    const measurements = Array.from(nearby, (item) => {
      const previous = isHome && item.matches('[data-scroll-reveal="heading"], [data-scroll-reveal="contact-prompt"]')
        ? item.closest("section")?.previousElementSibling : null;
      const previousContent = previous?.querySelector(".project-grid, .about-timeline, .hero-bio") || previous;
      return {
        item,
        top: item.getBoundingClientRect().top - (offsets.get(item) || 0),
        previousBottom: previousContent?.getBoundingClientRect().bottom,
      };
    });
    measurements.forEach(({ item, top, previousBottom }) => {
      const card = item.matches(".project-card");
      const title = item.matches('h2, .query-hero-heading, [data-scroll-reveal="heading"]');
      const contact = isHome && Boolean(item.closest(".contact-section"));
      const workHeading = isHome && Boolean(item.closest("#work"));
      const order = Number(item.dataset.storyOrder || 0);
      const start = contact ? .6 : workHeading ? .82 : isHome ? .76 : .96;
      const travel = contact ? .2 : isHome ? (title ? .34 : .3) : (title ? .52 : .44);
      // The footer limits how far Contact can scroll; its final pose must remain reachable.
      const lastTop = top + scrollY - Math.max(0, document.documentElement.scrollHeight - height);
      const end = contact ? Math.max(height * (start - travel), lastTop) : height * (start - travel);
      const positionProgress = Math.max(0, Math.min(1, (height * start - top - order * 32) / Math.max(1, height * start - end)));
      const handoffProgress = previousBottom === undefined ? 1
        : Math.max(0, Math.min(1, (height * .32 - previousBottom) / (height * .2)));
      const progress = Math.min(positionProgress, handoffProgress);
      if (progress === 1) { finish(item); return; }
      const eased = (1 - Math.cos(Math.PI * progress)) / 2;
      const y = (1 - eased) * (contact ? 16 : card ? 92 : title ? 68 : 44);
      offsets.set(item, y);
      item.style.setProperty("--story-y", `${y.toFixed(2)}px`);
      item.style.setProperty("--story-opacity", String(isHome ? eased : .12 + eased * .88));
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const item = target as HTMLElement;
      if (isIntersecting && !finished.has(item)) nearby.add(item);
      else nearby.delete(item);
    });
    schedule();
  }, { rootMargin: "160px 0px" });
  const syncPreference = () => {
    if (reduced.matches) items.forEach(finish);
    else items.forEach((item) => { if (!finished.has(item)) observer.observe(item); });
    schedule();
  };
  // Direct navigation and keyboard focus must never wait for a reveal.
  const onFocus = (event: FocusEvent) => {
    const target = event.target as Element;
    if (!target.matches(":focus-visible")) return;
    const item = target.closest<HTMLElement>(selector);
    if (item && root.contains(item)) finish(item);
  };
  const finishAnchor = (target: Element | null) => {
    if (!target || target.id === "top" || !root.contains(target)) return;
    items.filter((item) => target === item || target.contains(item)).forEach(finish);
  };
  const onSectionNavigation = (event: Event) => finishAnchor(event.target as Element);
  const onHashChange = () => finishAnchor(document.getElementById(location.hash.slice(1)));
  items.forEach((item) => { item.dataset.story = "true"; });
  syncPreference();
  onHashChange();
  root.addEventListener("focusin", onFocus);
  root.addEventListener("portfolio:section-navigation", onSectionNavigation);
  window.addEventListener("hashchange", onHashChange);
  window.addEventListener("scroll", schedule, { passive: true });
  root.addEventListener("scroll", schedule, { passive: true, capture: true });
  window.addEventListener("resize", schedule);
  reduced.addEventListener("change", syncPreference);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    root.removeEventListener("focusin", onFocus);
    root.removeEventListener("portfolio:section-navigation", onSectionNavigation);
    window.removeEventListener("hashchange", onHashChange);
    window.removeEventListener("scroll", schedule);
    root.removeEventListener("scroll", schedule, true);
    window.removeEventListener("resize", schedule);
    reduced.removeEventListener("change", syncPreference);
    items.forEach((item) => {
      delete item.dataset.story;
      delete item.dataset.storyDone;
      item.style.removeProperty("--story-y");
      item.style.removeProperty("--story-opacity");
    });
  };
}

/** A one-time, quiet stagger for the larger project cards. */
export function mountCardEntrances(root: HTMLElement) {
  const cards = Array.from(root.querySelectorAll<HTMLElement>(".project-card"));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const animations = new Map<HTMLElement, Animation>();
  const finish = (card: HTMLElement) => {
    animations.get(card)?.cancel();
    animations.delete(card);
    card.dataset.cardReveal = "done";
    observer.unobserve(card);
  };
  const onEntries: IntersectionObserverCallback = (entries) => {
    entries.filter((entry) => entry.isIntersecting && entry.intersectionRatio >= Math.min(.5, innerHeight / 1000))
      .sort((a, b) => a.boundingClientRect.left - b.boundingClientRect.left)
      .forEach((entry, index) => {
        const card = entry.target as HTMLElement;
        if (card.dataset.cardReveal !== "waiting") return;
        observer.unobserve(card);
        if (reduced.matches) { finish(card); return; }
        card.dataset.cardReveal = "running";
        const animation = card.animate([
          { translate: "0 40px", opacity: 0 },
          { translate: "0 0px", opacity: 1 },
        ], {
          duration: 780,
          delay: index * 110,
          easing: "cubic-bezier(.22, .68, 0, 1)",
          fill: "backwards",
        });
        animations.set(card, animation);
        animation.finished.then(() => {
          if (animations.get(card) === animation) {
            animations.delete(card);
            card.dataset.cardReveal = "done";
          }
        }).catch(() => { /* Focus, reduced motion, or unmount can finish early. */ });
      });
  };
  const createObserver = () => new IntersectionObserver(onEntries, {
    rootMargin: `0px 0px -${Math.round(innerHeight * .28)}px 0px`,
    threshold: Math.min(.5, innerHeight / 1000),
  });
  let observer = createObserver();
  const onResize = () => {
    observer.disconnect();
    observer = createObserver();
    cards.forEach((card) => { if (card.dataset.cardReveal === "waiting") observer.observe(card); });
  };
  cards.forEach((card) => {
    card.dataset.cardReveal = "waiting";
    if (reduced.matches) finish(card);
    else observer.observe(card);
  });
  const onPreference = () => { if (reduced.matches) cards.forEach(finish); };
  const onInteraction = (event: Event) => {
    const target = event.target as Element;
    if (event.type === "focusin" && !target.matches(":focus-visible")) return;
    const card = target.closest<HTMLElement>(".project-card");
    if (card && root.contains(card)) finish(card);
  };
  root.addEventListener("focusin", onInteraction);
  root.addEventListener("pointerdown", onInteraction);
  window.addEventListener("resize", onResize);
  reduced.addEventListener("change", onPreference);
  return () => {
    observer.disconnect();
    animations.forEach((animation) => animation.cancel());
    cards.forEach((card) => { delete card.dataset.cardReveal; });
    root.removeEventListener("focusin", onInteraction);
    root.removeEventListener("pointerdown", onInteraction);
    window.removeEventListener("resize", onResize);
    reduced.removeEventListener("change", onPreference);
  };
}
