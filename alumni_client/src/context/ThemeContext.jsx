import { useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";

function getInitialTheme() {
  const documentTheme = document.documentElement.dataset.theme;
  if (documentTheme === "dark" || documentTheme === "light") return documentTheme;
  try {
    const savedTheme = localStorage.getItem("kjcoemrTheme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  } catch {
    // Storage can be blocked in private browsing; the system preference remains usable.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function hasStoredTheme() {
  try {
    return ["dark", "light"].includes(localStorage.getItem("kjcoemrTheme"));
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [followsSystem, setFollowsSystem] = useState(() => !hasStoredTheme());

  useEffect(() => {
    const darkMode = theme === "dark";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.documentElement.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
    if (!followsSystem) {
      try {
        localStorage.setItem("kjcoemrTheme", theme);
      } catch {
        // Applying the theme should still work when storage is unavailable.
      }
    }
  }, [followsSystem, theme]);

  useEffect(() => {
    if (!followsSystem) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = (event) => setTheme(event.matches ? "dark" : "light");
    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, [followsSystem]);

  const darkMode = theme === "dark";
  const toggleTheme = () => {
    setFollowsSystem(false);
    setTheme((value) => value === "dark" ? "light" : "dark");
  };
  return <ThemeContext.Provider value={{ darkMode, theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
