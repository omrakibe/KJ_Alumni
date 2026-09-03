package com.kjalumni.announcement.service;

import com.kjalumni.announcement.entity.Announcement;
import com.kjalumni.auth.entity.User;
import com.kjalumni.auth.repository.UserRepository;
import com.kjalumni.common.enums.EventVisibility;
import com.kjalumni.common.enums.Role;
import com.kjalumni.common.enums.UserStatus;
import com.kjalumni.common.service.IEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnnouncementNotificationService {
    private final UserRepository userRepository;
    private final IEmailService emailService;

    @Async
    public void notifyNewAnnouncement(Announcement announcement) {
        List<User> recipients = announcement.getVisibility() == EventVisibility.ALL
                ? userRepository.findAllByRoleAndStatus(Role.ALUMNI, UserStatus.ACTIVE)
                : userRepository.findAllByRoleAndBranchAndStatus(Role.ALUMNI, announcement.getBranch(), UserStatus.ACTIVE);
        for (User recipient : recipients) {
            try {
                emailService.sendNewAnnouncementEmail(recipient.getEmail(), announcement.getTitle(), announcement.getMessage(), announcement.getPriority().name());
            } catch (RuntimeException exception) {
                log.warn("Could not send announcement {} to {}", announcement.getId(), recipient.getEmail(), exception);
            }
        }
    }
}
