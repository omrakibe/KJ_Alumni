package com.kjalumni.event.repository;

import com.kjalumni.auth.entity.User;
import com.kjalumni.event.entity.AlumniEvent;
import com.kjalumni.event.entity.EventRsvp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface EventRsvpRepository extends JpaRepository<EventRsvp, UUID> {
    long countByEvent(AlumniEvent event);
    boolean existsByEventAndAlumniUser(AlumniEvent event, User alumniUser);
    Optional<EventRsvp> findByEventAndAlumniUser(AlumniEvent event, User alumniUser);
    Page<EventRsvp> findByEventOrderByCreatedAtAsc(AlumniEvent event, Pageable pageable);
    List<EventRsvp> findByEvent(AlumniEvent event);
}
