package com.kjalumni.alumni.service;

import com.kjalumni.alumni.dto.AlumniDashboardResponse;
import com.kjalumni.alumni.dto.AlumniProfileResponse;
import com.kjalumni.alumni.dto.AlumniProfileUpdateRequest;
import com.kjalumni.alumni.entity.Alumni;
import com.kjalumni.alumni.repository.AlumniRepository;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.Role;
import com.kjalumni.common.exception.ResourceAlreadyExistsException;
import com.kjalumni.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AlumniService implements IAlumniService {
    private final AlumniRepository alumniRepository;

    @Override
    @Transactional(readOnly = true)
    public AlumniDashboardResponse getDashboard(User currentUser) {
        return AlumniDashboardResponse.builder().profile(getProfile(currentUser)).build();
    }

    @Override
    @Transactional(readOnly = true)
    public AlumniProfileResponse getProfile(User currentUser) {
        return mapToProfile(findAlumni(currentUser));
    }

    @Override
    @Transactional
    public AlumniProfileResponse updateProfile(User currentUser, AlumniProfileUpdateRequest request) {
        Alumni alumni = findAlumni(currentUser);
        if (!alumni.getContactNumber().equals(request.getContactNumber())
                && alumniRepository.existsByContactNumber(request.getContactNumber())) {
            throw new ResourceAlreadyExistsException("Contact number is already registered.");
        }
        alumni.setContactNumber(request.getContactNumber());
        alumni.setCompany(request.getCompany());
        alumni.setJobRole(request.getJobRole());
        alumni.setCurrentPackage(request.getCurrentPackage());
        alumni.setExperience(request.getExperience());
        return mapToProfile(alumni);
    }

    private Alumni findAlumni(User currentUser) {
        if (currentUser.getRole() != Role.ALUMNI) {
            throw new AccessDeniedException("Only alumni can access alumni features.");
        }
        return alumniRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni profile not found."));
    }

    private AlumniProfileResponse mapToProfile(Alumni alumni) {
        return AlumniProfileResponse.builder()
                .alumniId(alumni.getAlumniId())
                .firstName(alumni.getFirstName())
                .middleName(alumni.getMiddleName())
                .lastName(alumni.getLastName())
                .email(alumni.getUser().getEmail())
                .contactNumber(alumni.getContactNumber())
                .dob(alumni.getDob())
                .branch(alumni.getBranch())
                .passoutYear(alumni.getPassoutYear())
                .company(alumni.getCompany())
                .jobRole(alumni.getJobRole())
                .currentPackage(alumni.getCurrentPackage())
                .experience(alumni.getExperience())
                .build();
    }
}
