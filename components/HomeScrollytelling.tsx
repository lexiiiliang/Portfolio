"use client";

import { useLayoutEffect, useRef } from "react";
import { mountCardEntrances, mountScrollStory } from "@/lib/scroll-story";
import { mountTimelineMotion } from "@/lib/timeline-motion";
import { mountContactEntrance } from "@/lib/contact-entrance";

export function HomeScrollytelling({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const stopStory = mountScrollStory(ref.current, "[data-scroll-reveal]:not(.project-card)");
    const stopCards = mountCardEntrances(ref.current);
    const stopTimeline = mountTimelineMotion(ref.current);
    const stopContact = mountContactEntrance(ref.current);
    return () => { stopStory(); stopCards(); stopTimeline(); stopContact(); };
  }, []);
  return <main ref={ref} id="top" className="home-page">{children}</main>;
}
