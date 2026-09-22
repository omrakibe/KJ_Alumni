import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme-context";
import "./ThemeToggle.css";

export default function ThemeToggle({ className = "", showLabel = false }) {
  const { darkMode, toggleTheme } = useTheme();
  const label = darkMode ? "Light mode" : "Dark mode";

  return (
    <button
      type="button"
      className={`theme-toggle ${showLabel ? "theme-toggle-labelled" : ""} ${className}`.trim()}
      onClick={toggleTheme}
      title={`Use ${label.toLowerCase()}`}
      aria-label={`Use ${label.toLowerCase()}`}
      aria-pressed={darkMode}
    >
      {darkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
      {showLabel && <span>{label}</span>}
    </button>
  );
}
