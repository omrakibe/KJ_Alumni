package com.kjalumni.admin.controller;

import com.kjalumni.admin.dto.AdminDashboardResponse;
import com.kjalumni.admin.dto.CreateAdminRequest;
import com.kjalumni.admin.dto.RejectRegistrationRequest;
import com.kjalumni.auth.dto.PendingRegistrationResponse;
import com.kjalumni.admin.service.IAdminService;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    getVerifiedRegistrations()
    {

        List<PendingRegistrationResponse> registrations =
                adminService.getVerifiedRegistrations();

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
            @PathVariable UUID id)
    {

        adminService.approveRegistration(id);

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
            @Valid @RequestBody RejectRegistrationRequest request)
    {

        adminService.rejectRegistration(
                id,
                request.getReason()
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
    public ApiResponse<List<User>> getAllAdmins(
            @AuthenticationPrincipal User currentUser
    )
    {

        List<User> admins =
                adminService.getAllAdmins(currentUser);

        return ApiResponse.<List<User>>builder()
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
}