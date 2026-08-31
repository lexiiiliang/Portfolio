"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollSection({ effect = "fade-in", children }: {
  effect?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "-10% 0px -10% 0px", threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="scroll-section" data-effect={effect} data-visible={visible}>
      {children}
    </div>
  );
}
