package com.kjalumni.common.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService
{

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void sendOtpEmail(
            String email,
            String firstName,
            String otp)
    {

        Context context = new Context();

        context.setVariable("firstName", firstName);
        context.setVariable("otp", otp);

        String htmlContent =
                templateEngine.process(
                        "email/otp",
                        context
                );

        sendEmail(
                email,
                "Verify your KJ Alumni Portal email",
                htmlContent
        );
    }

    @Override
    public void sendApprovalEmail(
            String email,
            String firstName)
    {

        Context context = new Context();

        context.setVariable("firstName", firstName);
        context.setVariable(
                "loginUrl",
                frontendUrl + "/login"
        );

        String htmlContent =
                templateEngine.process(
                        "email/approval",
                        context
                );

        sendEmail(
                email,
                "Welcome to the KJ Alumni Community!",
                htmlContent
        );
    }

    @Override
    public void sendRejectionEmail(
            String email,
            String firstName,
            String reason)
    {

        Context context = new Context();

        context.setVariable("firstName", firstName);
        context.setVariable("reason", reason);

        String htmlContent =
                templateEngine.process(
                        "email/rejection",
                        context
                );

        sendEmail(
                email,
                "Update regarding your KJ Alumni Portal registration",
                htmlContent
        );
    }

    @Override
    public void sendPasswordResetOtpEmail(
            String email,
            String otp)
    {

        Context context = new Context();

        context.setVariable("otp", otp);

        String htmlContent =
                templateEngine.process(
                        "email/password-reset-otp",
                        context
                );

        sendEmail(
                email,
                "Reset your KJ Alumni Portal password",
                htmlContent
        );
    }

    private void sendEmail(
            String to,
            String subject,
            String htmlContent)
    {

        try
        {

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true,
                            "UTF-8"
                    );

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(
                    htmlContent,
                    true
            );

            mailSender.send(message);

        } catch (Exception e)
        {

            throw new RuntimeException(
                    "Failed to send email.",
                    e
            );
        }
    }
}