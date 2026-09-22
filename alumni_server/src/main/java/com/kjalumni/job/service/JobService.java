package com.kjalumni.job.service;

import com.kjalumni.alumni.entity.Alumni;
import com.kjalumni.alumni.repository.AlumniRepository;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.*;
import com.kjalumni.common.exception.InvalidRequestException;
import com.kjalumni.common.exception.ResourceNotFoundException;
import com.kjalumni.job.dto.JobRequest;
import com.kjalumni.job.dto.JobResponse;
import com.kjalumni.job.entity.JobPosting;
import com.kjalumni.job.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobService {
    private static final ZoneId PROJECT_ZONE = ZoneId.of("Asia/Kolkata");

    private final JobRepository repository;
    private final AlumniRepository alumniRepository;

    @Transactional
    public JobResponse create(JobRequest request, User user) {
        validateAlumni(user);
        Alumni alumni = alumniRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni profile not found."));
        validateAudience(request);
        JobPosting job = JobPosting.builder()
                .createdBy(user)
                .postedByName(fullName(alumni))
                .postedByAlumniId(alumni.getAlumniId())
                .build();
        copy(request, job);
        return map(repository.save(job), user);
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> alumniJobs(User user, String search, Pageable pageable) {
        validateAlumni(user);
        return repository.findVisibleToBranch(user.getBranch(), today(), cleanSearch(search), pageable)
                .map(job -> map(job, user));
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> myJobs(User user, String search, Pageable pageable) {
        validateAlumni(user);
        return repository.findCurrentByOwner(user, today(), cleanSearch(search), pageable)
                .map(job -> map(job, user));
    }

    @Transactional(readOnly = true)
    public JobResponse alumniJob(UUID id, User user) {
        validateAlumni(user);
        JobPosting job = findCurrent(id);
        boolean owner = job.getCreatedBy().getId().equals(user.getId());
        boolean visible = job.getVisibility() == EventVisibility.ALL || job.getTargetBranch() == user.getBranch();
        if (!owner && !visible) throw new AccessDeniedException("You are not authorized to view this job.");
        return map(job, user);
    }

    @Transactional
    public void deleteOwnJob(UUID id, User user) {
        validateAlumni(user);
        JobPosting job = findCurrent(id);
        if (!job.getCreatedBy().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can delete only jobs posted by you.");
        }
        repository.delete(job);
    }

    @Transactional
    public JobResponse updateOwnJob(UUID id, JobRequest request, User user) {
        validateAlumni(user);
        JobPosting job = findCurrent(id);
        if (!job.getCreatedBy().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can update only jobs posted by you.");
        }
        validateAudience(request);
        copy(request, job);
        return map(job, user);
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> adminJobs(User user, String search, Pageable pageable) {
        validateAdmin(user);
        Page<JobPosting> jobs = user.getBranch() == null
                ? repository.findAllCurrent(today(), cleanSearch(search), pageable)
                : repository.findVisibleToBranch(user.getBranch(), today(), cleanSearch(search), pageable);
        return jobs.map(job -> map(job, null));
    }

    @Transactional(readOnly = true)
    public JobResponse adminJob(UUID id, User user) {
        validateAdmin(user);
        JobPosting job = findCurrent(id);
        if (user.getBranch() != null && job.getVisibility() != EventVisibility.ALL && job.getTargetBranch() != user.getBranch()) {
            throw new AccessDeniedException("You are not authorized to view this job.");
        }
        return map(job, null);
    }

    @Scheduled(cron = "0 15 1 * * *", zone = "Asia/Kolkata")
    @Transactional
    public void deleteExpiredJobs() {
        repository.deleteByDeadlineBefore(today());
    }

    private JobPosting findCurrent(UUID id) {
        JobPosting job = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found."));
        if (job.getDeadline().isBefore(today())) throw new ResourceNotFoundException("Job not found or has expired.");
        return job;
    }

    private void validateAudience(JobRequest request) {
        if (request.getVisibility() == EventVisibility.BRANCH && request.getTargetBranch() == null) {
            throw new InvalidRequestException("Target branch is required for a branch job.");
        }
    }

    private void copy(JobRequest request, JobPosting job) {
        job.setTitle(request.getTitle().trim());
        job.setCompanyName(request.getCompanyName().trim());
        job.setDescription(request.getDescription().trim());
        job.setLocation(request.getLocation().trim());
        job.setJobType(request.getJobType());
        job.setExperienceRequired(request.getExperienceRequired().trim());
        job.setApplicationDetails(request.getApplicationDetails().trim());
        job.setDeadline(request.getDeadline());
        job.setVisibility(request.getVisibility());
        job.setTargetBranch(request.getVisibility() == EventVisibility.ALL ? null : request.getTargetBranch());
    }

    private JobResponse map(JobPosting job, User currentUser) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompanyName())
                .description(job.getDescription())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .experienceRequired(job.getExperienceRequired())
                .applicationDetails(job.getApplicationDetails())
                .deadline(job.getDeadline())
                .visibility(job.getVisibility())
                .targetBranch(job.getTargetBranch())
                .createdBy(job.getCreatedBy().getId())
                .postedByName(job.getPostedByName())
                .postedByAlumniId(job.getPostedByAlumniId())
                .postedByEmail(job.getCreatedBy().getEmail())
                .createdAt(job.getCreatedAt())
                .ownedByCurrentUser(currentUser != null && job.getCreatedBy().getId().equals(currentUser.getId()))
                .build();
    }

    private String fullName(Alumni alumni) {
        return String.join(" ", alumni.getFirstName(), alumni.getMiddleName() == null ? "" : alumni.getMiddleName(), alumni.getLastName())
                .replaceAll("\\s+", " ").trim();
    }

    private String cleanSearch(String search) { return search == null ? "" : search.trim(); }
    private LocalDate today() { return LocalDate.now(PROJECT_ZONE); }
    private void validateAlumni(User user) { if (user.getRole() != Role.ALUMNI) throw new AccessDeniedException("Only alumni can use alumni jobs."); }
    private void validateAdmin(User user) { if (user.getRole() != Role.ADMIN) throw new AccessDeniedException("Only admins can view admin jobs."); }
}
