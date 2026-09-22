import { useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarDays, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getAlumniJobs, getMyJobs } from "../../../services/jobService";
import { branchLabel } from "../../../constants/branches";
import "../../jobs/Jobs.css";

const jobTypeLabel = (type) => type?.replaceAll("_", " ");

export default function AlumniJobs() {
  const [tab, setTab] = useState("available");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [result, setResult] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true); setError("");
      const request = tab === "mine" ? getMyJobs : getAlumniJobs;
      request({ page, size: 12, search })
        .then(({ data }) => { if (active) setResult(data.data || { content: [], totalPages: 0, totalElements: 0 }); })
        .catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Could not load jobs."); })
        .finally(() => { if (active) setLoading(false); });
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [page, search, tab]);

  const changeTab = (next) => { setTab(next); setPage(0); };
  return <main className="jobs-page"><header className="jobs-header"><div className="jobs-header-copy"><p className="jobs-eyebrow">Career opportunities</p><h1>Alumni Jobs</h1><p>Explore vacancies shared by the KJCOEMR alumni community.</p></div><Link className="jobs-primary" to="/alumni/jobs/new"><Plus size={17}/> Post a job</Link></header>
    <section className="jobs-toolbar"><div className="jobs-tabs" role="tablist" aria-label="Job lists"><button type="button" role="tab" aria-selected={tab === "available"} className={tab === "available" ? "active" : ""} onClick={() => changeTab("available")}>Available Jobs</button><button type="button" role="tab" aria-selected={tab === "mine"} className={tab === "mine" ? "active" : ""} onClick={() => changeTab("mine")}>My Posted Jobs</button></div><div className="jobs-search"><input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Search title, company or location" aria-label="Search jobs" /></div></section>
    {error && <p className="jobs-feedback error" role="alert">{error}</p>}
    {loading ? <p className="jobs-feedback" role="status">Loading jobs…</p> : result.content?.length ? <section className="jobs-grid">{result.content.map((job) => <JobCard key={job.id} job={job}/>)}</section> : <p className="jobs-feedback">{tab === "mine" ? "You have not posted any active jobs yet." : "No active jobs match your search."}</p>}
    {result.totalPages > 1 && <nav className="jobs-pagination" aria-label="Jobs pagination"><button type="button" disabled={page === 0 || loading} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page + 1} of {result.totalPages}</span><button type="button" disabled={page + 1 >= result.totalPages || loading} onClick={() => setPage((value) => value + 1)}>Next</button></nav>}
  </main>;
}

function JobCard({ job }) {
  return <article className="job-card"><div className="job-card-top"><span className="job-audience">{job.visibility === "ALL" ? "Entire college" : branchLabel(job.targetBranch)}</span><span className="job-type">{jobTypeLabel(job.jobType)}</span></div><h2>{job.title}</h2><span className="job-company">{job.companyName}</span><p className="job-card-summary">{job.description}</p><div className="job-card-meta"><span><MapPin size={14}/>{job.location}</span><span><BriefcaseBusiness size={14}/>{job.experienceRequired}</span><span><CalendarDays size={14}/>Apply by {new Date(`${job.deadline}T00:00:00`).toLocaleDateString()}</span></div><footer className="job-card-footer"><small>{job.ownedByCurrentUser ? "Posted by you" : "Alumni opportunity"}</small><Link to={`/alumni/jobs/${job.id}`}>View details →</Link></footer></article>;
}
