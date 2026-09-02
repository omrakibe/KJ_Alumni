package com.kjalumni.admin.service;

import com.kjalumni.admin.dto.AdminDashboardResponse;
import com.kjalumni.admin.dto.AlumniListResponse;
import com.kjalumni.admin.dto.AlumniDetailResponse;
import com.kjalumni.admin.dto.AlumniStatusUpdateRequest;
import com.kjalumni.admin.dto.AlumniUpdateRequest;
import com.kjalumni.admin.dto.AdminListResponse;
import com.kjalumni.admin.dto.CreateAdminRequest;
import com.kjalumni.auth.dto.PendingRegistrationResponse;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IAdminService
{

    List<PendingRegistrationResponse> getVerifiedRegistrations(User currentUser);

    void approveRegistration(UUID registrationId, User currentUser);

    void rejectRegistration(UUID registrationId, String reason, User currentUser);

    void createAdmin(
            CreateAdminRequest request,
            User currentUser
    );

    List<AdminListResponse> getAllAdmins(User currentUser);

    void deleteAdmin(UUID adminId, User currentUser);

    AdminDashboardResponse getDashboard(User currentUser);

    Page<AlumniListResponse> getAllAlumni(
            User currentUser,
            String search,
            Branch branch,
            Integer passoutYear,
            UserStatus status,
            Pageable pageable
    );

    AlumniDetailResponse getAlumni(UUID alumniId, User currentUser);

    AlumniDetailResponse updateAlumni(UUID alumniId, AlumniUpdateRequest request, User currentUser);

    AlumniDetailResponse updateAlumniStatus(UUID alumniId, AlumniStatusUpdateRequest request, User currentUser);
}
