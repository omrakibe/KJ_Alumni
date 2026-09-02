/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(
    () => Boolean(localStorage.getItem("authToken"))
  );

  const [token, setToken] = useState(
    localStorage.getItem("authToken")
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    api.get("/api/auth/me")
      .then((response) => setUser(response.data?.data || null))
      .catch(() => {
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoadingUser(false));
  }, [token]);

  const login = (receivedToken, userData) => {
    localStorage.setItem("authToken", receivedToken);

    setToken(receivedToken);
    setUser(userData);
    setLoadingUser(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");

    setToken(null);
    setUser(null);
    setLoadingUser(false);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loadingUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
