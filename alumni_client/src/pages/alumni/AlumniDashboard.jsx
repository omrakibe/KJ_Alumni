import { Children, useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarDays, GraduationCap, Megaphone, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { getAlumniDashboard } from "../../services/alumniPortalService";
import { getAlumniUpcomingEvents } from "../../services/eventService";
import { getAlumniAnnouncements } from "../../services/announcementService";
import "./AlumniDashboard.css";
import "./AlumniDashboardEvents.css";

function requestMessage(result, fallback) {
  return result.status === "rejected" ? result.reason?.response?.data?.message || fallback : "";
}

export default function AlumniDashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      getAlumniDashboard(),
      getAlumniUpcomingEvents({ page: 0, size: 3 }),
      getAlumniAnnouncements({ page: 0, size: 3 }),
    ]).then(([profileResult, eventsResult, announcementsResult]) => {
      if (!active) return;
      if (profileResult.status === "fulfilled") setProfile(profileResult.value.data?.profile || null);
      if (eventsResult.status === "fulfilled") setEvents(eventsResult.value.data?.data?.content || []);
      if (announcementsResult.status === "fulfilled") setAnnouncements(announcementsResult.value.data?.data?.content || []);
      setError([
        requestMessage(profileResult, "Could not load your profile."),
        requestMessage(eventsResult, "Could not load upcoming events."),
        requestMessage(announcementsResult, "Could not load announcements."),
      ].filter(Boolean).join(" "));
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const name = profile ? [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ") : "Alumni";
  const initial = name.charAt(0).toUpperCase();

  return (
    <main className="alumni-main" aria-busy={loading}>
      <header className="alumni-topbar"><div><p className="alumni-eyebrow">KJCOEMR Connect — Alumni Portal</p><h1>Welcome back, {profile?.firstName || "Alumni"}.</h1><p>Your alumni identity and professional profile—always in one place.</p></div><div className="alumni-top-avatar">{initial || "A"}</div></header>
      {error && <p className="alumni-page-error" role="alert">{error}</p>}
      {loading && !profile && <div className="alumni-loading-card" role="status">Loading your dashboard…</div>}
      {!loading && !profile && !error && <div className="alumni-loading-card">Your alumni profile is not available yet.</div>}
      {profile && <><section className="alumni-identity-card"><div><p>Your Alumni ID</p><strong>{profile.alumniId}</strong><span>Keep this ID for alumni-related communication.</span></div><Link to="/alumni/profile" className="alumni-edit-link">Edit profile</Link></section><section className="alumni-profile-summary"><article><GraduationCap size={21} /><span>Academic profile</span><strong>{profile.branch} · {profile.passoutYear}</strong></article><article><BriefcaseBusiness size={21} /><span>Professional profile</span><strong>{profile.jobRole || "Not provided"}</strong><small>{profile.company || "Add your company"}</small></article><article><UserRound size={21} /><span>Contact</span><strong>{profile.email}</strong><small>{profile.contactNumber}</small></article></section><section className="alumni-dashboard-community-grid"><CommunityPanel eyebrow="Upcoming events" title="Events for your community" action="Explore events" to="/alumni/events" empty="No upcoming events are available yet.">{events.map((event) => { const date = new Date(event.eventDateTime); return <Link className="alumni-dashboard-event" to={`/alumni/events/${event.id}`} key={event.id}><div className="alumni-dashboard-event-date"><CalendarDays size={17} /><span>{date.toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span></div><div><strong>{event.title}</strong><span>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {event.venue}</span></div><b>View →</b></Link>; })}</CommunityPanel><CommunityPanel eyebrow="Community news" title="Latest announcements" action="View all" to="/alumni/announcements" empty="No announcements are available yet.">{announcements.map((item) => <Link className="alumni-dashboard-announcement" to="/alumni/announcements" key={item.id}><div><span className={`alumni-dashboard-priority ${item.priority?.toLowerCase()}`}>{item.priority === "NORMAL" ? "UPDATE" : item.priority}</span><strong>{item.title}</strong><small>{item.message}</small></div><Megaphone size={17} /></Link>)}</CommunityPanel></section></>}
    </main>
  );
}

function CommunityPanel({ eyebrow, title, action, to, empty, children }) {
  return <section className="alumni-dashboard-panel alumni-community-panel"><div className="alumni-community-heading"><p className="alumni-eyebrow">{eyebrow}</p><h2>{title}</h2></div><div className="alumni-community-list">{Children.count(children) ? children : <div className="alumni-events-no-upcoming"><CalendarDays size={19} /><span>{empty}</span></div>}</div><Link to={to} className="alumni-primary-action">{action}</Link></section>;
}
