import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cancelEvent, getAdminEventHistory, getAdminUpcomingEvents } from "../../../services/eventService";
import "./Event.css";
import "./EventSections.css";
import "./EventHistory.css";
import "./EventTabs.css";
import "./EventConsoleLayout.css";

export default function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState([]); const [eventHistory, setEventHistory] = useState([]); const [error, setError] = useState(""); const [tab, setTab] = useState("upcoming"); const [loading, setLoading] = useState(true); const [removingId, setRemovingId] = useState(null);
  const load = () => { setLoading(true); setError(""); return Promise.all([getAdminUpcomingEvents({ page: 0, size: 50 }), getAdminEventHistory({ page: 0, size: 50 })]).then(([upcoming, history]) => { setUpcomingEvents(upcoming.data?.data?.content || []); setEventHistory(history.data?.data?.content || []); }).catch((e) => setError(e.response?.data?.message || "Could not load events.")).finally(() => setLoading(false)); };
  useEffect(() => { const request = window.setTimeout(load, 0); return () => window.clearTimeout(request); }, []);
  const cancel = async (id, history = false) => { if (!window.confirm(history ? "Remove this completed event from history? This permanently deletes it and all RSVP records." : "Cancel this event? This will permanently delete it and all RSVP records.")) return; try { setRemovingId(id); setError(""); await cancelEvent(id); await load(); } catch (e) { setError(e.response?.data?.message || "Could not remove event."); } finally { setRemovingId(null); } };
  const activeEvents = upcomingEvents;
  const renderEvent = (event) => <article key={event.id}><Link to={`/admin/events/${event.id}`}><span>{event.visibility}{event.branch ? ` · ${event.branch}` : ""}</span><h2>{event.title}</h2><p>{new Date(event.eventDateTime).toLocaleString()} · {event.venue}</p></Link>{event.canManage && <div className="event-actions">{tab === "upcoming" && <Link to={`/admin/events/${event.id}`}>Edit</Link>}<button type="button" disabled={removingId === event.id} onClick={() => cancel(event.id, tab === "history")}>{removingId === event.id ? "Removing…" : tab === "history" ? "Remove from history" : "Cancel event"}</button></div>}</article>;
  const displayedEvents = tab === "upcoming" ? activeEvents : eventHistory;
  return <main className="events-page"><header><Link to="/admin/dashboard">← Back to Dashboard</Link><Link className="event-create" to="/admin/events/create">Create event</Link><h1>Event Management</h1><p>Create and manage branch or college-wide events.</p></header>{error && <p className="event-error" role="alert">{error}</p>}<section className="event-management-section" aria-busy={loading}><div className="event-tabs" role="tablist" aria-label="Event lists"><button type="button" role="tab" aria-selected={tab === "upcoming"} className={tab === "upcoming" ? "active" : ""} onClick={() => setTab("upcoming")}>Upcoming Events <span>{activeEvents.length}</span></button><button type="button" role="tab" aria-selected={tab === "history"} className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>Event History <span>{eventHistory.length}</span></button></div><div className="event-list">{loading ? <p className="event-empty-state">Loading events…</p> : displayedEvents.length ? displayedEvents.map(renderEvent) : <p className="event-empty-state">{tab === "upcoming" ? "No upcoming events." : "No event history yet."}</p>}</div></section></main>;
}
