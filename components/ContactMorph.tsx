"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import type { LocalizedLink } from "@/lib/portfolio";
import { Localized } from "./Localized";

type ContactKey = "email" | "github" | "linkedin" | "cv";

type ContactMeta = {
  promptEn: string;
  promptZh: string;
  labelEn: string;
  labelZh: string;
};

const DEFAULT_PROMPT = {
  en: "Glad you made it this far.",
  zh: "很高兴你能看到这里～",
};

const CONTACT_META: Record<ContactKey, ContactMeta> = {
  email: {
    promptEn: "Feel free to reach out!",
    promptZh: "欢迎通过邮件与我联系",
    labelEn: "Email",
    labelZh: "发邮件",
  },
  github: {
    promptEn: "Take a look around my repo.",
    promptZh: "逛一逛我的代码仓库",
    labelEn: "GitHub",
    labelZh: "GitHub",
  },
  linkedin: {
    promptEn: "Let's connect!",
    promptZh: "要不再加个领英好友吧",
    labelEn: "LinkedIn",
    labelZh: "LinkedIn",
  },
  cv: {
    promptEn: "Here’s my résumé.",
    promptZh: "这里还有我的简历",
    labelEn: "Download",
    labelZh: "下载",
  },
};

const CONTACT_KEYS = Object.keys(CONTACT_META) as ContactKey[];

type FlipSnapshot = {
  item: DOMRect;
  shape: DOMRect;
  icon: DOMRect;
};

type FlipAnimations = {
  item: Animation;
  shape: Animation;
  icon: Animation;
};

function TypewriterText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(text);
  const [leaving, setLeaving] = useState(false);
  const displayedRef = useRef(text);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    const update = () => {
      clearTimeout(timer);
      if (reduced.matches) {
        timer = window.setTimeout(() => {
          displayedRef.current = text;
          setDisplayed(text);
          setLeaving(false);
        }, 0);
        return;
      }
      if (displayedRef.current === text) {
        timer = window.setTimeout(() => setLeaving(false), 0);
        return;
      }
      timer = window.setTimeout(() => {
        setLeaving(true);
        timer = window.setTimeout(() => {
          displayedRef.current = text;
          setDisplayed(text);
          setLeaving(false);
        }, 150);
      }, 65);
    };
    update();
    reduced.addEventListener("change", update);
    return () => { clearTimeout(timer); reduced.removeEventListener("change", update); };
  }, [text]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.dataset.typingReady = "true";
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.dataset.started = "true"; observer.disconnect(); }
    }, { rootMargin: `0px 0px -${Math.round(innerHeight * .4)}px 0px`, threshold: .2 });
    observer.observe(node.closest(".contact-morph-prompt") || node);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="contact-typewriter-text" data-leaving={leaving}>
      <span key={displayed} className="contact-typewriter-visible">
        {Array.from(displayed).map((character, index) => (
          <span key={index} className="contact-typed-character" style={{ animationDelay: `${index * (displayed.length > 24 ? 23 : 38)}ms` }}>{character}</span>
        ))}
      </span>
    </span>
  );
}

function ContactIcon({ kind }: { kind: ContactKey }) {
  const iconProps = {
    className: "contact-morph-icon-svg",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  } as const;

  if (kind === "email") {
    return (
      <svg {...iconProps} fill="none">
        <rect x="2.5" y="5" width="19" height="14" rx="1.8" stroke="currentColor" strokeWidth="1.55" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "github") {
    return (
      <svg {...iconProps} fill="currentColor">
        <path d="M12 2.5a9.7 9.7 0 0 0-3.07 18.9c.48.09.66-.2.66-.46v-1.7c-2.68.58-3.25-1.14-3.25-1.14-.44-1.11-1.07-1.4-1.07-1.4-.88-.6.06-.59.06-.59.97.07 1.48 1 1.48 1 .86 1.47 2.26 1.05 2.81.8.09-.62.34-1.05.61-1.29-2.14-.24-4.39-1.07-4.39-4.77 0-1.05.38-1.91 1-2.59-.1-.24-.43-1.22.09-2.55 0 0 .81-.26 2.67.99A9.3 9.3 0 0 1 12 7.37a9.3 9.3 0 0 1 2.43.33c1.85-1.25 2.67-.99 2.67-.99.52 1.33.19 2.31.09 2.55.62.68 1 1.54 1 2.59 0 3.71-2.26 4.52-4.4 4.76.35.3.65.88.65 1.79v2.54c0 .26.18.55.66.46A9.7 9.7 0 0 0 12 2.5Z" />
      </svg>
    );
  }

  if (kind === "linkedin") {
    return (
      <svg {...iconProps} fill="currentColor">
        <path d="M5.35 7.4A1.85 1.85 0 1 0 5.34 3.7a1.85 1.85 0 0 0 .01 3.7ZM3.75 20.3h3.2V9.4h-3.2v10.9ZM9.2 9.4h3.07v1.49h.04c.43-.81 1.47-1.67 3.03-1.67 3.24 0 3.84 2.13 3.84 4.9v6.18h-3.2v-5.48c0-1.31-.03-2.99-1.82-2.99-1.82 0-2.1 1.42-2.1 2.89v5.58H9.2V9.4Z" />
      </svg>
    );
  }

  return (
    <svg {...iconProps} fill="none">
      <path d="M6 3.5h8l4 4v13H6v-17Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M14 3.5v4h4M9 12h6M9 15.5h4" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ContactMorph({ contacts }: { contacts: LocalizedLink[] }) {
  const [activeContact, setActiveContact] = useState<ContactKey | null>(null);
  const leaveTimer = useRef(0);
  const keyboardMorph = useRef(false);
  const activeContactRef = useRef<ContactKey | null>(null);
  const itemRefs = useRef(new Map<ContactKey, HTMLLIElement>());
  const pendingFlip = useRef(new Map<ContactKey, FlipSnapshot>());
  const runningFlip = useRef(new Map<ContactKey, FlipAnimations>());

  const contactsByKey = new Map(
    contacts.map((contact) => [contact.label.toLowerCase() as ContactKey, contact]),
  );
  const activePrompt = activeContact
    ? {
        en: CONTACT_META[activeContact].promptEn,
        zh: CONTACT_META[activeContact].promptZh,
      }
    : DEFAULT_PROMPT;

  const captureAndSetActive = (nextContact: ContactKey | null, keyboard = false) => {
    clearTimeout(leaveTimer.current);
    keyboardMorph.current = keyboard;
    if (nextContact === activeContactRef.current) return;

    const snapshot = new Map<ContactKey, FlipSnapshot>();
    itemRefs.current.forEach((item, key) => {
      const shape = item.querySelector<HTMLElement>(".contact-morph-shape");
      const icon = item.querySelector<HTMLElement>(".contact-morph-icon");
      if (!shape || !icon) return;
      snapshot.set(key, {
        item: item.getBoundingClientRect(),
        shape: shape.getBoundingClientRect(),
        icon: icon.getBoundingClientRect(),
      });
    });
    pendingFlip.current = snapshot;
    activeContactRef.current = nextContact;
    setActiveContact(nextContact);
  };

  useLayoutEffect(() => {
    if (pendingFlip.current.size === 0) return;

    const reduceMotion = keyboardMorph.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    itemRefs.current.forEach((item, key) => {
      const before = pendingFlip.current.get(key);
      const shape = item.querySelector<HTMLElement>(".contact-morph-shape");
      const icon = item.querySelector<HTMLElement>(".contact-morph-icon");
      if (!before || !shape || !icon) return;

      const previousFlip = runningFlip.current.get(key);
      previousFlip?.item.cancel();
      previousFlip?.shape.cancel();
      previousFlip?.icon.cancel();
      runningFlip.current.delete(key);

      if (reduceMotion) return;

      const afterItem = item.getBoundingClientRect();
      const afterShape = shape.getBoundingClientRect();
      const afterIcon = icon.getBoundingClientRect();
      const beforeCenter = before.item.left + before.item.width / 2;
      const afterCenter = afterItem.left + afterItem.width / 2;
      const translateX = beforeCenter - afterCenter;
      const timing = {
        duration: 520,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      } as const;

      const itemAnimation = item.animate(
        [
          { transform: `translateX(${translateX}px)` },
          { transform: "translateX(0)" },
        ],
        timing,
      );
      const shapeAnimation = shape.animate(
        [
          { width: `${before.shape.width}px` },
          { width: `${afterShape.width}px` },
        ],
        timing,
      );

      const iconDelta = before.icon.left - afterIcon.left - translateX;
      const iconAnimation = icon.animate([
        { translate: `${iconDelta}px 0` }, { translate: "0px 0" },
      ], timing);
      const animations = { item: itemAnimation, shape: shapeAnimation, icon: iconAnimation };
      runningFlip.current.set(key, animations);
      shapeAnimation.finished
        .then(() => {
          if (runningFlip.current.get(key) === animations) {
            runningFlip.current.delete(key);
          }
        })
        .catch(() => {
          // Cancellation is expected when a hover or focus target changes mid-morph.
        });
    });

    pendingFlip.current = new Map();
  }, [activeContact]);

  useEffect(() => {
    const animations = runningFlip.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const cancel = () => animations.forEach(({ item, shape, icon }) => { item.cancel(); shape.cancel(); icon.cancel(); });
    const onChange = () => { if (reduced.matches) cancel(); };
    reduced.addEventListener("change", onChange);
    return () => { clearTimeout(leaveTimer.current); cancel(); reduced.removeEventListener("change", onChange); };
  }, []);

  const handleGroupBlur = (event: FocusEvent<HTMLUListElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      captureAndSetActive(null);
    }
  };

  const handlePointerLeave = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType === "mouse") {
      leaveTimer.current = window.setTimeout(() => captureAndSetActive(null), 100);
    }
  };

  return (
    <div className="contact-morph">
      <h2 id="contact" className="contact-morph-prompt">
        <span className="contact-typewriter-line" data-scroll-reveal="contact-prompt" aria-hidden="true">
          <span className="copy-en"><TypewriterText text={activePrompt.en} /></span>
          <span className="copy-zh"><TypewriterText text={activePrompt.zh} /></span>
        </span>
        <span className="sr-only" aria-live="polite">
          <Localized en={activePrompt.en} zh={activePrompt.zh} />
        </span>
      </h2>

      <ul
        className="contact-morph-list"
        aria-label="Contact links"
        onPointerLeave={handlePointerLeave}
        onPointerEnter={() => clearTimeout(leaveTimer.current)}
        onBlur={handleGroupBlur}
      >
        {CONTACT_KEYS.map((key) => {
          const contact = contactsByKey.get(key);
          if (!contact) return null;

          const content = (
            <>
              <span className="contact-morph-shape" aria-hidden="true" />
              <span className="contact-morph-icon" aria-hidden="true"><ContactIcon kind={key} /></span>
              <strong className="contact-morph-label">
                <Localized en={CONTACT_META[key].labelEn} zh={CONTACT_META[key].labelZh} />
              </strong>
            </>
          );

          return (
            <li
              key={key}
              ref={(node) => {
                if (node) itemRefs.current.set(key, node);
                else itemRefs.current.delete(key);
              }}
              className="contact-morph-item"
              data-contact={key}
              data-active={activeContact === key}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") captureAndSetActive(key);
              }}
            >
              {contact.href ? (
                <a
                  className="contact-morph-control"
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                  onFocus={(event) => captureAndSetActive(key, event.currentTarget.matches(":focus-visible"))}
                >
                  {content}
                </a>
              ) : (
                <div
                  className="contact-morph-control is-disabled"
                  role="link"
                  tabIndex={0}
                  aria-disabled="true"
                  aria-label="CV link coming soon"
                  onFocus={(event) => captureAndSetActive(key, event.currentTarget.matches(":focus-visible"))}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
