import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createBranchAdmin, deleteAdmin, getAllAdmins } from "../../services/adminService";
import "./AdminManagement.css";

const branches = [
  ["COMP", "Computer Engineering"],
  ["ENTC", "Electronics & Telecommunication"],
  ["VLSI", "VLSI"],
  ["ADVENTC", "Advanced ENTC"],
  ["MECH", "Mechanical Engineering"],
  ["CIVIL", "Civil Engineering"],
  ["ELECTRICAL", "Electrical Engineering"],
];

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({ email: "", password: "", branch: "" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllAdmins();
      setAdmins(response.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load administrators.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdmins(); }, []);

  const filteredAdmins = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return admins;
    return admins.filter((admin) => admin.email?.toLowerCase().includes(query) || admin.branch?.toLowerCase().includes(query));
  }, [admins, search]);

  const branchAdmins = admins.filter((admin) => admin.branch).length;
  const activeAdmins = admins.filter((admin) => admin.status === "ACTIVE").length;

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    try {
      setCreating(true);
      setError("");
      setSuccess("");
      const response = await createBranchAdmin({ ...formData, email: formData.email.trim() });
      setSuccess(response.message || "Branch administrator created successfully.");
      setFormData({ email: "", password: "", branch: "" });
      await loadAdmins();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create the branch administrator.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (!window.confirm(`Delete the administrator account for ${admin.email}? This cannot be undone.`)) return;
    try {
      setDeletingId(admin.id);
      setError("");
      setSuccess("");
      const response = await deleteAdmin(admin.id);
      setSuccess(response.message || "Administrator deleted successfully.");
      await loadAdmins();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to delete the administrator.");
    } finally {
      setDeletingId(null);
    }
  };

  return <div className="super-admin-page">
    <header className="super-admin-header"><div><Link to="/admin/dashboard" className="admin-back-link">← Back to Dashboard</Link><h1>Admin Management</h1><p>Create and manage branch administrator accounts.</p></div><button type="button" className="admin-refresh-button" onClick={loadAdmins} disabled={loading}>Refresh</button></header>

    {success && <div className="admin-alert admin-alert-success">{success}</div>}
    {error && <div className="admin-alert admin-alert-error">{error}</div>}

    <section className="admin-summary-grid"><SummaryCard label="Total administrators" value={admins.length} /><SummaryCard label="Branch administrators" value={branchAdmins} /><SummaryCard label="Active administrators" value={activeAdmins} /></section>

    <section className="super-admin-card"><div className="super-admin-card-title"><div><h2>Create Branch Administrator</h2><p>New administrators are immediately active and limited to their assigned branch.</p></div></div>
      <form className="admin-create-form" onSubmit={handleCreateAdmin}>
        <label>Email<input type="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} placeholder="admin@college.edu" required /></label>
        <label>Temporary password<input type="password" value={formData.password} onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))} placeholder="Minimum 8 characters" minLength="8" required /></label>
        <label>Assigned branch<select value={formData.branch} onChange={(event) => setFormData((current) => ({ ...current, branch: event.target.value }))} required><option value="">Select branch</option>{branches.map(([code, label]) => <option key={code} value={code}>{label} ({code})</option>)}</select></label>
        <button type="submit" className="admin-create-button" disabled={creating}>{creating ? "Creating…" : "Create administrator"}</button>
      </form>
    </section>

    <section className="super-admin-card"><div className="super-admin-list-header"><div><h2>Administrators</h2><p>{filteredAdmins.length} shown</p></div><input className="admin-search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search email or branch" aria-label="Search administrators" /></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Administrator</th><th>Access</th><th>Branch</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>
        {loading ? <tr><td colSpan="5" className="admin-table-state">Loading administrators…</td></tr> : filteredAdmins.length ? filteredAdmins.map((admin) => { const isSuperAdmin = !admin.branch; return <tr key={admin.id}><td><div className="admin-identity"><div className="admin-list-avatar">{admin.email?.charAt(0).toUpperCase()}</div><strong>{admin.email}</strong></div></td><td>{isSuperAdmin ? "Super Admin" : "Branch Admin"}</td><td>{isSuperAdmin ? "All branches" : admin.branch}</td><td><span className={`admin-status admin-status-${admin.status?.toLowerCase()}`}>{admin.status}</span></td><td>{isSuperAdmin ? <span className="admin-protected-label">Protected</span> : <button className="admin-delete-button" disabled={deletingId === admin.id} onClick={() => handleDeleteAdmin(admin)}>{deletingId === admin.id ? "Deleting…" : "Delete"}</button>}</td></tr>; }) : <tr><td colSpan="5" className="admin-table-state">No administrators match your search.</td></tr>}
      </tbody></table></div>
    </section>
  </div>;
}

function SummaryCard({ label, value }) { return <div className="admin-summary-card"><span>{label}</span><strong>{value}</strong></div>; }

export default AdminManagement;
