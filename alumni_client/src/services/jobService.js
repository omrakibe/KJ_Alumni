import api from "./api";

export const getAlumniJobs = (params) => api.get("/api/alumni/jobs", { params });
export const getMyJobs = (params) => api.get("/api/alumni/jobs/my-jobs", { params });
export const getAlumniJob = (id) => api.get(`/api/alumni/jobs/${id}`);
export const createJob = (data) => api.post("/api/alumni/jobs", data);
export const updateJob = (id, data) => api.put(`/api/alumni/jobs/${id}`, data);
export const deleteOwnJob = (id) => api.delete(`/api/alumni/jobs/${id}`);
export const getAdminJobs = (params) => api.get("/api/admin/jobs", { params });
export const getAdminJob = (id) => api.get(`/api/admin/jobs/${id}`);
