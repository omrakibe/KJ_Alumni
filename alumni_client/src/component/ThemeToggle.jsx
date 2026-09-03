import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();
  return <button className="theme-toggle" onClick={toggleTheme} title={darkMode ? "Use light mode" : "Use dark mode"} aria-label={darkMode ? "Use light mode" : "Use dark mode"}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>;
}
