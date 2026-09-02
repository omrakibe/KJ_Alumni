import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SuperAdminRoute({ children }) {
  const { user, isAuthenticated, loadingUser } = useAuth();

  if (loadingUser) {
    return null;
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Not a Super Admin
  const isSuperAdmin =
    user?.role === "ADMIN" &&
    user?.branch === null;

  if (!isSuperAdmin) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return children;
}

export default SuperAdminRoute;
