import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClipboardCheck, ExternalLink, LayoutDashboard, LogOut, ShieldCheck, UsersRound } from "lucide-react";
import "./AdminDashboard.css";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboard } from "../../services/alumniService";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const isSuperAdmin = user?.role === "ADMIN" && user?.branch === null;

  useEffect(() => {
    getAdminDashboard()
      .then((response) => setDashboard(response.data))
      .catch((requestError) => setError(requestError.response?.data?.message || "Could not load dashboard data."));
  }, []);

  const stats = [
    ["Total Alumni", dashboard?.totalAlumni, isSuperAdmin ? "Across all branches" : `${user?.branch || "Your"} branch`],
    ["Pending Registrations", dashboard?.pendingRegistrations, "Awaiting review"],
    ["Active Alumni", dashboard?.activeAlumni, "Active accounts"],
    ["Suspended Alumni", dashboard?.suspendedAlumni, "Suspended accounts"],
  ];

  return <div className="admin-dashboard">
    <aside className="admin-sidebar">
      <div className="sidebar-brand"><div className="sidebar-brand-mark">KJ</div><div className="admin-logo">KJCOEMR<span>Alumni Administration</span></div></div>
      <div className="sidebar-context"><div className="sidebar-context-icon"><ShieldCheck size={18} /></div><div><span>{isSuperAdmin ? "Super Admin access" : "Branch Admin access"}</span><strong>{isSuperAdmin ? "All branches" : user?.branch}</strong></div></div>
      <p className="sidebar-section-title">Workspace</p>
      <nav className="admin-menu">
        <Link to="/admin/dashboard" className="admin-link active"><LayoutDashboard size={18} />Dashboard</Link>
        <Link to="/admin/alumni" className="admin-link"><UsersRound size={18} />Alumni Management</Link>
        <Link to="/admin/registrations" className="admin-link"><ClipboardCheck size={18} />Registration Requests</Link>
        {isSuperAdmin && <Link to="/admin/admins" className="admin-link"><ShieldCheck size={18} />Admin Management</Link>}
      </nav>
      <div className="admin-bottom"><Link to="/" className="admin-link"><ExternalLink size={18} />View Website</Link><button className="admin-link admin-logout logout-button" onClick={logout}><LogOut size={18} />Logout</button></div>
    </aside>

    <main className="admin-main">
      <header className="admin-topbar"><div><h1>Admin Dashboard</h1><p>{isSuperAdmin ? "Organization-wide overview." : `Overview for the ${user?.branch} branch.`}</p></div><div className="admin-user"><div className="admin-avatar">{user?.email?.charAt(0).toUpperCase() || "A"}</div><div><strong>{isSuperAdmin ? "Super Admin" : `${user?.branch} Admin`}</strong><span>{user?.email}</span></div></div></header>
      {error && <p className="dashboard-error">{error}</p>}
      <section className="admin-stats">{stats.map(([label, value, note]) => <div className="admin-stat-card" key={label}><span>{label}</span><strong>{value ?? "—"}</strong><small>{note}</small></div>)}</section>

      <section className="quick-actions"><div className="section-heading"><h2>Admin actions</h2><p>Manage the current administrative work.</p></div><div className="quick-action-grid">
        <Link to="/admin/alumni" className="quick-action"><div className="quick-icon blue">A</div><div><h3>Manage Alumni</h3><p>View, update, activate, or suspend accounts.</p></div></Link>
        <Link to="/admin/registrations" className="quick-action"><div className="quick-icon orange">R</div><div><h3>Registration Requests</h3><p>Review pending registration requests.</p></div></Link>
        {isSuperAdmin && <Link to="/admin/admins" className="quick-action"><div className="quick-icon purple">M</div><div><h3>Admin Management</h3><p>Create and manage branch administrators.</p></div></Link>}
      </div></section>

      <section className="dashboard-data-grid">
        <DashboardBreakdown title="Alumni by branch" data={dashboard?.alumniByBranch} emptyMessage="No alumni data is available yet." />
        <DashboardBreakdown title="Alumni by pass-out year" data={dashboard?.alumniByPassoutYear} emptyMessage="No pass-out-year data is available yet." />
      </section>
    </main>
  </div>;
}

function DashboardBreakdown({ title, data, emptyMessage }) {
  const entries = Object.entries(data || {});
  return <section className="dashboard-breakdown"><h2>{title}</h2>{entries.length ? <div className="breakdown-list">{entries.map(([label, count]) => <div className="breakdown-row" key={label}><span>{label}</span><strong>{count}</strong></div>)}</div> : <p>{emptyMessage}</p>}</section>;
}

export default AdminDashboard;
