import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RouteLoading, SessionError } from "../component/RouteState";

function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, loadingUser, authError, retryAuth, logout } = useAuth();
  const location = useLocation();

  if (loadingUser) {
    return <RouteLoading />;
  }

  if (authError) {
    return <SessionError message={authError} onRetry={retryAuth} onSignOut={logout} />;
  }

  // User is not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // User doesn't have permission
  if (allowedRole && user?.role !== allowedRole) {
    const destination = user?.role === "ADMIN" ? "/admin/dashboard" : user?.role === "ALUMNI" ? "/alumni/dashboard" : "/";
    return <Navigate to={destination} replace />;
  }

  return children;
}

export default ProtectedRoute;
