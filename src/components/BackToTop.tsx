"use client";

import { useEffect, useRef, useState } from "react";

/**
 * BackToTop Component
 *
 * Shows a button when user scrolls down, allowing them to scroll back to top.
 * Uses smooth scroll-behavior (configured in globals.css).
 * Respects prefers-reduced-motion for accessibility.
 */
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show button when sentinel is out of view (scrolled past 500px)
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      <span
        ref={sentinelRef}
        className="pointer-events-none absolute top-[500px] left-0 h-px w-px opacity-0"
        aria-hidden="true"
      />
      <button
        onClick={scrollToTop}
        className={`fixed right-8 bottom-8 rounded-lg bg-zinc-900 p-3 text-white transition-all duration-200 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 ${
          isVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Scroll back to top"
        title="Back to top"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </>
  );
}
