package com.kjalumni.common.service;

public interface IEmailService
{
    void sendVerificationEmail(String email, String token);
}
