import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAlumniProfile, updateAlumniProfile } from "../../services/alumniPortalService";
import "./AlumniProfile.css";

const editableFields = ["contactNumber", "company", "jobRole", "currentPackage", "experience"];

function AlumniProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { getAlumniProfile().then((response) => { setProfile(response.data); setForm(response.data); }).catch((requestError) => setError(requestError.response?.data?.message || "Could not load your profile.")); }, []);

  const save = async (event) => {
    event.preventDefault();
    try {
      setSaving(true); setError(""); setMessage("");
      const payload = editableFields.reduce((result, field) => ({ ...result, [field]: form[field] }), {});
      const response = await updateAlumniProfile(payload);
      setProfile(response.data); setForm(response.data); setEditing(false); setMessage(response.message || "Profile updated successfully.");
    } catch (requestError) { setError(requestError.response?.data?.message || "Could not update your profile."); } finally { setSaving(false); }
  };

  if (!profile && !error) return <div className="alumni-profile-page"><p>Loading your profile…</p></div>;
  if (error && !profile) return <div className="alumni-profile-page"><p className="profile-error">{error}</p></div>;
  const name = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ");
  return <main className="alumni-profile-page"><Link to="/alumni/dashboard" className="profile-back"><ArrowLeft size={16} /> Back to dashboard</Link><header><p className="profile-eyebrow">Alumni profile</p><h1>{name}</h1><p>Review your alumni identity and keep your professional details current.</p></header>{message && <p className="profile-success">{message}</p>}{error && <p className="profile-error">{error}</p>}
    <section className="profile-id-card"><span>Alumni ID</span><strong>{profile.alumniId}</strong><p>{profile.branch} · Class of {profile.passoutYear}</p></section>
    <form className="profile-card" onSubmit={save}><div className="profile-card-head"><div><h2>Profile details</h2><p>Academic identity fields are kept protected.</p></div>{!editing ? <button type="button" className="profile-edit-button" onClick={() => setEditing(true)}>Edit profile</button> : <div className="profile-actions"><button type="button" onClick={() => { setForm(profile); setEditing(false); }}>Cancel</button><button type="submit" disabled={saving}><Save size={16} />{saving ? "Saving…" : "Save changes"}</button></div>}</div>
      <div className="profile-grid"><ReadOnly label="Email" value={profile.email} /><ReadOnly label="Branch" value={profile.branch} /><ReadOnly label="Pass-out year" value={profile.passoutYear} /><ReadOnly label="Date of birth" value={profile.dob} />{editableFields.map((field) => <label key={field}><span>{field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}</span>{editing ? <input required type={field === "currentPackage" || field === "experience" ? "number" : "text"} min={field === "currentPackage" || field === "experience" ? "0" : undefined} step={field === "currentPackage" || field === "experience" ? "0.1" : undefined} value={form[field] ?? ""} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} /> : <strong>{profile[field] ?? "—"}</strong>}</label>)}</div>
    </form></main>;
}
function ReadOnly({ label, value }) { return <div className="profile-readonly"><span>{label}</span><strong>{value || "—"}</strong></div>; }
export default AlumniProfile;
