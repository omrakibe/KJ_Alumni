import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Home from "../pages/public/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import AlumniDashboard from "../pages/alumni/AlumniDashboard";
import AlumniProfile from "../pages/alumni/AlumniProfile";
import AlumniEvents from "../pages/alumni/AlumniEvents";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AlumniManagement from "../pages/admin/AlumniManagement";
import Registrations from "../pages/admin/Registrations/Registrations";
import AdminManagement from "../pages/admin/AdminManagement";
import Events from "../pages/admin/event/Events";
import CreateEvent from "../pages/admin/event/CreateEvent";
import EventDetail from "../pages/admin/event/EventDetail";
import AlumniEventDetail from "../pages/alumni/AlumniEventDetail";
import ProtectedRoute from "./ProtectedRoute";
import SuperAdminRoute from "./SuperAdminRoute";
import AdminLayout from "../component/Admin/AdminLayout";
import AlumniLayout from "../component/Alumni/AlumniLayout";


function AppRoutes() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = pathname.includes("/events") ? "KJCOEMR Connect — Events" : pathname.startsWith("/admin") ? "KJCOEMR Connect — Admin Console" : pathname.startsWith("/alumni") ? "KJCOEMR Connect — Alumni Portal" : "KJCOEMR Connect";
  }, [pathname]);
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
        element={<ProtectedRoute allowedRole="ALUMNI"><AlumniLayout><AlumniDashboard /></AlumniLayout></ProtectedRoute>}
      />

      <Route path="/alumni/profile" element={<ProtectedRoute allowedRole="ALUMNI"><AlumniLayout><AlumniProfile /></AlumniLayout></ProtectedRoute>} />
      <Route path="/alumni/events" element={<ProtectedRoute allowedRole="ALUMNI"><AlumniLayout><AlumniEvents /></AlumniLayout></ProtectedRoute>} />
      <Route path="/alumni/events/:id" element={<ProtectedRoute allowedRole="ALUMNI"><AlumniLayout><AlumniEventDetail /></AlumniLayout></ProtectedRoute>} />


      {/* =========================
          ADMIN
      ========================== */}

      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute allowedRole="ADMIN"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>}
      />

      <Route
        path="/admin/alumni"
        element={<ProtectedRoute allowedRole="ADMIN"><AdminLayout><AlumniManagement /></AdminLayout></ProtectedRoute>}
      />

      <Route path="/admin/registrations" element={<ProtectedRoute allowedRole="ADMIN"><AdminLayout><Registrations /></AdminLayout></ProtectedRoute>} />

      <Route path="/admin/admins" element={<SuperAdminRoute><AdminLayout><AdminManagement /></AdminLayout></SuperAdminRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute allowedRole="ADMIN"><AdminLayout><Events /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/events/create" element={<ProtectedRoute allowedRole="ADMIN"><AdminLayout><CreateEvent /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/events/:id" element={<ProtectedRoute allowedRole="ADMIN"><AdminLayout><EventDetail /></AdminLayout></ProtectedRoute>} />

    </Routes>
  );
}


export default AppRoutes;
