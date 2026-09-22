package com.kjalumni.job.controller;

import com.kjalumni.auth.entity.User;
import com.kjalumni.common.response.ApiResponse;
import com.kjalumni.job.dto.*;
import com.kjalumni.job.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class JobController {
    private final JobService service;

    @PostMapping("/api/alumni/jobs")
    public ApiResponse<JobResponse> create(@Valid @RequestBody JobRequest request, @AuthenticationPrincipal User user) {
        return ok("Job published successfully.", service.create(request, user));
    }

    @GetMapping("/api/alumni/jobs")
    public ApiResponse<Page<JobResponse>> alumniJobs(@RequestParam(defaultValue = "") String search,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal User user) {
        return ok("Jobs fetched successfully.", service.alumniJobs(user, search, pageable));
    }

    @GetMapping("/api/alumni/jobs/my-jobs")
    public ApiResponse<Page<JobResponse>> myJobs(@RequestParam(defaultValue = "") String search,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal User user) {
        return ok("Your jobs fetched successfully.", service.myJobs(user, search, pageable));
    }

    @GetMapping("/api/alumni/jobs/{id}")
    public ApiResponse<JobResponse> alumniJob(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        return ok("Job fetched successfully.", service.alumniJob(id, user));
    }

    @PutMapping("/api/alumni/jobs/{id}")
    public ApiResponse<JobResponse> update(@PathVariable UUID id, @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal User user) {
        return ok("Job updated successfully.", service.updateOwnJob(id, request, user));
    }

    @DeleteMapping("/api/alumni/jobs/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        service.deleteOwnJob(id, user);
        return ok("Job removed successfully.", null);
    }

    @GetMapping("/api/admin/jobs")
    public ApiResponse<Page<JobResponse>> adminJobs(@RequestParam(defaultValue = "") String search,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal User user) {
        return ok("Jobs fetched successfully.", service.adminJobs(user, search, pageable));
    }

    @GetMapping("/api/admin/jobs/{id}")
    public ApiResponse<JobResponse> adminJob(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        return ok("Job fetched successfully.", service.adminJob(id, user));
    }

    private <T> ApiResponse<T> ok(String message, T data) {
        return ApiResponse.<T>builder().success(true).message(message).data(data).build();
    }
}
