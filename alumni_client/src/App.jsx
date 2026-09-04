import AppRoutes from "./routes/AppRoutes";
import ThemeToggle from "./component/ThemeToggle";
import "./styles/dark-mode.css";
import "./styles/admin-dark.css";
import "./styles/remaining-dark.css";
import "./styles/sidebar-dark.css";
import "./styles/alumni-dark.css";
import "./styles/admin-management-dark.css";

function App() {
  return <><AppRoutes /><ThemeToggle /></>;
}

export default App;
