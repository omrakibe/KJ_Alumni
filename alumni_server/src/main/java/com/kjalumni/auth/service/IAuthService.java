package com.kjalumni.auth.service;

import com.kjalumni.auth.dto.*;
import com.kjalumni.auth.entity.User;

public interface IAuthService
{
    void register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void verifyOtp(VerifyOtpRequest request);

    void resendOtp(ResendOtpRequest request);

//    void verifyEmail(String token);

    ForgotPasswordResponse forgotPassword(
            ForgotPasswordRequest request
    );

    void resetPassword(
            ResetPasswordRequest request
    );

    UserProfileResponse getCurrentUser(User user);
}
