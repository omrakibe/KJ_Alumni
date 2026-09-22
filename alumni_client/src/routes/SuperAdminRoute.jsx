import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RouteLoading, SessionError } from "../component/RouteState";

function SuperAdminRoute({ children }) {
  const { user, isAuthenticated, loadingUser, authError, retryAuth, logout } = useAuth();

  if (loadingUser) {
    return <RouteLoading />;
  }

  if (authError) {
    return <SessionError message={authError} onRetry={retryAuth} onSignOut={logout} />;
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
