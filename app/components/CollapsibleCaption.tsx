"use client";

import { useEffect, useRef, useState } from "react";

export function CollapsibleCaption({
  caption,
  className = "mt-3 whitespace-pre-line text-sm leading-7 text-neutral-300 sm:text-[15px] sm:leading-8",
}: {
  caption: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = captionRef.current;
    if (!el) {
      return;
    }

    const measure = () => {
      if (expanded) {
        return;
      }
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [caption, expanded]);

  return (
    <>
      <p
        ref={captionRef}
        className={`${className}${expanded ? "" : " line-clamp-3"}`}
      >
        {caption}
      </p>
      {isOverflowing && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          aria-label={expanded ? "Show less" : "Show more"}
          className="caption-toggle"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            aria-hidden="true"
            style={{
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform 0.15s",
            }}
          >
            <path
              d="M1 3 L5 7 L9 3"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </button>
      )}
    </>
  );
}
