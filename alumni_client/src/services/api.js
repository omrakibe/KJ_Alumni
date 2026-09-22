import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});


// Attach JWT automatically
api.interceptors.request.use(
  (config) => {

    let token = null;
    try { token = localStorage.getItem("authToken"); } catch { /* no-op */ }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try { localStorage.removeItem("authToken"); } catch { /* no-op */ }
      window.dispatchEvent(new Event("kjcoemr:session-expired"));
    }
    return Promise.reject(error);
  }
);


export default api;
