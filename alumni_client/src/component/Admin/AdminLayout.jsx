import { useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarDays, ClipboardCheck, ExternalLink, LayoutDashboard, LogOut, Megaphone, Menu, PanelLeftClose, ShieldCheck, UsersRound } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboard } from "../../services/alumniService";
import { getAdminJobs } from "../../services/jobService";
import useResponsiveSidebar from "../../hooks/useResponsiveSidebar";
import ThemeToggle from "../ThemeToggle";
import collegeLogo from "../../assets/kjcoemr-logo.png";
import "../../pages/admin/AdminDashboard.css";
import "./AdminLayout.css";
import "./AdminSidebarCollapsed.css";
import "./AdminSidebarLogo.css";

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { collapsed, toggle, closeMobileNavigation } = useResponsiveSidebar("adminSidebarCollapsed");
  const [pendingCount, setPendingCount] = useState(0);
  const [jobCount, setJobCount] = useState(null);
  const isSuperAdmin = user?.role === "ADMIN" && user?.branch === null;

  useEffect(() => {
    let active = true;
    getAdminDashboard()
      .then((response) => { if (active) setPendingCount(response.data?.pendingRegistrations || 0); })
      .catch(() => { if (active) setPendingCount(0); });
    getAdminJobs({ page: 0, size: 1, search: "" })
      .then((response) => { if (active) setJobCount(response.data?.data?.totalElements ?? 0); })
      .catch(() => { if (active) setJobCount(null); });
    return () => { active = false; };
  }, []);

  const navClass = ({ isActive }) => `admin-link${isActive ? " active" : ""}`;
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={`admin-dashboard admin-layout${collapsed ? " sidebar-collapsed" : ""}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark"><img src={collegeLogo} alt="KJCOEMR" /></div>
          <div className="admin-logo"><span className="admin-brand-name">KJCOEMR Connect</span><span>Admin Console</span></div>
          <button type="button" className="admin-sidebar-toggle" onClick={toggle} title={collapsed ? "Open menu" : "Close menu"} aria-label={collapsed ? "Open navigation menu" : "Close navigation menu"} aria-expanded={!collapsed} aria-controls="admin-navigation">
            {collapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
        <div className="sidebar-context"><div className="sidebar-context-icon"><ShieldCheck size={18} /></div><div><span>{isSuperAdmin ? "Super Admin access" : "Branch Admin access"}</span><strong>{isSuperAdmin ? "All branches" : user?.branch}</strong></div></div>
        <p className="sidebar-section-title">Workspace</p>
        <nav className="admin-menu" id="admin-navigation" aria-label="Admin navigation">
          <NavLink to="/admin/dashboard" className={navClass} title="Dashboard" onClick={closeMobileNavigation}><LayoutDashboard size={18} /><span>Dashboard</span></NavLink>
          <NavLink to="/admin/alumni" className={navClass} title="Alumni Management" onClick={closeMobileNavigation}><UsersRound size={18} /><span>Alumni Management</span></NavLink>
          <NavLink to="/admin/registrations" className={navClass} title="Registration Requests" onClick={closeMobileNavigation}><ClipboardCheck size={18} /><span>Registration Requests</span>{pendingCount > 0 && <b className="admin-nav-badge" aria-label={`${pendingCount} pending registrations`}>{pendingCount > 99 ? "99+" : pendingCount}</b>}</NavLink>
          <NavLink to="/admin/events" className={navClass} title="Event Management" onClick={closeMobileNavigation}><CalendarDays size={18} /><span>Event Management</span></NavLink>
          <NavLink to="/admin/announcements" className={navClass} title="Announcements" onClick={closeMobileNavigation}><Megaphone size={18} /><span>Announcements</span></NavLink>
          <NavLink to="/admin/jobs" className={navClass} title="Jobs" onClick={closeMobileNavigation}><BriefcaseBusiness size={18} /><span>Jobs</span>{jobCount !== null && <b className="admin-nav-badge" aria-label={`${jobCount} available jobs`}>{jobCount > 99 ? "99+" : jobCount}</b>}</NavLink>
          {isSuperAdmin && <NavLink to="/admin/admins" className={navClass} title="Admin Management" onClick={closeMobileNavigation}><ShieldCheck size={18} /><span>Admin Management</span></NavLink>}
        </nav>
        <div className="admin-bottom">
          <ThemeToggle className="admin-link portal-theme-toggle" showLabel />
          <Link to="/" className="admin-link" title="View Website"><ExternalLink size={18} /><span>View Website</span></Link>
          <button type="button" className="admin-link admin-logout logout-button" onClick={handleLogout} title="Logout"><LogOut size={18} /><span>Logout</span></button>
        </div>
      </aside>
      <div className="admin-layout-content">{children}</div>
    </div>
  );
}
