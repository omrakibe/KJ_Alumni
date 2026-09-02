import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAlumni,
  getAlumniById,
  updateAlumni,
  updateAlumniStatus,
} from "../../services/alumniService";
import "./AlumniManagement.css";

const branches = ["COMP", "ENTC", "VLSI", "ADVENTC", "MECH", "CIVIL", "ELECTRICAL"];
const editableFields = ["firstName", "middleName", "lastName", "branch", "passoutYear", "contactNumber", "company", "jobRole", "currentPackage", "experience"];

function fullName(alumnus) {
  return [alumnus.firstName, alumnus.middleName, alumnus.lastName].filter(Boolean).join(" ");
}

function AlumniManagement() {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState([]);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: "", branch: "", passoutYear: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isSuperAdmin = user?.role === "ADMIN" && user?.branch === null;

  useEffect(() => {
    const loadAlumni = async () => {
      try {
        setLoading(true);
        setError("");
        const params = { page, size: 10 };
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "") params[key] = value;
        });
        const response = await getAlumni(params);
        const data = response.data;
        setAlumni(data?.content || []);
        setPageInfo({ totalElements: data?.totalElements || 0, totalPages: data?.totalPages || 0 });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load alumni.");
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(loadAlumni, 250);
    return () => clearTimeout(debounce);
  }, [filters, page, refreshKey]);

  const updateFilter = (name, value) => {
    setPage(0);
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const openAlumni = async (id) => {
    try {
      setSaving(true);
      setError("");
      const response = await getAlumniById(id);
      setSelectedAlumni(response.data);
      setForm(response.data);
      setEditMode(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load alumni details.");
    } finally {
      setSaving(false);
    }
  };

  const saveAlumni = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = editableFields.reduce((result, field) => ({ ...result, [field]: form[field] }), {});
      const response = await updateAlumni(selectedAlumni.id, payload);
      setSelectedAlumni(response.data);
      setForm(response.data);
      setEditMode(false);
      setRefreshKey((value) => value + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update alumni.");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async () => {
    const nextStatus = selectedAlumni.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (!window.confirm(`Do you want to ${nextStatus === "ACTIVE" ? "activate" : "suspend"} this alumni account?`)) return;
    try {
      setSaving(true);
      const response = await updateAlumniStatus(selectedAlumni.id, nextStatus);
      setSelectedAlumni(response.data);
      setForm(response.data);
      setRefreshKey((value) => value + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update account status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="alumni-management-page">
      <div className="alumni-management-header">
        <div><Link to="/admin/dashboard" className="alumni-back-link">← Back to Dashboard</Link><h1>Alumni Management</h1><p>View, edit, and manage alumni accounts.</p></div>
        <div className="alumni-count">{pageInfo.totalElements} Alumni</div>
      </div>

      <div className="alumni-filter-card">
        <div className="alumni-search"><input placeholder="Search name, email, ID or phone..." value={filters.search} onChange={(e) => updateFilter("search", e.target.value)} /></div>
        {isSuperAdmin && <div className="alumni-filter"><select value={filters.branch} onChange={(e) => updateFilter("branch", e.target.value)}><option value="">Branch</option>{branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}</select></div>}
        <div className="alumni-filter"><input type="number" min="1900" placeholder="Passout year" value={filters.passoutYear} onChange={(e) => updateFilter("passoutYear", e.target.value)} /></div>
        <div className="alumni-filter"><select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}><option value="">Status</option><option value="ACTIVE">Active</option><option value="SUSPENDED">Suspended</option></select></div>
        {Object.values(filters).some(Boolean) && <button type="button" className="clear-filter-button" onClick={() => { setPage(0); setFilters({ search: "", branch: "", passoutYear: "", status: "" }); }}>Clear</button>}
      </div>

      {error && <p className="alumni-feedback alumni-error">{error}</p>}
      <div className="alumni-table-card"><div className="alumni-table-wrapper"><table className="alumni-table"><thead><tr><th>Alumni ID</th><th>Name</th><th>Email</th><th>Branch</th><th>Year</th><th>Status</th><th>Action</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="7" className="no-alumni">Loading alumni…</td></tr> : alumni.length ? alumni.map((alumnus) => <tr key={alumnus.id}><td className="alumni-id">{alumnus.alumniId}</td><td className="alumni-name">{fullName(alumnus)}</td><td>{alumnus.email}</td><td>{alumnus.branch}</td><td>{alumnus.passoutYear}</td><td><span className={`status-badge ${alumnus.status === "ACTIVE" ? "status-active" : "status-suspended"}`}>{alumnus.status}</span></td><td><button className="alumni-action-button" onClick={() => openAlumni(alumnus.id)}>View</button></td></tr>) : <tr><td colSpan="7" className="no-alumni">No alumni found.</td></tr>}
      </tbody></table></div>
        {pageInfo.totalPages > 1 && <div className="alumni-pagination"><button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page + 1} of {pageInfo.totalPages}</span><button disabled={page + 1 >= pageInfo.totalPages} onClick={() => setPage(page + 1)}>Next</button></div>}
      </div>

      {selectedAlumni && <div className="alumni-modal-backdrop" onMouseDown={() => !saving && setSelectedAlumni(null)}><section className="alumni-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="alumni-modal-header"><div><h2>{fullName(selectedAlumni)}</h2><p>{selectedAlumni.alumniId}</p></div><button className="alumni-close-button" onClick={() => setSelectedAlumni(null)} aria-label="Close">×</button></div>
        <form onSubmit={saveAlumni}>
          <div className="alumni-profile-grid">
            <Detail label="Email" value={selectedAlumni.email} /><Detail label="Branch" value={selectedAlumni.branch} /><Detail label="Pass-out year" value={selectedAlumni.passoutYear} /><Detail label="Date of birth" value={selectedAlumni.dob} />
            {editableFields.map((field) => <label key={field} className="alumni-field"><span>{field === "jobRole" ? "Job role" : field === "currentPackage" ? "Current package" : field === "passoutYear" ? "Pass-out year" : field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}</span>{editMode && field === "branch" ? <select value={form.branch ?? ""} onChange={(event) => setForm((current) => ({ ...current, branch: event.target.value }))}>{branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}</select> : editMode ? <input required={field !== "middleName"} type={field === "currentPackage" || field === "experience" || field === "passoutYear" ? "number" : "text"} min={field === "currentPackage" || field === "experience" ? "0" : field === "passoutYear" ? "1900" : undefined} step={field === "currentPackage" || field === "experience" ? "0.1" : undefined} value={form[field] ?? ""} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} /> : <strong>{selectedAlumni[field] ?? "—"}</strong>}</label>)}
          </div>
          <div className="alumni-modal-actions"><button type="button" className="alumni-secondary-button" onClick={changeStatus} disabled={saving}>{selectedAlumni.status === "ACTIVE" ? "Suspend account" : "Activate account"}</button>{editMode ? <><button type="button" className="alumni-secondary-button" onClick={() => { setForm(selectedAlumni); setEditMode(false); }}>Cancel</button><button type="submit" className="alumni-primary-button" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button></> : <button type="button" className="alumni-primary-button" onClick={() => setEditMode(true)}>Edit details</button>}</div>
        </form>
      </section></div>}
    </div>
  );
}

function Detail({ label, value }) {
  return <div className="alumni-field"><span>{label}</span><strong>{value || "—"}</strong></div>;
}

export default AlumniManagement;
