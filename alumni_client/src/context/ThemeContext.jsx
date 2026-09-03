import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("kjcoemrTheme") === "dark");
  useEffect(() => { document.body.classList.toggle("dark-mode", darkMode); localStorage.setItem("kjcoemrTheme", darkMode ? "dark" : "light"); }, [darkMode]);
  return <ThemeContext.Provider value={{ darkMode, toggleTheme: () => setDarkMode((value) => !value) }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
