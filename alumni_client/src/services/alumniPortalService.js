import api from "./api";

export const getAlumniDashboard = async () => {
  const response = await api.get("/api/alumni/dashboard");
  return response.data;
};

export const getAlumniProfile = async () => {
  const response = await api.get("/api/alumni/profile");
  return response.data;
};

export const updateAlumniProfile = async (data) => {
  const response = await api.put("/api/alumni/profile", data);
  return response.data;
};
