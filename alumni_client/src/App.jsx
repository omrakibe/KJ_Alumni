import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./component/ErrorBoundary";
import "./styles/dark-mode.css";
import "./styles/admin-dark.css";
import "./styles/remaining-dark.css";
import "./styles/sidebar-dark.css";
import "./styles/alumni-dark.css";
import "./styles/admin-management-dark.css";
import "./styles/mobile-responsive.css";
import "./styles/portal-mobile-polish.css";
import "./styles/portal-mobile-fixes.css";
import "./styles/admin-mobile-navigation.css";
import "./styles/mobile-menu-drawer.css";

function App() {
  return <ErrorBoundary><AppRoutes /></ErrorBoundary>;
}

export default App;
