import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerAlumni = async (data) => {
  const response = await authApi.post("/api/auth/register", data);
  return response.data;
};

export const verifyEmailOtp = async (data) => {
  const response = await authApi.post("/api/auth/verify-otp", data);
  return response.data;
};

export const resendOtp = async (data) => {
  const response = await authApi.post("/api/auth/resend-otp", data);
  return response.data;
};

export const login = async (data) => {
  const response = await authApi.post("/api/auth/login", data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await authApi.post(
    "/api/auth/forgot-password",
    data
  );
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await authApi.post(
    "/api/auth/reset-password",
    data
  );
  return response.data;
};

export default authApi;
