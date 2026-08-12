import api from "./api";

// ========================================
// GET VERIFIED REGISTRATIONS
// ========================================

export const getRegistrations = async () => {
  const response = await api.get(
    "/api/admin/registrations"
  );

  return response.data;
};


// ========================================
// APPROVE REGISTRATION
// ========================================

export const approveRegistration = async (
  registrationId
) => {
  const response = await api.post(
    `/api/admin/registrations/${registrationId}/approve`
  );

  return response.data;
};


// ========================================
// REJECT REGISTRATION
// ========================================

export const rejectRegistration = async (
  registrationId,
  reason
) => {
  const response = await api.post(
    `/api/admin/registrations/${registrationId}/reject`,
    {
      reason,
    }
  );

  return response.data;
};