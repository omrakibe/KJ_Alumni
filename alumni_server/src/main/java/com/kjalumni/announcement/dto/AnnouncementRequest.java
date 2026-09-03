package com.kjalumni.announcement.dto;
import com.kjalumni.common.enums.*; import jakarta.validation.constraints.*; import lombok.*;
@Getter @Setter public class AnnouncementRequest { @NotBlank @Size(max=180) private String title; @NotBlank @Size(max=5000) private String message; @NotNull private EventVisibility visibility; private Branch branch; @NotNull private AnnouncementPriority priority; }
