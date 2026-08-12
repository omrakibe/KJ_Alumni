import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/api/auth/login",
    credentials
  );

  return response.data;
};