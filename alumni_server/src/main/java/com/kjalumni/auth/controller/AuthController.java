package com.kjalumni.auth.controller;

import com.kjalumni.auth.dto.RegisterRequest;
import com.kjalumni.auth.service.AuthService;
import com.kjalumni.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController
{

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request)
    {

        authService.register(request);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Registration successful. Please verify your email.")
                        .build()
        );
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(
            @RequestParam String token)
    {

        authService.verifyEmail(token);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Email verified successfully. Your account is awaiting admin approval.")
                        .build()
        );
    }
}