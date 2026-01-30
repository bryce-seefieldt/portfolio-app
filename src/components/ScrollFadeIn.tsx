"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScrollFadeIn Component
 *
 * Wraps child elements to fade them in when they come into view.
 * Uses Intersection Observer for performance (no scroll event listeners).
 *
 * Features:
 * - Repeating fade behavior: elements fade out when leaving viewport, fade back in when re-entering
 * - Configurable delay for staggered animations
 * - 10% visibility threshold by default
 * - Respects prefers-reduced-motion for accessibility
 *
 * Implementation details:
 * - Uses a CSS class to manage opacity transitions
 * - 250ms ease-out transition for a subtle, professional feel
 * - Continuous observation (no unobserve) enables repeating behavior
 */
interface ScrollFadeInProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
}

interface FadeInOptions {
  threshold?: number;
}

/**
 * useFadeInOnScroll
 *
 * Reusable hook for fade-in-on-scroll behavior.
 * Returns a ref and visibility state for easy composition.
 */
export function useFadeInOnScroll({ threshold = 0.1 }: FadeInOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry) {
      setIsVisible(entry.isIntersecting);
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    // Create intersection observer for repeating fade behavior
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin: "0px",
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold]);

  return { ref: elementRef, isVisible };
}

export function ScrollFadeIn({ children, delay = 0, threshold = 0.1 }: ScrollFadeInProps) {
  const { ref, isVisible } = useFadeInOnScroll({ threshold });

  return (
    <div
      ref={ref}
      className={`fade-in-on-scroll ${isVisible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
