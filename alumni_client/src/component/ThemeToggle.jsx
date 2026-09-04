import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const page = pathname.startsWith("/admin") ? "admin" : pathname.startsWith("/alumni") ? "alumni" : pathname === "/" ? "public" : "auth";
  return <button className={"theme-toggle theme-toggle-" + page} onClick={toggleTheme} title={darkMode ? "Use light mode" : "Use dark mode"} aria-label={darkMode ? "Use light mode" : "Use dark mode"}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>;
}
