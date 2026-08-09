package com.kjalumni.admin.service;

import com.kjalumni.auth.dto.PendingRegistrationResponse;

import java.util.List;
import java.util.UUID;

public interface IAdminService
{

    List<PendingRegistrationResponse> getVerifiedRegistrations();

    void approveRegistration(UUID registrationId);

    void rejectRegistration(UUID registrationId, String reason);
}