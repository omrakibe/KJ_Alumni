package com.kjalumni.common.service;

public interface IEmailService
{
    void sendOtpEmail(
            String email,
            String firstName,
            String otp
    );

    void sendApprovalEmail(
            String email,
            String firstName
    );

    void sendRejectionEmail(
            String email,
            String firstName,
            String reason
    );

    void sendPasswordResetOtpEmail(
            String email,
            String otp
    );
}
