import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import AlumniDashboard from "../pages/alumni/AlumniDashboard";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AlumniManagement from "../pages/admin/AlumniManagement";
import Registrations from "../pages/admin/Registrations/Registrations";
import AdminManagement from "../pages/admin/AdminManagement";
import ProtectedRoute from "./ProtectedRoute";
import SuperAdminRoute from "./SuperAdminRoute";


function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          PUBLIC
      ========================== */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* =========================
          AUTHENTICATION
      ========================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* =========================
          ALUMNI
      ========================== */}

      <Route
        path="/alumni/dashboard"
        element={<AlumniDashboard />}
      />


      {/* =========================
          ADMIN
      ========================== */}

      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>}
      />

      <Route
        path="/admin/alumni"
        element={<ProtectedRoute allowedRole="ADMIN"><AlumniManagement /></ProtectedRoute>}
      />

      <Route path="/admin/registrations" element={<ProtectedRoute allowedRole="ADMIN"><Registrations /></ProtectedRoute>} />

      <Route path="/admin/admins" element={<SuperAdminRoute><AdminManagement /></SuperAdminRoute>} />

    </Routes>
  );
}


export default AppRoutes;
