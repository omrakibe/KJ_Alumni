import { useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Clock3, ExternalLink, FileText, Mail, MapPin, Pencil, Send, Trash2, UsersRound } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteOwnJob, getAdminJob, getAlumniJob } from "../../services/jobService";
import { branchLabel } from "../../constants/branches";
import "./Jobs.css";

const isApplicationLink = (value) => /^https?:\/\/\S+$/i.test(value?.trim() || "");
const typeLabel = (type) => type?.replaceAll("_", " ");

export default function JobDetail({ admin = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(false);
  useEffect(() => {
    let active = true;
    (admin ? getAdminJob(id) : getAlumniJob(id)).then(({ data }) => { if (active) setJob(data.data); }).catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Could not load this job."); });
    return () => { active = false; };
  }, [admin, id]);
  const remove = async () => {
    if (!window.confirm("Delete this job posting? This action cannot be undone.")) return;
    setRemoving(true); setError("");
    try { await deleteOwnJob(id); navigate("/alumni/jobs", { replace: true }); }
    catch (requestError) { setError(requestError.response?.data?.message || "Could not delete this job."); setRemoving(false); }
  };
  const back = admin ? "/admin/jobs" : "/alumni/jobs";
  if (!job) return <main className="jobs-page"><Link className="profile-back" to={back}><ArrowLeft size={16}/> Back to jobs</Link><p className={`jobs-feedback${error ? " error" : ""}`}>{error || "Loading job…"}</p></main>;
  return <main className="jobs-page job-view-page">
    {error && <p className="jobs-feedback error" role="alert">{error}</p>}

    <article className="job-view-container">
      <header className="job-view-hero">
        <div className="job-view-backline"><Link className="profile-back job-view-back" to={back}><ArrowLeft size={16}/> Back to jobs</Link></div>
        <div className="job-view-heading">
          <div className="job-view-tags"><span className="job-live-status"><i/> Active opportunity</span><span className="job-audience">{job.visibility === "ALL" ? "Entire college" : branchLabel(job.targetBranch)}</span><span className="job-type">{typeLabel(job.jobType)}</span></div>
          <h1>{job.title}</h1>
          <p>{job.companyName}</p>
        </div>
        <div className="job-view-deadline"><small>Applications close</small><strong><CalendarDays size={15}/>{new Date(`${job.deadline}T00:00:00`).toLocaleDateString()}</strong></div>
      </header>

      <div className="job-view-layout">
        <div className="job-view-main">
          <section className="job-view-section">
            <div className="job-view-section-title"><span><FileText size={18}/></span><div><p className="jobs-eyebrow">About the opportunity</p><h2>Job description</h2></div></div>
            <p className="job-detail-description">{job.description}</p>
          </section>

          <section className="job-view-section job-view-application">
            <div className="job-view-section-title"><span><Send size={18}/></span><div><p className="jobs-eyebrow">Next step</p><h2>How to apply</h2></div></div>
            <p>{job.applicationDetails}</p>
            {isApplicationLink(job.applicationDetails) && <a className="jobs-primary" href={job.applicationDetails.trim()} target="_blank" rel="noreferrer">Open application link <ExternalLink size={16}/></a>}
          </section>
        </div>

        <aside className="job-view-sidebar">
          {admin && <PosterHighlight job={job}/>} 
          <section className="job-view-overview">
            <h2>Job overview</h2>
            <div className="job-view-fact"><span><MapPin size={17}/></span><div><small>Location</small><strong>{job.location}</strong></div></div>
            <div className="job-view-fact"><span><BriefcaseBusiness size={17}/></span><div><small>Experience</small><strong>{job.experienceRequired}</strong></div></div>
            <div className="job-view-fact"><span><Mail size={17}/></span><div><small>Contact</small><strong>{job.postedByEmail}</strong></div></div>
            <div className="job-view-fact"><span><Clock3 size={17}/></span><div><small>Posted on</small><strong>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}</strong></div></div>
          </section>

          {!admin && job.ownedByCurrentUser && <section className="job-owner-actions"><p>You shared this opportunity.</p><Link className="jobs-secondary" to={`/alumni/jobs/${job.id}/edit`}><Pencil size={16}/> Edit job</Link><button type="button" className="jobs-danger" onClick={remove} disabled={removing}><Trash2 size={16}/>{removing ? "Deleting…" : "Delete job"}</button></section>}
        </aside>
      </div>
    </article>
  </main>;
}

function PosterHighlight({ job }) {
  return <section className="job-poster-highlight"><span><UsersRound size={18}/></span><div><small>Opportunity shared by</small><strong>{job.postedByName}</strong><b>{job.postedByAlumniId}</b></div></section>;
}
