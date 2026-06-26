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
      aria-label={`Switch to ${state.isLight ? "dark" : "light"} theme`}
      title={`Current theme: ${state.isLight ? "light" : "dark"}`}
      type="button"
    >
      <span className="control-switch-track" aria-hidden="true">
        <span className="control-switch-label control-switch-label--left">DK</span>
        <span className="control-switch-label control-switch-label--right">LT</span>
        <span className="control-switch-thumb" />
      </span>
    </button>
  );
}
