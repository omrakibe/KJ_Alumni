package com.kjalumni.event.repository;
import com.kjalumni.event.entity.AlumniEvent;
import com.kjalumni.auth.entity.User;
import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.EventStatus;
import com.kjalumni.common.enums.EventVisibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import java.util.UUID;
import java.time.LocalDateTime;
public interface AlumniEventRepository extends JpaRepository<AlumniEvent, UUID> {
    Page<AlumniEvent> findByCreatedByOrderByEventDateTimeAsc(User user, Pageable pageable);
    Page<AlumniEvent> findByStatusOrderByEventDateTimeAsc(EventStatus status, Pageable pageable);
    Page<AlumniEvent> findByStatusAndVisibilityOrderByEventDateTimeAsc(EventStatus status, EventVisibility visibility, Pageable pageable);
    Page<AlumniEvent> findByStatusAndEventDateTimeGreaterThanEqualOrderByEventDateTimeAsc(EventStatus status, LocalDateTime from, Pageable pageable);
    Page<AlumniEvent> findByStatusAndEventDateTimeLessThanOrderByEventDateTimeDesc(EventStatus status, LocalDateTime before, Pageable pageable);
    Page<AlumniEvent> findByCreatedByAndStatusAndEventDateTimeGreaterThanEqualOrderByEventDateTimeAsc(User user, EventStatus status, LocalDateTime from, Pageable pageable);
    Page<AlumniEvent> findByCreatedByAndStatusAndEventDateTimeLessThanOrderByEventDateTimeDesc(User user, EventStatus status, LocalDateTime before, Pageable pageable);
    @Query("select e from AlumniEvent e where e.status = :status and (e.visibility = com.kjalumni.common.enums.EventVisibility.ALL or e.branch = :branch) order by e.eventDateTime asc")
    Page<AlumniEvent> findVisibleToBranch(Branch branch, EventStatus status, Pageable pageable);
    @Query("select e from AlumniEvent e where e.status = :status and e.eventDateTime >= :now and (e.visibility = com.kjalumni.common.enums.EventVisibility.ALL or e.branch = :branch) order by e.eventDateTime asc")
    Page<AlumniEvent> findUpcomingVisibleToBranch(Branch branch, EventStatus status, LocalDateTime now, Pageable pageable);
    @Query("select e from AlumniEvent e join EventRsvp r on r.event = e where r.alumniUser = :user and e.status = :status and e.eventDateTime < :now order by e.eventDateTime desc")
    Page<AlumniEvent> findPastRsvpedByUser(User user, EventStatus status, LocalDateTime now, Pageable pageable);
    @Modifying
    @Query("update AlumniEvent e set e.status = com.kjalumni.common.enums.EventStatus.COMPLETED where e.status = com.kjalumni.common.enums.EventStatus.ACTIVE and e.eventDateTime < :now")
    int markElapsedEventsCompleted(LocalDateTime now);
}
