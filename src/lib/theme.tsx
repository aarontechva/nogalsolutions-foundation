"use client";

import * as React from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "nogal-theme";

const setHtmlThemeClass = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
};

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("dark");

  // theme-init.ts already applied the correct class before hydration (avoiding a
  // flash of the wrong theme); sync React state to it once on mount.
  React.useEffect(() => {
    const current = document.documentElement.classList.contains("light") ? "light" : "dark";
    setThemeState(current);
  }, []);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    setHtmlThemeClass(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme still applies for this session
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
