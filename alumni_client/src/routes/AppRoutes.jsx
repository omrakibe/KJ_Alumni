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
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/alumni"
        element={<AlumniManagement />}
      />

    </Routes>
  );
}


export default AppRoutes;