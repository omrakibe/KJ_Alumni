import { CalendarDays, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlumniEvent, rsvpToEvent, withdrawEventRsvp } from "../../services/eventService";
import "./AlumniEvents.css";
import "./AlumniRsvp.css";

export default function AlumniEventDetail() {
  const { id } = useParams(); const [event, setEvent] = useState(null); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { let active = true; getAlumniEvent(id).then(({ data }) => { if (active) setEvent(data.data); }).catch((e) => { if (active) setError(e.response?.data?.message || "Could not load this event."); }); return () => { active = false; }; }, [id]);
  const toggleRsvp = async () => { if (!event) return; setSaving(true); setError(""); try { const response = event.rsvped ? await withdrawEventRsvp(id) : await rsvpToEvent(id); setEvent(response.data.data); } catch (e) { setError(e.response?.data?.message || "Could not update your RSVP."); } finally { setSaving(false); } };
  return <main className="alumni-event-detail-page"><Link className="alumni-events-back" to="/alumni/events">← Back to Events</Link>{error && <p className="alumni-events-error" role="alert">{error}</p>}{!event && !error ? <p role="status">Loading event…</p> : event && <section className="alumni-event-detail-card"><p className="alumni-event-detail-kicker">Alumni community event</p><h1>{event.title}</h1><p className="alumni-event-detail-description">{event.description}</p><div className="alumni-event-detail-meta"><div><CalendarDays size={18} /><span><small>Date &amp; time</small>{new Date(event.eventDateTime).toLocaleString()}</span></div><div><MapPin size={18} /><span><small>Venue</small>{event.venue}</span></div></div><div className="alumni-rsvp-panel"><div><span><strong>{event.status === "COMPLETED" ? "You attended this event" : event.rsvped ? "Your RSVP is confirmed" : "Interested in attending?"}</strong><small>{event.status === "COMPLETED" ? "This event is part of your event history." : "Your RSVP is shared only with the event administrators."}</small></span></div>{event.status === "ACTIVE" && <button type="button" disabled={saving} className={event.rsvped ? "alumni-rsvp-active" : ""} onClick={toggleRsvp}>{saving ? "Saving…" : event.rsvped ? "Going · Cancel RSVP" : "I'm interested · RSVP"}</button>}</div></section>}</main>;
}
