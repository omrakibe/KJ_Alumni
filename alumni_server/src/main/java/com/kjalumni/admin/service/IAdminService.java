package com.kjalumni.admin.service;

import com.kjalumni.admin.dto.AdminDashboardResponse;
import com.kjalumni.admin.dto.CreateAdminRequest;
import com.kjalumni.auth.dto.PendingRegistrationResponse;
import com.kjalumni.auth.entity.User;

import java.util.List;
import java.util.UUID;

public interface IAdminService
{

    List<PendingRegistrationResponse> getVerifiedRegistrations();

    void approveRegistration(UUID registrationId);

    void rejectRegistration(UUID registrationId, String reason);

    void createAdmin(
            CreateAdminRequest request,
            User currentUser
    );

    List<User> getAllAdmins(User currentUser);

    void deleteAdmin(UUID adminId, User currentUser);

    AdminDashboardResponse getDashboard(User currentUser);
}