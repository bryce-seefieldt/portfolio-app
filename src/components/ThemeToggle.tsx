"use client";

import { useEffect, useState } from "react";

interface ThemeState {
  isLight: boolean;
  mounted: boolean;
}

/**
 * ThemeToggle Component
 *
 * Provides a button to toggle between light and dark themes.
 * Persists user preference to localStorage and respects system preference on first visit.
 *
 * Theme switching is class-based (adds/removes 'dark' class on <html> element)
 * for performance and to support smooth CSS transitions without re-renders.
 */
export function ThemeToggle() {
  const [state, setState] = useState<ThemeState>({ isLight: false, mounted: false });

  /**
   * Initialize theme on mount:
   * 1. Check localStorage for saved preference
   * 2. If none, check system preference
   * 3. Apply theme and mark as mounted
   * This is necessary for initialization; we read from DOM and apply immediately.
   */
  useEffect(() => {
    // Determine current theme preference
    const savedTheme = localStorage.getItem("theme");
    const shouldBeLight = savedTheme === "light";

    // Dark mode is default. Light mode is explicit via `.light` class.
    if (shouldBeLight) {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }

    // Update state with both isDark and mounted in single update
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ isLight: shouldBeLight, mounted: true });
  }, []);

  /**
   * Toggle theme and save preference to localStorage.
   * The CSS transition is handled by globals.css
   */
  const toggleTheme = () => {
    const newIsLight = !state.isLight;
    setState((prev) => ({ ...prev, isLight: newIsLight }));

    if (newIsLight) {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!state.mounted) {
    return <div className="h-8 w-16" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="control-switch"
      data-light={state.isLight ? "true" : "false"}
      aria-pressed={!state.isLight}
      aria-label="Toggle light and dark theme"
      title={`Current theme: ${state.isLight ? "light" : "dark"}`}
      type="button"
    >
      <span className="control-switch-shell" aria-hidden="true">
        <span className="control-switch-icon control-switch-icon--light">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4.25" />
            <path d="M12 2.75v2.5M12 18.75v2.5M2.75 12h2.5M18.75 12h2.5M5.4 5.4l1.77 1.77M16.83 16.83l1.77 1.77M18.6 5.4l-1.77 1.77M7.17 16.83 5.4 18.6" />
          </svg>
        </span>
        <span className="control-switch-housing">
          <span className="control-switch-face">
            <span className="control-switch-rocker">
              <span className="control-switch-rocker-half control-switch-rocker-half--left" />
              <span className="control-switch-rocker-pivot" />
              <span className="control-switch-rocker-half control-switch-rocker-half--right" />
            </span>
          </span>
        </span>
        <span className="control-switch-icon control-switch-icon--dark">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14.8A7.2 7.2 0 1 1 9.2 5a8.2 8.2 0 1 0 9.8 9.8Z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
