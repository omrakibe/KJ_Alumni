package com.kjalumni.admin.controller;

import com.kjalumni.admin.dto.RejectRegistrationRequest;
import com.kjalumni.auth.dto.PendingRegistrationResponse;
import com.kjalumni.admin.service.IAdminService;
import com.kjalumni.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController
{

    private final IAdminService adminService;

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
}