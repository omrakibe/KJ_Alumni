package com.kjalumni.common.service;

import java.time.LocalDateTime;

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

    void sendNewEventEmail(String email, String title, String description, String venue, LocalDateTime eventDateTime);

    void sendEventCancellationEmail(String email, String title, String venue, LocalDateTime eventDateTime);

    void sendEventUpdateEmail(String email, String title, String message, String venue, LocalDateTime eventDateTime);

    void sendNewAnnouncementEmail(String email, String title, String message, String priority);
}
