import { useEffect, useState } from "react";
import { ExternalLink, LayoutDashboard, LogOut, Menu, ShieldCheck, UsersRound, ClipboardCheck, CalendarDays, PanelLeftClose, Megaphone } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboard } from "../../services/alumniService";
import collegeLogo from "../../assets/kjcoemr-logo.png";
import "../../pages/admin/AdminDashboard.css";
import "./AdminLayout.css";
import "./AdminSidebarCollapsed.css";
import "./AdminSidebarLogo.css";

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("adminSidebarCollapsed") === "true");
  const [pendingCount, setPendingCount] = useState(0);
  const isSuperAdmin = user?.role === "ADMIN" && user?.branch === null;
  useEffect(() => { getAdminDashboard().then((response) => setPendingCount(response.data?.pendingRegistrations || 0)).catch(() => {}); }, []);
  const toggle = () => setCollapsed((value) => { localStorage.setItem("adminSidebarCollapsed", String(!value)); return !value; });
  const navClass = ({ isActive }) => `admin-link${isActive ? " active" : ""}`;
  return <div className={`admin-dashboard admin-layout${collapsed ? " sidebar-collapsed" : ""}`}><aside className="admin-sidebar"><div className="sidebar-brand"><div className="sidebar-brand-mark"><img src={collegeLogo} alt="KJCOEMR" /></div><div className="admin-logo"><span className="admin-brand-name">KJCOEMR Connect</span><span>Admin Console</span></div><button className="admin-sidebar-toggle" onClick={toggle} title={collapsed ? "Open sidebar" : "Close sidebar"}>{collapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}</button></div><div className="sidebar-context"><div className="sidebar-context-icon"><ShieldCheck size={18} /></div><div><span>{isSuperAdmin ? "Super Admin access" : "Branch Admin access"}</span><strong>{isSuperAdmin ? "All branches" : user?.branch}</strong></div></div><p className="sidebar-section-title">Workspace</p><nav className="admin-menu"><NavLink to="/admin/dashboard" className={navClass} title="Dashboard"><LayoutDashboard size={18} /><span>Dashboard</span></NavLink><NavLink to="/admin/alumni" className={navClass} title="Alumni Management"><UsersRound size={18} /><span>Alumni Management</span></NavLink><NavLink to="/admin/registrations" className={navClass} title="Registration Requests"><ClipboardCheck size={18} /><span>Registration Requests</span>{pendingCount > 0 && <b className="admin-nav-badge">{pendingCount > 99 ? "99+" : pendingCount}</b>}</NavLink><NavLink to="/admin/events" className={navClass} title="Event Management"><CalendarDays size={18} /><span>Event Management</span></NavLink><NavLink to="/admin/announcements" className={navClass} title="Announcements"><Megaphone size={18} /><span>Announcements</span></NavLink>{isSuperAdmin && <NavLink to="/admin/admins" className={navClass} title="Admin Management"><ShieldCheck size={18} /><span>Admin Management</span></NavLink>}</nav><div className="admin-bottom"><Link to="/" className="admin-link" title="View Website"><ExternalLink size={18} /><span>View Website</span></Link><button className="admin-link admin-logout logout-button" onClick={logout} title="Logout"><LogOut size={18} /><span>Logout</span></button></div></aside><div className="admin-layout-content">{children}</div></div>;
}
