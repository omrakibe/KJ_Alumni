import { useState } from "react";
import { CalendarDays, ExternalLink, GraduationCap, LogOut, Menu, PanelLeftClose, UserRound, Megaphone } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import collegeLogo from "../../assets/kjcoemr-logo.png";
import "../../pages/alumni/AlumniDashboard.css";
import "./AlumniLayout.css";
import "./AlumniConsolePages.css";
import "./AlumniConsoleDetail.css";
import "./AlumniSidebarLogo.css";

export default function AlumniLayout({ children }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 850 || localStorage.getItem("alumniSidebarCollapsed") === "true");
  const toggle = () => setCollapsed((value) => { localStorage.setItem("alumniSidebarCollapsed", String(!value)); return !value; });
  const navClass = ({ isActive }) => `sidebar-link${isActive ? " active" : ""}`;
  return <div className={`alumni-dashboard alumni-layout${collapsed ? " sidebar-collapsed" : ""}`}><aside className="alumni-sidebar"><div className="alumni-brand"><span className="alumni-brand-mark"><img src={collegeLogo} alt="KJCOEMR" /></span><span className="alumni-brand-copy">KJCOEMR Connect<small>Alumni Portal</small></span><button className="alumni-sidebar-toggle" onClick={toggle} title={collapsed ? "Open sidebar" : "Close sidebar"}>{collapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}</button></div><div className="alumni-account"><div>{user?.email?.charAt(0).toUpperCase() || "A"}</div><span>Alumni account</span><strong>{user?.email}</strong></div><p className="alumni-sidebar-label">Workspace</p><nav className="sidebar-menu"><NavLink to="/alumni/dashboard" className={navClass} title="Dashboard"><GraduationCap size={18} /><span>Dashboard</span></NavLink><NavLink to="/alumni/events" className={navClass} title="Events"><CalendarDays size={18} /><span>Events</span></NavLink><NavLink to="/alumni/announcements" className={navClass} title="Announcements"><Megaphone size={18} /><span>Announcements</span></NavLink></nav><div className="sidebar-bottom"><NavLink to="/alumni/profile" className={navClass} title="My Profile"><UserRound size={18} /><span>My Profile</span></NavLink><Link to="/" className="sidebar-link" title="View Website"><ExternalLink size={18} /><span>View Website</span></Link><button className="sidebar-link alumni-logout" onClick={logout} title="Logout"><LogOut size={18} /><span>Logout</span></button></div></aside><div className="alumni-layout-content">{children}</div></div>;
}
