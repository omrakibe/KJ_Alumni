package com.kjalumni.common.service;

import com.kjalumni.common.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService
{

    private final JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Override
    public void sendVerificationEmail(String email, String token)
    {

        String verificationLink =
                baseUrl + "/api/auth/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Verify Your Email");

        message.setText("""
                Welcome to KJ Alumni Portal.
                
                Please verify your email by clicking the link below.
                
                %s
                
                This link is valid for 24 hours.
                """.formatted(verificationLink));

        mailSender.send(message);
    }
}
