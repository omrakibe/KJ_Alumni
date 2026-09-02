package com.kjalumni.admin.controller;

import com.kjalumni.admin.dto.AdminDashboardResponse;
import com.kjalumni.admin.dto.AlumniListResponse;
import com.kjalumni.admin.dto.AlumniDetailResponse;
import com.kjalumni.admin.dto.AlumniStatusUpdateRequest;
import com.kjalumni.admin.dto.AlumniUpdateRequest;
import com.kjalumni.admin.dto.AdminListResponse;
import com.kjalumni.admin.dto.CreateAdminRequest;
import com.kjalumni.admin.dto.RejectRegistrationRequest;
import com.kjalumni.auth.dto.PendingRegistrationResponse;
import com.kjalumni.admin.service.IAdminService;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.UserStatus;
import com.kjalumni.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController
{

    private final IAdminService adminService;

    @GetMapping("/dashboard")
    public ApiResponse<AdminDashboardResponse> getDashboard(
            @AuthenticationPrincipal User currentUser
    )
    {
        AdminDashboardResponse dashboard =
                adminService.getDashboard(currentUser);

        return ApiResponse.<AdminDashboardResponse>builder()
                .success(true)
                .message("Dashboard data fetched successfully.")
                .data(dashboard)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<List<PendingRegistrationResponse>>>
    getVerifiedRegistrations(@AuthenticationPrincipal User currentUser)
    {

        List<PendingRegistrationResponse> registrations =
                adminService.getVerifiedRegistrations(currentUser);

        return ResponseEntity.ok(
                ApiResponse.<List<PendingRegistrationResponse>>builder()
                        .success(true)
                        .message("Registrations fetched successfully.")
                        .data(registrations)
                        .build()
        );
    }

    @PostMapping("/registrations/{id}/approve")
    public ResponseEntity<ApiResponse<Void>> approveRegistration(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser)
    {

        adminService.approveRegistration(id, currentUser);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Registration approved successfully.")
                        .data(null)
                        .build()
        );
    }

    @PostMapping("/registrations/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectRegistration(
            @PathVariable UUID id,
            @Valid @RequestBody RejectRegistrationRequest request,
            @AuthenticationPrincipal User currentUser)
    {

        adminService.rejectRegistration(
                id,
                request.getReason(), currentUser
        );

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Registration rejected successfully.")
                        .data(null)
                        .build()
        );
    }

    @PostMapping("/admins")
    public ApiResponse<Void> createAdmin(
            @Valid @RequestBody CreateAdminRequest request,
            @AuthenticationPrincipal User currentUser
    )
    {

        adminService.createAdmin(
                request,
                currentUser
        );

        return ApiResponse.<Void>builder()
                .success(true)
                .message("Admin created successfully.")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/admins")
    public ApiResponse<List<AdminListResponse>> getAllAdmins(
            @AuthenticationPrincipal User currentUser
    )
    {

        List<AdminListResponse> admins =
                adminService.getAllAdmins(currentUser);

        return ApiResponse.<List<AdminListResponse>>builder()
                .success(true)
                .message("Admins fetched successfully.")
                .data(admins)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @DeleteMapping("/admins/{adminId}")
    public ApiResponse<Void> deleteAdmin(
            @PathVariable UUID adminId,
            @AuthenticationPrincipal User currentUser
    )
    {

        adminService.deleteAdmin(
                adminId,
                currentUser
        );

        return ApiResponse.<Void>builder()
                .success(true)
                .message("Admin deleted successfully.")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    //Alumni Management
    @GetMapping("/alumni")
    public ApiResponse<Page<AlumniListResponse>> getAllAlumni(

            @AuthenticationPrincipal User currentUser,

            @RequestParam(required = false)
            String search,

            @RequestParam(required = false)
            Branch branch,

            @RequestParam(required = false)
            Integer passoutYear,

            @RequestParam(required = false)
            UserStatus status,

            @PageableDefault(
                    size = 10,
                    sort = "firstName"
            )
            Pageable pageable
    )
    {
        Page<AlumniListResponse> alumni =
                adminService.getAllAlumni(
                        currentUser,
                        search,
                        branch,
                        passoutYear,
                        status,
                        pageable
                );

        return ApiResponse.<Page<AlumniListResponse>>builder()
                .success(true)
                .message("Alumni fetched successfully.")
                .data(alumni)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/alumni/{alumniId}")
    public ApiResponse<AlumniDetailResponse> getAlumni(
            @PathVariable UUID alumniId,
            @AuthenticationPrincipal User currentUser)
    {
        return response("Alumni fetched successfully.", adminService.getAlumni(alumniId, currentUser));
    }

    @PutMapping("/alumni/{alumniId}")
    public ApiResponse<AlumniDetailResponse> updateAlumni(
            @PathVariable UUID alumniId,
            @Valid @RequestBody AlumniUpdateRequest request,
            @AuthenticationPrincipal User currentUser)
    {
        return response("Alumni updated successfully.", adminService.updateAlumni(alumniId, request, currentUser));
    }

    @PatchMapping("/alumni/{alumniId}/status")
    public ApiResponse<AlumniDetailResponse> updateAlumniStatus(
            @PathVariable UUID alumniId,
            @Valid @RequestBody AlumniStatusUpdateRequest request,
            @AuthenticationPrincipal User currentUser)
    {
        return response("Alumni status updated successfully.", adminService.updateAlumniStatus(alumniId, request, currentUser));
    }

    private <T> ApiResponse<T> response(String message, T data)
    {
        return ApiResponse.<T>builder().success(true).message(message).data(data)
                .timestamp(LocalDateTime.now()).build();
    }
}
