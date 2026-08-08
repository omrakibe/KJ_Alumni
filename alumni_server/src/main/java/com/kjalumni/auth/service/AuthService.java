package com.kjalumni.auth.service;

import com.kjalumni.alumni.repository.AlumniRepository;
import com.kjalumni.auth.dto.*;
import com.kjalumni.auth.entity.PasswordResetRequest;
import com.kjalumni.auth.entity.PendingRegistration;
import com.kjalumni.auth.entity.User;
import com.kjalumni.auth.jwt.JwtService;
import com.kjalumni.auth.repository.PasswordResetRequestRepository;
import com.kjalumni.auth.repository.PendingRegistrationRepository;
import com.kjalumni.auth.repository.UserRepository;
import com.kjalumni.common.exception.InvalidRequestException;
import com.kjalumni.common.exception.ResourceAlreadyExistsException;
import com.kjalumni.common.exception.ResourceNotFoundException;
import com.kjalumni.common.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService
{

    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final UserRepository userRepository;
    private final AlumniRepository alumniRepository;
    private final PasswordEncoder passwordEncoder;
    private final IEmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordResetRequestRepository
            passwordResetRequestRepository;

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

        String otp = String.format("%06d", new SecureRandom().nextInt(1_000_000));

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
                .emailOtp(otp)
                .otpExpiry(LocalDateTime.now().plusMinutes(10))
                .build();

        emailService.sendOtpEmail(
                pendingRegistration.getEmail(),
                pendingRegistration.getFirstName(),
                otp
        );

        pendingRegistrationRepository.save(pendingRegistration);

    }

    @Transactional
    @Override
    public void verifyOtp(VerifyOtpRequest request)
    {

        PendingRegistration pendingRegistration = pendingRegistrationRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Registration request not found.")
                );

        if (pendingRegistration.isEmailVerified())
        {
            throw new InvalidRequestException("Email is already verified.");
        }

        if (pendingRegistration.getOtpExpiry().isBefore(LocalDateTime.now()))
        {
            throw new InvalidRequestException("OTP has expired.");
        }

        if (!pendingRegistration.getEmailOtp().equals(request.getOtp()))
        {
            throw new InvalidRequestException("Invalid OTP.");
        }

        pendingRegistration.setEmailVerified(true);
        pendingRegistration.setEmailVerifiedAt(LocalDateTime.now());

        pendingRegistrationRepository.save(pendingRegistration);
    }

    @Override
    @Transactional
    public void resendOtp(ResendOtpRequest request)
    {

        PendingRegistration pendingRegistration =
                pendingRegistrationRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Registration request not found."
                                )
                        );

        if (pendingRegistration.isEmailVerified())
        {
            throw new InvalidRequestException(
                    "Email is already verified."
            );
        }

        String otp = String.format(
                "%06d",
                new SecureRandom().nextInt(1_000_000)
        );

        pendingRegistration.setEmailOtp(otp);
        pendingRegistration.setOtpExpiry(
                LocalDateTime.now().plusMinutes(10)
        );

        pendingRegistrationRepository.save(pendingRegistration);

        emailService.sendOtpEmail(
                pendingRegistration.getEmail(),
                pendingRegistration.getFirstName(),
                otp
        );
    }

    @Override
    public AuthResponse login(LoginRequest request)
    {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        User user = (User) authentication.getPrincipal();

        Map<String, Object> claims = new HashMap<>();

        claims.put("role", user.getRole().name());

        String token = jwtService.generateToken(
                claims,
                user
        );

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .build();
    }

    @Override
    @Transactional
    public ForgotPasswordResponse forgotPassword(
            ForgotPasswordRequest request)
    {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        /*
         * Do not reveal whether the email
         * exists in the system.
         */
        if (user == null)
        {
            return ForgotPasswordResponse.builder()
                    .build();
        }

        /*
         * Remove previous reset request.
         */
        passwordResetRequestRepository
                .deleteByUserId(user.getId());

        /*
         * Generate 6-digit OTP.
         */
        String otp = String.format(
                "%06d",
                new SecureRandom().nextInt(1_000_000)
        );

        PasswordResetRequest resetRequest =
                PasswordResetRequest.builder()
                        .user(user)
                        .otp(otp)
                        .otpExpiry(
                                LocalDateTime.now()
                                        .plusMinutes(10)
                        )
                        .build();

        passwordResetRequestRepository.save(
                resetRequest
        );

        emailService.sendPasswordResetOtpEmail(
                user.getEmail(),
                otp
        );

        return ForgotPasswordResponse.builder()
                .resetRequestId(resetRequest.getId())
                .build();
    }

    @Override
    @Transactional
    public void resetPassword(
            ResetPasswordRequest request)
    {

        PasswordResetRequest resetRequest =
                passwordResetRequestRepository
                        .findById(request.getResetRequestId())
                        .orElseThrow(() ->
                                new InvalidRequestException(
                                        "Invalid password reset request."
                                ));

        /*
         * Check OTP.
         */
        if (!resetRequest.getOtp()
                .equals(request.getOtp()))
        {

            throw new InvalidRequestException(
                    "Invalid OTP."
            );
        }

        /*
         * Check OTP expiry.
         */
        if (resetRequest.getOtpExpiry()
                .isBefore(LocalDateTime.now()))
        {

            throw new InvalidRequestException(
                    "OTP has expired."
            );
        }

        /*
         * Get user associated with reset request.
         */
        User user = resetRequest.getUser();

        /*
         * Update password.
         */
        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        /*
         * OTP is consumed.
         */
        passwordResetRequestRepository.delete(
                resetRequest
        );
    }
}
