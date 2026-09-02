package com.kjalumni.event.dto;

import com.kjalumni.common.enums.Branch;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Builder @AllArgsConstructor @NoArgsConstructor
public class EventAttendeeResponse {
    private UUID alumniId;
    private String name;
    private String email;
    private Branch branch;
    private Integer passoutYear;
    private LocalDateTime rsvpedAt;
}
