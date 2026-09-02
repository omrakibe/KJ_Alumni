package com.kjalumni.event.entity;

import com.kjalumni.auth.entity.User;
import com.kjalumni.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "event_rsvps", uniqueConstraints = @UniqueConstraint(name = "uk_event_rsvp_event_user", columnNames = {"event_id", "alumni_user_id"}))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class EventRsvp extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "event_id", nullable = false) private AlumniEvent event;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "alumni_user_id", nullable = false) private User alumniUser;
}
