import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAlumniEventHistory, getAlumniUpcomingEvents } from "../../services/eventService";
import "./AlumniEvents.css";
import "./AlumniEventHistory.css";
import "./AlumniEventTabs.css";

function EventCard({ event }) { return <Link className="alumni-event-card-link" to={`/alumni/events/${event.id}`}><article><div className="alumni-event-date"><CalendarDays size={20} /></div><div><span>{event.visibility === "ALL" ? "College-wide" : `${event.branch} branch`}</span><h2>{event.title}</h2><p>{event.description}</p><small><CalendarDays size={14} /> {new Date(event.eventDateTime).toLocaleString()} <MapPin size={14} /> {event.venue}</small></div></article></Link>; }

export default function AlumniEvents() {
  const [upcoming, setUpcoming] = useState([]); const [history, setHistory] = useState([]); const [error, setError] = useState(""); const [tab, setTab] = useState("upcoming");
  useEffect(() => { Promise.all([getAlumniUpcomingEvents({ page: 0, size: 50 }), getAlumniEventHistory({ page: 0, size: 50 })]).then(([upcomingResponse, historyResponse]) => { setUpcoming(upcomingResponse.data?.data?.content || []); setHistory(historyResponse.data?.data?.content || []); }).catch((requestError) => setError(requestError.response?.data?.message || "Could not load events.")); }, []);
  const displayedEvents = tab === "upcoming" ? upcoming : history;
  return <main className="alumni-events-page"><Link to="/alumni/dashboard" className="alumni-events-back">← Back to Dashboard</Link><header><p>Alumni community</p><h1>Events</h1><span>Upcoming events and the events you attended.</span></header>{error && <div className="alumni-events-error">{error}</div>}<section className="alumni-events-section"><div className="alumni-event-tabs"><button className={tab === "upcoming" ? "active" : ""} onClick={() => setTab("upcoming")}>Upcoming Events <span>{upcoming.length}</span></button><button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>My History <span>{history.length}</span></button></div><div className="alumni-events-list">{displayedEvents.length ? displayedEvents.map((event) => <EventCard key={event.id} event={event} />) : <div className="alumni-events-empty">{tab === "upcoming" ? "No upcoming events are available for you yet." : "Your completed event history will appear here."}</div>}</div></section></main>;
}
