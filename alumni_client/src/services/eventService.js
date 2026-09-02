import api from "./api";

// Keep Axios responses intact: every event screen reads its payload from response.data.
export const getAdminEvents = (params) => api.get("/api/admin/events", { params });
export const getAdminUpcomingEvents = (params) => api.get("/api/admin/events/upcoming", { params });
export const getAdminEventHistory = (params) => api.get("/api/admin/events/history", { params });
export const createEvent = (data) => api.post("/api/admin/events", data);
export const cancelEvent = (id) => api.delete(`/api/admin/events/${id}`);
export const getAlumniEvents = (params) => api.get("/api/alumni/events", { params });
export const getAlumniUpcomingEvents = (params) => api.get("/api/alumni/events/upcoming", { params });
export const getAlumniEventHistory = (params) => api.get("/api/alumni/events/history", { params });
export const getAdminEvent = (id) => api.get(`/api/admin/events/${id}`);
export const updateEvent = (id, data) => api.put(`/api/admin/events/${id}`, data);
export const getAlumniEvent = (id) => api.get(`/api/alumni/events/${id}`);
export const rsvpToEvent = (id) => api.post(`/api/alumni/events/${id}/rsvp`);
export const withdrawEventRsvp = (id) => api.delete(`/api/alumni/events/${id}/rsvp`);
export const getEventAttendees = (id, params) => api.get(`/api/admin/events/${id}/attendees`, { params });
export const sendEventAttendeeUpdate = (id, message) => api.post(`/api/admin/events/${id}/attendees/message`, { message });
export const downloadEventAttendeesCsv = (id) => api.get(`/api/admin/events/${id}/attendees/export`, { responseType: "blob" });
export const getPublicEvents = (params) => api.get("/api/public/events", { params });
