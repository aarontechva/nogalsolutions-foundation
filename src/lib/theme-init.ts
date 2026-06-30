// This file is inlined verbatim into a <script> tag (see ../routes/__root.tsx) and
// runs in the browser before any build step, so it must stay plain, valid JavaScript —
// no TypeScript-only syntax (type annotations, etc.) even though the extension is .ts.
// @ts-nocheck

const STORAGE_KEY = "nogal-theme";

const isThemeValue = (value) => value === "light" || value === "dark";

const getSystemTheme = () => {
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
};

const setHtmlThemeClass = (theme) => {
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
};

try {
  const stored = localStorage.getItem(STORAGE_KEY);
  const theme = isThemeValue(stored) ? stored : getSystemTheme();
  setHtmlThemeClass(theme);
} catch {
  const theme = getSystemTheme();
  setHtmlThemeClass(theme);
}
