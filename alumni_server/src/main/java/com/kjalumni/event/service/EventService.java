package com.kjalumni.event.service;

import com.kjalumni.alumni.entity.Alumni;
import com.kjalumni.alumni.repository.AlumniRepository;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.*;
import com.kjalumni.common.exception.*;
import com.kjalumni.event.dto.*;
import com.kjalumni.event.entity.AlumniEvent;
import com.kjalumni.event.entity.EventRsvp;
import com.kjalumni.event.repository.AlumniEventRepository;
import com.kjalumni.event.repository.EventRsvpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.util.List;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Service @RequiredArgsConstructor
public class EventService {
    private final AlumniEventRepository repository;
    private final EventRsvpRepository rsvpRepository;
    private final AlumniRepository alumniRepository;
    private final EventNotificationService eventNotificationService;

    @Transactional public EventResponse create(EventRequest request, User user) { validateAdmin(user); AlumniEvent event = repository.save(build(request, user, null)); eventNotificationService.notifyNewEvent(event); return map(event, null); }
    @Transactional(readOnly = true) public Page<EventResponse> adminEvents(User user, Pageable pageable) { validateAdmin(user); return (user.getBranch() == null ? repository.findAll(pageable) : repository.findByCreatedByOrderByEventDateTimeAsc(user, pageable)).map(event -> map(event, null)); }
    @Transactional(readOnly = true) public Page<EventResponse> adminUpcomingEvents(User user, Pageable pageable) { validateAdmin(user); LocalDateTime now = LocalDateTime.now(); return (user.getBranch() == null ? repository.findByStatusAndEventDateTimeGreaterThanEqualOrderByEventDateTimeAsc(EventStatus.ACTIVE, now, pageable) : repository.findByCreatedByAndStatusAndEventDateTimeGreaterThanEqualOrderByEventDateTimeAsc(user, EventStatus.ACTIVE, now, pageable)).map(event -> map(event, null)); }
    @Transactional(readOnly = true) public Page<EventResponse> adminEventHistory(User user, Pageable pageable) { validateAdmin(user); LocalDateTime now = LocalDateTime.now(); return (user.getBranch() == null ? repository.findByStatusAndEventDateTimeLessThanOrderByEventDateTimeDesc(EventStatus.COMPLETED, now, pageable) : repository.findByCreatedByAndStatusAndEventDateTimeLessThanOrderByEventDateTimeDesc(user, EventStatus.COMPLETED, now, pageable)).map(event -> map(event, null)); }
    @Transactional public EventResponse update(UUID id, EventRequest request, User user) { AlumniEvent event = findManageable(id, user); copy(request, event, user); return map(event, null); }
    @Transactional public void cancel(UUID id, User user) { AlumniEvent event = findManageable(id, user); List<String> rsvpEmails = rsvpRepository.findByEvent(event).stream().map(rsvp -> rsvp.getAlumniUser().getEmail()).toList(); eventNotificationService.notifyEventCancellation(event, rsvpEmails); repository.delete(event); }
    @Transactional(readOnly = true) public EventResponse adminEvent(UUID id, User user) { return map(findManageable(id, user), null); }

    @Transactional(readOnly = true) public Page<EventResponse> alumniEvents(User user, Pageable pageable) { validateAlumni(user); return repository.findVisibleToBranch(user.getBranch(), EventStatus.ACTIVE, pageable).map(event -> map(event, user)); }
    @Transactional(readOnly = true) public Page<EventResponse> alumniUpcomingEvents(User user, Pageable pageable) { validateAlumni(user); return repository.findUpcomingVisibleToBranch(user.getBranch(), EventStatus.ACTIVE, LocalDateTime.now(), pageable).map(event -> map(event, user)); }
    @Transactional(readOnly = true) public Page<EventResponse> alumniEventHistory(User user, Pageable pageable) { validateAlumni(user); return repository.findPastRsvpedByUser(user, EventStatus.COMPLETED, LocalDateTime.now(), pageable).map(event -> map(event, user)); }
    @Transactional(readOnly = true) public Page<EventResponse> publicEvents(Pageable pageable) { return repository.findByStatusAndVisibilityOrderByEventDateTimeAsc(EventStatus.ACTIVE, EventVisibility.ALL, pageable).map(this::publicMap); }
    @Transactional(readOnly = true) public EventResponse alumniEvent(UUID id, User user) { return map(findAlumniReadableEvent(id, user), user); }
    @Transactional public EventResponse rsvp(UUID id, User user) { AlumniEvent event = findRsvpEligibleEvent(id, user); if (!rsvpRepository.existsByEventAndAlumniUser(event, user)) rsvpRepository.save(EventRsvp.builder().event(event).alumniUser(user).build()); return map(event, user); }
    @Transactional public EventResponse withdrawRsvp(UUID id, User user) { AlumniEvent event = findRsvpEligibleEvent(id, user); rsvpRepository.findByEventAndAlumniUser(event, user).ifPresent(rsvpRepository::delete); return map(event, user); }
    @Transactional(readOnly = true) public Page<EventAttendeeResponse> attendees(UUID id, User user, Pageable pageable) { AlumniEvent event = findManageable(id, user); return rsvpRepository.findByEventOrderByCreatedAtAsc(event, pageable).map(this::attendeeMap); }
    @Transactional public void sendAttendeeUpdate(UUID id, EventAttendeeMessageRequest request, User user) { AlumniEvent event = findManageable(id, user); List<String> emails = rsvpRepository.findByEvent(event).stream().map(rsvp -> rsvp.getAlumniUser().getEmail()).toList(); eventNotificationService.notifyEventUpdate(event, emails, request.getMessage().trim()); }
    @Transactional(readOnly = true) public byte[] attendeeCsv(UUID id, User user) { AlumniEvent event = findManageable(id, user); StringBuilder csv = new StringBuilder("Name,Email,Branch,Pass-out Year,RSVP Date\n"); for (EventRsvp rsvp : rsvpRepository.findByEvent(event)) { Alumni alumni = alumniRepository.findByUser(rsvp.getAlumniUser()).orElseThrow(() -> new ResourceNotFoundException("Alumni profile not found.")); csv.append(csvValue(String.join(" ", alumni.getFirstName(), alumni.getMiddleName() == null ? "" : alumni.getMiddleName(), alumni.getLastName()).replaceAll("\\s+", " ").trim())).append(',').append(csvValue(alumni.getUser().getEmail())).append(',').append(csvValue(alumni.getBranch().name())).append(',').append(alumni.getPassoutYear()).append(',').append(rsvp.getCreatedAt()).append('\n'); } return csv.toString().getBytes(StandardCharsets.UTF_8); }

    private AlumniEvent build(EventRequest request, User user, AlumniEvent existing) { AlumniEvent event = existing == null ? AlumniEvent.builder().createdBy(user).status(EventStatus.ACTIVE).build() : existing; copy(request, event, user); return event; }
    private void copy(EventRequest request, AlumniEvent event, User user) { Branch branch = request.getVisibility() == EventVisibility.ALL ? null : request.getBranch(); if (user.getBranch() != null && request.getVisibility() == EventVisibility.BRANCH) branch = user.getBranch(); if (request.getVisibility() == EventVisibility.BRANCH && branch == null) throw new InvalidRequestException("Branch is required for a branch event."); event.setTitle(request.getTitle()); event.setDescription(request.getDescription()); event.setEventDateTime(request.getEventDateTime()); event.setVenue(request.getVenue()); event.setVisibility(request.getVisibility()); event.setBranch(branch); }
    private AlumniEvent findManageable(UUID id, User user) { validateAdmin(user); AlumniEvent event = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event not found.")); if (user.getBranch() != null && !event.getCreatedBy().getId().equals(user.getId())) throw new AccessDeniedException("You are not authorized to manage this event."); return event; }
    private AlumniEvent findRsvpEligibleEvent(UUID id, User user) { validateAlumni(user); AlumniEvent event = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event not found.")); if (event.getStatus() != EventStatus.ACTIVE || event.getEventDateTime().isBefore(LocalDateTime.now()) || (event.getVisibility() != EventVisibility.ALL && event.getBranch() != user.getBranch())) throw new AccessDeniedException("You are not authorized to RSVP to this event."); return event; }
    private AlumniEvent findAlumniReadableEvent(UUID id, User user) { validateAlumni(user); AlumniEvent event = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event not found.")); boolean visibleUpcoming = event.getStatus() == EventStatus.ACTIVE && event.getVisibility() == EventVisibility.ALL || event.getStatus() == EventStatus.ACTIVE && event.getVisibility() == EventVisibility.BRANCH && event.getBranch() == user.getBranch(); boolean joinedCompleted = event.getStatus() == EventStatus.COMPLETED && rsvpRepository.existsByEventAndAlumniUser(event, user); if (!visibleUpcoming && !joinedCompleted) throw new AccessDeniedException("You are not authorized to view this event."); return event; }
    @Scheduled(fixedRate = 60000) @Transactional public void markElapsedEventsCompleted() { repository.markElapsedEventsCompleted(LocalDateTime.now()); }
    private void validateAdmin(User user) { if (user.getRole() != Role.ADMIN) throw new AccessDeniedException("Only admins can manage events."); }
    private void validateAlumni(User user) { if (user.getRole() != Role.ALUMNI) throw new AccessDeniedException("Only alumni can use event RSVPs."); }
    private EventResponse map(AlumniEvent event, User alumniUser) { return EventResponse.builder().id(event.getId()).title(event.getTitle()).description(event.getDescription()).eventDateTime(event.getEventDateTime()).venue(event.getVenue()).branch(event.getBranch()).visibility(event.getVisibility()).status(event.getStatus()).createdBy(event.getCreatedBy().getId()).attendeeCount(alumniUser == null ? rsvpRepository.countByEvent(event) : null).rsvped(alumniUser != null && rsvpRepository.existsByEventAndAlumniUser(event, alumniUser)).build(); }
    private EventResponse publicMap(AlumniEvent event) { return EventResponse.builder().id(event.getId()).title(event.getTitle()).description(event.getDescription()).eventDateTime(event.getEventDateTime()).venue(event.getVenue()).visibility(event.getVisibility()).status(event.getStatus()).createdBy(event.getCreatedBy().getId()).build(); }
    private EventAttendeeResponse attendeeMap(EventRsvp rsvp) { Alumni alumni = alumniRepository.findByUser(rsvp.getAlumniUser()).orElseThrow(() -> new ResourceNotFoundException("Alumni profile not found.")); return EventAttendeeResponse.builder().alumniId(alumni.getId()).name(String.join(" ", alumni.getFirstName(), alumni.getMiddleName() == null ? "" : alumni.getMiddleName(), alumni.getLastName()).replaceAll("\\s+", " ").trim()).email(alumni.getUser().getEmail()).branch(alumni.getBranch()).passoutYear(alumni.getPassoutYear()).rsvpedAt(rsvp.getCreatedAt()).build(); }
    private String csvValue(String value) { return "\"" + value.replace("\"", "\"\"") + "\""; }
}
