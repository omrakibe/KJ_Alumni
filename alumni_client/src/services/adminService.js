import api from "./api";

// Create a Branch Admin
export const createBranchAdmin = async (adminData) => {
  const response = await api.post(
    "/api/admin/admins",
    adminData
  );

  return response.data;
};


// Get all Admins
export const getAllAdmins = async () => {
  const response = await api.get(
    "/api/admin/admins"
  );

  return response.data;
};


// Delete an Admin
export const deleteAdmin = async (adminId) => {
  const response = await api.delete(
    `/api/admin/admins/${adminId}`
  );

  return response.data;
};