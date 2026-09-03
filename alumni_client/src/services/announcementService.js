import api from "./api";

export const getAdminAnnouncements = (params) => api.get("/api/admin/announcements", { params });
export const createAnnouncement = (data) => api.post("/api/admin/announcements", data);
export const updateAnnouncement = (id, data) => api.put(`/api/admin/announcements/${id}`, data);
export const archiveAnnouncement = (id) => api.patch(`/api/admin/announcements/${id}/archive`);
export const removeArchivedAnnouncement = (id) => api.delete(`/api/admin/announcements/${id}`);
export const getAlumniAnnouncements = (params) => api.get("/api/alumni/announcements", { params });
