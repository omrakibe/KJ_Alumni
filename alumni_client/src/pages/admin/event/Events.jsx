import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cancelEvent, getAdminEventHistory, getAdminUpcomingEvents } from "../../../services/eventService";
import "./Event.css";
import "./EventSections.css";
import "./EventHistory.css";
import "./EventTabs.css";
import "./EventConsoleLayout.css";

export default function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState([]); const [eventHistory, setEventHistory] = useState([]); const [error, setError] = useState(""); const [tab, setTab] = useState("upcoming");
  const load = () => Promise.all([getAdminUpcomingEvents({ page: 0, size: 50 }), getAdminEventHistory({ page: 0, size: 50 })]).then(([upcoming, history]) => { setUpcomingEvents(upcoming.data?.data?.content || []); setEventHistory(history.data?.data?.content || []); }).catch((e) => setError(e.response?.data?.message || "Could not load events."));
  useEffect(() => { load(); }, []);
  const cancel = async (id, history = false) => { if (!window.confirm(history ? "Remove this completed event from history? This permanently deletes it and all RSVP records." : "Cancel this event? This will permanently delete it and all RSVP records.")) return; try { await cancelEvent(id); load(); } catch (e) { setError(e.response?.data?.message || "Could not remove event."); } };
  const activeEvents = upcomingEvents;
  const renderEvent = (event) => <article key={event.id}><Link to={`/admin/events/${event.id}`}><span>{event.visibility}{event.branch ? ` · ${event.branch}` : ""}</span><h2>{event.title}</h2><p>{new Date(event.eventDateTime).toLocaleString()} · {event.venue}</p></Link><div className="event-actions">{tab === "upcoming" && <Link to={`/admin/events/${event.id}`}>Edit</Link>}<button onClick={() => cancel(event.id, tab === "history")}>{tab === "history" ? "Remove from history" : "Cancel event"}</button></div></article>;
  const displayedEvents = tab === "upcoming" ? activeEvents : eventHistory;
  return <main className="events-page"><header><Link to="/admin/dashboard">← Back to Dashboard</Link><Link className="event-create" to="/admin/events/create">Create event</Link><h1>Event Management</h1><p>Create and manage branch or college-wide events.</p></header>{error && <p className="event-error">{error}</p>}<section className="event-management-section"><div className="event-tabs"><button className={tab === "upcoming" ? "active" : ""} onClick={() => setTab("upcoming")}>Upcoming Events <span>{activeEvents.length}</span></button><button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>Event History <span>{eventHistory.length}</span></button></div><div className="event-list">{displayedEvents.length ? displayedEvents.map(renderEvent) : <p className="event-empty-state">{tab === "upcoming" ? "No upcoming events." : "No event history yet."}</p>}</div></section></main>;
}
