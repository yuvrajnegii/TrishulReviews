import { createContext, useContext, useState, useEffect } from "react";

/**
 * Theme tokens for light and dark mode. Components in /components/ui read
 * these via the useTheme() hook rather than hardcoding colors, so the whole
 * app (and every ui/ component) responds to the toggle consistently.
 */
const THEMES = {
  light: {
    bg: "#f5f5f4",
    surface: "#ffffff",
    border: "#e5e4dc",
    text: "#1a1a18",
    textMuted: "#5f5e5a",
    textFaint: "#888780",
    accent: "#534AB7",
    accentText: "#ffffff",
    danger: "#a32d2d",
    dangerBg: "#fcebeb",
  },
  dark: {
    bg: "#16161a",
    surface: "#1f1f24",
    border: "#33333a",
    text: "#f1f0ee",
    textMuted: "#b8b6b0",
    textFaint: "#8a8985",
    accent: "#8b7ff0",
    accentText: "#16161a",
    danger: "#f08a8a",
    dangerBg: "#3a2222",
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
