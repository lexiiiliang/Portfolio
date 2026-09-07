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
  en: "Working on something interesting? Say hello.",
  zh: "很高兴在这里遇见你",
};

const CONTACT_META: Record<ContactKey, ContactMeta> = {
  email: {
    promptEn: "You’re always welcome to email me.",
    promptZh: "欢迎通过邮件与我联系",
    labelEn: "Email me",
    labelZh: "发邮件",
  },
  github: {
    promptEn: "Take a look around my code.",
    promptZh: "逛一逛我的代码仓库",
    labelEn: "GitHub",
    labelZh: "GitHub",
  },
  linkedin: {
    promptEn: "Let’s connect on LinkedIn.",
    promptZh: "要不再加个领英好友吧",
    labelEn: "LinkedIn",
    labelZh: "LinkedIn",
  },
  cv: {
    promptEn: "Here’s my résumé.",
    promptZh: "这里还有我的简历",
    labelEn: "CV soon",
    labelZh: "待更新",
  },
};

const CONTACT_KEYS = Object.keys(CONTACT_META) as ContactKey[];

type FlipSnapshot = {
  item: DOMRect;
  shape: DOMRect;
};

type FlipAnimations = {
  item: Animation;
  shape: Animation;
};

function TypewriterText({ text }: { text: string }) {
  const characters = Array.from(text);
  const previousText = useRef<string | null>(null);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (previousText.current === text) return;
    previousText.current = text;
    const nextCharacters = Array.from(text);
    let timeoutId: number;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timeoutId = window.setTimeout(() => {
        setVisibleCharacters(nextCharacters.length);
        setIsTyping(false);
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    let currentCharacter = 0;
    const characterDelay = nextCharacters.length > 24 ? 22 : 42;

    const typeNextCharacter = () => {
      currentCharacter += 1;
      setVisibleCharacters(currentCharacter);

      if (currentCharacter < nextCharacters.length) {
        timeoutId = window.setTimeout(typeNextCharacter, characterDelay);
      } else {
        setIsTyping(false);
      }
    };

    timeoutId = window.setTimeout(() => {
      setVisibleCharacters(0);
      setIsTyping(true);
      timeoutId = window.setTimeout(typeNextCharacter, 45);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [text]);

  return (
    <span className="contact-typewriter-text">
      <span className="contact-typewriter-measure">{text}</span>
      <span className="contact-typewriter-visible">
        {characters.slice(0, visibleCharacters).join("")}
        <span className="contact-typewriter-caret" data-visible={isTyping} />
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

  const captureAndSetActive = (nextContact: ContactKey | null) => {
    if (nextContact === activeContactRef.current) return;

    const snapshot = new Map<ContactKey, FlipSnapshot>();
    itemRefs.current.forEach((item, key) => {
      const shape = item.querySelector<HTMLElement>(".contact-morph-shape");
      if (!shape) return;
      snapshot.set(key, {
        item: item.getBoundingClientRect(),
        shape: shape.getBoundingClientRect(),
      });
    });
    pendingFlip.current = snapshot;
    activeContactRef.current = nextContact;
    setActiveContact(nextContact);
  };

  useLayoutEffect(() => {
    if (pendingFlip.current.size === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    itemRefs.current.forEach((item, key) => {
      const before = pendingFlip.current.get(key);
      const shape = item.querySelector<HTMLElement>(".contact-morph-shape");
      if (!before || !shape) return;

      const previousFlip = runningFlip.current.get(key);
      previousFlip?.item.cancel();
      previousFlip?.shape.cancel();
      runningFlip.current.delete(key);

      if (reduceMotion) return;

      const afterItem = item.getBoundingClientRect();
      const afterShape = shape.getBoundingClientRect();
      const beforeCenter = before.item.left + before.item.width / 2;
      const afterCenter = afterItem.left + afterItem.width / 2;
      const translateX = beforeCenter - afterCenter;
      const scaleX = before.shape.width / Math.max(afterShape.width, 1);
      const timing = {
        duration: 260,
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
          { transform: `scaleX(${scaleX})` },
          { transform: "scaleX(1)" },
        ],
        timing,
      );

      const animations = { item: itemAnimation, shape: shapeAnimation };
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

  const handleGroupBlur = (event: FocusEvent<HTMLUListElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      captureAndSetActive(null);
    }
  };

  const handlePointerLeave = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType === "mouse") captureAndSetActive(null);
  };

  return (
    <div className="contact-morph">
      <h2 id="contact-title" className="contact-morph-prompt">
        <span className="contact-typewriter-line" aria-hidden="true">
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
                  onFocus={() => captureAndSetActive(key)}
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
                  onFocus={() => captureAndSetActive(key)}
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
