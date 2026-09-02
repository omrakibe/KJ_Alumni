package com.kjalumni.admin.service;

import com.kjalumni.admin.dto.AdminDashboardResponse;
import com.kjalumni.admin.dto.AlumniListResponse;
import com.kjalumni.admin.dto.AlumniDetailResponse;
import com.kjalumni.admin.dto.AlumniStatusUpdateRequest;
import com.kjalumni.admin.dto.AlumniUpdateRequest;
import com.kjalumni.admin.dto.AdminListResponse;
import com.kjalumni.admin.dto.CreateAdminRequest;
import com.kjalumni.admin.specification.AlumniSpecification;
import com.kjalumni.alumni.entity.Alumni;
import com.kjalumni.auth.dto.PendingRegistrationResponse;
import com.kjalumni.auth.entity.PendingRegistration;
import com.kjalumni.auth.entity.User;
import com.kjalumni.auth.repository.PendingRegistrationRepository;
import com.kjalumni.auth.repository.UserRepository;
import com.kjalumni.alumni.repository.AlumniRepository;
import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.Role;
import com.kjalumni.common.enums.UserStatus;
import com.kjalumni.common.exception.InvalidRequestException;
import com.kjalumni.common.exception.ResourceAlreadyExistsException;
import com.kjalumni.common.exception.ResourceNotFoundException;
import com.kjalumni.common.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Optional;
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
    public List<PendingRegistrationResponse> getVerifiedRegistrations(User currentUser)
    {
        validateAdmin(currentUser);
        List<PendingRegistration> registrations = currentUser.getBranch() == null
                ? pendingRegistrationRepository.findByEmailVerifiedTrue()
                : pendingRegistrationRepository.findByEmailVerifiedTrueAndBranch(currentUser.getBranch());

        return registrations
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void approveRegistration(UUID registrationId, User currentUser)
    {

        PendingRegistration pendingRegistration =
                pendingRegistrationRepository
                        .findById(registrationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Registration not found."
                                ));

        validateRegistrationAccess(pendingRegistration, currentUser);

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

        String alumniId = generateAlumniId(
                pendingRegistration.getBranch(),
                pendingRegistration.getPassoutYear()
        );

        Alumni alumni = Alumni.builder()
                .alumniId(alumniId)
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
            String reason,
            User currentUser)
    {

        PendingRegistration pendingRegistration =
                pendingRegistrationRepository
                        .findById(registrationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Registration not found."
                                ));

        validateRegistrationAccess(pendingRegistration, currentUser);

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
    public List<AdminListResponse> getAllAdmins(User currentUser)
    {

        validateSuperAdmin(currentUser);

        return userRepository.findAllByRole(Role.ADMIN).stream()
                .map(admin -> AdminListResponse.builder()
                        .id(admin.getId())
                        .email(admin.getEmail())
                        .branch(admin.getBranch())
                        .status(admin.getStatus())
                        .build())
                .toList();
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
        long branchAlumni;
        long branchPendingRegistrations;
        Long totalAdmins = null;
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
            branchAlumni = totalAlumni;
            branchPendingRegistrations = pendingRegistrations;
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
            branchAlumni = totalAlumni;
            branchPendingRegistrations = pendingRegistrations;
        }


        return AdminDashboardResponse.builder()
                .totalAlumni(totalAlumni)
                .activeAlumni(activeAlumni)
                .suspendedAlumni(suspendedAlumni)
                .pendingRegistrations(pendingRegistrations)
                .totalAdmins(totalAdmins)
                .activeAdmins(activeAdmins)
                .branchAlumni(branchAlumni)
                .branchPendingRegistrations(branchPendingRegistrations)
                .alumniByBranch(isSuperAdmin ? mapBranchCounts() : Map.of(currentUser.getBranch().name(), totalAlumni))
                .alumniByPassoutYear(mapPassoutYearCounts(currentUser))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AlumniListResponse> getAllAlumni(
            User currentUser,
            String search,
            Branch branch,
            Integer passoutYear,
            UserStatus status,
            Pageable pageable
    )
    {
        validateAdmin(currentUser);

        Specification<Alumni> specification =
                Specification.allOf(
                        AlumniSpecification.search(search),
                        AlumniSpecification.hasPassoutYear(passoutYear),
                        AlumniSpecification.hasStatus(status)
                );

        /*
         * Super Admin
         * → can optionally filter by any branch.
         *
         * Branch Admin
         * → branch is ALWAYS forced to their own branch.
         */
        if (currentUser.getBranch() != null)
        {
            specification =
                    specification.and(
                            AlumniSpecification.hasBranch(
                                    currentUser.getBranch()
                            )
                    );
        } else
        {
            specification =
                    specification.and(
                            AlumniSpecification.hasBranch(branch)
                    );
        }

        return alumniRepository
                .findAll(specification, pageable)
                .map(this::mapToAlumniListResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AlumniDetailResponse getAlumni(UUID alumniId, User currentUser)
    {
        return mapToAlumniDetailResponse(findAuthorizedAlumni(alumniId, currentUser));
    }

    @Override
    @Transactional
    public AlumniDetailResponse updateAlumni(UUID alumniId, AlumniUpdateRequest request, User currentUser)
    {
        Alumni alumni = findAuthorizedAlumni(alumniId, currentUser);
        if (currentUser.getBranch() != null && request.getBranch() != currentUser.getBranch())
        {
            throw new AccessDeniedException("Branch admins cannot move alumni to another branch.");
        }
        if (!alumni.getContactNumber().equals(request.getContactNumber())
                && alumniRepository.existsByContactNumber(request.getContactNumber()))
        {
            throw new ResourceAlreadyExistsException("Contact number is already registered.");
        }
        alumni.setFirstName(request.getFirstName());
        alumni.setMiddleName(request.getMiddleName());
        alumni.setLastName(request.getLastName());
        alumni.setBranch(request.getBranch());
        alumni.setPassoutYear(request.getPassoutYear());
        alumni.getUser().setBranch(request.getBranch());
        alumni.setContactNumber(request.getContactNumber());
        alumni.setCompany(request.getCompany());
        alumni.setJobRole(request.getJobRole());
        alumni.setCurrentPackage(request.getCurrentPackage());
        alumni.setExperience(request.getExperience());
        return mapToAlumniDetailResponse(alumniRepository.save(alumni));
    }

    @Override
    @Transactional
    public AlumniDetailResponse updateAlumniStatus(UUID alumniId, AlumniStatusUpdateRequest request, User currentUser)
    {
        if (request.getStatus() != UserStatus.ACTIVE && request.getStatus() != UserStatus.SUSPENDED)
        {
            throw new InvalidRequestException("Alumni status must be ACTIVE or SUSPENDED.");
        }
        Alumni alumni = findAuthorizedAlumni(alumniId, currentUser);
        alumni.getUser().setStatus(request.getStatus());
        return mapToAlumniDetailResponse(alumni);
    }

    private String generateAlumniId(
            Branch branch,
            Integer passoutYear
    )
    {

        Optional<Alumni> latestAlumni =
                alumniRepository
                        .findTopByBranchAndPassoutYearOrderByAlumniIdDesc(
                                branch,
                                passoutYear
                        );

        int nextSequence = 1;

        if (latestAlumni.isPresent())
        {

            String latestId = latestAlumni
                    .get()
                    .getAlumniId();

            String[] parts = latestId.split("_");

            int lastSequence =
                    Integer.parseInt(parts[3]);

            nextSequence = lastSequence + 1;
        }

        return String.format(
                "KJ_%s_%d_%03d",
                branch.name(),
                passoutYear,
                nextSequence
        );
    }

    private AlumniListResponse mapToAlumniListResponse(
            Alumni alumni
    )
    {
        User user = alumni.getUser();

        return AlumniListResponse.builder()
                .id(alumni.getId())
                .alumniId(alumni.getAlumniId())
                .userId(user.getId())
                .firstName(alumni.getFirstName())
                .middleName(alumni.getMiddleName())
                .lastName(alumni.getLastName())
                .email(user.getEmail())
                .contactNumber(alumni.getContactNumber())
                .branch(alumni.getBranch())
                .passoutYear(alumni.getPassoutYear())
                .company(alumni.getCompany())
                .jobRole(alumni.getJobRole())
                .status(user.getStatus())
                .build();
    }

    private AlumniDetailResponse mapToAlumniDetailResponse(Alumni alumni)
    {
        User user = alumni.getUser();
        return AlumniDetailResponse.builder()
                .id(alumni.getId()).alumniId(alumni.getAlumniId())
                .firstName(alumni.getFirstName()).middleName(alumni.getMiddleName())
                .lastName(alumni.getLastName()).email(user.getEmail())
                .contactNumber(alumni.getContactNumber()).dob(alumni.getDob())
                .branch(alumni.getBranch()).passoutYear(alumni.getPassoutYear())
                .company(alumni.getCompany()).jobRole(alumni.getJobRole())
                .currentPackage(alumni.getCurrentPackage()).experience(alumni.getExperience())
                .status(user.getStatus()).build();
    }

    private Alumni findAuthorizedAlumni(UUID alumniId, User currentUser)
    {
        validateAdmin(currentUser);
        Optional<Alumni> alumni = currentUser.getBranch() == null
                ? alumniRepository.findById(alumniId)
                : alumniRepository.findByIdAndUser_Branch(alumniId, currentUser.getBranch());
        return alumni.orElseThrow(() -> new ResourceNotFoundException("Alumni not found."));
    }

    private void validateRegistrationAccess(PendingRegistration registration, User currentUser)
    {
        validateAdmin(currentUser);
        if (currentUser.getBranch() != null && registration.getBranch() != currentUser.getBranch())
        {
            throw new AccessDeniedException("You are not authorized to manage registrations from this branch.");
        }
    }

    private Map<String, Long> mapBranchCounts()
    {
        Map<String, Long> counts = new LinkedHashMap<>();
        alumniRepository.countGroupedByBranch().forEach(row -> counts.put(((Branch) row[0]).name(), (Long) row[1]));
        return counts;
    }

    private Map<Integer, Long> mapPassoutYearCounts(User currentUser)
    {
        Map<Integer, Long> counts = new LinkedHashMap<>();
        if (currentUser.getBranch() == null)
        {
            alumniRepository.countGroupedByPassoutYear()
                    .forEach(row -> counts.put((Integer) row[0], (Long) row[1]));
        }
        else
        {
            alumniRepository.countGroupedByBranchAndPassoutYear(currentUser.getBranch())
                    .forEach(row -> counts.put((Integer) row[0], (Long) row[1]));
        }
        return counts;
    }

    private void validateAdmin(User currentUser)
    {
        if (currentUser.getRole() != Role.ADMIN)
        {
            throw new AccessDeniedException(
                    "Only admins can perform this action."
            );
        }
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
