import { createContext, useContext, useState, useEffect } from "react";

/**
 * Theme tokens for light and dark mode. Components in /components/ui read
 * these via the useTheme() hook rather than hardcoding colors, so the whole
 * app (and every ui/ component) responds to the toggle consistently.
 */
const THEMES = {
  light: {
    bg: "#fafaf9",
    surface: "#ffffff",
    surfaceMuted: "#f3f2ef",
    border: "#e8e6e1",
    text: "#1c1b1f",
    textMuted: "#6b6963",
    textFaint: "#9b988f",
    accent: "#4F46B8",
    accentSoft: "#ECEAFB",
    accentText: "#ffffff",
    success: "#0F7A52",
    successSoft: "#E6F4EE",
    danger: "#B8460E",
    dangerBg: "#FBEDE5",
  },
  dark: {
    bg: "#15141a",
    surface: "#1e1d24",
    surfaceMuted: "#26252e",
    border: "#34333d",
    text: "#f2f1ee",
    textMuted: "#b3b0a8",
    textFaint: "#84817a",
    accent: "#8B82E8",
    accentSoft: "#2A2750",
    accentText: "#15141a",
    success: "#4FC891",
    successSoft: "#1B3328",
    danger: "#E08355",
    dangerBg: "#3A2418",
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const toggle = () => setMode(m => (m === "light" ? "dark" : "light"));
  const tokens = THEMES[mode];

  // Keep <body> in sync so non-component CSS (like index.css) can react too.
  useEffect(() => {
    document.body.style.background = tokens.bg;
    document.body.style.color = tokens.text;
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggle, tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** useTheme() → { mode: "light"|"dark", toggle: () => void, tokens: {...colors} } */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside a <ThemeProvider>");
  return ctx;
}
