package com.kjalumni.event.service;

import com.kjalumni.auth.entity.User;
import com.kjalumni.auth.repository.UserRepository;
import com.kjalumni.common.enums.EventVisibility;
import com.kjalumni.common.enums.Role;
import com.kjalumni.common.enums.UserStatus;
import com.kjalumni.common.service.IEmailService;
import com.kjalumni.event.entity.AlumniEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.List;

@Service @RequiredArgsConstructor @Slf4j
public class EventNotificationService {
    private final UserRepository userRepository;
    private final IEmailService emailService;

    @Async
    public void notifyNewEvent(AlumniEvent event) {
        List<User> recipients = event.getVisibility() == EventVisibility.ALL
                ? userRepository.findAllByRoleAndStatus(Role.ALUMNI, UserStatus.ACTIVE)
                : userRepository.findAllByRoleAndBranchAndStatus(Role.ALUMNI, event.getBranch(), UserStatus.ACTIVE);
        for (User recipient : recipients) {
            try {
                emailService.sendNewEventEmail(recipient.getEmail(), event.getTitle(), event.getDescription(), event.getVenue(), event.getEventDateTime());
            } catch (RuntimeException exception) {
                log.warn("Could not send new-event email for event {} to {}", event.getId(), recipient.getEmail(), exception);
            }
        }
    }

    @Async
    public void notifyEventCancellation(AlumniEvent event, List<String> recipientEmails) {
        for (String email : recipientEmails) {
            try {
                emailService.sendEventCancellationEmail(email, event.getTitle(), event.getVenue(), event.getEventDateTime());
            } catch (RuntimeException exception) {
                log.warn("Could not send cancellation email for event {} to {}", event.getId(), email, exception);
            }
        }
    }

    @Async
    public void notifyEventUpdate(AlumniEvent event, List<String> recipientEmails, String message) {
        for (String email : recipientEmails) {
            try {
                emailService.sendEventUpdateEmail(email, event.getTitle(), message, event.getVenue(), event.getEventDateTime());
            } catch (RuntimeException exception) {
                log.warn("Could not send event update email for event {} to {}", event.getId(), email, exception);
            }
        }
    }
}
