import { CalendarDays, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlumniEvent, rsvpToEvent, withdrawEventRsvp } from "../../services/eventService";
import "./AlumniEvents.css";
import "./AlumniRsvp.css";

export default function AlumniEventDetail() {
  const { id } = useParams(); const [event, setEvent] = useState(null); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { getAlumniEvent(id).then(({ data }) => setEvent(data.data)).catch((e) => setError(e.response?.data?.message || "Could not load this event.")); }, [id]);
  const toggleRsvp = async () => { if (!event) return; setSaving(true); setError(""); try { const response = event.rsvped ? await withdrawEventRsvp(id) : await rsvpToEvent(id); setEvent(response.data.data); } catch (e) { setError(e.response?.data?.message || "Could not update your RSVP."); } finally { setSaving(false); } };
  return <main className="alumni-event-detail-page"><Link className="alumni-events-back" to="/alumni/events">← Back to Events</Link>{error && <p className="alumni-events-error">{error}</p>}{!event && !error ? <p>Loading event…</p> : event && <section className="alumni-event-detail-card"><p className="alumni-event-detail-kicker">Alumni community event</p><h1>{event.title}</h1><p className="alumni-event-detail-description">{event.description}</p><div className="alumni-event-detail-meta"><div><CalendarDays size={18} /><span><small>Date & time</small>{new Date(event.eventDateTime).toLocaleString()}</span></div><div><MapPin size={18} /><span><small>Venue</small>{event.venue}</span></div></div><div className="alumni-rsvp-panel"><div><span><strong>{event.rsvped ? "Your RSVP is confirmed" : "Interested in attending?"}</strong><small>Your RSVP is shared only with the event administrators.</small></span></div><button disabled={saving} className={event.rsvped ? "alumni-rsvp-active" : ""} onClick={toggleRsvp}>{saving ? "Saving…" : event.rsvped ? "Going · Cancel RSVP" : "I'm interested · RSVP"}</button></div></section>}</main>;
}
