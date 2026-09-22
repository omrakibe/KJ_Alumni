import { BriefcaseBusiness, CalendarDays, ExternalLink, GraduationCap, LogOut, Megaphone, Menu, PanelLeftClose, UserRound } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useResponsiveSidebar from "../../hooks/useResponsiveSidebar";
import ThemeToggle from "../ThemeToggle";
import collegeLogo from "../../assets/kjcoemr-logo.png";
import "../../pages/alumni/AlumniDashboard.css";
import "./AlumniLayout.css";
import "./AlumniConsolePages.css";
import "./AlumniConsoleDetail.css";
import "./AlumniSidebarLogo.css";

export default function AlumniLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { collapsed, toggle, closeMobileNavigation } = useResponsiveSidebar("alumniSidebarCollapsed");
  const navClass = ({ isActive }) => `sidebar-link${isActive ? " active" : ""}`;
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={`alumni-dashboard alumni-layout${collapsed ? " sidebar-collapsed" : ""}`}>
      <aside className="alumni-sidebar">
        <div className="alumni-brand">
          <span className="alumni-brand-mark"><img src={collegeLogo} alt="KJCOEMR" /></span>
          <span className="alumni-brand-copy">KJCOEMR Connect<small>Alumni Portal</small></span>
          <button type="button" className="alumni-sidebar-toggle" onClick={toggle} title={collapsed ? "Open menu" : "Close menu"} aria-label={collapsed ? "Open navigation menu" : "Close navigation menu"} aria-expanded={!collapsed} aria-controls="alumni-navigation">
            {collapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
        <div className="alumni-account"><div>{user?.email?.charAt(0).toUpperCase() || "A"}</div><span>Alumni account</span><strong>{user?.email}</strong></div>
        <p className="alumni-sidebar-label">Workspace</p>
        <nav className="sidebar-menu" id="alumni-navigation" aria-label="Alumni navigation">
          <NavLink to="/alumni/dashboard" className={navClass} title="Dashboard" onClick={closeMobileNavigation}><GraduationCap size={18} /><span>Dashboard</span></NavLink>
          <NavLink to="/alumni/events" className={navClass} title="Events" onClick={closeMobileNavigation}><CalendarDays size={18} /><span>Events</span></NavLink>
          <NavLink to="/alumni/announcements" className={navClass} title="Announcements" onClick={closeMobileNavigation}><Megaphone size={18} /><span>Announcements</span></NavLink>
          <NavLink to="/alumni/jobs" className={navClass} title="Jobs" onClick={closeMobileNavigation}><BriefcaseBusiness size={18} /><span>Jobs</span></NavLink>
        </nav>
        <div className="sidebar-bottom">
          <ThemeToggle className="sidebar-link portal-theme-toggle" showLabel />
          <NavLink to="/alumni/profile" className={navClass} title="My Profile" onClick={closeMobileNavigation}><UserRound size={18} /><span>My Profile</span></NavLink>
          <Link to="/" className="sidebar-link" title="View Website"><ExternalLink size={18} /><span>View Website</span></Link>
          <button type="button" className="sidebar-link alumni-logout" onClick={handleLogout} title="Logout"><LogOut size={18} /><span>Logout</span></button>
        </div>
      </aside>
      <div className="alumni-layout-content">{children}</div>
    </div>
  );
}
