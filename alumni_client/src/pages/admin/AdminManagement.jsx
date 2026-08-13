import { useEffect, useState } from "react";
import {
  createBranchAdmin,
  getAllAdmins,
  deleteAdmin,
} from "../../services/adminService";

import "./AdminManagement.css";

function AdminManagement() {
  const [admins, setAdmins] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    branch: "",
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // GET ALL ADMINS
  // =========================

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllAdmins();

      console.log("ADMINS RESPONSE:", response);

      if (response.success) {
        setAdmins(response.data || []);
      } else {
        setError(
          response.message || "Failed to load admins."
        );
      }
    } catch (error) {
      console.error("GET ADMINS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load administrators."
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // LOAD ADMINS ON PAGE LOAD
  // =========================

  useEffect(() => {
    loadAdmins();
  }, []);


  // =========================
  // HANDLE FORM INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =========================
  // CREATE BRANCH ADMIN
  // =========================

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setCreating(true);

    try {
      const response = await createBranchAdmin({
        email: formData.email.trim(),
        password: formData.password,
        branch: formData.branch,
      });

      console.log(
        "CREATE ADMIN RESPONSE:",
        response
      );

      if (response.success) {
        setSuccess(
          "Branch Admin created successfully."
        );

        // Clear form
        setFormData({
          email: "",
          password: "",
          branch: "",
        });

        // Refresh admin list
        await loadAdmins();
      } else {
        setError(
          response.message ||
            "Failed to create Branch Admin."
        );
      }
    } catch (error) {
      console.error(
        "CREATE ADMIN ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create Branch Admin."
      );
    } finally {
      setCreating(false);
    }
  };


  // =========================
  // DELETE ADMIN
  // =========================

  const handleDeleteAdmin = async (
    adminId,
    email
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${email}?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(adminId);

    try {
      const response = await deleteAdmin(adminId);

      console.log(
        "DELETE ADMIN RESPONSE:",
        response
      );

      if (response.success) {
        setSuccess(
          "Admin deleted successfully."
        );

        await loadAdmins();
      } else {
        setError(
          response.message ||
            "Failed to delete admin."
        );
      }
    } catch (error) {
      console.error(
        "DELETE ADMIN ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete admin."
      );
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="admin-management-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <div>
          <h1>Admin Management</h1>

          <p>
            Create and manage branch administrators.
          </p>
        </div>

      </div>


      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}


      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =========================
          CREATE BRANCH ADMIN
      ========================= */}

      <div className="admin-management-card">

        <div className="card-title">

          <h2>
            Create Branch Admin
          </h2>

          <p>
            Create an administrator for a specific
            department.
          </p>

        </div>


        <form
          className="create-admin-form"
          onSubmit={handleCreateAdmin}
        >

          {/* Email */}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="compadmin@kjei.edu.in"
              required
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              minLength={8}
              required
            />

          </div>


          {/* Branch */}

          <div className="form-group">

            <label htmlFor="branch">
              Branch
            </label>

            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Branch
              </option>

              <option value="COMP">
                Computer Engineering
              </option>

              <option value="IT">
                Information Technology
              </option>

              <option value="ENTC">
                Electronics & Telecommunication
              </option>

              <option value="MECH">
                Mechanical Engineering
              </option>

              <option value="CIVIL">
                Civil Engineering
              </option>

            </select>

          </div>


          {/* Submit */}

          <button
            type="submit"
            className="create-admin-button"
            disabled={creating}
          >

            {creating
              ? "Creating..."
              : "Create Branch Admin"}

          </button>

        </form>

      </div>


      {/* =========================
          ADMIN LIST
      ========================= */}

      <div className="admin-management-card">

        <div className="card-title">

          <h2>
            All Administrators
          </h2>

          <p>
            View all active administrators and
            their assigned branches.
          </p>

        </div>


        {/* Loading */}

        {loading && (
          <div className="loading-state">
            Loading administrators...
          </div>
        )}


        {/* Empty */}

        {!loading && admins.length === 0 && (
          <div className="empty-state">
            No administrators found.
          </div>
        )}


        {/* Admin List */}

        {!loading && admins.length > 0 && (

          <div className="admin-list">

            {admins.map((admin) => {

              const isSuperAdmin =
                admin.branch === null ||
                admin.branch === undefined;

              return (
                <div
                  className="admin-item"
                  key={admin.id}
                >

                  {/* Admin Information */}

                  <div className="admin-info">

                    <div className="admin-avatar">
                      {admin.email
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>


                    <div>

                      <strong>
                        {admin.email}
                      </strong>

                      <div className="admin-details">

                        <span>
                          Role: {admin.role}
                        </span>

                        <span>
                          Branch:{" "}
                          {isSuperAdmin
                            ? "Super Admin"
                            : admin.branch}
                        </span>

                        <span>
                          Status: {admin.status}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Action */}

                  <div className="admin-actions">

                    {/* 
                      Never show delete for
                      Super Admin
                    */}

                    {!isSuperAdmin && (

                      <button
                        type="button"
                        className="delete-admin-button"
                        disabled={
                          deletingId === admin.id
                        }
                        onClick={() =>
                          handleDeleteAdmin(
                            admin.id,
                            admin.email
                          )
                        }
                      >

                        {deletingId === admin.id
                          ? "Deleting..."
                          : "Delete"}

                      </button>

                    )}

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminManagement;