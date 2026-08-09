package com.kjalumni.admin.service;

import com.kjalumni.alumni.entity.Alumni;
import com.kjalumni.auth.dto.PendingRegistrationResponse;
import com.kjalumni.auth.entity.PendingRegistration;
import com.kjalumni.auth.entity.User;
import com.kjalumni.auth.repository.PendingRegistrationRepository;
import com.kjalumni.auth.repository.UserRepository;
import com.kjalumni.alumni.repository.AlumniRepository;
import com.kjalumni.common.enums.Role;
import com.kjalumni.common.enums.UserStatus;
import com.kjalumni.common.exception.InvalidRequestException;
import com.kjalumni.common.exception.ResourceAlreadyExistsException;
import com.kjalumni.common.exception.ResourceNotFoundException;
import com.kjalumni.common.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService implements IAdminService
{

    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final UserRepository userRepository;
    private final AlumniRepository alumniRepository;
    private final IEmailService emailService;

    @Override
    @Transactional(readOnly = true)
    public List<PendingRegistrationResponse> getVerifiedRegistrations()
    {

        return pendingRegistrationRepository
                .findByEmailVerifiedTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void approveRegistration(UUID registrationId)
    {

        PendingRegistration pendingRegistration =
                pendingRegistrationRepository
                        .findById(registrationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Registration not found."
                                ));

        // Email must be verified before admin approval
        if (!pendingRegistration.isEmailVerified())
        {
            throw new InvalidRequestException(
                    "Email has not been verified yet."
            );
        }

        // Double-check email uniqueness
        if (userRepository.existsByEmail(
                pendingRegistration.getEmail()))
        {

            throw new ResourceAlreadyExistsException(
                    "Email is already registered."
            );
        }

        // Double-check contact uniqueness
        if (alumniRepository.existsByContactNumber(
                pendingRegistration.getContactNumber()))
        {

            throw new ResourceAlreadyExistsException(
                    "Contact number is already registered."
            );
        }

        /*
         * 1. Create User
         */
        User user = User.builder()
                .email(pendingRegistration.getEmail())
                .password(pendingRegistration.getPassword())
                .role(Role.ALUMNI)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);

        /*
         * 2. Create Alumni
         */
        Alumni alumni = Alumni.builder()
                .user(user)
                .firstName(pendingRegistration.getFirstName())
                .middleName(pendingRegistration.getMiddleName())
                .lastName(pendingRegistration.getLastName())
                .contactNumber(pendingRegistration.getContactNumber())
                .dob(pendingRegistration.getDob())
                .branch(pendingRegistration.getBranch())
                .passoutYear(pendingRegistration.getPassoutYear())
                .company(pendingRegistration.getCompany())
                .jobRole(pendingRegistration.getJobRole())
                .currentPackage(pendingRegistration.getCurrentPackage())
                .experience(pendingRegistration.getExperience())
                .build();

        alumniRepository.save(alumni);

        emailService.sendApprovalEmail(
                pendingRegistration.getEmail(),
                pendingRegistration.getFirstName()
        );
        /*
         * 3. Delete pending registration
         */
        pendingRegistrationRepository.delete(
                pendingRegistration
        );
    }

    @Override
    @Transactional
    public void rejectRegistration(
            UUID registrationId,
            String reason)
    {

        PendingRegistration pendingRegistration =
                pendingRegistrationRepository
                        .findById(registrationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Registration not found."
                                ));

        if (!pendingRegistration.isEmailVerified())
        {
            throw new InvalidRequestException(
                    "Email has not been verified yet."
            );
        }

        emailService.sendRejectionEmail(
                pendingRegistration.getEmail(),
                pendingRegistration.getFirstName(),
                reason
        );

        pendingRegistrationRepository.delete(
                pendingRegistration
        );
    }

    private PendingRegistrationResponse mapToResponse(
            PendingRegistration registration)
    {

        return PendingRegistrationResponse.builder()
                .id(registration.getId())
                .firstName(registration.getFirstName())
                .middleName(registration.getMiddleName())
                .lastName(registration.getLastName())
                .email(registration.getEmail())
                .contactNumber(registration.getContactNumber())
                .dob(registration.getDob())
                .branch(registration.getBranch())
                .passoutYear(registration.getPassoutYear())
                .company(registration.getCompany())
                .jobRole(registration.getJobRole())
                .currentPackage(registration.getCurrentPackage())
                .experience(registration.getExperience())
                .emailVerified(registration.isEmailVerified())
                .emailVerifiedAt(registration.getEmailVerifiedAt())
                .build();
    }
}