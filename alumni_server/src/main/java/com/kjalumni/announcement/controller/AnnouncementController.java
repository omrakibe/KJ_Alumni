package com.kjalumni.announcement.controller;

import com.kjalumni.announcement.dto.AnnouncementRequest;
import com.kjalumni.announcement.dto.AnnouncementResponse;
import com.kjalumni.announcement.service.AnnouncementService;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AnnouncementController {
    private final AnnouncementService service;

    @PostMapping("/api/admin/announcements")
    public ApiResponse<AnnouncementResponse> create(@Valid @RequestBody AnnouncementRequest request, @AuthenticationPrincipal User user) { return ok("Announcement published successfully.", service.create(request, user)); }
    @GetMapping("/api/admin/announcements")
    public ApiResponse<Page<AnnouncementResponse>> adminAnnouncements(@AuthenticationPrincipal User user, @PageableDefault(size = 30, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) { return ok("Announcements fetched successfully.", service.adminAnnouncements(user, pageable)); }
    @GetMapping("/api/admin/announcements/{id}")
    public ApiResponse<AnnouncementResponse> adminAnnouncement(@PathVariable UUID id, @AuthenticationPrincipal User user) { return ok("Announcement fetched successfully.", service.adminAnnouncement(id, user)); }
    @PutMapping("/api/admin/announcements/{id}")
    public ApiResponse<AnnouncementResponse> update(@PathVariable UUID id, @Valid @RequestBody AnnouncementRequest request, @AuthenticationPrincipal User user) { return ok("Announcement updated successfully.", service.update(id, request, user)); }
    @PatchMapping("/api/admin/announcements/{id}/archive")
    public ApiResponse<AnnouncementResponse> archive(@PathVariable UUID id, @AuthenticationPrincipal User user) { return ok("Announcement moved to archive.", service.archive(id, user)); }
    @DeleteMapping("/api/admin/announcements/{id}")
    public ApiResponse<Void> removeArchived(@PathVariable UUID id, @AuthenticationPrincipal User user) { service.removeArchived(id, user); return ok("Archived announcement removed permanently.", null); }
    @GetMapping("/api/alumni/announcements")
    public ApiResponse<Page<AnnouncementResponse>> alumniAnnouncements(@AuthenticationPrincipal User user, @PageableDefault(size = 30, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) { return ok("Announcements fetched successfully.", service.alumniAnnouncements(user, pageable)); }
    private <T> ApiResponse<T> ok(String message, T data) { return ApiResponse.<T>builder().success(true).message(message).data(data).build(); }
}
