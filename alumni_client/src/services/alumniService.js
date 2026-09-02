import api from "./api";

export const getAlumni = async (params) => {
  const response = await api.get("/api/admin/alumni", { params });
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await api.get("/api/admin/dashboard");
  return response.data;
};

export const getAlumniById = async (id) => {
  const response = await api.get(`/api/admin/alumni/${id}`);
  return response.data;
};

export const updateAlumni = async (id, data) => {
  const response = await api.put(`/api/admin/alumni/${id}`, data);
  return response.data;
};

export const updateAlumniStatus = async (id, status) => {
  const response = await api.patch(`/api/admin/alumni/${id}/status`, { status });
  return response.data;
};
