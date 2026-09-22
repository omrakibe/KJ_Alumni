/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext();

function readStoredToken() {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
}

function userFromToken(token) {
  if (!token) return null;
  try {
    const claims = jwtDecode(token);
    return { email: claims.sub, role: claims.role || claims.roles?.[0] || null };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStoredToken);
  const [user, setUser] = useState(() => userFromToken(readStoredToken()));
  const [loadingUser, setLoadingUser] = useState(() => Boolean(readStoredToken()));
  const [authError, setAuthError] = useState("");
  const [restoreVersion, setRestoreVersion] = useState(0);

  useEffect(() => {
    if (!token) return;

    let active = true;
    api.get("/api/auth/me")
      .then((response) => {
        if (active) setUser(response.data?.data || null);
      })
      .catch((error) => {
        if (!active) return;
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          try { localStorage.removeItem("authToken"); } catch { /* no-op */ }
          setToken(null);
          setUser(null);
          setAuthError("");
        } else {
          setAuthError("We could not restore your session because the server is unavailable.");
        }
      })
      .finally(() => {
        if (active) setLoadingUser(false);
      });

    return () => { active = false; };
  }, [token, restoreVersion]);

  useEffect(() => {
    const handleExpiredSession = () => {
      setToken(null);
      setUser(null);
      setLoadingUser(false);
      setAuthError("");
    };
    window.addEventListener("kjcoemr:session-expired", handleExpiredSession);
    return () => window.removeEventListener("kjcoemr:session-expired", handleExpiredSession);
  }, []);

  const login = (receivedToken, userData) => {
    try { localStorage.setItem("authToken", receivedToken); } catch { /* no-op */ }

    setToken(receivedToken);
    setUser(userData || userFromToken(receivedToken));
    setLoadingUser(true);
    setAuthError("");
  };

  const logout = () => {
    try { localStorage.removeItem("authToken"); } catch { /* no-op */ }

    setToken(null);
    setUser(null);
    setLoadingUser(false);
    setAuthError("");
  };

  const retryAuth = () => {
    setLoadingUser(true);
    setAuthError("");
    setRestoreVersion((value) => value + 1);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loadingUser,
    authError,
    login,
    logout,
    retryAuth,
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
