package com.kjalumni.event.entity;

import com.kjalumni.auth.entity.User;
import com.kjalumni.common.entity.BaseEntity;
import com.kjalumni.common.enums.Branch;
import com.kjalumni.common.enums.EventStatus;
import com.kjalumni.common.enums.EventVisibility;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name = "alumni_events") @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AlumniEvent extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, length = 180) private String title;
    @Column(nullable = false, columnDefinition = "TEXT") private String description;
    @Column(nullable = false) private LocalDateTime eventDateTime;
    @Column(nullable = false, length = 255) private String venue;
    @Enumerated(EnumType.STRING) @Column(length = 20) private Branch branch;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private EventVisibility visibility;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private EventStatus status;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "created_by", nullable = false) private User createdBy;
}
