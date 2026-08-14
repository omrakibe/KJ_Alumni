package com.kjalumni.admin.service;

import com.kjalumni.admin.dto.AdminDashboardResponse;
import com.kjalumni.admin.dto.CreateAdminRequest;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;

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
                .branch(pendingRegistration.getBranch())
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

    @Override
    public void createAdmin(CreateAdminRequest request, User currentUser)
    {
        if (currentUser.getRole() != Role.ADMIN
                || currentUser.getBranch() != null)
        {

            throw new AccessDeniedException(
                    "Only Super Admin can create new admins."
            );
        }

        if (userRepository.existsByEmail(request.getEmail()))
        {

            throw new ResourceAlreadyExistsException(
                    "Email is already registered."
            );
        }

        User admin = User.builder()
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(Role.ADMIN)
                .branch(request.getBranch())
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(admin);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllAdmins(User currentUser)
    {

        validateSuperAdmin(currentUser);

        return userRepository.findAllByRole(Role.ADMIN);
    }

    @Override
    @Transactional
    public void deleteAdmin(
            UUID adminId,
            User currentUser
    )
    {

        validateSuperAdmin(currentUser);

        User admin = userRepository.findById(adminId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Admin not found."
                        )
                );

        if (admin.getRole() != Role.ADMIN)
        {
            throw new InvalidRequestException(
                    "The selected user is not an admin."
            );
        }

        // Prevent Super Admin from deleting themselves
        if (admin.getId().equals(currentUser.getId()))
        {
            throw new InvalidRequestException(
                    "Super Admin cannot delete themselves."
            );
        }

        userRepository.delete(admin);
    }

    private void validateSuperAdmin(User currentUser)
    {

        if (currentUser.getRole() != Role.ADMIN
                || currentUser.getBranch() != null)
        {

            throw new AccessDeniedException(
                    "Only Super Admin can perform this action."
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard(User currentUser)
    {
        boolean isSuperAdmin =
                currentUser.getRole() == Role.ADMIN
                        && currentUser.getBranch() == null;

        boolean isBranchAdmin =
                currentUser.getRole() == Role.ADMIN
                        && currentUser.getBranch() != null;

        if (!isSuperAdmin && !isBranchAdmin)
        {
            throw new AccessDeniedException(
                    "Only admins can access the dashboard."
            );
        }

        long totalAlumni;
        long activeAlumni;
        long suspendedAlumni;
        long pendingRegistrations;
        Long totalAdmins=null;
        Long activeAdmins = null;

        if (isSuperAdmin)
        {
            totalAlumni =
                    userRepository.countByRole(Role.ALUMNI);

            activeAlumni =
                    userRepository.countByRoleAndStatus(
                            Role.ALUMNI,
                            UserStatus.ACTIVE
                    );

            suspendedAlumni =
                    userRepository.countByRoleAndStatus(
                            Role.ALUMNI,
                            UserStatus.SUSPENDED
                    );

            pendingRegistrations =
                    pendingRegistrationRepository
                            .countByEmailVerifiedTrue();

            totalAdmins =
                    userRepository.countByRole(Role.ADMIN);

            activeAdmins =
                    userRepository.countByRoleAndStatus(
                            Role.ADMIN,
                            UserStatus.ACTIVE
                    );
        } else
        {
            totalAlumni =
                    userRepository.countByRoleAndBranch(
                            Role.ALUMNI,
                            currentUser.getBranch()
                    );

            activeAlumni =
                    userRepository.countByRoleAndBranchAndStatus(
                            Role.ALUMNI,
                            currentUser.getBranch(),
                            UserStatus.ACTIVE
                    );

            suspendedAlumni =
                    userRepository.countByRoleAndBranchAndStatus(
                            Role.ALUMNI,
                            currentUser.getBranch(),
                            UserStatus.SUSPENDED
                    );

            /*
             * Pending registrations already contain branch information,
             * so this needs a branch-specific repository query.
             */
            pendingRegistrations =
                    pendingRegistrationRepository
                            .countByEmailVerifiedTrueAndBranch(
                                    currentUser.getBranch()
                            );
        }



        return AdminDashboardResponse.builder()
                .totalAlumni(totalAlumni)
                .activeAlumni(activeAlumni)
                .suspendedAlumni(suspendedAlumni)
                .pendingRegistrations(pendingRegistrations)
                .totalAdmins(totalAdmins)
                .activeAdmins(activeAdmins)
                .build();
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