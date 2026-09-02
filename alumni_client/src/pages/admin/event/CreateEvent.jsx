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
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      await createEvent({ ...form, branch: form.visibility === "ALL" ? null : form.branch });
      navigate("/admin/events");
    } catch (requestError) { setError(requestError.response?.data?.message || "Could not create event."); }
  };
  return <main className="events-page"><header><button onClick={() => navigate("/admin/events")}>← Back</button><h1>Create Event</h1><p>Choose whether every alumnus or only one branch can see this event.</p></header>{error && <p className="event-error">{error}</p>}<form className="event-form" onSubmit={submit}><input required placeholder="Event title" value={form.title} onChange={(event) => change("title", event.target.value)} /><input required placeholder="Venue" value={form.venue} onChange={(event) => change("venue", event.target.value)} /><textarea required placeholder="Event description" value={form.description} onChange={(event) => change("description", event.target.value)} /><input required type="datetime-local" value={form.eventDateTime} onChange={(event) => change("eventDateTime", event.target.value)} /><label>Event visibility<select value={form.visibility} onChange={(event) => change("visibility", event.target.value)}><option value="BRANCH">Branch event</option><option value="ALL">College-wide event</option></select></label>{form.visibility === "BRANCH" && (isSuperAdmin ? <label>Target branch<select required value={form.branch} onChange={(event) => change("branch", event.target.value)}><option value="">Select branch</option>{branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}</select></label> : <label>Target branch<input value={user?.branch || ""} disabled /><small>Branch events created by you are limited to your assigned branch.</small></label>)}<button>Create event</button></form></main>;
}
export default CreateEvent;
