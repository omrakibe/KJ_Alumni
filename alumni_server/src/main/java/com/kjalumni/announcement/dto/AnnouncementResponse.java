package com.kjalumni.announcement.dto;
import com.kjalumni.common.enums.*; import lombok.*; import java.time.LocalDateTime; import java.util.UUID;
@Getter @Builder @AllArgsConstructor @NoArgsConstructor public class AnnouncementResponse { private UUID id; private String title; private String message; private EventVisibility visibility; private Branch branch; private AnnouncementPriority priority; private AnnouncementStatus status; private LocalDateTime createdAt; private UUID createdBy; private String createdByEmail; }
