import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AlumniDashboard from "../pages/alumni/AlumniDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminManagement from "../pages/admin/AdminManagement";
import SuperAdminRoute from "./SuperAdminRoute";
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin/admins"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminManagement />
          </ProtectedRoute>
        }
      />

      {/* Alumni */}
      <Route path="/alumni/dashboard" element={<AlumniDashboard />} />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
