import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import SuperAdminRoute from "./SuperAdminRoute";

import Home from "../pages/public/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AlumniDashboard from "../pages/alumni/AlumniDashboard";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminManagement from "../pages/admin/AdminManagement";

import Registrations from "../pages/admin/registrations/Registrations";


function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          PUBLIC
      ========================= */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* =========================
          AUTHENTICATION
      ========================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =========================
          ALUMNI
      ========================= */}

      <Route
        path="/alumni/dashboard"
        element={
          <ProtectedRoute allowedRole="ALUMNI">
            <AlumniDashboard />
          </ProtectedRoute>
        }
      />


      {/* =========================
          ADMIN DASHBOARD
      ========================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* =========================
          ADMIN REGISTRATIONS
          Super Admin + Branch Admin
      ========================= */}

      {/* <Route
        path="/admin/registrations"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <Registrations />
          </ProtectedRoute>
        }
      /> */}

      <Route
  path="/admin/registrations"
  element={<Registrations />}
/>


      {/* =========================
          ADMIN MANAGEMENT
          SUPER ADMIN ONLY
      ========================= */}

      <Route
        path="/admin/admins"
        element={
          <SuperAdminRoute>
            <AdminManagement />
          </SuperAdminRoute>
        }
      />

    </Routes>
  );
}


export default AppRoutes;