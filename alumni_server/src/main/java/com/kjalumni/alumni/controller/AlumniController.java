package com.kjalumni.alumni.controller;

import com.kjalumni.alumni.dto.AlumniDashboardResponse;
import com.kjalumni.alumni.dto.AlumniProfileResponse;
import com.kjalumni.alumni.dto.AlumniProfileUpdateRequest;
import com.kjalumni.alumni.service.IAlumniService;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/alumni")
@RequiredArgsConstructor
public class AlumniController {
    private final IAlumniService alumniService;

    @GetMapping("/dashboard")
    public ApiResponse<AlumniDashboardResponse> getDashboard(@AuthenticationPrincipal User currentUser) {
        return ApiResponse.<AlumniDashboardResponse>builder().success(true)
                .message("Alumni dashboard fetched successfully.")
                .data(alumniService.getDashboard(currentUser)).build();
    }

    @GetMapping("/profile")
    public ApiResponse<AlumniProfileResponse> getProfile(@AuthenticationPrincipal User currentUser) {
        return ApiResponse.<AlumniProfileResponse>builder().success(true)
                .message("Alumni profile fetched successfully.")
                .data(alumniService.getProfile(currentUser)).build();
    }

    @PutMapping("/profile")
    public ApiResponse<AlumniProfileResponse> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody AlumniProfileUpdateRequest request) {
        return ApiResponse.<AlumniProfileResponse>builder().success(true)
                .message("Alumni profile updated successfully.")
                .data(alumniService.updateProfile(currentUser, request)).build();
    }
}
