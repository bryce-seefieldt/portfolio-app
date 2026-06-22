"use client";

import { useEffect, useState } from "react";

interface ThemeState {
  isDark: boolean;
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
  const [state, setState] = useState<ThemeState>({ isDark: false, mounted: false });

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
    const shouldBeDark = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Apply theme to document
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Update state with both isDark and mounted in single update
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ isDark: shouldBeDark, mounted: true });
  }, []);

  /**
   * Toggle theme and save preference to localStorage.
   * The CSS transition is handled by globals.css
   */
  const toggleTheme = () => {
    const newIsDark = !state.isDark;
    setState((prev) => ({ ...prev, isDark: newIsDark }));

    // Update document class
    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save preference
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!state.mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      aria-label={`Switch to ${state.isDark ? "light" : "dark"} theme`}
      title={`Current theme: ${state.isDark ? "dark" : "light"}`}
    >
      {state.isDark ? (
        // Moon icon (show when in dark mode, click to switch to light)
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        // Sun icon (show when in light mode, click to switch to dark)
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.414 9.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
