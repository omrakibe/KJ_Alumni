import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { createEvent } from "../../../services/eventService";
import "./Event.css";

const branches = ["COMP", "ENTC", "VLSI", "ADVENTC", "MECH", "CIVIL", "ELECTRICAL"];

function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "ADMIN" && user?.branch === null;
  const [form, setForm] = useState({ title: "", description: "", eventDateTime: "", venue: "", visibility: "BRANCH", branch: isSuperAdmin ? "" : user?.branch || "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await createEvent({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        venue: form.venue.trim(),
        branch: form.visibility === "ALL" ? null : form.branch,
      });
      navigate("/admin/events");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not create event.");
    } finally {
      setSaving(false);
    }
  };
  return <main className="events-page"><header><button type="button" onClick={() => navigate("/admin/events")}>← Back</button><h1>Create Event</h1><p>Choose whether every alumnus or only one branch can see this event.</p></header>{error && <p className="event-error" role="alert">{error}</p>}<form className="event-form" onSubmit={submit}><label>Event title<input required maxLength="180" placeholder="e.g. Annual Alumni Meet" value={form.title} onChange={(event) => change("title", event.target.value)} disabled={saving} /></label><label>Venue<input required maxLength="255" placeholder="e.g. Seminar Hall" value={form.venue} onChange={(event) => change("venue", event.target.value)} disabled={saving} /></label><label>Event description<textarea required maxLength="5000" placeholder="Describe the event for alumni" value={form.description} onChange={(event) => change("description", event.target.value)} disabled={saving} /></label><label>Date &amp; time<input required type="datetime-local" value={form.eventDateTime} onChange={(event) => change("eventDateTime", event.target.value)} disabled={saving} /></label><label>Event visibility<select value={form.visibility} onChange={(event) => change("visibility", event.target.value)} disabled={saving}><option value="BRANCH">Branch event</option><option value="ALL">College-wide event</option></select></label>{form.visibility === "BRANCH" && (isSuperAdmin ? <label>Target branch<select required value={form.branch} onChange={(event) => change("branch", event.target.value)} disabled={saving}><option value="">Select branch</option>{branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}</select></label> : <label>Target branch<input value={user?.branch || ""} disabled /><small>Branch events created by you are limited to your assigned branch.</small></label>)}<button type="submit" disabled={saving}>{saving ? "Creating event…" : "Create event"}</button></form></main>;
}
export default CreateEvent;
