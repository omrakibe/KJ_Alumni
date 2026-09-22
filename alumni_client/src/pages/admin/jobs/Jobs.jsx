import { useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness, CalendarDays, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { branchLabel } from "../../../constants/branches";
import { getAdminJobs } from "../../../services/jobService";
import "../../jobs/Jobs.css";

export default function AdminJobs() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [result, setResult] = useState({ content: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true); setError("");
      getAdminJobs({ page, size: 20, search }).then(({ data }) => { if (active) setResult(data.data || { content: [], totalPages: 0 }); }).catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Could not load jobs."); }).finally(() => { if (active) setLoading(false); });
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [page, search]);
  return (
    <main className="jobs-page">
      <header className="jobs-header">
        <div className="jobs-header-copy">
          <p className="jobs-eyebrow">Career opportunities</p>
          <h1>Jobs overview</h1>
          <p>Review active opportunities and quickly identify the alumni who shared them.</p>
        </div>
        <div className="jobs-header-icon"><BriefcaseBusiness size={25}/></div>
      </header>

      <section className="jobs-toolbar">
        <div className="jobs-search"><input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Search title, company, alumni name or ID" aria-label="Search jobs"/></div>
        {!loading && <span className="jobs-results-count">{result.totalElements || 0} available</span>}
      </section>

      {error && <p className="jobs-feedback error" role="alert">{error}</p>}
      {loading ? <p className="jobs-feedback" role="status">Loading jobs…</p> : result.content?.length ? (
        <section className="admin-jobs-grid">
          {result.content.map((job) => (
            <article className="admin-job-card" key={job.id}>
              <header className="admin-job-poster">
                <span className="admin-job-avatar"><UserRound size={19}/></span>
                <div className="admin-job-identity">
                  <small>Opportunity shared by</small>
                  <strong>{job.postedByName || "Alumni member"}</strong>
                </div>
                <div className="admin-job-alumni-id">
                  <small>Alumni ID</small>
                  <b>{job.postedByAlumniId || "Not available"}</b>
                </div>
              </header>

              <div className="admin-job-card-body">
                <div className="job-card-top">
                  <span className="job-audience">{job.visibility === "ALL" ? "Entire college" : branchLabel(job.targetBranch)}</span>
                  <span className="job-type">{job.jobType?.replaceAll("_", " ")}</span>
                </div>
                <h2>{job.title}</h2>
                <p className="admin-job-company">{job.companyName}</p>
                <div className="admin-job-dates">
                  <div><CalendarDays size={15}/><span><small>Apply by</small><strong>{new Date(`${job.deadline}T00:00:00`).toLocaleDateString()}</strong></span></div>
                  <div><span><small>Posted on</small><strong>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}</strong></span></div>
                </div>
              </div>

              <footer className="admin-job-card-footer">
                <Link to={`/admin/jobs/${job.id}`}>View complete details <ArrowRight size={16}/></Link>
              </footer>
            </article>
          ))}
        </section>
      ) : <p className="jobs-feedback">No active jobs found.</p>}

      {result.totalPages > 1 && <nav className="jobs-pagination"><button type="button" disabled={page === 0 || loading} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page + 1} of {result.totalPages}</span><button type="button" disabled={page + 1 >= result.totalPages || loading} onClick={() => setPage((value) => value + 1)}>Next</button></nav>}
    </main>
  );
}
