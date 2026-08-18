"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";

type ViewTransition = {
  finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => ViewTransition;
};

const nextTick = () => new Promise<void>((resolve) => {
  window.setTimeout(resolve, 0);
});

const waitForRouteChange = (fromPath: string) => new Promise<void>((resolve) => {
  const startedAt = Date.now();

  const check = () => {
    if (window.location.pathname !== fromPath || Date.now() - startedAt > 2000) {
      resolve();
      return;
    }

    window.setTimeout(check, 16);
  };

  check();
});

const animateMain = (className: string, duration: number) => new Promise<void>((resolve) => {
  const main = document.querySelector<HTMLElement>("main#top");
  if (!main) {
    resolve();
    return;
  }

  let completed = false;
  const finish = () => {
    if (completed) return;
    completed = true;
    main.classList.remove(className);
    resolve();
  };

  main.classList.add(className);
  main.addEventListener("animationend", finish, { once: true });
  window.setTimeout(finish, duration + 80);
});

export function ProjectTransitionLink({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter();
  const navigating = useRef(false);
  const pointerNavigation = useRef(false);

  const navigate = async () => {
    const fromPath = window.location.pathname;
    router.push(href, { scroll: false });
    await waitForRouteChange(fromPath);
    await nextTick();
    window.scrollTo(0, 0);
    await nextTick();
  };

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    pointerNavigation.current = event.button === 0;
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const usedPointer = pointerNavigation.current;
    pointerNavigation.current = false;

    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) {
      return;
    }

    event.preventDefault();
    if (navigating.current) return;
    navigating.current = true;

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const viewTransitionDocument = document as ViewTransitionDocument;
    const isKeyboardClick = !usedPointer;

    root.classList.add("is-project-transitioning");

    if (reduceMotion || isKeyboardClick || !viewTransitionDocument.startViewTransition) {
      const fallbackTransition = async () => {
        if (!reduceMotion && !isKeyboardClick) {
          await animateMain("is-project-exiting", 140);
        }

        await navigate();

        if (!reduceMotion && !isKeyboardClick) {
          await animateMain("is-project-entering", 240);
        }
      };

      void fallbackTransition().finally(() => {
        root.classList.remove("is-project-transitioning");
        navigating.current = false;
      });
      return;
    }

    const transition = viewTransitionDocument.startViewTransition(navigate);
    void transition.finished.finally(() => {
      root.classList.remove("is-project-transitioning");
      navigating.current = false;
    });
  };

  return (
    <Link href={href} scroll={false} onPointerDown={handlePointerDown} onClick={handleClick}>
      {children}
    </Link>
  );
}
