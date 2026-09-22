import { useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, FileText, Globe2, Link2, MapPin, Send, Sparkles } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BRANCHES, branchLabel } from "../../../constants/branches";
import { createJob, getAlumniJob, updateJob } from "../../../services/jobService";
import "../../jobs/Jobs.css";

const JOB_TYPES = [
  ["FULL_TIME", "Full time"], ["PART_TIME", "Part time"], ["INTERNSHIP", "Internship"],
  ["CONTRACT", "Contract"], ["REMOTE", "Remote"],
];

function localToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export default function CreateJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [form, setForm] = useState({ title: "", companyName: "", description: "", location: "", jobType: "FULL_TIME", experienceRequired: "", applicationDetails: "", deadline: "", audience: "ALL" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [canEdit, setCanEdit] = useState(!editing);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!editing) return;
    let active = true;
    getAlumniJob(id).then(({ data }) => {
      if (!active) return;
      const job = data.data;
      if (!job.ownedByCurrentUser) { setError("You can edit only jobs posted by you."); return; }
      setForm({ title: job.title, companyName: job.companyName, description: job.description, location: job.location, jobType: job.jobType, experienceRequired: job.experienceRequired, applicationDetails: job.applicationDetails, deadline: job.deadline, audience: job.visibility === "ALL" ? "ALL" : job.targetBranch });
      setCanEdit(true);
    }).catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Could not load this job."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [editing, id]);
  const change = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const all = form.audience === "ALL";
      const payload = { ...form, audience: undefined, visibility: all ? "ALL" : "BRANCH", targetBranch: all ? null : form.audience };
      if (editing) await updateJob(id, payload); else await createJob(payload);
      navigate(editing ? `/alumni/jobs/${id}` : "/alumni/jobs", { replace: true });
    } catch (requestError) { setError(requestError.response?.data?.message || `Could not ${editing ? "update" : "publish"} this job.`); }
    finally { setSaving(false); }
  };
  const back = editing ? `/alumni/jobs/${id}` : "/alumni/jobs";
  const audienceLabel = form.audience === "ALL" ? "All KJCOEMR alumni" : `${branchLabel(form.audience)} alumni`;

  return <main className="jobs-page job-editor-page">
    <Link className="profile-back job-editor-back" to={back}><ArrowLeft size={16}/> Back to jobs</Link>

    <header className="job-editor-header">
      <div className="job-editor-header-icon"><BriefcaseBusiness size={25}/></div>
      <div>
        <p className="jobs-eyebrow">{editing ? "Manage opportunity" : "Share an opportunity"}</p>
        <h1>{editing ? "Update job listing" : "Post a new job"}</h1>
        <p>{editing ? "Keep the role, deadline and application information accurate." : "Help the alumni community discover a relevant career opportunity."}</p>
      </div>
      <span className="job-editor-mode"><Sparkles size={14}/>{editing ? "Editing your post" : "New opportunity"}</span>
    </header>

    {error && <p className="jobs-feedback error" role="alert">{error}</p>}
    {loading ? <p className="jobs-feedback" role="status">Loading job…</p> : canEdit && <form className="job-editor-layout" onSubmit={submit}>
      <div className="job-form-card">
        <section className="job-form-section">
          <div className="job-form-section-heading"><span><Building2 size={18}/></span><div><h2>Role details</h2><p>Start with the information alumni need to understand the opportunity.</p></div></div>
          <div className="job-form-grid">
            <label><span>Job title</span><input required maxLength="180" placeholder="e.g. Software Engineer" value={form.title} onChange={(e) => change("title", e.target.value)} disabled={saving}/></label>
            <label><span>Company name</span><input required maxLength="180" placeholder="e.g. Acme Technologies" value={form.companyName} onChange={(e) => change("companyName", e.target.value)} disabled={saving}/></label>
            <label><span>Location</span><div className="job-input-with-icon"><MapPin size={16}/><input required maxLength="180" placeholder="City, state or Remote" value={form.location} onChange={(e) => change("location", e.target.value)} disabled={saving}/></div></label>
            <label><span>Job type</span><select value={form.jobType} onChange={(e) => change("jobType", e.target.value)} disabled={saving}>{JOB_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label><span>Experience required</span><input required maxLength="120" placeholder="e.g. Fresher or 2–4 years" value={form.experienceRequired} onChange={(e) => change("experienceRequired", e.target.value)} disabled={saving}/></label>
            <label><span>Application deadline</span><div className="job-input-with-icon"><CalendarDays size={16}/><input required type="date" min={localToday()} value={form.deadline} onChange={(e) => change("deadline", e.target.value)} disabled={saving}/></div></label>
          </div>
        </section>

        <section className="job-form-section">
          <div className="job-form-section-heading"><span><Globe2 size={18}/></span><div><h2>Audience</h2><p>Choose who should see this opportunity in their Jobs feed.</p></div></div>
          <div className="job-form-grid">
            <label className="job-form-wide"><span>Visible to</span><select value={form.audience} onChange={(e) => change("audience", e.target.value)} disabled={saving}><option value="ALL">Entire College</option>{BRANCHES.map((branch) => <option key={branch.value} value={branch.value}>{branch.label}</option>)}</select><small className="job-form-hint">Branch opportunities are shown only to alumni and administrators from that branch.</small></label>
          </div>
        </section>

        <section className="job-form-section">
          <div className="job-form-section-heading"><span><FileText size={18}/></span><div><h2>Description and application</h2><p>Add clear responsibilities and an easy way for interested alumni to apply.</p></div></div>
          <div className="job-form-grid">
            <label className="job-form-wide"><span>Job description</span><textarea className="job-description-input" required maxLength="10000" placeholder="Describe the role, responsibilities, required skills and qualifications…" value={form.description} onChange={(e) => change("description", e.target.value)} disabled={saving}/><small className="job-form-counter">{form.description.length.toLocaleString()} / 10,000</small></label>
            <label className="job-form-wide"><span>Application link or contact details</span><div className="job-textarea-with-icon"><Link2 size={16}/><textarea required maxLength="1000" placeholder="https://company.example/apply or recruiter contact details" value={form.applicationDetails} onChange={(e) => change("applicationDetails", e.target.value)} disabled={saving}/></div><div className="job-form-helper-row"><small className="job-form-hint">A valid http/https link becomes an Apply button.</small><small className="job-form-counter">{form.applicationDetails.length} / 1,000</small></div></label>
          </div>
        </section>
      </div>

      <aside className="job-editor-aside">
        <section className="job-publish-summary">
          <span className="job-summary-icon"><CheckCircle2 size={20}/></span>
          <p className="jobs-eyebrow">Publishing summary</p>
          <h2>{form.title.trim() || "Your job opportunity"}</h2>
          <p className="job-summary-company">{form.companyName.trim() || "Company name will appear here"}</p>
          <dl>
            <div><dt>Audience</dt><dd>{audienceLabel}</dd></div>
            <div><dt>Deadline</dt><dd>{form.deadline ? new Date(`${form.deadline}T00:00:00`).toLocaleDateString() : "Not selected"}</dd></div>
            <div><dt>Type</dt><dd>{JOB_TYPES.find(([value]) => value === form.jobType)?.[1]}</dd></div>
          </dl>
        </section>

        <section className="job-publish-tips">
          <h3>Before you publish</h3>
          <ul><li>Check the role and company details.</li><li>Use an official application link when possible.</li><li>Make sure the deadline is still active.</li></ul>
        </section>

        <div className="job-form-actions"><Link className="jobs-secondary" to={back}>Cancel</Link><button className="jobs-primary" type="submit" disabled={saving}><Send size={16}/>{saving ? "Saving…" : editing ? "Save changes" : "Publish job"}</button></div>
      </aside>
    </form>}
  </main>;
}
