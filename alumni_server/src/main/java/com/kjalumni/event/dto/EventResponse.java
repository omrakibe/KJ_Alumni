package com.kjalumni.event.dto;
import com.kjalumni.common.enums.*; import lombok.*; import java.time.LocalDateTime; import java.util.UUID;
@Getter @Builder @AllArgsConstructor @NoArgsConstructor public class EventResponse {
 private UUID id; private String title; private String description; private LocalDateTime eventDateTime; private String venue; private Branch branch; private EventVisibility visibility; private EventStatus status; private UUID createdBy; private Long attendeeCount; private boolean rsvped;
}
