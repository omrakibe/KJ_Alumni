package com.kjalumni.auth.service;

import com.kjalumni.auth.dto.AuthResponse;
import com.kjalumni.auth.dto.LoginRequest;
import com.kjalumni.auth.dto.RegisterRequest;

public interface IAuthService
{
    void register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void verifyEmail(String token);
}
