import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cancelEvent, downloadEventAttendeesCsv, getAdminEvent, getEventAttendees, sendEventAttendeeUpdate, updateEvent } from "../../../services/eventService";
import "./Event.css";
import "./EventRsvp.css";
import "./EventAttendeeTools.css";

const BRANCHES = ["COMP", "ENTC", "VLSI", "ADV ENTC", "MECH", "CIVIL", "ELECTRICAL"];

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");

  useEffect(() => {
    getAdminEvent(id)
      .then(({ data }) => {
        setEvent(data.data);
        setForm(data.data);
      })
      .catch((e) => setError(e.response?.data?.message || "Could not load this event."));
    getEventAttendees(id, { page: 0, size: 50 }).then(({ data }) => setAttendees(data.data?.content || [])).catch(() => {});
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await updateEvent(id, {
        ...form,
        branch: form.visibility === "BRANCH" ? form.branch : null,
        eventDateTime: form.eventDateTime?.slice(0, 16),
      });
      setEvent(data.data);
      setForm(data.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update this event.");
    }
  };
  const removeFromHistory = async () => { if (!window.confirm("Remove this completed event from history? This permanently deletes it and all RSVP records.")) return; try { await cancelEvent(id); navigate("/admin/events"); } catch (err) { setError(err.response?.data?.message || "Could not remove this event."); } };
  const sendUpdate = async (e) => { e.preventDefault(); if (!message.trim()) return; setSendingMessage(true); setError(""); try { await sendEventAttendeeUpdate(id, message.trim()); setMessage(""); setMessageSuccess("Your update is being emailed to RSVP alumni."); } catch (err) { setError(err.response?.data?.message || "Could not send the attendee update."); } finally { setSendingMessage(false); } };
  const exportCsv = async () => { try { const response = await downloadEventAttendeesCsv(id); const url = URL.createObjectURL(new Blob([response.data], { type: "text/csv" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${event.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-attendees.csv`; anchor.click(); URL.revokeObjectURL(url); } catch (err) { setError(err.response?.data?.message || "Could not export attendees."); } };

  if (!event) return <main className="event-detail-page">{error || "Loading event…"}</main>;

  return (
    <main className="event-detail-page">
      <Link className="event-detail-back" to="/admin/events">← Back to Event Management</Link>
      {error && <p className="event-error">{error}</p>}

      {!editing ? (
        <section className="event-detail-card">
          <div className="event-detail-topline">
            <span className={`event-status event-status-${event.status?.toLowerCase()}`}>{event.status}</span>
            <span className="event-detail-host">Created by {event.createdByName || "Admin"}</span>
          </div>
          <h1>{event.title}</h1>
          <p className="event-detail-description">{event.description}</p>
          <div className="event-detail-meta">
            <div><small>Date & time</small><strong>{new Date(event.eventDateTime).toLocaleString()}</strong></div>
            <div><small>Venue</small><strong>{event.venue}</strong></div>
          </div>
          <div className="event-detail-attendees"><div className="event-attendee-heading"><div><small>RSVPs</small><strong>{event.attendeeCount} {event.attendeeCount === 1 ? "alumnus plans" : "alumni plan"} to attend</strong></div></div>{attendees.length ? <div className="event-attendee-list">{attendees.map((attendee) => <div key={attendee.alumniId}><span>{attendee.name}</span><small>{attendee.branch} · {attendee.passoutYear} · RSVP {new Date(attendee.rsvpedAt).toLocaleDateString()}</small></div>)}</div> : <p>No RSVP responses yet.</p>}</div>
          <div className="event-attendee-tools"><button className="event-export-button" onClick={exportCsv}>Download RSVP CSV</button>{event.status === "ACTIVE" && <form onSubmit={sendUpdate}><label>Message RSVP alumni<textarea value={message} maxLength="3000" placeholder="Share a venue update, timing change, or event instructions…" onChange={(e) => setMessage(e.target.value)} /></label><div><small>{message.length}/3000</small><button disabled={!message.trim() || sendingMessage}>{sendingMessage ? "Sending…" : "Send update to RSVP alumni"}</button></div>{messageSuccess && <p>{messageSuccess}</p>}</form>}</div>
          {event.status === "COMPLETED" ? <button className="event-detail-edit event-detail-remove" onClick={removeFromHistory}>Remove from history</button> : <button className="event-detail-edit" onClick={() => setEditing(true)}>Edit event</button>}
        </section>
      ) : (
        <form className="event-form event-detail-form" onSubmit={save}>
          <div className="event-detail-form-heading"><h1>Edit event</h1><p>Update the details visible to attendees.</p></div>
          <label>Event title<input required value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Description<textarea required value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <div className="event-detail-form-grid">
            <label>Venue<input required value={form.venue || ""} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></label>
            <label>Date & time<input required type="datetime-local" value={form.eventDateTime?.slice(0, 16) || ""} onChange={(e) => setForm({ ...form, eventDateTime: e.target.value })} /></label>
          </div>
          <label>Audience<select value={form.visibility || "ALL"} onChange={(e) => setForm({ ...form, visibility: e.target.value, branch: e.target.value === "ALL" ? null : form.branch })}><option value="ALL">College-wide alumni</option><option value="BRANCH">Specific branch</option></select></label>
          {form.visibility === "BRANCH" && <label>Branch<select required value={form.branch || ""} onChange={(e) => setForm({ ...form, branch: e.target.value })}><option value="">Select branch</option>{BRANCHES.map((branch) => <option key={branch} value={branch}>{branch}</option>)}</select></label>}
          <div className="event-detail-actions"><button type="button" className="event-detail-cancel" onClick={() => { setForm(event); setEditing(false); }}>Cancel</button><button>Save changes</button></div>
        </form>
      )}
    </main>
  );
}
