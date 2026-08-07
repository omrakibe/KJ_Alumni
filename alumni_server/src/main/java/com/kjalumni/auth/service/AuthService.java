package com.kjalumni.auth.service;

import com.kjalumni.alumni.repository.AlumniRepository;
import com.kjalumni.auth.dto.AuthResponse;
import com.kjalumni.auth.dto.LoginRequest;
import com.kjalumni.auth.dto.RegisterRequest;
import com.kjalumni.auth.entity.PendingRegistration;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.Role;
import com.kjalumni.common.enums.UserStatus;
import com.kjalumni.auth.repository.PendingRegistrationRepository;
import com.kjalumni.auth.repository.UserRepository;
import com.kjalumni.auth.service.IAuthService;
import com.kjalumni.common.exception.InvalidRequestException;
import com.kjalumni.common.exception.ResourceAlreadyExistsException;
import com.kjalumni.common.exception.ResourceNotFoundException;
import com.kjalumni.common.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService
{

    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final UserRepository userRepository;
    private final AlumniRepository alumniRepository;
    private final PasswordEncoder passwordEncoder;
    private final IEmailService emailService;

    @Override
    @Transactional
    public void register(RegisterRequest request)
    {

        // Check if email already exists in users
        if (userRepository.existsByEmail(request.getEmail()))
        {
            throw new ResourceAlreadyExistsException("Email is already registered.");
        }

        // Check if email already has a pending registration
        if (pendingRegistrationRepository.existsByEmail(request.getEmail()))
        {
            throw new ResourceAlreadyExistsException(
                    "A registration request is already pending for this email."
            );
        }

        // Check if contact number already exists
        if (alumniRepository.existsByContactNumber(request.getContactNumber()))
        {
            throw new ResourceAlreadyExistsException(
                    "Contact number is already registered."
            );
        }

        // Check if contact number already has a pending registration
        if (pendingRegistrationRepository.existsByContactNumber(request.getContactNumber()))
        {
            throw new ResourceAlreadyExistsException(
                    "A registration request is already pending for this contact number."
            );
        }

        // Generate verification token
        String verificationToken = UUID.randomUUID().toString();

        PendingRegistration pendingRegistration = PendingRegistration.builder()
                .firstName(request.getFirstName())
                .middleName(request.getMiddleName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .contactNumber(request.getContactNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .dob(request.getDob())
                .branch(request.getBranch())
                .passoutYear(request.getPassoutYear())
                .company(request.getCompany())
                .jobRole(request.getJobRole())
                .currentPackage(request.getCurrentPackage())
                .experience(request.getExperience())
                .verificationToken(verificationToken)
                .tokenExpiry(LocalDateTime.now().plusHours(24))
                .build();

        pendingRegistrationRepository.save(pendingRegistration);

        emailService.sendVerificationEmail(
                pendingRegistration.getEmail(),
                verificationToken
        );
    }

    @Override
    public AuthResponse login(LoginRequest request)
    {
        throw new UnsupportedOperationException("Login not implemented yet.");
    }

    @Override
    @Transactional
    public void verifyEmail(String token)
    {

        PendingRegistration pendingRegistration =
                pendingRegistrationRepository
                        .findByVerificationToken(token)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Invalid verification token."
                                ));

        if (pendingRegistration.isEmailVerified())
        {
            throw new InvalidRequestException(
                    "Email is already verified."
            );
        }

        if (pendingRegistration.getTokenExpiry().isBefore(LocalDateTime.now()))
        {
            throw new InvalidRequestException(
                    "Verification token has expired."
            );
        }

        pendingRegistration.setEmailVerified(true);
        pendingRegistration.setEmailVerifiedAt(LocalDateTime.now());

        pendingRegistrationRepository.save(pendingRegistration);
    }
}
