package com.kjalumni.announcement.service;

import com.kjalumni.announcement.dto.AnnouncementRequest;
import com.kjalumni.announcement.dto.AnnouncementResponse;
import com.kjalumni.announcement.entity.Announcement;
import com.kjalumni.announcement.repository.AnnouncementRepository;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.*;
import com.kjalumni.common.exception.InvalidRequestException;
import com.kjalumni.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnnouncementService {
    private final AnnouncementRepository repository;
    private final AnnouncementNotificationService notificationService;

    @Transactional
    public AnnouncementResponse create(AnnouncementRequest request, User user) {
        validateAdmin(user);
        Announcement announcement = repository.save(build(request, user, null));
        notificationService.notifyNewAnnouncement(announcement);
        return map(announcement);
    }

    @Transactional(readOnly = true)
    public Page<AnnouncementResponse> adminAnnouncements(User user, Pageable pageable) {
        validateAdmin(user);
        return (user.getBranch() == null ? repository.findAll(pageable) : repository.findCreatedByUserOrSuperAdmin(user, pageable)).map(this::map);
    }

    @Transactional(readOnly = true)
    public AnnouncementResponse adminAnnouncement(UUID id, User user) { return map(findManageable(id, user)); }

    @Transactional
    public AnnouncementResponse update(UUID id, AnnouncementRequest request, User user) {
        Announcement announcement = findManageable(id, user);
        copy(request, announcement, user);
        return map(announcement);
    }

    @Transactional
    public AnnouncementResponse archive(UUID id, User user) {
        Announcement announcement = findManageable(id, user);
        announcement.setStatus(AnnouncementStatus.ARCHIVED);
        return map(announcement);
    }

    @Transactional
    public void removeArchived(UUID id, User user) {
        Announcement announcement = findManageable(id, user);
        if (announcement.getStatus() != AnnouncementStatus.ARCHIVED) throw new InvalidRequestException("Only archived announcements can be removed.");
        repository.delete(announcement);
    }

    @Transactional(readOnly = true)
    public Page<AnnouncementResponse> alumniAnnouncements(User user, Pageable pageable) {
        if (user.getRole() != Role.ALUMNI) throw new AccessDeniedException("Only alumni can view announcements.");
        return repository.findVisibleToBranch(user.getBranch(), AnnouncementStatus.ACTIVE, pageable).map(this::map);
    }

    private Announcement build(AnnouncementRequest request, User user, Announcement existing) {
        Announcement announcement = existing == null ? Announcement.builder().createdBy(user).status(AnnouncementStatus.ACTIVE).build() : existing;
        copy(request, announcement, user);
        return announcement;
    }

    private void copy(AnnouncementRequest request, Announcement announcement, User user) {
        EventVisibility visibility = user.getBranch() == null ? request.getVisibility() : EventVisibility.BRANCH;
        Branch branch = visibility == EventVisibility.ALL ? null : request.getBranch();
        if (user.getBranch() != null) branch = user.getBranch();
        if (visibility == EventVisibility.BRANCH && branch == null) throw new InvalidRequestException("Branch is required for a branch announcement.");
        announcement.setTitle(request.getTitle().trim());
        announcement.setMessage(request.getMessage().trim());
        announcement.setVisibility(visibility);
        announcement.setBranch(branch);
        announcement.setPriority(request.getPriority());
    }

    private Announcement findManageable(UUID id, User user) {
        validateAdmin(user);
        Announcement announcement = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Announcement not found."));
        if (user.getBranch() != null && !announcement.getCreatedBy().getId().equals(user.getId())) throw new AccessDeniedException("You are not authorized to manage this announcement.");
        return announcement;
    }

    private void validateAdmin(User user) {
        if (user.getRole() != Role.ADMIN) throw new AccessDeniedException("Only admins can manage announcements.");
    }

    private AnnouncementResponse map(Announcement announcement) {
        return AnnouncementResponse.builder().id(announcement.getId()).title(announcement.getTitle()).message(announcement.getMessage()).visibility(announcement.getVisibility()).branch(announcement.getBranch()).priority(announcement.getPriority()).status(announcement.getStatus()).createdAt(announcement.getCreatedAt()).createdBy(announcement.getCreatedBy().getId()).createdByEmail(announcement.getCreatedBy().getEmail()).build();
    }
}
