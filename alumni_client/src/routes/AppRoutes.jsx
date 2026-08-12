import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import AlumniDashboard from "../pages/alumni/AlumniDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Alumni */}
      <Route
        path="/alumni/dashboard"
        element={<AlumniDashboard />}
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

    </Routes>
  );
}

export default AppRoutes;